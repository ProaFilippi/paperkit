// Left-side notebook tabs — 6 options
// Each artboard is a slice of "desk" with one piece of floating paper.
// Tabs project off the left edge of the paper.
// All options stay in the paper-kit register: ink + mute, hairlines,
// teal only as a highlighter swipe. Sans only. No emoji.

const TAB_SAMPLES = [
  { id: 'overview', label: 'Overview', num: '01' },
  { id: 'faculty',  label: 'Faculty',  num: '02' },
  { id: 'research', label: 'Research', num: '03' },
  { id: 'finance',  label: 'Finance',  num: '04' },
  { id: 'housing',  label: 'Housing',  num: '05' },
  { id: 'notes',    label: 'Notes',    num: '06' },
];
const ACTIVE_INDEX = 1; // Faculty

const PK = {
  ink:   '#0E0E0E',
  mute:  '#6E6E73',
  desk:  '#FAFAF7',
  paper: '#FFFFFF',
  hair:  'rgba(14,14,14,0.10)',
  display: '"Space Grotesk", "Inter", system-ui, sans-serif',
  body:    '"Inter", "Helvetica Neue", system-ui, sans-serif',
  mono:    '"JetBrains Mono", ui-monospace, monospace',
  hl: 'linear-gradient(100deg, rgba(74,133,128,0) 0%, rgba(74,133,128,0.55) 8%, rgba(74,133,128,0.48) 55%, rgba(74,133,128,0.18) 92%, rgba(74,133,128,0) 100%)',
  hlVert: 'linear-gradient(180deg, rgba(74,133,128,0) 0%, rgba(74,133,128,0.55) 14%, rgba(74,133,128,0.42) 80%, rgba(74,133,128,0) 100%)',
  paperShadow:
    '0 1px 2px rgba(14,14,14,0.04), 0 8px 20px -6px rgba(14,14,14,0.08), 0 24px 40px -18px rgba(14,14,14,0.12)',
};

/* ------------------------------------------------------------------ *
   Shared bits
 * ------------------------------------------------------------------ */

function Desk({ children }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: PK.desk,
      backgroundImage: `radial-gradient(circle, rgba(14,14,14,0.07) 1px, transparent 1.2px)`,
      backgroundSize: '22px 22px',
      backgroundPosition: '0 0',
      fontFamily: PK.body,
      color: PK.ink,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function PaperBody() {
  return (
    <>
      <div style={{ fontFamily: PK.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: PK.mute }}>
        Section · faculty · 09:14
      </div>
      <div style={{
        fontFamily: PK.display, fontWeight: 500,
        fontSize: 40, lineHeight: 0.96, letterSpacing: '-0.02em',
        margin: '14px 0 6px',
      }}>
        Senior hires —<br />
        <span style={{
          backgroundImage: PK.hl,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 65%',
          backgroundPosition: '0 72%',
          padding: '0 6px',
        }}>ahead of plan.</span>
      </div>
      <hr style={{ height: 0, border: 0, borderTop: `1px solid ${PK.hair}`, margin: '20px 0' }} />
      <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: '#2D2D2D', maxWidth: '32ch' }}>
        Three searches closed this week. Two more sit in final round.
        I'd open a sub-section on STEM concentration before Friday.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
        <Tag>Cohort 2026</Tag>
        <Tag>Coverage 96%</Tag>
      </div>
    </>
  );
}

function Tag({ children, filled }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px',
      border: `1.25px solid ${PK.ink}`,
      background: filled ? PK.ink : '#FFF',
      color: filled ? '#FFF' : PK.ink,
      fontFamily: PK.mono, fontSize: 10.5,
      letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1,
    }}>{children}</span>
  );
}

/* ================================================================== *
   A · Classic file-folder tabs
   White paper tabs project off the left edge. Hairline frame.
   Active tab is the same height, full-paper-white, with a teal swipe
   behind the label and a thin ink rule connecting it visually to the
   page edge.
 * ================================================================== */
