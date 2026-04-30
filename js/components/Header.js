/* ═══════════════════════════════════════
   components/Header.js
   ═══════════════════════════════════════ */
import { building } from '../data/mock.js';
import { navigate } from '../router.js';

export function render() {
  return /* html */`
<header class="header">
  <span class="header-logo" id="header-logo">HVAC·MS</span>
  <div class="header-divider"></div>
  <span class="header-building">${building.fullName}</span>

  <nav class="header-nav">
    <button class="nav-tab active" data-route="overview">냉온수기</button>
    <button class="nav-tab" data-route="overview">공조기</button>
    <button class="nav-tab" data-route="overview">FCU</button>
    <button class="nav-tab" data-route="overview">에너지</button>
  </nav>

  <div class="header-right">
    <div class="status-pill ok">
      <span class="status-dot"></span>정상 운영중
    </div>
    <span class="clock" id="clock">--</span>
  </div>
</header>`;
}

export function mount(el) {
  // Clock
  function tick() {
    const n = new Date();
    const clk = el.querySelector('#clock');
    if (clk) clk.textContent =
      n.toLocaleDateString('ko-KR') + '  ' +
      n.toLocaleTimeString('ko-KR', { hour12: false });
  }
  tick();
  setInterval(tick, 1000);

  // Logo → home
  el.querySelector('#header-logo').addEventListener('click', () => navigate('overview'));

  // Nav tabs
  el.querySelectorAll('.nav-tab[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      navigate(btn.dataset.route);
    });
  });
}
