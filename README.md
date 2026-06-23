# Industrial Knowledge Intelligence Platform (IKIP)

IKIP is a Single-Page Application (SPA) designed to unify fragmented industrial documents (P&IDs, engineering drawings, SOPs, maintenance records, and regulatory filings) into queryable, actionable intelligence. It features a Node.js Express backend integrating a real LLM (Gemini API) and dynamic entity extraction to support a live knowledge graph and chatbot copilot.

---

## Key Modules

1. **Dashboard**: An overview displaying refinery-wide KPIs, active assets health, and a live activity feed of recent events.
2. **Document Ingestion**: An upload pipeline that parses technical drawings and SOP manuals, displaying dynamic entity tagging (Equipment, Regulations, Parameters) and library sorting.
3. **Knowledge Graph**: A dynamic, interactive D3.js force-directed graph displaying relationships parsed in real-time from refinery safety standards and asset specifications.
4. **Expert Copilot**: An LLM-powered chatbot running a RAG (Retrieval-Augmented Generation) pipeline over active document context, supplying detailed technical answers with source citations.
5. **Maintenance Intelligence & RCA**: Equipment health indicators, interactive Root Cause Analysis (RCA) trees, MTBF trends, and predictive turnaround scheduling.
6. **Quality & Compliance**: Statutory progress rings, national regulatory scorecards (OISD, IBR, PESO), and audit checklists.
7. **Failure Intelligence**: Incident history timelines, AI failure pattern detectors, and senior expert knowledge preservation logs.

---

## Project Structure

```
ikip/
├── documents-raw/
│   └── sample-oisd-excerpt.md   # Raw industrial safety guidelines (RAG source)
├── src/
│   ├── components/              # Reusable layout shells (sidebar, topbar)
│   ├── data/                    # Simulated databases
│   ├── pages/                   # SPA page modules (dashboard, graph, chat, etc.)
│   ├── styles/                  # Modular stylesheets (glassmorphism themes)
│   ├── main.js                  # App bootstrap entry
│   └── router.js                # Client-side hash router
├── server/
│   └── parser.js                # Heuristic regex entity extractor
├── server.js                    # Express API endpoints (/api/chat, /api/graph)
├── vite.config.js               # Proxy setup for /api routing
└── README.md                    # Startup & architecture guide
```

---

## How to Get Started

### 1. Prerequisites
- **Node.js**: Recommended `v18+` or `v20+`
- **Gemini API Key**: (Optional) To enable real AI responses in the Copilot chat. Get a key from Google AI Studio.

### 2. Installation
Install frontend and backend dependencies:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(If no API key is specified, the Copilot runs in simulated local matching fallback mode, allowing you to test the interface without a key).*

### 4. Running the Platform

You need to run both the backend server and frontend development server:

#### Start the Backend API (Port 3001):
```bash
node server.js
```

#### Start the Frontend Web App (Port 5173):
```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## Dynamic Entity Extraction & RAG Pipeline

1. **Extraction**: On server startup and during `/api/graph` calls, `server/parser.js` reads the raw document `documents-raw/sample-oisd-excerpt.md`. It scans the text via regex and heuristics, cataloging equipment tags (e.g. `E-101`), regulations (`OISD-STD-118`), parameters, and personnel, mapping them into D3-compatible nodes and links.
2. **RAG Context**: When a chat request hits `/api/chat`, the server pulls the raw text of `sample-oisd-excerpt.md` and injects it directly into the Gemini model prompt as system context, ensuring the LLM replies with real facts from your refinery manual.
