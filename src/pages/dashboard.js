// ========================================
// IKIP Dashboard Page
// ========================================

import { navigate } from '../router.js';

export function render(container) {
  const queryCount = parseInt(localStorage.getItem('ikip_query_count') || '342', 10);
  container.innerHTML = `
    <div class="page dashboard-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Dashboard</h1>
        <p>Industrial Knowledge Intelligence Platform Overview</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="dashboard-kpi-grid">
        <div class="stat-card glass-card hover-lift stagger-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="stat-change up">↑ 12%</div>
          </div>
          <div class="stat-value" id="stat-doc-count">11</div>
          <div class="stat-label">Documents Processed</div>
          <div class="stat-meta" id="stat-doc-meta">Total size: 45 KB</div>
        </div>

        <div class="stat-card glass-card hover-lift stagger-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div class="stat-change up">↑ 8%</div>
          </div>
          <div class="stat-value">18,432</div>
          <div class="stat-label">Entities Extracted</div>
          <div class="stat-meta">Equipment, rules, tags</div>
        </div>

        <div class="stat-card glass-card hover-lift stagger-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="stat-change down">↓ 2%</div>
          </div>
          <div class="stat-value">89%</div>
          <div class="stat-label">Compliance Score</div>
          <div class="stat-meta">7 active gaps detected</div>
        </div>

        <div class="stat-card glass-card hover-lift stagger-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-change up">↑ 5%</div>
          </div>
          <div class="stat-value">12,400 <span class="unit">hrs</span></div>
          <div class="stat-label">MTBF Average</div>
          <div class="stat-meta">Critical assets (CDU-1)</div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="dashboard-main-grid">
        <!-- Left Side: Platform Modules -->
        <div class="glass-card-static modules-section stagger-2">
          <div class="section-header">
            <h2>Platform Modules</h2>
            <p>Access specialized AI analytics & knowledge tools</p>
          </div>

          <div class="dashboard-modules-grid">
            <!-- Module 1: Ingestion -->
            <div class="module-card hover-lift" data-path="/ingestion">
              <div class="module-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3>Document Ingestion</h3>
              <p>AI pipeline for parsing P&IDs, standards, inspection PDFs, and work orders.</p>
              <div class="module-card-stats">
                <span><strong id="ingest-card-docs">11</strong> documents</span>
                <span><strong id="ingest-card-size">45 KB</strong> size</span>
              </div>
            </div>

            <!-- Module 2: Knowledge Graph -->
            <div class="module-card hover-lift" data-path="/knowledge-graph">
              <div class="module-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 3a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zM6 15a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm12 0a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zM6 3a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm6 7v4"/>
                  <line x1="6" y1="9" x2="18" y2="15"/>
                  <line x1="18" y1="9" x2="6" y2="15"/>
                </svg>
              </div>
              <h3>Knowledge Graph</h3>
              <p>Interactive force-directed graph connecting equipment, failure modes, and regulations.</p>
              <div class="module-card-stats">
                <span><strong>856</strong> nodes</span>
                <span><strong>1,240</strong> edges</span>
              </div>
            </div>

            <!-- Module 3: Expert Copilot -->
            <div class="module-card hover-lift" data-path="/copilot">
              <div class="module-icon cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Expert Copilot</h3>
              <p>Natural language Q&A chat engine over refinery documents with RAG citations.</p>
              <div class="module-card-stats">
                <span><strong>${queryCount}</strong> queries</span>
                <span><strong>94%</strong> accuracy</span>
              </div>
            </div>

            <!-- Module 4: Maintenance Intelligence -->
            <div class="module-card hover-lift" data-path="/maintenance">
              <div class="module-icon amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>Maintenance Intel</h3>
              <p>Asset health scoring, predictive schedule, and interactive RCA trees.</p>
              <div class="module-card-stats">
                <span><strong>6</strong> assets</span>
                <span><strong>2</strong> alerts</span>
              </div>
            </div>

            <!-- Module 5: Compliance -->
            <div class="module-card hover-lift" data-path="/compliance">
              <div class="module-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Quality & Compliance</h3>
              <p>OISD standards audit gap analysis, readiness checklists, and statutory scoring.</p>
              <div class="module-card-stats">
                <span><strong>89%</strong> score</span>
                <span><strong>7</strong> gaps</span>
              </div>
            </div>

            <!-- Module 6: Failure Intelligence -->
            <div class="module-card hover-lift" data-path="/failure-intelligence">
              <div class="module-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>Failure Intelligence</h3>
              <p>Lessons learned, failure patterns, proactive system warnings, and knowledge preservation.</p>
              <div class="module-card-stats">
                <span><strong>5</strong> incidents</span>
                <span><strong>3</strong> patterns</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Recent Activity -->
        <div class="glass-card-static activity-section stagger-3">
          <div class="section-header">
            <h2>Recent Activity</h2>
            <p>Real-time platform event log</p>
          </div>

          <div class="activity-feed">
            <div class="activity-item">
              <div class="activity-dot ingest"></div>
              <div class="activity-content">
                <div class="activity-text">Document <strong>DOC-015 (RBI Assessment CDU-1)</strong> successfully parsed and vectorized.</div>
                <div class="activity-time">2 mins ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot alert"></div>
              <div class="activity-content">
                <div class="activity-text">AI warning generated for <strong>GT-101</strong>: Vibration 1X trending upwards towards alert zone.</div>
                <div class="activity-time">15 mins ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot query"></div>
              <div class="activity-content">
                <div class="activity-text">Expert Copilot query resolved: <em>"What is the emergency shutdown procedure for CDU-1?"</em></div>
                <div class="activity-time">1 hr ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot compliance"></div>
              <div class="activity-content">
                <div class="activity-text">Compliance Gap detected: <strong>OISD-STD-118 Section 5.2</strong> checklist mismatch.</div>
                <div class="activity-time">4 hrs ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot maintenance"></div>
              <div class="activity-content">
                <div class="activity-text">Work order <strong>WO-2025-0142</strong> closed: E-101 Tube bundle hydrojet cleaning completed.</div>
                <div class="activity-time">1 day ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot ingest"></div>
              <div class="activity-content">
                <div class="activity-text">New engineering drawing <strong>DWG-CDU-1-08 (Rev 12)</strong> uploaded and text layers OCRed.</div>
                <div class="activity-time">1 day ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot alert"></div>
              <div class="activity-content">
                <div class="activity-text">Critical gap identified on <strong>TK-15</strong>: Inspection certificate expired on 2025-04-15.</div>
                <div class="activity-time">2 days ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot query"></div>
              <div class="activity-content">
                <div class="activity-text">Expert Copilot query resolved: <em>"Show E-101 maintenance history"</em> (96% confidence score).</div>
                <div class="activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach navigation event handlers
  const moduleCards = container.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      const path = card.getAttribute('data-path');
      if (path) navigate(path);
    });
  });

  // Fetch live corpus stats
  fetch('/api/stats')
    .then(res => res.json())
    .then(stats => {
      const docCountEl = container.querySelector('#stat-doc-count');
      const docMetaEl = container.querySelector('#stat-doc-meta');
      const ingestCardDocs = container.querySelector('#ingest-card-docs');
      const ingestCardSize = container.querySelector('#ingest-card-size');

      if (docCountEl) docCountEl.textContent = stats.documentCount;
      if (docMetaEl) docMetaEl.textContent = `Total size: ${stats.corpusSizeKB} KB`;
      if (ingestCardDocs) ingestCardDocs.textContent = `${stats.documentCount} docs`;
      if (ingestCardSize) ingestCardSize.textContent = `${stats.corpusSizeKB} KB`;
    })
    .catch(err => console.error('Error fetching dashboard stats:', err));
}
