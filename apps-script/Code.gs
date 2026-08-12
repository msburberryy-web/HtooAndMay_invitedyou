/**
 * RSVP intake for May & Htoo's wedding site.
 *
 * Deploy this as a Web App (see README.md in this folder for the exact
 * steps). Paste the resulting /exec URL into SHEET_ENDPOINT in index.html.
 *
 * The site POSTs JSON like:
 * {
 *   attending: "yes" | "no",
 *   name: string, kana: string,
 *   contact: string, address: string,
 *   party: number, guestNames: string,
 *   station: string, allergy: string,
 *   nijikai: "yes" | "no" | "",
 *   message: string,
 *   lang: "en" | "ja" | "my"
 * }
 */

const SHEET_NAME = "RSVPs";

const HEADERS = [
  "Timestamp", "Language", "Attending", "Name", "Kana / Reading",
  "Email / Phone", "Mailing address",
  "Party size", "Guest name(s)", "Station", "Allergy / dietary notes",
  "2次会 (afterparty)", "Message"
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.lang || "",
      data.attending || "",
      data.name || "",
      data.kana || "",
      data.contact || "",
      data.address || "",
      data.party || "",
      data.guestNames || "",
      data.station || "",
      data.allergy || "",
      data.nijikai || "",
      data.message || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the /exec URL directly in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput(
    "RSVP endpoint is live. POST JSON here to record a response."
  );
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}
