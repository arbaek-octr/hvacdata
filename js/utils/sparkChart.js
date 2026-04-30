/* ═══════════════════════════════════════
   utils/sparkChart.js — Lightweight SVG line chart
   ═══════════════════════════════════════ */

export function renderChart(container, { timestamps, values, label, unit, color = '#2a6ef5' }) {
  const W = 580, H = 160, PAD = { t: 16, r: 12, b: 32, l: 44 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const valid = values.map((v, i) => ({ v, i })).filter(d => d.v !== null);
  if (!valid.length) { container.innerHTML = '<div style="text-align:center;padding:40px;color:#9aaac5">데이터 없음</div>'; return; }

  const minV = Math.min(...valid.map(d => d.v));
  const maxV = Math.max(...valid.map(d => d.v));
  const range = maxV - minV || 1;
  const n = values.length;

  const xScale = i => (i / (n - 1)) * cW;
  const yScale = v => cH - ((v - minV) / range) * cH;

  // Build path
  let path = '';
  let area = '';
  let first = true;
  valid.forEach(({ v, i }) => {
    const x = xScale(i), y = yScale(v);
    if (first) { path += `M${x},${y}`; area += `M${x},${cH} L${x},${y}`; first = false; }
    else { path += ` L${x},${y}`; area += ` L${x},${y}`; }
  });
  const lastValid = valid[valid.length - 1];
  area += ` L${xScale(lastValid.i)},${cH} Z`;

  // X-axis labels (every ~200 points)
  const step = Math.max(1, Math.floor(n / 6));
  const xLabels = [];
  for (let i = 0; i < n; i += step) {
    if (timestamps[i]) xLabels.push({ x: xScale(i), label: timestamps[i] });
  }

  // Y-axis ticks (4 ticks)
  const yTicks = [0, 0.33, 0.67, 1].map(t => ({
    y: cH - t * cH,
    label: (minV + t * range).toFixed(1),
  }));

  const svgId = `chart-${Math.random().toString(36).slice(2)}`;

  container.innerHTML = `
  <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
    <defs>
      <linearGradient id="${svgId}-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="${svgId}-clip">
        <rect x="0" y="0" width="${cW}" height="${cH}"/>
      </clipPath>
    </defs>
    <g transform="translate(${PAD.l},${PAD.t})">
      <!-- Grid lines -->
      ${yTicks.map(t => `<line x1="0" y1="${t.y}" x2="${cW}" y2="${t.y}" stroke="#e8ecf4" stroke-width="1"/>`).join('')}

      <!-- Area fill -->
      <path d="${area}" fill="url(#${svgId}-g)" clip-path="url(#${svgId}-clip)"/>

      <!-- Line -->
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1.8"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#${svgId}-clip)"/>

      <!-- Y axis labels -->
      ${yTicks.map(t => `<text x="-6" y="${t.y + 4}" text-anchor="end" font-size="9" fill="#9aaac5">${t.label}</text>`).join('')}

      <!-- X axis labels -->
      ${xLabels.map(l => `<text x="${l.x}" y="${cH + 18}" text-anchor="middle" font-size="8" fill="#9aaac5">${l.label}</text>`).join('')}

      <!-- Axes -->
      <line x1="0" y1="${cH}" x2="${cW}" y2="${cH}" stroke="#dde3ee" stroke-width="1"/>
      <line x1="0" y1="0" x2="0" y2="${cH}" stroke="#dde3ee" stroke-width="1"/>
    </g>

    <!-- Unit label -->
    <text x="${PAD.l - 6}" y="${PAD.t - 4}" text-anchor="end" font-size="9" fill="#9aaac5">${unit}</text>
  </svg>`;
}
