// ============================================================
// Single-page matching form
// All sections stacked, one submit at the bottom.
// ============================================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1XhOzogGEBCSWZZrE8DQ0s_GuZYOieF3UgncoVVZeHHctXTn8YWxMah8H8OXcdWwZzw/exec";

const { useState: useFormState } = React;

const US_STATES = [
"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
"Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
"Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
"New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
"Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
"Wisconsin", "Wyoming"];


const AREAS_OF_CONCERN = [
"Anxiety", "Depression", "Relationship issues", "Grief and loss", "Trauma and PTSD",
"Life transitions", "Self-esteem and confidence", "Anger management",
"Addiction and substance use", "Family conflict", "Career stress and burnout",
"ADHD", "Cultural and identity issues", "Other"];


const SECTIONS = [
{ id: "about",       num: "01", title: "About you" },
{ id: "location",    num: "02", title: "Your location" },
{ id: "insurance",   num: "03", title: "Insurance" },
{ id: "preferences", num: "04", title: "Therapist preferences" },
{ id: "concerns",    num: "05", title: "What you're working through" },
{ id: "past",        num: "06", title: "Past experience" },
{ id: "else",        num: "07", title: "Anything else" },
{ id: "next",        num: "08", title: "Next steps" }];


function FormField({ label, hint, required, children, error }) {
  return (
    <label className="ff">
      <span className="ff__lbl">
        {label}{required && <span className="ff__req"> *</span>}
      </span>
      {hint && <span className="ff__hint">{hint}</span>}
      {children}
      {error && <span className="ff__err">{error}</span>}
    </label>);

}

function RadioGroup({ name, value, options, onChange }) {
  return (
    <div className="rg">
      {options.map((o) =>
      <label key={o} className={`rg__opt ${value === o ? "is-on" : ""}`}>
          <input type="radio" name={name} value={o} checked={value === o}
        onChange={(e) => onChange(e.target.value)} />
          <span>{o}</span>
        </label>
      )}
    </div>);

}

function CheckGroup({ values, options, onChange }) {
  const toggle = (o) => {
    if (values.includes(o)) onChange(values.filter((v) => v !== o));else
    onChange([...values, o]);
  };
  return (
    <div className="rg rg--check">
      {options.map((o) =>
      <label key={o} className={`rg__opt ${values.includes(o) ? "is-on" : ""}`}>
          <input type="checkbox" checked={values.includes(o)} onChange={() => toggle(o)} />
          <span>{o}</span>
        </label>
      )}
    </div>);

}

function FormSection({ num, title, children }) {
  return (
    <section className="form-section" id={`section-${num}`}>
      <div className="form-section__head">
        <span className="form-section__num" style={{ fontFamily: "Poppins" }}>{num}</span>
        <h2>{title}</h2>
      </div>
      <div className="form-grid">{children}</div>
    </section>);

}

