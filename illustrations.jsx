// ============================================================
// Abstract symbolic illustrations
// Brand vocabulary: lips, speech bubbles, soft organic blobs,
// hand-drawn squiggles. Palette: eminence purples + champagne.
// Each illo fills its container; aspect-ratio comes from parent.
// ============================================================

const ILLO_COLORS = {
  ink: "#3D1E54", // ssm-eminence-deep
  purple: "#6F3F8E", // ssm-eminence
  lavender: "#E8DDF1", // ssm-eminence-tint
  champagne: "#E8D88C", // ssm-champagne
  paper: "#F6F2EA", // ssm-paper
  mist: "#F0EAF7"
};

// Hand-drawn squiggle (reusable)
function Squiggle({ x = 0, y = 0, w = 80, color = ILLO_COLORS.purple, sw = 3, rotate = 0 }) {
  return (
    <path
      d={`M ${x} ${y} q ${w * 0.15} -${w * 0.18} ${w * 0.3} 0 t ${w * 0.3} 0 t ${w * 0.3} 0`}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      transform={`rotate(${rotate} ${x + w / 2} ${y})`} />);

}

// Speech bubble (rounded ellipse w/ tail)
function Bubble({ cx, cy, rx, ry, fill, stroke, strokeWidth = 0, tailX, tailY, tailDx = 0, tailDy = 0 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke || "none"} strokeWidth={strokeWidth} />
      {tailX != null &&
      <path
        d={`M ${tailX} ${tailY} q ${tailDx * 0.5} ${tailDy * 0.6} ${tailDx} ${tailDy} q -${tailDx * 0.4} -${tailDy * 0.2} -${tailDx * 1.1} -${tailDy * 0.3} z`}
        fill={fill}
        stroke={stroke || "none"}
        strokeWidth={strokeWidth} />
      }
    </g>);

}

// Lip outline (stylized)
function Lips({ cx, cy, w = 100, color = ILLO_COLORS.purple, sw = 2.2 }) {
  const h = w * 0.45;
  return (
    <g fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* upper lip */}
      <path d={`M ${cx - w / 2} ${cy} Q ${cx - w * 0.32} ${cy - h * 0.55} ${cx - w * 0.18} ${cy - h * 0.15} Q ${cx - w * 0.08} ${cy - h * 0.5} ${cx} ${cy - h * 0.18} Q ${cx + w * 0.08} ${cy - h * 0.5} ${cx + w * 0.18} ${cy - h * 0.15} Q ${cx + w * 0.32} ${cy - h * 0.55} ${cx + w / 2} ${cy}`} />
      {/* lower lip */}
      <path d={`M ${cx - w / 2} ${cy} Q ${cx - w * 0.25} ${cy + h * 0.5} ${cx} ${cy + h * 0.45} Q ${cx + w * 0.25} ${cy + h * 0.5} ${cx + w / 2} ${cy}`} />
      {/* center line */}
      <path d={`M ${cx - w * 0.42} ${cy + 1} Q ${cx} ${cy - 1} ${cx + w * 0.42} ${cy + 1}`} strokeWidth={sw * 0.7} />
    </g>);

}

// Soft blob (organic shape)
function Blob({ cx, cy, r, fill, opacity = 1, seed = 0 }) {
  // Slightly irregular blob using cubic curves
  const k = 0.55; // bezier handle
  const j = (i) => Math.sin(seed + i) * r * 0.08;
  return (
    <path
      opacity={opacity}
      fill={fill}
      d={`M ${cx} ${cy - r + j(0)}
          C ${cx + r * k + j(1)} ${cy - r + j(2)} ${cx + r + j(3)} ${cy - r * k + j(4)} ${cx + r + j(5)} ${cy + j(6)}
          C ${cx + r + j(7)} ${cy + r * k + j(8)} ${cx + r * k + j(9)} ${cy + r + j(10)} ${cx + j(11)} ${cy + r + j(12)}
          C ${cx - r * k + j(13)} ${cy + r + j(14)} ${cx - r + j(15)} ${cy + r * k + j(16)} ${cx - r + j(17)} ${cy + j(18)}
          C ${cx - r + j(19)} ${cy - r * k + j(20)} ${cx - r * k + j(21)} ${cy - r + j(22)} ${cx + j(23)} ${cy - r + j(24)} Z`} />);

}

