// ========================================
// IKIP Backend Server (Live Corpus & Computed RAG)
// ========================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { parseDocument } from './server/parser.js';
import { buildIndex, retrieve } from './server/retriever.js';
import { ingestBuffer } from './server/ingest.js';
import { computeInsights } from './server/insights.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
// Allow larger bodies for base64-encoded PDF / image uploads.
app.use(express.json({ limit: '25mb' }));

// ----------------------------------------------------------------------------
// LLM providers. The copilot tries them in order and falls back gracefully, so
// a single provider's quota/outage no longer drops the demo to canned answers.
//   1. Gemini (GEMINI_API_KEY)   2. Claude (ANTHROPIC_API_KEY)   3. simulation
// Claude also powers the vision OCR / P&ID ingestion path.
// ----------------------------------------------------------------------------
const geminiKey = process.env.GEMINI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;
const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;

const primaryProvider = anthropic ? 'Claude' : genAI ? 'Gemini' : 'simulation';
console.log(`✓ LLM providers: Claude ${anthropicKey ? 'ON' : 'off'} | Gemini ${geminiKey ? 'ON' : 'off'} → primary: ${primaryProvider}`);
if (!genAI && !anthropic) {
  console.warn('⚠️ No LLM key found. Copilot will run in simulated fallback mode.');
}

// Default Claude model. Opus 4.8 is the most capable Opus-tier model; override
// via ANTHROPIC_MODEL (e.g. claude-sonnet-4-6 for higher-volume/lower-cost).
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

async function callClaude(prompt) {
  const msg = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });
  const answer = msg.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim();
  return { answer, provider: CLAUDE_MODEL };
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  return { answer: result.response.text(), provider: 'gemini-2.0-flash' };
}

// Generate an answer from the retrieved RAG context, trying each available
// provider in turn. Claude is preferred when configured (this is the primary
// copilot engine); Gemini is the fallback. Returns null if every provider
// fails, and the caller then uses the deterministic simulation.
async function generateAnswer(prompt) {
  const providers = [];
  if (anthropic) providers.push(['Claude', callClaude]);
  if (genAI) providers.push(['Gemini', callGemini]);

  for (let i = 0; i < providers.length; i++) {
    const [label, call] = providers[i];
    try {
      return await call(prompt);
    } catch (err) {
      const next = i + 1 < providers.length ? `trying ${providers[i + 1][0]}` : 'falling back to simulation';
      console.warn(`⚠️ ${label} failed, ${next}:`, err.status || err.message);
    }
  }
  return null;
}

// Helper: Scan documents-raw directory
function getCorpusFiles() {
  const dirPath = path.resolve('./documents-raw');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') || file.endsWith('.txt'))
    .map(file => path.join(dirPath, file));
}

let _indexCache = null;
let _indexedAt = 0;

function getIndex(files) {
  const mtime = Math.max(...files.map(f => fs.statSync(f).mtimeMs), 0);
  if (!_indexCache || mtime > _indexedAt) {
    _indexCache = buildIndex(files);
    _indexedAt = mtime || Date.now();
  }
  return _indexCache;
}

