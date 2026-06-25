// ========================================
// IKIP Vector Retriever (TF-IDF + Cosine Similarity)
// ========================================
// Replaces the previous binary keyword-overlap scorer with real
// vector-space retrieval: documents are split into chunks, each chunk is
// embedded as an L2-normalised TF-IDF vector, and queries are ranked by
// cosine similarity. This gives IDF-weighted relevance (rare domain tokens
// like "E-101" or "ISO 10816" dominate over common words), chunk-level
// precision, and honest top-K ranking instead of "every document at 99%".
//
// Pure JS, zero dependencies, fully offline — no API quota required. The
// interface is intentionally swappable: replace buildVector()/embed() with
// a neural embedding model (e.g. @xenova/transformers all-MiniLM) and the
// rest of the pipeline is unchanged.

import fs from 'fs';
import path from 'path';

const STOPWORDS = new Set([
  'what', 'is', 'the', 'of', 'and', 'a', 'to', 'in', 'on', 'for', 'with', 'at',
  'by', 'an', 'be', 'this', 'that', 'from', 'are', 'was', 'were', 'been', 'have',
  'has', 'had', 'do', 'does', 'did', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'about', 'into', 'through', 'over', 'after', 'before', 'should',
  'would', 'could', 'how', 'why', 'where', 'when', 'who', 'which', 'details', 'it',
  'its', 'their', 'they', 'we', 'you', 'our', 'per', 'not', 'all', 'any', 'me'
]);

// Tokenise text into normalised terms. Punctuation is stripped EXCEPT the
// hyphen, so equipment tags ("e-101", "gt-101", "iso-10816") survive intact.
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.replace(/^-+|-+$/g, '')) // trim stray leading/trailing hyphens
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

// Split a document into semantic chunks on Markdown horizontal rules / headings.
// Each chunk keeps the document title prepended so titles stay searchable.
function chunkDocument(content, title) {
  const blocks = content
    .split(/\n-{3,}\n|\n(?=#{1,6}\s)/g) // split on '---' rules or heading starts
    .map(b => b.trim())
    .filter(b => b.length > 0);

  // If the doc is tiny / unstructured, fall back to the whole document.
  const raw = blocks.length > 0 ? blocks : [content.trim()];
  return raw.map(text => `${title}\n${text}`);
}

// Build an in-memory TF-IDF index over every chunk in the corpus.
export function buildIndex(files) {
  const chunks = []; // { docPath, docName, text, tf:Map }
  const df = new Map(); // term -> number of chunks containing it

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const docName = content.split('\n')[0].replace(/^#+\s*/, '').trim() || path.basename(filePath);

    chunkDocument(content, docName).forEach(text => {
      const terms = tokenize(text);
      if (terms.length === 0) return;
      const tf = new Map();
      terms.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
      // document frequency: count each term once per chunk
      new Set(terms).forEach(t => df.set(t, (df.get(t) || 0) + 1));
      chunks.push({ docPath: filePath, docName, text, tf });
    });
  });

  const N = chunks.length || 1;
  const idf = new Map();
  df.forEach((freq, term) => {
    // smoothed IDF, always positive
    idf.set(term, Math.log((N + 1) / (freq + 1)) + 1);
  });

  // Precompute L2-normalised TF-IDF vectors for every chunk.
  chunks.forEach(chunk => {
    chunk.vec = buildVector(chunk.tf, idf);
  });

  return { chunks, idf };
}

// Turn a term-frequency map into an L2-normalised TF-IDF vector (Map term->weight).
function buildVector(tf, idf) {
  const vec = new Map();
  let norm = 0;
  tf.forEach((count, term) => {
    const weight = (1 + Math.log(count)) * (idf.get(term) || 0);
    if (weight > 0) {
      vec.set(term, weight);
      norm += weight * weight;
    }
  });
  norm = Math.sqrt(norm) || 1;
  vec.forEach((w, t) => vec.set(t, w / norm));
  return vec;
}

// Cosine similarity between two unit vectors == their dot product.
function cosine(a, b) {
  // iterate over the smaller vector for efficiency
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  small.forEach((w, t) => {
    const o = large.get(t);
    if (o) dot += w * o;
  });
  return dot;
}

// Retrieve the most relevant documents for a query.
// Returns { docName, docPath, score, snippets[] } sorted by relevance,
// limited to topK documents above the relevance floor.
export function retrieve(query, index, { topK = 5, floor = 0.04 } = {}) {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return [];

  const qTf = new Map();
  qTerms.forEach(t => qTf.set(t, (qTf.get(t) || 0) + 1));
  const qVec = buildVector(qTf, index.idf);

  // Score every chunk, then roll up to the best chunk per document.
  const perDoc = new Map(); // docPath -> { docName, score, snippets:[{text,score}] }
  index.chunks.forEach(chunk => {
    const sim = cosine(qVec, chunk.vec);
    if (sim <= 0) return;
    const cur = perDoc.get(chunk.docPath);
    if (!cur) {
      perDoc.set(chunk.docPath, {
        docName: chunk.docName,
        docPath: chunk.docPath,
        score: sim,
        snippets: [{ text: chunk.text, score: sim }]
      });
    } else {
      cur.score = Math.max(cur.score, sim);
      cur.snippets.push({ text: chunk.text, score: sim });
    }
  });

  const ranked = Array.from(perDoc.values())
    .filter(d => d.score >= floor)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Keep only the strongest chunks per doc for tight RAG context.
  ranked.forEach(d => {
    d.snippets = d.snippets.sort((a, b) => b.score - a.score).slice(0, 2);
  });

  return ranked;
}
