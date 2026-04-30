/* ═══════════════════════════════════════
   utils/AhuSchematic.js
   Clean engineering-diagram style AHU schematic
   ═══════════════════════════════════════ */

/* Standard HVAC engineering symbols as SVG fragments */
function fanSymbol(cx, cy, r, color = '#e2eaff') {
  const blades = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
    const rad = (deg * Math.PI) / 180;
    const x2 = cx + Math.cos(rad) * r * 0.92;
    const y2 = cy + Math.sin(rad) * r * 0.92;
    return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
  }).join('');
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2"/>
  ${blades}
  <circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${color}"/>`;
}

function coilSymbol(x, y, w, h, color, rows = 5) {
  const rowH = h / rows;
  const waves = Array.from({ length: rows }, (_, i) => {
    const ry = y + rowH * i + rowH / 2;
    const pts = [];
    const segs = 7;
    for (let s = 0; s <= segs; s++) {
      const px = x + (w / segs) * s;
      const py = ry + (s % 2 === 0 ? -rowH * 0.3 : rowH * 0.3);
      pts.push(`${s === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return `<path d="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="1.5" rx="2"/>${waves}`;
}

function damperSymbol(x, y, w, h, pct = 100) {
  const blades = 4;
  const bh = h / blades;
  const angle = ((100 - pct) / 100) * 60;
  const bls = Array.from({ length: blades }, (_, i) => {
    const by = y + bh * i + bh / 2;
    const dx = Math.tan((angle * Math.PI) / 180) * bh * 0.45;
    return `<line x1="${x + dx}" y1="${by - bh * 0.42}" x2="${x + w - dx}" y2="${by + bh * 0.42}" stroke="#7ab8ff" stroke-width="2.2" stroke-linecap="round"/>`;
  }).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#3a6aaa" stroke-width="1.5" rx="2"/>${bls}`;
}

function filterSymbol(x, y, w, h) {
  const cols = 6;
  const rows = 5;
  const lines = [];
  for (let c = 1; c < cols; c++) {
    const fx = x + (w / cols) * c;
    lines.push(`<line x1="${fx}" y1="${y}" x2="${fx}" y2="${y + h}" stroke="#7ab8ff" stroke-width="1.2" opacity="0.7"/>`);
  }
  for (let r = 1; r < rows; r++) {
    const fy = y + (h / rows) * r;
    lines.push(`<line x1="${x}" y1="${fy}" x2="${x + w}" y2="${fy}" stroke="#7ab8ff" stroke-width="1.2" opacity="0.7"/>`);
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="rgba(20,40,100,0.4)" stroke="#3a6aaa" stroke-width="1.5" rx="2"/>
  ${lines.join('')}`;
}

function humidifier(x, y, w, h) {
  const streams = 5;
  const sw = w / (streams + 1);
  const drops = Array.from({ length: streams }, (_, i) => {
    const sx = x + sw * (i + 1);
    return `<line x1="${sx}" y1="${y + h * 0.25}" x2="${sx}" y2="${y + h * 0.8}" stroke="#40b8ff" stroke-width="1.8" stroke-dasharray="3,3" stroke-linecap="round"/>
    <circle cx="${sx}" cy="${y + h * 0.22}" r="2.5" fill="#40b8ff" opacity="0.7"/>`;
  }).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#3a6aaa" stroke-width="1.5" rx="2"/>
  <line x1="${x + 4}" y1="${y + h}" x2="${x + w - 4}" y2="${y + h}" stroke="#40b8ff" stroke-width="2"/>
  ${drops}`;
}

function label(x, y, text, sub = '', color = '#7ab8ff') {
  const subLine = sub ? `<text x="${x}" y="${y + 13}" fill="#aac4e8" font-size="9" text-anchor="middle" font-family="monospace">${sub}</text>` : '';
  return `<text x="${x}" y="${y}" fill="${color}" font-size="10" font-weight="600" text-anchor="middle" font-family="Inter,sans-serif">${text}</text>${subLine}`;
}

function valueTag(x, y, text, accent = '#7ab8ff') {
  return `<rect x="${x - 28}" y="${y - 11}" width="56" height="16" rx="3" fill="rgba(8,18,52,0.85)" stroke="${accent}" stroke-width="1"/>
  <text x="${x}" y="${y + 1}" fill="${accent}" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
}

export function renderSchematic() {
  /* Layout constants */
  const UY = 50;   /* upper duct top */
  const UH = 76;   /* upper duct height */
  const LY = 210;  /* lower duct top */
  const LH = 90;   /* lower duct height */
  const MX = 162;  /* mixing box left */
  const MW = 72;   /* mixing box width */
  const LBLY = LY + LH + 22; /* label row y */
  const VALY = LBLY + 16;    /* value tag y */

  /* Component x positions (lower duct) */
  const OA_X  = 50;
  const FLT_X = 258;
  const EH_X  = 330;
  const CHW_X = 410;
  const HC_X  = 510;
  const HV_X  = 600;
  const FAN_X = 700;
  const SA_X  = 920;

  /* Upper duct component x */
  const EA_X  = 50;
  const RF_CX = 540;
  const RA_X  = 920;

  return /* html */`
<svg viewBox="0 0 1060 390" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;height:auto;background:#080e24;border-radius:10px;display:block;">
<defs>
  <linearGradient id="sGDuct" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0e1a3a"/><stop offset="100%" stop-color="#09102a"/>
  </linearGradient>
  <linearGradient id="sGFan" cx="35%" cy="35%" r="65%" gradientUnits="objectBoundingBox">
    <stop offset="0%" stop-color="#d0e4ff"/><stop offset="100%" stop-color="#3a5888"/>
  </linearGradient>
  <filter id="sGlow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <marker id="arrowB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="#5a9fff"/>
  </marker>
  <marker id="arrowG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="#00e5a0"/>
  </marker>
  <marker id="arrowO" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="#ff9040"/>
  </marker>
</defs>

<!-- ═══ BACKGROUND GRID ═══ -->
<rect x="0" y="0" width="1060" height="390" rx="10" fill="#080e24"/>
<g stroke="#111a3a" stroke-width="1" opacity="0.5">
${Array.from({length:27}, (_,i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="390"/>`).join('')}
${Array.from({length:10}, (_,i) => `<line x1="0" y1="${i*40}" x2="1060" y2="${i*40}"/>`).join('')}
</g>

<!-- ═══ UPPER DUCT (Return / Exhaust) ═══ -->
<rect x="${MX + MW}" y="${UY}" width="${SA_X - (MX + MW) - 14}" height="${UH}"
      fill="url(#sGDuct)" stroke="#1e3a78" stroke-width="1.5" rx="3"/>
<!-- upper duct left segment EA→Mixing -->
<rect x="${EA_X + 30}" y="${UY}" width="${MX - (EA_X + 30) + 2}" height="${UH}"
      fill="url(#sGDuct)" stroke="#1e3a78" stroke-width="1.5" rx="3"/>

<!-- ═══ MIXING BOX ═══ -->
<rect x="${MX}" y="${UY - 4}" width="${MW}" height="${UH + LH + 14 - UY + LY + UY - UY + UH - UH + 94}"
      fill="#0b1530" stroke="#2a4898" stroke-width="2" rx="4"/>
<!-- actual mixing box -->
<rect x="${MX}" y="${UY}" width="${MW}" height="${LY + LH - UY}"
      fill="rgba(18,30,72,0.7)" stroke="#2a5080" stroke-width="1.5" rx="3"/>
<text x="${MX + MW / 2}" y="${(UY + LY + LH) / 2 + 5}" fill="#3a5888" font-size="9"
      font-weight="700" text-anchor="middle" font-family="Inter,sans-serif" letter-spacing="1">MIX</text>

<!-- ═══ LOWER DUCT (Supply Air) ═══ -->
<rect x="${MX + MW - 2}" y="${LY}" width="${SA_X - (MX + MW) - 12}" height="${LH}"
      fill="url(#sGDuct)" stroke="#1e3a78" stroke-width="1.5" rx="3"/>

<!-- ═══ AIRFLOW LINES ═══ -->
<!-- OA enters lower duct from left -->
<line x1="${OA_X - 4}" y1="${LY + LH/2}" x2="${MX}" y2="${LY + LH/2}"
      stroke="#00e5a0" stroke-width="2" marker-end="url(#arrowG)"/>
<!-- Supply air flows right -->
<line x1="${MX + MW}" y1="${LY + LH/2}" x2="${FLT_X - 2}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${FLT_X + 38}" y1="${LY + LH/2}" x2="${EH_X - 2}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${EH_X + 42}" y1="${LY + LH/2}" x2="${CHW_X - 2}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${CHW_X + 68}" y1="${LY + LH/2}" x2="${HC_X - 2}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${HC_X + 56}" y1="${LY + LH/2}" x2="${HV_X - 2}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${HV_X + 40}" y1="${LY + LH/2}" x2="${FAN_X - 46}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="1.5" marker-end="url(#arrowB)" stroke-dasharray="6,3"/>
<line x1="${FAN_X + 46}" y1="${LY + LH/2}" x2="${SA_X - 4}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="2" marker-end="url(#arrowB)"/>
<!-- Return air flows left in upper duct -->
<line x1="${RA_X - 4}" y1="${UY + UH/2}" x2="${RF_CX + 44}" y2="${UY + UH/2}"
      stroke="#ff9040" stroke-width="1.5" marker-end="url(#arrowO)" stroke-dasharray="6,3"/>
<line x1="${RF_CX - 44}" y1="${UY + UH/2}" x2="${MX + MW + 2}" y2="${UY + UH/2}"
      stroke="#ff9040" stroke-width="1.5" stroke-dasharray="6,3"/>
<!-- EA exits left upper -->
<line x1="${MX + 2}" y1="${UY + UH/2}" x2="${EA_X + 4}" y2="${UY + UH/2}"
      stroke="#ff9040" stroke-width="2"/>

<!-- ═══ OA INLET LOUVER ═══ -->
${damperSymbol(OA_X - 30, LY + 8, 30, LH - 16, 100)}
<text x="${OA_X - 16}" y="${LY - 10}" fill="#00e5a0" font-size="11" font-weight="700"
      text-anchor="middle" font-family="monospace">OA</text>
<polyline points="${OA_X - 30},${LY + 8} ${OA_X - 40},${LY - 5} ${OA_X - 20},${LY - 5}"
          fill="none" stroke="#00e5a0" stroke-width="1" opacity="0.5"/>

<!-- ═══ EA OUTLET LOUVER ═══ -->
${damperSymbol(EA_X - 30, UY + 8, 30, UH - 16, 100)}
<text x="${EA_X - 16}" y="${UY - 10}" fill="#ff9040" font-size="11" font-weight="700"
      text-anchor="middle" font-family="monospace">EA</text>

<!-- ═══ RA INLET ═══ -->
<text x="${SA_X + 18}" y="${UY + UH/2 + 4}" fill="#ff9040" font-size="11" font-weight="700"
      text-anchor="start" font-family="monospace">RA</text>
<line x1="${SA_X}" y1="${UY + UH/2}" x2="${SA_X + 14}" y2="${UY + UH/2}"
      stroke="#ff9040" stroke-width="2" marker-end="url(#arrowO)"/>

<!-- ═══ SA OUTLET ═══ -->
<text x="${SA_X + 18}" y="${LY + LH/2 + 4}" fill="#5a9fff" font-size="11" font-weight="700"
      text-anchor="start" font-family="monospace">SA</text>
<line x1="${SA_X}" y1="${LY + LH/2}" x2="${SA_X + 14}" y2="${LY + LH/2}"
      stroke="#5a9fff" stroke-width="2" marker-end="url(#arrowB)"/>

<!-- ═══ OA DAMPER ═══ -->
${damperSymbol(MX + 6, LY + 10, 26, LH - 20, 100)}
${label(MX + 19, LBLY, 'OA 댐퍼')}
${valueTag(MX + 19, VALY, '100%', '#00e5a0')}

<!-- ═══ RA DAMPER (upper mixing) ═══ -->
${damperSymbol(MX + 6, UY + 10, 26, UH - 20, 0)}
${label(MX + 19, UY - 14, 'RA 댐퍼')}

<!-- ═══ FILTER ═══ -->
${filterSymbol(FLT_X, LY + 8, 36, LH - 16)}
${label(FLT_X + 18, LBLY, '필터')}

<!-- ═══ ELECTRIC HEATER (E/H) ═══ -->
<rect x="${EH_X}" y="${LY + 8}" width="40" height="${LH - 16}" fill="rgba(40,18,4,0.5)" stroke="#b06018" stroke-width="1.5" rx="2"/>
${Array.from({length:5}, (_,i) => {
  const ex = EH_X + 6 + i * 7;
  return `<line x1="${ex}" y1="${LY + 14}" x2="${ex}" y2="${LY + LH - 14}"
               stroke="#d07020" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>`;
}).join('')}
<rect x="${EH_X}" y="${LY + 8}" width="40" height="${LH - 16}" fill="none"
      stroke="#e08030" stroke-width="1" rx="2" opacity="0.4" filter="url(#sGlow)"/>
${label(EH_X + 20, LBLY, 'E/H 히터')}
${valueTag(EH_X + 20, VALY, 'OFF', '#7ab8ff')}

<!-- ═══ CHW COOLING COIL ═══ -->
${coilSymbol(CHW_X, LY + 8, 66, LH - 16, '#40a8ff', 5)}
${label(CHW_X + 33, LBLY, 'CHW 코일', '', '#40a8ff')}
${valueTag(CHW_X + 33, VALY, '100%', '#40a8ff')}

<!-- ═══ H/C COIL ═══ -->
${coilSymbol(HC_X, LY + 8, 54, LH - 16, '#ff6060', 5)}
${label(HC_X + 27, LBLY, 'H/C 코일', '', '#ff6060')}
${valueTag(HC_X + 27, VALY, '0%', '#ff6060')}

<!-- ═══ HUMIDIFIER ═══ -->
${humidifier(HV_X, LY + 8, 38, LH - 16)}
${label(HV_X + 19, LBLY, '가습기')}
${valueTag(HV_X + 19, VALY, '0%', '#40b8ff')}

<!-- ═══ SUPPLY FAN ═══ -->
${fanSymbol(FAN_X, LY + LH/2, 40, '#c8deff')}
${label(FAN_X, LBLY, '급기팬', '', '#c8deff')}
${valueTag(FAN_X, VALY, 'RUN', '#00e5a0')}

<!-- ═══ RETURN FAN ═══ -->
${fanSymbol(RF_CX, UY + UH/2, 34, '#ffb880')}
${label(RF_CX, UY - 14, '배기팬', '', '#ffb880')}

<!-- ═══ SENSOR READOUTS ═══ -->
<!-- Mixed air temp above lower duct left -->
${valueTag(MX + MW + 60, LY - 14, '24.0°C', '#7ab8ff')}
<text x="${MX + MW + 60}" y="${LY - 25}" fill="#4a7aaa" font-size="8"
      text-anchor="middle" font-family="sans-serif">혼합온도</text>

<!-- Supply air temp above lower duct right -->
${valueTag(820, LY - 14, '20.4°C', '#7ab8ff')}
<text x="820" y="${LY - 25}" fill="#4a7aaa" font-size="8"
      text-anchor="middle" font-family="sans-serif">급기온도</text>

<!-- Return air temp/humidity in upper duct -->
${valueTag(RF_CX + 80, UY + UH/2, '23.5°C', '#ff9040')}
${valueTag(RF_CX + 148, UY + UH/2, '70.1%', '#ff9040')}

<!-- ═══ SECTION TITLE ═══ -->
<text x="530" y="378" fill="#2a3a5a" font-size="9" font-weight="600"
      text-anchor="middle" font-family="Inter,sans-serif" letter-spacing="1.5">
  AIR HANDLING UNIT — SCHEMATIC DIAGRAM
</text>
</svg>`;
}
