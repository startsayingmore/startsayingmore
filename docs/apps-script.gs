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

var SHEET_ID  = "1Vgrt-aHxhi0dKnig6AguM0V_Lye_dinXHB2qFju4x94";
var SHEET_TAB = "Form Responses 1";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);
    var data  = JSON.parse(e.postData.contents);

    // Column order must match A–T exactly (Make automation reads by index)
    sheet.appendRow([
      data.timestamp,          // A — Timestamp
      data.firstName,          // B — First Name
      data.lastName,           // C — Last Name
      data.email,              // D — Email Address
      data.state,              // E — State
      data.zip,                // F — Zip Code
      data.hasInsurance,       // G — Do you have insurance?
      data.insuranceProvider,  // H — Insurance Provider
      data.therapistRace,      // I — Therapist race/ethnicity preference
      data.therapistGender,    // J — Preferred therapist gender
      data.therapistFaith,     // K — Faith preference
      data.faithOther,         // L — Faith other (if specified)
      data.sessionFormat,      // M — Session format
      data.areasOfConcern,     // N — Areas of concern
      data.areasOther,         // O — Areas other
      data.therapyBefore,      // P — Been in therapy before?
      data.workedWell,         // Q — What worked well
      data.didntWork,          // R — What didn't work
      data.additionalInfo,     // S — Anything else
      data.wantsCall           // T — 15-min call
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

// Health check — visit the Web App URL in a browser to confirm it's live
function doGet(e) {
  return ContentService.createTextOutput("SSM Matching Form API — OK");
}
