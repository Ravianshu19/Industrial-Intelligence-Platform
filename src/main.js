// ========================================
// IKIP — Main Application Entry Point
// ========================================

import { defineRoute, initRouter } from './router.js';
import { renderSidebar, updateActiveNav } from './components/sidebar.js';
import { renderTopbar, updateTopbar } from './components/topbar.js';

// Define routes with lazy loading
defineRoute('/', () => import('./pages/dashboard.js'));
defineRoute('/ingestion', () => import('./pages/ingestion.js'));
defineRoute('/knowledge-graph', () => import('./pages/knowledge-graph.js'));
defineRoute('/copilot', () => import('./pages/copilot.js'));
defineRoute('/maintenance', () => import('./pages/maintenance.js'));
defineRoute('/compliance', () => import('./pages/compliance.js'));
defineRoute('/failure-intelligence', () => import('./pages/failure-intelligence.js'));

// Initialize application
function init() {
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  const content = document.getElementById('content');

  // Initial render
  const initialPath = window.location.hash.slice(1) || '/';
  renderSidebar(sidebar, initialPath);
  renderTopbar(topbar, initialPath);

  // Start router
  initRouter(content, (path) => {
    updateActiveNav(path);
    updateTopbar(topbar, path);
  });

  // Close mobile sidebar when clicking a nav item
  sidebar.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  });

  // Close mobile sidebar when clicking overlay area
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !e.target.closest('#mobile-menu-btn')) {
      sidebar.classList.remove('open');
    }
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
