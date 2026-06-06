// Paper-kit dashboard primitives — shared by IPEDS.html / Success.html /
// IPEDS Dashboard.html. Components assign to window at the bottom so they
// are available to page-specific Babel scripts.

const ink    = "#0E0E0E";
const mute   = "#6E6E73";
const hair   = "rgba(14,14,14,0.10)";
const hairS  = "rgba(14,14,14,0.18)";
const teal   = "var(--marker-orange)";
const tealD  = "var(--marker-orange-deep)";
const display= '"Space Grotesk", "Inter", system-ui, sans-serif';
const body   = '"Inter", "Helvetica Neue", system-ui, sans-serif';
const mono   = "var(--font-mono)";

/* ---------- Paper (the floating white card) ------------------ */
function Paper({ children, style, lifted, pad = "22px 26px" }) {
  return (
    <div style={{
      background: "#FFFFFF",
      padding: pad,
      boxShadow: lifted
        ? "0 1px 2px rgba(14,14,14,0.04), 0 12px 26px -8px rgba(14,14,14,0.10), 0 38px 60px -22px rgba(14,14,14,0.16)"
        : "0 1px 2px rgba(14,14,14,0.04), 0 8px 20px -6px rgba(14,14,14,0.08), 0 24px 40px -18px rgba(14,14,14,0.12)",
      ...style,
    }}>{children}</div>
  );
}

/* ---------- Stamp (mono caps metadata) ----------------------- */
const Stamp = ({ children, style, mute: m, l }) => (
  <span style={{
    fontFamily: mono,
    fontSize: l ? 10.5 : 9.5,
    fontWeight: 500,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: m ? mute : ink,
    lineHeight: 1,
    ...style,
  }}>{children}</span>
);

const Hair = ({ style }) => (
  <hr style={{ height: 0, border: 0, borderTop: `1px solid ${hair}`, margin: 0, ...style }} />
);

/* ---------- Highlighter swipe -------------------------------- */
const HL = ({ children, strong, style }) => (
  <span style={{
    backgroundImage: strong ? "var(--fp-hl-strong)" : "var(--fp-hl)",
    backgroundRepeat: "no-repeat",
    backgroundSize: strong ? "100% 70%" : "100% 65%",
    backgroundPosition: strong ? "0 70%" : "0 75%",
    padding: "0 4px",
    ...style,
  }}>{children}</span>
);

/* ---------- Mono tag pill ------------------------------------ */
function Tag({ children, filled, style }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 9px 4px 8px",
      border: `1.25px solid ${ink}`,
      background: filled ? ink : "#FFFFFF",
      color: filled ? "#FFFFFF" : ink,
      fontFamily: mono, fontSize: 10.5,
      letterSpacing: "0.10em", textTransform: "uppercase",
      lineHeight: 1, cursor: "pointer", userSelect: "none",
      ...style,
    }}>{children}</span>
  );
}

const Dot = ({ size = 9, style }) => (
  <span style={{
    display: "inline-block",
    width: size, height: size, borderRadius: "50%",
    background: teal, ...style,
  }} />
);

/* ---------- Pill (lens toggle) ------------------------------- */
function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px",
      fontFamily: mono, fontSize: 10.5,
      letterSpacing: "0.10em", textTransform: "uppercase",
      lineHeight: 1, cursor: "pointer",
      border: `1.25px solid ${ink}`,
      background: active ? ink : "#FFFFFF",
      color: active ? "#FFFFFF" : ink,
    }}>
      {active && <Dot size={6} style={{ background: teal }} />}
      {children}
    </button>
  );
}

