// ============================================================
// SSM — Matching intake form (multi-step, 5 steps)
// Submits to Google Apps Script Web App → Google Sheet.
//
// After deploying the Apps Script (see docs/apps-script.gs),
// replace the placeholder below with your Web App URL.
// ============================================================

const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID",
  "IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS",
  "MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const CONCERN_OPTIONS = [
  "Anxiety","Depression","Trauma / PTSD","Relationship issues",
  "Grief & loss","Life transitions","Self-esteem","Career stress",
  "Family conflict","Substance use","LGBTQ+ affirming",
  "Faith-integrated care","Eating / body image","ADHD & focus","Other"
];

// ---- Primitives ----

function MfField({ label, required, hint, children }) {
  return (
    <div className="mf-field">
      <label className="mf-label">
        {label}{required && <span className="mf-req" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="mf-hint">{hint}</p>}
      {children}
    </div>
  );
}

function MfInput(props) {
  return <input className="mf-input" {...props} />;
}

function MfSelect({ children, ...props }) {
  return (
    <select className="mf-input mf-select" {...props}>
      {children}
    </select>
  );
}

function MfTextarea(props) {
  return <textarea className="mf-input mf-textarea" {...props} />;
}

function MfPills({ name, options, value, onChange, multi }) {
  return (
    <div className="mf-pill-group" role="group">
      {options.map(opt => {
        const on = multi ? value.includes(opt) : value === opt;
        return (
          <label key={opt} className={`mf-pill${on ? " is-on" : ""}`}>
            <input
              type={multi ? "checkbox" : "radio"}
              name={name}
              checked={on}
              onChange={() => onChange(opt)}
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

// ---- Arrow SVG ----
function Arr() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

// ---- Main form ----

function MatchForm() {
  const { useState } = React;
  const STEPS = 5;
  const [step, setStep] = useState(1);
  const [d, setD] = useState({
    firstName: "", lastName: "", email: "", state: "", zip: "",
    hasInsurance: "", insuranceProvider: "",
    therapistRace: [], therapistGender: "", therapistFaith: "", faithSpec: "",
    sessionFormat: "",
    areasOfConcern: [], areasOther: "",
    therapyBefore: "", workedWell: "", didntWork: "",
    additionalInfo: "", wantsCall: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const tog = (k, v) => setD(p => {
    const a = p[k];
    return { ...p, [k]: a.includes(v) ? a.filter(x => x !== v) : [...a, v] };
  });

  const canAdvance = () => {
    if (step === 1) return d.firstName.trim() && d.lastName.trim() && d.email.trim() && d.state;
    return true;
  };

  const doSubmit = async () => {
    setSubmitting(true);
    setErr("");
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toLocaleString("en-US"),
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          state: d.state,
          zip: d.zip,
          hasInsurance: d.hasInsurance,
          insuranceProvider: d.insuranceProvider,
          therapistRace: d.therapistRace.join(", "),
          therapistGender: d.therapistGender,
          therapistFaith: d.therapistFaith,
          faithOther: d.faithSpec,
          sessionFormat: d.sessionFormat,
          areasOfConcern: d.areasOfConcern.join(", "),
          areasOther: d.areasOther,
          therapyBefore: d.therapyBefore,
          workedWell: d.workedWell,
          didntWork: d.didntWork,
          additionalInfo: d.additionalInfo,
          wantsCall: d.wantsCall
        })
      });
      setDone(true);
    } catch (e) {
      setErr("Something went wrong. Please try again or email info@startsayingmore.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mf-done">
        <div className="mf-done__icon">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mf-done__h">You're in.</h2>
        <p>We'll review your responses and send your matches to <strong>{d.email}</strong> within 1–2 business days.</p>
        <p>Check your inbox — and spam, just in case.</p>
        <p className="mf-done__contact">Questions? <a href="mailto:info@startsayingmore.com">info@startsayingmore.com</a></p>
      </div>
    );
  }

  return (
    <div className="match-form" id="match-form">
      {/* Progress */}
      <div className="mf-track">
        <div className="mf-track__fill" style={{ width: `${((step - 1) / STEPS) * 100}%` }} />
      </div>
      <p className="mf-counter">{step} of {STEPS}</p>

      <div className="mf-card">

        {/* ── Step 1: Basics ── */}
        {step === 1 && <>
          <p className="eyebrow eyebrow--bare">Let's start with you</p>
          <h2 className="mf-h2">Basic info</h2>
          <div className="mf-row">
            <MfField label="First name" required>
              <MfInput value={d.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jordan" />
            </MfField>
            <MfField label="Last name" required>
              <MfInput value={d.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" />
            </MfField>
          </div>
          <MfField label="Email address" required>
            <MfInput type="email" value={d.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
          </MfField>
          <div className="mf-row">
            <MfField label="State" required>
              <MfSelect value={d.state} onChange={e => set("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </MfSelect>
            </MfField>
            <MfField label="Zip code">
              <MfInput value={d.zip} onChange={e => set("zip", e.target.value)} placeholder="75001" maxLength={10} />
            </MfField>
          </div>
        </>}

        {/* ── Step 2: Insurance ── */}
        {step === 2 && <>
          <p className="eyebrow eyebrow--bare">Insurance & cost</p>
          <h2 className="mf-h2">How are you paying?</h2>
          <MfField label="Do you have insurance?">
            <MfPills name="ins" value={d.hasInsurance}
              options={["Yes", "No", "Not sure"]}
              onChange={v => set("hasInsurance", v)} />
          </MfField>
          {d.hasInsurance === "Yes" && (
            <MfField label="Insurance provider">
              <MfInput value={d.insuranceProvider}
                onChange={e => set("insuranceProvider", e.target.value)}
                placeholder="e.g. Blue Cross, Aetna, Medicaid" />
            </MfField>
          )}
        </>}

        {/* ── Step 3: Preferences ── */}
        {step === 3 && <>
          <p className="eyebrow eyebrow--bare">Your therapist preferences</p>
          <h2 className="mf-h2">Who do you want to talk to?</h2>
          <p className="mf-subhead">None of these are required — but the more specific you are, the better your match.</p>
          <MfField label="Race or ethnicity preference" hint="Select all that apply">
            <MfPills multi name="race"
              options={["Black / African American","Hispanic / Latino","Asian","White","No preference","Other"]}
              value={d.therapistRace}
              onChange={v => tog("therapistRace", v)} />
          </MfField>
          <MfField label="Gender preference">
            <MfPills name="gen" value={d.therapistGender}
              options={["Woman","Man","Non-binary","No preference"]}
              onChange={v => set("therapistGender", v)} />
          </MfField>
          <MfField label="Faith preference">
            <MfPills name="faith" value={d.therapistFaith}
              options={["Yes — faith matters to me","No preference"]}
              onChange={v => set("therapistFaith", v)} />
          </MfField>
          {d.therapistFaith === "Yes — faith matters to me" && (
            <MfField label="Which faith or tradition?">
              <MfInput value={d.faithSpec}
                onChange={e => set("faithSpec", e.target.value)}
                placeholder="e.g. Christian, Muslim, Jewish" />
            </MfField>
          )}
          <MfField label="Session format">
            <MfPills name="fmt" value={d.sessionFormat}
              options={["In-person","Telehealth (video / phone)","Either works"]}
              onChange={v => set("sessionFormat", v)} />
          </MfField>
        </>}

        {/* ── Step 4: Areas of concern ── */}
        {step === 4 && <>
          <p className="eyebrow eyebrow--bare">What's on your plate</p>
          <h2 className="mf-h2">Areas of concern</h2>
          <p className="mf-subhead">Select everything that applies — this helps us find someone with real experience in what you're dealing with.</p>
          <MfField label="Select all that apply">
            <MfPills multi name="areas"
              options={CONCERN_OPTIONS}
              value={d.areasOfConcern}
              onChange={v => tog("areasOfConcern", v)} />
          </MfField>
          {d.areasOfConcern.includes("Other") && (
            <MfField label="Tell us more">
              <MfTextarea value={d.areasOther}
                onChange={e => set("areasOther", e.target.value)}
                rows={2} placeholder="Describe what's going on in your own words" />
            </MfField>
          )}
          <MfField label="Have you been in therapy before?">
            <MfPills name="prev" value={d.therapyBefore}
              options={["Yes","No"]}
              onChange={v => set("therapyBefore", v)} />
          </MfField>
          {d.therapyBefore === "Yes" && <>
            <MfField label="What worked well?">
              <MfTextarea value={d.workedWell}
                onChange={e => set("workedWell", e.target.value)}
                rows={2} placeholder="Approach, style, frequency, vibe — anything" />
            </MfField>
            <MfField label="What didn't work?">
              <MfTextarea value={d.didntWork}
                onChange={e => set("didntWork", e.target.value)}
                rows={2} placeholder="This is valuable — don't hold back" />
            </MfField>
          </>}
        </>}

        {/* ── Step 5: Final ── */}
        {step === 5 && <>
          <p className="eyebrow eyebrow--bare">Almost there</p>
          <h2 className="mf-h2">Anything else?</h2>
          <MfField label="Is there anything else you'd like us to know?">
            <MfTextarea value={d.additionalInfo}
              onChange={e => set("additionalInfo", e.target.value)}
              rows={4} placeholder="Say as much or as little as you want." />
          </MfField>
          <MfField label="Would you like a 15-minute call to review your matches together?">
            <MfPills name="call" value={d.wantsCall}
              options={["Yes, please","No thanks — email is fine"]}
              onChange={v => set("wantsCall", v)} />
          </MfField>
        </>}

      </div>

      {err && <p className="mf-err">{err}</p>}

      <div className="mf-nav">
        {step > 1
          ? <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>← Back</button>
          : <span />}
        {step < STEPS
          ? <button className="btn btn--primary btn--lg"
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}>
              Continue <Arr />
            </button>
          : <button className="btn btn--accent btn--lg"
              onClick={doSubmit}
              disabled={submitting}>
              {submitting ? "Submitting…" : "Submit my intake"} <Arr />
            </button>}
      </div>
    </div>
  );
}

Object.assign(window, { MatchForm });
