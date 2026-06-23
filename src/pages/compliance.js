// ========================================
// IKIP Quality & Compliance Page
// ========================================

import { complianceFrameworks, complianceGaps, auditReadiness, overallComplianceScore } from '../data/compliance.js';

export function render(container) {
  // Sort gaps by severity (Critical -> Major -> Minor)
  const severityOrder = { critical: 1, major: 2, minor: 3 };
  const sortedGaps = [...complianceGaps].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Calculate audit readiness items count
  const readyItemsCount = auditReadiness.filter(item => item.status === 'pass').length;
  const totalItemsCount = auditReadiness.length;

  container.innerHTML = `
    <div class="page compliance-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Quality & Compliance Intelligence</h1>
        <p>Regulatory tracking, gap analysis, and statutory audit readiness assessment</p>
      </div>

      <!-- Summary Grid -->
      <div class="compliance-summary">
        <div class="stat-card glass-card hover-glow stagger-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-change up">89%</div>
          </div>
          <div class="stat-value">${overallComplianceScore}%</div>
          <div class="stat-label">Overall Score</div>
          <div class="stat-meta">Refinery-wide rating</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
          </div>
          <div class="stat-value">8</div>
          <div class="stat-label">Frameworks Tracked</div>
          <div class="stat-meta">OISD, IBR, PESO, API, ISO</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 22 22 2 22"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="stat-change down">7 Gaps</div>
          </div>
          <div class="stat-value">${sortedGaps.length}</div>
          <div class="stat-label">Active Gaps</div>
          <div class="stat-meta">1 critical, 4 major, 2 minor</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon red pulse-glow" style="animation: pulseGlow 1.5s infinite;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="stat-change down" id="audit-countdown">15 days</div>
          </div>
          <div class="stat-value" style="font-size: var(--text-lg); line-height: 1.8;">15 Jun 2025</div>
          <div class="stat-label">Next Statutory Audit</div>
          <div class="stat-meta">PESO Inspection (CDU-1)</div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="compliance-main">
        <!-- Left Column: Score Ring and Frameworks -->
        <div class="glass-card-static left-column stagger-1">
          <!-- Compliance Score Ring -->
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 12px; font-weight: 500;">STATUTORY COMPLIANCE RATING</h2>
            
            <div class="score-ring-container">
              <div class="score-ring">
                <svg>
                  <circle class="ring-bg" cx="80" cy="80" r="70"></circle>
                  <circle class="ring-fill" cx="80" cy="80" r="70" id="ring-fill"></circle>
                </svg>
                <div class="score-ring-value">
                  <span class="score-ring-number">${overallComplianceScore}%</span>
                  <span class="score-ring-label">Overall Index</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Framework List -->
          <div class="section-header">
            <h2>Regulatory Frameworks</h2>
            <p>Score tracker for national and international safety regulations</p>
          </div>

          <div class="framework-list" style="margin-top: 15px;">
            ${complianceFrameworks.map(fw => {
              const scoreColor = fw.score >= 90 ? 'var(--success-500)' : fw.score >= 80 ? 'var(--warning-500)' : 'var(--danger-500)';
              return `
                <div class="framework-item hover-scale">
                  <div class="framework-icon" style="background-color: ${scoreColor}15; color: ${scoreColor}; border: 1px solid ${scoreColor}30;">
                    ${fw.authority}
                  </div>
                  <div class="framework-info">
                    <div class="framework-name">${fw.name}</div>
                    <div class="framework-desc">${fw.total} compliance points monitored</div>
                  </div>
                  <div class="framework-score">
                    <span class="framework-percentage" style="color: ${scoreColor};">${fw.score}%</span>
                    <div class="progress-bar" style="height: 4px; width: 60px; margin-top: 4px;">
                      <div class="progress-bar-fill" style="width: ${fw.score}%; background-color: ${scoreColor};"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Column: Compliance Gaps and Audit Checklist -->
        <div class="right-column stagger-2">
          <!-- Compliance Gaps -->
          <div class="glass-card-static Gaps-section" style="margin-bottom: var(--space-6);">
            <div class="section-header">
              <h2>Identified Compliance Gaps</h2>
              <p>Active regulatory gaps mapped from inspections and SOP audits</p>
            </div>

            <div class="gap-list" style="margin-top: 15px;">
              ${sortedGaps.map(gap => {
                const badgeClass = gap.severity === 'critical' ? 'badge-danger' : gap.severity === 'major' ? 'badge-warning' : 'badge-primary';
                return `
                  <div class="gap-item ${gap.severity}">
                    <div class="gap-header">
                      <strong class="gap-title">${gap.title}</strong>
                      <span class="badge ${badgeClass}">${gap.severity.toUpperCase()}</span>
                    </div>
                    <div class="gap-desc">${gap.description}</div>
                    <div class="gap-meta">
                      <span>Ref: <strong>${gap.requirement}</strong></span> • 
                      <span>Due: <strong>${gap.dueDate}</strong></span> • 
                      <span>Responsible: <strong>${gap.owner}</strong></span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Audit Readiness Checklist -->
          <div class="glass-card-static readiness-section">
            <div class="flex-between" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px; margin-bottom: 15px;">
              <div class="section-header">
                <h2 style="margin-bottom: 2px;">Audit Readiness Checklist</h2>
                <p>PESO statutory checklist validation items</p>
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); background: var(--bg-hover); padding: 4px 8px; border-radius: var(--radius-md);">
                <strong>${readyItemsCount}</strong> of <strong>${totalItemsCount}</strong> ready
              </div>
            </div>

            <div class="audit-list">
              ${auditReadiness.map(item => {
                let statusClass = 'pending';
                let statusEmoji = '✓';
                if (item.status === 'pass') {
                  statusClass = 'pass';
                  statusEmoji = '✓';
                } else if (item.status === 'fail') {
                  statusClass = 'fail';
                  statusEmoji = '✗';
                } else if (item.status === 'partial') {
                  statusClass = 'partial';
                  statusEmoji = '–';
                }

                return `
                  <div class="audit-item animate-fade-in-up">
                    <div class="audit-check ${statusClass}">
                      <span>${statusEmoji}</span>
                    </div>
                    <div class="audit-info">
                      <div class="audit-name">${item.name}</div>
                      <div class="audit-detail">${item.details}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate the compliance score ring fill on page load
  setTimeout(() => {
    const ringFill = container.querySelector('#ring-fill');
    if (ringFill) {
      // Circumference of r=70 is ~440. 
      // Offset = 440 * (1 - score/100)
      const circumference = 440;
      const offset = circumference * (1 - (overallComplianceScore / 100));
      ringFill.style.strokeDashoffset = offset;
    }
  }, 100);
}
