/* ═══════════════════════════════════════
   pages/Overview.js — Chiller overview
   ═══════════════════════════════════════ */
import { equipment, zones, outerEnv, sysPresure, alarms, ahuOverlay } from '../data/mock.js';
import { navigate } from '../router.js';
import { renderChart, renderSparkline } from '../utils/sparkChart.js';

function equipmentCard(eq) {
  const rows = eq.points.map(p =>
    `<div class="dr"><span class="dl">${p.label}</span><span class="dv ${p.cls}">${p.value}</span></div>`
  ).join('');
  return /* html */`
  <div class="eq-card">
    <div class="eq-header">
      <span class="eq-name">${eq.name}</span>
      <span class="tag tag-${eq.status}">${eq.statusLabel}</span>
    </div>
    ${rows}
  </div>`;
}

function zoneCard(z) {
  return /* html */`
  <div class="zone-card ${z.type}" data-zone-id="${z.id}"
       data-ahu-title="${z.ahuTitle}" data-ahu-sub="${z.ahuSub}">
    <div>
      <div class="zone-name">${z.name}</div>
      <div class="zone-sub">${z.sub}</div>
    </div>
    <span class="zone-arrow">›</span>
  </div>`;
}

function alarmItem(a) {
  const statusText = a.level === 'ok' ? '정상' : a.level === 'warn' ? '주의' : '오류';
  return /* html */`
  <div class="alarm-item">
    <span class="adot ${a.level}"></span>
    <span class="alarm-name">${a.label}</span>
    <span class="alarm-badge ${a.level}">${statusText}</span>
    <span class="alarm-arrow">›</span>
  </div>`;
}

function pressureRow(p) {
  return `<div class="dr"><span class="dl">${p.label}</span><span class="dv ${p.cls}">${p.value}</span></div>`;
}

function dataTag({ key, label, value, unit, x, y, type }) {
  return /* html */`
  <div class="data-tag dt-${type}" style="left:${x};top:${y}" data-key="${key}" draggable="true">
    <span class="dt-val">${value}</span><span class="dt-unit">${unit}</span>
    <div class="dt-label">${label}</div>
  </div>`;
}

function pipeGroup({ x, y, chrVal, chsVal, valveVal }) {
  return /* html */`
  <div class="pipe-group" style="left:${x};top:${y}">
    <div class="pg-row pg-chr">
      <span class="pg-dot chr"></span>
      <span class="pg-lbl">CHR</span>
      <span class="pg-val" data-key="chr_temp">${chrVal}</span>
    </div>
    <div class="pg-row pg-chs">
      <span class="pg-dot chs"></span>
      <span class="pg-lbl">CHS</span>
      <span class="pg-val" data-key="chs_temp">${chsVal}</span>
    </div>
    <div class="pg-valve" data-key="chs_valve">
      <span class="pg-valve-val">${valveVal}</span>
      <span class="pg-valve-unit">%</span>
      <span class="pg-valve-lbl">개도</span>
    </div>
  </div>`;
}

function hotspot({ x, y, dir, label, rows }) {
  const rowsHtml = rows.map(([k, v, cls = '']) =>
    `<div class="hc-row"><span class="hc-k">${k}</span><span class="hc-v ${cls}">${v}</span></div>`
  ).join('');
  return /* html */`
  <div class="hotspot" style="left:${x};top:${y}">
    <div class="hotspot-ring"></div>
    <div class="hotspot-dot"></div>
    <div class="hotspot-card hc-${dir}">
      <div class="hc-title">${label}</div>
      ${rowsHtml}
    </div>
  </div>`;
}

