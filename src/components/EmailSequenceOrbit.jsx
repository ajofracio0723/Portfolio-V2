import React from "react";

/**
 * Email nurture / drip sequence automation -
 * enroll → compliance checks → timed sends → open/click gates →
 * CTA booking or re-engagement / exit.
 */
export default function EmailSequenceOrbit({ className = "" }) {
  const link = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  };

  const nodes = [
    // Enrollment
    { id: "t1", label: "Form Submit", sub: "Trigger", x: 90, y: 160, color: "#f59e0b", w: 118, kind: "trigger" },
    { id: "t2", label: "Tag Added", sub: "nurture-list", x: 90, y: 260, color: "#f97316", w: 118, kind: "trigger" },
    { id: "enroll", label: "Enroll Sequence", sub: "Email drip #1", x: 290, y: 210, color: "#a78bfa", w: 132 },

    // Compliance
    { id: "unsub", label: "Check Unsubscribed", sub: "Suppression list", x: 500, y: 210, color: "#818cf8", w: 148 },
    { id: "gate", label: "Can Email?", sub: "If / Else", x: 700, y: 210, color: "#a855f7", w: 112 },

    // Sequence spine
    { id: "e1", label: "Send Email 1", sub: "Welcome · Day 0", x: 900, y: 120, color: "#8b5cf6", w: 128 },
    { id: "w1", label: "Wait 2 Days", sub: "Delay", x: 1100, y: 120, color: "#6366f1", w: 118 },
    { id: "open1", label: "Opened Email 1?", sub: "If / Else", x: 1300, y: 120, color: "#34d399", w: 132 },

    { id: "e2", label: "Send Email 2", sub: "Value tip · Day 2", x: 1300, y: 230, color: "#8b5cf6", w: 132 },
    { id: "w2", label: "Wait 3 Days", sub: "Delay", x: 1100, y: 230, color: "#6366f1", w: 118 },
    { id: "click", label: "Clicked CTA?", sub: "If / Else", x: 900, y: 230, color: "#22d3ee", w: 120 },

    { id: "e3", label: "Send Email 3", sub: "Soft pitch · Day 5", x: 700, y: 340, color: "#8b5cf6", w: 132 },
    { id: "w3", label: "Wait 2 Days", sub: "Delay", x: 900, y: 340, color: "#6366f1", w: 118 },
    { id: "reply", label: "Replied / Booked?", sub: "If / Else", x: 1100, y: 340, color: "#34d399", w: 138 },

    // Success outcomes
    { id: "book", label: "Book Appointment", sub: "Calendar link", x: 1300, y: 340, color: "#4ade80", w: 140 },
    { id: "tagHot", label: "Tag Contact", sub: "+engaged", x: 1500, y: 280, color: "#a78bfa", w: 118 },
    { id: "opp", label: "Create Opportunity", sub: "Stage · Nurture", x: 1500, y: 380, color: "#60a5fa", w: 146 },

    // Cold / exit paths
    { id: "reeng", label: "Re-engage Email", sub: "Last chance", x: 1300, y: 440, color: "#f472b6", w: 130 },
    { id: "exit", label: "Exit Sequence", sub: "Remove + log", x: 1100, y: 440, color: "#94a3b8", w: 124 },
    { id: "skip", label: "Skip / Suppress", sub: "Do not email", x: 500, y: 360, color: "#fb923c", w: 128 },
    { id: "note", label: "Internal Note", sub: "Sequence complete", x: 1500, y: 180, color: "#94a3b8", w: 132 },
  ];

  const edges = [
    // Triggers → enroll
    link(149, 160, 224, 195),
    link(149, 260, 224, 225),

    // Enroll → compliance → gate
    link(356, 210, 426, 210),
    link(574, 210, 644, 210),

    // Gate true → Email 1
    link(756, 195, 836, 135),
    // Gate false → skip
    link(644, 240, 540, 330),

    // Email spine
    link(964, 120, 1041, 120),
    link(1159, 120, 1234, 120),

    // Opened? true → continue to Email 2; false → still send Email 2 (nurture) but mark path
    link(1300, 150, 1300, 200),
    link(1234, 135, 1164, 215),

    // Email 2 → wait → clicked?
    link(1234, 230, 1159, 230),
    link(1041, 230, 960, 230),

    // Clicked true → book path (up-right via tag)
    link(960, 215, 1230, 320),
    // Clicked false → Email 3
    link(840, 245, 766, 320),

    // Email 3 → wait → replied?
    link(766, 340, 841, 340),
    link(959, 340, 1031, 340),

    // Replied true → book
    link(1169, 340, 1230, 340),
    // Replied false → re-engage
    link(1100, 370, 1235, 425),

    // Book → tag + opp
    link(1370, 325, 1431, 295),
    link(1370, 355, 1427, 365),

    // Tag → note
    link(1500, 250, 1500, 210),

    // Re-engage → exit
    link(1235, 440, 1162, 440),

    // Skip → exit
    link(564, 375, 1038, 430),
  ];

  const primaryFlow = [
    link(149, 160, 224, 195),
    link(356, 210, 426, 210),
    link(574, 210, 644, 210),
    link(756, 195, 836, 135),
    link(964, 120, 1041, 120),
    link(1159, 120, 1234, 120),
    link(1300, 150, 1300, 200),
    link(1234, 230, 1159, 230),
    link(1041, 230, 960, 230),
    link(840, 245, 766, 320),
    link(766, 340, 841, 340),
    link(959, 340, 1031, 340),
    link(1169, 340, 1230, 340),
    link(1370, 325, 1431, 295),
  ].join(" ");

  const secondaryFlow = [
    link(149, 260, 224, 225),
    link(960, 215, 1230, 320),
    link(1370, 355, 1427, 365),
    link(1500, 250, 1500, 210),
  ].join(" ");

  const tertiaryFlow = [
    link(644, 240, 540, 330),
    link(564, 375, 1038, 430),
    link(1100, 370, 1235, 425),
    link(1235, 440, 1162, 440),
    link(1234, 135, 1164, 215),
  ].join(" ");

  const labels = [
    { x: 780, y: 165, text: "true", color: "#34d399" },
    { x: 620, y: 290, text: "false", color: "#f87171" },
    { x: 1320, y: 180, text: "opened", color: "#34d399" },
    { x: 1180, y: 170, text: "no open", color: "#f87171" },
    { x: 980, y: 200, text: "clicked", color: "#22d3ee" },
    { x: 780, y: 290, text: "no click", color: "#f87171" },
    { x: 1180, y: 320, text: "true", color: "#34d399" },
    { x: 1185, y: 400, text: "false", color: "#f87171" },
  ];

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#050510] overflow-hidden relative ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-4 md:px-6 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-violet-400 font-medium">
            Live Preview · Email Ops
          </p>
          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Nurture Email Sequence
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Enroll → suppression check → welcome / value / soft-pitch drip with wait steps →
            open &amp; click gates → book + opportunity · or re-engage &amp; exit
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Automation running
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {nodes.filter((n) => n.kind !== "trigger").length} actions
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {nodes.filter((n) => n.kind === "trigger").length} triggers
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            3-email drip
          </span>
        </div>
      </div>

      <div className="relative px-4 md:px-6 pb-3 flex flex-wrap gap-3 text-[10px] md:text-xs text-slate-400">
        {[
          { c: "#f59e0b", t: "Triggers" },
          { c: "#8b5cf6", t: "Emails" },
          { c: "#6366f1", t: "Waits" },
          { c: "#34d399", t: "Conditions" },
          { c: "#4ade80", t: "Conversion" },
          { c: "#f472b6", t: "Re-engage" },
        ].map((l) => (
          <span key={l.t} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: l.c }} />
            {l.t}
          </span>
        ))}
      </div>

      <div className="relative w-full overflow-x-auto agency-scroll">
        <svg
          viewBox="0 0 1600 520"
          className="w-full min-w-[1100px] h-auto"
          role="img"
          aria-label="Email nurture sequence automation workflow"
        >
          <defs>
            <linearGradient id="emailGradA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="emailGradB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="emailGradC" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.75" />
            </linearGradient>
            <filter id="emailGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="emailGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.35"
                opacity="0.32"
              />
            </pattern>
          </defs>

          <rect width="1600" height="520" fill="url(#emailGrid)" opacity="0.45" />

          <g fontFamily="ui-sans-serif,system-ui,sans-serif" opacity="0.55">
            <text x="40" y="120" fill="#94a3b8" fontSize="9" fontWeight="600">
              ENROLL
            </text>
            <text x="880" y="85" fill="#94a3b8" fontSize="9" fontWeight="600">
              DRIP SEQUENCE
            </text>
            <text x="1280" y="500" fill="#94a3b8" fontSize="9" fontWeight="600">
              EXIT / RE-ENGAGE
            </text>
          </g>

          {edges.map((d, i) => (
            <path
              key={`ee-${i}`}
              d={d}
              stroke="#2e1065"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          ))}

          <path
            d={primaryFlow}
            stroke="url(#emailGradA)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 14"
            filter="url(#emailGlow)"
            className="agency-flow-dash"
          />
          <path
            d={secondaryFlow}
            stroke="url(#emailGradB)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 12"
            filter="url(#emailGlow)"
            className="agency-flow-dash-delay"
          />
          <path
            d={tertiaryFlow}
            stroke="url(#emailGradC)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 10"
            filter="url(#emailGlow)"
            className="agency-flow-dash-slow"
          />

          {labels.map((l) => (
            <text
              key={`${l.text}-${l.x}-${l.y}`}
              x={l.x}
              y={l.y}
              fill={l.color}
              fontSize="9"
              fontWeight="700"
              fontFamily="ui-sans-serif,system-ui,sans-serif"
            >
              {l.text}
            </text>
          ))}

          {nodes.map((n, i) => {
            const half = n.w / 2;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  x={-half}
                  y="-30"
                  width={n.w}
                  height="60"
                  rx="12"
                  fill="#0a0a14"
                  stroke={n.color}
                  strokeWidth="1.6"
                  opacity="0.97"
                />
                <rect
                  x={-half}
                  y="-30"
                  width="4"
                  height="60"
                  rx="2"
                  fill={n.color}
                  opacity="0.9"
                />
                <circle
                  cx={-half + 16}
                  cy="-8"
                  r="3.5"
                  fill={n.color}
                  className="agency-node-pulse"
                  style={{ animationDelay: `${(i % 6) * 0.15}s` }}
                />
                <text
                  x={4}
                  y="-5"
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                  fontWeight="700"
                >
                  {n.label}
                </text>
                <text
                  x={4}
                  y="12"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                >
                  {n.sub}
                </text>
              </g>
            );
          })}

          <g fontFamily="ui-sans-serif,system-ui,sans-serif">
            <rect x="40" y="40" width="150" height="28" rx="8" fill="#1e1b4b" stroke="#6366f144" />
            <text x="115" y="58" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="600">
              avg runtime ~1.8s
            </text>
            <rect x="1420" y="90" width="120" height="28" rx="8" fill="#052e1a" stroke="#34d39944" />
            <text x="1480" y="108" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
              24.6% CTR
            </text>
          </g>
        </svg>
      </div>

      <p className="text-center text-xs text-slate-500 pb-5 px-4 max-w-3xl mx-auto">
        Production nurture drip: suppression-safe enrollment, timed welcome → value → pitch
        emails, open/click/reply gates, calendar booking + opportunity on engagement, and
        re-engage / exit for cold contacts.
      </p>
    </div>
  );
}
