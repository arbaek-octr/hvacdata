/* ═══════════════════════════════════════
   router.js — Hash-based SPA router
   ═══════════════════════════════════════ */

const routes = {};

function getHash() {
  const h = window.location.hash.slice(1);
  const [path, ...rest] = h.split('?');
  const params = {};
  if (rest.length) {
    rest[0].split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  return { path: path || 'overview', params };
}

function dispatch() {
  const { path, params } = getHash();
  const handler = routes[path] || routes['overview'];
  if (handler) handler(params);
}

export function on(path, handler) {
  routes[path] = handler;
}

export function navigate(path, params = {}) {
  const qs = Object.keys(params).length
    ? '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
    : '';
  window.location.hash = '#' + path + qs;
}

window.addEventListener('hashchange', dispatch);

export function init() { dispatch(); }
