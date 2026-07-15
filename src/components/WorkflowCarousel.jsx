import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Zap,
  GitBranch,
  Mail,
  MessageSquare,
  Clock,
  Webhook,
  Database,
  Bell,
  Settings2,
  Workflow,
  CheckCircle2,
  Plus,
  Minus,
  Maximize2,
} from "lucide-react";

/**
 * GHL / n8n-style node graph data.
 * type: trigger | condition | action | wait | email | sms | webhook | crm | notify
 * branched slides: trunk (pre-condition) → condition → yes/no/side → merge tail
 */
export const WORKFLOW_SLIDES = [
  {
    title: "Built onboarding workflows",
    accent: "#22c55e",
    nodes: [
      { label: "Payment Received / Tag: Client", type: "trigger" },
      { label: "Dedupe Contact Fields", type: "action" },
      { label: "Move Pipeline → Onboarding", type: "crm" },
      { label: "Remove Lead Tags", type: "crm" },
      { label: "Welcome SMS", type: "sms" },
      { label: "Welcome Email + Portal Link", type: "email" },
      { label: "Wait 1 Day", type: "wait" },
      { label: "Kickoff Call Booking Link", type: "email" },
      { label: "Create CSM Checklist Tasks", type: "action" },
      { label: "Assign Account Manager", type: "action" },
      { label: "Wait 3 Days", type: "wait" },
      { label: "Kickoff Status Check", type: "action" },
      { label: "Prep Call Packet Email", type: "email" },
      { label: "Slack #onboarding", type: "notify" },
      { label: "Add Goal: Onboarded", type: "crm" },
      { label: "Start Success Sequence", type: "webhook" },
    ],
  },
  {
    title: "Lead nurturing campaigns",
    accent: "#a855f7",
    branched: true,
    nodes: [
      { label: "Form / Funnel Opt-In", type: "trigger" },
      { label: "Create Opportunity", type: "crm" },
      { label: "Tag: Nurture Active", type: "crm" },
      { label: "Wait 30 Min", type: "wait" },
      { label: "Value Email #1", type: "email" },
      { label: "Wait 2 Days", type: "wait" },
      { label: "Value Email #2", type: "email" },
      { label: "If Opened or Clicked?", type: "condition" },
      { label: "Case Study Email", type: "email", branch: "yes" },
      { label: "Wait 1 Day", type: "wait", branch: "yes" },
      { label: "Book Call CTA Email", type: "email", branch: "yes" },
      { label: "SMS Booking Nudge", type: "sms", branch: "yes" },
      { label: "Assign Hot Owner", type: "action", branch: "yes" },
      { label: "Slack #sales Hot Lead", type: "notify", branch: "yes" },
      { label: "Wait 2 Days", type: "wait", branch: "no" },
      { label: "Re-engage SMS", type: "sms", branch: "no" },
      { label: "Soft CTA Email #3", type: "email", branch: "no" },
      { label: "Wait 4 Days", type: "wait", branch: "no" },
      { label: "Last Chance Offer", type: "email", branch: "no" },
      { label: "Tag: Cold Nurture", type: "crm", branch: "no" },
      { label: "Update Lead Score", type: "crm" },
      { label: "Queue Follow-up Task", type: "action" },
    ],
  },
  {
    title: "Appointment reminders",
    accent: "#3b82f6",
    nodes: [
      { label: "Appointment Booked", type: "trigger" },
      { label: "Write Appt Custom Fields", type: "crm" },
      { label: "Immediate Confirm Email", type: "email" },
      { label: "Immediate Confirm SMS", type: "sms" },
      { label: "Add Calendar ICS Hook", type: "webhook" },
      { label: "Wait Until -48h", type: "wait" },
      { label: "Prep Tips Email", type: "email" },
      { label: "Wait Until -24h", type: "wait" },
      { label: "SMS Reminder -24h", type: "sms" },
      { label: "Wait Until -2h", type: "wait" },
      { label: "Email Reminder -2h", type: "email" },
      { label: "Wait Until -30m", type: "wait" },
      { label: "SMS Final Ping", type: "sms" },
      { label: "Tag: Reminded Fully", type: "crm" },
      { label: "Notify Assigned Rep", type: "notify" },
    ],
  },
  {
    title: "Webinar automations",
    accent: "#ec4899",
    branched: true,
    nodes: [
      { label: "Webinar Registration", type: "trigger" },
      { label: "Tag: Webinar Registrant", type: "crm" },
      { label: "Confirm Email + Zoom", type: "email" },
      { label: "Confirm SMS", type: "sms" },
      { label: "Add to Webinar Pipeline", type: "crm" },
      { label: "Wait Until -24h", type: "wait" },
      { label: "T-24h Reminder Email", type: "email" },
      { label: "Wait Until -1h", type: "wait" },
      { label: "T-1h SMS Join Link", type: "sms" },
      { label: "Wait Until Event End", type: "wait" },
      { label: "If Attended Live?", type: "condition" },
      { label: "Thank You + Replay", type: "email", branch: "yes" },
      { label: "Wait 1 Day", type: "wait", branch: "yes" },
      { label: "Offer / Booking CTA", type: "email", branch: "yes" },
      { label: "Tag: Webinar Attendee", type: "crm", branch: "yes" },
      { label: "Move Stage → Hot", type: "crm", branch: "yes" },
      { label: "Missed Event SMS", type: "sms", branch: "no" },
      { label: "Replay Email", type: "email", branch: "no" },
      { label: "Wait 2 Days", type: "wait", branch: "no" },
      { label: "Re-invite Next Session", type: "email", branch: "no" },
      { label: "Tag: Webinar Missed", type: "crm", branch: "no" },
      { label: "Sync Attendance Field", type: "crm" },
      { label: "Slack #webinar Report", type: "notify" },
    ],
  },
  {
    title: "No-show follow-up",
    accent: "#f43f5e",
    branched: true,
    nodes: [
      { label: "Appt Status → No-Show", type: "trigger" },
      { label: "Tag: No-Show", type: "crm" },
      { label: "Clear Reminder Tags", type: "crm" },
      { label: "Wait 15 Min", type: "wait" },
      { label: "Immediate Rebook SMS", type: "sms" },
      { label: "Wait 2 Hours", type: "wait" },
      { label: "If Rebooked?", type: "condition" },
      { label: "Confirm New Appt SMS", type: "sms", branch: "yes" },
      { label: "Confirm New Appt Email", type: "email", branch: "yes" },
      { label: "Move Stage → Booked", type: "crm", branch: "yes" },
      { label: "Notify Rep Recovered", type: "notify", branch: "yes" },
      { label: "Rescue Email Sequence", type: "email", branch: "no" },
      { label: "Wait 1 Day", type: "wait", branch: "no" },
      { label: "Second Chance SMS", type: "sms", branch: "no" },
      { label: "Create Sales Rescue Task", type: "action", branch: "no" },
      { label: "Slack #ops No-Show", type: "notify", branch: "no" },
      { label: "Move Stage → Lost Risk", type: "crm", branch: "no" },
      { label: "Update Opportunity Note", type: "crm" },
      { label: "Increment No-Show Count", type: "action" },
    ],
  },
  {
    title: "Customer reactivation",
    accent: "#eab308",
    branched: true,
    nodes: [
      { label: "Inactive 30+ Days Filter", type: "trigger" },
      { label: "Tag: Winback Wave", type: "crm" },
      { label: "Win-back Email #1", type: "email" },
      { label: "Wait 3 Days", type: "wait" },
      { label: "If Opened / Replied?", type: "condition" },
      { label: "Personal Check-in SMS", type: "sms", branch: "yes" },
      { label: "Book Call Offer Email", type: "email", branch: "yes" },
      { label: "Assign Account Mgr", type: "action", branch: "yes" },
      { label: "Move Stage → Warm", type: "crm", branch: "yes" },
      { label: "Slack #retention", type: "notify", branch: "yes" },
      { label: "SMS Discount Code", type: "sms", branch: "no" },
      { label: "Wait 2 Days", type: "wait", branch: "no" },
      { label: "Win-back Email #2", type: "email", branch: "no" },
      { label: "Wait 5 Days", type: "wait", branch: "no" },
      { label: "Final Offer Email", type: "email", branch: "no" },
      { label: "Tag: Dormant", type: "crm", branch: "no" },
      { label: "Pause Marketing Sends", type: "action", branch: "no" },
      { label: "Log Winback Outcome", type: "crm" },
      { label: "Notify Account Manager", type: "notify" },
    ],
  },
  {
    title: "Payment notification workflows",
    accent: "#10b981",
    nodes: [
      { label: "Stripe checkout.session.completed", type: "trigger" },
      { label: "Verify Webhook Signature", type: "webhook" },
      { label: "Upsert Contact by Email", type: "crm" },
      { label: "Write Amount / Product Fields", type: "crm" },
      { label: "Move Pipeline → Closed Won", type: "crm" },
      { label: "Remove Cart / Abandoned Tags", type: "crm" },
      { label: "Customer Receipt Email", type: "email" },
      { label: "Customer Receipt SMS", type: "sms" },
      { label: "Internal Finance Email", type: "email" },
      { label: "Slack #finance Paid", type: "notify" },
      { label: "Create Fulfillment Task", type: "action" },
      { label: "Add Tag: Client", type: "action" },
      { label: "Wait 5 Min", type: "wait" },
      { label: "Fire Onboarding Workflow", type: "webhook" },
      { label: "Sync Stripe Invoice ID", type: "crm" },
      { label: "Log Payment Timeline Note", type: "crm" },
    ],
  },
  {
    title: "Internal notification systems",
    accent: "#22c55e",
    branched: true,
    nodes: [
      { label: "Pipeline Stage Changed", type: "trigger" },
      { label: "Capture Old → New Stage", type: "crm" },
      { label: "Route by Stage Intent", type: "condition" },
      { label: "Slack #sales Booked", type: "notify", branch: "yes" },
      { label: "Email Account Manager", type: "email", branch: "yes" },
      { label: "Create Call Prep Task", type: "action", branch: "yes" },
      { label: "Calendar Block Hook", type: "webhook", branch: "yes" },
      { label: "SMS Owner Reminder", type: "sms", branch: "yes" },
      { label: "Quiet Stage Log Note", type: "crm", branch: "no" },
      { label: "Owner Digest Email", type: "email", branch: "no" },
      { label: "Slack #wins Closed Won", type: "notify", branch: "side" },
      { label: "Finance Alert Email", type: "email", branch: "side" },
      { label: "Kick Fulfillment Task", type: "action", branch: "side" },
      { label: "Write Audit Timeline", type: "crm" },
      { label: "Update Dashboard Counter", type: "action" },
    ],
  },
  {
    title: "Conditional multi-branch workflows",
    accent: "#818cf8",
    branched: true,
    nodes: [
      { label: "Inbound Lead / Webhook", type: "trigger" },
      { label: "Normalize Phone + Email", type: "action" },
      { label: "Create / Merge Contact", type: "crm" },
      { label: "If Source = Paid Ads?", type: "condition" },
      { label: "Instant SMS Reply <60s", type: "sms", branch: "yes" },
      { label: "Tag: Hot / Paid", type: "crm", branch: "yes" },
      { label: "Score +30 Lead Points", type: "action", branch: "yes" },
      { label: "Assign Senior Closer", type: "action", branch: "yes" },
      { label: "Slack #paid-leads", type: "notify", branch: "yes" },
      { label: "Book Link Email", type: "email", branch: "yes" },
      { label: "Nurture Email #1", type: "email", branch: "no" },
      { label: "Tag: Organic / SEO", type: "crm", branch: "no" },
      { label: "Score +10 Lead Points", type: "action", branch: "no" },
      { label: "Queue Standard SDR", type: "action", branch: "no" },
      { label: "Wait 1 Day", type: "wait", branch: "no" },
      { label: "Value Email #2", type: "email", branch: "no" },
      { label: "VIP Referral Path", type: "webhook", branch: "side" },
      { label: "Tag: Referral VIP", type: "crm", branch: "side" },
      { label: "Assign Founder / AM", type: "action", branch: "side" },
      { label: "Create Opportunity", type: "crm" },
      { label: "Set Pipeline Stage: New", type: "crm" },
      { label: "Start Source Attribution Note", type: "action" },
    ],
  },
  {
    title: "Task automation",
    accent: "#38bdf8",
    branched: true,
    nodes: [
      { label: "Stage → Qualified", type: "trigger" },
      { label: "Generate Call Script Task", type: "action" },
      { label: "Generate Discovery Checklist", type: "action" },
      { label: "Assign Pipeline Owner", type: "action" },
      { label: "Due Date = +48h", type: "wait" },
      { label: "If Tasks Complete?", type: "condition" },
      { label: "Advance → Proposal Sent", type: "crm", branch: "yes" },
      { label: "Email Owner Congrats", type: "email", branch: "yes" },
      { label: "Create Proposal Task", type: "action", branch: "yes" },
      { label: "Escalate to Manager", type: "notify", branch: "no" },
      { label: "SMS Nudge Owner", type: "sms", branch: "no" },
      { label: "Reassign Backup Rep", type: "action", branch: "no" },
      { label: "Extend Due +24h", type: "wait", branch: "no" },
      { label: "Log SLA Outcome", type: "crm" },
      { label: "Update Task Metrics", type: "action" },
    ],
  },
  {
    title: "Workflow troubleshooting",
    accent: "#f97316",
    branched: true,
    nodes: [
      { label: "Workflow Error Event", type: "trigger" },
      { label: "Capture Payload + Trace ID", type: "webhook" },
      { label: "Snapshot Contact State", type: "crm" },
      { label: "Auto-Retry Attempt 1", type: "action" },
      { label: "Wait 2 Min", type: "wait" },
      { label: "If Still Failing?", type: "condition" },
      { label: "Auto-Retry Attempt 2", type: "action", branch: "yes" },
      { label: "Validate Required Fields", type: "action", branch: "yes" },
      { label: "Alert Engineer Slack", type: "notify", branch: "yes" },
      { label: "Pause Faulty Branch", type: "action", branch: "yes" },
      { label: "Create Fix Ticket", type: "action", branch: "yes" },
      { label: "Mark Recovered", type: "crm", branch: "no" },
      { label: "Resume Enrollment", type: "action", branch: "no" },
      { label: "Notify Ops Recovered", type: "notify", branch: "no" },
      { label: "Write Root Cause Note", type: "crm" },
      { label: "Append Error Dashboard", type: "webhook" },
    ],
  },
  {
    title: "Workflow optimization",
    accent: "#14b8a6",
    nodes: [
      { label: "Weekly Analytics Cron", type: "trigger" },
      { label: "Export Workflow Metrics", type: "webhook" },
      { label: "Find Slow Wait Steps", type: "action" },
      { label: "Detect Duplicate Branches", type: "action" },
      { label: "Flag Unused Tags/Filters", type: "crm" },
      { label: "Consolidate Overlapping Waits", type: "wait" },
      { label: "Tighten Entry Conditions", type: "action" },
      { label: "Add Missing Goal Events", type: "crm" },
      { label: "Split Test Winning Path", type: "action" },
      { label: "Promote Winning Path", type: "action" },
      { label: "Archive Dead Steps", type: "action" },
      { label: "Publish Optimized v2", type: "action" },
      { label: "Notify Team Changelog", type: "notify" },
      { label: "Log Optimization Report", type: "email" },
    ],
  },
  {
    title: "Automation testing",
    accent: "#a78bfa",
    branched: true,
    nodes: [
      { label: "Create Draft Test Contact", type: "trigger" },
      { label: "Clone Workflow → Test Mode", type: "action" },
      { label: "Force Enter Test Path", type: "action" },
      { label: "Assert Tags Applied", type: "crm" },
      { label: "Assert SMS / Email Queued", type: "email" },
      { label: "Assert Wait Timers Valid", type: "wait" },
      { label: "Assert Webhook Payload", type: "webhook" },
      { label: "All Assertions Pass?", type: "condition" },
      { label: "Assert Pipeline Stage", type: "crm", branch: "yes" },
      { label: "Clear Test Data", type: "action", branch: "yes" },
      { label: "Pass → Enable Live", type: "notify", branch: "yes" },
      { label: "Capture Failure Diff", type: "action", branch: "no" },
      { label: "Fail → Block Publish", type: "notify", branch: "no" },
      { label: "Slack QA Channel", type: "notify", branch: "no" },
      { label: "Write Test Report Note", type: "crm" },
    ],
  },
];

