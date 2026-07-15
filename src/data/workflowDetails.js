/**
 * Expandable details + case studies for each Zapier-style workflow slide.
 * Keyed by WORKFLOW_SLIDES title.
 */
export const WORKFLOW_DETAILS = {
  "Built onboarding workflows": {
    keyFunctions: [
      "Auto-tag new clients after payment",
      "Pipeline stage sync & welcome drip",
      "Kickoff booking + CSM task creation",
    ],
    businessImpact: [
      { icon: "trend", text: "Cuts manual onboarding work by ~65%" },
      { icon: "trend", text: "Kickoff booked within 48 hours consistently" },
      { icon: "clock", text: "~8 hrs/week saved for CSMs" },
    ],
    caseStudy: {
      title: "Client Onboarding Automation",
      problem:
        "New paying clients waited days for welcome messages, portal access, and kickoff scheduling because onboarding was handled manually across email, SMS, and CRM.",
      solution:
        "Built an end-to-end onboarding zap that fires on payment, merges contact data, moves the opportunity, sends welcome SMS/email, creates CSM tasks, and nudges for kickoff booking.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zapier", tone: "orange" },
        { name: "Stripe", tone: "violet" },
      ],
      result:
        "Every new client now gets a consistent welcome experience within minutes, with account managers notified and kickoff booked automatically.",
    },
  },
  "Lead nurturing campaigns": {
    keyFunctions: [
      "Automated lead capture",
      "Follow-up workflow automation",
      "Engagement tracking",
    ],
    businessImpact: [
      { icon: "trend", text: "Reduces CRM management workload by 70%" },
      { icon: "trend", text: "Improves response time to under 1 hour" },
      { icon: "clock", text: "~15 hrs/week saved" },
    ],
    caseStudy: {
      title: "CRM Lead Engagement Workflow",
      problem:
        "Sales teams often struggle to follow up with leads consistently because tasks are manually created and tracked.",
      solution:
        "Created a workflow that captures new leads, nurtures with timed emails/SMS, branches on open/click behavior, and escalates hot leads to owners with Slack alerts.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Improved lead follow-up consistency and reduced missed opportunities.",
    },
  },
  "Appointment reminders": {
    keyFunctions: [
      "Instant booking confirmations",
      "Tiered SMS/email reminder sequence",
      "Rep notification before appointments",
    ],
    businessImpact: [
      { icon: "trend", text: "Lowered no-show rate by ~35%" },
      { icon: "trend", text: "Confirmations sent within seconds of booking" },
      { icon: "clock", text: "~6 hrs/week saved on reminder calls" },
    ],
    caseStudy: {
      title: "Appointment Reminder Sequence",
      problem:
        "Clients forgot booked calls and reps spent time sending one-off reminders across channels, leading to empty calendars.",
      solution:
        "Automated confirmations plus T-48h, T-24h, T-2h, and T-30m reminders over email and SMS, with ICS hooks and a final owner ping.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zapier", tone: "orange" },
        { name: "Twilio SMS", tone: "cyan" },
      ],
      result:
        "Fewer empty slots and a reliable reminder cadence that clients and reps can trust.",
    },
  },
  "Webinar automations": {
    keyFunctions: [
      "Registration confirm + Zoom delivery",
      "Pre-event reminder cadence",
      "Attended vs missed branching",
    ],
    businessImpact: [
      { icon: "trend", text: "Boosted live attendance by ~25%" },
      { icon: "trend", text: "Hot attendees routed to sales within hours" },
      { icon: "clock", text: "~10 hrs/week saved on webinar ops" },
    ],
    caseStudy: {
      title: "Webinar Lifecycle Automation",
      problem:
        "Webinar hosts manually sent Zoom links, reminders, and post-event offers — attendees slipped through without next-step CTAs.",
      solution:
        "Built a registration-to-post-event zap: confirms + SMS, timed reminders, then paths for attended vs missed with replay, offers, and CRM stage updates.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zoom", tone: "blue" },
      ],
      result:
        "Higher show rates and a clear post-webinar path that converts engaged attendees into booked calls.",
    },
  },
  "No-show follow-up": {
    keyFunctions: [
      "Instant no-show tagging",
      "Rescue SMS + rebook path",
      "Escalation when unrebooked",
    ],
    businessImpact: [
      { icon: "trend", text: "Recovered ~40% of no-shows via rebooking" },
      { icon: "trend", text: "Rescue outreach starts within 15 minutes" },
      { icon: "clock", text: "~5 hrs/week saved on manual chasing" },
    ],
    caseStudy: {
      title: "No-Show Rescue Workflow",
      problem:
        "Missed appointments sat untouched until someone noticed, delaying recovery and drowning reps in follow-ups.",
      solution:
        "When an appointment flips to no-show, the zap tags, waits, sends rebook SMS, then branches: confirm if rebooked or run a rescue email/SMS/task sequence.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zapier", tone: "orange" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Faster recovery of missed bookings and clear ownership when leads stay cold.",
    },
  },
  "Customer reactivation": {
    keyFunctions: [
      "Inactivity filter triggers",
      "Win-back email/SMS sequence",
      "Warm vs dormant path split",
    ],
    businessImpact: [
      { icon: "trend", text: "Re-engaged ~20% of dormant contacts" },
      { icon: "trend", text: "Warm replies routed to account managers" },
      { icon: "clock", text: "~7 hrs/week saved on outreach lists" },
    ],
    caseStudy: {
      title: "Win-Back Reactivation Campaign",
      problem:
        "Inactive clients quietly churned — list pulls and one-off emails weren’t consistent enough to revive relationships.",
      solution:
        "Automated a 30+ day inactivity zap with win-back emails, discount SMS for cold contacts, and personal outreach for engagers — then paused junk sends for dormant tags.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Make", tone: "violet" },
      ],
      result:
        "A repeatable win-back engine that surfaces warm leads and quiets true churners.",
    },
  },
  "Payment notification workflows": {
    keyFunctions: [
      "Stripe webhook verification",
      "CRM closed-won sync",
      "Client + finance alerts",
    ],
    businessImpact: [
      { icon: "trend", text: "Payment → onboarding under 5 minutes" },
      { icon: "trend", text: "Zero missed finance Slack/email alerts" },
      { icon: "clock", text: "~4 hrs/week saved reconciling payments" },
    ],
    caseStudy: {
      title: "Payment Received Notification Zap",
      problem:
        "Successful checkouts weren’t always mirrored in CRM, delaying receipts, internal alerts, and onboarding handoffs.",
      solution:
        "Hooked Stripe checkout.session.completed into a verified webhook path that upserts contacts, updates pipeline, emails receipts, alerts finance via Slack, and fires onboarding.",
      tools: [
        { name: "Stripe", tone: "violet" },
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Reliable payment visibility for clients and the internal team with automatic onboarding kickoff.",
    },
  },
  "Internal notification systems": {
    keyFunctions: [
      "Stage-change routing",
      "Channel-specific alerts",
      "Audit timeline logging",
    ],
    businessImpact: [
      { icon: "trend", text: "Right team alerted within seconds of stage moves" },
      { icon: "trend", text: "Fewer missed bookeds / closed-won handoffs" },
      { icon: "clock", text: "~3 hrs/week saved hunting status updates" },
    ],
    caseStudy: {
      title: "Pipeline Stage Notification Router",
      problem:
        "Critical stage changes lived only in CRM — sales, CS, and finance found out late or not at all.",
      solution:
        "Built a stage-change router: Slack/email for booked paths, quiet logging for soft stages, and finance wins notifications with fulfillment tasks.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zapier", tone: "orange" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Instant, role-aware visibility whenever pipeline movement matters.",
    },
  },
  "Conditional multi-branch workflows": {
    keyFunctions: [
      "Source-based lead routing",
      "Hot/paid vs organic paths",
      "VIP referral escalation",
    ],
    businessImpact: [
      { icon: "trend", text: "Paid leads contacted in under 60 seconds" },
      { icon: "trend", text: "VIP referrals assigned to founders immediately" },
      { icon: "clock", text: "~9 hrs/week saved on manual triaging" },
    ],
    caseStudy: {
      title: "Multi-Path Lead Source Router",
      problem:
        "All inbound leads got the same nurture — paid ads and VIP referrals sat behind organic volume.",
      solution:
        "Normalized inbound data then branched: instant SMS + senior closer for paid, standard nurture for organic, and founder assignment for VIP referrals before merging into one pipeline.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Webhooks", tone: "cyan" },
      ],
      result:
        "Fair, fast routing that treats high-intent sources with the urgency they deserve.",
    },
  },
  "Task automation": {
    keyFunctions: [
      "Auto-generated discovery tasks",
      "Due dates + SLA nudges",
      "Completion-based stage advances",
    ],
    businessImpact: [
      { icon: "trend", text: "Task creation is fully hands-off at Qualified" },
      { icon: "trend", text: "SLA breaches escalate to managers automatically" },
      { icon: "clock", text: "~6 hrs/week saved building checklists" },
    ],
    caseStudy: {
      title: "Qualified Stage Task Factory",
      problem:
        "Reps forgot discovery checklists after qualification, causing stalled deals and uneven prep quality.",
      solution:
        "When a deal hits Qualified, the zap creates script + checklist tasks with due dates, then paths: advance on completion or escalate/reassign if overdue.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Zapier", tone: "orange" },
        { name: "Asana", tone: "pink" },
      ],
      result:
        "Consistent discovery prep and clearer accountability before proposals go out.",
    },
  },
  "Workflow troubleshooting": {
    keyFunctions: [
      "Error event capture + payload logs",
      "Auto-retry with engineer alerts",
      "Root-cause notes & dashboards",
    ],
    businessImpact: [
      { icon: "trend", text: "Most silent failures catch themselves within minutes" },
      { icon: "trend", text: "Engineers get Slack alerts with trace IDs" },
      { icon: "clock", text: "~5 hrs/week saved digging through histories" },
    ],
    caseStudy: {
      title: "Automation Failure Recovery Loop",
      problem:
        "Broken workflows failed quietly mid-run — clients only noticed when leads stopped progressing.",
      solution:
        "Subscribed to workflow error events, auto-retried, validated fields, paused bad branches, opened tickets, and wrote recovery notes when paths healed.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Faster incident response and fewer multi-day automation outages.",
    },
  },
  "Workflow optimization": {
    keyFunctions: [
      "Weekly metrics export",
      "Duplicate / slow-step detection",
      "Promote winning path variants",
    ],
    businessImpact: [
      { icon: "trend", text: "Identified and removed redundant wait steps" },
      { icon: "trend", text: "Winning variants promoted into live zaps" },
      { icon: "clock", text: "~4 hrs/week saved on manual audits" },
    ],
    caseStudy: {
      title: "Weekly Zap Optimization Cron",
      problem:
        "Automations grew messy over time — overlapping waits, unused tags, and dead branches slowed everything down.",
      solution:
        "Scheduled a weekly analytics cron to flag slow and duplicate steps, tighten entry conditions, archive dead paths, and publish an optimized v2 with a team changelog.",
      tools: [
        { name: "Make", tone: "violet" },
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
      ],
      result:
        "Leaner automations with clearer goals and measurable speed improvements.",
    },
  },
  "Automation testing": {
    keyFunctions: [
      "Draft test-contact sandbox",
      "Assertion checks on tags/email/SMS",
      "Block publish on failed runs",
    ],
    businessImpact: [
      { icon: "trend", text: "Broken zaps caught before going live" },
      { icon: "trend", text: "QA Slack alerts with failure diffs" },
      { icon: "clock", text: "~3 hrs/week saved on manual smoke tests" },
    ],
    caseStudy: {
      title: "Pre-Publish Automation Test Mode",
      problem:
        "Live client contacts were used to “test” zaps, causing messy data and occasional production surprises.",
      solution:
        "Cloned zaps into test mode with a draft contact, asserted tags/messages/waits/webhooks, then cleared data and enabled live — or blocked publish and alerted QA on failure.",
      tools: [
        { name: "Zapier", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Safer shipping — only verified automation paths hit production.",
    },
  },
  "AI Gmail Document Processing": {
    keyFunctions: [
      "Gmail attachment detection",
      "AI filename generation",
      "Automated document organization",
    ],
    businessImpact: [
      { icon: "trend", text: "Reduces document sorting time by 90%" },
      { icon: "clock", text: "Saves ~8 hours per week" },
      { icon: "trend", text: "Consistent naming across Drive + Sheets" },
    ],
    caseStudy: {
      title: "AI Gmail Document Processing",
      problem:
        "Teams spent hours each week downloading email attachments, renaming files by hand, and filing them into the right folders — slow, inconsistent, and easy to miss.",
      solution:
        "Built a Make scenario that watches Gmail for new attachments, sends files to OpenAI for structured filename generation, uploads the renamed file to Google Drive, and logs each item in Google Sheets.",
      tools: [
        { name: "Make", tone: "violet" },
        { name: "Gmail", tone: "orange" },
        { name: "OpenAI", tone: "emerald" },
      ],
      result:
        "Attachments are renamed and organized automatically, cutting manual sorting by ~90% and freeing about 8 hours a week.",
    },
  },
  "Slack → Notion Task Automation": {
    keyFunctions: [
      "Slack message trigger + permalink lookup",
      "AI routing (meeting vs task)",
      "Notion pages + Calendar events + Slack confirm",
    ],
    businessImpact: [
      { icon: "trend", text: "Turns Slack chatter into tracked work in seconds" },
      { icon: "trend", text: "Meetings auto-land on Google Calendar when detected" },
      { icon: "clock", text: "~6 hrs/week saved on manual task capture" },
    ],
    caseStudy: {
      title: "Slack → Notion Task Automation System",
      problem:
        "Action items and meeting requests lived in Slack threads. People forgot to create Notion tasks or calendar events, so follow-ups slipped.",
      solution:
        "Built an n8n workflow: Slack trigger → enrich message/email/permalink → AI Agent (OpenRouter + structured output) → branch into Calendar+Notion+Slack reply or Notion+Slack only, with a Gmail alert on workflow errors.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "Slack", tone: "pink" },
        { name: "Notion", tone: "blue" },
        { name: "OpenAI", tone: "emerald" },
      ],
      result:
        "Slack requests become Notion tasks (and calendar events when needed) automatically, with confirmations back in-channel and email alerts if the run fails.",
    },
  },
  "Customer Support AI Agent": {
    keyFunctions: [
      "Webhook intake + Switch routing",
      "AI agent replies with tools (Gemini / search)",
      "Status checks + resolved Circle/Airtable sync",
    ],
    businessImpact: [
      { icon: "trend", text: "Faster first responses in community support" },
      { icon: "trend", text: "Ticket status tracked automatically in Airtable" },
      { icon: "clock", text: "~10 hrs/week saved on manual forum replies" },
    ],
    caseStudy: {
      title: "Customer Support AI Agent with Auto Response & Tracking",
      problem:
        "Support threads in Circle piled up. Reps manually drafted replies, checked history, and updated Airtable — slow and inconsistent.",
      solution:
        "Built an n8n workflow: webhook → Switch into (1) AI agent reply path with Airtable context + Gemini/tools + Circle post comment, (2) status-check LLM pipeline that aggregates comments and updates Airtable, (3) resolved path that posts final comments and updates the Circle post.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "Airtable", tone: "cyan" },
        { name: "OpenAI", tone: "emerald" },
        { name: "Webhooks", tone: "violet" },
      ],
      result:
        "Incoming support posts get AI-assisted replies and lifecycle tracking without manual copy-paste between Circle and Airtable.",
    },
  },
  "AI Invoice Processing": {
    keyFunctions: [
      "Webhook invoice intake",
      "AI field extraction (OpenRouter + parser)",
      "High-value branch with Slack approval + Sheets logging",
    ],
    businessImpact: [
      { icon: "trend", text: "Invoices parsed and routed without manual data entry" },
      { icon: "trend", text: "High-value invoices flagged for Slack approval" },
      { icon: "clock", text: "~5 hrs/week saved on AP triage" },
    ],
    caseStudy: {
      title: "AI Invoice Processing",
      problem:
        "Finance teams retyped invoice data from emails/PDFs, then decided which bills needed manager approval — slow and easy to miss high-value items.",
      solution:
        "Built an n8n flow: webhook receives the invoice → AI Invoice Agent extracts structured fields → Parse Invoice Fields → If High Value? logs to a flagged Google Sheet and requests Slack approval (else standard sheet log) → returns a webhook confirmation.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "OpenAI", tone: "emerald" },
        { name: "Google Sheets", tone: "cyan" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Invoices are extracted, logged, and escalated automatically, with confirmation returned to the caller.",
    },
  },
  "GHL Stale Lead - AI Email + Slack Approval": {
    keyFunctions: [
      "Daily GHL stale-lead scan",
      "AI email draft (Grok via OpenRouter)",
      "Slack approval gate before GHL send",
    ],
    businessImpact: [
      { icon: "trend", text: "Reactivates dormant leads without manual copywriting" },
      { icon: "trend", text: "Human approval in Slack before any email sends" },
      { icon: "clock", text: "~4 hrs/week saved on stale-lead outreach" },
    ],
    caseStudy: {
      title: "GHL Stale Lead - AI Email + Slack Approval",
      problem:
        "Non-client leads went cold in GoHighLevel. Reps rarely wrote personal win-back emails, and anything automated risked sending the wrong tone without review.",
      solution:
        "Built an n8n job that runs daily at 9 AM, pulls GHL contacts, filters stale non-clients, loops each lead, drafts an email with AI (Grok via OpenRouter), posts it to Slack for approval, waits, then either sends via GHL + confirms in Slack or logs the rejection.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "GoHighLevel", tone: "emerald" },
        { name: "Slack", tone: "pink" },
        { name: "OpenAI", tone: "violet" },
      ],
      result:
        "Stale leads get timely, AI-written outreach with a Slack approval checkpoint before anything hits the inbox.",
    },
  },
  "Cold Email Sender — Outreach": {
    keyFunctions: [
      "Nightly schedule (10 PM PHT) + sheet lead pull",
      "Skip already-emailed leads",
      "Personalized send loop via Gmail with paced waits + sheet status update",
    ],
    businessImpact: [
      { icon: "trend", text: "Outbound sends run overnight without manual copy-paste" },
      { icon: "trend", text: "Leads are paced and marked so nothing double-sends" },
      { icon: "clock", text: "~6 hrs/week saved on cold outreach ops" },
    ],
    caseStudy: {
      title: "Cold Email Sender — Outreach",
      problem:
        "Cold outreach depended on someone opening a sheet, writing each email, and tracking who already got a message — easy to miss rows or blast too fast.",
      solution:
        "Built an n8n outreach flow: daily 10 PM PHT trigger → email config → read leads from Google Sheets → If Not Yet Emailed? → compose personalized copy → Split In Batches → send via Gmail → wait 30s → mark emailed in sheet → wait 15s and loop until the batch is done.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "Google Sheets", tone: "cyan" },
        { name: "Gmail", tone: "pink" },
      ],
      result:
        "Leads get personalized cold emails on a schedule, one at a time, with sheet tracking so each contact is only contacted once.",
    },
  },
  "Stripe Revenue Tracking": {
    keyFunctions: [
      "Stripe payment webhook intake + event parse",
      "AI revenue categorization (OpenRouter + structured parser)",
      "Sheets logging + Slack alert on anomaly",
    ],
    businessImpact: [
      { icon: "trend", text: "Every Stripe payment is categorized and logged automatically" },
      { icon: "trend", text: "Anomalies surface in Slack instead of burying in Sheets" },
      { icon: "clock", text: "~5 hrs/week saved on revenue ops review" },
    ],
    caseStudy: {
      title: "Stripe Revenue Tracking",
      problem:
        "Finance manually categorized Stripe payment events and only noticed weird amounts days later when reconciling a spreadsheet.",
      solution:
        "Built an n8n flow: Stripe Payment Event → Parse Stripe Event → AI Revenue Categorization (OpenRouter + Structured Output Parser) → Parse Revenue Fields → Log to Revenue Tracker sheet → If Anomaly Detected? Slack alert → Acknowledge Stripe.",
      tools: [
        { name: "n8n", tone: "orange" },
        { name: "Stripe", tone: "violet" },
        { name: "Google Sheets", tone: "cyan" },
        { name: "Slack", tone: "pink" },
      ],
      result:
        "Payments are categorized and tracked live, with Slack alerts when revenue looks off — and Stripe gets an acknowledgment every run.",
    },
  },
  "Missed Opportunity Recovery System (AI Follow-Up)": {
    keyFunctions: [
      "Dual triggers: reactivation tag + SMS reply",
      "AI reply classification + personalized SMS/email on Contact Reply",
      "Timeout path: follow-up SMS → final outreach → sales rescue task",
    ],
    businessImpact: [
      { icon: "trend", text: "Replies get AI-routed to a closer instead of sitting in SMS" },
      { icon: "trend", text: "No-reply contacts still get a timed second + final chase" },
      { icon: "clock", text: "~4 hrs/week saved on missed-opportunity follow-up" },
    ],
    caseStudy: {
      title: "Missed Opportunity Recovery System (AI Follow-Up)",
      problem:
        "Reactivation leads and SMS replies sat in GHL without a consistent next step — warm contacts either waited too long or got generic blasts.",
      solution:
        "Built a GHL flow: Contact Tag (Reactivation Campaign) + Customer Replied (SMS) → initial reactivation SMS → wait / wait-for-reply → If Contact Replied? → AI classify intent, personalize SMS, booking email, assign closer, warm pipeline · else follow-up SMS → final SMS/email → cold tag + sales rescue task → log outcome and clear campaign tag.",
      tools: [
        { name: "GoHighLevel", tone: "emerald" },
        { name: "SMS", tone: "cyan" },
        { name: "OpenAI", tone: "violet" },
      ],
      result:
        "Missed and reactivation opportunities run a full reply-aware recovery path with AI on the engaged branch and a sales handoff when they go quiet.",
    },
  },
};

export function getWorkflowDetails(title) {
  return (
    WORKFLOW_DETAILS[title] || {
      keyFunctions: [
        "Trigger-based automation",
        "Multi-step action sequence",
        "CRM + notification sync",
      ],
      businessImpact: [
        { icon: "trend", text: "Removes repetitive manual work" },
        { icon: "trend", text: "Keeps follow-ups consistent" },
        { icon: "clock", text: "Hours saved every week" },
      ],
      caseStudy: {
        title,
        problem:
          "Manual steps created delays and inconsistent client experiences across CRM and messaging tools.",
        solution:
          "Designed and shipped an automated sequence that captures events, applies conditions, and notifies the right people.",
        tools: [
          { name: "Zapier", tone: "orange" },
          { name: "GoHighLevel", tone: "emerald" },
        ],
        result:
          "Reliable automation with clearer ownership and fewer missed handoffs.",
      },
    }
  );
}
