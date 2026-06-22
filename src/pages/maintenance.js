// ========================================
// IKIP Maintenance Intelligence Page
// ========================================

import Chart from 'chart.js/auto';
import { equipmentHealth, workOrderHistory, rcaTree, predictiveSchedule, mtbfTrend } from '../data/maintenance.js';

export function render(container) {
  // Helper to render RCA nodes recursively
  function renderRcaNode(node) {
    const childrenHtml = node.children && node.children.length > 0
      ? `<div class="rca-children">${node.children.map(renderRcaNode).join('')}</div>`
      : '';
    
    return `
      <div class="rca-node-wrapper">
        <div class="rca-node ${node.type}">
          <div class="rca-node-title">${node.title}</div>
          <div class="rca-node-desc">${node.desc || ''}</div>
        </div>
        ${childrenHtml}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="page maintenance-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Maintenance Intelligence & RCA</h1>
        <p>Real-time health assessment, root cause diagnostics, and predictive scheduling</p>
      </div>

      <!-- KPI Grid -->
      <div class="maintenance-grid">
        <div class="stat-card glass-card hover-glow stagger-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
          </div>
          <div class="stat-value">6</div>
          <div class="stat-label">Active Equipment</div>
          <div class="stat-meta">Monitored refinery assets</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37-1 8.93.55 12.12 3.97M1.88 12c.38 3.51 2.23 6.69 5.12 8.75"/>
              </svg>
            </div>
            <div class="stat-change up">71%</div>
          </div>
          <div class="stat-value">71%</div>
          <div class="stat-label">Avg Health Score</div>
          <div class="progress-bar" style="margin-top: 8px; height: 6px;">
            <div class="progress-bar-fill" style="width: 71%; background-color: var(--warning-400);"></div>
          </div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
          </div>
          <div class="stat-value">2</div>
          <div class="stat-label">Open Work Orders</div>
          <div class="stat-meta">E-101 UT, TK-15 MFL</div>
        </div>

        <div class="stat-card glass-card hover-glow stagger-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon red pulse-glow" style="animation: pulseGlow 1.5s infinite;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 22 22 2 22"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="stat-change down">High</div>
          </div>
          <div class="stat-value">2</div>
          <div class="stat-label">Predicted Failures</div>
          <div class="stat-meta">Alert triggers on TK-15, E-101</div>
        </div>
      </div>

      <!-- Main Layout: Equipment Health and Root Cause Analysis -->
      <div class="maintenance-main">
        <!-- Left Column: Equipment Health -->
        <div class="glass-card-static equipment-list-section stagger-1">
          <div class="section-header">
            <h2>Refinery Asset Health</h2>
            <p>Condition monitoring health indices and AI failure predictions</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
            ${equipmentHealth.map(eq => {
              const statusClass = eq.health;
              return `
                <div class="equipment-card hover-scale" data-id="${eq.id}">
                  <div class="equipment-header">
                    <span class="equipment-id">${eq.id}</span>
                    <span class="health-indicator ${statusClass}"></span>
                  </div>
                  <div class="equipment-name"><strong>${eq.name}</strong> • ${eq.unit}</div>
                  <div class="equipment-meta">
                    <span>MTBF: <strong>${eq.mtbf}</strong></span>
                    <span>MTTR: <strong>${eq.mttr}</strong></span>
                    <span>Last Maint: <strong>${eq.lastMaint}</strong></span>
                  </div>
                  <div class="progress-bar-wrapper" style="margin-top: 10px;">
                    <div class="flex-between" style="font-size: 11px; margin-bottom: 3px;">
                      <span style="color: var(--text-muted);">Health Score</span>
                      <strong style="color: var(--text-primary);">${eq.healthScore}%</strong>
                    </div>
                    <div class="progress-bar" style="height: 6px;">
                      <div class="progress-bar-fill" style="width: ${eq.healthScore}%; background-color: ${statusClass === 'good' ? 'var(--success-500)' : statusClass === 'warning' ? 'var(--warning-500)' : 'var(--danger-500)'}"></div>
                    </div>
                  </div>
                  <div style="font-size: 11px; margin-top: 8px; color: ${statusClass === 'good' ? 'var(--text-secondary)' : statusClass === 'warning' ? 'var(--warning-400)' : 'var(--danger-400)'}; font-style: italic;">
                    Prediction: ${eq.prediction}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Column: Interactive RCA -->
        <div class="glass-card-static rca-section stagger-2">
          <div class="section-header">
            <h2>Root Cause Analysis (RCA)</h2>
            <p>Causal tree diagram generated from refinery incident logs & work orders</p>
          </div>

          <div class="rca-tree" style="margin-top: 15px;">
            ${renderRcaNode(rcaTree)}
          </div>
        </div>
      </div>

      <!-- Lower Section: MTBF Trend and Predictive Schedule -->
      <div class="grid-2">
        <!-- Left: Chart -->
        <div class="glass-card chart-card stagger-3">
          <div class="section-header">
            <h2>MTBF Trend Analysis</h2>
            <p>Multi-year Mean Time Between Failures progression</p>
          </div>
          <div class="chart-container" style="position: relative; height: 230px;">
            <canvas id="mtbf-trend-chart"></canvas>
          </div>
        </div>

        <!-- Right: Timeline -->
        <div class="glass-card-static schedule-card stagger-4">
          <div class="section-header">
            <h2>Predictive Maintenance Schedule</h2>
            <p>Next action steps derived from predictive anomaly detection</p>
          </div>

          <div class="timeline-container">
            ${predictiveSchedule.map(item => {
              let dotClass = item.status; // overdue, upcoming, scheduled
              let dotEmoji = '🔧';
              if (item.status === 'overdue') dotEmoji = '🚨';
              else if (item.status === 'upcoming') dotEmoji = '⚠️';

              return `
                <div class="timeline-item">
                  <div class="timeline-dot ${dotClass}">
                    <span>${dotEmoji}</span>
                  </div>
                  <div class="timeline-content">
                    <div class="flex-between">
                      <strong class="timeline-title">${item.task} — ${item.equipment}</strong>
                      <span class="badge ${item.priority === 'Critical' ? 'badge-danger' : item.priority === 'High' ? 'badge-warning' : 'badge-primary'}">${item.priority}</span>
                    </div>
                    <div class="timeline-desc">${item.reason}</div>
                    <div class="timeline-date">Due: ${item.date}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
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
  const ctx = document.getElementById('mtbf-trend-chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: mtbfTrend.labels,
      datasets: mtbfTrend.datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color,
        backgroundColor: ds.color + '15',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: ds.color,
        pointBorderColor: 'rgba(255,255,255,0.2)',
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
      },
      scales: {
        x: {
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
      }
    }
  });
}
