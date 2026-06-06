// paper-kit/bi.jsx — Business-intelligence components in the paper register
// =============================================================
// Style rules (all enforced):
//   • White paper, no gradients, no rounded cards (radius: 0)
//   • Hairlines: rgba(14,14,14,0.10) — never borders
//   • Type: Space Grotesk display, Inter body, JetBrains Mono caps for labels/numbers
//   • Single teal #4A8580 = "you" + highlighter swipe for emphasis
//   • Peer = ink at low opacity (NOT blue-grey)
//   • Delta colors: ink-toned green/amber/crimson at low saturation
//   • No emoji, no glow, no drop-shadow on glyphs
// =============================================================
//
// Assumes dashboard-base.jsx has already loaded (Paper, Stamp, HL, Hair,
// Tag, Dot, Pill, PeerBand are on window). Re-uses those primitives.

const BI_TOK = {
  ink:    "#0E0E0E",
  mute:   "#6E6E73",
  faint:  "#A1A1A6",
  hair:   "rgba(14,14,14,0.10)",
  hairS:  "rgba(14,14,14,0.18)",
  paper:  "#FFFFFF",
  teal:   "#4A8580",
  tealD:  "#2F5F5B",
  tealHalo: "rgba(74,133,128,0.18)",
  peer:   "rgba(14,14,14,0.18)",        // peer-line stroke
  peerFill: "rgba(14,14,14,0.06)",      // peer-band fill
  peerFillStrong: "rgba(14,14,14,0.10)",
  // ink-tone status (matches the IPEDS dashboard semantic palette)
  good:   "#3D6B3D",
  warn:   "#7A5A14",
  crit:   "#8B2F28",
  display: '"Space Grotesk", "Inter", system-ui, sans-serif',
  body:    '"Inter", "Helvetica Neue", system-ui, sans-serif',
  mono:    "var(--font-mono)",
  hl:      "var(--fp-hl)",
};

// Pretty-print a delta string with a tone hint
const deltaColor = dir =>
  dir === "up"   ? BI_TOK.good :
  dir === "dn"   ? BI_TOK.crit :
  dir === "warn" ? BI_TOK.warn :
                   BI_TOK.mute;

/* =============================================================
   Linked — universal inline-clickable wrapper.
   ------------------------------------------------------------
   Used everywhere a variable name, peer-group reference, or
   institution name appears in a card. Visual cue is a hairline
   dashed underline that becomes solid on hover. No icon, no
   color shift — the text stays in its host typography (mono
   caps in stamps, sans in row names, etc).
   `kind` is just a hook for telemetry / future styling.
 * ============================================================= */
function Linked({ href = "#", kind = "var", children, style, onClick }) {
  return (
    <a href={href} onClick={onClick} data-bi-link={kind} style={{
      color: "inherit",
      textDecoration: "none",
      borderBottom: `1px dashed ${BI_TOK.faint}`,
      paddingBottom: 1,
      cursor: "pointer",
      transition: "border-color 120ms ease, border-bottom-style 120ms ease",
      ...style,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderBottomColor = BI_TOK.ink;
        e.currentTarget.style.borderBottomStyle = "solid";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderBottomColor = BI_TOK.faint;
        e.currentTarget.style.borderBottomStyle = "dashed";
      }}
    >{children}</a>
  );
}

// Small reusable section header for every BI panel
function BISectionHead({ stamp, title, sub, right }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "flex-start", gap: 20,
      marginBottom: 22,
    }}>
      <div style={{ minWidth: 0 }}>
        {stamp && <Stamp m style={{ display: "block", marginBottom: 6 }}>{stamp}</Stamp>}
        <h3 style={{
          fontFamily: BI_TOK.display, fontWeight: 500,
          fontSize: 22, letterSpacing: "-0.012em",
          margin: 0, color: BI_TOK.ink, lineHeight: 1.15,
        }}>{title}</h3>
        {sub && (
          <p style={{
            margin: "6px 0 0", fontFamily: BI_TOK.body,
            fontSize: 13, color: BI_TOK.mute, lineHeight: 1.5,
            maxWidth: "56ch",
          }}>{sub}</p>
        )}
      </div>
      {right}
    </div>
  );
}

// "You ↦ +6.4 vs peer median" — paper-kit doesn't use rounded pills
// so we render it as a mono tag + a swipe-highlighted number.
function YouCallout({ label, accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "5px 10px 5px 8px",
      border: `1.25px solid ${BI_TOK.ink}`,
      background: "#FFFFFF", color: BI_TOK.ink,
      fontFamily: BI_TOK.mono, fontSize: 10.5,
      letterSpacing: "0.10em", textTransform: "uppercase",
      lineHeight: 1, whiteSpace: "nowrap",
    }}>
      <Dot size={6} />
      {label}
      {accent && (
        <span style={{
          marginLeft: 2,
          backgroundImage: BI_TOK.hl,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 70%",
          backgroundPosition: "0 65%",
          padding: "0 4px",
        }}>{accent}</span>
      )}
    </span>
  );
}

/* =============================================================
   1 · BIKpiTile — value + delta + sparkline + peer footer + 2 links
   ============================================================= */
function BIKpiTile({
  label, value, unit, delta, deltaDir = "up",
  spark = [], sparkPeer,
  peerLabel = "Peer avg", peerValue,
  tier,
  variableHref = "#", peerHref = "#",
}) {
  // Build sparkline path from a list of y-values (0..1 normalized)
  const buildPath = (pts) => {
    if (!pts || pts.length === 0) return "";
    const xStep = 100 / (pts.length - 1);
    return pts.map((y, i) => `${i === 0 ? "M" : "L"} ${i * xStep} ${32 - y * 28}`).join(" ");
  };

  const tierColor =
    tier === "Q4" ? BI_TOK.good :
    tier === "Q3" ? BI_TOK.tealD :
    tier === "Q2" ? BI_TOK.warn :
    tier === "Q1" ? BI_TOK.crit : BI_TOK.mute;

  // Last point in viewBox coordinates → percent of container height.
  // The SVG stretches via preserveAspectRatio="none", but the dot is
  // rendered as an HTML span overlay so it stays perfectly circular.
  const lastY = spark.length ? spark[spark.length - 1] : 0;
  const dotTopPct = (((32 - lastY * 28) / 32) * 100);

  return (
    <Paper pad="20px 22px">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", marginBottom: 10,
      }}>
        <Stamp m>
          <Linked href={variableHref} kind="var">{label}</Linked>
        </Stamp>
        {tier && (
          <span style={{
            fontFamily: BI_TOK.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: "0.06em", color: tierColor,
          }}>· {tier}</span>
        )}
      </div>

      <div style={{
        fontFamily: BI_TOK.display, fontWeight: 500,
        fontSize: 44, lineHeight: 0.92, letterSpacing: "-0.025em",
        fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
        display: "flex", alignItems: "baseline", gap: 4,
      }}>
        {value}
        {unit && <span style={{ fontSize: 20 }}>{unit}</span>}
      </div>

      {delta && (
        <div style={{
          marginTop: 8,
          fontFamily: BI_TOK.mono, fontSize: 11,
          letterSpacing: "0.04em", color: deltaColor(deltaDir),
        }}>
          {delta}
        </div>
      )}

      {spark.length > 0 && (
        <div style={{ position: "relative", marginTop: 12, height: 36 }}>
          <svg viewBox="0 0 100 32" preserveAspectRatio="none"
               style={{ width: "100%", height: 36, display: "block", overflow: "visible" }}>
            {sparkPeer && (
              <path d={buildPath(sparkPeer)} fill="none"
                    stroke={BI_TOK.peer} strokeWidth="1.2"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke" />
            )}
            <path d={buildPath(spark)} fill="none"
                  stroke={BI_TOK.ink} strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke" />
          </svg>
          {/* HTML overlay dot — stays circular under SVG stretch */}
          <span style={{
            position: "absolute",
            right: -1, top: `calc(${dotTopPct}% - 4px)`,
            width: 8, height: 8, borderRadius: "50%",
            background: BI_TOK.teal,
            border: "1.5px solid #FFFFFF",
            boxShadow: "0 0 0 1px rgba(14,14,14,0.10)",
          }} />
        </div>
      )}

      <Hair style={{ marginTop: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <Stamp m>
          <Linked href={peerHref} kind="peer">{peerLabel}</Linked>
        </Stamp>
        <span style={{
          fontFamily: BI_TOK.mono, fontSize: 11,
          color: BI_TOK.ink, letterSpacing: "0.04em",
        }}>{peerValue}</span>
      </div>
    </Paper>
  );
}

// Legacy explicit-link footer — kept as a small helper for callers
// that want an opt-in "drill down" affordance somewhere else. Most
// cards rely on inline Linked wrappers instead.
function TileLink({ href, children }) {
  return (
    <a href={href} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: BI_TOK.mono, fontSize: 10,
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: BI_TOK.ink, fontWeight: 600,
      textDecoration: "none",
      borderBottom: `1px solid ${BI_TOK.hair}`,
      paddingBottom: 1,
      transition: "border-color 120ms ease",
    }}
      onMouseEnter={e => e.currentTarget.style.borderBottomColor = BI_TOK.ink}
      onMouseLeave={e => e.currentTarget.style.borderBottomColor = BI_TOK.hair}
    >
      {children} <span style={{ color: BI_TOK.mute }}>↗</span>
    </a>
  );
}

/* =============================================================
   2 · BITrendBand — line + peer P25/P75 band + dashed median
   ============================================================= */
