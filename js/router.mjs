const routes = [];
const FALLBACK_HASH = '#/';

export function onRouteChange(pattern, handler) {
  routes.push({ pattern, handler });
}

export function startRouter() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

function dispatch() {
  const path = location.hash.replace(/^#/, '') || '/';
  for (const { pattern, handler } of routes) {
    const match = path.match(pattern);
    if (match) {
      handler(match.groups || {});
      return;
    }
  }
  location.hash = FALLBACK_HASH;
}