// ============================================================
// 1. Home hero (full-bleed) — "two voices meeting"
//    Two large overlapping speech bubbles, lavender on champagne wash.
// ============================================================
function IlloHomeHeroBleed() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="800" height="600" fill={ILLO_COLORS.champagne} opacity="0.55" />
      {/* big lavender blob bottom-left */}
      <Blob cx={220} cy={420} r={220} fill={ILLO_COLORS.lavender} seed={1} />
      {/* purple bubble top-right */}
      <Bubble cx={560} cy={240} rx={180} ry={150} fill={ILLO_COLORS.purple}
      tailX={460} tailY={360} tailDx={-30} tailDy={50} />
      {/* small champagne bubble */}
      <Bubble cx={300} cy={180} rx={70} ry={58} fill={ILLO_COLORS.champagne}
      tailX={262} tailY={228} tailDx={-22} tailDy={28} />
      {/* squiggles */}
      <Squiggle x={110} y={120} w={120} color={ILLO_COLORS.ink} sw={2.5} />
      <Squiggle x={620} y={500} w={140} color={ILLO_COLORS.purple} sw={3} rotate={-8} />
      {/* tiny dots */}
      <circle cx={440} cy={500} r={8} fill={ILLO_COLORS.ink} />
      <circle cx={470} cy={520} r={5} fill={ILLO_COLORS.ink} />
      <circle cx={150} cy={300} r={6} fill={ILLO_COLORS.purple} />
    </svg>);

}

// ============================================================
// 2. Home hero (split) — "the right words finding you"
//    Stacked bubble + lips, vertical 4:5 composition.
// ============================================================
function IlloHomeHeroSplit() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="400" height="500" fill="transparent" data-comment-anchor="c8550e9406-rect-112-7" />
      {/* champagne blob top */}
      <Blob cx={290} cy={120} r={130} fill={ILLO_COLORS.champagne} seed={2} />
      {/* purple bubble center */}
      <Bubble cx={170} cy={230} rx={130} ry={110} fill={ILLO_COLORS.purple}
      tailX={100} tailY={320} tailDx={-20} tailDy={36} />
      {/* lips on bubble */}
      <Lips cx={170} cy={230} w={130} color={ILLO_COLORS.champagne} sw={3} />
      {/* hand-drawn marks */}
      <Squiggle x={50} y={420} w={120} color={ILLO_COLORS.ink} sw={2.5} />
      <circle cx={340} cy={400} r={28} fill="none" stroke={ILLO_COLORS.ink} strokeWidth={2.5} />
      <circle cx={340} cy={400} r={8} fill={ILLO_COLORS.ink} />
      {/* small dots */}
      <circle cx={60} cy={80} r={6} fill={ILLO_COLORS.purple} />
      <circle cx={90} cy={110} r={4} fill={ILLO_COLORS.purple} />
    </svg>);

}

// ============================================================
// 3. Home mission — "community / founded 2020"
//    Three overlapping circles like silhouetted figures.
// ============================================================
function IlloHomeMission() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      {/* Soft organic petal/pebble forms overlapping at center —
          individual people meeting in shared space */}
      <g>
        {/* large lavender pebble, tilted */}
        <ellipse cx={150} cy={260} rx={130} ry={170}
          fill={ILLO_COLORS.lavender} transform="rotate(-22 150 260)" />
        {/* champagne pebble overlapping right */}
        <ellipse cx={270} cy={230} rx={110} ry={150}
          fill={ILLO_COLORS.champagne} transform="rotate(18 270 230)" opacity="0.92" />
        {/* deep purple pebble at the intersection — the meeting point */}
        <ellipse cx={210} cy={290} rx={70} ry={95}
          fill={ILLO_COLORS.purple} transform="rotate(-4 210 290)" />
      </g>
      {/* hand-drawn loop tying them together */}
      <path d="M 80 380 C 140 420, 260 420, 320 380"
        fill="none" stroke={ILLO_COLORS.ink} strokeWidth={3} strokeLinecap="round" />
      {/* small accent dots */}
      <circle cx={70} cy={130} r={6} fill={ILLO_COLORS.ink} />
      <circle cx={340} cy={150} r={5} fill={ILLO_COLORS.purple} />
      <circle cx={350} cy={400} r={4} fill={ILLO_COLORS.champagne} />
    </svg>);

}

// ============================================================
// 4. About / Problem — "the bad-fit therapist"
//    Misaligned / disconnected shapes — bubble facing away,
//    a closed lip, broken arrows.
// ============================================================
function IlloAboutProblem() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="400" height="500" fill={ILLO_COLORS.lavender} />
      {/* A shape that should be whole, fractured down the middle —
          two halves that don't quite meet. Misalignment as form. */}
      <g>
        {/* left half — purple, anchored top-left */}
        <path d="M 60 90 L 188 90 L 168 410 L 60 410 Z"
          fill={ILLO_COLORS.purple} />
        {/* right half — champagne, OFFSET down and right */}
        <path d="M 212 130 L 340 130 L 340 450 L 232 450 Z"
          fill={ILLO_COLORS.champagne} />
        {/* the gap — a thin ink line where the seam should have been */}
        <line x1={200} y1={70} x2={200} y2={460}
          stroke={ILLO_COLORS.ink} strokeWidth={2}
          strokeDasharray="4 8" strokeLinecap="round" />
      </g>
      {/* small mismatched markers on each side — circle vs triangle */}
      <circle cx={120} cy={250} r={14} fill={ILLO_COLORS.ink} />
      <polygon points="276,236 296,266 256,266"
        fill={ILLO_COLORS.ink} />
      {/* tiny corner glyph — questioning */}
      <g stroke={ILLO_COLORS.ink} strokeWidth={2.5} strokeLinecap="round" fill="none">
        <path d="M 350 70 q 8 -10 16 0 q 0 8 -8 12 l 0 6" />
        <circle cx={358} cy={98} r={1.5} fill={ILLO_COLORS.ink} stroke="none" />
      </g>
    </svg>);

}