function BITrendBand({
  stamp, title, sub, right,
  labels, you, peer,          // peer is [[lo,hi], ...]
  peerMedian,
  yMin = 0, yMax = 100, yUnit = "%",
  yFmt = (v) => `${Math.round(v)}${yUnit}`,
}) {
  const w = 760, h = 280;
  const top = 28, bot = 36, lft = 48, rgt = 16;
  const iw = w - lft - rgt, ih = h - top - bot;
  const xAt = i => lft + (iw * i) / (you.length - 1);
  const yAt = v => top + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const bandUp = peer.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(p[1])}`).join(" ");
  const bandDn = peer.slice().reverse().map((p, i) =>
    `L ${xAt(peer.length - 1 - i)} ${yAt(p[0])}`).join(" ");

  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push(yMin + ((yMax - yMin) * i) / 4);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
           style={{ width: "100%", height: 280, display: "block", overflow: "visible" }}>
        {/* dashed gridlines */}
        {ticks.map((t, i) => (
          <line key={i} x1={lft} x2={w - rgt}
                y1={yAt(t)} y2={yAt(t)}
                stroke={BI_TOK.hair} strokeDasharray="2 5" />
        ))}
        {/* y-axis labels */}
        {ticks.map((t, i) => (
          <text key={i} x={lft - 8} y={yAt(t) + 3}
                fontFamily={BI_TOK.mono} fontSize="10"
                fill={BI_TOK.mute} textAnchor="end">{yFmt(t)}</text>
        ))}
        {/* x-axis labels */}
        {labels.map((l, i) => (
          <text key={i} x={xAt(i)} y={h - 8}
                fontFamily={BI_TOK.mono} fontSize="10"
                fill={BI_TOK.mute} textAnchor="middle">{l}</text>
        ))}
        {/* peer band */}
        <path d={`${bandUp} ${bandDn} Z`}
              fill={BI_TOK.peerFill}
              stroke={BI_TOK.peer} strokeWidth="0.75" />
        {/* peer median */}
        {peerMedian && (
          <polyline fill="none" stroke={BI_TOK.peer} strokeWidth="1.4"
                    strokeDasharray="4 4"
                    points={peerMedian.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")} />
        )}
        {/* you */}
        <polyline fill="none" stroke={BI_TOK.ink} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  points={you.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")} />
        {you.map((v, i) => (
          <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.25" fill={BI_TOK.ink} />
        ))}
        {/* end-of-line you marker */}
        <circle cx={xAt(you.length - 1)} cy={yAt(you[you.length - 1])}
                r="6" fill={BI_TOK.teal} stroke="#FFFFFF" strokeWidth="2" />
      </svg>
      <div style={{
        display: "flex", gap: 18, marginTop: 14, paddingTop: 12,
        borderTop: `1px solid ${BI_TOK.hair}`,
      }}>
        <Legend swatch={<span style={{ width: 18, height: 2, background: BI_TOK.ink, display: "inline-block" }} />} label="You" />
        <Legend swatch={<span style={{ width: 18, height: 7, background: BI_TOK.peerFill, border: `1px solid ${BI_TOK.peer}`, display: "inline-block" }} />} label="Peer P25–P75" />
        {peerMedian && (
          <Legend swatch={<span style={{
            width: 18, height: 0, display: "inline-block",
            borderTop: `1.5px dashed ${BI_TOK.peer}`,
          }} />} label="Peer median" />
        )}
      </div>
    </Paper>
  );
}
function Legend({ swatch, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: BI_TOK.mono, fontSize: 10, color: BI_TOK.mute,
      letterSpacing: "0.10em", textTransform: "uppercase",
    }}>
      {swatch}
      <span>{label}</span>
    </span>
  );
}

/* =============================================================
   3 · BIDistribution — histogram with you marker
   ============================================================= */
function BIDistribution({
  stamp, title, sub, right,
  bars, youIdx, youLabel, xRange,
  medianIdx,
}) {
  const max = Math.max(...bars);
  const w = 760, h = 220;
  const top = 36, bot = 36, lft = 28, rgt = 28;
  const iw = w - lft - rgt;
  const bw = Math.floor((iw - (bars.length - 1) * 4) / bars.length);
  const xAt = i => lft + i * (bw + 4);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
           style={{ width: "100%", height: 220, display: "block", overflow: "visible" }}>
        {/* bars */}
        {bars.map((v, i) => {
          const x = xAt(i);
          const isYou = i === youIdx;
          const barH = (v / max) * (h - top - bot);
          return (
            <g key={i}>
              <rect x={x} y={h - bot - barH} width={bw} height={barH}
                    fill={isYou ? BI_TOK.teal : BI_TOK.peerFillStrong}
                    stroke={isYou ? BI_TOK.teal : "none"} />
              {isYou && (
                <>
                  <line x1={x + bw/2} y1={h - bot - barH - 6} x2={x + bw/2} y2={h - bot - barH - 18}
                        stroke={BI_TOK.ink} strokeWidth="1" />
                  <text x={x + bw/2} y={h - bot - barH - 24}
                        fontFamily={BI_TOK.display} fontSize="13" fontWeight="500"
                        textAnchor="middle" fill={BI_TOK.ink}>
                    {youLabel}
                  </text>
                </>
              )}
            </g>
          );
        })}
        {/* baseline */}
        <line x1={lft - 4} x2={w - rgt + 4} y1={h - bot} y2={h - bot}
              stroke={BI_TOK.hairS} />
        {/* median dashed */}
        {medianIdx != null && (
          <line x1={xAt(medianIdx) + bw/2} y1={top - 8}
                x2={xAt(medianIdx) + bw/2} y2={h - bot + 4}
                stroke={BI_TOK.peer} strokeDasharray="3 3" />
        )}
        {/* x-axis labels */}
        <text x={lft} y={h - 10}
              fontFamily={BI_TOK.mono} fontSize="10"
              fill={BI_TOK.mute}>{xRange[0]}</text>
        <text x={w - rgt} y={h - 10}
              fontFamily={BI_TOK.mono} fontSize="10"
              fill={BI_TOK.mute} textAnchor="end">{xRange[1]}</text>
      </svg>
    </Paper>
  );
}

/* =============================================================
   4 · BIRanking — sorted bar list + peer-avg marker
   ============================================================= */
function BIRanking({ stamp, title, sub, right, rows, peerAvgPct, unit = "%", maxBarPct }) {
  // maxBarPct = the scale ceiling for normalising bar widths
  const scale = maxBarPct || Math.max(...rows.map(r => parseFloat(r.value)));
  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <div>
        {rows.map((r, i) => {
          const numVal = parseFloat(r.value);
          const barW = (numVal / scale) * 100;
          return (
            <div key={r.name} style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 80px",
              alignItems: "center", gap: 14,
              padding: "9px 0",
              borderTop: i === 0 ? "none" : `1px solid ${BI_TOK.hair}`,
              background: r.you ? "linear-gradient(90deg, rgba(74,133,128,0.10), rgba(74,133,128,0) 70%)" : "transparent",
              marginLeft: r.you ? -8 : 0, marginRight: r.you ? -8 : 0,
              paddingLeft: r.you ? 8 : 0, paddingRight: r.you ? 8 : 0,
            }}>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 11,
                color: r.you ? BI_TOK.ink : BI_TOK.mute,
                fontWeight: r.you ? 600 : 500,
                letterSpacing: "0.04em",
              }}>{String(r.rank).padStart(2,"0")}</span>

              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{
                  fontFamily: BI_TOK.body, fontSize: 13.5,
                  color: BI_TOK.ink, fontWeight: r.you ? 600 : 400,
                  flex: "0 0 200px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  display: "inline-flex", alignItems: "center", gap: 7,
                }}>
                  {r.you && <Dot size={7} />}
                  <Linked href={r.href || "#"} kind="inst">{r.name}</Linked>
                </span>
                <div style={{
                  position: "relative", flex: 1, height: 14,
                  background: BI_TOK.peerFill,
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${barW}%`,
                    background: r.you ? BI_TOK.teal : BI_TOK.peer,
                  }} />
                  {peerAvgPct != null && (
                    <div style={{
                      position: "absolute", left: `${(peerAvgPct/scale)*100}%`,
                      top: -4, bottom: -4, width: 1, background: BI_TOK.ink,
                    }}>
                      <span style={{
                        position: "absolute", left: -3, top: -3,
                        width: 7, height: 7,
                        background: BI_TOK.ink, transform: "rotate(45deg)",
                      }} />
                    </div>
                  )}
                </div>
              </div>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 12,
                color: BI_TOK.ink, fontWeight: r.you ? 600 : 500,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}>{r.value}{unit}</span>
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

/* =============================================================
   5 · BISmallMultiples — grid of mini KPI cards
   ============================================================= */
function BISmallMultiples({ stamp, title, sub, items, columns = 4 }) {
  return (
    <Paper pad="22px 24px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
        gap: 12,
      }}>
        {items.map((m) => (
          <div key={m.label} style={{
            padding: "12px 14px",
            background: m.highlight ? "rgba(74,133,128,0.06)" : "#FAFAF7",
            borderTop: `1px solid ${m.highlight ? "rgba(74,133,128,0.40)" : BI_TOK.hair}`,
            borderBottom: `1px solid ${m.highlight ? "rgba(74,133,128,0.40)" : BI_TOK.hair}`,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline",
              fontFamily: BI_TOK.body, fontSize: 12, color: BI_TOK.ink,
              fontWeight: m.highlight ? 600 : 500,
            }}>
              <span>
                {m.highlight && <span style={{ color: BI_TOK.teal, marginRight: 4 }}>▸</span>}
                <Linked href={m.variableHref || "#"} kind="var">{m.label}</Linked>
              </span>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 10,
                color: m.highlight ? BI_TOK.tealD : BI_TOK.mute,
                fontWeight: m.highlight ? 600 : 500,
                letterSpacing: "0.04em",
              }}>{m.percentile}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{
                fontFamily: BI_TOK.display, fontSize: 20,
                fontWeight: 500, letterSpacing: "-0.012em",
                color: BI_TOK.ink, lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}>{m.value}</span>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 10,
                color: deltaColor(m.deltaDir),
              }}>{m.delta}</span>
            </div>
            <svg viewBox="0 0 100 28" preserveAspectRatio="none"
                 style={{ display: "block", width: "100%", height: 28, overflow: "visible" }}>
              <path d={(() => {
                const pts = m.spark || [];
                if (pts.length === 0) return "";
                const xStep = 100 / (pts.length - 1);
                return pts.map((y, i) => `${i === 0 ? "M" : "L"} ${i * xStep} ${28 - y * 24}`).join(" ");
              })()}
                    fill="none"
                    stroke={m.highlight ? BI_TOK.teal : BI_TOK.peer}
                    strokeWidth={m.highlight ? 1.75 : 1.4}
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: BI_TOK.mono, fontSize: 9.5, color: BI_TOK.mute,
              borderTop: `1px dashed ${BI_TOK.hair}`,
              paddingTop: 4, letterSpacing: "0.04em",
            }}>
              <span>peer {m.peerValue}</span>
              <span>{m.peerDelta}</span>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}