const TYPE_META = {
  trigger: { icon: Zap, color: "#22c55e", bg: "#14532d", label: "Trigger" },
  condition: { icon: GitBranch, color: "#a855f7", bg: "#3b0764", label: "Condition" },
  action: { icon: Settings2, color: "#3b82f6", bg: "#1e3a8a", label: "Action" },
  wait: { icon: Clock, color: "#f59e0b", bg: "#78350f", label: "Wait" },
  email: { icon: Mail, color: "#8b5cf6", bg: "#2e1065", label: "Email" },
  sms: { icon: MessageSquare, color: "#06b6d4", bg: "#164e63", label: "SMS" },
  webhook: { icon: Webhook, color: "#f97316", bg: "#7c2d12", label: "Webhook" },
  crm: { icon: Database, color: "#10b981", bg: "#064e3b", label: "CRM" },
  notify: { icon: Bell, color: "#f43f5e", bg: "#881337", label: "Notify" },
};

function nodeMeta(type) {
  return TYPE_META[type] || TYPE_META.action;
}

const CARD_HALF = 28;
const LINEAR_STEP = 118; // centers; leaves ~62px gap for connectors
const BRANCH_STEP = 110; // centers; leaves ~54px gap for connectors

/** Vertical GHL-style canvas for linear flows */
function GhlLinearCanvas({ nodes, animateKey }) {
  const height = Math.max(360, nodes.length * LINEAR_STEP + 48);
  const padX = 80;
  const padY = 40;
  const vbW = 360 + padX * 2;
  const vbH = height + padY * 2;

  return (
    <div className="relative w-full">
      <svg
        key={animateKey}
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto mx-auto opacity-95 min-w-[280px]"
        role="img"
        aria-label="GoHighLevel style workflow canvas"
      >
        <defs>
          <pattern id="ghlDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#64748b" opacity="0.35" />
          </pattern>
          <linearGradient id="ghlWire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
          </linearGradient>
          <filter id="ghlGlow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={vbW} height={vbH} fill="#111827" />
        <rect width={vbW} height={vbH} fill="url(#ghlDots)" />

        <g transform={`translate(${padX}, ${padY})`}>
        {/* Connector rails + animated packet */}
        {nodes.slice(0, -1).map((_, i) => {
          const y1 = 56 + i * LINEAR_STEP + CARD_HALF;
          const y2 = 56 + (i + 1) * LINEAR_STEP - CARD_HALF;
          return (
            <g key={`wire-${i}`}>
              <line x1="180" y1={y1} x2="180" y2={y2} stroke="#64748b" strokeWidth="2.5" />
              <line
                x1="180"
                y1={y1}
                x2="180"
                y2={y2}
                stroke="url(#ghlWire)"
                strokeWidth="3"
                strokeDasharray="6 10"
                filter="url(#ghlGlow)"
                className="ghl-packet"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            </g>
          );
        })}

        {nodes.map((n, i) => {
          const meta = nodeMeta(n.type);
          const y = 56 + i * LINEAR_STEP;
          const isTrigger = n.type === "trigger";
          return (
            <g key={`${animateKey}-${i}`} className="ghl-node" style={{ animationDelay: `${i * 70}ms` }}>
              <rect
                x="70"
                y={y - CARD_HALF}
                width="220"
                height="56"
                rx={isTrigger ? 28 : 10}
                fill={isTrigger ? meta.bg : "#1f2937"}
                stroke={meta.color}
                strokeWidth={isTrigger ? 2 : 1.4}
              />
              {!isTrigger && (
                <rect x="70" y={y - CARD_HALF} width="5" height="56" rx="2" fill={meta.color} />
              )}
              {i > 0 && (
                <circle cx="180" cy={y - CARD_HALF} r="4" fill="#111827" stroke={meta.color} strokeWidth="1.5" />
              )}
              {i < nodes.length - 1 && (
                <circle cx="180" cy={y + CARD_HALF} r="4" fill="#111827" stroke="#60a5fa" strokeWidth="1.5" />
              )}
              <rect
                x="84"
                y={y - 14}
                width="28"
                height="28"
                rx="7"
                fill={meta.bg}
                stroke={meta.color}
                strokeWidth="1"
              />
              <text
                x="180"
                y={y + 1}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="12"
                fontFamily="ui-sans-serif,system-ui,sans-serif"
                fontWeight="600"
              >
                {n.label.length > 26 ? `${n.label.slice(0, 24)}…` : n.label}
              </text>
              <text
                x="180"
                y={y + 16}
                textAnchor="middle"
                fill={meta.color}
                fontSize="8"
                fontFamily="ui-sans-serif,system-ui,sans-serif"
                fontWeight="500"
              >
                {meta.label}
              </text>
            </g>
          );
        })}
        </g>
      </svg>
    </div>
  );
}