function OptionA() {
  const PAPER_LEFT = 130;
  const TAB_TOP = 64;
  const TAB_H = 44;
  const TAB_GAP = 6;
  const TAB_W = 118;

  return (
    <Desk>
      {/* tabs (positioned absolutely so they read as "behind" the paper) */}
      {TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: PAPER_LEFT - TAB_W + (active ? -6 : 0),
            top: TAB_TOP + i * (TAB_H + TAB_GAP),
            width: TAB_W + (active ? 14 : 0),
            height: TAB_H,
            background: PK.paper,
            borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            paddingLeft: 14,
            boxShadow: active
              ? '-2px 2px 6px -2px rgba(14,14,14,0.10), -4px 4px 10px -4px rgba(14,14,14,0.08)'
              : '-1px 1px 3px -1px rgba(14,14,14,0.06), -2px 2px 6px -3px rgba(14,14,14,0.06)',
            zIndex: active ? 2 : 1,
          }}>
            <span style={{
              fontFamily: PK.mono, fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: active ? PK.ink : PK.mute,
              fontWeight: active ? 600 : 500,
              backgroundImage: active ? PK.hl : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 70%',
              backgroundPosition: '0 65%',
              padding: '2px 4px',
            }}>{t.label}</span>
          </div>
        );
      })}

      {/* the page */}
      <div style={{
        position: 'absolute',
        left: PAPER_LEFT, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 3,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

/* ================================================================== *
   B · Numbered chapter tabs
   Square stacked tabs running down the left margin of the paper itself
   (inside the page, not protruding). Big display numeral + tiny mono
   label below. Active reverses to ink with teal swipe over the number.
 * ================================================================== */
function OptionB() {
  return (
    <Desk>
      <div style={{
        position: 'absolute',
        left: 40, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        display: 'flex',
      }}>
        {/* tab rail (inside the paper, left column) */}
        <div style={{
          flex: '0 0 88px',
          borderRight: `1px solid ${PK.hair}`,
          padding: '28px 0',
          display: 'flex', flexDirection: 'column',
        }}>
          {TAB_SAMPLES.map((t, i) => {
            const active = i === ACTIVE_INDEX;
            return (
              <button key={t.id} type="button" style={{
                appearance: 'none', border: 0, background: 'transparent',
                width: '100%', padding: '14px 8px 12px',
                textAlign: 'center', cursor: 'pointer',
                borderTop: i === 0 ? 'none' : `1px solid ${PK.hair}`,
                color: active ? PK.ink : PK.mute,
              }}>
                <div style={{
                  fontFamily: PK.display, fontWeight: 500,
                  fontSize: 26, letterSpacing: '-0.01em', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  backgroundImage: active ? PK.hl : 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 65%',
                  backgroundPosition: '0 70%',
                  padding: '0 4px',
                  display: 'inline-block',
                }}>{t.num}</div>
                <div style={{
                  marginTop: 6,
                  fontFamily: PK.mono, fontSize: 9.5,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontWeight: active ? 600 : 500,
                }}>{t.label}</div>
              </button>
            );
          })}
        </div>

        {/* page body */}
        <div style={{ padding: '28px 32px', flex: 1, minWidth: 0 }}>
          <PaperBody />
        </div>
      </div>
    </Desk>
  );
}

/* ================================================================== *
   C · Layered cardstock — each tab is its own piece of paper, peeking
   out from behind. Active card slides further left and forward. Reads
   like file folders in a drawer seen from above-front.
 * ================================================================== */
function OptionC() {
  const PAPER_LEFT = 150;
  const TAB_TOP = 56;
  const TAB_H = 38;
  const TAB_GAP = 10;

  return (
    <Desk>
      {TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        const offset = active ? 32 : i * 6 + 6; // each non-active peeks a bit more than the previous
        const tabW = 110 + offset;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: PAPER_LEFT - tabW,
            top: TAB_TOP + i * (TAB_H + TAB_GAP),
            width: tabW + 6, // overlap into the paper so seam is hidden
            height: TAB_H,
            background: PK.paper,
            boxShadow: active
              ? '0 1px 2px rgba(14,14,14,0.04), 0 6px 14px -4px rgba(14,14,14,0.10), 0 14px 28px -10px rgba(14,14,14,0.12)'
              : '0 1px 2px rgba(14,14,14,0.04), 0 4px 10px -4px rgba(14,14,14,0.08)',
            display: 'flex', alignItems: 'center', paddingLeft: 16,
            zIndex: active ? 4 : 1,
            transform: active ? 'translateY(-1px)' : 'none',
          }}>
            <span style={{
              fontFamily: PK.mono, fontSize: 10.5,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: active ? PK.ink : PK.mute,
              fontWeight: active ? 600 : 500,
              backgroundImage: active ? PK.hl : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 70%',
              backgroundPosition: '0 65%',
              padding: '2px 4px',
            }}>{t.label}</span>
          </div>
        );
      })}

      <div style={{
        position: 'absolute',
        left: PAPER_LEFT, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 5,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

/* ================================================================== *
   D · Hairline ghost rail — no fill, no border. Labels run down the
   left margin in mono caps, separated by a single hairline. Active is
   marked by a small teal dot + bolder weight. The quietest option.
 * ================================================================== */
function OptionD() {
  return (
    <Desk>
      <div style={{
        position: 'absolute',
        left: 40, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        display: 'flex',
      }}>
        <div style={{
          flex: '0 0 132px',
          padding: '36px 0 36px 22px',
          display: 'flex', flexDirection: 'column',
          borderRight: `1px solid ${PK.hair}`,
        }}>
          {TAB_SAMPLES.map((t, i) => {
            const active = i === ACTIVE_INDEX;
            return (
              <div key={t.id} style={{
                position: 'relative',
                padding: '12px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${PK.hair}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: active ? '#4A8580' : 'transparent',
                  outline: active ? 'none' : `1px solid ${PK.hair}`,
                  outlineOffset: -1,
                  flex: '0 0 auto',
                }} />
                <span style={{
                  fontFamily: PK.mono, fontSize: 10.5,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: active ? PK.ink : PK.mute,
                  fontWeight: active ? 600 : 500,
                }}>{t.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '28px 32px', flex: 1, minWidth: 0 }}>
          <PaperBody />
        </div>
      </div>
    </Desk>
  );
}

/* ================================================================== *
   E · Sticky flag tabs — narrow vertical strips sticking out left of
   the paper, like Post-it page flags. Each label is rotated -90°.
   Active flag is fully teal-swiped, edge-to-edge.
 * ================================================================== */
function OptionE() {
  const PAPER_LEFT = 70;
  const FLAG_TOP = 60;
  const FLAG_H = 64;
  const FLAG_W = 22;
  const FLAG_GAP = 12;

  return (
    <Desk>
      {TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: PAPER_LEFT - FLAG_W + (active ? -4 : 0),
            top: FLAG_TOP + i * (FLAG_H + FLAG_GAP),
            width: FLAG_W + 6,
            height: FLAG_H,
            background: active ? 'transparent' : PK.paper,
            backgroundImage: active ? PK.hlVert : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: active
              ? 'none'
              : '-1px 1px 3px -1px rgba(14,14,14,0.06), -2px 2px 6px -3px rgba(14,14,14,0.06)',
            zIndex: 1,
          }}>
            <span style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: PK.mono, fontSize: 9.5,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: PK.ink, fontWeight: active ? 700 : 500,
            }}>{t.label}</span>
          </div>
        );
      })}

      <div style={{
        position: 'absolute',
        left: PAPER_LEFT, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 3,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

/* ================================================================== *
   F · Solid ink tabs — assertive, reverse-fill. Inactive tabs are
   ink-filled with white mono text (like keyboard caps). Active tab is
   white-paper with teal swipe behind the label, and overhangs further
   left, breaking the rail.
 * ================================================================== */
function OptionF() {
  const PAPER_LEFT = 130;
  const TAB_TOP = 64;
  const TAB_H = 40;
  const TAB_GAP = 4;
  const TAB_W = 112;

  return (
    <Desk>
      {TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: PAPER_LEFT - TAB_W + (active ? -10 : 0),
            top: TAB_TOP + i * (TAB_H + TAB_GAP),
            width: TAB_W + (active ? 16 : 0),
            height: TAB_H,
            background: active ? PK.paper : PK.ink,
            color: active ? PK.ink : '#FFFFFF',
            display: 'flex', alignItems: 'center',
            paddingLeft: 14,
            zIndex: active ? 2 : 1,
            boxShadow: active
              ? '-2px 2px 6px -2px rgba(14,14,14,0.14), -4px 4px 10px -4px rgba(14,14,14,0.10)'
              : 'none',
          }}>
            <span style={{
              fontFamily: PK.mono, fontSize: 10.5,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: active ? 700 : 500,
              backgroundImage: active ? PK.hl : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 70%',
              backgroundPosition: '0 65%',
              padding: '2px 4px',
              color: 'inherit',
            }}>{t.label}</span>
          </div>
        );
      })}

      <div style={{
        position: 'absolute',
        left: PAPER_LEFT, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 3,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

/* ================================================================== *
   STICKY PAGE FLAGS — six geometry/weight variations
   All keep the rotated mono label and the narrow vertical strip.
   What changes: outer edge shape, fill rule, density, accent placement.
 * ================================================================== */

// Shared scaffold: paints the desk + the floating paper.
// `renderFlags(paperLeft)` returns the absolutely-positioned flag list.
function FlagScene({ paperLeft = 70, renderFlags }) {
  return (
    <Desk>
      {renderFlags(paperLeft)}
      <div style={{
        position: 'absolute',
        left: paperLeft, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 3,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

// Shared label — rotated, mono caps. `boldActive` toggles weight.
function FlagLabel({ children, active, color = PK.ink, size = 9.5 }) {
  return (
    <span style={{
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)',
      fontFamily: PK.mono, fontSize: size,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color, fontWeight: active ? 700 : 500,
      lineHeight: 1,
    }}>{children}</span>
  );
}

/* ---------- E1 · Flat strip (the original) ---------- */
function FlagE1() {
  const FLAG_H = 64, FLAG_W = 22, FLAG_TOP = 60, FLAG_GAP = 12;
  return (
    <FlagScene paperLeft={70} renderFlags={(paperLeft) => (
      TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: paperLeft - FLAG_W + (active ? -4 : 0),
            top: FLAG_TOP + i * (FLAG_H + FLAG_GAP),
            width: FLAG_W + 6, height: FLAG_H,
            background: active ? 'transparent' : PK.paper,
            backgroundImage: active ? PK.hlVert : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: active ? 'none'
              : '-1px 1px 3px -1px rgba(14,14,14,0.06), -2px 2px 6px -3px rgba(14,14,14,0.06)',
          }}>
            <FlagLabel active={active}>{t.label}</FlagLabel>
          </div>
        );
      })
    )} />
  );
}

