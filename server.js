// ========================================
// IKIP Backend Server (Live Corpus & Computed RAG)
// ========================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseDocument } from './server/parser.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini API client if key is present
const geminiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (geminiKey) {
  console.log('✓ GEMINI_API_KEY found. LLM integration active.');
  genAI = new GoogleGenerativeAI(geminiKey);
} else {
  console.warn('⚠️ No GEMINI_API_KEY found in environment. Copilot will run in simulated mode.');
}

// Stopwords list for search query tokenization
const stopwords = new Set([
  'what', 'is', 'the', 'of', 'and', 'a', 'to', 'in', 'on', 'for', 'with', 'at', 'by', 'an', 'be', 'this', 'that', 'from', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'about', 'into', 'through', 'over', 'after', 'before', 'should', 'would', 'could', 'how', 'why', 'where', 'when', 'who', 'which', 'about', 'details', 'history', 'limit', 'limits', 'exchanger', 'turbine', 'tank'
]);

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

// 1. Endpoint: Get dynamic unified D3 Knowledge Graph parsed from ALL corpus files
app.get('/api/graph', (req, res) => {
  try {
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

// 2. Endpoint: Computed RAG Copilot Chat Q&A
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message query is required' });
  }

  try {
    const files = getCorpusFiles();
    
    // 1. Query tokenization & processing
    const queryTerms = message.toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove punctuation
      .split(/\s+/)
      .filter(term => term.length > 2 && !stopwords.has(term));

    console.log(`Processing search query: "${message}" -> terms:`, queryTerms);

    // 2. Compute similarity overlap score for each document in the corpus
    const scoredDocs = [];

    files.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lowerContent = content.toLowerCase();
      
      let matchedTermsCount = 0;
      queryTerms.forEach(term => {
        if (lowerContent.includes(term)) {
          matchedTermsCount++;
        }
      });

      // Score: fraction of query terms matched in document
      const score = queryTerms.length > 0 ? (matchedTermsCount / queryTerms.length) : 0;
      
      // Parse document title from first header line
      const titleLine = content.split('\n')[0].replace(/^#+\s*/, '') || path.basename(filePath);

      scoredDocs.push({
        path: filePath,
        name: titleLine,
        content: content,
        score: score
      });
    });

    // 3. Sort by score descending and retrieve matching documents
    const matchedDocs = scoredDocs
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score);

    // Determine RAG context (use matched documents, or fallback to all files as broad context if score is 0)
    let retrievedContext = '';
    let citations = [];

    if (matchedDocs.length > 0) {
      retrievedContext = matchedDocs.map(doc => `[Source: ${doc.name}]\n${doc.content}`).join('\n\n');
      citations = matchedDocs.map(doc => {
        // Calculate confidence percentage dynamically based on match score
        const confidence = Math.round(72 + 27 * doc.score); // returns value between 72% and 99%
        return {
          name: doc.name,
          type: doc.name.includes('Log') ? 'Maintenance Log' : doc.name.includes('Report') ? 'Incident Report' : 'Regulatory Standard',
          confidence: Math.min(confidence, 99),
          format: 'pdf'
        };
      });
    } else {
      // Fallback context: merge all files
      retrievedContext = scoredDocs.map(doc => `[Source: ${doc.name}]\n${doc.content}`).join('\n\n');
      citations = [{
        name: 'OISD-STD-118 Excerpt Layout Standard',
        type: 'Regulatory Standard',
        confidence: 70,
        format: 'pdf'
      }];
    }

    // 4. Generate response (Gemini API or simulation fallback)
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
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

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

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

      res.json({ answer, sources: citations, followups });
    } else {
      // Simulation Fallback Mode using retrieved context heuristics
      console.log('Running chat in simulated mode...');
      
      const qNorm = message.toLowerCase();
      let answer = '';
      let followups = [];

      if (qNorm.includes('e-101') || qNorm.includes('exchanger')) {
        answer = `According to the **OISD-STD-118-EX-2024** safety guidelines, **Heat Exchanger E-101** operates at **350°C** crude inlet temperature under a design pressure of **2.5 kg/cm²**. 
                  
• **History:** Tube hydrojet cleaning was completed on Jan 8, 2025 (WO-2025-0142) by technician D. Singh. Under-deposit corrosion was noted at the shell inlet.
• **Safety Limit:** Minimum tube wall thickness must not drop below **2.0mm** (nominal is 2.77mm).`;
        followups = ['Who reviewed E-101 layout standard?', 'What is the ESD temperature threshold?'];
      } else if (qNorm.includes('vibration') || qNorm.includes('gt-101') || qNorm.includes('turbine')) {
        answer = `The **Gas Turbine GT-101** operates at **3,000 RPM**. The condition monitoring report dated March 18, 2025 shows:
                  
• **1X Vibration:** 2.8 mm/s (bearing #1 horizontal), which exceeds the **ISO 10816-3** normal zone limit (<2.5 mm/s) and is trending towards the **Alert Zone** (4.5 mm/s).
• **Bearing #1 Temp:** 82°C (trending up towards the limit of **95°C**).
• **Action:** Spares have a 6-week lead time. Spares must be ordered and bearing replacement scheduled for May 2025 turnaround.`;
        followups = ['What is the ISO alert zone for GT-101?', 'Who logged the GT-101 vibration data?'];
      } else if (qNorm.includes('fire') || qNorm.includes('tk-15') || qNorm.includes('tank')) {
        answer = `The incident report for storage tank **TK-15** floating roof seal fire (INC-2024-008) lists the following root causes:
                  
• **Flow Velocity:** Flow rate was 1.5 m/s, which exceeded the safety velocity limit of **1.2 m/s**.
• **Static Discharge:** High velocity generated static accumulation, combined with corroded earthing cable connection and minor vapor gaps at primary seals.
• **CAPA:** Grounding replacement completed. Automatic flow limiter installed to restrict flow below **1.2 m/s** (Owner: D. Singh).`;
        followups = ['What is the flow rate safety limit of TK-15?', 'What compliance standard was violated?'];
      } else if (qNorm.includes('shutdown') || qNorm.includes('emergency') || qNorm.includes('esd')) {
        answer = `In case of emergency shutdown (ESD) at **CDU-1** (such as temperatures exceeding **375°C** at E-101 inlet):
                  
1. **Feed Isolation:** Activate Emergency Shutdown Valve **ESDV-101**.
2. **Pressure Relief:** Divert process stream to the Flare System (**Flare-1**) via Knockout Drum (**KO-Drum-1**).
3. **Fire Deluge:** Engage the water deluge system (**FF-System-2**) if flame alarms trigger.`;
        followups = ['What is the ESD temperature threshold?', 'Where is the flare system layout?'];
      } else {
        answer = `I am currently running in simulated mode. Based on the retrieved corpus context:
                  
• The refinery operates under **OISD-STD-118** layout and safety rules.
• Critical monitored assets include **E-101** (Heat Exchanger), **T-101** (Atmospheric Column), and **GT-101** (Gas Turbine).
• Recent incident log exists for **TK-15** primary roof seal fire.
                  
*Tip: Configure your Gemini API Key in the server .env file to enable live LLM question answering.*`;
        followups = ['What is the maintenance history of heat exchanger E-101?', 'What is the emergency shutdown procedure?'];
      }

      res.json({ answer, sources: citations, followups });
    }
  } catch (err) {
    console.error('Error answering chat:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`===================================================`);
  console.log(`IKIP Backend Server running on http://localhost:${port}`);
  console.log(`===================================================`);
});
