# IKIP: Industrial Knowledge Intelligence Platform
### Unifying Fragmented Refinery Data into Actionable, Networked Safety & Operational Intelligence

*A Decoupled 3-Tier Cognitive Graph & Expert RAG Copilot Solution for Industrial Plants*

---

## Slide 1: Executive Summary & The Problem

### The Demographic & operational Challenge
- **Demographics:** Over **25% of India's senior refinery and operations engineers** are retiring within the next decade, threatening the loss of decades of unwritten legacy wisdom.
- **Unstructured Silos:** Industrial operations generate millions of files across separate disciplines (P&IDs, maintenance logs, safety SOPs, hazard reports, and compliance certificates) with no cross-linking.
- **Audit Risk:** Manual compilation of compliance reports (PESO, OISD, CPCB) takes weeks, leading to delays and statutory risk.

---

## Slide 2: The Solution — IKIP Platform

### A Unified Cognitive Intelligence layer
- **Dynamic Ingestion:** Field technicians drop engineering manuals, logs, or compliance filings, instantly writing them to the corpus.
- **Cognitive Parse & Map:** Real-time parser scans the text using structured regex patterns and proximity heuristics to build a D3 force-directed Knowledge Graph (Equipment ⇄ Regulations ⇄ Personnel).
- **Expert Copilot (RAG):** A conversational AI assistant grounded strictly on the corpus context, delivering answers with dynamically calculated source citations and confidence indexes.

---

## Slide 3: Decoupled 3-Tier Architecture

```
  ┌──────────────────────────────────────────────────────────┐
  │                 Visualization Frontend                   │
  │     (Vite + Vanilla JS + D3.js Graph + Chart.js SPA)     │
  └───────────────────────────┬──────────────────────────────┘
                              │ HTTP Requests (JSON)
                              ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   Node.js Express API                    │
  │     (/api/graph nodes & links, /api/chat RAG pipeline)   │
  └───────────────────────────┬──────────────────────────────┘
                              │ File Reads / Writes
                              ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  Refinery Corpus Database                │
  │     (Unstructured Markdown documents in documents-raw/)  │
  └──────────────────────────────────────────────────────────┘
```

- **Data Tier:** Markdown and text files act as a simple, high-performance local database corpus.
- **Service Tier:** Express backend hosts TF-IDF search indexing, node merging, and Gemini LLM provider bindings.
- **Presentation Tier:** A responsive, modern single-page dashboard designed for both desktop workstations and mobile field devices.

---

## Slide 4: Real-Time Ingestion & Extraction Pipeline

### How Unstructured Text Becomes Graph Nodes
1. **Intake:** User uploads document. The browser reads it via the `FileReader` API and POSTs it to the server.
2. **Dynamic Regex Scanning:** Backend scans contents for equipment codes (`E-101`, `GT-101`), parameters (`350°C`, `2.8 mm/s`), regulations (`OISD-STD-118`, `ASME Sec VIII`), and personnel names.
3. **Proximity-based Relations:** If a regulation code is located within 100 characters of an equipment code in the text, a `regulates` relationship link is drawn.
4. **D3 Graph Injection:** The node list is returned, merging nodes by ID to prevent duplication, and immediately updates the interactive Knowledge Graph.

---

## Slide 5: Expert Copilot & Computed RAG

### Grounded, Verifiable Answers
- **Cosine TF Similarity Ranking:** Matches chat queries against the corpus by scanning term-frequency overlap across active documents.
- **Confidence Scoring:** Calculates similarity match percentages (72% to 99%) dynamically based on query keyword coverage, rather than using static mock numbers.
- **LLM Grounding:** Sends the top matching context blocks to the **Gemini 2.0 Flash** model with strict prompts to prevent hallucination.
- **API Graceful Fallback:** If Gemini API keys hit free-tier rate limits or quotas (HTTP 429), the server automatically recovers and serves matching simulated responses with live citations.

---

## Slide 6: Quality, Compliance & Audit Packages

### Automated Compliance Verification
- **Framework Scorecards:** Tracks compliance rates across 8 national and international regulatory frameworks (OISD, IBR, PESO, CPCB, Factory Act, and ISO).
- **Active Gaps Logger:** Aggregates identified audit gaps, sorting by severity (critical, major, minor), and tracking due dates and responsible plant areas.
- **Machine-Readable Audit Trail:** Surfaces a **"Generate Audit Package"** feature which compiles active compliance states and checklist logs, instantly exporting a structured, machine-readable JSON data package (`ikip-audit-evidence-package.json`) alongside a formatted text report.

---

## Slide 7: Field-Technician UI & Mobile Optimization

### Designed for the Plant Floor
- **Universal Tap Sizes:** Enforces a minimum **44px** height and width on all interactive controls (buttons, navigation tabs, filter chips, inputs) to ensure ease of use on mobile screens (≤768px).
- **Responsive Layout Grids:** Stacks columns and adjusts container paddings to ensure charts, timeline logs, and tables read clearly on rugged technician tablets.
- **Mobile Breadcrumbs & Drawers:** Simplifies sidebar layout on small widths, introducing slide-out overlays for quick cross-functional access.

---

## Slide 8: Future Roadmap & Business Value

### Scaling Industrial Intelligence
- **Semantic Vector Store:** Upgrading simple term matching to dense vector embeddings for deep semantic concept matching.
- **Ontology Alignment:** Mapping flat relationship strings to standardized industrial ontologies (ISO 15926 and ISA-88).
- **External Failure Database Integration:** Syncing incident timelines with global offshore reliability databases (OREDA) and chemical process safety logs (CCPS) to predict critical asset risk profiles.