export function render() {
  const s = ahuOverlay.status;
  const spots = [
    {
      x: '8%', y: '38%', dir: 'right', label: 'EA — 배기구',
      rows: [
        ['배기 온도', '26.5 °C', ''],
        ['EA 댐퍼 개도', `${ahuOverlay.tags.find(t=>t.key==='ea_damper').value} %`, 'warn'],
        ['배기 풍량', '8,400 CMH', ''],
      ],
    },
    {
      x: '8%', y: '60%', dir: 'right', label: 'OA — 외기 흡입',
      rows: [
        ['외기 온도', `${outerEnv.temp} °C`, 'hot'],
        ['상대 습도', `${outerEnv.humidity} %`, ''],
        ['OA 댐퍼 개도', `${ahuOverlay.tags.find(t=>t.key==='oa_damper').value} %`, 'warn'],
      ],
    },
    {
      x: '90%', y: '28%', dir: 'left', label: 'RA — 환기 환수',
      rows: [
        ['환기 온도', ahuOverlay.tags.find(t=>t.key==='room_temp_right').value + ' °C', ''],
        ['환기 댐퍼', '개방', 'ok'],
        ['환기 풍량', '7,200 CMH', ''],
      ],
    },
    {
      x: '90%', y: '60%', dir: 'left', label: 'SA — 공조 급기 / 운전모드',
      rows: [
        ['급기 온도', ahuOverlay.tags.find(t=>t.key==='return_temp').value + ' °C', 'cool'],
        ['운전 모드', s.operation_mode, 'ok'],
        ['냉난방', s.cooling_heating, 'cool'],
        ['등급 상태', s.grade, 'ok'],
        ['엔탈피운전', s.enthalpy_op, s.enthalpy_op==='OFF'?'dim':'ok'],
        ['예열 운전', s.preheat_op, s.preheat_op==='OFF'?'dim':'ok'],
      ],
    },
    {
      x: '21%', y: '81%', dir: 'top', label: 'E/H — 전열 히터',
      rows: [
        ['히터 상태', '정지', 'dim'],
        ['코일 온도', '22.0 °C', ''],
        ['예열 운전', s.preheat_op, s.preheat_op==='OFF'?'dim':'warn'],
      ],
    },
    {
      x: '29%', y: '81%', dir: 'top', label: 'CHS/CHR — 냉수',
      rows: [
        ['냉수 공급', '7.0 °C', 'cool'],
        ['냉수 환수', '12.5 °C', 'cool'],
        ['CHS 밸브 개도', `${ahuOverlay.pipe.valveVal} %`, 'warn'],
      ],
    },
    {
      x: '42%', y: '79%', dir: 'top', label: 'HV — 가습기',
      rows: [
        ['가습기 상태', '운전', 'ok'],
        ['습도 설정', `${s.humid_setpoint} %`, ''],
        ['댐퍼 최소', `${s.damper_min} %`, ''],
      ],
    },
    {
      x: '47%', y: '32%', dir: 'top', label: '상부 팬 — 공급 설정',
      rows: [
        ['공급 온도', ahuOverlay.tags.find(t=>t.key==='supply_temp').value + ' °C', ''],
        ['온도 설정', `${s.temp_setpoint} °C`, 'cool'],
        ['외기 엔탈피', `${s.oa_enthalpy}`, ''],
        ['실내 엔탈피', `${s.room_enthalpy}`, ''],
      ],
    },
    {
      x: '66%', y: '57%', dir: 'top', label: '하부 팬 — 급기',
      rows: [
        ['환수 온도', ahuOverlay.tags.find(t=>t.key==='return_temp').value + ' °C', 'cool'],
        ['좌측 실내온도', ahuOverlay.tags.find(t=>t.key==='room_temp_left').value + ' °C', ''],
        ['좌측 습도', ahuOverlay.tags.find(t=>t.key==='room_humid_left').value + ' %', ''],
      ],
    },
  ];

  return /* html */`
<div class="page active ov-page" id="page-overview">
  <div class="ov-main">
    <div class="page-hdr">
      <h2>냉온수기 시스템</h2>
      <span class="sub">구로 G 밸리 · 업무시설 통합 현황</span>
    </div>

    <!-- Hero: interactive viewer (left) + data panels (right) -->
    <div class="ov-hero-layout">

      <!-- Left: Interactive image viewer -->
      <div class="ov-viewer">
        <div class="viewer-frame">
          <img class="viewer-main" id="viewer-main-img" src="${import.meta.env.BASE_URL}assets/hvac3d.png" alt="시스템 개요">
          ${ahuOverlay.tags.map(dataTag).join('')}
          ${spots.map(hotspot).join('')}
          <div class="viewer-status-badge">
            <span class="vstatus-dot"></span>시스템 정상 가동
          </div>
          <div class="viewer-mode-toggle">
            <button class="vmt-btn active" data-mode="chart">차트</button>
            <button class="vmt-btn" data-mode="edit">편집</button>
            <div class="vmt-sep"></div>
            <button class="vmt-btn vmt-add" id="tag-add-btn">＋ 태그</button>
            <button class="vmt-btn vmt-export" id="tag-export-btn" title="태그 설정 내보내기">↓ 내보내기</button>
          </div>
          <div class="tag-add-form" id="tag-add-form" style="display:none">
            <div class="taf-title">새 태그 추가</div>
            <input class="taf-input" id="taf-label" placeholder="라벨 (예: 공급온도)">
            <div class="taf-row">
              <input class="taf-input" id="taf-value" placeholder="값 (예: 24.0)">
              <input class="taf-input taf-unit" id="taf-unit" placeholder="단위">
            </div>
            <div class="taf-btns">
              <button class="taf-cancel" id="taf-cancel">취소</button>
              <button class="taf-ok" id="taf-ok">추가</button>
            </div>
          </div>
        </div>
        ${pipeGroup(ahuOverlay.pipe)}
        <div class="viewer-thumbs">
          <div class="vthumb active" data-src="${import.meta.env.BASE_URL}assets/hvac3d.png">
            <img src="${import.meta.env.BASE_URL}assets/hvac3d.png" alt="전체 현황">
            <span>전체 현황</span>
          </div>
          <div class="vthumb" data-src="${import.meta.env.BASE_URL}assets/boiler.png">
            <img src="${import.meta.env.BASE_URL}assets/boiler.png" alt="장비 현황">
            <span>장비 현황</span>
          </div>
        </div>
      </div>

      <!-- Right: Data column -->
      <div class="ov-data-col">

        <!-- Top row: 2 cards -->
        <div class="ov-cards-row">
          <div class="panel-card">
            <div class="panel-card-lbl">외기 환경</div>
            <div class="metric">
              <div class="metric-val">${outerEnv.temp}<span class="metric-unit">°C</span></div>
              <div class="metric-lbl">외기 온도</div>
            </div>
            <div class="divider"></div>
            <div class="metric">
              <div class="metric-val" style="color:var(--cyan)">${outerEnv.humidity}<span class="metric-unit">%</span></div>
              <div class="metric-lbl">상대 습도</div>
            </div>
          </div>

          <div class="panel-card">
            <div class="panel-card-lbl">시스템 압력</div>
            ${sysPresure.map(pressureRow).join('')}
          </div>
        </div>

        <!-- Middle: gauge card -->
        <div class="panel-card ov-gauge-card">
          <div class="panel-card-lbl">시스템 부하율</div>
          <div class="load-gauge">
            <svg viewBox="0 0 80 80" class="gauge-svg">
              <circle cx="40" cy="40" r="30" class="gauge-track"/>
              <circle cx="40" cy="40" r="30" class="gauge-fill"
                style="stroke-dasharray:188.5;stroke-dashoffset:52.8"/>
            </svg>
            <div class="gauge-center"><div class="gauge-val">72%</div></div>
          </div>
          <div class="load-lbl">현재 부하율</div>
        </div>

        <!-- Bottom: 경보 현황 -->
        <div class="panel-card ov-alarm-card">
          <div class="panel-card-lbl">경보 현황</div>
          ${alarms.map(alarmItem).join('')}
        </div>

      </div>
    </div>

    <!-- Equipment grid -->
    <div class="eq-grid">
      ${equipment.map(equipmentCard).join('')}
    </div>

    <!-- Zone section -->
    <div class="zone-section">
      <div class="zone-section-lbl">냉난방 구역 — 클릭하여 공조기 상세 보기</div>
      <div class="zone-grid">
        ${zones.map(zoneCard).join('')}
      </div>
    </div>

    <!-- Analysis panel -->
    <div class="analysis-panel">
      <div class="analysis-hdr">
        <div>
          <div class="analysis-title">센서 데이터</div>
          <div class="analysis-sub">AHU18 · 최근 7일 · 5분 간격 · 클릭하면 전체 차트 · 드래그하여 비교</div>
        </div>
        <div class="analysis-badge" id="analysis-badge">분석 준비 중</div>
      </div>
      <div class="analysis-vars" id="analysis-vars">
        <div class="avar-loading">데이터 로딩 중...</div>
      </div>
      <div class="analysis-compare" id="analysis-compare">
        <div class="compare-label">비교 분석</div>
        <div class="compare-drop" id="compare-drop">
          <div class="compare-empty" id="compare-empty">변수를 여기로 드래그하여 추가</div>
          <div class="compare-chips" id="compare-chips"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Chart modal -->
<div class="chart-modal" id="chart-modal">
  <div class="chart-modal-backdrop"></div>
  <div class="chart-modal-panel">
    <div class="chart-modal-header">
      <div>
        <span class="chart-modal-title" id="chart-modal-title">—</span>
        <span class="chart-modal-range">최근 7일</span>
      </div>
      <button class="chart-modal-close" id="chart-modal-close">×</button>
    </div>
    <div class="chart-modal-body" id="chart-modal-body"></div>
  </div>
</div>`;
}

