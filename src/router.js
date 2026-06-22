// ========================================
// IKIP — Simple Hash Router
// ========================================

const routes = {};
let currentRoute = null;

export function defineRoute(path, loader) {
  routes[path] = loader;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter(container, onNavigate) {
  async function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const routeLoader = routes[hash];

    if (routeLoader) {
      currentRoute = hash;
      container.innerHTML = '';
      container.classList.add('page-transitioning');

      try {
        const module = await routeLoader();
        container.classList.remove('page-transitioning');
        module.render(container);
        if (onNavigate) onNavigate(hash);
      } catch (err) {
        console.error('Failed to load route:', hash, err);
        container.innerHTML = `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            <h3>Failed to load page</h3>
            <p>${err.message}</p>
          </div>`;
        container.classList.remove('page-transitioning');
      }
    } else {
      navigate('/');
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
