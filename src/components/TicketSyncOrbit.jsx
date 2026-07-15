import React from "react";

/**
 * n8n-style ticket / attachment sync automation -
 * Cron → fetch tickets & articles → attachment gate →
 * dual region upload (NP / WY) → comments, close, or assign support.
 */
export default function TicketSyncOrbit({ className = "" }) {
  const link = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  };

  const nodes = [
    // Intake spine (left → center)
    { id: "cron", label: "Cron Trigger", sub: "Every 15 min", x: 90, y: 280, color: "#f59e0b", w: 124, kind: "trigger" },
    { id: "getT", label: "Get Tickets", sub: "HTTP GET", x: 280, y: 280, color: "#38bdf8", w: 122 },
    { id: "mapT", label: "Map Tickets", sub: "Code · filter", x: 460, y: 280, color: "#fb923c", w: 122 },
    { id: "getA", label: "Get Articles", sub: "HTTP GET", x: 640, y: 280, color: "#38bdf8", w: 122 },
    { id: "filt", label: "Filter Attachments", sub: "Has file?", x: 830, y: 280, color: "#a78bfa", w: 142 },
    { id: "corr", label: "Correct Attachment?", sub: "If / Else", x: 1040, y: 280, color: "#34d399", w: 148 },

    // True path - attachment recovery (top)
    { id: "getAtt", label: "Get Attachment", sub: "HTTP GET", x: 1040, y: 140, color: "#38bdf8", w: 130 },
    { id: "write", label: "Write Attachment", sub: "Binary → disk", x: 1240, y: 140, color: "#f472b6", w: 136 },

    // Dual region setup
    { id: "npSet", label: "NP Set SBC Data", sub: "North · payload", x: 1240, y: 40, color: "#818cf8", w: 138 },
    { id: "wySet", label: "WY Set SBC Data", sub: "West · payload", x: 1440, y: 140, color: "#818cf8", w: 138 },

    // WY upload rail
    { id: "login", label: "Login", sub: "HTTP POST", x: 1440, y: 40, color: "#38bdf8", w: 110 },
    { id: "upload", label: "Upload Data", sub: "HTTP PUT", x: 1440, y: 250, color: "#22d3ee", w: 122 },
    { id: "ifUp", label: "IF Upload OK?", sub: "If / Else", x: 1240, y: 340, color: "#34d399", w: 128 },
    { id: "cmtOk", label: "Add Ticket Comment", sub: "HTTP POST · success", x: 1040, y: 400, color: "#38bdf8", w: 146 },
    { id: "close", label: "Close Ticket", sub: "Status · solved", x: 840, y: 400, color: "#34d399", w: 122 },

    // NP upload rail
    { id: "npIf", label: "NP IF Upload OK?", sub: "If / Else", x: 1440, y: 340, color: "#34d399", w: 138 },
    { id: "npCmt", label: "NP Add Comment", sub: "HTTP POST", x: 1440, y: 430, color: "#38bdf8", w: 130 },

    // Fail / false paths → support
    { id: "cmtFail", label: "Add Fail Comment", sub: "HTTP POST", x: 1040, y: 480, color: "#fb923c", w: 136 },
    { id: "cmtNoAtt", label: "Add No-File Comment", sub: "HTTP POST", x: 840, y: 160, color: "#94a3b8", w: 148 },
    { id: "assign", label: "Assign Support", sub: "Human handoff", x: 640, y: 430, color: "#fbbf24", w: 132 },
  ];

  const edges = [
    // Main spine
    link(152, 280, 219, 280),
    link(341, 280, 399, 280),
    link(521, 280, 579, 280),
    link(701, 280, 759, 280),
    link(901, 280, 966, 280),

    // Correct Attachment? true ↑
    link(1040, 250, 1040, 170),
    // Correct Attachment? false ↑-left to no-file comment
    link(966, 265, 914, 175),

    // Get → Write attachment
    link(1105, 140, 1172, 140),

    // Write → NP / WY set
    link(1240, 110, 1240, 70),
    link(1308, 140, 1371, 140),

    // NP set → NP IF (down-right)
    link(1309, 40, 1371, 320),
    // WY set → Login / Upload
    link(1440, 110, 1440, 70),
    link(1440, 170, 1440, 220),

    // Login → Upload (via WY set already) - login feeds upload conceptually through WY
    link(1440, 70, 1440, 100),

    // Upload → IF upload ok (WY)
    link(1379, 250, 1304, 320),

    // IF upload ok true → comment → close
    link(1176, 340, 1113, 385),
    link(967, 400, 901, 400),

    // IF upload ok false → fail comment → assign
    link(1240, 370, 1110, 460),
    link(972, 480, 706, 445),

    // NP IF true → NP comment; false → assign
    link(1440, 370, 1440, 400),
    link(1371, 355, 706, 430),

    // No-file comment → assign
    link(766, 175, 680, 400),

    // Close ticket done rail subtle
    link(779, 400, 706, 420),
  ];

  const primaryFlow = [
    link(152, 280, 219, 280),
    link(341, 280, 399, 280),
    link(521, 280, 579, 280),
    link(701, 280, 759, 280),
    link(901, 280, 966, 280),
    link(1040, 250, 1040, 170),
    link(1105, 140, 1172, 140),
    link(1308, 140, 1371, 140),
    link(1440, 170, 1440, 220),
    link(1379, 250, 1304, 320),
    link(1176, 340, 1113, 385),
    link(967, 400, 901, 400),
  ].join(" ");

  const secondaryFlow = [
    link(1308, 140, 1240, 70),
    link(1309, 40, 1371, 320),
    link(1440, 370, 1440, 400),
    link(966, 265, 914, 175),
    link(766, 175, 680, 400),
  ].join(" ");

  const tertiaryFlow = [
    link(1240, 370, 1110, 460),
    link(972, 480, 706, 445),
    link(1371, 355, 706, 430),
    link(1440, 110, 1440, 70),
  ].join(" ");

  const labels = [
    { x: 1065, y: 210, text: "true", color: "#34d399" },
    { x: 960, y: 220, text: "false", color: "#f87171" },
    { x: 1180, y: 360, text: "true", color: "#34d399" },
    { x: 1165, y: 420, text: "false", color: "#f87171" },
    { x: 1475, y: 390, text: "true", color: "#34d399" },
    { x: 1385, y: 380, text: "false", color: "#f87171" },
  ];

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#050510] overflow-hidden relative ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.10),transparent_55%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-4 md:px-6 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan-400 font-medium">
            Live Preview · Integration Ops
          </p>
          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Ticket &amp; Attachment Sync Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cron → fetch tickets/articles → attachment validation → dual-region upload
            (NP / WY) → success comments &amp; close · or fail comments &amp; assign support
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
            3 decision gates
          </span>
        </div>
      </div>

      <div className="relative px-4 md:px-6 pb-3 flex flex-wrap gap-3 text-[10px] md:text-xs text-slate-400">
        {[
          { c: "#f59e0b", t: "Schedule" },
          { c: "#38bdf8", t: "HTTP / API" },
          { c: "#34d399", t: "Conditions" },
          { c: "#f472b6", t: "Files" },
          { c: "#fbbf24", t: "Handoff" },
        ].map((l) => (
          <span key={l.t} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: l.c }} />
            {l.t}
          </span>
        ))}
      </div>

      <div className="relative w-full overflow-x-auto agency-scroll">
        <svg
          viewBox="0 0 1580 540"
          className="w-full min-w-[1100px] h-auto"
          role="img"
          aria-label="Ticket attachment sync automation workflow"
        >
          <defs>
            <linearGradient id="ticketGradA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="ticketGradB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="ticketGradC" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>
            <filter id="ticketGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="ticketGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.35"
                opacity="0.3"
              />
            </pattern>
          </defs>

          <rect width="1580" height="540" fill="url(#ticketGrid)" opacity="0.45" />

          <g fontFamily="ui-sans-serif,system-ui,sans-serif" opacity="0.55">
            <text x="40" y="250" fill="#94a3b8" fontSize="9" fontWeight="600">
              INGEST
            </text>
            <text x="1000" y="100" fill="#94a3b8" fontSize="9" fontWeight="600">
              ATTACHMENT PATH
            </text>
            <text x="40" y="500" fill="#94a3b8" fontSize="9" fontWeight="600">
              SUPPORT HANDOFF
            </text>
          </g>

          {edges.map((d, i) => (
            <path
              key={`te-${i}`}
              d={d}
              stroke="#1e3a5f"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          ))}

          <path
            d={primaryFlow}
            stroke="url(#ticketGradA)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 14"
            filter="url(#ticketGlow)"
            className="agency-flow-dash"
          />
          <path
            d={secondaryFlow}
            stroke="url(#ticketGradB)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 12"
            filter="url(#ticketGlow)"
            className="agency-flow-dash-delay"
          />
          <path
            d={tertiaryFlow}
            stroke="url(#ticketGradC)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 10"
            filter="url(#ticketGlow)"
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
              avg runtime ~2.3s
            </text>
            <rect x="1380" y="480" width="120" height="28" rx="8" fill="#052e1a" stroke="#34d39944" />
            <text x="1440" y="498" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
              97.1% success
            </text>
          </g>
        </svg>
      </div>

      <p className="text-center text-xs text-slate-500 pb-5 px-4 max-w-3xl mx-auto">
        Production support-desk sync: scheduled ticket pull, attachment validation,
        dual-region SBC upload with true/false gates, ticket comments, close, and
        human assign-on-failure - n8n-style branching for agency / SaaS ops.
      </p>
    </div>
  );
}