const KEY_MAP = {
  supply_temp:     { key: 'supply_temp',     label: '공급 온도 (SDT)',     unit: '°C', color: '#2a6ef5' },
  return_temp:     { key: 'return_temp',     label: '환수 온도 (RDT)',     unit: '°C', color: '#f05a5a' },
  room_temp_left:  { key: 'room_temp_left',  label: '좌측 실내온도',       unit: '°C', color: '#00c48c' },
  room_temp_right: { key: 'room_temp_right', label: '우측 실내온도',       unit: '°C', color: '#00c48c' },
  room_humid_left: { key: 'outdoor_humidity', label: '외기 습도',           unit: '%',  color: '#9b6cf5' },
};

const TAG_POS_KEY      = 'hvac-tag-positions';
const TAG_OVERRIDE_KEY = 'hvac-tag-overrides';
const CUSTOM_TAGS_KEY  = 'hvac-custom-tags';
function loadTagPos()      { try { return JSON.parse(localStorage.getItem(TAG_POS_KEY)      || '{}'); } catch { return {}; } }
function saveTagPos(key, left, top) { const p = loadTagPos(); p[key] = { left, top }; localStorage.setItem(TAG_POS_KEY, JSON.stringify(p)); }
function loadOverrides()   { try { return JSON.parse(localStorage.getItem(TAG_OVERRIDE_KEY) || '{}'); } catch { return {}; } }
function saveOverride(key, val) { const o = loadOverrides(); o[key] = val; localStorage.setItem(TAG_OVERRIDE_KEY, JSON.stringify(o)); }
function loadCustomTags()  { try { return JSON.parse(localStorage.getItem(CUSTOM_TAGS_KEY)  || '[]'); } catch { return []; } }
function saveCustomTags(tags) { localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify(tags)); }

