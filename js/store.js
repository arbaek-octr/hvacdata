/* ═══════════════════════════════════════
   store.js — Simple reactive state store
   ═══════════════════════════════════════ */
import { defaultDataPoints } from './data/datapoints.js';

const _listeners = {};
const state = {
  currentPage: 'overview',
  currentAhu: null,
  dataPoints: defaultDataPoints.map(dp => ({ ...dp })),
};

export function getState() { return state; }

export function setState(patch) {
  Object.assign(state, patch);
  const keys = Object.keys(patch);
  keys.forEach(key => {
    (_listeners[key] || []).forEach(fn => fn(state[key]));
  });
  (_listeners['*'] || []).forEach(fn => fn(state));
}

export function subscribe(key, fn) {
  if (!_listeners[key]) _listeners[key] = [];
  _listeners[key].push(fn);
  return () => { _listeners[key] = _listeners[key].filter(f => f !== fn); };
}

// Update a single data point value
export function updateDataPoint(id, newValue) {
  const dp = state.dataPoints.find(d => d.id === id);
  if (!dp) return;
  dp.value = newValue;
  (_listeners['dataPoints'] || []).forEach(fn => fn(state.dataPoints));
  (_listeners['*'] || []).forEach(fn => fn(state));
}
