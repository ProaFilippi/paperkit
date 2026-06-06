// Solid ink — expandable on hover (F1 · F2 · F3)
// Extracted from left-tabs.jsx for standalone export.

const TAB_SAMPLES = [
  { id: 'overview', label: 'Overview', num: '01' },
  { id: 'faculty',  label: 'Faculty',  num: '02' },
  { id: 'research', label: 'Research', num: '03' },
  { id: 'finance',  label: 'Finance',  num: '04' },
  { id: 'housing',  label: 'Housing',  num: '05' },
  { id: 'notes',    label: 'Notes',    num: '06' },
];
const ACTIVE_INDEX = 1;

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
  paperShadow:
    '0 1px 2px rgba(14,14,14,0.04), 0 8px 20px -6px rgba(14,14,14,0.08), 0 24px 40px -18px rgba(14,14,14,0.12)',
};

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

/* ---------------- Icons ---------------- */
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

const F_TOK = {
  TAB_H: 36,
  COLLAPSED_W: 36,
  EXPANDED_W: 148,
  ICON_SIZE: 14,
  ACTIVE_OUT: 8,
  ACTIVE_INTO_PAPER: 4,
  PAPER_LEFT: 192,
  RAIL_TOP: 64,
  EASE: 'cubic-bezier(.22,.61,.36,1)',
  DUR: 220,
  INACTIVE_BG: '#EBE7DD',
  HOVER_BG:    '#E2DDD0',
};

function FInkTab({ tab, isActive, isOpen, onClick, onMouseEnter, onMouseLeave }) {
  const { COLLAPSED_W, EXPANDED_W, TAB_H, ACTIVE_OUT, ACTIVE_INTO_PAPER, EASE, DUR, INACTIVE_BG, HOVER_BG } = F_TOK;
  const [isHovering, setHovering] = React.useState(false);
  const iconW = iconWidthFor(tab.id);
  const baseW = isOpen ? EXPANDED_W : COLLAPSED_W;
  const width = baseW + (isActive ? ACTIVE_OUT + ACTIVE_INTO_PAPER : 0);
  const iconLeft = (COLLAPSED_W - iconW) / 2;

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

const F_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'faculty',  label: 'Faculty' },
  { id: 'ipeds',    label: 'IPEDS reporting' },
  { id: 'finance',  label: 'Finance' },
  { id: 'housing',  label: 'Housing' },
  { id: 'notes',    label: 'Notes' },
];

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

function FlagF3() {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const [activeOpen, setActiveOpen] = React.useState(false);

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

/* ---------------- Layout ---------------- */
function Artboard({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontFamily: PK.mono, fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(60,50,40,0.7)',
      }}>{label}</div>
      <div style={{
        width: 640, height: 540,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px -8px rgba(0,0,0,0.10)',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{
      minHeight: '100%',
      background: '#f0eee9',
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1.2px)',
      backgroundSize: '22px 22px',
      padding: '56px 48px 80px',
      fontFamily: PK.body,
      color: PK.ink,
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: 2200, margin: '0 auto' }}>
        <div style={{
          fontFamily: PK.mono, fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(60,50,40,0.6)',
        }}>Paper Kit · Left tabs</div>
        <h1 style={{
          fontFamily: PK.display, fontWeight: 500,
          fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.05,
          margin: '8px 0 6px',
        }}>Solid ink — expandable on hover</h1>
        <p style={{
          fontSize: 14.5, lineHeight: 1.55, margin: 0,
          color: 'rgba(40,30,20,0.7)', maxWidth: '60ch',
        }}>
          Starts as an icon-only rail; reveals labels on hover. Three takes on what
          "expand" means. Hover any frame to see it in motion.
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 40,
          marginTop: 44,
        }}>
          <Artboard label="F1 · Whole rail expands"><FlagF1 /></Artboard>
          <Artboard label="F2 · Per-tab expand"><FlagF2 /></Artboard>
          <Artboard label="F3 · Staggered close"><FlagF3 /></Artboard>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
