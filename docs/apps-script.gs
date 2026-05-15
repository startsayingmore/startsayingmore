// SSM Matching Form — Google Apps Script backend
// Receives form submissions from startsayingmore.com and appends
// rows to the "Form Responses 1" sheet in the correct column order.
//
// HOW TO DEPLOY (one-time, ~3 minutes):
// 1. Go to https://script.google.com
// 2. Click "New project"
// 3. Delete any existing code and paste this entire file
// 4. Click Deploy → New deployment
// 5. Type: Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Click Deploy → authorize when prompted
// 9. Copy the Web App URL
// 10. Open match-form.jsx and replace "YOUR_APPS_SCRIPT_URL_HERE" with the URL

var SHEET_ID     = "1Vgrt-aHxhi0dKnig6AguM0V_Lye_dinXHB2qFju4x94";
var SHEET_TAB    = "Form Responses 1";
var SECRET_TOKEN = "ssm_mf_7x9k2p4q8n6r3w1";

// Strip leading formula characters to prevent spreadsheet injection
function sanitize(val) {
  var s = val == null ? "" : String(val);
  return s.replace(/^[=+\-@\t\r]/, "'$&");
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);

    // Column order must match A–T exactly (Make automation reads by index)
    sheet.appendRow([
      sanitize(data.timestamp),         // A — Timestamp
      sanitize(data.firstName),         // B — First Name
      sanitize(data.lastName),          // C — Last Name
      sanitize(data.email),             // D — Email Address
      sanitize(data.state),             // E — State
      sanitize(data.zip),               // F — Zip Code
      sanitize(data.hasInsurance),      // G — Do you have insurance?
      sanitize(data.insuranceProvider), // H — Insurance Provider
      sanitize(data.therapistRace),     // I — Therapist race/ethnicity preference
      sanitize(data.therapistGender),   // J — Preferred therapist gender
      sanitize(data.therapistFaith),    // K — Faith preference
      sanitize(data.faithOther),        // L — Faith other (if specified)
      sanitize(data.sessionFormat),     // M — Session format
      sanitize(data.areasOfConcern),    // N — Areas of concern
      sanitize(data.areasOther),        // O — Areas other
      sanitize(data.therapyBefore),     // P — Been in therapy before?
      sanitize(data.workedWell),        // Q — What worked well
      sanitize(data.didntWork),         // R — What didn't work
      sanitize(data.additionalInfo),    // S — Anything else
      sanitize(data.wantsCall)          // T — 15-min call
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