/* ---------- Peer band ---------------------------------------- */
function PeerBand({ p25, p50, p75, you, min = 0, max = 100, height = 18 }) {
  const pct = v => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div style={{ position: "relative", height }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: height / 2 - 0.5,
        height: 1, background: hair,
      }} />
      <div style={{
        position: "absolute", left: pct(p25), width: `calc(${pct(p75)} - ${pct(p25)})`,
        top: height / 2 - 3.5, height: 7,
        background: "rgba(14,14,14,0.07)",
      }} />
      <div style={{
        position: "absolute", left: pct(p50), top: height / 2 - 5.5, width: 1, height: 11,
        background: hairS,
      }} />
      <div style={{
        position: "absolute", left: `calc(${pct(you)} - 6px)`, top: height / 2 - 6,
        width: 12, height: 12, borderRadius: "50%",
        background: teal,
        boxShadow: "0 0 0 2px #FFFFFF, 0 0 0 3px rgba(14,14,14,0.10)",
      }} />
    </div>
  );
}

/* ---------- Athena margin note ------------------------------- */
function AthenaNote({ children, chips, time = "09:14" }) {
  return (
    <Paper pad="26px 32px">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{
          fontFamily: display, fontSize: 17, fontWeight: 600,
          backgroundImage: "var(--fp-hl)", backgroundRepeat: "no-repeat",
          backgroundSize: "100% 60%", backgroundPosition: "0 65%",
          padding: "0 6px",
        }}>Athena</span>
        <Stamp m>Margin note · {time}</Stamp>
      </div>
      <Hair style={{ margin: "14px 0" }} />
      <p style={{
        fontFamily: body, fontSize: 16, lineHeight: 1.6, margin: 0, color: "#1A1A1A",
        textWrap: "pretty",
      }}>{children}</p>
      {chips && chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {chips.map((c, i) => <Tag key={i}>{c}</Tag>)}
        </div>
      )}
    </Paper>
  );
}

/* ---------- Lens row ----------------------------------------- */
function LensRow({ lenses, setLenses, refreshed = "Refreshed 11 min ago" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      paddingBottom: 18, marginBottom: 24, borderBottom: `1px solid ${hair}`,
    }}>
      <Stamp m style={{ marginRight: 6 }}>Lenses</Stamp>
      <Pill active={lenses.peer} onClick={() => setLenses(l => ({ ...l, peer: !l.peer }))}>
        Peer comparison · R1 Private
      </Pill>
      <Pill active={lenses.diversity !== "none"} onClick={() => {
        const order = ["none", "race", "gender", "pell"];
        const next = order[(order.indexOf(lenses.diversity) + 1) % order.length];
        setLenses(l => ({ ...l, diversity: next }));
      }}>
        Split by · {lenses.diversity === "none" ? "off" : lenses.diversity}
      </Pill>
      <Pill active onClick={() => {
        const order = ["3y", "5y", "10y"];
        setLenses(l => ({ ...l, horizon: order[(order.indexOf(l.horizon) + 1) % order.length] }));
      }}>
        Horizon · {lenses.horizon}
      </Pill>
      <span style={{ flex: 1 }} />
      <Stamp m>IPEDS · 2018–2024</Stamp>
      <span style={{ width: 14, height: 1, background: hair }} />
      <Stamp m>{refreshed}</Stamp>
    </div>
  );
}

/* ---------- Breadcrumb --------------------------------------- */
function Breadcrumb({ crumbs }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      {crumbs.map((c, i) => (
        <React.Fragment key={c.label}>
          {i > 0 && <span style={{ color: mute, fontFamily: mono, fontSize: 11 }}>/</span>}
          {c.href ? (
            <a href={c.href} style={{
              fontFamily: mono, fontSize: 11, letterSpacing: "0.14em",
              textTransform: "uppercase", fontWeight: 500,
              color: mute, textDecoration: "none",
              transition: "color 120ms",
            }}
              onMouseEnter={e => e.currentTarget.style.color = ink}
              onMouseLeave={e => e.currentTarget.style.color = mute}
            >{c.label}</a>
          ) : (
            <span style={{
              fontFamily: mono, fontSize: 11, letterSpacing: "0.14em",
              textTransform: "uppercase", fontWeight: c.active ? 600 : 500,
              color: c.active ? ink : mute,
              borderBottom: c.active ? `1px solid ${ink}` : "none",
              paddingBottom: c.active ? 2 : 0,
            }}>{c.label}</span>
          )}
        </React.Fragment>
      ))}
      <span style={{ flex: 1 }} />
      <Stamp m>Drawn by · Athena</Stamp>
    </div>
  );
}