// ============================================================
// 5. About / Founder — "founder's voice"
//    One large bubble, hand-marks like notes, signature squiggle.
// ============================================================
function IlloAboutFounder() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="400" height="500" fill={ILLO_COLORS.champagne} opacity="0.5" />
      <rect width="400" height="500" fill={ILLO_COLORS.paper} opacity="0.45" />
      {/* big purple bubble center */}
      <Bubble cx={200} cy={220} rx={150} ry={130} fill={ILLO_COLORS.purple}
      tailX={120} tailY={330} tailDx={-26} tailDy={42} />
      {/* hand-written-style marks INSIDE bubble — three lines */}
      <g stroke={ILLO_COLORS.champagne} strokeWidth={3} strokeLinecap="round" fill="none">
        <path d={`M 110 190 q 30 -8 60 0 t 60 0 t 60 0`} />
        <path d={`M 110 220 q 30 -6 50 0 t 50 0`} />
        <path d={`M 110 250 q 30 -8 70 0 t 60 0`} />
      </g>
      {/* signature squiggle below */}
      <path d={`M 90 410 q 20 -20 40 -10 t 30 5 q 10 5 30 -10 t 50 0 q 15 5 40 -8`}
      fill="none" stroke={ILLO_COLORS.ink} strokeWidth={3} strokeLinecap="round" />
      {/* small star/sparkle */}
      <g fill={ILLO_COLORS.ink}>
        <circle cx={340} cy={120} r={5} />
      </g>
      <g stroke={ILLO_COLORS.purple} strokeWidth={2.5} strokeLinecap="round">
        <line x1={60} y1={130} x2={60} y2={150} />
        <line x1={50} y1={140} x2={70} y2={140} />
      </g>
    </svg>);

}

// ============================================================
// 6. Match hero — "your shortlist arrives"
//    Three aligned bubble-cards, ascending — "the right options".
// ============================================================
function IlloMatchHero() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      {/* Three steps along a gentle path — 1, 2, 3 → done.
          Reads as: easy, linear, finished. */}
      {/* the path itself — single confident curve */}
      <path d="M 70 380 C 140 380, 160 250, 230 250 S 320 120, 350 120"
        fill="none" stroke={ILLO_COLORS.ink} strokeWidth={3}
        strokeLinecap="round" strokeDasharray="1 10" />

      {/* Step 1 — champagne dot */}
      <g>
        <circle cx={70} cy={380} r={34} fill={ILLO_COLORS.champagne} />
        <text x={70} y={388} textAnchor="middle"
          fontFamily="Poppins, system-ui" fontSize={22} fontWeight={700}
          fill={ILLO_COLORS.ink}>1</text>
      </g>

      {/* Step 2 — purple dot */}
      <g>
        <circle cx={210} cy={260} r={42} fill={ILLO_COLORS.purple} />
        <text x={210} y={269} textAnchor="middle"
          fontFamily="Poppins, system-ui" fontSize={26} fontWeight={700}
          fill={ILLO_COLORS.champagne}>2</text>
      </g>

      {/* Step 3 — ink dot with check (done) */}
      <g>
        <circle cx={340} cy={130} r={48} fill={ILLO_COLORS.ink} />
        <polyline points="316,132 334,150 364,116"
          fill="none" stroke={ILLO_COLORS.champagne} strokeWidth={6}
          strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* small sparkle at the destination */}
      <g stroke={ILLO_COLORS.purple} strokeWidth={2.5} strokeLinecap="round">
        <line x1={300} y1={60} x2={300} y2={80} />
        <line x1={290} y1={70} x2={310} y2={70} />
      </g>
    </svg>);

}

// ============================================================
// Dispatcher: <BrandIllo name="..." />
// ============================================================
function BrandIllo({ name }) {
  const map = {
    "home-hero-bleed": IlloHomeHeroBleed,
    "home-hero-split": IlloHomeHeroSplit,
    "home-mission": IlloHomeMission,
    "about-problem": IlloAboutProblem,
    "about-founder": IlloAboutFounder,
    "match-hero": IlloMatchHero
  };
  const C = map[name];
  return C ? <C /> : null;
}

Object.assign(window, { BrandIllo });