/* ---------- E2 · Rounded outer edge (Post-it page flag) ---------- */
function FlagE2() {
  const FLAG_H = 60, FLAG_W = 26, FLAG_TOP = 64, FLAG_GAP = 14;
  return (
    <FlagScene paperLeft={74} renderFlags={(paperLeft) => (
      TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: paperLeft - FLAG_W + (active ? -4 : 0),
            top: FLAG_TOP + i * (FLAG_H + FLAG_GAP),
            width: FLAG_W + 6, height: FLAG_H,
            background: active ? 'transparent' : PK.paper,
            backgroundImage: active ? PK.hlVert : 'none',
            borderTopLeftRadius: 13, borderBottomLeftRadius: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: 4,
            boxShadow: active ? 'none'
              : '-1px 1px 3px -1px rgba(14,14,14,0.08), -3px 2px 8px -3px rgba(14,14,14,0.08)',
          }}>
            <FlagLabel active={active}>{t.label}</FlagLabel>
          </div>
        );
      })
    )} />
  );
}

/* ---------- E3 · Pennant tip — chevron pointing outward ---------- */
function FlagE3() {
  const FLAG_H = 60, FLAG_W = 32, FLAG_TOP = 60, FLAG_GAP = 12;
  // chevron with a notch on the outer (left) edge
  const clip = 'polygon(0 50%, 14px 0, 100% 0, 100% 100%, 14px 100%)';
  return (
    <FlagScene paperLeft={80} renderFlags={(paperLeft) => (
      TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: paperLeft - FLAG_W + (active ? -6 : 0),
            top: FLAG_TOP + i * (FLAG_H + FLAG_GAP),
            width: FLAG_W + 6, height: FLAG_H,
            background: active ? 'transparent' : PK.paper,
            backgroundImage: active ? PK.hlVert : 'none',
            clipPath: clip,
            WebkitClipPath: clip,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: 10,
          }}>
            <FlagLabel active={active}>{t.label}</FlagLabel>
          </div>
        );
      })
    )} />
  );
}