/* ---------- In-paper context selectors ----------------------- */
// Two right-aligned triggers (Institution + Peer group). Tiny mono
// label, display-sans value, chevron. No chrome — the report itself
// is the container.
function ContextSelectors({ institution, peerGroup }) {
  return (
    <div style={{
      display: "flex", gap: 32, alignItems: "flex-start",
      paddingTop: 4,
    }}>
      <ContextCell label="Institution" value={institution.name} />
      <ContextCell
        label="Peer group"
        value={peerGroup.name}
        meta={`\u00b7 ${peerGroup.count} inst.`}
      />
    </div>
  );
}

function ContextCell({ label, value, meta }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ textAlign: "right", minWidth: 140 }}>
      <span style={{
        fontFamily: mono, fontSize: 9.5,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: mute, display: "block", marginBottom: 6,
      }}>{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "4px 0",
          background: "transparent", border: 0, cursor: "pointer",
          color: ink,
          fontFamily: display, fontSize: 17, fontWeight: 500,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          borderBottom: `1.25px solid ${hover ? ink : "transparent"}`,
          transition: "border-color 120ms ease",
        }}
      >
        {value}
        {meta && (
          <span style={{
            color: mute, fontFamily: mono, fontSize: 10.5,
            fontWeight: 400, letterSpacing: "0.06em",
          }}>{meta}</span>
        )}
        <span style={{ color: mute, fontFamily: mono, fontSize: 11, fontWeight: 400 }}>▾</span>
      </button>
    </div>
  );
}

/* ---------- Masthead ----------------------------------------- */
// `question` can be a string OR JSX (so the page can wrap a word in <HL>).
function Masthead({ institution, peerGroup, crumbs, level, levelStamp, question, questionMaxCh = 16 }) {
  return (
    <header style={{ padding: "40px 0 28px" }}>
      <Breadcrumb crumbs={crumbs} />

      <div style={{
        display: "grid", gridTemplateColumns: "1.4fr auto",
        gap: 48, alignItems: "flex-start",
      }}>
        <div>
          <Stamp m style={{ marginBottom: 14, display: "block" }}>{levelStamp}</Stamp>
          <h1 style={{
            fontFamily: display, fontWeight: 500,
            fontSize: 72, lineHeight: 0.92,
            letterSpacing: "-0.025em",
            margin: 0, color: ink,
            maxWidth: `${questionMaxCh}ch`,
          }}>
            {question}
          </h1>
        </div>
        <ContextSelectors institution={institution} peerGroup={peerGroup || PEER_GROUP} />
      </div>
    </header>
  );
}

/* ---------- Footer ------------------------------------------- */
function PageFooter({ left, right }) {
  return (
    <div style={{
      marginTop: 56, paddingTop: 18,
      borderTop: `1px solid ${hair}`,
      display: "flex", justifyContent: "space-between",
      fontFamily: mono, fontSize: 10.5,
      letterSpacing: "0.14em", textTransform: "uppercase", color: mute,
    }}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

/* ---------- Shared institution + peer group ------------------ */
const INST = {
  name: "Stanford University",
  carnegie: "R1 · Doctoral",
  sector: "Private · Non-profit",
  ipeds: "243744",
  headcount: "17,529",
};

const PEER_GROUP = {
  name: "R1 Private",
  count: 22,
};

/* ---------- Export to window --------------------------------- */
Object.assign(window, {
  PK: { ink, mute, hair, hairS, teal, tealD, display, body, mono },
  Paper, Stamp, Hair, HL, Tag, Dot, Pill,
  PeerBand, AthenaNote, LensRow, Breadcrumb, Masthead, PageFooter,
  ContextSelectors, ContextCell,
  INST, PEER_GROUP,
});
