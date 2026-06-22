// ========================================
// IKIP Backend Server
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

// 1. Endpoint: Get dynamic D3 Knowledge Graph from parsed raw document
app.get('/api/graph', (req, res) => {
  try {
    const filePath = path.resolve('./documents-raw/sample-oisd-excerpt.md');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Sample document not found' });
    }
    const graphData = parseDocument(filePath);
    res.json(graphData);
  } catch (err) {
    console.error('Error generating graph:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Endpoint: RAG Copilot Chat Q&A
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message query is required' });
  }

  try {
    const documentPath = path.resolve('./documents-raw/sample-oisd-excerpt.md');
    let context = '';
    if (fs.existsSync(documentPath)) {
      context = fs.readFileSync(documentPath, 'utf-8');
    }

    if (genAI) {
      // 1. Configure the model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // 2. Formulate RAG Prompt
      const prompt = `
You are the IKIP Expert Copilot, an AI safety and operations assistant for industrial assets.
You have access to the following reference document context representing a real refinery's operation rules:
---
${context}
---

Answer the user's question: "${message}"

Rules:
1. Be technical, direct, and concise. Keep answers under 3-4 short paragraphs.
2. Format lists with bullet points (•) and use double asterisks (**) for bolding. Do NOT use markdown header tags (# or ##).
3. If the answer is not found in the provided document context, explain that clearly and provide standard engineering practices.
      `;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      // Heuristic source citation generation
      const sources = [];
      const lowerAnswer = answer.toLowerCase();
      if (lowerAnswer.includes('e-101') || lowerAnswer.includes('exchanger')) {
        sources.push({ name: 'OISD-STD-118-EX-2024 Layout Standard', type: 'Regulation Standard', confidence: 95, format: 'pdf' });
        sources.push({ name: 'E-101 Specifications (ASME Sec VIII)', type: 'Equipment Manual', confidence: 91, format: 'pdf' });
      }
      if (lowerAnswer.includes('t-101') || lowerAnswer.includes('column')) {
        sources.push({ name: 'OISD-STD-118 Section 5.2 Guidelines', type: 'Regulation Standard', confidence: 94, format: 'pdf' });
      }
      if (lowerAnswer.includes('gt-101') || lowerAnswer.includes('turbine') || lowerAnswer.includes('vibration')) {
        sources.push({ name: 'GT-101 Operating Manual (ISO 10816-3)', type: 'Equipment Manual', confidence: 93, format: 'pdf' });
      }
      if (lowerAnswer.includes('shutdown') || lowerAnswer.includes('esdv') || lowerAnswer.includes('emergency')) {
        sources.push({ name: 'SOP-CDU-1-ESD-04 Emergency SOP', type: 'SOP Procedure', confidence: 96, format: 'pdf' });
      }
      if (sources.length === 0) {
        sources.push({ name: 'OISD-STD-118 Refinery Layout Excerpt', type: 'Reference Standard', confidence: 82, format: 'pdf' });
      }

      // Generate follow-ups
      const followups = [];
      if (lowerAnswer.includes('e-101')) {
        followups.push('What are E-101 design limits?', 'Who reviewed E-101 specifications?');
      } else if (lowerAnswer.includes('gt-101')) {
        followups.push('What is GT-101 vibration limit?', 'When is GT-101 turnaround?');
      } else {
        followups.push('What is the emergency shutdown procedure?', 'What compliance standard does CDU-1 follow?');
      }

      res.json({ answer, sources, followups });
    } else {
      // Simulation Fallback Mode
      console.log('Running chat in simulated mode...');
      // Simple local match fallback
      const qNorm = message.toLowerCase();
      let answer = '';
      let sources = [];
      let followups = [];

      if (qNorm.includes('e-101') || qNorm.includes('exchanger')) {
        answer = `According to the **OISD-STD-118-EX-2024** document, **Heat Exchanger E-101** operates at **350°C** tube side inlet with a design pressure of **2.5 kg/cm²**. It is governed under TEMA and API 660 guidelines. 
                  
• **History:** Tube cleaning was completed on Jan 8, 2025 (WO-2025-0142) by technician D. Singh. Under-deposit corrosion was noted.
• **Safety Limit:** Minimum wall thickness must not drop below **2.0mm** (nominal is 2.77mm).`;
        sources = [
          { name: 'OISD-STD-118-EX-2024 Layout Standard', type: 'Regulation Standard', confidence: 96, format: 'pdf' },
          { name: 'E-101 Specifications (ASME Sec VIII)', type: 'Equipment Manual', confidence: 91, format: 'pdf' }
        ];
        followups = ['What is the operating pressure of E-101?', 'Who is the author of OISD standard excerpt?'];
      } else if (qNorm.includes('shutdown') || qNorm.includes('emergency') || qNorm.includes('esd')) {
        answer = `In case of emergency shutdown (ESD) at **CDU-1** (such as temperatures exceeding **375°C** at E-101 inlet):
                  
1. **Feed Isolation:** Activate Emergency Shutdown Valve **ESDV-101**.
2. **Pressure Relief:** Divert process stream to the Flare System (**Flare-1**) via Knockout Drum (**KO-Drum-1**).
3. **Fire Deluge:** Engage the water deluge system (**FF-System-2**) if flame alarms trigger.`;
        sources = [
          { name: 'OISD-STD-118 Section 5.2 ESD Standard', type: 'Regulation Standard', confidence: 98, format: 'pdf' }
        ];
        followups = ['What is the ESD temperature threshold?', 'Where is the flare system layout?'];
      } else {
        answer = `I am currently running in simulated mode because no **GEMINI_API_KEY** was detected. 
                  
Based on local files, the refinery is operating under **OISD-STD-118** regulations. The active assets are **E-101** (Heat Exchanger), **T-101** (Distillation Column), and **GT-101** (Gas Turbine). 
                  
*Tip: Configure your Gemini API Key in the server .env file to enable live LLM question answering.*`;
        sources = [{ name: 'OISD Standard Excerpt', type: 'Reference Standard', confidence: 80, format: 'pdf' }];
        followups = ['What is the maintenance history of heat exchanger E-101?', 'What is the emergency shutdown procedure?'];
      }

      res.json({ answer, sources, followups });
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
