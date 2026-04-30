/* ═══════════════════════════════════════
   pages/AhuDetail.js — AHU detail view
   ═══════════════════════════════════════ */
import { defaultDataPoints, defaultModes, tempStatus } from '../data/datapoints.js';
import { getState } from '../store.js';
import { navigate } from '../router.js';
import { renderSchematic } from '../utils/AhuSchematic.js';
import { open as openModal } from '../components/Modal.js';

function dpRow(dp) {
  const valCls = dp.isBinary
    ? (dp.value === 'ON' ? 'on' : 'off')
    : '';
  return /* html */`
  <div class="dp-row" data-dp-id="${dp.id}">
    <div class="dp-left">
      <span class="dp-ind ${dp.active ? 'on' : 'off'}"></span>
      <div class="dp-info">
        <div class="dp-name">${dp.name}</div>
        <div class="dp-addr">${dp.address}</div>
        <div class="dp-type"><span class="badge ${dp.typeClass}">${dp.type}</span>&nbsp;${dp.device}</div>
      </div>
    </div>
    <div class="dp-value ${valCls}">${dp.value}${dp.unit ? ' ' + dp.unit : ''}</div>
  </div>`;
}

function modeRows(rows) {
  return rows.map(r => /* html */`
  <div class="mode-row">
    <span class="mode-key">${r.key}</span>
    <span class="mode-val ${r.cls || ''}">${r.val}${r.unit || ''}</span>
  </div>`).join('');
}

function setRows(rows) {
  return rows.map(r => r.editable ? /* html */`
  <div class="set-row">
    <span class="set-key">${r.key}</span>
    <div class="set-val">
      <input class="set-num" type="number" value="${r.val}">
      <span class="set-unit">${r.unit}</span>
    </div>
  </div>` : /* html */`
  <div class="mode-row">
    <span class="mode-key">${r.key}</span>
    <span class="mode-val">${r.val}${r.unit}</span>
  </div>`).join('');
}

export function render(params = {}) {
  const { title = '공조기-19', sub = '' } = params;
  const dps = getState().dataPoints;
  const modes = defaultModes;

  return /* html */`
<div class="page active ahu-page" id="page-ahu">
  <div class="ahu-main">
    <button class="btn-back" id="ahu-back">← 냉온수기 현황</button>

    <div class="page-hdr">
      <h2>${title}</h2>
      <span class="sub">${sub}</span>
    </div>

    <div class="temp-boxes">
      <div class="temp-box">
        <div class="temp-box-title">좌측 실내온도</div>
        <div class="dr"><span class="dl">창측온도</span><span class="dv cool">23.3 °C</span></div>
        <div class="dr"><span class="dl">실내온도</span><span class="dv cool">23.5 °C</span></div>
      </div>
      <div class="temp-box">
        <div class="temp-box-title">우측 실내온도</div>
        <div class="dr"><span class="dl">창측온도</span><span class="dv cool">23.9 °C</span></div>
        <div class="dr"><span class="dl">실내온도</span><span class="dv cool">23.1 °C</span></div>
      </div>
    </div>

    <div class="schematic-wrap">
      <div class="schematic-lbl">공조기 계통도</div>
      ${renderSchematic()}
    </div>

    <div class="dp-panel">
      <div class="dp-panel-hdr">
        <span class="dp-panel-title">데이터 포인트</span>
        <span class="dp-panel-sub">실시간 · 클릭하여 값 조정</span>
      </div>
      ${dps.map(dpRow).join('')}
    </div>
  </div>

  <aside class="ahu-right">
    <div class="mode-section">
      <div class="section-title">운전모드</div>
      ${modeRows(modes.운전모드)}
    </div>
    <div class="mode-section">
      <div class="section-title">설정모드</div>
      ${setRows(modes.설정모드)}
    </div>
    <div class="mode-section">
      <div class="section-title" style="color:var(--cyan)">온도 현황</div>
      ${tempStatus.map(r => `
      <div class="mode-row">
        <span class="mode-key">${r.key}</span>
        <span class="mode-val ${r.cls}">${r.val}</span>
      </div>`).join('')}
    </div>
  </aside>
</div>`;
}

export function mount(el, params = {}) {
  el.querySelector('#ahu-back').addEventListener('click', () => navigate('overview'));

  // Data point rows → open modal
  el.querySelectorAll('.dp-row[data-dp-id]').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.dpId;
      const dp = getState().dataPoints.find(d => d.id === id);
      if (dp) openModal(dp);
    });
  });
}