// 0. Endpoint: Observability-aware stats return
app.get('/api/stats', (req, res) => {
  try {
    const files = getCorpusFiles();
    getIndex(files); // ensure index is initialized to set _indexedAt
    res.json({
      documentCount: files.length,
      indexedAt: new Date(_indexedAt).toISOString(),
      corpusSizeKB: Math.round((files.reduce((s, f) => s + fs.statSync(f).size, 0) / 1024) * 100) / 100
    });
  } catch (err) {
    console.error('Error fetching corpus stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// 1. Endpoint: Get dynamic unified D3 Knowledge Graph parsed from ALL corpus files
app.get('/api/graph', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60');
    const files = getCorpusFiles();
    const allNodesMap = new Map();
    const allLinks = [];
    let mergedNodeTypeConfig = {};

    files.forEach(filePath => {
      const { nodes, links, nodeTypeConfig } = parseDocument(filePath);
      
      // Save config
      mergedNodeTypeConfig = { ...mergedNodeTypeConfig, ...nodeTypeConfig };

      // Merge nodes
      nodes.forEach(node => {
        if (!allNodesMap.has(node.id)) {
          allNodesMap.set(node.id, node);
        } else {
          // Merge properties if duplicate
          const existing = allNodesMap.get(node.id);
          allNodesMap.set(node.id, { ...existing, ...node });
        }
      });

      // Merge links
      links.forEach(link => {
        const exists = allLinks.some(l => 
          l.source === link.source && 
          l.target === link.target && 
          l.type === link.type
        );
        if (!exists) {
          allLinks.push(link);
        }
      });
    });

    res.json({
      nodes: Array.from(allNodesMap.values()),
      links: allLinks,
      nodeTypeConfig: mergedNodeTypeConfig
    });
  } catch (err) {
    console.error('Error generating graph:', err);
    res.status(500).json({ error: err.message });
  }
});

// Map ingestion error codes to friendly, actionable messages.
const INGEST_ERRORS = {
  PDF_SCANNED_NO_OCR: 'This PDF appears to be a scan with no text layer. Set ANTHROPIC_API_KEY to enable vision OCR.',
  PDF_SCANNED_NEEDS_RASTER: 'Scanned PDF detected. Re-upload the page as a PNG/JPG image to run vision OCR.',
  OCR_NO_KEY: 'Image OCR requires an Anthropic API key. Set ANTHROPIC_API_KEY to enable it.'
};

// 4. Endpoint: Corpus-derived insights for the Maintenance / Compliance /
//    Failure pages — equipment health, regulatory coverage, gaps, incidents.
app.get('/api/insights', (req, res) => {
  try {
    res.json(computeInsights(getCorpusFiles()));
  } catch (err) {
    console.error('Error computing insights:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Endpoint: Upload document to corpus.
// Accepts either { name, content } (plain text/markdown) or
// { name, contentBase64 } (binary PDF/image → extracted via the ingest pipeline).
app.post('/api/upload', async (req, res) => {
  try {
    const { name, content, contentBase64 } = req.body;
    if (!name || (!content && !contentBase64)) {
      return res.status(400).json({ error: 'Filename (name) and content or contentBase64 are required.' });
    }

    // Run heterogeneous inputs through the ingestion pipeline to obtain Markdown.
    let markdown;
    let method = 'text';
    try {
      if (contentBase64) {
        const buffer = Buffer.from(contentBase64, 'base64');
        ({ markdown, method } = await ingestBuffer(buffer, name, anthropic));
      } else {
        markdown = content;
      }
    } catch (ingestErr) {
      const code = ingestErr.message.split(':')[0];
      const friendly = INGEST_ERRORS[code] || `Could not ingest file: ${ingestErr.message}`;
      console.warn('⚠️ Ingestion failed:', ingestErr.message);
      return res.status(422).json({ error: friendly, code });
    }

    // Sanitize filename to prevent directory traversal; corpus is always Markdown.
    const safeName = path.basename(name);
    let finalName = safeName;
    if (!safeName.endsWith('.md') && !safeName.endsWith('.txt')) {
      finalName = safeName.replace(/\.[^/.]+$/, "") + '.md';
    }

    const dirPath = path.resolve('./documents-raw');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, finalName);
    fs.writeFileSync(filePath, markdown, 'utf-8');

    console.log(`✓ Document ingested (${method}) and saved to corpus: ${finalName}`);

    // Parse the newly uploaded document dynamically
    const { nodes } = parseDocument(filePath);
    const entities = {
      equipment: nodes.filter(n => n.type === 'equipment').map(n => n.id),
      parameters: nodes.filter(n => n.type === 'parameter').map(n => n.id),
      regulations: nodes.filter(n => n.type === 'regulation').map(n => n.id),
      personnel: nodes.filter(n => n.type === 'personnel').map(n => n.id),
      dates: [new Date().toISOString().split('T')[0]] // default current date
    };

    res.json({ success: true, filename: finalName, method, entities });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Endpoint: Computed RAG Copilot Chat Q&A
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message query is required' });
  }

  try {
    const files = getCorpusFiles();

    // 1. Build or retrieve the cached TF-IDF vector index over the live corpus and rank documents
    //    by cosine similarity (chunk-level, IDF-weighted, top-K). This replaces
    //    the old binary keyword-overlap scorer.
    const index = getIndex(files);
    const matchedDocs = retrieve(message, index, { topK: 5, floor: 0.04 });

    console.log(`Vector retrieval for "${message}" -> ${matchedDocs.length} docs (top score ${matchedDocs[0]?.score.toFixed(3) || 'n/a'})`);

    const topScore = matchedDocs[0]?.score || 1;

    // Determine RAG context (use retrieved chunks, or fall back to broad context).
    let retrievedContext = '';
    let citations = [];

    if (matchedDocs.length > 0) {
      // Tight context: only the strongest chunks from the top documents.
      retrievedContext = matchedDocs
        .map(doc => `[Source: ${doc.docName}]\n${doc.snippets.map(s => s.text).join('\n')}`)
        .join('\n\n');
      citations = matchedDocs.map(doc => {
        // Confidence derived from cosine similarity, scaled relative to the best
        // match so the lead source reads ~99% and weaker matches taper honestly.
        const rel = topScore > 0 ? doc.score / topScore : 0;
        const confidence = Math.round(60 + 39 * rel); // 60%..99%

        let type = 'Regulatory Standard';
        const nameLower = doc.docName.toLowerCase();
        if (nameLower.includes('maintenance') || nameLower.includes('log') || nameLower.includes('work order') || nameLower.includes('wo-e101')) {
          type = 'Maintenance Record';
        } else if (nameLower.includes('compliance') || nameLower.includes('cpcb') || nameLower.includes('peso') || nameLower.includes('dgfasli') || nameLower.includes('regulatory')) {
          type = 'Regulatory Compliance';
        } else if (nameLower.includes('sop') || nameLower.includes('procedure')) {
          type = 'Standard Operating Procedure';
        } else if (nameLower.includes('hira') || nameLower.includes('hazard')) {
          type = 'Hazard Risk Assessment';
        } else if (nameLower.includes('oem') || nameLower.includes('spec')) {
          type = 'OEM Technical Specification';
        } else if (nameLower.includes('incident') || nameLower.includes('fire')) {
          type = 'Incident Investigation';
        } else if (nameLower.includes('turnaround') || nameLower.includes('schedule')) {
          type = 'Turnaround Operations';
        }

        return {
          name: doc.docName,
          type: type,
          confidence: Math.min(confidence, 99),
          format: 'pdf'
        };
      });
    } else {
      // Fallback context: no chunk cleared the relevance floor, so supply the
      // full corpus as broad context and flag low-confidence generic sources.
      retrievedContext = files
        .map(fp => `[Source: ${path.basename(fp)}]\n${fs.readFileSync(fp, 'utf-8')}`)
        .join('\n\n');
      citations = [
        { name: 'OISD-STD-118 Excerpt Layout Standard', type: 'Regulatory Compliance', confidence: 70, format: 'pdf' },
        { name: 'Maintenance WO - E-101 Tube Bundle', type: 'Maintenance Record', confidence: 65, format: 'pdf' }
      ];
    }

    // Calculate cross-functional discovery metric
    const uniqueTypes = Array.from(new Set(citations.map(c => c.type)));
    const discovery = uniqueTypes.length > 1
      ? `Cross-functional Discovery: Connected ${uniqueTypes.length} document types (${uniqueTypes.join(' + ')})`
      : `Domain Lookup: Connected to ${citations[0]?.type || 'Refinery Repository'}`;

    // 4. Generate response — try each LLM provider, else deterministic simulation.
    const prompt = `
You are the IKIP Expert Copilot, an AI safety and operations assistant for industrial assets.
You have access to the following reference documents context retrieved from the refinery repository:
---
${retrievedContext}
---

Answer the user's question: "${message}"

Rules:
1. Be technical, direct, and concise. Keep answers under 3-4 short paragraphs.
2. Rely strictly on the facts present in the retrieved context above. Do not hallucinate.
3. Format lists with bullet points (•) and use double asterisks (**) for bolding. Do NOT use markdown header tags (# or ##).
4. If the answer is not found in the provided context, state that clearly and offer general refinery safety advice.
        `;

    const generated = await generateAnswer(prompt);

    if (generated) {
      const { answer, provider } = generated;
      console.log(`✓ Answer generated by ${provider}`);

      // Generate follow-ups based on mentioned terms
      const followups = [];
      const lowerAnswer = answer.toLowerCase();
      if (lowerAnswer.includes('e-101')) {
        followups.push('What are the safety limits of Heat Exchanger E-101?', 'Who reviewed E-101 design spec?');
      }
      if (lowerAnswer.includes('gt-101') || lowerAnswer.includes('vibration')) {
        followups.push('What is the ISO limit for GT-101 vibration?', 'What is the speed of GT-101?');
      }
      if (lowerAnswer.includes('tk-15') || lowerAnswer.includes('fire')) {
        followups.push('What caused the floating roof fire at TK-15?', 'What is the safety flow rate for TK-15?');
      }
      if (followups.length < 2) {
        followups.push('What is the emergency shutdown procedure?', 'List compliance standards for CDU-1');
      }

      res.json({ answer, sources: citations, followups, discovery, provider });
    } else {
      runSimulationChat(message, citations, [], discovery, res);
    }
  } catch (err) {
    console.error('Error answering chat:', err);
    res.status(500).json({ error: err.message });
  }
});

// Simulation Fallback Helper Function
function runSimulationChat(message, citations, followups, discovery, res) {
  console.log('Running chat in simulated fallback mode...');
  
  const qNorm = message.toLowerCase();
  let answer = '';
  let responseFollowups = followups && followups.length > 0 ? followups : [];

  if (qNorm.includes('e-101') || qNorm.includes('exchanger')) {
    answer = `According to the **OISD-STD-118-EX-2024** safety guidelines, **Heat Exchanger E-101** operates at **350°C** crude inlet temperature under a design pressure of **2.5 kg/cm²**. 
              
• **History:** Tube hydrojet cleaning was completed on Jan 8, 2025 (WO-2025-0142) by technician D. Singh. Under-deposit corrosion was noted at the shell inlet.
• **Safety Limit:** Minimum tube wall thickness must not drop below **2.0mm** (nominal is 2.77mm).`;
    responseFollowups = ['Who reviewed E-101 layout standard?', 'What is the ESD temperature threshold?'];
  } else if (qNorm.includes('vibration') || qNorm.includes('gt-101') || qNorm.includes('turbine')) {
    answer = `The **Gas Turbine GT-101** operates at **3,000 RPM**. The condition monitoring report dated March 18, 2025 shows:
              
• **1X Vibration:** 2.8 mm/s (bearing #1 horizontal), which exceeds the **ISO 10816-3** normal zone limit (<2.5 mm/s) and is trending towards the **Alert Zone** (4.5 mm/s).
• **Bearing #1 Temp:** 82°C (trending up towards the limit of **95°C**).
• **Action:** Spares have a 6-week lead time. Spares must be ordered and bearing replacement scheduled for May 2025 turnaround.`;
    responseFollowups = ['What is the ISO alert zone for GT-101?', 'Who logged the GT-101 vibration data?'];
  } else if (qNorm.includes('fire') || qNorm.includes('tk-15') || qNorm.includes('tank')) {
    answer = `The incident report for storage tank **TK-15** floating roof seal fire (INC-2024-008) lists the following root causes:
              
• **Flow Velocity:** Flow rate was 1.5 m/s, which exceeded the safety velocity limit of **1.2 m/s**.
• **Static Discharge:** High velocity generated static accumulation, combined with corroded earthing cable connection and minor vapor gaps at primary seals.
• **CAPA:** Grounding replacement completed. Automatic flow limiter installed to restrict flow below **1.2 m/s** (Owner: D. Singh).`;
    responseFollowups = ['What is the flow rate safety limit of TK-15?', 'What compliance standard was violated?'];
  } else if (qNorm.includes('shutdown') || qNorm.includes('emergency') || qNorm.includes('esd')) {
    answer = `In case of emergency shutdown (ESD) at **CDU-1** (such as temperatures exceeding **375°C** at E-101 inlet):
              
1. **Feed Isolation:** Activate Emergency Shutdown Valve **ESDV-101**.
2. **Pressure Relief:** Divert process stream to the Flare System (**Flare-1**) via Knockout Drum (**KO-Drum-1**).
3. **Fire Deluge:** Engage the water deluge system (**FF-System-2**) if flame alarms trigger.`;
    responseFollowups = ['What is the ESD temperature threshold?', 'Where is the flare system layout?'];
  } else {
    answer = `Based on the retrieved corpus context:
              
• The refinery operates under **OISD-STD-118** layout and safety rules.
• Critical monitored assets include **E-101** (Heat Exchanger), **T-101** (Atmospheric Column), and **GT-101** (Gas Turbine).
• Recent incident log exists for **TK-15** primary roof seal fire.
              
*Tip: Configure your Gemini API Key in the server .env file to enable live LLM question answering.*`;
    responseFollowups = ['What is the maintenance history of heat exchanger E-101?', 'What is the emergency shutdown procedure?'];
  }

  res.json({ answer, sources: citations, followups: responseFollowups, discovery });
}

// Start Server
app.listen(port, () => {
  console.log(`===================================================`);
  console.log(`IKIP Backend Server running on http://localhost:${port}`);
  console.log(`===================================================`);
});
