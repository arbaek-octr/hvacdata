/* ═══════════════════════════════════════
   components/Sidebar.js
   ═══════════════════════════════════════ */
import { navigate } from '../router.js';

const AHU_COUNT = 19;

export function render() {
  const ahuButtons = Array.from({ length: AHU_COUNT }, (_, i) => {
    const n = i + 1;
    return `<button class="sb-grid-btn" data-ahu="AHU-${n}">AHU${n}</button>`;
  }).join('');

  return /* html */`
<div class="sidebar">
  <div class="sb-section">
    <div class="sb-label">공조기 (AHU)</div>
    <div class="sb-grid">${ahuButtons}</div>
  </div>
  <div class="sb-section">
    <button class="sb-item active" data-route="overview">
      <span class="sb-icon">❄</span>냉온수기
    </button>
    <button class="sb-item" data-route="overview">
      <span class="sb-icon">💧</span>FCU
    </button>
    <button class="sb-item" data-route="overview">
      <span class="sb-icon">⬇</span>배 수
    </button>
    <button class="sb-item" data-route="overview">
      <span class="sb-icon">🔥</span>급 탕
    </button>
    <button class="sb-item" data-route="overview">
      <span class="sb-icon">💦</span>우수조
    </button>
    <button class="sb-item" data-route="overview">
      <span class="sb-icon">↕</span>급배기
    </button>
  </div>
  <div class="sb-section">
    <div class="sb-label">층별</div>
    <button class="sb-item">B1F</button>
    <button class="sb-item">B2F</button>
    <button class="sb-item">B3F</button>
    <button class="sb-item">B4F</button>
  </div>
  <div class="sb-section">
    <button class="sb-item">
      <span class="sb-icon">☰</span>공조기 전체
    </button>
  </div>
</div>`;
}

export function mount(el) {
  // AHU grid buttons
  el.querySelectorAll('.sb-grid-btn[data-ahu]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.sb-grid-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      navigate('ahu', { id: btn.dataset.ahu, title: btn.dataset.ahu, sub: '공조기 상세 현황' });
    });
  });

  // Sidebar main items
  el.querySelectorAll('.sb-item[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.sb-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      navigate(btn.dataset.route);
    });
  });
}
