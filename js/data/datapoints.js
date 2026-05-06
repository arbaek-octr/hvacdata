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

export const DEFAULT_CUSTOM_TAGS = [
  { id: 'cmotlwn3b', label: '배기댐퍼',       varname: 'W.AHU{AHU}.EADM',    value: '0.0',  unit: '%',     x: '15.8%', y: '35.7%' },
  { id: 'cmotm57c7', label: '외기댐퍼',       varname: 'W.AHU{AHU}.OADM',    value: '0.0',  unit: '%',     x: '15.7%', y: '59.5%' },
  { id: 'cmotm683t', label: '혼합댐퍼',       varname: 'W.AHU{AHU}.MDM',     value: '100.0',unit: '%',     x: '24%',   y: '46.3%' },
  { id: 'cmotm7rsg', label: '설정온도',       varname: 'W.AHU{AHU}.TSET',    value: '-',    unit: '°C',    x: '19.2%', y: '7.3%'  },
  { id: 'cmotmsegm', label: '댐퍼설정',       varname: 'W.AHU{AHU}.DMSET',   value: '-',    unit: '%',     x: '15.9%', y: '68.1%' },
  { id: 'cmotmwwqa', label: '혼합온도',       varname: 'W.AHU{AHU}.MDT',     value: '-',    unit: '°C',    x: '32.9%', y: '59.1%' },
  { id: 'cmotn03ri', label: '운전명령',       varname: 'W.AHU{AHU}.RUN',     value: '-',    unit: 'on/off',x: '12%',   y: '7.4%'  },
  { id: 'cmotn4zsk', label: '환기팬 상태',    varname: 'W.AHU{AHU}.RFST',    value: '-',    unit: 'on/off',x: '46.9%', y: '21.5%' },
  { id: 'cmotn9tsx', label: '환기온도',       varname: 'W.AHU{AHU}.RDT',     value: '-',    unit: '°C',    x: '71.4%', y: '32.2%' },
  { id: 'cmotnagjf', label: '환기습도',       varname: 'W.AHU{AHU}RDH',      value: '-',    unit: '%',     x: '71.4%', y: '37.8%' },
  { id: 'cmotnbmp1', label: '급기팬 상태',    varname: 'W.AHU{AHU}.SFST',    value: '-',    unit: 'on/off',x: '65.5%', y: '67.3%' },
  { id: 'cmotncswh', label: '급기온도',       varname: 'W.AHU{AHU}.SDT',     value: '-',    unit: '°C',    x: '71.5%', y: '57.3%' },
  { id: 'cmotng5fu', label: '전정실내온도',   varname: 'W.FCU.{FCU}F.L.RT1', value: '-',    unit: '°C',    x: '25.9%', y: '81.2%' },
  { id: 'cmotnh780', label: '벽부실내온도',   varname: 'W.FCU.{FCU}F.L.RT2', value: '-',    unit: '°C',    x: '25.4%', y: '89.5%' },
  { id: 'cmotni2js', label: '벽부실내온도',   varname: 'W.FCU.{FCU}F.R.RT2', value: '-',    unit: '°C',    x: '78.8%', y: '88.1%' },
  { id: 'cmotnjgr8', label: '전정실내온도',   varname: 'W.FCU.{FCU}F.R.RT1', value: '-',    unit: '°C',    x: '78.8%', y: '80.7%' },
  { id: 'cmoto2l26', label: '난방밸브',       varname: 'W.FCU.{FCU}F.L.FSV', value: '-',    unit: '%',     x: '37.5%', y: '88.1%' },
  { id: 'cmoto2y9l', label: '냉방밸브',       varname: 'W.FCU.{FCU}F.L.FCV', value: '-',    unit: '%',     x: '37.7%', y: '80.5%' },
  { id: 'cmoto3tqy', label: '난방밸브',       varname: 'W.FCU.{FCU}F.R.FSV', value: '-',    unit: '%',     x: '88.4%', y: '88.3%' },
  { id: 'cmoto49c2', label: '냉방밸브',       varname: 'W.FCU.{FCU}F.R.FCV', value: '-',    unit: '%',     x: '88.3%', y: '80.5%' },
  { id: 'cmoto4y7w', label: '구역1 설정온도', varname: 'W.FCU.{FCU}F.TSET1', value: '-',    unit: '°C',    x: '12.8%', y: '82%'   },
  { id: 'cmoto5skx', label: '구역2 설정온도', varname: 'W.FCU.{FCU}F.TSET2', value: '-',    unit: '°C',    x: '62.2%', y: '80.6%' },
  { id: 'cmoto6vos', label: '기동상태',       varname: 'W.FCU.{FCU}F.L.ST',  value: '-',    unit: 'on/off',x: '12.8%', y: '90.4%' },
  { id: 'cmoto7kj8', label: '기동상태',       varname: 'W.FCU.{FCU}F.R.ST',  value: '-',    unit: 'on/off',x: '62%',   y: '88.3%' },
];
