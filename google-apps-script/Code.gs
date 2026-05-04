// HVAC Dashboard — 피드백 코멘트 저장 API
// 배포 방법: 확장 프로그램 → Apps Script → 배포 → 새 배포
//   실행 계정: 나(Me)  /  액세스 권한: 모든 사용자(Anyone)

const SHEET_NAME = 'Comments';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'text', 'author', 'time']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const comments = rows.slice(1)
    .filter(r => r[0] !== '' && r[0] !== 'id')
    .map(r => ({
      id:     String(r[0]),
      text:   String(r[1]),
      author: String(r[2] || '익명'),
      time:   String(r[3] || r[2])  // 이전 데이터 호환: author 없던 경우 r[2]가 time
    }));
  return ContentService
    .createTextOutput(JSON.stringify(comments))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    if (p.action === 'add') {
      sheet.appendRow([p.id, p.text, p.author || '익명', p.time]);
    } else if (p.action === 'delete') {
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(p.id)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
