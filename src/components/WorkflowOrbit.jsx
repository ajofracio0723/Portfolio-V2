import React from "react";

/**
 * Enterprise CRM automation canvas - cleaned column layout:
 * Intake → Enrich → Gate → Hot fan-out → Booking / Wait → Outcomes
 * + bottom payment rail (Won only after Stripe)
 */
export default function WorkflowOrbit({ className = "" }) {
  // Column centers (even gutters). Row rhythm = 72px for fan-out.
  const nodes = [
    // Col 1 - Intake
    { id: "t1", label: "Form Submit", sub: "Trigger", x: 90, y: 100, color: "#f59e0b", w: 118, kind: "trigger" },
    { id: "t2", label: "Webhook In", sub: "REST · JSON", x: 90, y: 190, color: "#f97316", w: 118, kind: "trigger" },
    { id: "t3", label: "Stripe Paid", sub: "Payment event", x: 90, y: 455, color: "#fb923c", w: 118, kind: "trigger" },

    // Col 2 - Enrich
    { id: "a1", label: "Dedupe Lead", sub: "Smart List", x: 290, y: 115, color: "#818cf8", w: 122 },
    { id: "a2", label: "Map Custom Fields", sub: "Payload → CRM", x: 290, y: 215, color: "#6366f1", w: 138 },

    // Col 3 - Gate
    { id: "c1", label: "If / Else", sub: "Hot lead?", x: 500, y: 165, color: "#a855f7", w: 112 },

    // Col 4 - Hot-lead fan-out (aligned vertical stack, clears payment rail)
    { id: "h1", label: "Create Opportunity", sub: "Stage · Qualified", x: 740, y: 40, color: "#60a5fa", w: 146 },
    { id: "h2", label: "Tag Contact", sub: "+hot-lead", x: 740, y: 105, color: "#a78bfa", w: 122 },
    { id: "h3", label: "Send SMS", sub: "A2P · LeadConnector", x: 740, y: 170, color: "#22d3ee", w: 132 },
    { id: "h4", label: "Send Email", sub: "Instant sequence", x: 740, y: 235, color: "#8b5cf6", w: 128 },
    { id: "h5", label: "Slack Alert", sub: "Sales channel", x: 740, y: 300, color: "#34d399", w: 122 },
    { id: "h6", label: "API Call", sub: "POST /sync", x: 740, y: 365, color: "#38bdf8", w: 118 },

    // Col 5 - Next steps (book top, wait mid - no crossing)
    { id: "b1", label: "Book Appointment", sub: "Round-robin calendar", x: 1000, y: 40, color: "#4ade80", w: 148 },
    { id: "m1", label: "Wait 15 Minutes", sub: "Delay step", x: 1000, y: 205, color: "#6366f1", w: 132 },

    // Col 6 - Status / continue
    { id: "b2", label: "Check Appt Status", sub: "Completed · No-show", x: 1260, y: 65, color: "#f472b6", w: 142 },
    { id: "m2", label: "Follow-up Reminder", sub: "Continue automation", x: 1260, y: 205, color: "#a855f7", w: 142 },

    // Col 7 - Outcomes (top → bottom, no overlap)
    { id: "o1", label: "Update CRM", sub: "Appt Completed", x: 1510, y: 30, color: "#34d399", w: 128 },
    { id: "o2", label: "No-Show Handling", sub: "After booking only", x: 1510, y: 110, color: "#f472b6", w: 138 },
    { id: "o3", label: "Send Reminder", sub: "SMS + Email", x: 1510, y: 190, color: "#22d3ee", w: 124 },
    { id: "o4", label: "Create Follow-up Task", sub: "Assign owner", x: 1510, y: 270, color: "#fbbf24", w: 152 },

    // Payment rail - fully below fan-out, no collision with API Call
    { id: "p1", label: "Update Opportunity", sub: "Stage · Won", x: 340, y: 455, color: "#34d399", w: 142 },
    { id: "p2", label: "Internal Note", sub: "Payment received", x: 580, y: 455, color: "#94a3b8", w: 132 },
    { id: "p3", label: "Send Receipt Email", sub: "Stripe receipt", x: 820, y: 455, color: "#8b5cf6", w: 140 },
  ];

  // Helper: horizontal-ish cubic from right of src to left of dst
  const link = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  };

  // Edge endpoints use node centers ± half width (approximate clean ports)
  const edges = [
    // Intake → enrich
    link(149, 100, 221, 115),
    link(149, 100, 221, 215),
    link(149, 190, 221, 115),
    link(149, 190, 221, 215),

    // Enrich → gate
    link(359, 115, 444, 165),
    link(359, 215, 444, 165),

    // Gate → fan-out
    link(556, 165, 667, 40),
    link(556, 165, 667, 105),
    link(556, 165, 667, 170),
    link(556, 165, 667, 235),
    link(556, 165, 667, 300),
    link(556, 165, 667, 365),

    // Create Opportunity → Book Appointment
    link(813, 40, 926, 40),

    // Tag Contact → Book Appointment
    link(801, 105, 926, 50),

    // SMS + Email → Wait
    link(806, 170, 934, 205),
    link(804, 235, 934, 205),

    // Slack + API → Follow-up Reminder
    link(801, 300, 1189, 215),
    link(799, 365, 1189, 225),

    // Wait → Follow-up
    link(1066, 205, 1189, 205),

    // Book → Check status
    link(1074, 40, 1189, 65),

    // Check → outcomes
    link(1331, 65, 1446, 30),
    link(1331, 65, 1441, 110),

    // No-show chain
    "M1510 142 V158",
    "M1510 222 V238",

    // Payment rail (all at y=455 - clear of API Call at y=365)
    link(149, 455, 269, 455),
    link(411, 455, 514, 455),
    link(646, 455, 750, 455),
  ];

  const primaryFlow = [
    link(149, 100, 221, 115),
    link(359, 115, 444, 165),
    link(556, 165, 667, 40),
    link(813, 40, 926, 40),
    link(1074, 40, 1189, 65),
    link(1331, 65, 1446, 30),
  ].join(" ");

  const secondaryFlow = [
    link(149, 190, 221, 215),
    link(359, 215, 444, 165),
    link(556, 165, 667, 170),
    link(806, 170, 934, 205),
    link(1066, 205, 1189, 205),
  ].join(" ");

  const tertiaryFlow = [
    link(149, 455, 269, 455),
    link(411, 455, 514, 455),
    link(646, 455, 750, 455),
    link(556, 165, 667, 235),
    link(804, 235, 934, 205),
    link(1331, 65, 1441, 110),
    "M1510 142 V238",
  ].join(" ");

  const actionCount = nodes.filter((n) => n.kind !== "trigger").length;
  const triggerCount = nodes.filter((n) => n.kind === "trigger").length;

  return (
    <div className={`rounded-3xl border border-white/10 bg-[#050510] overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_55%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-4 md:px-6 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
            Live Preview · Technical Ops
          </p>
          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Complex Multi-Branch Automation
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Lead intake → dedupe &amp; field mapping → hot-lead fan-out → book appointment →
            appointment status → CRM update / no-show recovery · Stripe payment rail → Won
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Automation running
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {actionCount} actions
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {triggerCount} triggers
          </span>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            6 parallel paths
          </span>
        </div>
      </div>

      <div className="relative px-4 md:px-6 pb-3 flex flex-wrap gap-3 text-[10px] md:text-xs text-slate-400">
        {[
          { c: "#f59e0b", t: "Triggers" },
          { c: "#a855f7", t: "Conditions" },
          { c: "#22d3ee", t: "Messaging" },
          { c: "#38bdf8", t: "Integrations" },
          { c: "#34d399", t: "CRM / Exit" },
          { c: "#f472b6", t: "No-Show Recovery" },
        ].map((l) => (
          <span key={l.t} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: l.c }} />
            {l.t}
          </span>
        ))}
      </div>

      <div className="relative w-full overflow-x-auto agency-scroll">
        <svg
          viewBox="0 0 1620 520"
          className="w-full min-w-[1200px] h-auto"
          role="img"
          aria-label="Enterprise multi-branch CRM automation workflow"
        >
          <defs>
            <linearGradient id="flowGradA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="40%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="flowGradB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="flowGradPay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.5" />
              <stop offset="55%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.45" />
            </linearGradient>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="agencyGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.4"
                opacity="0.35"
              />
            </pattern>
          </defs>

          <rect width="1620" height="520" fill="url(#agencyGrid)" opacity="0.45" />

          {/* Horizontal lane separators for clarity */}
          <line
            x1="40"
            y1="400"
            x2="980"
            y2="400"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.45"
          />

          <g fontFamily="ui-sans-serif,system-ui,sans-serif" opacity="0.6">
            <text x="40" y="42" fill="#94a3b8" fontSize="9" fontWeight="600">
              LEAD INTAKE
            </text>
            <text x="40" y="418" fill="#94a3b8" fontSize="9" fontWeight="600">
              PAYMENT RAIL
            </text>
          </g>

          {edges.map((d, i) => (
            <path
              key={`edge-${i}`}
              d={d}
              stroke="#312e81"
              strokeWidth="2"
              fill="none"
              opacity="0.65"
            />
          ))}

          <path
            d={primaryFlow}
            stroke="url(#flowGradA)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 14"
            filter="url(#glowStrong)"
            className="agency-flow-dash"
          />
          <path
            d={secondaryFlow}
            stroke="url(#flowGradB)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 12"
            filter="url(#glowStrong)"
            className="agency-flow-dash-delay"
          />
          <path
            d={tertiaryFlow}
            stroke="url(#flowGradPay)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 10"
            filter="url(#glowStrong)"
            className="agency-flow-dash-slow"
          />

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
                  fontSize="10.5"
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
                  fontSize="8.5"
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                >
                  {n.sub}
                </text>
              </g>
            );
          })}

          <g fontFamily="ui-sans-serif,system-ui,sans-serif">
            <rect x="1440" y="330" width="120" height="28" rx="8" fill="#052e1a" stroke="#34d39944" />
            <text x="1500" y="348" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
              98.4% success
            </text>
            <rect x="1000" y="480" width="150" height="28" rx="8" fill="#1e1b4b" stroke="#6366f144" />
            <text x="1075" y="498" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="600">
              avg runtime ~2.3s
            </text>
          </g>
        </svg>
      </div>

      <p className="text-center text-xs text-slate-500 pb-5 px-4 max-w-3xl mx-auto">
        Production CRM automation: hot-lead fan-out, appointment booking before no-show
        checks, CRM stage &quot;Appointment Completed&quot; on show - and &quot;Won&quot; only after
        Stripe payment with receipt + audit note.
      </p>

      <style>{`
        .agency-flow-dash {
          animation: agencyFlow 2.4s linear infinite;
        }
        .agency-flow-dash-delay {
          animation: agencyFlow 3.1s linear infinite;
          animation-delay: 0.35s;
        }
        .agency-flow-dash-slow {
          animation: agencyFlow 3.8s linear infinite;
          animation-delay: 0.7s;
        }
        .agency-node-pulse {
          animation: agencyPulse 1.5s ease-in-out infinite;
        }
        .agency-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .agency-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.04);
        }
        .agency-scroll::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.45);
          border-radius: 6px;
        }
        @keyframes agencyFlow {
          to { stroke-dashoffset: -72; }
        }
        @keyframes agencyPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