export function mount(el) {
  /* Apply saved tag positions & value overrides */
  const tagPositions = loadTagPos();
  const tagOverrides = loadOverrides();
  el.querySelectorAll('.data-tag[data-key]').forEach(tag => {
    const key = tag.dataset.key;
    const p = tagPositions[key];
    if (p) { tag.style.left = p.left; tag.style.top = p.top; }
    if (tagOverrides[key] !== undefined) {
      const valEl = tag.querySelector('.dt-val');
      if (valEl) valEl.textContent = tagOverrides[key];
    }
  });

  /* Thumbnail switcher */
  const mainImg = el.querySelector('#viewer-main-img');
  el.querySelectorAll('.vthumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      el.querySelectorAll('.vthumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.dataset.src;
    });
  });

  /* Zone card nav */
  el.querySelectorAll('.zone-card[data-zone-id]').forEach(card => {
    card.addEventListener('click', () => {
      navigate('ahu', {
        id:    card.dataset.zoneId,
        title: card.dataset.ahuTitle,
        sub:   card.dataset.ahuSub,
      });
    });
  });

  /* Shared data loader */
  let sensorData = null;
  async function loadData() {
    if (sensorData) return sensorData;
    const res = await fetch(`${import.meta.env.BASE_URL}data/sensor_data.json`);
    sensorData = await res.json();
    return sensorData;
  }

  /* Chart modal */
  const modal      = el.querySelector('#chart-modal');
  const modalTitle = el.querySelector('#chart-modal-title');
  const modalBody  = el.querySelector('#chart-modal-body');

  async function openChart(dataKey) {
    const cfg = KEY_MAP[dataKey];
    if (!cfg) return;
    modal.style.display = 'flex';
    modalTitle.textContent = cfg.label;
    modalBody.innerHTML = '<div style="text-align:center;padding:40px;color:#9aaac5">로딩 중...</div>';

    try {
      const data = await loadData();
      renderChart(modalBody, {
        timestamps: data.timestamps,
        values:     data[cfg.key],
        label:      cfg.label,
        unit:       cfg.unit,
        color:      cfg.color,
      });
    } catch {
      modalBody.innerHTML = '<div style="text-align:center;padding:40px;color:#f05a5a">데이터 로드 실패</div>';
    }
  }

  /* 차트 / 편집 모드 토글 */
  const viewerFrame = el.querySelector('.viewer-frame');
  let viewerMode = 'chart';
  el.querySelectorAll('.vmt-btn[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      viewerMode = btn.dataset.mode;
      el.querySelectorAll('.vmt-btn[data-mode]').forEach(b => b.classList.toggle('active', b === btn));
      viewerFrame.classList.toggle('tag-edit-mode', viewerMode === 'edit');
    });
  });

  /* Shared drag state */
  let dragTag = null, dragStartX, dragStartY, dragOrigLeft, dragOrigTop, didMove;

  function startDrag(tag, e) {
    dragTag = tag;
    didMove = false;
    const rect = viewerFrame.getBoundingClientRect();
    dragStartX   = e.clientX;
    dragStartY   = e.clientY;
    dragOrigLeft = (parseFloat(tag.style.left) / 100) * rect.width;
    dragOrigTop  = (parseFloat(tag.style.top)  / 100) * rect.height;
  }

  function editInline(el, className, onSave) {
    const prev = el.textContent;
    const input = document.createElement('input');
    input.className = className;
    input.value = prev;
    el.replaceWith(input);
    input.focus(); input.select();
    function commit() {
      const next = input.value.trim() || prev;
      const node = document.createElement(className === 'dt-val-input' ? 'span' : 'div');
      node.className = className === 'dt-val-input' ? 'dt-val' : 'dt-label';
      node.textContent = next;
      input.replaceWith(node);
      onSave(next, node);
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter')  { ev.preventDefault(); input.blur(); }
      if (ev.key === 'Escape') { input.value = prev;  input.blur(); }
    });
  }

  /* Default tag interactions */
  el.querySelectorAll('.data-tag[data-key]').forEach(tag => {
    const key = tag.dataset.key;
    tag.draggable = false;

    tag.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      startDrag(tag, e);
    });

    tag.addEventListener('click', () => {
      if (didMove) return;
      if (viewerMode === 'chart' && KEY_MAP[key]) openChart(key);
    });

    tag.addEventListener('dblclick', e => {
      if (viewerMode !== 'edit') return;
      e.stopPropagation();
      const valEl = tag.querySelector('.dt-val');
      if (valEl) editInline(valEl, 'dt-val-input', next => saveOverride(key, next));
    });
  });

  /* Custom tag helpers */
  function createCustomTagEl(ct) {
    const div = document.createElement('div');
    div.className = 'data-tag dt-custom';
    div.style.left = ct.x || '50%';
    div.style.top  = ct.y || '40%';
    div.dataset.customId = ct.id;
    div.innerHTML = `
      <span class="dt-val">${ct.value}</span><span class="dt-unit">${ct.unit}</span>
      <div class="dt-label">${ct.label}</div>
      <button class="dt-del" title="삭제">×</button>`;
    return div;
  }

  function attachCustomTagEvents(tag) {
    const id = tag.dataset.customId;
    tag.draggable = false;

    tag.addEventListener('mousedown', e => {
      if (e.button !== 0 || e.target.classList.contains('dt-del')) return;
      e.preventDefault();
      startDrag(tag, e);
    });

    tag.addEventListener('dblclick', e => {
      if (viewerMode !== 'edit') return;
      e.stopPropagation();
      const valEl = tag.querySelector('.dt-val');
      if (valEl) editInline(valEl, 'dt-val-input', next => {
        const ts = loadCustomTags(); const t = ts.find(t => t.id === id);
        if (t) { t.value = next; saveCustomTags(ts); }
      });
    });

    tag.querySelector('.dt-label').addEventListener('click', e => {
      if (viewerMode !== 'edit') return;
      e.stopPropagation();
      const lblEl = tag.querySelector('.dt-label');
      if (lblEl) editInline(lblEl, 'dt-label-input', next => {
        const ts = loadCustomTags(); const t = ts.find(t => t.id === id);
        if (t) { t.label = next; saveCustomTags(ts); }
      });
    });

    tag.querySelector('.dt-del').addEventListener('click', e => {
      e.stopPropagation();
      saveCustomTags(loadCustomTags().filter(t => t.id !== id));
      tag.remove();
    });
  }

  /* Render saved custom tags */
  loadCustomTags().forEach(ct => {
    const tagEl = createCustomTagEl(ct);
    viewerFrame.appendChild(tagEl);
    attachCustomTagEvents(tagEl);
  });

  /* + 태그 버튼 */
  const tagAddBtn  = el.querySelector('#tag-add-btn');
  const tagAddForm = el.querySelector('#tag-add-form');
  const tafLabel   = el.querySelector('#taf-label');
  const tafValue   = el.querySelector('#taf-value');
  const tafUnit    = el.querySelector('#taf-unit');

  el.querySelector('#tag-export-btn').addEventListener('click', () => {
    const data = {
      positions: loadTagPos(),
      overrides: loadOverrides(),
      custom:    loadCustomTags(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hvac-tags-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  tagAddBtn.addEventListener('click', () => {
    const open = tagAddForm.style.display !== 'none';
    tagAddForm.style.display = open ? 'none' : 'flex';
    if (!open) tafLabel.focus();
  });

  el.querySelector('#taf-cancel').addEventListener('click', () => {
    tagAddForm.style.display = 'none';
    tafLabel.value = ''; tafValue.value = ''; tafUnit.value = '';
  });

  function submitAddTag() {
    const label = tafLabel.value.trim();
    const value = tafValue.value.trim();
    const unit  = tafUnit.value.trim();
    if (!label && !value) return;
    const ct = { id: 'c' + Date.now().toString(36), label: label || '태그', value: value || '-', unit, x: '50%', y: '40%' };
    const ts = loadCustomTags(); ts.push(ct); saveCustomTags(ts);
    const tagEl = createCustomTagEl(ct);
    viewerFrame.appendChild(tagEl);
    attachCustomTagEvents(tagEl);
    tagAddForm.style.display = 'none';
    tafLabel.value = ''; tafValue.value = ''; tafUnit.value = '';
  }

  el.querySelector('#taf-ok').addEventListener('click', submitAddTag);
  [tafLabel, tafValue, tafUnit].forEach(inp =>
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') submitAddTag(); })
  );

  /* Shared drag handlers */
  document.addEventListener('mousemove', e => {
    if (!dragTag) return;
    const dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
    if (!didMove && Math.hypot(dx, dy) < 5) return;
    if (!didMove) { didMove = true; dragTag.classList.add('tag-moving'); }
    const rect = viewerFrame.getBoundingClientRect();
    dragTag.style.left = `${Math.max(0, Math.min(95, ((dragOrigLeft + dx) / rect.width)  * 100)).toFixed(1)}%`;
    dragTag.style.top  = `${Math.max(0, Math.min(95, ((dragOrigTop  + dy) / rect.height) * 100)).toFixed(1)}%`;
  });

  document.addEventListener('mouseup', () => {
    if (!dragTag) return;
    if (didMove) {
      const key = dragTag.dataset.key, cid = dragTag.dataset.customId;
      if (key) {
        saveTagPos(key, dragTag.style.left, dragTag.style.top);
      } else if (cid) {
        const ts = loadCustomTags(), t = ts.find(t => t.id === cid);
        if (t) { t.x = dragTag.style.left; t.y = dragTag.style.top; saveCustomTags(ts); }
      }
      dragTag.classList.remove('tag-moving');
    }
    dragTag = null;
  });

  el.querySelector('#chart-modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  el.querySelector('.chart-modal-backdrop').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.style.display = 'none';
  }, { once: false });

  /* Analysis panel — mini sparkline cards + drag-and-drop compare */
  const compareKeys = new Set();

  function updateCompareBadge() {
    const badge = el.querySelector('#analysis-badge');
    const empty = el.querySelector('#compare-empty');
    const n = compareKeys.size;
    if (n === 0) {
      badge.textContent = '분석 준비 중';
      badge.classList.remove('badge-ready');
      empty.style.display = '';
    } else {
      badge.textContent = n >= 2 ? `${n}개 변수 비교 준비` : `${n}개 선택됨`;
      badge.classList.toggle('badge-ready', n >= 2);
      empty.style.display = 'none';
    }
  }

  function addCompareChip(tagKey, cfg) {
    if (compareKeys.has(tagKey)) return;
    compareKeys.add(tagKey);
    const chips = el.querySelector('#compare-chips');
    const chip = document.createElement('div');
    chip.className = 'compare-chip';
    chip.dataset.key = tagKey;
    chip.style.setProperty('--chip-color', cfg.color);
    chip.innerHTML = `
      <span class="chip-dot"></span>
      <span class="chip-label">${cfg.label}</span>
      <span class="chip-unit">${cfg.unit}</span>
      <button class="chip-remove" title="제거">×</button>`;
    chip.querySelector('.chip-remove').addEventListener('click', e => {
      e.stopPropagation();
      compareKeys.delete(tagKey);
      chip.remove();
      el.querySelector(`.avar-card[data-key="${tagKey}"]`)?.classList.remove('selected');
      updateCompareBadge();
    });
    chips.appendChild(chip);
    el.querySelector(`.avar-card[data-key="${tagKey}"]`)?.classList.add('selected');
    updateCompareBadge();
  }

  async function initAnalysisPanel() {
    const container = el.querySelector('#analysis-vars');
    try {
      const data = await loadData();
      const vars = Object.entries(KEY_MAP);

      container.innerHTML = vars.map(([tagKey, cfg]) => {
        const vals  = data[cfg.key].filter(v => v !== null);
        const last  = vals.length ? vals[vals.length - 1].toFixed(1) : '—';
        const min   = vals.length ? Math.min(...vals).toFixed(1) : '—';
        const max   = vals.length ? Math.max(...vals).toFixed(1) : '—';
        const avg   = vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '—';
        return `
        <div class="avar-card" data-key="${tagKey}" style="--avar-color:${cfg.color}" draggable="true">
          <div class="avar-drag-hint">⠿</div>
          <div class="avar-top">
            <span class="avar-label">${cfg.label}</span>
            <span class="avar-unit">${cfg.unit}</span>
          </div>
          <div class="avar-spark" id="spark-${tagKey}"></div>
          <div class="avar-stats">
            <div class="avar-stat-item">
              <span class="avar-stat-lbl">현재</span>
              <span class="avar-stat-val" style="color:${cfg.color}">${last}</span>
            </div>
            <div class="avar-stat-item">
              <span class="avar-stat-lbl">평균</span>
              <span class="avar-stat-val">${avg}</span>
            </div>
            <div class="avar-stat-item">
              <span class="avar-stat-lbl">범위</span>
              <span class="avar-stat-val">${min}–${max}</span>
            </div>
          </div>
        </div>`;
      }).join('');

      vars.forEach(([tagKey, cfg]) => {
        renderSparkline(el.querySelector(`#spark-${tagKey}`), { values: data[cfg.key], color: cfg.color });
      });

      /* Drag handlers on cards */
      container.querySelectorAll('.avar-card').forEach(card => {
        card.addEventListener('click', () => openChart(card.dataset.key));
        card.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', card.dataset.key);
          e.dataTransfer.effectAllowed = 'copy';
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
      });

      /* Analysis panel = drop target (entire panel, not just compare zone) */
      const analysisPanel = el.querySelector('.analysis-panel');
      let dragDepth = 0;

      analysisPanel.addEventListener('dragenter', e => {
        if (!e.dataTransfer.types.includes('text/plain')) return;
        e.preventDefault();
        dragDepth++;
        analysisPanel.classList.add('drag-target');
      });
      analysisPanel.addEventListener('dragleave', () => {
        dragDepth--;
        if (dragDepth <= 0) { dragDepth = 0; analysisPanel.classList.remove('drag-target'); }
      });
      analysisPanel.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });
      analysisPanel.addEventListener('drop', e => {
        e.preventDefault();
        dragDepth = 0;
        analysisPanel.classList.remove('drag-target');
        const tagKey = e.dataTransfer.getData('text/plain');
        const cfg = KEY_MAP[tagKey];
        if (cfg) addCompareChip(tagKey, cfg);
      });

    } catch {
      container.innerHTML = '<div class="avar-loading" style="color:#f05a5a">데이터 로드 실패</div>';
    }
  }

  initAnalysisPanel();
}
