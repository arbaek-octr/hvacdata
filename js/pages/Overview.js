/* ═══════════════════════════════════════
   pages/Overview.js — Chiller overview
   ═══════════════════════════════════════ */
import { equipment, zones, outerEnv, sysPresure, alarms, ahuOverlay } from '../data/mock.js';
import { navigate } from '../router.js';

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
  <div class="data-tag dt-${type}" style="left:${x};top:${y}" data-key="${key}">
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
        </div>
        ${pipeGroup(ahuOverlay.pipe)}
        <div class="viewer-thumbs">
          <div class="vthumb active" data-src="${import.meta.env.BASE_URL}assets/hvac3d.png">
            <img src="${import.meta.env.BASE_URL}assets/hvac3d.png" alt="전체 현황">
            <span>전체 현황</span>
          </div>
          <div class="vthumb" data-src="${import.meta.env.BASE_URL}assets/hero2.png">
            <img src="${import.meta.env.BASE_URL}assets/hero2.png" alt="장비 현황">
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
  </div>
</div>`;
}

export function mount(el) {
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
}