function FormPage({ onNavigate }) {
  const [submitted, setSubmitted] = useFormState(false);
  const [errors, setErrors] = useFormState({});
  const [data, setData] = useFormState({
    firstName: "", lastName: "", email: "",
    state: "", zip: "",
    insurance: "", insuranceProvider: "",
    raceEthnicity: "", gender: "", faith: "", faithOther: "",
    sessionFormat: "",
    concerns: [], concernsOther: "",
    pastTherapy: "", pastWorked: "", pastDidnt: "",
    notes: "",
    callRequested: ""
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const validate = () => {
    const e = {};
    if (!data.firstName.trim()) e.firstName = "Required";
    if (!data.lastName.trim()) e.lastName = "Required";
    if (!data.email.trim()) e.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = "Enter a valid email";
    if (!data.state) e.state = "Required";
    if (!data.zip.trim()) e.zip = "Required";
    if (!data.insurance) e.insurance = "Required";
    if (!data.raceEthnicity) e.raceEthnicity = "Required";
    if (!data.gender) e.gender = "Required";
    if (!data.faith) e.faith = "Required";
    if (!data.sessionFormat) e.sessionFormat = "Required";
    if (data.concerns.length === 0) e.concerns = "Pick at least one";
    if (!data.pastTherapy) e.pastTherapy = "Required";
    if (!data.callRequested) e.callRequested = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [submitting, setSubmitting] = useFormState(false);

  const handleSubmit = async (ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const first = document.querySelector(".ff__err");
        if (first) {
          const r = first.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + r.top - 120, behavior: "smooth" });
        }
      }, 50);
      return;
    }
    setSubmitting(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          timestamp:         new Date().toLocaleString("en-US"),
          firstName:         data.firstName,
          lastName:          data.lastName,
          email:             data.email,
          state:             data.state,
          zip:               data.zip,
          hasInsurance:      data.insurance,
          insuranceProvider: data.insuranceProvider,
          therapistRace:     data.raceEthnicity,
          therapistGender:   data.gender,
          therapistFaith:    data.faith,
          faithOther:        data.faithOther,
          sessionFormat:     data.sessionFormat,
          areasOfConcern:    data.concerns.join(", "),
          areasOther:        data.concernsOther,
          therapyBefore:     data.pastTherapy,
          workedWell:        data.pastWorked,
          didntWork:         data.pastDidnt,
          additionalInfo:    data.notes,
          wantsCall:         data.callRequested
        })
      });
    } catch (e) {
      // no-cors responses throw on network failure only
    } finally {
      setSubmitting(false);
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main data-screen-label="Form / Success">
        <section className="form-success">
          <div className="form-success__art">
            <BrandIllo name="match-hero" />
          </div>
          <div className="form-success__copy">
            <p className="eyebrow">Got it</p>
            <h1 style={{ fontFamily: "Poppins", fontWeight: 800, textTransform: "none" }}>Thanks, {data.firstName || "friend"}.</h1>
            <p className="lead">
              Your responses are with us. They will be reviewed and your matches will be sent to your email within 1–2 business days.
            </p>
            <p className="form-success__meta">
              Watch your inbox (and spam) for a note from <em>hello@startsayingmore.com</em>.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--primary btn--lg" onClick={() => onNavigate("home")}>
                Back to home
              </button>
              <button className="btn btn--secondary btn--lg" onClick={() => onNavigate("about")}>
                Read our story
              </button>
            </div>
          </div>
        </section>
      </main>);
  }

  return (
    <main data-screen-label="04 Match form">
      <form className="form-shell form-shell--single" onSubmit={handleSubmit} noValidate>
        <div className="form-shell__head">
          <p className="eyebrow">Therapist match request</p>
          <h1 style={{ fontFamily: "Poppins" }}>
            A few questions, then we get to work.
          </h1>
          <p className="lead">
            About 5 minutes. Your responses go to Olamide and the matching team — nowhere else.
          </p>
        </div>

        {/* 01 — About you */}
        <FormSection num="01" title="About you">
          <div className="form-grid__row">
            <FormField label="First name" required error={errors.firstName}>
              <input type="text" value={data.firstName}
                onChange={(e) => set("firstName", e.target.value)} />
            </FormField>
            <FormField label="Last name" required error={errors.lastName}>
              <input type="text" value={data.lastName}
                onChange={(e) => set("lastName", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Email address" required
            hint="This is where your matches will be sent." error={errors.email}>
            <input type="email" value={data.email}
              onChange={(e) => set("email", e.target.value)} />
          </FormField>
        </FormSection>

        {/* 02 — Location */}
        <FormSection num="02" title="Your location">
          <FormField label="State" required error={errors.state}>
            <select value={data.state} onChange={(e) => set("state", e.target.value)}>
              <option value="">Select your state</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Zip code" required error={errors.zip}>
            <input type="text" inputMode="numeric" maxLength={10}
              value={data.zip} onChange={(e) => set("zip", e.target.value)} />
          </FormField>
        </FormSection>

        {/* 03 — Insurance */}
        <FormSection num="03" title="Insurance">
          <FormField label="Do you have insurance?" required error={errors.insurance}>
            <RadioGroup name="insurance" value={data.insurance}
              onChange={(v) => set("insurance", v)}
              options={[
                "Yes",
                "No - I will self-pay",
                "No - I am looking for sliding scale options"]
              } />
          </FormField>
          <FormField label="Insurance provider"
            hint="Enter your provider (e.g. Blue Cross Blue Shield, Aetna, Cigna). Leave blank if no insurance.">
            <input type="text" value={data.insuranceProvider}
              onChange={(e) => set("insuranceProvider", e.target.value)} />
          </FormField>
        </FormSection>

        {/* 04 — Therapist preferences */}
        <FormSection num="04" title="Therapist preferences">
          <FormField label="Do you have a preference for your therapist's race or ethnicity?"
            required error={errors.raceEthnicity}>
            <RadioGroup name="race" value={data.raceEthnicity}
              onChange={(v) => set("raceEthnicity", v)}
              options={[
                "No preference", "Black / African American", "Latino / Hispanic",
                "Asian / Pacific Islander", "Middle Eastern / North African",
                "Other (please specify in additional notes)"]
              } />
          </FormField>
          <FormField label="Preferred therapist gender" required error={errors.gender}>
            <RadioGroup name="gender" value={data.gender}
              onChange={(v) => set("gender", v)}
              options={["No preference", "Female", "Male", "Non-binary"]} />
          </FormField>
          <FormField label="Do you prefer a therapist of a specific faith?"
            required error={errors.faith}>
            <RadioGroup name="faith" value={data.faith}
              onChange={(v) => set("faith", v)}
              options={[
                "No preference", "Christian", "Muslim", "Jewish",
                "Spiritual but not religious", "Other"]
              } />
          </FormField>
          {data.faith === "Other" &&
            <FormField label="If you selected Other for faith, please specify"
              hint="Leave blank if not applicable.">
              <input type="text" value={data.faithOther}
                onChange={(e) => set("faithOther", e.target.value)} />
            </FormField>
          }
          <FormField label="Session format" required error={errors.sessionFormat}>
            <RadioGroup name="format" value={data.sessionFormat}
              onChange={(v) => set("sessionFormat", v)}
              options={["Virtual only", "In-person only", "Either"]} />
          </FormField>
        </FormSection>

        {/* 05 — Concerns */}
        <FormSection num="05" title="What you're working through">
          <FormField label="Areas of concern (select all that apply)"
            required error={errors.concerns}>
            <CheckGroup values={data.concerns}
              onChange={(v) => set("concerns", v)} options={AREAS_OF_CONCERN} />
          </FormField>
          {data.concerns.includes("Other") &&
            <FormField label="If you selected Other for areas of concern, please describe"
              hint="Leave blank if not applicable.">
              <textarea rows={3} value={data.concernsOther}
                onChange={(e) => set("concernsOther", e.target.value)} />
            </FormField>
          }
        </FormSection>

        {/* 06 — Past experience */}
        <FormSection num="06" title="Past experience">
          <FormField label="Have you been in therapy before?"
            required error={errors.pastTherapy}>
            <RadioGroup name="past" value={data.pastTherapy}
              onChange={(v) => set("pastTherapy", v)} options={["Yes", "No"]} />
          </FormField>
          {data.pastTherapy === "Yes" &&
            <>
              <FormField label="What worked well in past therapy?"
                hint="Leave blank if you'd rather not say.">
                <textarea rows={4} value={data.pastWorked}
                  onChange={(e) => set("pastWorked", e.target.value)} />
              </FormField>
              <FormField label="What did not work?"
                hint="Leave blank if you'd rather not say.">
                <textarea rows={4} value={data.pastDidnt}
                  onChange={(e) => set("pastDidnt", e.target.value)} />
              </FormField>
            </>
          }
        </FormSection>

        {/* 07 — Anything else */}
        <FormSection num="07" title="Anything else">
          <FormField label="Is there anything else you'd like us to know?"
            hint="Optional. The more context, the sharper the match.">
            <textarea rows={6} value={data.notes}
              onChange={(e) => set("notes", e.target.value)} />
          </FormField>
        </FormSection>

        {/* 08 — Next steps */}
        <FormSection num="08" title="Next steps">
          <FormField
            label="Would you like a 15-minute call to review your matches together?"
            required error={errors.callRequested}>
            <RadioGroup name="call" value={data.callRequested}
              onChange={(v) => set("callRequested", v)}
              options={["Yes, I would like a call", "No, just send my matches"]} />
          </FormField>
          <div className="form-summary">
            <p><strong>Heads up:</strong> after you submit, we'll send your matches to <em>you</em> within 1–2 business days.</p>
          </div>
        </FormSection>

        {/* Submit */}
        <div className="form-nav form-nav--single">
          <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"} <Icon name="arrow" size={16} />
          </button>
          {Object.keys(errors).length > 0 &&
            <p className="form-nav__hint">Some fields above need attention.</p>
          }
        </div>
      </form>
    </main>);
}

Object.assign(window, { FormPage });
