/* ═══════════════════════════════════════
   data/mock.js — Static HVAC device data
   ═══════════════════════════════════════ */

export const building = {
  name: '구로 G 밸리',
  type: '업무시설',
  fullName: '구로 G 밸리 (업무시설)',
};

export const outerEnv = {
  temp: 30.4,
  humidity: 83.8,
};

export const equipment = [
  {
    id: 'CHP-1-1', name: 'CHP-1-1 칠러', status: 'run', statusLabel: '기동',
    points: [
      { label: '등급체계',   value: '정상',    cls: 'ok' },
      { label: '가동온도-1', value: '31 °C',   cls: 'hot' },
      { label: '정지온도-1', value: '29 °C',   cls: '' },
      { label: '가동온도-2', value: '30 °C',   cls: 'hot' },
      { label: '정지온도-2', value: '28 °C',   cls: '' },
      { label: '공급온도',   value: '16.8 °C', cls: 'cool' },
    ],
  },
  {
    id: 'CHP-1-2', name: 'CHP-1-2 칠러', status: 'run', statusLabel: '기동',
    points: [
      { label: '등급체계',   value: '정상',    cls: 'ok' },
      { label: '가동온도-1', value: '31 °C',   cls: 'hot' },
      { label: '정지온도-1', value: '29 °C',   cls: '' },
      { label: '가동온도-2', value: '30 °C',   cls: 'hot' },
      { label: '정지온도-2', value: '28 °C',   cls: '' },
      { label: '공급온도',   value: '18.5 °C', cls: 'cool' },
    ],
  },
  {
    id: 'PUMP', name: '냉온수 펌프', status: 'run', statusLabel: '운전',
    points: [
      { label: '펌프-1',   value: '60.0 Hz', cls: 'cool' },
      { label: '펌프-2',   value: '55.0 Hz', cls: 'cool' },
      { label: '펌프-3',   value: '55.0 Hz', cls: 'cool' },
      { label: '환수온도', value: '18.8 °C', cls: '' },
      { label: '설정압력', value: '1.2 bar',  cls: 'warn' },
    ],
  },
  {
    id: 'CT-1-1', name: 'CT-1-1 냉각탑', status: 'run', statusLabel: '기동',
    points: [
      { label: '출구온도', value: '31.4 °C',  cls: 'hot' },
      { label: '입구온도', value: '33.1 °C',  cls: 'hot' },
      { label: '공급압력', value: '12.8 bar', cls: 'warn' },
      { label: '헤더압력', value: '1.4 bar',  cls: 'warn' },
    ],
  },
  {
    id: 'CT-1-2', name: 'CT-1-2 냉각탑', status: 'run', statusLabel: '기동',
    points: [
      { label: '출구온도', value: '31.9 °C',  cls: 'hot' },
      { label: '입구온도', value: '30.8 °C',  cls: 'hot' },
      { label: '환수헤더', value: '11.9 bar', cls: 'warn' },
      { label: '압력차',   value: '0.8 bar',  cls: 'cool' },
    ],
  },
  {
    id: 'GEO', name: '지열 시스템', status: 'run', statusLabel: '운전',
    points: [
      { label: '공급온도',       value: '12.2 °C', cls: 'cool' },
      { label: '환수온도',       value: '10.8 °C', cls: 'cool' },
      { label: '지열펌프-1',    value: '운전',    cls: 'ok' },
      { label: '2차 공급온도',  value: '12.2 °C', cls: 'cool' },
    ],
  },
];