/* =============================================================
   5b · BIDonut — donut/pie chart (paper register)
   • Default: donut. Pass hole={0} for a pie.
   • Up to ~6 slices comfortably; warns more than that.
   • Focal slice (the "you" or watch slice) renders in teal; rest
     in ink at descending opacities so the active one always wins.
   • Center label is optional — usually a total or headline value.
   ============================================================= */
function BIDonut({
  stamp, title, sub, right,
  segments,          // [{ key, label, value, focal? }]
  hole = 0.6,        // 0 = pie, 0.6 = donut, 0.8 = thin ring
  centerValue,       // big number in middle (donut only)
  centerLabel,       // mono caps line under centerValue
  peer,              // optional { [key]: pct } — shown as delta vs you in legend
  size = 260,
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 2;
  const inner = r * hole;
  // ink ramp (skip the very-light end so segments stay legible)
  const inkRamp = [
    "rgba(14,14,14,0.78)",
    "rgba(14,14,14,0.58)",
    "rgba(14,14,14,0.40)",
    "rgba(14,14,14,0.26)",
    "rgba(14,14,14,0.16)",
    "rgba(14,14,14,0.10)",
  ];
  // Build slice paths
  let angle = -Math.PI / 2; // start at 12 o'clock
  const slices = segments.map((s, i) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const a0 = angle;
    const a1 = angle + sweep;
    angle = a1;
    const large = sweep > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    let d;
    if (hole === 0) {
      d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
    } else {
      const ix0 = cx + inner * Math.cos(a0), iy0 = cy + inner * Math.sin(a0);
      const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1);
      d = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} ` +
          `L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix0} ${iy0} Z`;
    }
    const fill = s.focal ? BI_TOK.teal : inkRamp[Math.min(i, inkRamp.length - 1)];
    return { ...s, d, fill, pct: (s.value / total) * 100 };
  });

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <div style={{
        display: "grid", gridTemplateColumns: `${size + 24}px 1fr`,
        gap: 28, alignItems: "center",
      }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: "block" }}>
            {slices.map((s, i) => (
              <path key={s.key || i} d={s.d} fill={s.fill}
                    stroke="#FFFFFF" strokeWidth="1.5" />
            ))}
          </svg>
          {hole > 0 && (centerValue || centerLabel) && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none", textAlign: "center",
            }}>
              {centerValue && (
                <div style={{
                  fontFamily: BI_TOK.display, fontWeight: 500,
                  fontSize: Math.round(size * 0.18), lineHeight: 1,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
                }}>{centerValue}</div>
              )}
              {centerLabel && (
                <div style={{
                  marginTop: 8,
                  fontFamily: BI_TOK.mono, fontSize: 10.5,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: BI_TOK.mute, maxWidth: inner * 1.4,
                }}>{centerLabel}</div>
              )}
            </div>
          )}
        </div>

        {/* Legend table */}
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: peer ? "14px 1fr 60px 60px" : "14px 1fr 60px",
            gap: 10, alignItems: "center", padding: "0 0 8px",
            borderBottom: `1px solid ${BI_TOK.hair}`,
            fontFamily: BI_TOK.mono, fontSize: 9.5,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: BI_TOK.mute,
          }}>
            <span />
            <span>Segment</span>
            <span style={{ textAlign: "right" }}>Share</span>
            {peer && <span style={{ textAlign: "right" }}>vs peer</span>}
          </div>
          {slices.map((s, i) => {
            const peerPct = peer ? peer[s.key] : null;
            const delta = peerPct != null ? (s.pct - peerPct) : null;
            return (
              <div key={s.key || i} style={{
                display: "grid",
                gridTemplateColumns: peer ? "14px 1fr 60px 60px" : "14px 1fr 60px",
                gap: 10, alignItems: "center", padding: "10px 0",
                borderBottom: i === slices.length - 1 ? "none" : `1px solid ${BI_TOK.hair}`,
              }}>
                <span style={{ width: 12, height: 12, background: s.fill }} />
                <span style={{
                  fontFamily: BI_TOK.body, fontSize: 13.5, color: BI_TOK.ink,
                  fontWeight: s.focal ? 600 : 400,
                }}>{s.label}</span>
                <span style={{
                  fontFamily: BI_TOK.mono, fontSize: 12, color: BI_TOK.ink,
                  fontWeight: s.focal ? 600 : 500, textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}>{s.pct.toFixed(1)}%</span>
                {peer && (
                  <span style={{
                    fontFamily: BI_TOK.mono, fontSize: 11.5,
                    color: delta == null ? BI_TOK.mute
                          : delta > 0 ? BI_TOK.good
                          : delta < 0 ? BI_TOK.crit : BI_TOK.mute,
                    textAlign: "right",
                  }}>
                    {peerPct == null ? "—"
                      : delta > 0 ? `+${delta.toFixed(1)}`
                      : delta.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Paper>
  );
}

/* =============================================================
   6 · BIComposition — stacked twin bars (you vs peer)
   ============================================================= */
function BIComposition({ stamp, title, sub, segments, you, peer }) {
  // segments: [{ key, label }, ...]
  // you/peer: { [key]: percentage }
  const tealShades = [
    "#2F5F5B",
    "rgba(74,133,128,0.85)",
    "rgba(74,133,128,0.55)",
    "rgba(74,133,128,0.35)",
    "rgba(74,133,128,0.22)",
  ];
  const peerShades = [
    "rgba(14,14,14,0.70)",
    "rgba(14,14,14,0.50)",
    "rgba(14,14,14,0.32)",
    "rgba(14,14,14,0.20)",
    "rgba(14,14,14,0.12)",
  ];
  const renderBar = (data, shades, isYou) => (
    <div style={{
      display: "flex", height: 36,
      background: "#FAFAF7",
    }}>
      {segments.map((seg, i) => {
        const pct = data[seg.key] || 0;
        return (
          <div key={seg.key} style={{
            width: `${pct}%`,
            background: shades[Math.min(i, shades.length - 1)],
            color: i < 2 ? "#FFFFFF" : (isYou ? "#FFFFFF" : BI_TOK.ink),
            fontFamily: BI_TOK.mono, fontSize: 10,
            display: "grid", placeItems: "center",
            borderRight: i === segments.length - 1 ? "none" : "1px solid rgba(255,255,255,0.40)",
          }}>{pct >= 8 ? `${pct}%` : ""}</div>
        );
      })}
    </div>
  );

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: BI_TOK.mono, fontSize: 10.5,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: BI_TOK.ink, marginBottom: 10,
          }}><Dot size={7} /> You</div>
          {renderBar(you, tealShades, true)}
        </div>
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: BI_TOK.mono, fontSize: 10.5,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: BI_TOK.mute, marginBottom: 10,
          }}><span style={{ width: 7, height: 7, background: "rgba(14,14,14,0.5)", display: "inline-block" }} /> Peer avg</div>
          {renderBar(peer, peerShades, false)}
        </div>
      </div>
      {/* Category table */}
      <div style={{ marginTop: 22 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "14px 1fr 80px 80px 60px",
          alignItems: "center", gap: 10,
          fontFamily: BI_TOK.mono, fontSize: 9.5,
          letterSpacing: "0.10em", textTransform: "uppercase",
          color: BI_TOK.mute,
          padding: "0 0 8px",
          borderBottom: `1px solid ${BI_TOK.hair}`,
        }}>
          <span />
          <span>Category</span>
          <span style={{ textAlign: "right" }}>You</span>
          <span style={{ textAlign: "right" }}>Peer</span>
          <span style={{ textAlign: "right" }}>Δ</span>
        </div>
        {segments.map((seg, i) => {
          const youV = you[seg.key] || 0;
          const peerV = peer[seg.key] || 0;
          const delta = (youV - peerV).toFixed(1);
          const deltaTone = delta > 0 ? "up" : delta < 0 ? "dn" : "flat";
          return (
            <div key={seg.key} style={{
              display: "grid",
              gridTemplateColumns: "14px 1fr 80px 80px 60px",
              alignItems: "center", gap: 10,
              padding: "10px 0",
              borderBottom: i === segments.length - 1 ? "none" : `1px solid ${BI_TOK.hair}`,
              fontSize: 13.5,
            }}>
              <span style={{
                width: 12, height: 12,
                background: tealShades[Math.min(i, tealShades.length - 1)],
              }} />
              <span style={{ fontFamily: BI_TOK.body, color: BI_TOK.ink }}>{seg.label}</span>
              <span style={{ fontFamily: BI_TOK.mono, fontSize: 12, color: BI_TOK.ink, textAlign: "right", fontWeight: 600 }}>{youV.toFixed(1)}%</span>
              <span style={{ fontFamily: BI_TOK.mono, fontSize: 12, color: BI_TOK.mute, textAlign: "right" }}>{peerV.toFixed(1)}%</span>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 11.5,
                color: deltaColor(deltaTone), textAlign: "right",
              }}>{delta > 0 ? `+${delta}` : delta}</span>
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

/* =============================================================
   7 · BIFunnel — admissions stages w/ you+peer bars
   ============================================================= */
function BIFunnel({ stamp, title, sub, stages }) {
  // stages: [{ step, label, you, peer, deltaPct, deltaDir, conv? }]
  const maxYou = Math.max(...stages.map(s => s.you));
  const maxPeer = Math.max(...stages.map(s => s.peer));
  const scale = Math.max(maxYou, maxPeer);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      {/* col head */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr 90px 90px 70px",
        gap: 14, padding: "0 0 8px",
        borderBottom: `1px solid ${BI_TOK.hair}`,
        fontFamily: BI_TOK.mono, fontSize: 9.5,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: BI_TOK.mute,
      }}>
        <span>Stage</span>
        <span>Volume</span>
        <span style={{ textAlign: "right" }}>You</span>
        <span style={{ textAlign: "right" }}>Peer</span>
        <span style={{ textAlign: "right" }}>Δ</span>
      </div>
      {stages.map((s, i) => (
        <React.Fragment key={s.label}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 90px 90px 70px",
            gap: 14, alignItems: "center", padding: "12px 0",
            borderBottom: i === stages.length - 1 ? "none" : `1px solid ${BI_TOK.hair}`,
          }}>
            <div>
              <div style={{
                fontFamily: BI_TOK.mono, fontSize: 9.5,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: BI_TOK.mute, marginBottom: 3,
              }}>{s.step}</div>
              <div style={{ fontFamily: BI_TOK.body, fontSize: 13.5, color: BI_TOK.ink, fontWeight: 500 }}>{s.label}</div>
            </div>
            <div style={{ position: "relative", height: 38 }}>
              <div style={{ position: "absolute", inset: 0, background: BI_TOK.peerFill }} />
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(s.peer / scale) * 100}%`,
                background: BI_TOK.peer,
              }} />
              <div style={{
                position: "absolute", left: 0, top: 6, bottom: 6,
                width: `${(s.you / scale) * 100}%`,
                background: BI_TOK.teal,
              }} />
            </div>
            <span style={{ fontFamily: BI_TOK.mono, fontSize: 12, color: BI_TOK.ink, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {s.you.toLocaleString()}
            </span>
            <span style={{ fontFamily: BI_TOK.mono, fontSize: 12, color: BI_TOK.mute, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {s.peer.toLocaleString()}
            </span>
            <span style={{
              fontFamily: BI_TOK.mono, fontSize: 11.5,
              color: deltaColor(s.deltaDir), textAlign: "right",
            }}>{s.deltaPct}</span>
          </div>
          {s.conv && i < stages.length - 1 && (
            <div style={{
              fontFamily: BI_TOK.mono, fontSize: 10,
              letterSpacing: "0.06em", color: BI_TOK.mute,
              padding: "2px 0 6px 194px",
            }}>
              ▼ {s.conv}
            </div>
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
}

/* =============================================================
   7b · BIFunnelChart — classic tapered trapezoid funnel
   -------------------------------------------------------------
   Unlike BIFunnel (a stage-table with bars), this is the
   recognisable shape: each stage is a horizontal slab whose
   width is proportional to its volume, narrowing top to bottom.
   Peer-cohort conversion rates are overlaid as faint outline
   trapezoids so divergence reads visually.

   stages: [{ label, value, peerValue?, sub? }]
   ============================================================= */
function BIFunnelChart({ stamp, title, sub, right, stages, maxWidth = 520 }) {
  // -----------------------------------------------------------
  // Design:
  //   • Each stage is a CENTERED rectangle whose width is
  //     proportional to its volume. Tallest at the top, narrowest
  //     at the bottom — the eye reads it as a true funnel.
  //   • Between stages, hairline diagonals run from one rectangle's
  //     bottom corner to the next's top corner. Those diagonals
  //     enclose a faint "lost volume" zone — the drop-off you'd
  //     see in a continuous trapezoid funnel, but quieter.
  //   • Conversion stats live INSIDE the gap, mono caps, ink.
  //     Peer conversions follow on a second line, mute.
  //   • Stage label + value sit INSIDE the bar (white on teal).
  //   • Peer benchmark for each stage is a single ink tick on
  //     the bar's right edge at peerValue's width, with the peer
  //     volume annotated outside the funnel.
  // -----------------------------------------------------------
  const STAGE_H = 56;
  const GAP_H   = 56;
  const max     = stages[0].value;
  // Peer width relative to YOUR top-of-funnel keeps both funnels
  // on the same horizontal scale (rather than each normalised
  // independently, which would lie about volume).
  const widthFor = v => (v / max) * maxWidth;

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />

      <div style={{
        position: "relative",
        margin: "8px auto 0",
        width: maxWidth + 200,            // 100px label gutter each side
        paddingLeft: 0,
      }}>
        {stages.map((s, i) => {
          const next = stages[i + 1];
          const youW  = widthFor(s.value);
          const peerW = s.peerValue != null ? widthFor(s.peerValue) : null;
          const nextYouW  = next ? widthFor(next.value)     : null;
          const nextPeerW = next && next.peerValue != null
            ? widthFor(next.peerValue) : null;
          const conv = next ? Math.round((next.value / s.value) * 100) : null;
          const peerConv = next && s.peerValue != null && next.peerValue != null
            ? Math.round((next.peerValue / s.peerValue) * 100) : null;

          return (
            <div key={s.label}>
              {/* Stage bar */}
              <div style={{
                position: "relative",
                height: STAGE_H,
                width: youW,
                margin: "0 auto",
                background: BI_TOK.teal,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
              }}>
                <span style={{
                  fontFamily: BI_TOK.body, fontSize: 14,
                  fontWeight: 500, color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  textShadow: "0 1px 0 rgba(14,14,14,0.15)",
                }}>{s.label}</span>
                <span style={{
                  fontFamily: BI_TOK.display, fontSize: 18,
                  fontWeight: 500, color: "#FFFFFF",
                  letterSpacing: "-0.012em",
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 1px 0 rgba(14,14,14,0.15)",
                }}>{s.value.toLocaleString()}</span>

                {/* Peer tick on the right edge of the bar — shows
                    where peer would sit if normalised to your scale.
                    Renders only when peerW < youW (i.e. you outpace peer). */}
                {peerW != null && peerW < youW && (
                  <div style={{
                    position: "absolute",
                    left: (youW + peerW) / 2,
                    top: -3, bottom: -3, width: 1,
                    background: BI_TOK.ink,
                  }}>
                    <span style={{
                      position: "absolute", top: -16, left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: BI_TOK.mono, fontSize: 9,
                      letterSpacing: "0.10em", textTransform: "uppercase",
                      color: BI_TOK.mute, whiteSpace: "nowrap",
                    }}>peer</span>
                  </div>
                )}

                {/* Optional eyebrow (sub-label) — left of the bar */}
                {s.sub && (
                  <div style={{
                    position: "absolute",
                    right: "calc(100% + 16px)",
                    top: "50%", transform: "translateY(-50%)",
                    fontFamily: BI_TOK.mono, fontSize: 10,
                    letterSpacing: "0.10em", textTransform: "uppercase",
                    color: BI_TOK.mute, whiteSpace: "nowrap",
                  }}>{s.sub}</div>
                )}

                {/* Peer volume annotation — right of the bar */}
                {s.peerValue != null && (
                  <div style={{
                    position: "absolute",
                    left: "calc(100% + 16px)",
                    top: "50%", transform: "translateY(-50%)",
                    fontFamily: BI_TOK.mono, fontSize: 10,
                    letterSpacing: "0.10em", textTransform: "uppercase",
                    color: BI_TOK.mute, whiteSpace: "nowrap",
                  }}>peer · {s.peerValue.toLocaleString()}</div>
                )}
              </div>

              {/* Drop-off gap — hairline diagonals + conversion stat */}
              {next && (
                <div style={{
                  position: "relative",
                  height: GAP_H,
                  width: maxWidth,
                  margin: "0 auto",
                }}>
                  {/* Trapezoid of "lost volume" — barely-there ink fill
                      bounded by hairline diagonals on each side. */}
                  <svg viewBox={`0 0 ${maxWidth} ${GAP_H}`}
                       preserveAspectRatio="none"
                       style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    <path d={
                      `M ${(maxWidth - youW)/2} 0 ` +
                      `L ${(maxWidth + youW)/2} 0 ` +
                      `L ${(maxWidth + nextYouW)/2} ${GAP_H} ` +
                      `L ${(maxWidth - nextYouW)/2} ${GAP_H} Z`
                    } fill="rgba(74,133,128,0.07)" />
                    <line
                      x1={(maxWidth - youW)/2} y1={0}
                      x2={(maxWidth - nextYouW)/2} y2={GAP_H}
                      stroke={BI_TOK.hairS} strokeWidth="1" />
                    <line
                      x1={(maxWidth + youW)/2} y1={0}
                      x2={(maxWidth + nextYouW)/2} y2={GAP_H}
                      stroke={BI_TOK.hairS} strokeWidth="1" />
                  </svg>
                  {/* Conversion stat — centered in the gap */}
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 4, pointerEvents: "none",
                  }}>
                    <div style={{
                      fontFamily: BI_TOK.mono, fontSize: 12,
                      fontWeight: 600, letterSpacing: "0.06em",
                      color: BI_TOK.ink,
                      background: "#FFFFFF",
                      padding: "2px 8px",
                    }}>↓ {conv}% convert</div>
                    {peerConv != null && (
                      <div style={{
                        fontFamily: BI_TOK.mono, fontSize: 10,
                        letterSpacing: "0.10em", textTransform: "uppercase",
                        color: BI_TOK.mute,
                      }}>peer {peerConv}% · Δ {conv - peerConv > 0 ? "+" : ""}{conv - peerConv} pp</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom-of-funnel: total conversion footer */}
        {stages.length > 1 && (
          <div style={{
            marginTop: 14, paddingTop: 14,
            borderTop: `1px solid ${BI_TOK.hair}`,
            display: "flex", justifyContent: "space-between",
            fontFamily: BI_TOK.mono, fontSize: 10.5,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: BI_TOK.mute,
          }}>
            <span>End-to-end conversion</span>
            <span style={{ color: BI_TOK.ink, fontWeight: 600 }}>
              {((stages[stages.length-1].value / stages[0].value) * 100).toFixed(1)}%
              {stages[0].peerValue != null && stages[stages.length-1].peerValue != null && (
                <span style={{ color: BI_TOK.mute, fontWeight: 500, marginLeft: 8 }}>
                  · peer {((stages[stages.length-1].peerValue / stages[0].peerValue) * 100).toFixed(1)}%
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </Paper>
  );
}

/* =============================================================
   8 · BIGauge — 3 half-arcs, paper register
   ============================================================= */
function BIGauge({ stamp, title, sub, gauges }) {
  // gauges: [{ label, value, unit, delta, deltaDir, min, max, peerBand: [lo, hi], peerMedian, you, peerNote }]
  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${gauges.length}, minmax(0,1fr))`, gap: 18 }}>
        {gauges.map((g, i) => (
          <div key={i} style={{
            paddingTop: 12,
            borderTop: `1px solid ${BI_TOK.hair}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <Stamp m style={{ alignSelf: "stretch", textAlign: "center" }}>
              <Linked href={g.variableHref || "#"} kind="var">{g.label}</Linked>
            </Stamp>
            <GaugeArc {...g} />
            <div style={{
              fontFamily: BI_TOK.display, fontSize: 30, fontWeight: 500,
              lineHeight: 1, letterSpacing: "-0.015em",
              fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
            }}>
              {g.value}{g.unit && <span style={{ fontSize: 14, color: BI_TOK.mute }}>{g.unit}</span>}
            </div>
            {g.delta && (
              <div style={{
                fontFamily: BI_TOK.mono, fontSize: 11,
                color: deltaColor(g.deltaDir),
              }}>{g.delta}</div>
            )}
            <div style={{
              alignSelf: "stretch", marginTop: 6, paddingTop: 8,
              borderTop: `1px solid ${BI_TOK.hair}`,
              display: "flex", justifyContent: "space-between",
              fontFamily: BI_TOK.mono, fontSize: 10.5, color: BI_TOK.mute,
              letterSpacing: "0.04em",
            }}>
              <Stamp m>Peer median</Stamp>
              <span style={{ color: BI_TOK.ink }}>{g.peerNote}</span>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}
function GaugeArc({ min, max, you, peerBand, peerMedian }) {
  // half-circle from 180° to 0°
  const w = 220, h = 130;
  const cx = w/2, cy = h - 12, r = 92;
  const toAngle = v => 180 - ((v - min) / (max - min)) * 180;
  const polar = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const arcPath = (fromDeg, toDeg) => {
    const [x1, y1] = polar(fromDeg);
    const [x2, y2] = polar(toDeg);
    const largeArc = Math.abs(fromDeg - toDeg) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${fromDeg > toDeg ? 1 : 0} ${x2} ${y2}`;
  };
  const youAng = toAngle(you);
  const [yx, yy] = polar(youAng);
  const medAng = toAngle(peerMedian);
  const [mx, my] = polar(medAng);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 220, height: 130 }}>
      {/* full range */}
      <path d={arcPath(180, 0)} fill="none"
            stroke={BI_TOK.peerFill} strokeWidth="14" strokeLinecap="butt" />
      {/* peer band */}
      <path d={arcPath(toAngle(peerBand[0]), toAngle(peerBand[1]))}
            fill="none" stroke={BI_TOK.peerFillStrong} strokeWidth="14" strokeLinecap="butt" />
      {/* needle */}
      <line x1={cx} y1={cy} x2={yx} y2={yy}
            stroke={BI_TOK.teal} strokeWidth="3" strokeLinecap="round" />
      <circle cx={yx} cy={yy} r="5" fill={BI_TOK.teal} stroke="#FFFFFF" strokeWidth="1.5" />
      {/* peer median diamond */}
      <rect x={mx - 4} y={my - 4} width="8" height="8"
            fill={BI_TOK.ink} transform={`rotate(45 ${mx} ${my})`} />
      {/* hub */}
      <circle cx={cx} cy={cy} r="5" fill={BI_TOK.ink} />
      {/* ticks */}
      <text x={12} y={h - 4} fontFamily={BI_TOK.mono} fontSize="9" fill={BI_TOK.mute}>{min}</text>
      <text x={w - 12} y={h - 4} fontFamily={BI_TOK.mono} fontSize="9" fill={BI_TOK.mute} textAnchor="end">{max}</text>
    </svg>
  );
}

/* =============================================================
   9 · BIWaterfall — bridge from peer avg → you
   ============================================================= */
function BIWaterfall({ stamp, title, sub, start, end, steps, unit = "" }) {
  // steps: [{ label, sub, delta }]
  // start: { label, value }, end: { label, value }
  const w = 980, h = 380;
  const top = 40, bot = 64, lft = 56, rgt = 16;
  const ih = h - top - bot;

  // build cumulative running sum
  let running = start.value;
  const bars = [{ kind: "start", from: 0, to: start.value, label: start.label, value: start.value }];
  steps.forEach(s => {
    const from = running;
    running += s.delta;
    bars.push({ kind: s.delta >= 0 ? "up" : "dn", from, to: running, ...s });
  });
  bars.push({ kind: "end", from: 0, to: end.value, label: end.label, value: end.value });

  // y scale
  const allVals = bars.flatMap(b => [b.from, b.to]).filter(v => isFinite(v));
  const vMin = Math.min(...allVals) * 0.95;
  const vMax = Math.max(...allVals) * 1.05;
  const yAt = v => top + ih - ((v - vMin) / (vMax - vMin)) * ih;

  const bw = (w - lft - rgt) / bars.length - 18;

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
           style={{ width: "100%", height: 380, display: "block", overflow: "visible" }}>
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const v = vMin + (vMax - vMin) * (1 - p);
          return (
            <g key={i}>
              <line x1={lft} x2={w - rgt} y1={top + ih * p} y2={top + ih * p}
                    stroke={BI_TOK.hair} strokeDasharray="2 5" />
              <text x={lft - 8} y={top + ih * p + 3}
                    fontFamily={BI_TOK.mono} fontSize="10"
                    fill={BI_TOK.mute} textAnchor="end">{unit}{v.toFixed(1)}</text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const xCenter = lft + i * ((w - lft - rgt) / bars.length) + ((w - lft - rgt) / bars.length) / 2;
          const x = xCenter - bw / 2;
          const yHi = yAt(Math.max(b.from, b.to));
          const yLo = yAt(Math.min(b.from, b.to));
          const fill =
            b.kind === "start" ? BI_TOK.peer :
            b.kind === "end"   ? BI_TOK.teal :
            b.kind === "up"    ? BI_TOK.good :
                                 BI_TOK.crit;
          return (
            <g key={i}>
              <rect x={x} y={yHi} width={bw} height={Math.max(yLo - yHi, 1)} fill={fill} />
              <text x={xCenter} y={yHi - 6}
                    fontFamily={BI_TOK.mono} fontSize="10.5"
                    fill={b.kind === "up" ? BI_TOK.good : b.kind === "dn" ? BI_TOK.crit : BI_TOK.ink}
                    textAnchor="middle" fontWeight="600">
                {b.kind === "start" || b.kind === "end"
                  ? `${unit}${b.value.toFixed(1)}`
                  : (b.delta >= 0 ? `+${unit}${b.delta.toFixed(1)}` : `−${unit}${Math.abs(b.delta).toFixed(1)}`)}
              </text>
              <text x={xCenter} y={h - bot + 16}
                    fontFamily={BI_TOK.body} fontSize="12"
                    fill={BI_TOK.ink} textAnchor="middle"
                    fontWeight={b.kind === "end" ? 600 : 400}>{b.label}</text>
              {b.sub && (
                <text x={xCenter} y={h - bot + 32}
                      fontFamily={BI_TOK.mono} fontSize="9.5"
                      fill={BI_TOK.mute} textAnchor="middle"
                      letterSpacing="0.10em">{b.sub}</text>
              )}
              {/* connector line to next bar */}
              {i < bars.length - 1 && bars[i+1].kind !== "end" && (
                <line x1={x + bw} y1={yAt(b.to)}
                      x2={x + bw + 18} y2={yAt(b.to)}
                      stroke={BI_TOK.hairS} strokeDasharray="2 3" />
              )}
            </g>
          );
        })}
        {/* baseline */}
        <line x1={lft} x2={w - rgt} y1={top + ih} y2={top + ih}
              stroke={BI_TOK.hairS} />
      </svg>
    </Paper>
  );
}

/* =============================================================
   10 · BISankey — 5×5 flow, you (teal) over peer (ink)
   ============================================================= */
function BISankey({ stamp, title, sub, sources, targets, you, peer }) {
  // sources/targets: [{ id, label, value }]
  // you/peer: [{ from, to, value }]
  const w = 1000, h = 460;
  const padTop = 20, padBot = 40, padSide = 80;
  const nodeW = 14;
  const innerH = h - padTop - padBot;

  // Compute node y positions stacking by value, plus a separate
  // label-y so adjacent labels never overlap. Small nodes get a
  // leader line out to their label position.
  const MIN_LABEL_GAP = 34;
  const layout = (nodes, x) => {
    const total = nodes.reduce((a, n) => a + n.value, 0);
    let y = padTop;
    const out = nodes.map((n) => {
      const height = (n.value / total) * innerH;
      const top = y; y += height + 6;
      return { ...n, x, y: top, height };
    });
    let lastLabelY = -Infinity;
    out.forEach(n => {
      const desired = n.y + Math.max(0, (n.height - 28) / 2);
      n.labelY = Math.max(desired, lastLabelY + MIN_LABEL_GAP);
      lastLabelY = n.labelY;
    });
    return out;
  };
  const srcLayout = layout(sources, padSide - nodeW);
  const tgtLayout = layout(targets, w - padSide);

  // Each flow takes a slice of its source's vertical band and target's vertical band
  const computeFlowSlices = (flows) => {
    const srcOffsets = {};
    const tgtOffsets = {};
    return flows.map(f => {
      const src = srcLayout.find(n => n.id === f.from);
      const tgt = tgtLayout.find(n => n.id === f.to);
      const srcSliceH = (f.value / src.value) * src.height;
      const tgtSliceH = (f.value / tgt.value) * tgt.height;
      const srcY1 = src.y + (srcOffsets[f.from] || 0);
      const srcY2 = srcY1 + srcSliceH;
      const tgtY1 = tgt.y + (tgtOffsets[f.to] || 0);
      const tgtY2 = tgtY1 + tgtSliceH;
      srcOffsets[f.from] = (srcOffsets[f.from] || 0) + srcSliceH;
      tgtOffsets[f.to]   = (tgtOffsets[f.to]   || 0) + tgtSliceH;
      const x1 = src.x + nodeW;
      const x2 = tgt.x;
      const mid = (x1 + x2) / 2;
      return { f, x1, x2, srcY1, srcY2, tgtY1, tgtY2, mid };
    });
  };

  const youSlices = computeFlowSlices(you);
  const peerSlices = computeFlowSlices(peer);

  const flowPath = (s) =>
    `M ${s.x1} ${s.srcY1} ` +
    `C ${s.mid} ${s.srcY1}, ${s.mid} ${s.tgtY1}, ${s.x2} ${s.tgtY1} ` +
    `L ${s.x2} ${s.tgtY2} ` +
    `C ${s.mid} ${s.tgtY2}, ${s.mid} ${s.srcY2}, ${s.x1} ${s.srcY2} Z`;

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
           style={{ width: "100%", height: 460, display: "block", overflow: "visible" }}>
        {/* peer flows behind, ink at low alpha */}
        <g>
          {peerSlices.map((s, i) => (
            <path key={i} d={flowPath(s)} fill="rgba(14,14,14,0.06)" />
          ))}
        </g>
        {/* you flows over, teal */}
        <g>
          {youSlices.map((s, i) => (
            <path key={i} d={flowPath(s)} fill={BI_TOK.tealHalo}
                  stroke="rgba(74,133,128,0.30)" strokeWidth="0.5" />
          ))}
        </g>
        {/* source nodes */}
        {srcLayout.map(n => {
          const needsLeader = Math.abs(n.labelY - n.y) > 4 || n.height < 28;
          const labelMid = n.labelY + 14;
          const rectMid = n.y + n.height / 2;
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={nodeW} height={n.height} fill={BI_TOK.ink} />
              {needsLeader && (
                <path d={`M ${n.x} ${rectMid} L ${n.x - 6} ${rectMid} L ${n.x - 6} ${labelMid} L ${n.x - 10} ${labelMid}`}
                      fill="none" stroke={BI_TOK.hairS} strokeWidth="1" />
              )}
              <text x={n.x - 12} y={n.labelY + 14}
                    fontFamily={BI_TOK.body} fontSize="13"
                    fill={BI_TOK.ink} textAnchor="end">{n.label}</text>
              <text x={n.x - 12} y={n.labelY + 28}
                    fontFamily={BI_TOK.mono} fontSize="10"
                    fill={BI_TOK.mute} textAnchor="end">{n.value.toLocaleString()}</text>
            </g>
          );
        })}
        {/* target nodes */}
        {tgtLayout.map(n => {
          const needsLeader = Math.abs(n.labelY - n.y) > 4 || n.height < 28;
          const labelMid = n.labelY + 14;
          const rectMid = n.y + n.height / 2;
          const xRight = n.x + nodeW;
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={nodeW}
                    height={n.height}
                    fill={n.tone === "crit" ? BI_TOK.crit : n.tone === "good" ? BI_TOK.teal : BI_TOK.ink} />
              {needsLeader && (
                <path d={`M ${xRight} ${rectMid} L ${xRight + 6} ${rectMid} L ${xRight + 6} ${labelMid} L ${xRight + 10} ${labelMid}`}
                      fill="none" stroke={BI_TOK.hairS} strokeWidth="1" />
              )}
              <text x={xRight + 12} y={n.labelY + 14}
                    fontFamily={BI_TOK.body} fontSize="13" fill={BI_TOK.ink}>{n.label}</text>
              <text x={xRight + 12} y={n.labelY + 28}
                    fontFamily={BI_TOK.mono} fontSize="10"
                    fill={n.tone === "crit" ? BI_TOK.crit : n.tone === "good" ? BI_TOK.tealD : BI_TOK.mute}>
                {n.value.toLocaleString()} · {n.pct}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{
        display: "flex", gap: 18, marginTop: 14, paddingTop: 12,
        borderTop: `1px solid ${BI_TOK.hair}`,
      }}>
        <Legend swatch={<span style={{ width: 18, height: 8, background: BI_TOK.tealHalo, display: "inline-block" }} />} label="Your flows" />
        <Legend swatch={<span style={{ width: 18, height: 8, background: "rgba(14,14,14,0.06)", display: "inline-block" }} />} label="Peer flows" />
      </div>
    </Paper>
  );
}

/* =============================================================
   11 · BIQuadrant — 2-metric scatter, peer cloud + you marker
   ============================================================= */
function BIQuadrant({
  stamp, title, sub, right,
  xRange, yRange, xLabel, yLabel,
  peers, you, peerAvg,
  quadrantLabels,
}) {
  const w = 980, h = 480;
  const top = 36, bot = 44, lft = 56, rgt = 16;
  const iw = w - lft - rgt, ih = h - top - bot;
  const xAt = v => lft + ((v - xRange[0]) / (xRange[1] - xRange[0])) * iw;
  const yAt = v => top + ih - ((v - yRange[0]) / (yRange[1] - yRange[0])) * ih;

  const midX = lft + iw / 2;
  const midY = top + ih / 2;

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
           style={{ width: "100%", height: 480, display: "block", overflow: "visible" }}>
        {/* quadrant guides */}
        <line x1={midX} y1={top} x2={midX} y2={top + ih}
              stroke={BI_TOK.hair} strokeDasharray="4 4" />
        <line x1={lft} y1={midY} x2={lft + iw} y2={midY}
              stroke={BI_TOK.hair} strokeDasharray="4 4" />
        {/* quadrant labels */}
        {quadrantLabels && (
          <g fontFamily={BI_TOK.mono} fontSize="9.5"
             fontWeight="600" letterSpacing="0.14em" fill={BI_TOK.mute}>
            <text x={lft + 14} y={top + 18}>{quadrantLabels.tl}</text>
            <text x={midX + 14} y={top + 18}>{quadrantLabels.tr}</text>
            <text x={lft + 14} y={top + ih - 6}>{quadrantLabels.bl}</text>
            <text x={midX + 14} y={top + ih - 6}>{quadrantLabels.br}</text>
          </g>
        )}
        {/* x ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <text key={i} x={lft + iw * p} y={h - bot + 18}
                fontFamily={BI_TOK.mono} fontSize="10"
                fill={BI_TOK.mute} textAnchor="middle">
            {(xRange[0] + (xRange[1] - xRange[0]) * p).toFixed(0)}
          </text>
        ))}
        {/* y ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <text key={i} x={lft - 8} y={top + ih * (1 - p) + 3}
                fontFamily={BI_TOK.mono} fontSize="10"
                fill={BI_TOK.mute} textAnchor="end">
            {(yRange[0] + (yRange[1] - yRange[0]) * p).toFixed(0)}
          </text>
        ))}
        {/* peer dots */}
        {peers.map((p, i) => (
          <circle key={i} cx={xAt(p[0])} cy={yAt(p[1])} r="4"
                  fill={BI_TOK.peer} />
        ))}
        {/* peer-avg crosshair */}
        {peerAvg && (
          <g stroke={BI_TOK.ink} strokeWidth="1" strokeDasharray="2 3">
            <line x1={xAt(peerAvg[0])} y1={yAt(peerAvg[1]) - 18} x2={xAt(peerAvg[0])} y2={yAt(peerAvg[1]) + 18} />
            <line x1={xAt(peerAvg[0]) - 18} y1={yAt(peerAvg[1])} x2={xAt(peerAvg[0]) + 18} y2={yAt(peerAvg[1])} />
            <text x={xAt(peerAvg[0]) + 22} y={yAt(peerAvg[1]) + 3}
                  fontFamily={BI_TOK.mono} fontSize="10" fill={BI_TOK.mute}>peer avg</text>
          </g>
        )}
        {/* you */}
        <circle cx={xAt(you[0])} cy={yAt(you[1])} r="13" fill={BI_TOK.tealHalo} />
        <circle cx={xAt(you[0])} cy={yAt(you[1])} r="6" fill={BI_TOK.teal} stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1={xAt(you[0])} y1={yAt(you[1])} x2={xAt(you[0])} y2={top - 8}
              stroke={BI_TOK.teal} strokeDasharray="2 3" opacity="0.5" />
        <line x1={xAt(you[0])} y1={yAt(you[1])} x2={lft - 4} y2={yAt(you[1])}
              stroke={BI_TOK.teal} strokeDasharray="2 3" opacity="0.5" />
        <text x={xAt(you[0])} y={top - 12}
              fontFamily={BI_TOK.display} fontSize="13" fontWeight="500"
              fill={BI_TOK.ink} textAnchor="middle">{you[2]}</text>

        {/* axis titles */}
        <text x={midX} y={h - 4}
              fontFamily={BI_TOK.mono} fontSize="10.5"
              fontWeight="600" letterSpacing="0.14em"
              fill={BI_TOK.mute} textAnchor="middle">{xLabel} →</text>
        <g transform={`translate(14 ${midY}) rotate(-90)`}>
          <text fontFamily={BI_TOK.mono} fontSize="10.5"
                fontWeight="600" letterSpacing="0.14em"
                fill={BI_TOK.mute} textAnchor="middle">{yLabel} →</text>
        </g>
      </svg>
    </Paper>
  );
}

/* =============================================================
   12 · BIGeoMap — abstract US tilegram, choropleth
   ============================================================= */
function BIGeoMap({ stamp, title, sub, cells, side }) {
  // cells: [{ row, col, code, share, peerOver, you }]  — tile-grid US
  // side: [{ rank, name, value, you }]
  const cellW = 44, cellH = 36, gap = 4;
  const cols = 12, rows = 7;
  const W = cols * (cellW + gap), H = rows * (cellH + gap);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
          {cells.map(c => {
            const x = c.col * (cellW + gap);
            const y = c.row * (cellH + gap);
            // share is 0..1. If peerOver, blend with teal; else use ink ramp.
            const fill = c.you
              ? BI_TOK.teal
              : c.peerOver
                ? `rgba(74,133,128, ${0.20 + c.share * 0.55})`
                : `rgba(14,14,14, ${0.06 + c.share * 0.22})`;
            return (
              <g key={c.code}>
                <rect x={x} y={y} width={cellW} height={cellH}
                      fill={fill}
                      stroke={c.you ? "#FFFFFF" : "none"}
                      strokeWidth={c.you ? 2 : 0} />
                <text x={x + cellW/2} y={y + cellH/2 + 3}
                      fontFamily={BI_TOK.mono} fontSize="9.5"
                      fontWeight={c.you ? 700 : 500}
                      fill={c.you || c.share > 0.6 ? "#FFFFFF" : BI_TOK.ink}
                      textAnchor="middle">{c.code}</text>
              </g>
            );
          })}
        </svg>
        <div>
          <Stamp m style={{ display: "block", marginBottom: 10 }}>Top source states</Stamp>
          {side.map((r, i) => (
            <div key={r.name} style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr 60px",
              alignItems: "center", gap: 10,
              padding: "8px 0",
              borderTop: i === 0 ? "none" : `1px solid ${BI_TOK.hair}`,
              background: r.you ? "linear-gradient(90deg, rgba(74,133,128,0.10), rgba(74,133,128,0) 70%)" : "transparent",
              marginLeft: r.you ? -8 : 0, marginRight: r.you ? -8 : 0,
              paddingLeft: r.you ? 8 : 0, paddingRight: r.you ? 8 : 0,
            }}>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 10,
                color: r.you ? BI_TOK.ink : BI_TOK.mute,
                fontWeight: r.you ? 600 : 500,
              }}>{String(r.rank).padStart(2,"0")}</span>
              <span style={{
                fontFamily: BI_TOK.body, fontSize: 13,
                color: BI_TOK.ink, fontWeight: r.you ? 600 : 400,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                {r.you && <Dot size={6} />}
                <Linked href={r.href || "#"} kind="inst">{r.name}</Linked>
              </span>
              <span style={{
                fontFamily: BI_TOK.mono, fontSize: 12, textAlign: "right",
                color: BI_TOK.ink, fontWeight: r.you ? 600 : 500,
              }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}

/* =============================================================
   13 · BIHeatmap — institutions × metrics, percentile-coded
   ============================================================= */
function BIHeatmap({ stamp, title, sub, columns, rows }) {
  // rows: [{ name, you, cells: [{ value, percentile }] }]
  // percentile is 0..100
  const cellTone = (pct, isYou) => {
    const t = pct / 100;
    if (isYou) {
      return `rgba(74,133,128, ${0.08 + t * 0.72})`;
    }
    return `rgba(14,14,14, ${0.04 + t * 0.30})`;
  };
  const cellText = (pct, isYou) =>
    (pct > 70 ? "#FFFFFF" : BI_TOK.ink);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} />
      <div style={{
        display: "grid",
        gridTemplateColumns: `200px repeat(${columns.length}, minmax(0,1fr))`,
        gap: 4,
      }}>
        <div />
        {columns.map(c => (
          <div key={c} style={{
            fontFamily: BI_TOK.mono, fontSize: 9.5,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: BI_TOK.mute, textAlign: "center", padding: "4px 0",
            lineHeight: 1.25,
          }}>{c}</div>
        ))}
        {rows.map(r => (
          <React.Fragment key={r.name}>
            <div style={{
              fontFamily: BI_TOK.body, fontSize: 13,
              color: BI_TOK.ink, fontWeight: r.you ? 600 : 400,
              padding: "0 8px", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
              display: "inline-flex", alignItems: "center",
            }}>
              {r.you && <span style={{ color: BI_TOK.teal, marginRight: 6 }}>▸</span>}
              <Linked href={r.href || "#"} kind="inst">{r.name}</Linked>
            </div>
            {r.cells.map((c, i) => (
              <div key={i} style={{
                height: 30,
                background: cellTone(c.percentile, r.you),
                color: cellText(c.percentile, r.you),
                display: "grid", placeItems: "center",
                fontFamily: BI_TOK.mono, fontSize: 10.5,
                fontWeight: r.you ? 600 : 500,
                outline: r.you ? `1.25px solid ${BI_TOK.teal}` : "none",
                outlineOffset: r.you ? -1 : 0,
              }}>{c.value}</div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div style={{
        display: "flex", gap: 10, alignItems: "center", marginTop: 16,
        paddingTop: 12, borderTop: `1px solid ${BI_TOK.hair}`,
      }}>
        <Stamp m>Percentile</Stamp>
        <div style={{ display: "flex" }}>
          {[10,25,50,75,90].map(p => (
            <div key={p} style={{
              width: 22, height: 12,
              background: `rgba(14,14,14, ${0.04 + (p/100) * 0.30})`,
            }} />
          ))}
        </div>
        <span style={{ fontFamily: BI_TOK.mono, fontSize: 10, color: BI_TOK.mute, letterSpacing: "0.04em" }}>P10 → P90</span>
        <span style={{ marginLeft: 20, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 14, height: 14, background: BI_TOK.tealHalo, outline: `1.25px solid ${BI_TOK.teal}` }} />
          <span style={{ fontFamily: BI_TOK.mono, fontSize: 10, color: BI_TOK.mute, letterSpacing: "0.04em" }}>You</span>
        </span>
      </div>
    </Paper>
  );
}

/* =============================================================
   14 · BIBullet — Stephen Few's bullet chart
   ------------------------------------------------------------
   One horizontal bar with:
     • 3 qualitative bands (poor / ok / good) as grey washes
     • the "feature" measure (you) — thick teal bar
     • the target — a vertical tick at the goal value
     • value label inline at the right
   ============================================================= */
function BIBullet({
  label, value, unit = "",
  target, ranges,
  peerLabel = "Peer median", peerValue,
  variableHref = "#", peerHref = "#",
  showLegend,
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const pctOf = v => `${((v - min) / (max - min)) * 100}%`;
  const bandFills = [
    "rgba(14,14,14,0.05)",
    "rgba(14,14,14,0.09)",
    "rgba(14,14,14,0.14)",
  ];

  return (
    <Paper pad="18px 22px">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", marginBottom: 12,
      }}>
        <Stamp m>
          <Linked href={variableHref} kind="var">{label}</Linked>
        </Stamp>
        <span style={{
          fontFamily: BI_TOK.display, fontSize: 22, fontWeight: 500,
          letterSpacing: "-0.012em", color: BI_TOK.ink,
          fontVariantNumeric: "tabular-nums",
        }}>{value}{unit}</span>
      </div>

      <div style={{ position: "relative", height: 22 }}>
        {ranges.slice(0, -1).map((lo, i) => {
          const hi = ranges[i + 1];
          return (
            <div key={i} style={{
              position: "absolute",
              left: pctOf(lo),
              width: `calc(${pctOf(hi)} - ${pctOf(lo)})`,
              top: 0, bottom: 0,
              background: bandFills[i] || bandFills[bandFills.length - 1],
            }} />
          );
        })}
        <div style={{
          position: "absolute",
          left: pctOf(min), width: `calc(${pctOf(value)} - ${pctOf(min)})`,
          top: 6, bottom: 6,
          background: BI_TOK.teal,
        }} />
        {target != null && (
          <div style={{
            position: "absolute",
            left: pctOf(target), top: -3, bottom: -3,
            width: 2, background: BI_TOK.ink,
          }} />
        )}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 4,
        fontFamily: BI_TOK.mono, fontSize: 9.5,
        color: BI_TOK.mute, letterSpacing: "0.04em",
      }}>
        <span>{ranges[0]}{unit}</span>
        <span>{ranges[ranges.length - 1]}{unit}</span>
      </div>

      {(peerValue != null) && (
        <>
          <Hair style={{ marginTop: 12 }} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 10,
          }}>
            <Stamp m>
              <Linked href={peerHref} kind="peer">{peerLabel}</Linked>
            </Stamp>
            <span style={{
              fontFamily: BI_TOK.mono, fontSize: 11,
              color: BI_TOK.ink, letterSpacing: "0.04em",
            }}>{peerValue}</span>
          </div>
        </>
      )}

      {showLegend && (
        <div style={{
          marginTop: 12, paddingTop: 10,
          borderTop: `1px solid ${BI_TOK.hair}`,
          display: "flex", gap: 14, flexWrap: "wrap",
        }}>
          <Legend swatch={<span style={{ width: 14, height: 10, background: BI_TOK.teal, display: "inline-block" }} />} label="You" />
          <Legend swatch={<span style={{ width: 14, height: 12, background: bandFills[2], display: "inline-block" }} />} label="Good" />
          <Legend swatch={<span style={{ width: 14, height: 12, background: bandFills[1], display: "inline-block" }} />} label="OK" />
          <Legend swatch={<span style={{ width: 14, height: 12, background: bandFills[0], display: "inline-block" }} />} label="Poor" />
          <Legend swatch={<span style={{ width: 2, height: 14, background: BI_TOK.ink, display: "inline-block" }} />} label="Target" />
        </div>
      )}
    </Paper>
  );
}

/* =============================================================
   15 · BIBigNumber — pure type, no chart
   ============================================================= */
function BIBigNumber({
  label, value, unit = "",
  delta, deltaDir = "up",
  context,
  peerLabel, peerValue,
  variableHref = "#", peerHref = "#",
}) {
  return (
    <Paper pad="28px 32px">
      <Stamp m style={{ display: "block", marginBottom: 14 }}>
        <Linked href={variableHref} kind="var">{label}</Linked>
      </Stamp>
      <div style={{
        fontFamily: BI_TOK.display, fontWeight: 500,
        fontSize: 96, lineHeight: 0.88, letterSpacing: "-0.03em",
        fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
        display: "flex", alignItems: "baseline", gap: 8,
      }}>
        {value}
        {unit && <span style={{ fontSize: 36, color: BI_TOK.mute, fontWeight: 500 }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{
          marginTop: 12,
          fontFamily: BI_TOK.mono, fontSize: 11.5,
          letterSpacing: "0.04em", color: deltaColor(deltaDir),
        }}>{delta}</div>
      )}
      {context && (
        <p style={{
          fontFamily: BI_TOK.body, fontSize: 14.5,
          lineHeight: 1.55, color: "#2D2D2D",
          margin: "18px 0 0", maxWidth: "44ch", textWrap: "pretty",
        }}>{context}</p>
      )}
      {peerValue != null && (
        <>
          <Hair style={{ marginTop: 20 }} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 12,
          }}>
            <Stamp m>
              <Linked href={peerHref} kind="peer">{peerLabel || "Peer avg"}</Linked>
            </Stamp>
            <span style={{
              fontFamily: BI_TOK.mono, fontSize: 11,
              color: BI_TOK.ink, letterSpacing: "0.04em",
            }}>{peerValue}</span>
          </div>
        </>
      )}
    </Paper>
  );
}

/* =============================================================
   16 · BICompareBar — two stacked horizontal bars (you / peer)
   ============================================================= */
function BICompareBar({
  label, unit = "",
  youValue, youLabel = "You", youHref = "#", youKind = "inst",
  peerValue, peerLabel = "Peer avg", peerHref = "#",
  max,
  variableHref = "#",
}) {
  const scale = max != null ? max : Math.max(youValue, peerValue) * 1.15;
  const youPct = (youValue / scale) * 100;
  const peerPct = (peerValue / scale) * 100;
  const delta = youValue - peerValue;
  const deltaSign = delta > 0 ? "+" : "";

  return (
    <Paper pad="20px 22px">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", marginBottom: 14,
      }}>
        <Stamp m>
          <Linked href={variableHref} kind="var">{label}</Linked>
        </Stamp>
        <span style={{
          fontFamily: BI_TOK.mono, fontSize: 11,
          color: delta >= 0 ? BI_TOK.good : BI_TOK.crit,
          letterSpacing: "0.04em",
        }}>
          {deltaSign}{delta.toFixed(1)}{unit} vs peer
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: BI_TOK.mono, fontSize: 10,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: BI_TOK.ink, marginBottom: 4,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Dot size={6} />
              <Linked href={youHref} kind={youKind}>{youLabel}</Linked>
            </span>
            <span style={{
              fontFamily: BI_TOK.display, fontSize: 14,
              fontWeight: 500, letterSpacing: "-0.01em",
              fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
            }}>{youValue}{unit}</span>
          </div>
          <div style={{ height: 18, background: BI_TOK.peerFill, position: "relative" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${youPct}%`, background: BI_TOK.teal,
            }} />
          </div>
        </div>
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: BI_TOK.mono, fontSize: 10,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: BI_TOK.mute, marginBottom: 4,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: "rgba(14,14,14,0.5)", display: "inline-block" }} />
              <Linked href={peerHref} kind="peer">{peerLabel}</Linked>
            </span>
            <span style={{
              fontFamily: BI_TOK.display, fontSize: 14,
              fontWeight: 500, letterSpacing: "-0.01em",
              fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
            }}>{peerValue}{unit}</span>
          </div>
          <div style={{ height: 18, background: BI_TOK.peerFill, position: "relative" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${peerPct}%`, background: BI_TOK.peer,
            }} />
          </div>
        </div>
      </div>
    </Paper>
  );
}

/* =============================================================
   17 · BIStatStrip — inline stat row with hairline dividers
   ============================================================= */
function BIStatStrip({ stamp, items, dense }) {
  return (
    <Paper pad={dense ? "16px 22px" : "20px 24px"}>
      {stamp && <Stamp m style={{ display: "block", marginBottom: 12 }}>{stamp}</Stamp>}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`,
      }}>
        {items.map((it, i) => (
          <div key={it.label} style={{
            padding: dense ? "8px 18px" : "10px 22px",
            borderLeft: i === 0 ? "none" : `1px solid ${BI_TOK.hair}`,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <Stamp m>
              <Linked href={it.variableHref || "#"} kind="var">{it.label}</Linked>
            </Stamp>
            <div style={{
              fontFamily: BI_TOK.display, fontWeight: 500,
              fontSize: dense ? 28 : 36,
              lineHeight: 0.92, letterSpacing: "-0.022em",
              fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
              display: "flex", alignItems: "baseline", gap: 4,
            }}>
              {it.value}
              {it.unit && (
                <span style={{ fontSize: dense ? 14 : 18, color: BI_TOK.mute }}>{it.unit}</span>
              )}
            </div>
            {it.delta && (
              <div style={{
                fontFamily: BI_TOK.mono, fontSize: 10.5,
                color: deltaColor(it.deltaDir),
                letterSpacing: "0.04em",
              }}>{it.delta}</div>
            )}
            {(it.peerValue || it.peerLabel) && (
              <div style={{
                fontFamily: BI_TOK.mono, fontSize: 10,
                color: BI_TOK.mute, letterSpacing: "0.06em",
              }}>
                <Linked href={it.peerHref || "#"} kind="peer">{it.peerLabel || "peer"}</Linked>
                {it.peerValue ? ` · ${it.peerValue}` : ""}
              </div>
            )}
          </div>
        ))}
      </div>
    </Paper>
  );
}

/* =============================================================
   18 · BIVariance — divergent bar list, centred on zero
   ============================================================= */
function BIVariance({
  stamp, title, sub, right,
  items, range, unit = "",
  baselineLabel = "Zero",
}) {
  const [min, max] = range;
  const spanW = max - min;
  const zeroPct = ((0 - min) / spanW) * 100;
  const widthPct = v => (Math.abs(v) / spanW) * 100;

  const toneFor = (it) => it.dir
    ? deltaColor(it.dir)
    : (it.delta >= 0 ? BI_TOK.good : BI_TOK.crit);

  return (
    <Paper pad="24px 28px">
      <BISectionHead stamp={stamp} title={title} sub={sub} right={right} />
      <div>
        {items.map((it, i) => (
          <div key={it.name} style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 72px",
            alignItems: "center", gap: 16,
            padding: "11px 0",
            borderTop: i === 0 ? "none" : `1px solid ${BI_TOK.hair}`,
          }}>
            <span style={{
              fontFamily: BI_TOK.body, fontSize: 13.5,
              color: BI_TOK.ink, fontWeight: 500,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              <Linked href={it.href || "#"} kind={it.kind || "var"}>{it.name}</Linked>
            </span>
            <div style={{ position: "relative", height: 16, background: BI_TOK.peerFill }}>
              <div style={{
                position: "absolute", top: -3, bottom: -3,
                left: `${zeroPct}%`, width: 1,
                background: BI_TOK.ink,
              }} />
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                left: it.delta >= 0 ? `${zeroPct}%` : `${zeroPct - widthPct(it.delta)}%`,
                width: `${widthPct(it.delta)}%`,
                background: toneFor(it),
                opacity: 0.85,
              }} />
            </div>
            <span style={{
              fontFamily: BI_TOK.mono, fontSize: 12,
              fontVariantNumeric: "tabular-nums",
              color: toneFor(it), textAlign: "right", fontWeight: 600,
            }}>
              {it.delta > 0 ? "+" : ""}{it.delta.toFixed(1)}{unit}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr 72px",
        gap: 16, marginTop: 6,
        fontFamily: BI_TOK.mono, fontSize: 9.5,
        letterSpacing: "0.08em", color: BI_TOK.mute,
      }}>
        <span />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{min > 0 ? "+" : ""}{min}{unit}</span>
          <span>{baselineLabel}</span>
          <span>{max > 0 ? "+" : ""}{max}{unit}</span>
        </div>
        <span />
      </div>
    </Paper>
  );
}

/* =============================================================
   19 · BIProgress — % toward goal with optional pace marker
   ============================================================= */
function BIProgress({
  label, value, target,
  display,
  unit = "%",
  pace,
  paceLabel,
  delta,
  variableHref = "#",
}) {
  const pctOf = v => Math.min(100, Math.max(0, (v / target) * 100));
  const valuePct = pctOf(value);
  const onPace = pace != null && valuePct >= pace;

  return (
    <Paper pad="22px 26px">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", marginBottom: 16,
      }}>
        <Stamp m>
          <Linked href={variableHref} kind="var">{label}</Linked>
        </Stamp>
        <span style={{
          fontFamily: BI_TOK.mono, fontSize: 10.5,
          color: onPace ? BI_TOK.good : BI_TOK.warn,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>{onPace ? "On pace" : "Behind pace"}</span>
      </div>

      <div style={{
        fontFamily: BI_TOK.display, fontWeight: 500,
        fontSize: 44, lineHeight: 0.92, letterSpacing: "-0.025em",
        fontVariantNumeric: "tabular-nums", color: BI_TOK.ink,
        display: "flex", alignItems: "baseline", gap: 6,
      }}>
        {valuePct.toFixed(1)}
        <span style={{ fontSize: 20, color: BI_TOK.mute }}>{unit}</span>
      </div>
      {display && (
        <div style={{
          fontFamily: BI_TOK.mono, fontSize: 11,
          color: BI_TOK.ink, marginTop: 6,
          letterSpacing: "0.04em",
        }}>{display}</div>
      )}

      <div style={{ position: "relative", height: 22, marginTop: 28, background: BI_TOK.peerFill }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${valuePct}%`,
          background: BI_TOK.teal,
        }} />
        {pace != null && (
          <>
            <div style={{
              position: "absolute", left: `${pace}%`,
              top: -4, bottom: -4, width: 2,
              background: BI_TOK.ink,
            }} />
            <div style={{
              position: "absolute", left: `${pace}%`,
              transform: "translateX(-50%)", top: -22,
              fontFamily: BI_TOK.mono, fontSize: 9.5,
              color: BI_TOK.mute, letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}>{paceLabel || `pace ${pace}%`}</div>
          </>
        )}
      </div>

      {delta && (
        <div style={{
          marginTop: 10, fontFamily: BI_TOK.mono, fontSize: 11,
          color: BI_TOK.ink, letterSpacing: "0.04em",
        }}>{delta}</div>
      )}
    </Paper>
  );
}

/* ---------- Export to window --------------------------------- */
Object.assign(window, {
  BI_TOK, BISectionHead, YouCallout, Legend, TileLink, Linked,
  BIKpiTile, BITrendBand, BIDistribution, BIRanking, BISmallMultiples,
  BIDonut, BIComposition, BIFunnel, BIFunnelChart, BIGauge, BIWaterfall, BISankey,
  BIQuadrant, BIGeoMap, BIHeatmap,
  // new — simple and powerful
  BIBullet, BIBigNumber, BICompareBar, BIStatStrip, BIVariance, BIProgress,
});
