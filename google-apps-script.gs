/*
 * Lưu xác nhận tham dự & lời chúc vào Google Sheets.
 * Cách dùng: xem mục "Lưu RSVP vào Google Sheets" trong README.md.
 */
const SHEET_NAME = "RSVP";
const HEADERS = ["time", "name", "attend", "side", "guests", "message"];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function doPost(e) {
  const p = e.parameter;
  getSheet().appendRow([
    Number(p.time) || Date.now(),
    String(p.name || "").slice(0, 60),
    p.attend === "yes" ? "yes" : "no",
    p.side === "bride" ? "bride" : "groom",
    Number(p.guests) || 0,
    String(p.message || "").slice(0, 500),
  ]);
  return ContentService.createTextOutput("ok");
}

// Trả về danh sách lời chúc (chỉ tên, phía khách mời và lời nhắn) để hiển thị trên thiệp
function doGet() {
  const rows = getSheet().getDataRange().getValues().slice(1);
  const wishes = rows
    .filter((r) => r[5])
    .map((r) => ({ time: r[0], name: r[1], side: r[3], message: r[5] }))
    .reverse();
  return ContentService.createTextOutput(JSON.stringify(wishes)).setMimeType(ContentService.MimeType.JSON);
}
