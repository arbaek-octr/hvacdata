/* ═══════════════════════════════════════
   data/datapoints.js — AHU data points
   Image #11 "Loads" list style data
   ═══════════════════════════════════════ */

// Default data points shared by all AHUs (can be overridden per unit)
export const defaultDataPoints = [
  {
    id: 'dp-1',
    name: 'Heating Valve',
    address: 'DDC05.W.FCU.5F.L.FSV',
    type: 'AO', typeClass: 'badge-ao',
    device: 'FCU-5F',
    value: '0.0', unit: '%',
    active: true,
  },
  {
    id: 'dp-2',
    name: 'Room Temperature (Left)',
    address: 'DDC05.W.FCU.5F.L.RT1',
    type: 'AI 4', typeClass: 'badge-ai',
    device: 'FCU-5F',
    value: '29.0', unit: '°C',
    active: true,
  },
  {
    id: 'dp-3',
    name: 'Room Temperature (Right)',
    address: 'DDC05.W.FCU.5F.L.RT2',
    type: 'AI 5', typeClass: 'badge-ai',
    device: 'FCU-5F',
    value: '22.2', unit: '°C',
    active: true,
  },
  {
    id: 'dp-4',
    name: 'Equipment Start/Stop',
    address: 'DDC05.W.FCU.5F.L.SS',
    type: 'BO', typeClass: 'badge-bo',
    device: 'FCU-5F',
    value: 'OFF', unit: '',
    active: false,
    isBinary: true,
  },
  {
    id: 'dp-5',
    name: 'Supply Air Temperature',
    address: 'DDC05.W.AHU.19.SAT',
    type: 'AI 1', typeClass: 'badge-ai',
    device: 'AHU-19',
    value: '20.4', unit: '°C',
    active: true,
  },
  {
    id: 'dp-6',
    name: 'Return Air Temperature',
    address: 'DDC05.W.AHU.19.RAT',
    type: 'AI 2', typeClass: 'badge-ai',
    device: 'AHU-19',
    value: '23.5', unit: '°C',
    active: true,
  },
  {
    id: 'dp-7',
    name: 'Return Air Humidity',
    address: 'DDC05.W.AHU.19.RAH',
    type: 'AI 3', typeClass: 'badge-ai',
    device: 'AHU-19',
    value: '70.1', unit: '%',
    active: true,
  },
  {
    id: 'dp-8',
    name: 'Cooling Valve (CHW)',
    address: 'DDC05.W.AHU.19.CWV',
    type: 'AO', typeClass: 'badge-ao',
    device: 'AHU-19',
    value: '100.0', unit: '%',
    active: true,
  },
  {
    id: 'dp-9',
    name: 'OA Damper Position',
    address: 'DDC05.W.AHU.19.OAD',
    type: 'AO', typeClass: 'badge-ao',
    device: 'AHU-19',
    value: '0.0', unit: '%',
    active: true,
  },
  {
    id: 'dp-10',
    name: 'Supply Fan Status',
    address: 'DDC05.W.AHU.19.SFS',
    type: 'BI', typeClass: 'badge-bi',
    device: 'AHU-19',
    value: 'ON', unit: '',
    active: true,
    isBinary: true,
  },
];

// AHU operating modes (right panel)
export const defaultModes = {
  운전모드: [
    { key: '자동운전',   val: '자동기동', cls: 'on' },
    { key: '등급체계',   val: '정상',     cls: 'on' },
    { key: '냉난방절환', val: '냉방',     cls: 'cool' },
    { key: '엔탈피운전', val: 'OFF',      cls: 'off' },
    { key: '예열운전',   val: 'OFF',      cls: 'off' },
  ],
  설정모드: [
    { key: '온도설정',   val: '23',  unit: '°C', editable: true },
    { key: '습도설정',   val: '0',   unit: '%',  editable: true },
    { key: '댐퍼최소치', val: '0',   unit: '%',  editable: true },
    { key: '외기엔탈피', val: '7.2', unit: '' },
    { key: '실내엔탈피', val: '5.7', unit: '' },
  ],
};

export const tempStatus = [
  { key: '창측 L', val: '23.3 °C', cls: 'cool' },
  { key: '실내 L', val: '23.5 °C', cls: 'cool' },
  { key: '창측 R', val: '23.9 °C', cls: 'cool' },
  { key: '실내 R', val: '23.1 °C', cls: 'cool' },
];
