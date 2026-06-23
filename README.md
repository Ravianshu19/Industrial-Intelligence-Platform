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

## System Architecture & Data Flow

IKIP is designed as a decoupled 3-tier platform that separates document storage, cognitive processing, and user interaction:

```
  ┌──────────────────────────────────────────────────────────┐
  │                 Visualization Frontend                   │
  │     (Vite + Vanilla JS + D3.js Graph + Chart.js SPA)     │
  └───────────────────────────┬──────────────────────────────┘
                              │ HTTP Requests (JSON)
                              ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   Node.js Express API                    │
  │    (Real-time D3 Graph Extractor & Copilot Chat RAG)    │
  └───────────────────────────┬──────────────────────────────┘
                              │ Reads / Writes Files
                              ▼
  ┌──────────────────────────────────────────────────────────┐
  │                Refinery Corpus Database                  │
  │      (Raw Markdown Documents in documents-raw/)          │
  └──────────────────────────────────────────────────────────┘
```

1. **Ingestion & Storage**: When users upload files, the frontend reads them as text using the `FileReader` API and POSTs them to `/api/upload`. The server writes these documents directly to `documents-raw/`, persistently growing the refinery's corpus.
2. **Cognitive Extraction**: When the D3 graph loads, `/api/graph` executes our parser. It scans raw text using structured regex patterns to discover equipment tags (e.g. `E-101`), parameters, regulations, and personnel. Relationships are derived via paragraph proximity rules.
3. **Computed RAG Engine**: Chat queries posted to `/api/chat` are compared against all documents in the corpus using dynamic keyword overlap scoring. The top documents are retrieved as prompt context and sent to the **Gemini 2.0 Flash** model. Source citation objects and confidence percentages are computed dynamically based on similarity metrics.

*For the complete detailed specification and visual flowchart, see the [System Architecture Specification](docs/architecture.md).*

---

## Project Structure

```
ikip/
├── docs/
│   ├── architecture.md          # System design & data flow specification
│   └── architecture.png         # Flowchart architecture diagram
├── documents-raw/
│   ├── sample-oisd-excerpt.md   # Refinery layout and spacing rules (OISD)
│   ├── sop-cdu1-esd.md          # Emergency Shutdown Procedure SOP (CDU-1)
│   ├── cpcb-compliance-record.md# Stack emission limits compliance log (CPCB)
│   ├── hira-cdu1-crude.md       # Hazard identification & risk assessment (CDU-1)
│   ├── oem-spec-e101.md         # Manufacturer design specs for Heat Exchanger E-101
│   ├── turnaround-schedule-2025.# Planned turnaround path activities (CDU-1)
│   ├── maintenance-wo-e101-tube.# Cleaning work order audit logs (E-101)
│   ├── regulatory-filing-peso.md# Statutory operating license filings (PESO)
│   └── compliance-audit-dgfasli.# Statutory safety audit report on LPG bullets (DGFASLI)
├── src/
│   ├── components/              # Reusable layout shells (sidebar, topbar)
│   ├── data/                    # Simulated databases
│   ├── pages/                   # SPA page modules (dashboard, graph, chat, etc.)
│   ├── styles/                  # Modular stylesheets (glassmorphism themes)
│   ├── main.js                  # App bootstrap entry
│   └── router.js                # Client-side hash router
├── server/
│   └── parser.js                # Heuristic regex entity extractor
├── server.js                    # Express API endpoints (/api/chat, /api/graph, /api/upload)
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
