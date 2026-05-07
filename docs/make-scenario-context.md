# Make.com Scenario — SSM Pay Gate Context

## Background

The Start Saying More website has a therapist match request form. A matching scenario already exists in Make.com (it triggers on new Google Sheet rows, runs the match via Claude API, and sends a Gmail draft). 

What's needed now is **one new scenario** that gates the sheet write behind a $5 Stripe payment. The row should only appear in the sheet — and therefore trigger the existing matching scenario — after the user has paid.

---

## The flow

1. User fills out the form on the website and hits Submit
2. Form POSTs JSON to a **Make.com webhook**
3. Make stores the data temporarily in a **data store**
4. Make responds with a redirect URL → user is sent to the **Stripe Payment Link** with their email pre-filled
5. User completes the $5 payment
6. Stripe fires a webhook to Make on `checkout.session.completed`
7. Make looks up the stored record by email and **appends the row to Google Sheets**
8. The existing matching scenario picks up from there automatically

---

## Stripe details

- **Payment Link URL:** `https://buy.stripe.com/fZu4gA4t04Eh2DR4jz1Jm02`
- **Amount:** $5
- **Email pre-fill:** append `?prefilled_email=USER_EMAIL` to the payment link URL
- **Stripe webhook event:** `checkout.session.completed`
- **Customer email in Stripe payload:** `data.object.customer_details.email`

---

## Google Sheet details

- **Sheet ID:** `1Vgrt-aHxhi0dKnig6AguM0V_Lye_dinXHB2qFju4x94`
- **Tab name:** `Form Responses 1`
- **Columns A through T (20 columns):**

| Column | Field name | Description |
|--------|-----------|-------------|
| A | timestamp | Date/time of submission |
| B | firstName | First name |
| C | lastName | Last name |
| D | email | Email address |
| E | state | US state |
| F | zip | ZIP code |
| G | hasInsurance | Insurance status (Yes / No - I will self-pay / No - looking for sliding scale) |
| H | insuranceProvider | Insurance provider name (blank if no insurance) |
| I | therapistRace | Preferred therapist race/ethnicity |
| J | therapistGender | Preferred therapist gender |
| K | therapistFaith | Preferred therapist faith background |
| L | faithOther | Faith "other" specification |
| M | sessionFormat | Virtual only / In-person only / Either |
| N | areasOfConcern | Areas of concern (comma-separated if multiple) |
| O | areasOther | Concerns "other" specification |
| P | therapyBefore | Has had therapy before (Yes / No) |
| Q | workedWell | What worked well in past therapy |
| R | didntWork | What didn't work in past therapy |
| S | additionalInfo | Anything else / notes |
| T | wantsCall | Wants a call (Yes, I would like a call / No, just send my matches) |

---

## Data store structure

Create a data store to hold form submissions temporarily (between form POST and Stripe payment confirmation). Use `email` as the key field.

Fields: `email`, `timestamp`, `firstName`, `lastName`, `state`, `zip`, `hasInsurance`, `insuranceProvider`, `therapistRace`, `therapistGender`, `therapistFaith`, `faithOther`, `sessionFormat`, `areasOfConcern`, `areasOther`, `therapyBefore`, `workedWell`, `didntWork`, `additionalInfo`, `wantsCall` — all Text.

---

## Scenario structure (one scenario, two webhook triggers via Router)

Make.com supports a single scenario with a **Router** that branches on the incoming payload. Structure it as:

**Trigger:** Webhooks > Custom webhook

**Route A — Form submission** (when payload contains `firstName`):
1. Store all 20 fields in the data store, keyed by `email`
2. Respond to the webhook:
   ```json
   { "redirect": "https://buy.stripe.com/fZu4gA4t04Eh2DR4jz1Jm02?prefilled_email={{email}}" }
   ```

**Route B — Stripe payment confirmed** (when payload contains `type` = `checkout.session.completed`):
1. Extract `data.object.customer_details.email` from the payload
2. Look up the data store record by that email
3. Append a row to Google Sheets (`Form Responses 1`, columns A–T) with all stored fields
4. Delete the record from the data store

> Alternatively, this can be split into two separate scenarios if a Router isn't practical — the important thing is that the sheet write only happens after Stripe confirms payment.

---

## Stripe webhook setup

In Stripe dashboard → Developers → Webhooks → Add endpoint:
- URL: the Make.com webhook URL from this scenario
- Events: `checkout.session.completed`

---

## What the developer needs back

Once the scenario is set up, share the **Make.com webhook URL** (the one that receives the form POST — Route A). The developer will replace one line in `form.jsx` with that URL, and update the redirect logic so users are sent to Stripe after submitting.

---

## Access

- **Google account:** oafolabi93@gmail.com
- **Site:** startsayingmore.com/#/form