/** Branched canvas - trunk → condition → Yes / No / Side → merge tail */
function GhlBranchCanvas({ nodes, animateKey }) {
  const conditionIndex = Math.max(
    0,
    nodes.findIndex((n) => n.type === "condition" && !n.branch)
  );
  const trunk = nodes.slice(0, conditionIndex + 1).filter((n) => !n.branch);
  const yesNodes = nodes.filter((n) => n.branch === "yes");
  const noNodes = nodes.filter((n) => n.branch === "no");
  const sideNodes = nodes.filter((n) => n.branch === "side");
  const mergeTail = nodes.filter(
    (n, i) => i > conditionIndex && !n.branch
  );

  const step = BRANCH_STEP;
  const trunkStart = 40;
  const forkGap = 72; // space from condition bottom → first branch tops
  const mergeGap = 72;

  const yesCx = 120;
  const noCx = 440;
  const sideCx = 280;
  const trunkCx = 280;

  const trunkYs = trunk.map((_, i) => trunkStart + i * step);
  const lastTrunkY = trunkYs[trunkYs.length - 1] ?? trunkStart;
  const conditionBottom = lastTrunkY + CARD_HALF;

  const branchTop = conditionBottom + forkGap + CARD_HALF;
  const yesYs = yesNodes.map((_, i) => branchTop + i * step);
  const noYs = noNodes.map((_, i) => branchTop + i * step);
  const sideYs = sideNodes.map((_, i) => branchTop + i * step);

  const branchBottoms = [
    yesYs.length ? yesYs[yesYs.length - 1] + CARD_HALF : null,
    noYs.length ? noYs[noYs.length - 1] + CARD_HALF : null,
    sideYs.length ? sideYs[sideYs.length - 1] + CARD_HALF : null,
  ].filter((v) => v != null);
  const lastBranchBottom = branchBottoms.length
    ? Math.max(...branchBottoms)
    : conditionBottom;

  const mergeTop = mergeTail.length
    ? lastBranchBottom + mergeGap + CARD_HALF
    : lastBranchBottom + mergeGap;
  const mergeYs = mergeTail.map((_, i) => mergeTop + i * step);

  const height =
    (mergeYs.length
      ? mergeYs[mergeYs.length - 1] + CARD_HALF
      : lastBranchBottom) + 48;
  const padX = 40;
  const padY = 28;
  const vbW = 560 + padX * 2;
  const vbH = height + padY * 2;

  const hubY = conditionBottom + forkGap * 0.42;
  const mergeHubY = mergeTail.length
    ? mergeYs[0] - CARD_HALF - mergeGap * 0.42
    : lastBranchBottom + mergeGap * 0.5;

  const Wire = ({ d, animated }) => (
    <>
      <path d={d} stroke="#64748b" strokeWidth="2.5" fill="none" />
      {animated && (
        <path
          d={d}
          stroke="url(#branchWire)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5 8"
          className="ghl-packet"
        />
      )}
    </>
  );

  return (
    <div className="relative w-full">
      <svg
        key={animateKey}
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto mx-auto opacity-95 min-w-[320px]"
        role="img"
        aria-label="Branched workflow canvas"
      >
        <defs>
          <pattern id="ghlDots2" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#64748b" opacity="0.35" />
          </pattern>
          <linearGradient id="branchWire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={vbW} height={vbH} fill="#111827" />
        <rect width={vbW} height={vbH} fill="url(#ghlDots2)" />

        <g transform={`translate(${padX}, ${padY})`}>
          {/* Trunk connectors */}
          {trunkYs.slice(1).map((y, i) => {
            const prev = trunkYs[i];
            const d = `M${trunkCx} ${prev + CARD_HALF} L${trunkCx} ${y - CARD_HALF}`;
            return (
              <g key={`tw-${i}`}>
                <Wire d={d} animated />
              </g>
            );
          })}

          {/* Fork from condition to each branch top port */}
          {yesYs.length > 0 && (
            <Wire
              d={`M${trunkCx} ${conditionBottom} L${trunkCx} ${hubY} L${yesCx} ${hubY} L${yesCx} ${yesYs[0] - CARD_HALF}`}
              animated
            />
          )}
          {noYs.length > 0 && (
            <Wire
              d={`M${trunkCx} ${conditionBottom} L${trunkCx} ${hubY} L${noCx} ${hubY} L${noCx} ${noYs[0] - CARD_HALF}`}
              animated
            />
          )}
          {sideYs.length > 0 && (
            <Wire
              d={`M${trunkCx} ${conditionBottom} L${trunkCx} ${sideYs[0] - CARD_HALF}`}
              animated
            />
          )}

          {/* Labels near fork */}
          {yesYs.length > 0 && (
            <text x={yesCx - 18} y={hubY - 8} fill="#22c55e" fontSize="10" fontFamily="system-ui" fontWeight="700">
              Yes
            </text>
          )}
          {noYs.length > 0 && (
            <text x={noCx - 10} y={hubY - 8} fill="#f43f5e" fontSize="10" fontFamily="system-ui" fontWeight="700">
              No
            </text>
          )}
          {sideYs.length > 0 && (
            <text x={sideCx + 10} y={hubY - 8} fill="#38bdf8" fontSize="10" fontFamily="system-ui" fontWeight="700">
              Alt
            </text>
          )}

          {/* Column internal wires */}
          {yesYs.slice(1).map((y, i) => (
            <Wire
              key={`yw-${i}`}
              d={`M${yesCx} ${yesYs[i] + CARD_HALF} L${yesCx} ${y - CARD_HALF}`}
            />
          ))}
          {noYs.slice(1).map((y, i) => (
            <Wire
              key={`nw-${i}`}
              d={`M${noCx} ${noYs[i] + CARD_HALF} L${noCx} ${y - CARD_HALF}`}
            />
          ))}
          {sideYs.slice(1).map((y, i) => (
            <Wire
              key={`sw-${i}`}
              d={`M${sideCx} ${sideYs[i] + CARD_HALF} L${sideCx} ${y - CARD_HALF}`}
            />
          ))}

          {/* Merge into tail */}
          {mergeTail.length > 0 && (
            <>
              {yesYs.length > 0 && (
                <Wire
                  d={`M${yesCx} ${yesYs[yesYs.length - 1] + CARD_HALF} L${yesCx} ${mergeHubY} L${trunkCx} ${mergeHubY} L${trunkCx} ${mergeYs[0] - CARD_HALF}`}
                  animated
                />
              )}
              {noYs.length > 0 && (
                <Wire
                  d={`M${noCx} ${noYs[noYs.length - 1] + CARD_HALF} L${noCx} ${mergeHubY} L${trunkCx} ${mergeHubY} L${trunkCx} ${mergeYs[0] - CARD_HALF}`}
                  animated
                />
              )}
              {sideYs.length > 0 && (
                <Wire
                  d={`M${sideCx} ${sideYs[sideYs.length - 1] + CARD_HALF} L${trunkCx} ${mergeYs[0] - CARD_HALF}`}
                  animated
                />
              )}
              {mergeYs.slice(1).map((y, i) => (
                <Wire
                  key={`mw-${i}`}
                  d={`M${trunkCx} ${mergeYs[i] + CARD_HALF} L${trunkCx} ${y - CARD_HALF}`}
                  animated
                />
              ))}
            </>
          )}

          {/* Nodes (drawn after wires so cards sit on top) */}
          {trunk.map((n, i) => (
            <WorkflowCardSvg key={`t-${i}`} x={trunkCx - 110} y={trunkYs[i]} node={n} wide={220} />
          ))}
          {yesNodes.map((n, i) => (
            <WorkflowCardSvg key={`y-${i}`} x={yesCx - 90} y={yesYs[i]} node={n} wide={180} />
          ))}
          {noNodes.map((n, i) => (
            <WorkflowCardSvg key={`n-${i}`} x={noCx - 90} y={noYs[i]} node={n} wide={180} />
          ))}
          {sideNodes.map((n, i) => (
            <WorkflowCardSvg key={`s-${i}`} x={sideCx - 90} y={sideYs[i]} node={n} wide={180} />
          ))}
          {mergeTail.map((n, i) => (
            <WorkflowCardSvg key={`m-${i}`} x={trunkCx - 110} y={mergeYs[i]} node={n} wide={220} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function WorkflowCardSvg({ x, y, node, wide = 200 }) {
  const meta = nodeMeta(node.type);
  const isTrigger = node.type === "trigger";
  const cx = x + wide / 2;
  return (
    <g className="ghl-node">
      <rect
        x={x}
        y={y - CARD_HALF}
        width={wide}
        height="56"
        rx={isTrigger ? 28 : 10}
        fill={isTrigger ? meta.bg : "#1f2937"}
        stroke={meta.color}
        strokeWidth={isTrigger ? 2 : 1.4}
      />
      {!isTrigger && <rect x={x} y={y - CARD_HALF} width="5" height="56" rx="2" fill={meta.color} />}
      <circle cx={cx} cy={y - CARD_HALF} r="3.5" fill="#111827" stroke={meta.color} strokeWidth="1.4" />
      <circle cx={cx} cy={y + CARD_HALF} r="3.5" fill="#111827" stroke="#60a5fa" strokeWidth="1.4" />
      <text
        x={cx}
        y={y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="11"
        fontFamily="ui-sans-serif,system-ui,sans-serif"
        fontWeight="600"
      >
        {node.label.length > 26 ? `${node.label.slice(0, 24)}…` : node.label}
      </text>
      <text
        x={cx}
        y={y + 14}
        textAnchor="middle"
        fill={meta.color}
        fontSize="8"
        fontFamily="ui-sans-serif,system-ui,sans-serif"
      >
        {meta.label}
      </text>
    </g>
  );
}

function WorkflowBuilderChrome({
  title,
  children,
  accent,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0b1220] shadow-2xl shadow-black/40">
      {/* Top bar - like GHL / n8n editor */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-700/80 bg-[#111827]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Workflow className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-[11px] md:text-xs text-slate-300 truncate font-medium">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border"
            style={{
              color: accent,
              borderColor: `${accent}55`,
              background: `${accent}18`,
            }}
          >
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
          <span className="hidden sm:inline text-[10px] text-slate-500 tabular-nums w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomOut}
            className="p-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Zoom out"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="p-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Zoom in"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onZoomReset}
            className="p-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Left tool rail */}
      <div className="flex min-h-[280px] sm:min-h-[360px] md:min-h-[480px]">
        <div className="hidden md:flex w-11 flex-col items-center gap-2 py-3 border-r border-slate-700/80 bg-[#0f172a]">
          {[Zap, GitBranch, Mail, MessageSquare, Webhook, Database, Bell].map((Icon, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-md bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400"
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          ))}
        </div>

        <div className="relative flex-1 bg-[#111827] overflow-auto n8n-scroll max-h-[320px] sm:max-h-[400px] md:max-h-[520px]">
          <div
            className="mx-auto transition-[width] duration-200 ease-out py-3"
            style={{ width: `${Math.round(zoom * 100)}%`, minWidth: 260 }}
          >
            {children}
          </div>
          {/* Status chip */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Executing…
          </div>
          {/* Minimap stub */}
          <div className="absolute bottom-2 right-2 w-16 h-12 rounded border border-slate-600/60 bg-slate-900/80 opacity-80 pointer-events-none overflow-hidden z-10">
            <div className="absolute inset-1 grid grid-cols-3 gap-0.5 p-0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[1px] bg-slate-600/70" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniWorkflowGraph({ slide, animateKey }) {
  const branched = Boolean(slide.branched);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [animateKey]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(1.75, Math.round((z + 0.15) * 100) / 100));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.55, Math.round((z - 0.15) * 100) / 100));
  }, []);
  const zoomReset = useCallback(() => setZoom(1), []);

  return (
    <WorkflowBuilderChrome
      title={slide.title}
      accent={slide.accent}
      zoom={zoom}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onZoomReset={zoomReset}
    >
      {branched ? (
        <GhlBranchCanvas nodes={slide.nodes} animateKey={animateKey} />
      ) : (
        <GhlLinearCanvas nodes={slide.nodes} animateKey={animateKey} />
      )}
      <style>{`
        .ghl-node {
          animation: ghlIn 0.4s ease forwards;
          opacity: 0;
        }
        .ghl-packet {
          animation: ghlFlow 1.8s linear infinite;
        }
        .n8n-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .n8n-scroll::-webkit-scrollbar-thumb {
          background: rgba(100,116,139,0.55);
          border-radius: 6px;
        }
        @keyframes ghlIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ghlFlow {
          to { stroke-dashoffset: -48; }
        }
      `}</style>
    </WorkflowBuilderChrome>
  );
}

export default function WorkflowCarousel({ responsibilities = [], technologies = [] }) {
  const slides = useMemo(
    () =>
      responsibilities.length
        ? responsibilities.map((title) => {
            const found = WORKFLOW_SLIDES.find((s) => s.title === title);
            return (
              found || {
                title,
                accent: "#3b82f6",
                nodes: [
                  { label: "Trigger", type: "trigger" },
                  { label: "Action", type: "action" },
                  { label: "Condition", type: "condition" },
                  { label: "Notify", type: "notify" },
                  { label: "Update CRM", type: "crm" },
                ],
              }
            );
          })
        : WORKFLOW_SLIDES,
    [responsibilities]
  );

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [fade, setFade] = useState(true);

  const goTo = useCallback(
    (next) => {
      setFade(false);
      window.setTimeout(() => {
        setIndex((next + slides.length) % slides.length);
        setFade(true);
      }, 150);
    },
    [slides.length]
  );

  useEffect(() => {
    if (!playing || slides.length < 2) return undefined;
    const id = window.setInterval(() => goTo(index + 1), 5000);
    return () => window.clearInterval(id);
  }, [playing, index, goTo, slides.length]);

  const slide = slides[index];

  return (
    <div className="pt-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
            Responsibilities
          </p>
          <ul className="space-y-1 max-h-[200px] sm:max-h-[280px] md:max-h-[460px] overflow-y-auto pr-1 custom-wf-scroll">
            {slides.map((item, i) => {
              const active = i === index;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      goTo(i);
                    }}
                    className={`w-full text-left flex items-start gap-2.5 text-sm rounded-lg px-2.5 py-2 transition-all duration-300 ${
                      active
                        ? "bg-slate-800/80 text-white border border-slate-600 shadow-sm"
                        : "text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-200"
                    }`}
                    style={
                      active
                        ? { borderColor: `${item.accent}66`, boxShadow: `0 0 0 1px ${item.accent}22` }
                        : undefined
                    }
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: active ? item.accent : "#475569",
                        boxShadow: active ? `0 0 8px ${item.accent}` : undefined,
                      }}
                    />
                    <span className="leading-snug">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-2 mt-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 text-[10px] text-slate-500">
            {Object.entries(TYPE_META)
              .slice(0, 6)
              .map(([key, meta]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: meta.color }} />
                  {meta.label}
                </span>
              ))}
          </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wider text-indigo-400/80 font-medium">
                Workflow Builder
              </p>
              <span className="text-[10px] text-slate-500 hidden sm:inline">GHL / n8n style</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label={playing ? "Pause carousel" : "Play carousel"}
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <h4 className="text-sm md:text-base font-semibold text-white leading-snug">
                {slide.title}
              </h4>
              <span className="text-xs text-slate-500 tabular-nums flex-shrink-0">
                {index + 1}/{slides.length}
              </span>
            </div>

            <MiniWorkflowGraph slide={slide} animateKey={`${index}-${slide.title}`} />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goTo(i);
                }}
                aria-label={`Go to ${s.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6" : "w-1.5 bg-slate-600 hover:bg-slate-500"
                }`}
                style={i === index ? { background: s.accent } : undefined}
              />
            ))}
          </div>

          <div className="mt-3 h-0.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              key={`prog-${index}-${playing}`}
              className={`h-full rounded-full ${playing ? "wf-progress" : ""}`}
              style={{
                width: playing ? undefined : `${((index + 1) / slides.length) * 100}%`,
                background: `linear-gradient(90deg, ${slide.accent}, #3b82f6)`,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .custom-wf-scroll::-webkit-scrollbar { width: 5px; }
        .custom-wf-scroll::-webkit-scrollbar-thumb {
          background: rgba(71,85,105,0.8);
          border-radius: 6px;
        }
        .wf-progress {
          width: 100%;
          transform-origin: left;
          animation: wfProgress 5s linear forwards;
        }
        @keyframes wfProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
