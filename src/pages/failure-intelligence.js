// ========================================
// IKIP Failure Intelligence Page
// ========================================

import Chart from 'chart.js/auto';
import { incidents, nearMisses, failurePatterns, proactiveWarnings, knowledgePreservation } from '../data/incidents.js';

export function render(container) {
  container.innerHTML = `
    <div class="page failure-intelligence-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Lessons Learned & Failure Intelligence</h1>
        <p>Proactive risk mitigation, AI failure pattern analytics, and legacy expert knowledge preservation</p>
      </div>

      <!-- Summary Grid -->
      <div class="fi-summary">
        <div class="stat-card glass-card hover-glow stagger-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 22 22 2 22"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="stat-change down">↑ 1 this yr</div>
          </div>
          <div class="stat-value">${incidents.length}</div>
          <div class="stat-label">Total Incidents</div>
          <div class="stat-meta">5 historical records</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
                <line x1="9" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <div class="stat-change up">6 logged</div>
          </div>
          <div class="stat-value">${nearMisses.length}</div>
          <div class="stat-label">Near Misses</div>
          <div class="stat-meta">Prevented hazard events</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
            </div>
            <div class="stat-change up">3 detected</div>
          </div>
          <div class="stat-value">${failurePatterns.length}</div>
          <div class="stat-label">Patterns Detected</div>
          <div class="stat-meta">Cross-asset correlation</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon red pulse-glow" style="animation: pulseGlow 1.5s infinite;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="stat-change down">2 critical</div>
          </div>
          <div class="stat-value">${proactiveWarnings.length}</div>
          <div class="stat-label">Active Warnings</div>
          <div class="stat-meta">Proactive system alerts</div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="fi-main">
        <!-- Left Column: Incident Timeline & Failure Patterns -->
        <div class="left-column">
          <!-- Incident Timeline -->
          <div class="glass-card-static timeline-section animate-fade-in-up" style="margin-bottom: var(--space-6);">
            <div class="section-header">
              <h2>Incident Timeline</h2>
              <p>Historical refinery incident log compiled from reports & audits</p>
            </div>

            <div class="incident-timeline" style="margin-top: 15px;">
              ${incidents.map(inc => {
                let dotClass = inc.severity;
                return `
                  <div class="incident-item">
                    <div class="incident-dot ${dotClass}"></div>
                    <div class="incident-card">
                      <div class="incident-date">${inc.date} • ${inc.plant}</div>
                      <div class="incident-title">${inc.title}</div>
                      <div class="incident-desc">${inc.desc}</div>
                      <div style="font-size: 11px; margin-top: 8px; border-top: 1px solid var(--border-subtle); padding-top: 6px; color: var(--text-secondary);">
                        <strong>Root Cause:</strong> ${inc.rootCause}
                      </div>
                      <div class="incident-tags">
                        ${inc.tags.map(tag => `<span class="tag" style="font-size: 10px;">#${tag}</span>`).join('')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Failure Pattern Analysis -->
          <div class="glass-card-static patterns-section animate-fade-in-up">
            <div class="section-header">
              <h2>Failure Pattern Analysis</h2>
              <p>Cross-asset failure modes identified by AI pattern recognition</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
              ${failurePatterns.map(pat => {
                const confColor = pat.confidence >= 90 ? 'var(--success-500)' : 'var(--warning-500)';
                return `
                  <div class="pattern-card">
                    <div class="pattern-header">
                      <strong class="pattern-title">${pat.title}</strong>
                      <span class="pattern-confidence" style="background-color: ${confColor}15; color: ${confColor}; border: 1px solid ${confColor}30;">
                        ${pat.confidence}% Confidence
                      </span>
                    </div>
                    <div class="pattern-desc">${pat.desc}</div>
                    
                    <div class="flex-between" style="margin-top: 10px; font-size: 11px; color: var(--text-secondary);">
                      <span>Occurrences: <strong>${pat.occurrences} times</strong></span>
                      <span>Timespan: <strong>${pat.timespan}</strong></span>
                    </div>

                    <div style="margin-top: 10px; padding: 8px; background-color: var(--bg-hover); border-radius: var(--radius-md); font-size: 11px; border-left: 3px fill var(--primary-500);">
                      <strong style="color: var(--primary-300); display: block; margin-bottom: 2px;">AI Recommendation:</strong>
                      ${pat.recommendation}
                    </div>

                    <div class="pattern-occurrences" style="margin-top: 10px;">
                      <span style="font-size: 10px; color: var(--text-dim); margin-right: 5px; align-self: center;">Affected Assets:</span>
                      ${pat.equipment.map(eq => `<span class="pattern-occ">${eq}</span>`).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Proactive Warning System & Knowledge Preservation -->
        <div class="right-column">
          <!-- Proactive Warning System -->
          <div class="glass-card-static warnings-section animate-fade-in-up" style="margin-bottom: var(--space-6);">
            <div class="section-header">
              <h2>Proactive Warning System</h2>
              <p>Risk alerts generated by matching live metrics with historical failure signatures</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
              ${proactiveWarnings.map(warn => {
                return `
                  <div class="warning-card ${warn.severity}">
                    <div class="warning-header">
                      <strong class="warning-title">
                        ${warn.severity === 'high' ? '⚠️' : 'ℹ️'} ${warn.title}
                      </strong>
                      <span class="warning-risk" style="color: ${warn.severity === 'high' ? 'var(--danger-400)' : 'var(--warning-400)'};">
                        Risk: ${warn.risk}%
                      </span>
                    </div>
                    <div class="warning-desc">${warn.desc}</div>
                    
                    <div style="font-size: 11px; margin-top: 8px; color: var(--text-secondary);">
                      <strong>Trigger Pattern:</strong> ${warn.trigger}
                    </div>

                    <div class="warning-action" onclick="alert('Viewing action plan: ${warn.action.replace(/'/g, "\\'")}')">
                      <span>View recommended action plan →</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Knowledge Preservation -->
          <div class="glass-card-static kp-section animate-fade-in-up">
            <div class="section-header">
              <h2>Knowledge Preservation</h2>
              <p>Capturing critical field expert operational wisdom before retirement</p>
            </div>

            <!-- Preservation Stats -->
            <div class="kg-stats-grid" style="margin-top: 15px; margin-bottom: 20px;">
              <div class="kg-stat">
                <div class="kg-stat-value">${knowledgePreservation.totalExperts}</div>
                <div class="kg-stat-label">Experts Tracked</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value" style="color: var(--warning-400);">${knowledgePreservation.retiringIn5Years}</div>
                <div class="kg-stat-label">Retiring (5 Yrs)</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value" style="color: var(--success-400);">${knowledgePreservation.knowledgeCaptured}%</div>
                <div class="kg-stat-label">Wisdom Captured</div>
              </div>
            </div>

            <div class="kp-meters-list">
              <h4 style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; font-weight: 500;">Preservation Level by Topic</h4>
              
              ${knowledgePreservation.metrics.map(met => {
                const metColor = met.captured >= 70 ? 'var(--success-500)' : met.captured >= 50 ? 'var(--warning-500)' : 'var(--danger-500)';
                return `
                  <div class="kp-meter">
                    <div class="kp-meter-header">
                      <span class="kp-meter-label">${met.label}</span>
                      <span class="kp-meter-value" style="color: ${metColor};">${met.captured}%</span>
                    </div>
                    <div class="progress-bar" style="height: 6px;">
                      <div class="progress-bar-fill" style="width: ${met.captured}%; background-color: ${metColor};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Incident Trend Chart -->
      <div class="glass-card chart-card stagger-3">
        <div class="section-header">
          <h2>Refinery Incidents & Near-Miss History</h2>
          <p>Monthly distribution of logged incident events by severity over last year</p>
        </div>
        <div class="chart-container" style="position: relative; height: 250px;">
          <canvas id="incidents-trend-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  // Initialize Chart.js
  setTimeout(() => {
    initChart();
  }, 0);
}

function initChart() {
  const ctx = document.getElementById('incidents-trend-chart');
  if (!ctx) return;

  // Generate 12 months data
  const months = ['Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25'];
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Critical / High Severity',
          data: [1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          backgroundColor: '#EF4444',
          borderRadius: 4
        },
        {
          label: 'Medium Severity',
          data: [0, 1, 2, 1, 0, 0, 2, 0, 1, 1, 0, 1],
          backgroundColor: '#F59E0B',
          borderRadius: 4
        },
        {
          label: 'Low / Near Miss',
          data: [3, 4, 2, 3, 5, 2, 4, 3, 6, 4, 3, 4],
          backgroundColor: '#0EA5E9',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            color: 'rgba(148, 163, 184, 0.05)'
          },
          ticks: {
            color: '#64748B',
            font: {
              family: 'JetBrains Mono',
              size: 10
            }
          }
        },
        y: {
          stacked: true,
          grid: {
            color: 'rgba(148, 163, 184, 0.05)'
          },
          ticks: {
            color: '#64748B',
            font: {
              family: 'JetBrains Mono',
              size: 10
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            font: {
              family: 'Inter',
              size: 11
            },
            color: '#94A3B8'
          }
        },
        tooltip: {
          padding: 10,
          backgroundColor: '#0F1729',
          titleColor: '#F1F5F9',
          bodyColor: '#94A3B8',
          borderColor: 'rgba(148,163,184,0.12)',
          borderWidth: 1
        }
      }
    }
  });
}