export const zones = [
  {
    id: 'ahu19',
    name: '5F-20F 업무시설 외주부 냉난방용',
    sub: '북측존 · 공조기-19',
    type: 'cool',
    ahuTitle: '공조기-19',
    ahuSub: '5F-20F 업무시설 외주부 냉난방용 (북측존)',
  },
  {
    id: 'ahu20',
    name: '3F-20F 업무시설 외주부 냉난방용',
    sub: '남측존 · 공조기-20',
    type: 'cool',
    ahuTitle: '공조기-20',
    ahuSub: '3F-20F 업무시설 외주부 냉난방용 (남측존)',
  },
  {
    id: 'ahu21',
    name: '6F-20F 업무시설 내주부 냉난방용',
    sub: '내주부존 · 공조기-21',
    type: 'cool',
    ahuTitle: '공조기-21',
    ahuSub: '6F-20F 업무시설 내주부 냉난방용',
  },
  {
    id: 'ahu22',
    name: '1F-5F 로비/업무시설 내주부 냉난방용',
    sub: '저층부 · 공조기-22',
    type: 'heat',
    ahuTitle: '공조기-22',
    ahuSub: '1F-5F 로비/업무시설 내주부 냉난방용',
  },
];

export const sysPresure = [
  { label: '공급 헤더', value: '12.8 bar', cls: 'warn' },
  { label: '환수 헤더', value: '11.9 bar', cls: 'warn' },
  { label: '압력차',    value: '0.8 bar',  cls: 'cool' },
  { label: '냉온수 공급', value: '1.4 bar', cls: 'cool' },
  { label: '지열 공급', value: '5.4 bar',  cls: '' },
];

/* ─────────────────────────────────────────
   AHU 다이어그램 오버레이 데이터
   향후 실시간 API key 기준으로 바인딩 예정
   ───────────────────────────────────────── */
export const ahuOverlay = {
  /* 항상 표시되는 값 라벨 (data-tag) */
  tags: [
    /* 상단 측정 포인트 (AHU 상부 센서 스틱) */
    { key: 'room_temp_left',  label: '좌측 실내온도', value: '23.5', unit: '°C', x: '59.3%', y: '42.8%', type: 'temp'  },
    { key: 'room_humid_left', label: '좌측 습도',     value: '70.1', unit: '%',  x: '45%',   y: '13%',   type: 'humid' },
    { key: 'room_temp_right', label: '우측 실내온도', value: '23.9', unit: '°C', x: '72.2%', y: '26.2%', type: 'temp'  },
    /* 하부 AHU 덕트 내 측정 포인트 */
    { key: 'supply_temp',     label: '공급온도',       value: '24.0', unit: '°C', x: '35.9%', y: '59.1%', type: 'temp'  },
    { key: 'return_temp',     label: '환수온도',       value: '20.4', unit: '°C', x: '56%',   y: '68.9%', type: 'temp'  },
    /* 댐퍼 — EA/OA 개구부 근처 */
    { key: 'ea_damper',       label: 'EA 댐퍼',        value: '0.0',  unit: '%',  x: '16%', y: '38%', type: 'valve' },
    { key: 'oa_damper',       label: 'OA 댐퍼',        value: '0.0',  unit: '%',  x: '16%', y: '60%', type: 'valve' },
  ],
  /* CHR/CHS 파이프 그룹 */
  pipe: {
    x: '27%', y: '82%',
    chrVal: '12.5 °C',   // 냉수 환수온도
    chsVal: '7.0 °C',    // 냉수 공급온도
    valveVal: '100',     // 밸브 개도 %
  },

  /* hover 카드용 확장 데이터 (hotspot rows에 매핑) */
  status: {
    operation_mode:  '자동운전',
    grade:           '정상',
    cooling_heating: '냉방',
    enthalpy_op:     'OFF',
    preheat_op:      'OFF',
    temp_setpoint:   23,
    humid_setpoint:  0,
    damper_min:      0,
    oa_enthalpy:     7.2,
    room_enthalpy:   5.7,
  },
};

export const alarms = [
  { label: 'CHP-1-1 정상',       level: 'ok' },
  { label: 'CHP-1-2 정상',       level: 'ok' },
  { label: '냉온수 펌프 정상',   level: 'ok' },
  { label: 'CT-1-1 주의 확인필요', level: 'warn' },
  { label: '지열 시스템 정상',   level: 'ok' },
];
