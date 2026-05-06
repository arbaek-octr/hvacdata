/* ═══════════════════════════════════════
   zoneParams.js — 층별 AHU / FCU 파라미터
   변수명 템플릿의 {ahu}, {fcu}, {floor} 치환에 사용

   플레이스홀더 목록:
     {ahu}   → AHU 번호          (예: 9, 10, 11)
     {fcu}   → FCU 층 번호       (예: 10, 11, 12) — 보통 ahu + 1
     {floor} → 실제 층 (필요 시)

   변수명 예시:
     W.AHU{ahu}.OADM       → W.AHU9.OADM
     W.FCU.{fcu}F.L.FCV    → W.FCU.10F.L.FCV
   ═══════════════════════════════════════ */

// ahu 번호만 지정하면 fcu = ahu + 1 자동 계산
const AHU_LIST = [9, 10, 11, 12]; // 사용하는 AHU 번호 목록

export const ZONE_PARAMS = AHU_LIST.map(ahu => ({
  zoneId: `zone-${ahu}`,
  label:  `${ahu}층`,
  ahu,
  fcu: ahu + 1,  // FCU 층번호는 항상 AHU + 1
}));

/**
 * 템플릿 변수명을 특정 층 파라미터로 치환
 * @param {string} template  예) 'W.AHU{ahu}.OADM'
 * @param {object} params    예) { ahu: 9, fcu: 10 }
 * @returns {string}         예) 'W.AHU9.OADM'
 */
export function resolveVarname(template, params) {
  if (!template) return '';
  return template
    .replace(/\{ahu\}/g,   params.ahu   ?? '{ahu}')
    .replace(/\{fcu\}/g,   params.fcu   ?? '{fcu}')
    .replace(/\{floor\}/g, params.floor ?? '{floor}');
}

/**
 * 템플릿 변수명을 모든 층에 대해 한 번에 치환
 * @param {string} template
 * @returns {Array<{zoneId, label, varname}>}
 */
export function resolveAll(template) {
  return ZONE_PARAMS.map(z => ({
    zoneId:  z.zoneId,
    label:   z.label,
    varname: resolveVarname(template, z),
  }));
}