/* ---------- E4 · Tape strip — wider, washi-tape feel ---------- */
function FlagE4() {
  const FLAG_H = 78, FLAG_W = 36, FLAG_TOP = 44, FLAG_GAP = 6;
  return (
    <FlagScene paperLeft={86} renderFlags={(paperLeft) => (
      TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        // alternate slight horizontal jitter so the tape feels hand-placed
        const jitter = active ? 0 : (i % 2 === 0 ? -1 : 1);
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: paperLeft - FLAG_W + (active ? -6 : jitter),
            top: FLAG_TOP + i * (FLAG_H + FLAG_GAP),
            width: FLAG_W + 6, height: FLAG_H,
            background: active ? '#FFFFFF' : '#FAFAF7',
            backgroundImage: active
              ? PK.hlVert
              : `repeating-linear-gradient(180deg, rgba(14,14,14,0) 0px, rgba(14,14,14,0) 6px, rgba(14,14,14,0.04) 6px, rgba(14,14,14,0.04) 7px)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: active
              ? '-2px 2px 8px -2px rgba(14,14,14,0.12), -4px 3px 10px -3px rgba(14,14,14,0.10)'
              : '-1px 1px 4px -1px rgba(14,14,14,0.08), -3px 2px 8px -3px rgba(14,14,14,0.08)',
          }}>
            <FlagLabel active={active} size={10.5}>{t.label}</FlagLabel>
          </div>
        );
      })
    )} />
  );
}

/* ---------- E5 · Teal-tipped — production-ready, dynamic sizing -----
   Flush rail of vertical flags. Each flag's height grows with the
   length of its label — same internal padding everywhere, so short
   labels get tight flags and long labels get tall ones, without ever
   touching their padding.

   - Inactive flag = receded off-white, hairline separator above
   - Active flag = matches paper white exactly + extends a few px under
     the page so the seam disappears; halo shadow lifts it above its
     neighbors; halo is clip-pathed so it can't bleed onto the paper
   - Hover = inactive flag nudges 2 px further left
 * ------------------------------------------------------------------- */

// Demo labels include a long one so the dynamic sizing is visible.
const E5_TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'faculty',   label: 'Faculty' },
  { id: 'research',  label: 'Research & IP' },
  { id: 'finance',   label: 'Finance' },
  { id: 'housing',   label: 'Housing' },
  { id: 'notes',     label: 'Notes' },
];

function FlagE5() {
  const [hover, setHover] = React.useState(-1);
  const [active, setActive] = React.useState(1); // Faculty

  // --- Geometry tokens ---------------------------------------------
  const VPAD = 22;              // padding above & below the rotated label
  const FLAG_W = 36;            // rail width
  const PAPER_LEFT = 96;
  const ACTIVE_OUT = 8;         // px the active flag extrudes past the rail
  const ACTIVE_INTO_PAPER = 6;  // px the active flag pokes under the paper
  const LABEL_PAD_INNER = 6;    // gap from teal tip to label edge
  const TIP_W_REST = 3;
  const TIP_W_ACTIVE = 5;
  const INACTIVE_BG = '#F4F2EC';

  // Generous breathing room from the paper top to the first flag.
  const RAIL_TOP = 24 /* paper top */ + 56;

  return (
    <FlagScene paperLeft={PAPER_LEFT} renderFlags={(paperLeft) => (
      <div
        role="tablist"
        aria-orientation="vertical"
        style={{
          position: 'absolute',
          // container is wide enough to hold the active flag's full
          // overhang on both the outer and the under-paper sides
          left: paperLeft - FLAG_W - ACTIVE_OUT,
          top: RAIL_TOP,
          width: FLAG_W + ACTIVE_OUT + ACTIVE_INTO_PAPER,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // children control their own widths
        }}
        onMouseLeave={() => setHover(-1)}
      >
        {E5_TABS.map((t, i) => {
          const isActive = i === active;
          const isHover  = i === hover && !isActive;
          const adjActive = i - 1 === active || i === active;
          const adjHover  = i - 1 === hover  || i === hover;
          const showTopRule = i > 0 && !adjActive && !adjHover;

          // Inactive flag sits ACTIVE_OUT in from the container's left
          // edge so its right edge lands exactly at the paper's left
          // edge. Active flag goes all the way to 0 AND wider so its
          // right edge crosses INTO the paper by ACTIVE_INTO_PAPER.
          const indent = isActive ? 0 : (isHover ? ACTIVE_OUT - 2 : ACTIVE_OUT);
          const width = isActive
            ? FLAG_W + ACTIVE_OUT + ACTIVE_INTO_PAPER
            : (isHover ? FLAG_W + 2 : FLAG_W);
          const tipW = isActive ? TIP_W_ACTIVE : TIP_W_REST;

          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
              style={{
                appearance: 'none',
                position: 'relative',
                marginLeft: indent,
                width,
                // ▼ no fixed height — flow with the rotated label ▼
                paddingTop: VPAD,
                paddingBottom: VPAD,
                paddingLeft: tipW + LABEL_PAD_INNER,
                paddingRight: (isActive ? ACTIVE_INTO_PAPER : 0) + LABEL_PAD_INNER,
                background: isActive ? PK.paper : INACTIVE_BG,
                border: 0,
                cursor: isActive ? 'default' : 'pointer',
                zIndex: isActive ? 3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition:
                  'margin-left 180ms cubic-bezier(.22,.61,.36,1),' +
                  'width 180ms cubic-bezier(.22,.61,.36,1),' +
                  'background 180ms ease',
                // Clip the halo so it can't bleed onto the paper.
                clipPath: isActive ? 'inset(-40px 0px -40px -40px)' : 'none',
                WebkitClipPath: isActive ? 'inset(-40px 0px -40px -40px)' : 'none',
                boxShadow: isActive
                  ? [
                      '0 -6px 12px -6px rgba(14,14,14,0.22)',
                      '0  6px 12px -6px rgba(14,14,14,0.22)',
                      '-5px 0 12px -3px rgba(14,14,14,0.18)',
                      '0 1px 0 rgba(14,14,14,0.05)',
                    ].join(', ')
                  : 'none',
                outline: 'none',
              }}
            >
              {/* hairline separator between inactive flags */}
              {showTopRule && (
                <div style={{
                  position: 'absolute', left: 6, right: 6, top: 0,
                  height: 1, background: PK.hair,
                }} />
              )}

              {/* teal tip — outer edge */}
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: tipW,
                background: isActive ? '#4A8580' : 'rgba(74,133,128,0.55)',
                transition: 'width 180ms cubic-bezier(.22,.61,.36,1)',
              }} />

              {/* rotated label — its inline length sets the flag height */}
              <FlagLabel
                active={isActive}
                color={isActive ? PK.ink : PK.mute}
              >
                {t.label}
              </FlagLabel>
            </button>
          );
        })}
      </div>
    )} />
  );
}

/* ---------- E6 · Compact stacked — flags touch; active rises out ---------- */
function FlagE6() {
  const FLAG_H = 56, FLAG_W = 24, FLAG_TOP = 84;
  return (
    <FlagScene paperLeft={72} renderFlags={(paperLeft) => (
      TAB_SAMPLES.map((t, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <div key={t.id} style={{
            position: 'absolute',
            left: paperLeft - FLAG_W + (active ? -8 : 0),
            top: FLAG_TOP + i * FLAG_H, // no gap — flush stack
            width: FLAG_W + 6, height: FLAG_H,
            background: active ? 'transparent' : PK.paper,
            backgroundImage: active ? PK.hlVert : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderTop: i === 0 ? 'none' : `1px solid ${PK.hair}`,
            boxShadow: active
              ? '-2px 2px 6px -2px rgba(14,14,14,0.10)'
              : '-1px 0 2px -1px rgba(14,14,14,0.06), -2px 1px 5px -3px rgba(14,14,14,0.06)',
            zIndex: active ? 2 : 1,
          }}>
            <FlagLabel active={active}>{t.label}</FlagLabel>
          </div>
        );
      })
    )} />
  );
}

/* ==================================================================
   F · Solid ink — three expandable variations
   The rail starts collapsed (icon-only) and reveals labels on hover.
   Three takes on what "expand" means:
     F1 · whole rail expands together when the cursor enters it
     F2 · each tab expands individually on its own hover
     F3 · active tab is always expanded; the rest expand on hover
 * ================================================================== */

// --- Inline icon set (Lucide-style, 1.75px stroke) ----------------
// Each icon returns an SVG sized to its own intrinsic width — most are
// 14×14, but the IPEDS "text stamp" icon is 24×14.
const ICON_INTRINSIC_W = { ipeds: 24 };
function iconWidthFor(id) { return ICON_INTRINSIC_W[id] || 14; }

function Icon({ name, color = 'currentColor' }) {
  const p = {
    viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none',
    stroke: color, strokeWidth: 1.75,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'ipeds': return (
      <svg viewBox="0 0 24 14" width="24" height="14" fill="none">
        <text x="12" y="10.5" textAnchor="middle"
              fill={color} stroke="none"
              fontFamily='"JetBrains Mono", ui-monospace, monospace'
              fontSize="8" fontWeight="700" letterSpacing="-0.15">
          IPEDS
        </text>
      </svg>
    );
    case 'overview': return (
      <svg {...p}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    );
    case 'faculty': return (
      <svg {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    );
    case 'research': return (
      <svg {...p}>
        <path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V3" />
        <path d="M9 3h6" />
      </svg>
    );
    case 'finance': return (
      <svg {...p}>
        <path d="M3 20h18" />
        <path d="M5 16l4-4 3 3 7-7" />
        <path d="M14 8h5v5" />
      </svg>
    );
    case 'housing': return (
      <svg {...p}>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 9v12h14V9" />
      </svg>
    );
    case 'notes': return (
      <svg {...p}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
        <path d="M8 14h8" />
        <path d="M8 17h5" />
      </svg>
    );
    default: return null;
  }
}

// --- Tokens shared by all three F-expand variants ------------------
const F_TOK = {
  TAB_H: 36,
  COLLAPSED_W: 36,
  EXPANDED_W: 148,
  ICON_SIZE: 14,
  ACTIVE_OUT: 8,              // active flag overhangs the rail to the left
  ACTIVE_INTO_PAPER: 4,       // and pokes a hair under the paper edge
  PAPER_LEFT: 192,            // gives room for the expanded rail on the left
  RAIL_TOP: 64,
  EASE: 'cubic-bezier(.22,.61,.36,1)',
  DUR: 220,
  INACTIVE_BG: '#EBE7DD',     // warm light tan — clearly receded vs paper white
  HOVER_BG:    '#E2DDD0',     // a touch darker on cursor-over
};

// --- One expandable tab (used by F1 / F2 / F3) ---------------------
// The rail container has alignItems: flex-end so each tab's RIGHT edge
// pins to the paper edge. The tab's width grows leftward when it opens.
// `isActive` makes the tab wider on both sides — extends ACTIVE_OUT to
// the left and ACTIVE_INTO_PAPER under the paper (via negative marginRight).
function FInkTab({ tab, isActive, isOpen, onClick, onMouseEnter, onMouseLeave }) {
  const { COLLAPSED_W, EXPANDED_W, TAB_H, ACTIVE_OUT, ACTIVE_INTO_PAPER, EASE, DUR, INACTIVE_BG, HOVER_BG } = F_TOK;
  const [isHovering, setHovering] = React.useState(false);
  const iconW = iconWidthFor(tab.id);
  const baseW = isOpen ? EXPANDED_W : COLLAPSED_W;
  const width = baseW + (isActive ? ACTIVE_OUT + ACTIVE_INTO_PAPER : 0);
  const iconLeft = (COLLAPSED_W - iconW) / 2; // each icon centered in the collapsed slot

  const bg = isActive
    ? PK.paper
    : (isHovering ? HOVER_BG : INACTIVE_BG);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={(e) => { setHovering(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHovering(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        appearance: 'none', border: 0, padding: 0,
        position: 'relative',
        width,
        height: TAB_H,
        // pull the active tab's right edge ACTIVE_INTO_PAPER past the
        // rail's right edge (which is anchored to the paper's left edge),
        // so the active tab pokes under the paper and merges seamlessly
        marginRight: isActive ? -ACTIVE_INTO_PAPER : 0,
        background: bg,
        color: PK.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: iconLeft,
        paddingRight: isActive ? ACTIVE_INTO_PAPER : 0,
        cursor: isActive ? 'default' : 'pointer',
        zIndex: isActive ? 3 : 1,
        transition: `width ${DUR}ms ${EASE}, background ${DUR}ms ease`,
        clipPath: isActive ? 'inset(-24px 0 -24px -40px)' : 'none',
        WebkitClipPath: isActive ? 'inset(-24px 0 -24px -40px)' : 'none',
        boxShadow: isActive
          ? [
              '0 -3px 8px -4px rgba(14,14,14,0.16)',
              '0  3px 8px -4px rgba(14,14,14,0.16)',
              '-3px 0 8px -3px rgba(14,14,14,0.16)',
            ].join(', ')
          : 'none',
        outline: 'none',
        overflow: 'hidden',
      }}
    >
      <span style={{
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        width: iconW,
      }}>
        <Icon name={tab.id} color={PK.ink} />
      </span>

      <span style={{
        marginLeft: 12,
        fontFamily: PK.mono, fontSize: 10,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        fontWeight: isActive ? 700 : 500,
        whiteSpace: 'nowrap',
        color: PK.ink,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(-4px)',
        transition: `opacity ${DUR}ms ${EASE} ${isOpen ? '60ms' : '0ms'}, transform ${DUR}ms ${EASE}`,
        backgroundImage: isActive ? PK.hl : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 70%',
        backgroundPosition: '0 65%',
        padding: '2px 4px',
      }}>
        {tab.label}
      </span>
    </button>
  );
}

// Rail + paper scene. railWidth is what the RAIL'S right-edge-anchored
// container is set to — tabs that are wider than this overhang to the
// LEFT past the rail's left edge.
function InkRailScene({ railWidth, onMouseEnter, onMouseLeave, children }) {
  const { PAPER_LEFT, RAIL_TOP, DUR, EASE } = F_TOK;
  return (
    <Desk>
      <div
        role="tablist"
        aria-orientation="vertical"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          // rail's right edge anchored to paper's left edge
          left: PAPER_LEFT - railWidth,
          top: RAIL_TOP,
          width: railWidth,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-end',
          transition: `left ${DUR}ms ${EASE}, width ${DUR}ms ${EASE}`,
        }}
      >
        {children}
      </div>

      <div style={{
        position: 'absolute',
        left: PAPER_LEFT, top: 24, right: 24, bottom: 24,
        background: PK.paper,
        boxShadow: PK.paperShadow,
        padding: '28px 32px',
        zIndex: 3,
      }}>
        <PaperBody />
      </div>
    </Desk>
  );
}

// --- Tab list for the ink-expand variants (includes IPEDS) --------
const F_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'faculty',  label: 'Faculty' },
  { id: 'ipeds',    label: 'IPEDS reporting' },
  { id: 'finance',  label: 'Finance' },
  { id: 'housing',  label: 'Housing' },
  { id: 'notes',    label: 'Notes' },
];

/* ---------- F1 · Whole rail expands on hover ---------- */
function FlagF1() {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const railWidth = hovered ? F_TOK.EXPANDED_W : F_TOK.COLLAPSED_W;
  return (
    <InkRailScene
      railWidth={railWidth}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {F_TABS.map((t, i) => (
        <FInkTab
          key={t.id}
          tab={t}
          isActive={i === active}
          isOpen={hovered}
          onClick={() => setActive(i)}
        />
      ))}
    </InkRailScene>
  );
}

/* ---------- F2 · Per-tab expansion on hover ---------- *
   Rail stays narrow. Only the hovered tab balloons out to the LEFT
   to show its label. Active tab is signaled by color (paper-white)
   alone; it doesn't pre-open.
 * ----------------------------------------------------- */
function FlagF2() {
  const [hover, setHover] = React.useState(-1);
  const [active, setActive] = React.useState(1);
  return (
    <InkRailScene
      railWidth={F_TOK.COLLAPSED_W}
      onMouseLeave={() => setHover(-1)}
    >
      {F_TABS.map((t, i) => (
        <FInkTab
          key={t.id}
          tab={t}
          isActive={i === active}
          isOpen={i === hover}
          onClick={() => setActive(i)}
          onMouseEnter={() => setHover(i)}
        />
      ))}
    </InkRailScene>
  );
}

/* ---------- F3 · Active stays open briefly, then closes ---------- *
   On hover: every tab opens together (like F1).
   On leave: the inactive tabs collapse immediately, and the active
   tab stays open for a beat longer before collapsing — a staggered
   close so the eye lands on what was selected before everything
   tucks back to icons.
 * --------------------------------------------------------------- */
function FlagF3() {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const [activeOpen, setActiveOpen] = React.useState(false);

  // Stagger: active follows `hovered` true→false with a small delay.
  React.useEffect(() => {
    if (hovered) {
      setActiveOpen(true);
      return;
    }
    const t = setTimeout(() => setActiveOpen(false), 220);
    return () => clearTimeout(t);
  }, [hovered]);

  const railWidth = hovered ? F_TOK.EXPANDED_W : F_TOK.COLLAPSED_W;
  return (
    <InkRailScene
      railWidth={railWidth}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {F_TABS.map((t, i) => {
        const isActive = i === active;
        // active tab stays open through the stagger window;
        // inactive tabs follow the rail's hover state directly
        const isOpen = isActive ? activeOpen : hovered;
        return (
          <FInkTab
            key={t.id}
            tab={t}
            isActive={isActive}
            isOpen={isOpen}
            onClick={() => setActive(i)}
          />
        );
      })}
    </InkRailScene>
  );
}

/* ------------------------------------------------------------------ */

function App() {
  const W = 640;
  const H = 540;

  return (
    <DesignCanvas>
      <DCSection
        id="left-tabs"
        title="Left-side notebook tabs"
        subtitle="Six options for tabs anchored to the left edge of a floating paper. Same content; the geometry and weight changes."
      >
        <DCArtboard id="a" label="A · Classic file tabs" width={W} height={H}>
          <OptionA />
        </DCArtboard>
        <DCArtboard id="b" label="B · Numbered chapters" width={W} height={H}>
          <OptionB />
        </DCArtboard>
        <DCArtboard id="c" label="C · Layered cardstock" width={W} height={H}>
          <OptionC />
        </DCArtboard>
        <DCArtboard id="d" label="D · Hairline ghosts" width={W} height={H}>
          <OptionD />
        </DCArtboard>
        <DCArtboard id="e" label="E · Sticky page flags" width={W} height={H}>
          <OptionE />
        </DCArtboard>
        <DCArtboard id="f" label="F · Solid ink (reverse)" width={W} height={H}>
          <OptionF />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="flag-variations"
        title="Sticky page flags — six variations"
        subtitle="Same idea, six geometries: outer-edge shape, density, and where the teal lands. Active flag is always Faculty."
      >
        <DCArtboard id="e1" label="E1 · Flat strip (baseline)" width={W} height={H}>
          <FlagE1 />
        </DCArtboard>
        <DCArtboard id="e2" label="E2 · Rounded outer edge" width={W} height={H}>
          <FlagE2 />
        </DCArtboard>
        <DCArtboard id="e3" label="E3 · Pennant tip" width={W} height={H}>
          <FlagE3 />
        </DCArtboard>
        <DCArtboard id="e4" label="E4 · Tape strip" width={W} height={H}>
          <FlagE4 />
        </DCArtboard>
        <DCArtboard id="e5" label="E5 · Teal-tipped" width={W} height={H}>
          <FlagE5 />
        </DCArtboard>
        <DCArtboard id="e6" label="E6 · Compact stacked" width={W} height={H}>
          <FlagE6 />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="ink-expand"
        title="Solid ink — expandable on hover"
        subtitle="Starts as an icon-only rail; reveals labels on hover. Three takes on what 'expand' means."
      >
        <DCArtboard id="f1" label="F1 · Whole rail expands" width={W} height={H}>
          <FlagF1 />
        </DCArtboard>
        <DCArtboard id="f2" label="F2 · Per-tab expand" width={W} height={H}>
          <FlagF2 />
        </DCArtboard>
        <DCArtboard id="f3" label="F3 · Staggered close" width={W} height={H}>
          <FlagF3 />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
