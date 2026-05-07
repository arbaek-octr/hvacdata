/* ═══════════════════════════════════════
   boilerZones.js — 장비 현황 이미지 클릭존
   boiler.png 위에 겹쳐지는 장비 영역 정의
   ═══════════════════════════════════════ */

export const BOILER_ZONES = [
  { id: 'boiler_ct',         label: 'CT-1 Control',        x: '4.4%',  y: '7.5%',  w: '12%', h: '82%' },
  { id: 'boiler_zone',       label: 'zone',                x: '27%',   y: '1%',    w: '47%', h: '22%' },
  { id: 'boiler_chs_header', label: 'CHS header',          x: '23%',   y: '30%',   w: '23%', h: '21%' },
  { id: 'boiler_chr_header', label: 'CHR header',          x: '64.2%', y: '28.9%', w: '22%', h: '20%' },
  { id: 'boiler_ch1',        label: 'CHP1-1',              x: '20%',   y: '49%',   w: '16%', h: '40%' },
  { id: 'boiler_ch2',        label: 'CHP1-2',              x: '35%',   y: '50%',   w: '16%', h: '39%' },
  { id: 'boiler_pump_ch',    label: '냉온수 펌프',          x: '52%',   y: '49%',   w: '11%', h: '31%' },
  { id: 'boiler_pump_geo',   label: '지열 2차 냉온수펌프', x: '82.7%', y: '54.2%', w: '15%', h: '46%' },
  { id: 'boiler_geo_system', label: '지열 시스템',          x: '68.6%', y: '73.1%', w: '13%', h: '27%' },
];
