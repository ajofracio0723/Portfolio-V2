import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Pause,
  Play,
  Clock,
  CheckCircle2,
  TrendingUp,
  X,
  AlertCircle,
  Lightbulb,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { getWorkflowDetails } from "../data/workflowDetails";
import { WorkflowPlatformCanvas, TYPE_META } from "./WorkflowUIs";

/**
 * Workflow automation slides rendered in authentic GHL / Zapier / n8n UIs.
 * style: "ghl" | "zapier" | "n8n" | "make"
 */
export const WORKFLOW_SLIDES = [
  {
    title: "Built onboarding workflows",
    style: "ghl",
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
    style: "zapier",
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
    style: "ghl",
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
    style: "ghl",
    accent: "#ec4899",
    branched: true,
    branchLabels: { yes: "Attended", no: "Missed" },
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
    style: "zapier",
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
    style: "zapier",
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
    style: "ghl",
    accent: "#10b981",
    nodes: [
      { label: "Stripe", type: "trigger", detail: "checkout.session.completed" },
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
    style: "n8n",
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
    style: "zapier",
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
    style: "zapier",
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
    style: "n8n",
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
    style: "n8n",
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
    style: "n8n",
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
  {
    title: "AI Gmail Document Processing",
    style: "make",
    accent: "#6c2bd9",
    nodes: [
      {
        label: "Watch emails",
        sublabel: "Gmail · Trigger",
        type: "gmail",
      },
      {
        label: "List attachments",
        sublabel: "Get email attachments",
        type: "gmail",
      },
      {
        label: "Upload file to analyze",
        sublabel: "Upload a file",
        type: "openai",
      },
      {
        label: "Create Personalized Filename",
        sublabel: "Generate a response",
        type: "openai",
      },
      {
        label: "Upload a file",
        sublabel: "Google Drive",
        type: "drive",
      },
      {
        label: "Add a row",
        sublabel: "Google Sheets",
        type: "sheets",
      },
    ],
  },
  {
    title: "Slack → Notion Task Automation",
    style: "n8n",
    accent: "#E01E5A",
    branched: true,
    branchLabels: { yes: "true", no: "false" },
    nodes: [
      {
        label: "Slack Trigger3",
        type: "notify",
        subtitle: "messageTrigger",
      },
      {
        label: "IF Condition Check",
        type: "condition",
        subtitle: "if",
      },
      {
        label: "Get Message Data",
        type: "webhook",
        subtitle: "GET slack.com/api/conversations.history",
      },
      {
        label: "Get Email",
        type: "webhook",
        subtitle: "GET slack.com/api/users.info",
      },
      {
        label: "Get a message permalink",
        type: "notify",
        subtitle: "getPermalink: message",
      },
      {
        label: "Edit Fields",
        type: "action",
        subtitle: "manual",
      },
      {
        label: "AI Agent",
        type: "openai",
        subtitle: "Tools Agent",
        subs: [
          {
            label: "OpenRouter Chat Model",
            type: "openai",
            subtitle: "Chat Model",
            port: "Model",
          },
          {
            label: "Structured Output Parser",
            type: "parser",
            subtitle: "outputParser",
            port: "Output Parser",
          },
        ],
      },
      {
        label: "If",
        type: "condition",
        subtitle: "if",
      },
      {
        label: "Create an event",
        type: "calendar",
        subtitle: "create: event",
        branch: "yes",
      },
      {
        label: "Create a database page1",
        type: "notion",
        subtitle: "create: databasePage",
        branch: "yes",
      },
      {
        label: "Send a message2",
        type: "notify",
        subtitle: "post: message",
        branch: "yes",
      },
      {
        label: "Create a database page",
        type: "notion",
        subtitle: "create: databasePage",
        branch: "no",
      },
      {
        label: "Send a message",
        type: "notify",
        subtitle: "post: message",
        branch: "no",
      },
      {
        label: "Error Trigger",
        type: "error",
        subtitle: "errorTrigger",
        branch: "error",
      },
      {
        label: "Send a message1",
        type: "gmail",
        subtitle: "send: message",
        branch: "error",
      },
    ],
  },
  {
    title: "Customer Support AI Agent",
    style: "n8n",
    accent: "#38bdf8",
    branched: true,
    branchLabels: {
      yes: "agent",
      no: "status",
      side: "resolved",
    },
    nodes: [
      { label: "Support Webhook", type: "webhook" },
      { label: "Switch Route", type: "condition" },
      { label: "Get Circle Post", type: "webhook", branch: "yes" },
      { label: "Airtable List Records", type: "airtable", branch: "yes" },
      { label: "AI Agent (Gemini + Tools)", type: "openai", branch: "yes" },
      { label: "Post Circle Comment", type: "webhook", branch: "yes" },
      { label: "Airtable Get Record", type: "airtable", branch: "no" },
      { label: "Get Circle Comments", type: "webhook", branch: "no" },
      { label: "Normalize / Aggregate Thread", type: "action", branch: "no" },
      { label: "LLM Status Check", type: "openai", branch: "no" },
      { label: "Airtable Update Record", type: "airtable", branch: "no" },
      { label: "Airtable Get Resolved", type: "airtable", branch: "side" },
      { label: "Post Resolved Comment", type: "webhook", branch: "side" },
      { label: "Update Circle Post", type: "webhook", branch: "side" },
    ],
  },
  {
    title: "AI Invoice Processing",
    style: "n8n",
    accent: "#34A853",
    branched: true,
    branchLabels: { yes: "true", no: "false" },
    nodes: [
      {
        label: "Receive Invoice",
        type: "webhook",
        subtitle: "",
        trigger: true,
        logo: "/n8n.svg",
        n8nColor: "#ff6d5a",
        wireMeta: "POST",
      },
      {
        label: "AI Invoice Agent",
        type: "openai",
        subtitle: "",
        n8nIcon: "bot",
        n8nColor: "#5b6bff",
        logo: false,
        subs: [
          {
            label: "OpenRouter Chat Model",
            type: "openai",
            subtitle: "",
            port: "Chat Model",
            logo: "/openrouter.svg",
            n8nColor: "#94a3b8",
          },
          {
            label: "Structured Output Parser",
            type: "parser",
            subtitle: "",
            port: "Output Parser",
            n8nIcon: "angles",
            n8nColor: "#a78bfa",
          },
        ],
      },
      {
        label: "Parse Invoice Fields",
        type: "action",
        subtitle: "manual",
        n8nIcon: "pencil",
        n8nColor: "#a78bfa",
      },
      {
        label: "High Value Invoice?",
        type: "condition",
        subtitle: "",
        n8nIcon: "signpost",
        n8nColor: "#2ecc71",
      },
      {
        label: "Log Invoice (Flagged)",
        type: "sheets",
        subtitle: "append: sheet",
        logo: "/googlesheets.svg",
        branch: "yes",
      },
      {
        label: "Request Approval (Slack)",
        type: "notify",
        subtitle: "post: message",
        logo: "/slack.png",
        branch: "yes",
      },
      {
        label: "Log Invoice (Standard)",
        type: "sheets",
        subtitle: "append: sheet",
        logo: "/googlesheets.svg",
        branch: "no",
      },
      {
        label: "Return Confirmation",
        type: "webhook",
        subtitle: "",
        logo: "/n8n.svg",
        n8nColor: "#ff6d5a",
      },
    ],
  },
  {
    title: "GHL Stale Lead - AI Email + Slack Approval",
    style: "n8n",
    accent: "#0ea5e9",
    branched: true,
    branchLabels: { yes: "true", no: "false" },
    nodes: [
      {
        label: "Daily 9 AM",
        type: "trigger",
        subtitle: "scheduleTrigger",
        n8nIcon: "clock",
        n8nColor: "#ff6d5a",
      },
      {
        label: "Get GHL Contacts",
        type: "webhook",
        subtitle: "GET: https://services.leadconnectorhq.com/contacts/",
        n8nIcon: "globe",
        n8nColor: "#ea580c",
        logo: false,
      },
      {
        label: "Filter Stale Non-Client Leads",
        type: "parser",
        subtitle: "code",
        n8nIcon: "braces",
        n8nColor: "#a78bfa",
      },
      {
        key: "loop",
        label: "Loop Per Lead",
        type: "action",
        subtitle: "splitInBatches",
        n8nIcon: "loop",
        n8nColor: "#60a5fa",
      },
      {
        label: "Prepare Contact Data",
        type: "action",
        subtitle: "manual",
        n8nIcon: "pencil",
        n8nColor: "#60a5fa",
      },
      {
        label: "Write Email with AI",
        type: "openai",
        subtitle: "Basic LLM Chain",
        n8nIcon: "bot",
        n8nColor: "#10a37f",
        logo: false,
        subs: [
          {
            label: "Grok via OpenRouter",
            type: "openai",
            subtitle: "lmChatOpenRouter",
            port: "Model",
            logo: "/chatgpt.svg",
          },
        ],
      },
      {
        label: "Parse AI Email",
        type: "parser",
        subtitle: "code",
        n8nIcon: "braces",
        n8nColor: "#a78bfa",
      },
      {
        label: "Send to Slack for Approval",
        type: "notify",
        subtitle: "post: message",
        logo: "/slack.png",
      },
      {
        label: "Wait for Approval",
        type: "wait",
        subtitle: "waitWebhook",
        n8nIcon: "pause",
        n8nColor: "#c084fc",
        loopBackTo: "loop",
      },
      {
        label: "Approved?",
        type: "condition",
        subtitle: "if",
        n8nIcon: "signpost",
        n8nColor: "#a855f7",
      },
      {
        label: "Send Email via GHL",
        type: "webhook",
        subtitle: "POST: https://services.leadconnectorhq.com/conversations/",
        n8nIcon: "globe",
        n8nColor: "#ea580c",
        logo: false,
        branch: "yes",
      },
      {
        label: "Confirm Sent",
        type: "notify",
        subtitle: "post: message",
        logo: "/slack.png",
        branch: "yes",
      },
      {
        label: "Log Rejection",
        type: "notify",
        subtitle: "post: message",
        logo: "/slack.png",
        branch: "no",
      },
    ],
  },
  {
    title: "Cold Email Sender — Outreach",
    style: "n8n",
    accent: "#EA4335",
    branched: true,
    branchLabels: { yes: "true", no: "false" },
    nodes: [
      {
        label: "Daily 10 PM PHT Trigger",
        type: "trigger",
        subtitle: "",
        n8nIcon: "clock",
        n8nColor: "#14b8a6",
        trigger: true,
      },
      {
        label: "Email Config?",
        type: "action",
        subtitle: "manual",
        n8nIcon: "pencil",
        n8nColor: "#a78bfa",
      },
      {
        label: "Read Leads from Sheet?",
        type: "sheets",
        subtitle: "read: sheet",
        logo: "/googlesheets.svg",
      },
      {
        label: "Not Yet Emailed?",
        type: "condition",
        subtitle: "",
        n8nIcon: "signpost",
        n8nColor: "#2ecc71",
      },
      {
        label: "Compose Personalized Email?",
        type: "parser",
        subtitle: "code",
        n8nIcon: "braces",
        n8nColor: "#eab308",
        branch: "yes",
      },
      {
        key: "loop",
        label: "Send One at a Time?",
        type: "action",
        subtitle: "splitInBatches",
        n8nIcon: "loop",
        n8nColor: "#14b8a6",
        branch: "yes",
      },
      {
        label: "Send Email via Gmail?",
        type: "gmail",
        subtitle: "send: message",
        logo: "/gmail.svg",
        branch: "yes",
      },
      {
        label: "Wait 30s Between Sends?",
        type: "wait",
        subtitle: "",
        n8nIcon: "pause",
        n8nColor: "#ef4444",
        branch: "yes",
      },
      {
        label: "Mark as Emailed in Sheet?",
        type: "sheets",
        subtitle: "update: sheet",
        logo: "/googlesheets.svg",
        branch: "yes",
      },
      {
        label: "Wait 15s Between Sends?",
        type: "wait",
        subtitle: "",
        n8nIcon: "pause",
        n8nColor: "#ef4444",
        loopBackTo: "loop",
        branch: "yes",
      },
    ],
  },
  {
    title: "Stripe Revenue Tracking",
    style: "n8n",
    accent: "#635BFF",
    branched: true,
    branchLabels: { yes: "true", no: "false" },
    nodes: [
      {
        label: "Stripe Payment Event",
        type: "webhook",
        subtitle: "",
        trigger: true,
        logo: "/n8n.svg",
        n8nColor: "#ff6d5a",
        wireMeta: "POST",
      },
      {
        label: "Parse Stripe Event",
        type: "action",
        subtitle: "manual",
        n8nIcon: "pencil",
        n8nColor: "#60a5fa",
      },
      {
        label: "AI Revenue Categorization",
        type: "openai",
        subtitle: "",
        n8nIcon: "bot",
        n8nColor: "#5b6bff",
        logo: false,
        subs: [
          {
            label: "OpenRouter Chat Model",
            type: "openai",
            subtitle: "",
            port: "Chat Model",
            logo: "/openrouter.svg",
            n8nColor: "#94a3b8",
          },
          {
            label: "Structured Output Parser",
            type: "parser",
            subtitle: "",
            port: "Output Parser",
            n8nIcon: "angles",
            n8nColor: "#a78bfa",
          },
        ],
      },
      {
        label: "Parse Revenue Fields",
        type: "action",
        subtitle: "manual",
        n8nIcon: "pencil",
        n8nColor: "#60a5fa",
      },
      {
        label: "Log to Revenue Tracker",
        type: "sheets",
        subtitle: "append: sheet",
        logo: "/googlesheets.svg",
      },
      {
        label: "Anomaly Detected?",
        type: "condition",
        subtitle: "",
        n8nIcon: "signpost",
        n8nColor: "#2ecc71",
      },
      {
        label: "Alert: Anomaly Detected",
        type: "notify",
        subtitle: "post: message",
        logo: "/slack.png",
        branch: "yes",
      },
      {
        label: "Acknowledge Stripe",
        type: "webhook",
        subtitle: "",
        logo: "/n8n.svg",
        n8nColor: "#ff6d5a",
      },
    ],
  },
  {
    title: "Missed Opportunity Recovery System (AI Follow-Up)",
    style: "ghl",
    accent: "#22C55E",
    branched: true,
    branchLabels: { yes: "Contact Reply", no: "Time Out" },
    nodes: [
      {
        label: "Contact Tag",
        type: "trigger",
        ghlIcon: "tag",
        detail: "Tag Added includes 'Reactivation Campaign'",
      },
      {
        label: "Customer Replied",
        type: "trigger",
        ghlIcon: "sms-reply",
        detail: "Reply channel is 'SMS'",
      },
      {
        label: "Send Initial Reactivation SMS",
        type: "sms",
      },
      {
        label: "Wait 24 Hours",
        type: "wait",
      },
      {
        label: "Wait for Reply 24h",
        type: "wait",
        detail: "Wait for customer reply",
      },
      {
        label: "Wait",
        type: "wait",
      },
      {
        label: "Check if Contact Replied",
        type: "condition",
      },
      // Contact Reply path
      {
        label: "AI Classify Reply Intent",
        type: "openai",
        branch: "yes",
      },
      {
        label: "Write AI Intent Summary",
        type: "crm",
        detail: "Update contact field",
        branch: "yes",
      },
      {
        label: "Tag: Reactivation Engaged",
        type: "crm",
        branch: "yes",
      },
      {
        label: "Send AI Personalized Reply SMS",
        type: "sms",
        branch: "yes",
      },
      {
        label: "Send Booking Link Email",
        type: "email",
        branch: "yes",
      },
      {
        label: "Assign to Closer",
        type: "action",
        branch: "yes",
      },
      {
        label: "Move Pipeline → Warm Recovered",
        type: "crm",
        branch: "yes",
      },
      {
        label: "Notify Rep: Reply Received",
        type: "notify",
        branch: "yes",
      },
      // Time Out path
      {
        label: "Send Follow-up SMS #2",
        type: "sms",
        branch: "no",
      },
      {
        label: "Wait for Reply 48h",
        type: "wait",
        branch: "no",
      },
      {
        label: "Send Final Reactivation SMS",
        type: "sms",
        branch: "no",
      },
      {
        label: "Send Win-back Email",
        type: "email",
        branch: "no",
      },
      {
        label: "Tag: No Reply / Cold",
        type: "crm",
        branch: "no",
      },
      {
        label: "Create Sales Rescue Task",
        type: "action",
        branch: "no",
      },
      {
        label: "Internal Alert: Timed Out",
        type: "notify",
        branch: "no",
      },
      // Merge
      {
        label: "Log Recovery Outcome Note",
        type: "crm",
      },
      {
        label: "Remove Tag: Reactivation Campaign",
        type: "crm",
      },
    ],
  },
];


/** Legacy MiniWorkflowGraph replaced by WorkflowPlatformCanvas (GHL / Zapier / n8n) */

const TOOL_TONE = {
  orange: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  pink: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
};

function ImpactIcon({ type }) {
  if (type === "clock") {
    return <Clock className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />;
  }
  return <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />;
}

function WorkflowDetailsPanel({ title, open, onToggle, onOpenCaseStudy }) {
  const details = getWorkflowDetails(title);

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {open ? "Hide details" : "Show details"}
        </button>
        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
        >
          View Case Study
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {open && (
        <div className="px-3.5 pb-4 space-y-4 border-t border-white/5 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Key Functions
            </p>
            <ul className="space-y-1.5">
              {details.keyFunctions.map((fn) => (
                <li key={fn} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                  {fn}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Business Impact
            </p>
            <ul className="space-y-2">
              {details.businessImpact.map((item) => (
                <li
                  key={item.text}
                  className={`flex items-start gap-2 text-sm font-medium ${
                    item.icon === "clock" ? "text-violet-300" : "text-emerald-300"
                  }`}
                >
                  <ImpactIcon type={item.icon} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseStudyModal({ title, onClose }) {
  const { caseStudy } = getWorkflowDetails(title);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${caseStudy.title} case study`}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0e14] shadow-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Close case study"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-[11px] font-mono text-sky-400/90 mb-2">// case study</p>
        <h3 className="text-xl sm:text-2xl font-bold text-white pr-10 leading-snug mb-6">
          {caseStudy.title}
        </h3>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                The Problem
              </p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed pl-8">{caseStudy.problem}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/35 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Automation Solution
              </p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed pl-8">{caseStudy.solution}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Tools Used
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pl-8">
              {caseStudy.tools.map((tool) => (
                <span
                  key={tool.name}
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                    TOOL_TONE[tool.tone] || TOOL_TONE.blue
                  }`}
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Results / Impact
              </p>
            </div>
            <div className="ml-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-200 leading-relaxed">{caseStudy.result}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  const goTo = useCallback(
    (next) => {
      setFade(false);
      window.setTimeout(() => {
        setIndex((next + slides.length) % slides.length);
        setFade(true);
        setDetailsOpen(true);
        setCaseStudyOpen(false);
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
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {slide.style === "ghl"
                  ? "GoHighLevel builder"
                  : slide.style === "n8n"
                    ? "n8n editor"
                    : slide.style === "make"
                      ? "Make scenario"
                      : "Zapier editor"}
              </span>
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

            <WorkflowPlatformCanvas slide={slide} animateKey={`${index}-${slide.title}`} />

            <WorkflowDetailsPanel
              title={slide.title}
              open={detailsOpen}
              onToggle={() => {
                setPlaying(false);
                setDetailsOpen((o) => !o);
              }}
              onOpenCaseStudy={() => {
                setPlaying(false);
                setCaseStudyOpen(true);
              }}
            />
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

      {caseStudyOpen && (
        <CaseStudyModal title={slide.title} onClose={() => setCaseStudyOpen(false)} />
      )}

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
        .wf-anim {
          animation: wfIn 0.35s ease forwards;
          opacity: 0;
        }
        .wf-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .wf-scroll::-webkit-scrollbar-thumb {
          background: rgba(100,116,139,0.55);
          border-radius: 6px;
        }
        @keyframes wfIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
