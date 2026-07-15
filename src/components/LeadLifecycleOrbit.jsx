import React from "react";

/**
 * Enterprise GoHighLevel lead lifecycle (~43 actions).
 * Stages: New · Working · Booked · Qualified · Closed Won · Closed Lost
 */
export default function LeadLifecycleOrbit({ className = "" }) {
  const link = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  };

  const C = {
    trigger: "#f59e0b",
    condition: "#a855f7",
    messaging: "#22d3ee",
    crm: "#34d399",
    integration: "#38bdf8",
    wait: "#f472b6",
    task: "#fbbf24",
  };

  const nodes = [
    // 1-5 triggers
    { id: "t1", label: "Form Submitted", sub: "Trigger", x: 95, y: 90, color: C.trigger, w: 128, kind: "trigger" },
    { id: "t2", label: "Facebook Lead Ad", sub: "Trigger", x: 95, y: 170, color: C.trigger, w: 136, kind: "trigger" },
    { id: "t3", label: "Website Chat Widget", sub: "Trigger", x: 95, y: 250, color: C.trigger, w: 148, kind: "trigger" },
    { id: "t4", label: "Incoming Webhook", sub: "Trigger", x: 95, y: 330, color: C.trigger, w: 136, kind: "trigger" },
    { id: "t5", label: "Stripe Payment", sub: "Trigger", x: 95, y: 500, color: C.trigger, w: 124, kind: "trigger" },

    // 6-9 processing
    { id: "p1", label: "Deduplicate Contact", sub: "Smart merge", x: 320, y: 150, color: C.integration, w: 140 },
    { id: "p2", label: "Validate Contact Info", sub: "Email · phone", x: 320, y: 250, color: C.integration, w: 142 },
    { id: "p3", label: "Map Custom Fields", sub: "Payload → CRM", x: 530, y: 150, color: C.integration, w: 138 },
    { id: "p4", label: "Apply Source Tags", sub: "UTM · channel", x: 530, y: 250, color: C.crm, w: 132 },

    // 10-13 existing contact
    { id: "d1", label: "Existing Contact?", sub: "If / Else", x: 740, y: 200, color: C.condition, w: 136 },
    { id: "y1", label: "Update Contact + Note", sub: "Merge · timeline", x: 970, y: 120, color: C.crm, w: 150 },
    { id: "n1", label: "Create Contact + Owner", sub: "Round-robin", x: 970, y: 280, color: C.crm, w: 154 },

    // 14-20 qualification
    { id: "d2", label: "Is Qualified?", sub: "If / Else", x: 1200, y: 200, color: C.condition, w: 118 },
    { id: "q1", label: "Create Opportunity", sub: "Deal record", x: 1420, y: 70, color: C.crm, w: 138 },
    { id: "q2", label: "Stage → New", sub: "Pipeline", x: 1420, y: 150, color: C.crm, w: 118 },
    { id: "q3", label: "Notify Sales (Slack)", sub: "Integration", x: 1420, y: 230, color: C.integration, w: 142 },
    { id: "q4", label: "Send Welcome SMS", sub: "A2P", x: 1640, y: 100, color: C.messaging, w: 136 },
    { id: "q5", label: "Send Welcome Email", sub: "Instant", x: 1640, y: 180, color: C.messaging, w: 140 },
    { id: "uq1", label: "Nurture Tag + Campaign", sub: "Long-term drip", x: 1420, y: 310, color: C.messaging, w: 156 },

    // 21-28 follow-up
    { id: "w10", label: "Wait 10 Minutes", sub: "Delay", x: 1860, y: 140, color: C.wait, w: 130 },
    { id: "d3", label: "No Reply?", sub: "Decision", x: 2060, y: 140, color: C.wait, w: 110 },
    { id: "f1", label: "Follow-up SMS + Email", sub: "Reminder pair", x: 2060, y: 50, color: C.messaging, w: 152 },
    { id: "w1d", label: "Wait 1 Day", sub: "Delay", x: 2260, y: 140, color: C.wait, w: 110 },
    { id: "d4", label: "Still No Reply?", sub: "Decision", x: 2460, y: 140, color: C.wait, w: 126 },
    { id: "f2", label: "Voicemail + Missed Call", sub: "SMS text-back", x: 2460, y: 50, color: C.messaging, w: 154 },
    { id: "f3", label: "Notify Assigned Rep", sub: "Task alert", x: 2680, y: 90, color: C.task, w: 140 },
    { id: "f4", label: "Wait 3d → Working", sub: "Cold path", x: 2680, y: 180, color: C.crm, w: 138 },

    // 29-36 appointment
    { id: "ap0", label: "Appointment Booked", sub: "Trigger", x: 320, y: 410, color: C.trigger, w: 148, kind: "trigger" },
    { id: "ap1", label: "Stage → Booked", sub: "Pipeline", x: 540, y: 410, color: C.crm, w: 128 },
    { id: "ap2", label: "Confirm Email + SMS", sub: "Calendar ping", x: 760, y: 410, color: C.messaging, w: 148 },
    { id: "ap3", label: "Reminder SMS (−24h)", sub: "Day-before wait", x: 990, y: 410, color: C.messaging, w: 150 },
    { id: "ap4", label: "Reminder SMS (−1h)", sub: "Same-day wait", x: 1220, y: 410, color: C.messaging, w: 142 },
    { id: "ap5", label: "Appointment Status", sub: "Decision", x: 1440, y: 410, color: C.wait, w: 140 },
    { id: "ap6", label: "Stage → Qualified", sub: "Done + notify + note", x: 1680, y: 360, color: C.crm, w: 154 },
    { id: "ap7", label: "No-Show Recovery", sub: "SMS · email · task", x: 1680, y: 460, color: C.messaging, w: 146 },
    { id: "ap8", label: "Wait 24h → Retry Book", sub: "Re-enter sequence", x: 1920, y: 460, color: C.wait, w: 154 },

    // 37-41 won
    { id: "win1", label: "Opportunity Won", sub: "Trigger", x: 320, y: 540, color: C.trigger, w: 132, kind: "trigger" },
    { id: "win2", label: "Stage → Closed Won", sub: "Pipeline", x: 540, y: 540, color: C.crm, w: 146 },
    { id: "win3", label: "Send Receipt", sub: "Stripe confirm", x: 320, y: 620, color: C.messaging, w: 124 },
    { id: "win4", label: "Note + Slack Notify", sub: "Wins channel", x: 540, y: 620, color: C.integration, w: 142 },
    { id: "win5", label: "Review + Onboarding", sub: "Google · workflow", x: 780, y: 580, color: C.condition, w: 148 },

    // 42-45 lost + dormant (combine to land ~43)
    { id: "lost1", label: "Opportunity Lost", sub: "Trigger", x: 1100, y: 540, color: C.trigger, w: 132, kind: "trigger" },
    { id: "lost2", label: "Stage → Closed Lost", sub: "Pipeline", x: 1320, y: 540, color: C.crm, w: 146 },
    { id: "lost3", label: "Wait 60d → Re-engage", sub: "Promo + notify rep", x: 1560, y: 540, color: C.wait, w: 156 },
    { id: "re0", label: "Inactive 60-90 Days", sub: "Schedule", x: 1100, y: 630, color: C.trigger, w: 148, kind: "trigger" },
    { id: "re1", label: "Email + SMS Re-engage", sub: "Personalized", x: 1340, y: 630, color: C.messaging, w: 154 },
    { id: "re2", label: "Stage → Working + Notify", sub: "Sales handoff", x: 1600, y: 630, color: C.crm, w: 168 },
  ];

  const triggerCount = nodes.filter((n) => n.kind === "trigger").length;
  const actionCount = nodes.filter((n) => n.kind !== "trigger").length;

  const edges = [
    link(159, 90, 250, 135),
    link(163, 170, 250, 175),
    link(169, 250, 250, 235),
    link(163, 330, 250, 270),
    link(390, 150, 461, 150),
    link(391, 250, 464, 250),
    link(599, 150, 672, 180),
    link(596, 250, 672, 220),
    link(808, 185, 895, 135),
    link(808, 215, 895, 265),
    link(1045, 120, 1140, 175),
    link(1047, 280, 1140, 225),
    link(1259, 185, 1351, 85),
    link(1259, 185, 1351, 150),
    link(1259, 200, 1351, 230),
    link(1489, 100, 1572, 100),
    link(1489, 180, 1572, 180),
    link(1710, 120, 1795, 130),
    link(1710, 180, 1795, 155),
    link(1925, 140, 2005, 140),
    link(2060, 110, 2060, 70),
    link(2136, 50, 2184, 50),
    link(2115, 140, 2205, 140),
    link(2315, 140, 2397, 140),
    link(2460, 110, 2460, 70),
    link(2537, 50, 2610, 75),
    link(2610, 115, 2610, 160),
    link(1259, 230, 1342, 295),
    // appointment
    link(394, 410, 476, 410),
    link(604, 410, 686, 410),
    link(834, 410, 915, 410),
    link(1065, 410, 1149, 410),
    link(1291, 410, 1370, 410),
    link(1510, 395, 1603, 375),
    link(1510, 425, 1607, 445),
    link(1753, 460, 1843, 460),
    // won
    link(157, 500, 250, 520),
    link(386, 540, 467, 540),
    link(250, 550, 250, 600),
    link(382, 620, 469, 620),
    link(611, 600, 706, 590),
    // lost + re
    link(1166, 540, 1247, 540),
    link(1393, 540, 1482, 540),
    link(1174, 630, 1263, 630),
    link(1417, 630, 1516, 630),
  ];

  const primaryFlow = edges.slice(0, 18).join(" ");
  const secondaryFlow = edges.slice(28, 38).join(" ");
  const tertiaryFlow = edges.slice(38).join(" ");
  const stagePills = ["New", "Working", "Booked", "Qualified", "Closed Won", "Closed Lost"];

  return (
    <div className={`rounded-3xl border border-white/10 bg-[#050510] overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)] pointer-events-none" />

      <div className="relative px-4 md:px-6 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
            Live Preview · Enterprise GHL Ops
          </p>
          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Full Lead Lifecycle Automation
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            5 entry triggers → hygiene → qualify → welcome + no-reply chase → appointment
            reminders → Closed Won onboarding · Closed Lost &amp; dormant re-engage
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Automation Running
          </span>
          <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {actionCount} Workflow Actions
          </span>
          <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {triggerCount} Triggers
          </span>
          <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            7 Parallel Branches
          </span>
          <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            99.4% Success Rate
          </span>
          <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Avg Runtime 2.8s
          </span>
        </div>
      </div>

      <div className="relative px-4 md:px-6 pb-2 flex flex-wrap gap-3 text-[10px] md:text-xs text-slate-400">
        {[
          { c: C.trigger, t: "Triggers" },
          { c: C.condition, t: "Conditions" },
          { c: C.messaging, t: "Messaging" },
          { c: C.crm, t: "CRM" },
          { c: C.integration, t: "Integrations" },
          { c: C.wait, t: "Waits & Decisions" },
          { c: C.task, t: "Tasks" },
        ].map((l) => (
          <span key={l.t} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: l.c }} />
            {l.t}
          </span>
        ))}
      </div>

      <div className="relative px-4 md:px-6 pb-3 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mr-1">Pipeline</span>
        {stagePills.map((s) => (
          <span key={s} className="text-[10px] md:text-xs px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
            {s}
          </span>
        ))}
      </div>

      <div className="relative w-full overflow-x-auto agency-scroll">
        <svg viewBox="0 0 2820 700" className="w-full min-w-[1300px] h-auto" role="img" aria-label="Full lead lifecycle CRM automation">
          <defs>
            <linearGradient id="lifeGradA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="lifeGradB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="lifeGradC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.75" />
            </linearGradient>
            <filter id="lifeGlow">
              <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="lifeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.35" opacity="0.3" />
            </pattern>
          </defs>

          <rect width="2820" height="700" fill="url(#lifeGrid)" opacity="0.4" />
          <line x1="40" y1="370" x2="2780" y2="370" stroke="#334155" strokeWidth="1" strokeDasharray="6 10" opacity="0.35" />
          <line x1="40" y1="510" x2="1000" y2="510" stroke="#334155" strokeWidth="1" strokeDasharray="6 10" opacity="0.35" />

          <g fontFamily="ui-sans-serif,system-ui,sans-serif" opacity="0.55" fontSize="9" fontWeight="600" fill="#94a3b8">
            <text x="40" y="45">ENTRY · PROCESS · QUALIFY · FOLLOW-UP</text>
            <text x="40" y="390">APPOINTMENT RAIL</text>
            <text x="40" y="525">WON</text>
            <text x="1100" y="525">LOST + DORMANT RE-ENGAGE</text>
          </g>

          {edges.map((d, i) => (
            <path key={`e${i}`} d={d} stroke="#1e1b4b" strokeWidth="1.8" fill="none" opacity="0.65" />
          ))}
          <path d={primaryFlow} stroke="url(#lifeGradA)" strokeWidth="2.8" fill="none" strokeDasharray="10 14" filter="url(#lifeGlow)" className="agency-flow-dash" />
          <path d={secondaryFlow} stroke="url(#lifeGradB)" strokeWidth="2.4" fill="none" strokeDasharray="8 12" filter="url(#lifeGlow)" className="agency-flow-dash-delay" />
          <path d={tertiaryFlow} stroke="url(#lifeGradC)" strokeWidth="2.4" fill="none" strokeDasharray="6 10" filter="url(#lifeGlow)" className="agency-flow-dash-slow" />

          {[
            { x: 830, y: 155, t: "yes", c: "#34d399" },
            { x: 830, y: 255, t: "no", c: "#f87171" },
            { x: 1265, y: 165, t: "qualified", c: "#34d399" },
            { x: 1265, y: 265, t: "nurture", c: "#f87171" },
            { x: 2090, y: 105, t: "no reply", c: "#f472b6" },
            { x: 1520, y: 380, t: "completed", c: "#34d399" },
            { x: 1520, y: 450, t: "no-show", c: "#f472b6" },
          ].map((l) => (
            <text key={`${l.t}${l.x}`} x={l.x} y={l.y} fill={l.c} fontSize="9" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">{l.t}</text>
          ))}

          {nodes.map((n, i) => {
            const half = n.w / 2;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect x={-half} y="-26" width={n.w} height="52" rx="10" fill="#0a0a14" stroke={n.color} strokeWidth="1.5" opacity="0.97" />
                <rect x={-half} y="-26" width="4" height="52" rx="2" fill={n.color} opacity="0.9" />
                <circle cx={-half + 14} cy="-7" r="3" fill={n.color} className="agency-node-pulse" style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
                <text x={3} y="-4" textAnchor="middle" fill="#f1f5f9" fontSize="9.5" fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">{n.label}</text>
                <text x={3} y="11" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="ui-sans-serif,system-ui,sans-serif">{n.sub}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-center text-xs text-slate-500 pb-5 px-4 max-w-4xl mx-auto">
        {actionCount} workflow actions (+ {triggerCount} triggers): multi-channel intake, contact hygiene,
        qualification fan-out, timed no-reply chase, appointment confirmations &amp; reminders, no-show
        retry, Closed Won receipt + review + onboarding, Closed Lost 60-day revive, and 60-90 day
        dormant re-engage. Pipeline stages only: New · Working · Booked · Qualified · Closed Won ·
        Closed Lost.
      </p>
    </div>
  );
}
