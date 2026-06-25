// ========================================
// IKIP Universal Ingestion (PDF text + Vision OCR / P&ID)
// ========================================
// Turns heterogeneous uploads into plain Markdown that the entity parser and
// the vector retriever already understand. Three paths:
//   • .md / .txt        → passed through as-is
//   • digital .pdf      → pdf-parse text extraction (offline, no API)
//   • image / scanned   → Claude vision OCR + drawing digitisation (P&IDs)
// The image path needs an Anthropic key; everything else is fully offline.

import path from 'path';
import { PDFParse } from 'pdf-parse';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const IMAGE_MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif'
};

// Below this many characters a "PDF" is almost certainly a scan/drawing with no
// embedded text layer — route it to vision OCR instead of trusting pdf-parse.
const MIN_PDF_TEXT = 40;

// Extract embedded text from a digital PDF buffer. Returns null if the PDF has
// no real text layer (scanned), signalling the caller to fall back to OCR.
async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const data = await parser.getText();
    const text = (data.text || '').trim();
    return text.length < MIN_PDF_TEXT ? null : text;
  } finally {
    await parser.destroy();
  }
}

// OCR an image (or rasterised drawing) with Claude vision. For P&IDs/engineering
// drawings it also digitises equipment tags and connections into readable text.
async function visionExtract(buffer, mime, anthropic, hintName = '') {
  if (!anthropic) {
    throw new Error('OCR_NO_KEY'); // no Anthropic key configured
  }
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const msg = await anthropic.messages.create({
    model,
    max_tokens: 1500,
    system:
      'You are an industrial document digitiser for a refinery knowledge base. ' +
      'Transcribe the supplied scan or engineering drawing (P&ID) into clean Markdown. ' +
      'Preserve every equipment tag (e.g. E-101, GT-101, TK-15, P-205), instrument tag, ' +
      'regulation code (OISD-STD-118, ISO 10816, ASME), process parameter with units, ' +
      'personnel name and date exactly as written. For drawings, also list the connections ' +
      'between tagged items as bullet points. Output Markdown only, no commentary.',
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mime, data: buffer.toString('base64') } },
        { type: 'text', text: `Digitise this document${hintName ? ` (filename: ${hintName})` : ''}.` }
      ]
    }]
  });
  return msg.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim();
}

// Main entry: given an uploaded buffer + original filename, return
// { markdown, method } where method describes how text was recovered.
export async function ingestBuffer(buffer, originalName, anthropic) {
  const ext = path.extname(originalName).toLowerCase();
  const baseTitle = path.basename(originalName, ext);

  if (ext === '.md' || ext === '.txt') {
    return { markdown: buffer.toString('utf-8'), method: 'text' };
  }

  if (ext === '.pdf') {
    const text = await extractPdfText(buffer);
    if (text) {
      return { markdown: ensureTitle(text, baseTitle), method: 'pdf-text' };
    }
    // Scanned PDF with no text layer — needs rasterisation before OCR, which we
    // don't bundle. Report clearly rather than silently producing an empty doc.
    if (!anthropic) throw new Error('PDF_SCANNED_NO_OCR');
    throw new Error('PDF_SCANNED_NEEDS_RASTER');
  }

  if (IMAGE_EXTS.has(ext)) {
    const mime = IMAGE_MIME[ext];
    const md = await visionExtract(buffer, mime, anthropic, originalName);
    return { markdown: ensureTitle(md, baseTitle), method: 'vision-ocr' };
  }

  throw new Error(`UNSUPPORTED_TYPE:${ext || 'unknown'}`);
}

// Guarantee a Markdown H1 title so the parser/retriever pick up a document name.
function ensureTitle(text, fallbackTitle) {
  if (/^\s*#/.test(text)) return text;
  return `# ${fallbackTitle}\n\n${text}`;
}

export { IMAGE_EXTS };
