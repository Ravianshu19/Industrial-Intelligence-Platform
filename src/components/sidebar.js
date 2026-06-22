// ========================================
// IKIP Sidebar Component
// ========================================

import { navigate } from '../router.js';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'grid', section: 'overview' },
  { path: '/ingestion', label: 'Document Ingestion', icon: 'upload', section: 'modules', badge: '3' },
  { path: '/knowledge-graph', label: 'Knowledge Graph', icon: 'share2', section: 'modules' },
  { path: '/copilot', label: 'Expert Copilot', icon: 'messageCircle', section: 'modules' },
  { path: '/maintenance', label: 'Maintenance & RCA', icon: 'tool', section: 'modules', badge: '2' },
  { path: '/compliance', label: 'Compliance', icon: 'shield', section: 'modules', badge: '7' },
  { path: '/failure-intelligence', label: 'Failure Intelligence', icon: 'alertTriangle', section: 'modules' }
];

const icons = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  share2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  messageCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>'
};

export function renderSidebar(container, currentPath) {
  const overviewItems = navItems.filter(i => i.section === 'overview');
  const moduleItems = navItems.filter(i => i.section === 'modules');

  container.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        ${icons.brain}
      </div>
      <div class="sidebar-brand">
        <span class="sidebar-brand-name">IKIP</span>
        <span class="sidebar-brand-sub">Knowledge Intelligence</span>
      </div>
    </div>

    <nav class="sidebar-nav" id="sidebar-nav">
      <div class="sidebar-section-label">Overview</div>
      ${overviewItems.map(item => `
        <a class="nav-item ${currentPath === item.path ? 'active' : ''}"
           href="#${item.path}" id="nav-${item.path.slice(1) || 'dashboard'}">
          ${icons[item.icon]}
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </a>
      `).join('')}

      <div class="sidebar-section-label">Modules</div>
      ${moduleItems.map(item => `
        <a class="nav-item ${currentPath === item.path ? 'active' : ''}"
           href="#${item.path}" id="nav-${item.path.slice(1)}">
          ${icons[item.icon]}
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </a>
      `).join('')}
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-footer-user" id="sidebar-user">
        <div class="avatar">RS</div>
        <div class="sidebar-footer-info">
          <div class="sidebar-footer-name">R. Sharma</div>
          <div class="sidebar-footer-role">Lead Engineer — CDU-1</div>
        </div>
      </div>
    </div>
  `;
}

export function updateActiveNav(path) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === `#${path}`);
  });
}
