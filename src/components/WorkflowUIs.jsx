import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Zap,
  GitBranch,
  Mail,
  MessageSquare,
  Clock,
  Webhook,
  Database,
  Bell,
  Settings2,
  CheckCircle2,
  Plus,
  Minus,
  Maximize2,
  Play,
  ChevronLeft,
  FormInput,
  MoreHorizontal,
  BarChart2,
  Copy,
  Sparkles,
  Wrench,
  Table2,
  HardDrive,
  Bug,
  Braces,
  Globe,
  Pause,
  Pencil,
  RefreshCw,
  Bot,
  Signpost,
  ChevronsLeftRight,
  CalendarDays,
  CalendarCheck2,
  Link2,
  Tags,
  Tag,
  ListTodo,
  Contact2,
  UserRound,
  Rss,
  CircleCheckBig,
  BellRing,
} from "lucide-react";

/** Per-node Lucide overrides for authentic n8n node icons */
const N8N_ICON_MAP = {
  globe: Globe,
  webhook: Webhook,
  pause: Pause,
  pencil: Pencil,
  loop: RefreshCw,
  bot: Bot,
  clock: Clock,
  braces: Braces,
  angles: ChevronsLeftRight,
  signpost: Signpost,
  gitBranch: GitBranch,
  zap: Zap,
  mail: Mail,
  bell: Bell,
  sparkles: Sparkles,
  bug: Bug,
  settings: Settings2,
};

const N8N_AGENT_PORTS = ["Chat Model", "Memory", "Tool", "Output Parser"];

/** Shared type → visual meta */
export const TYPE_META = {
  trigger: {
    icon: Zap,
    color: "#FF4A00",
    label: "Trigger",
    app: "Zapier · Event",
    ghlColor: "#22c55e",
    n8nColor: "#ff6d5a",
  },
  condition: {
    icon: GitBranch,
    color: "#7A55F2",
    label: "Paths",
    app: "Paths by Zapier",
    ghlColor: "#8b5cf6",
    n8nColor: "#a855f7",
  },
  action: {
    icon: Settings2,
    color: "#3b82f6",
    label: "Action",
    app: "App action",
    ghlColor: "#3b82f6",
    n8nColor: "#60a5fa",
  },
  wait: {
    icon: Clock,
    color: "#f59e0b",
    label: "Delay",
    app: "Delay by Zapier",
    ghlColor: "#a855f7",
    n8nColor: "#c084fc",
  },
  email: {
    icon: Mail,
    color: "#EA4335",
    label: "Gmail",
    app: "Gmail",
    ghlColor: "#EA4335",
    n8nColor: "#EA4335",
    makeColor: "#EA4335",
    logo: "/gmail.svg",
  },
  gmail: {
    icon: Mail,
    color: "#EA4335",
    label: "Gmail",
    app: "Gmail",
    ghlColor: "#EA4335",
    n8nColor: "#EA4335",
    makeColor: "#EA4335",
    logo: "/gmail.svg",
  },
  sms: {
    icon: MessageSquare,
    color: "#06b6d4",
    label: "SMS",
    app: "SMS by Zapier",
    ghlColor: "#16a34a",
    n8nColor: "#34d399",
  },
  webhook: {
    icon: Webhook,
    color: "#f97316",
    label: "Webhook",
    app: "Webhooks by Zapier",
    ghlColor: "#f97316",
    n8nColor: "#fb923c",
  },
  crm: {
    icon: Database,
    color: "#10b981",
    label: "CRM",
    app: "GoHighLevel",
    ghlColor: "#0ea5e9",
    n8nColor: "#2eac6d",
    logo: "/gohighlevel.png",
  },
  notify: {
    icon: Bell,
    color: "#E01E5A",
    label: "Notify",
    app: "Slack",
    ghlColor: "#e11d48",
    n8nColor: "#f472b6",
    logo: "/slack.png",
  },
  openai: {
    icon: Sparkles,
    color: "#10a37f",
    label: "OpenAI",
    app: "OpenAI",
    ghlColor: "#10a37f",
    n8nColor: "#10a37f",
    makeColor: "#10a37f",
    logo: "/chatgpt.svg",
  },
  drive: {
    icon: HardDrive,
    color: "#4285F4",
    label: "Drive",
    app: "Google Drive",
    ghlColor: "#4285F4",
    n8nColor: "#4285F4",
    makeColor: "#4285F4",
    logo: "/googledrive.svg",
  },
  sheets: {
    icon: Table2,
    color: "#34A853",
    label: "Sheets",
    app: "Google Sheets",
    ghlColor: "#34A853",
    n8nColor: "#34A853",
    makeColor: "#34A853",
    logo: "/googlesheets.svg",
  },
  notion: {
    icon: Database,
    color: "#ffffff",
    label: "Notion",
    app: "Notion",
    ghlColor: "#a3a3a3",
    n8nColor: "#e5e5e5",
    makeColor: "#111111",
    logo: "/notion.svg",
  },
  calendar: {
    icon: Clock,
    color: "#4285F4",
    label: "Calendar",
    app: "Google Calendar",
    ghlColor: "#4285F4",
    n8nColor: "#4285F4",
    makeColor: "#4285F4",
    logo: "/googlecalendar.svg",
  },
  airtable: {
    icon: Table2,
    color: "#18BFFF",
    label: "Airtable",
    app: "Airtable",
    ghlColor: "#18BFFF",
    n8nColor: "#18BFFF",
    makeColor: "#18BFFF",
    logo: "/airtable.svg",
  },
  error: {
    icon: Bug,
    color: "#ef4444",
    label: "Error",
    app: "Error Trigger",
    n8nAction: "errorTrigger",
    ghlColor: "#ef4444",
    n8nColor: "#f87171",
  },
  parser: {
    icon: Braces,
    color: "#a78bfa",
    label: "Parser",
    app: "Output Parser",
    n8nAction: "structuredOutputParser",
    ghlColor: "#a78bfa",
    n8nColor: "#a78bfa",
  },
};

export function nodeMeta(type) {
  return TYPE_META[type] || TYPE_META.action;
}

export function splitBranches(nodes) {
  const conditionIndexes = nodes
    .map((n, i) => (!n.branch && n.type === "condition" ? i : -1))
    .filter((i) => i >= 0);
  // Use the last IF/Switch before branches so earlier IFs stay in the trunk
  const conditionIndex = conditionIndexes.length
    ? conditionIndexes[conditionIndexes.length - 1]
    : Math.max(
        0,
        nodes.findIndex((n) => n.type === "condition" && !n.branch)
      );
  return {
    conditionIndex,
    trunk: nodes.slice(0, conditionIndex + 1).filter((n) => !n.branch),
    yesNodes: nodes.filter((n) => n.branch === "yes"),
    noNodes: nodes.filter((n) => n.branch === "no"),
    sideNodes: nodes.filter((n) => n.branch === "side"),
    errorNodes: nodes.filter((n) => n.branch === "error"),
    mergeTail: nodes.filter((n, i) => i > conditionIndex && !n.branch),
  };
}

function ZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset, light }) {
  const btn = light
    ? "p-1 rounded-md bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
    : "p-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700";
  return (
    <div className="flex items-center gap-1">
      <span
        className={`hidden sm:inline text-[10px] tabular-nums w-9 text-center ${
          light ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {Math.round(zoom * 100)}%
      </span>
      <button type="button" onClick={onZoomOut} className={btn} aria-label="Zoom out">
        <Minus className="w-3 h-3" />
      </button>
      <button type="button" onClick={onZoomIn} className={btn} aria-label="Zoom in">
        <Plus className="w-3 h-3" />
      </button>
      <button type="button" onClick={onZoomReset} className={btn} aria-label="Reset zoom">
        <Maximize2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function useZoom(animateKey, initial = 1) {
  const [zoom, setZoom] = useState(initial);
  useEffect(() => setZoom(initial), [animateKey, initial]);
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 100) / 100)),
    []
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(0.55, Math.round((z - 0.1) * 100) / 100)),
    []
  );
  const zoomReset = useCallback(() => setZoom(initial), [initial]);
  return { zoom, zoomIn, zoomOut, zoomReset };
}

/** Click-drag (and touch-drag) to pan the canvas freely in any direction */
function useCanvasPan(animateKey) {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    offsetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    drag.current.active = false;
  }, [animateKey]);

  const isInteractive = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        "button, a, input, textarea, select, [role='button'], [data-no-pan]"
      )
    );
  };

  const onPointerDown = useCallback((e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (isInteractive(e.target)) return;
    const el = ref.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
    };
    setIsDragging(true);
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const next = {
      x: drag.current.originX + (e.clientX - drag.current.startX),
      y: drag.current.originY + (e.clientY - drag.current.startY),
    };
    offsetRef.current = next;
    setOffset(next);
  }, []);

  const endDrag = useCallback((e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    const el = ref.current;
    try {
      if (e?.pointerId != null) el?.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    ref,
    isDragging,
    offset,
    panProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: (e) => {
        if (drag.current.active && e.buttons === 0) endDrag(e);
      },
    },
  };
}

/* ═══════════════════════════════════════════
   ZAPIER - light vertical zap (Paths A / B)
   ═══════════════════════════════════════════ */

function ZapStepCard({ node, stepNumber, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon = meta.icon;
  const logo = typeof node.logo === "string" ? node.logo : meta.logo;
  const isTrigger = node.type === "trigger";

  return (
    <div
      className="wf-anim relative w-full max-w-[300px] mx-auto rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] px-3.5 py-3"
      style={{ animationDelay: `${animateDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/5"
          style={{ background: `${meta.color}14` }}
        >
          {logo ? (
            <img src={logo} alt="" className="w-5 h-5 object-contain" />
          ) : (
            <Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.2} />
          )}
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: meta.color, background: `${meta.color}14` }}
        >
          {meta.app}
        </span>
        {isTrigger && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
            Instant
          </span>
        )}
      </div>
      <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-800 leading-snug">
        {stepNumber}. {node.label}
      </p>
    </div>
  );
}

function ZapArrow() {
  return (
    <div className="relative flex flex-col items-center w-full h-10" aria-hidden>
      <svg width="24" height="40" viewBox="0 0 24 40" className="overflow-visible">
        <line x1="12" y1="0" x2="12" y2="30" stroke="#8b7cf6" strokeWidth="1.75" />
        <path d="M8,28 L12,36 L16,28 Z" fill="#8b7cf6" />
      </svg>
    </div>
  );
}

/** Zapier path split: trunk → T-bar → legs aligned to equal column centers */
function ZapPathJunction({ labels = ["Path A", "Path B"] }) {
  const cols = Math.max(labels.length, 2);
  const centers = Array.from({ length: cols }, (_, i) => ((i + 0.5) / cols) * 100);
  const left = centers[0];
  const right = centers[centers.length - 1];
  return (
    <div className="w-full max-w-xl mx-auto" aria-hidden>
      <div className="relative h-14">
        <div className="absolute left-1/2 top-0 h-5 w-[1.75px] -translate-x-1/2 bg-[#8b7cf6]" />
        <div
          className="absolute top-5 h-[1.75px] bg-[#8b7cf6]"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />
        {centers.map((pct) => (
          <div
            key={pct}
            className="absolute top-5 bottom-0 w-[1.75px] -translate-x-1/2 bg-[#8b7cf6]"
            style={{ left: `${pct}%` }}
          >
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#8b7cf6]" />
          </div>
        ))}
      </div>
      <div
        className={`grid -mt-1 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {labels.map((label) => (
          <div key={label} className="flex justify-center">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-zinc-200 text-zinc-600 shadow-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ZapierCanvas({ nodes, branched, animateKey, title }) {
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom(animateKey);
  const { ref: panRef, isDragging, offset, panProps } = useCanvasPan(animateKey);
  const { trunk, yesNodes, noNodes, sideNodes, mergeTail } = splitBranches(nodes);

  const PathColumn = ({ label, items, startNum }) => (
    <div className="flex flex-col items-center w-full max-w-[280px] mx-auto relative">
      {items.map((n, i) => (
        <React.Fragment key={`${label}-${i}`}>
          {i > 0 && <ZapArrow />}
          <ZapStepCard node={n} stepNumber={startNum + i} animateDelay={(startNum + i) * 40} />
        </React.Fragment>
      ))}
    </div>
  );

  const yesStart = trunk.length + 1;
  const sideStart = yesStart + yesNodes.length;
  const noStart = sideStart + sideNodes.length;
  const mergeStart = noStart + noNodes.length;
  const pathLabels = [
    yesNodes.length > 0 && "Path A",
    sideNodes.length > 0 && "Path C",
    noNodes.length > 0 && "Path B",
  ].filter(Boolean);
  const colCount = pathLabels.length || 1;

  const body = branched ? (
    <div className="flex flex-col items-center max-w-3xl mx-auto px-2 py-4">
      {trunk.map((n, i) => (
        <React.Fragment key={`t-${i}`}>
          {i > 0 && <ZapArrow />}
          <ZapStepCard node={n} stepNumber={i + 1} animateDelay={i * 45} />
        </React.Fragment>
      ))}
      {colCount > 0 && (
        <>
          <ZapArrow />
          <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3 sm:p-4 mt-0">
            <div className="flex justify-center mb-1">
              <span className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-[10px] font-bold text-violet-600 shadow-sm">
                {trunk.length}. Split into paths
              </span>
            </div>
            <ZapPathJunction labels={pathLabels} />
            <div
              className={`grid mt-3 ${
                colCount === 1
                  ? "grid-cols-1 max-w-[300px] mx-auto"
                  : colCount === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }`}
            >
              {yesNodes.length > 0 && (
                <PathColumn label="Path A" items={yesNodes} startNum={yesStart} />
              )}
              {sideNodes.length > 0 && (
                <PathColumn label="Path C" items={sideNodes} startNum={sideStart} />
              )}
              {noNodes.length > 0 && (
                <PathColumn label="Path B" items={noNodes} startNum={noStart} />
              )}
            </div>
          </div>
        </>
      )}
      {mergeTail.map((n, i) => (
        <React.Fragment key={`m-${i}`}>
          <ZapArrow />
          <ZapStepCard node={n} stepNumber={mergeStart + i} animateDelay={(mergeStart + i) * 40} />
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center px-3 py-4">
      {nodes.map((n, i) => (
        <React.Fragment key={`L-${i}`}>
          {i > 0 && <ZapArrow />}
          <ZapStepCard node={n} stepNumber={i + 1} animateDelay={i * 45} />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 bg-[#f7f7f8] shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF4A00] flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" strokeWidth={0} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs text-zinc-900 truncate font-semibold">{title}</p>
            <p className="text-[10px] text-zinc-500">Zapier · Zap editor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> On
          </span>
          <ZoomControls
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onZoomReset={zoomReset}
            light
          />
        </div>
      </div>
      <div
        ref={panRef}
        {...panProps}
        className={`relative overflow-hidden max-h-[320px] sm:max-h-[400px] md:max-h-[520px] touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      >
        <div
          className="will-change-transform py-6 px-4 sm:px-8"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "top center",
            width: "100%",
            minWidth: 720,
          }}
        >
          {body}
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-zinc-400 pointer-events-none pb-1">
          Drag canvas to pan in any direction
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GOHIGHLEVEL - light Standard Builder
   Icons matched to GHL Actions menu (Recent / Contact / Communication / Internal / Send data)
   ═══════════════════════════════════════════ */

/**
 * Soft-box = tinted tile + colored glyph (Recent Actions style)
 * Solid = filled tile + white glyph (Communication Send email/SMS style)
 */
const GHL_NODE_VISUAL = {
  trigger: {
    Icon: CalendarCheck2,
    soft: true,
    iconColor: "#0D9488",
    bg: "#CCFBF1",
    label: "Trigger",
  },
  wait: {
    Icon: Clock,
    soft: true,
    iconColor: "#9333EA",
    bg: "#F3E8FF",
    label: "Wait",
  },
  condition: {
    Icon: GitBranch,
    soft: true,
    iconColor: "#7C3AED",
    bg: "#EDE9FE",
    label: "If / Else",
  },
  // Communication - Recent Actions soft green tiles
  email: {
    Icon: Mail,
    soft: true,
    iconColor: "#16A34A",
    bg: "#DCFCE7",
    label: "Email",
  },
  sms: {
    Icon: MessageSquare,
    soft: true,
    iconColor: "#16A34A",
    bg: "#DCFCE7",
    label: "SMS",
  },
  // Apps → Gmail only when type is explicitly gmail
  gmail: {
    logo: "/gmail.svg",
    soft: true,
    bg: "#FFFFFF",
    border: true,
    label: "Gmail",
  },
  // Send data - blue webhook glyph
  webhook: {
    Icon: Rss,
    soft: true,
    iconColor: "#2563EB",
    bg: "#DBEAFE",
    label: "Webhook",
  },
  // Contact - blue soft boxes
  crm: {
    Icon: Contact2,
    soft: true,
    iconColor: "#2563EB",
    bg: "#DBEAFE",
    label: "Contact",
  },
  action: {
    Icon: CircleCheckBig,
    soft: true,
    iconColor: "#2563EB",
    bg: "#DBEAFE",
    label: "Action",
  },
  // Default internal notification = green bell (Slack logo when label mentions Slack)
  notify: {
    Icon: BellRing,
    soft: true,
    iconColor: "#16A34A",
    bg: "#DCFCE7",
    label: "Notification",
  },
  openai: {
    logo: "/chatgpt.svg",
    soft: true,
    bg: "#FFFFFF",
    border: true,
    label: "AI",
  },
  sheets: {
    logo: "/googlesheets.svg",
    soft: true,
    bg: "#FFFFFF",
    border: true,
    label: "Google Sheets",
  },
};

function resolveGhlVisual(node) {
  const meta = nodeMeta(node.type);
  const label = node.label || "";
  const preset = GHL_NODE_VISUAL[node.type] || {
    Icon: meta.icon || Settings2,
    soft: true,
    iconColor: meta.ghlColor || "#2563EB",
    bg: `${meta.ghlColor || "#2563EB"}22`,
    label: meta.label,
  };

  // Appointment booked / calendar triggers
  if (node.type === "trigger") {
    if (/contact tag|tag added|reactiv/i.test(label) || node.ghlIcon === "tag") {
      return {
        Icon: Tag,
        soft: true,
        iconColor: "#2563EB",
        bg: "#DBEAFE",
        label: "Trigger",
      };
    }
    if (/replied|customer replied|reply/i.test(label) || node.ghlIcon === "sms-reply") {
      return {
        Icon: MessageSquare,
        soft: false,
        bg: "#22C55E",
        label: "Trigger",
      };
    }
    if (/appointment|booked|calendar/i.test(label)) {
      return {
        Icon: CalendarCheck2,
        soft: true,
        iconColor: "#2563EB",
        bg: "#DBEAFE",
        label: "Trigger",
      };
    }
    if (/form|submit/i.test(label)) {
      return {
        Icon: FormInput,
        soft: true,
        iconColor: "#0D9488",
        bg: "#CCFBF1",
        label: "Trigger",
      };
    }
    if (/payment|stripe|checkout\.session/i.test(label) || /stripe|checkout/i.test(node.detail || "")) {
      return {
        logo: "/stripe.svg",
        soft: false,
        bg: "#FFFFFF",
        border: true,
        label: "Trigger",
      };
    }
  }

  // GHL If / Else on canvas often shows braces
  if (node.type === "condition") {
    return {
      Icon: Braces,
      soft: false,
      bg: "#3B82F6",
      label: "If / Else",
    };
  }

  // Wait - purple clock (canvas style)
  if (node.type === "wait") {
    return {
      Icon: Clock,
      soft: false,
      bg: "#A855F7",
      label: "Wait",
    };
  }

  // Contact: tags
  if (
    node.type === "crm" &&
    (/^tag:/i.test(label) || /add tag|remove tag|contact tag/i.test(label))
  ) {
    return {
      Icon: Tag,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Contact",
    };
  }

  // Contact: update custom / write fields
  if (node.type === "crm" && /field|custom|write appt|upsert|sync|timeline|note/i.test(label)) {
    return {
      Icon: Contact2,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Contact",
    };
  }

  // Contact / opportunity pipeline
  if (node.type === "crm" && /pipeline|stage|opportunity|move/i.test(label)) {
    return {
      Icon: GitBranch,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Contact",
    };
  }

  // Assign to user
  if (/assign/i.test(label) && (node.type === "action" || node.type === "crm")) {
    return {
      Icon: UserRound,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Contact",
    };
  }

  // Add task
  if (node.type === "action" && /task|checklist/i.test(label)) {
    return {
      Icon: CircleCheckBig,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Action",
    };
  }

  // Slack app vs Send internal notification
  if (node.type === "notify") {
    if (/slack/i.test(label)) {
      return {
        logo: "/slack.png",
        soft: true,
        bg: "#FFFFFF",
        border: true,
        label: "Slack",
      };
    }
    return {
      Icon: BellRing,
      soft: true,
      iconColor: "#16A34A",
      bg: "#DCFCE7",
      label: "Notification",
    };
  }

  // Webhook / ICS hook stays Send data blue
  if (node.type === "webhook") {
    return {
      Icon: Rss,
      soft: true,
      iconColor: "#2563EB",
      bg: "#DBEAFE",
      label: "Webhook",
    };
  }

  return {
    Icon: preset.Icon || meta.icon,
    logo: typeof node.logo === "string" ? node.logo : preset.logo,
    soft: preset.soft !== false,
    iconColor: preset.iconColor,
    bg: preset.bg,
    border: preset.border,
    label: preset.label || meta.label,
  };
}

function GhlNode({ node, animateDelay = 0 }) {
  const visual = resolveGhlVisual(node);
  const Icon = visual.Icon || Settings2;

  return (
    <div
      className="wf-anim relative w-full max-w-[280px] mx-auto rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${animateDelay}ms` }}
    >
      <div className="flex items-start gap-2.5 p-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            visual.border ? "border border-zinc-200" : ""
          }`}
          style={{ background: visual.bg }}
        >
          {visual.logo ? (
            <img src={visual.logo} alt="" className="w-5 h-5 object-contain" />
          ) : visual.soft ? (
            <Icon
              className="w-[18px] h-[18px]"
              style={{ color: visual.iconColor }}
              strokeWidth={2.1}
            />
          ) : (
            <Icon className="w-[18px] h-[18px] text-white" strokeWidth={2.25} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-zinc-800 leading-snug">{node.label}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
            {node.detail || node.subtitle || visual.label}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-zinc-100 bg-zinc-50/80 rounded-b-xl">
        <button type="button" className="text-[10px] text-sky-600 font-medium inline-flex items-center gap-1">
          <BarChart2 className="w-3 h-3" /> Stats
        </button>
        <Copy className="w-3 h-3 text-zinc-400" />
      </div>
    </div>
  );
}

function GhlPlusConnector() {
  return (
    <div
      className="relative flex flex-col items-center justify-start w-full h-11 shrink-0 -my-px"
      aria-hidden
    >
      <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        className="overflow-visible block mx-auto"
      >
        <line x1="20" y1="0" x2="20" y2="12" stroke="#cbd5e1" strokeWidth="1.75" />
        <circle cx="20" cy="22" r="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="20" y1="17" x2="20" y2="27" stroke="#64748b" strokeWidth="1.75" />
        <line x1="15" y1="22" x2="25" y2="22" stroke="#64748b" strokeWidth="1.75" />
        <line x1="20" y1="31" x2="20" y2="44" stroke="#cbd5e1" strokeWidth="1.75" />
      </svg>
    </div>
  );
}

function GhlWireStub({ h = 16 }) {
  return (
    <div
      className="w-[1.75px] bg-slate-300 shrink-0 -my-px rounded-full mx-auto"
      style={{ height: h }}
      aria-hidden
    />
  );
}

/** Fork trunk into two equal column centers (25% / 75%) */
function GhlBranchJunction() {
  return (
    <div className="w-full h-16 relative shrink-0 -my-px" aria-hidden>
      <div className="absolute left-1/2 top-0 h-4 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      <div className="absolute left-1/2 top-4 z-[1] flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-slate-400 bg-white text-slate-500">
        <Plus className="h-2.5 w-2.5" strokeWidth={2.5} />
      </div>
      <div className="absolute left-1/2 top-[34px] h-2 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      <div className="absolute left-[25%] right-[25%] top-9 h-[1.75px] bg-slate-300" />
      <div className="absolute left-[25%] top-9 bottom-0 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      <div className="absolute left-[75%] top-9 bottom-0 w-[1.75px] -translate-x-1/2 bg-slate-300" />
    </div>
  );
}

/**
 * Join trigger columns (including Add New Trigger) into one trunk.
 * CSS %-based so wires stay locked to column centers (no SVG stretch gaps).
 */
function GhlTriggerMerge({ columns = 1 }) {
  if (columns <= 1) {
    return (
      <div className="w-full h-6 relative shrink-0 -my-px" aria-hidden>
        <div className="absolute left-1/2 top-0 bottom-0 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      </div>
    );
  }

  const centers = Array.from({ length: columns }, (_, i) => ((i + 0.5) / columns) * 100);
  const left = centers[0];
  const right = centers[centers.length - 1];

  return (
    <div className="w-full h-12 relative shrink-0 -my-px" aria-hidden>
      {centers.map((pct) => (
        <div
          key={pct}
          className="absolute top-0 h-[18px] w-[1.75px] -translate-x-1/2 bg-slate-300"
          style={{ left: `${pct}%` }}
        />
      ))}
      {/* left arm */}
      <div
        className="absolute top-[18px] h-[1.75px] bg-slate-300"
        style={{ left: `${left}%`, width: `calc(${50 - left}%)` }}
      />
      {/* right arm */}
      <div
        className="absolute top-[18px] h-[1.75px] bg-slate-300"
        style={{ left: "50%", width: `calc(${right - 50}%)` }}
      />
      {/* trunk down into the next + connector */}
      <div className="absolute left-1/2 top-[18px] bottom-0 w-[1.75px] -translate-x-1/2 bg-slate-300" />
    </div>
  );
}

/** Join two lanes (25% / 75%) back to trunk */
function GhlBranchMerge() {
  return (
    <div className="w-full h-11 relative shrink-0 -my-px" aria-hidden>
      <div className="absolute left-[25%] top-0 h-3 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      <div className="absolute left-[75%] top-0 h-3 w-[1.75px] -translate-x-1/2 bg-slate-300" />
      <div className="absolute left-[25%] right-[25%] top-3 h-[1.75px] bg-slate-300" />
      <div className="absolute left-1/2 top-3 bottom-0 w-[1.75px] -translate-x-1/2 bg-slate-300" />
    </div>
  );
}

function GhlAddTriggerCard() {
  return (
    <div className="w-full max-w-[280px] mx-auto rounded-xl border-2 border-dashed border-sky-400 bg-transparent min-h-[92px] h-full flex items-center justify-center px-3 py-4">
      <div className="flex items-center justify-center gap-2">
        <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
        <span className="text-[12px] sm:text-[13px] font-medium text-sky-600 text-center leading-snug">
          Add New Trigger
        </span>
      </div>
    </div>
  );
}

/**
 * Real triggers + Add New Trigger as equal columns; wires merge on-center into the trunk.
 */
function GhlTriggerRow({ triggers }) {
  const list = triggers.length ? triggers : [{ label: "Trigger", type: "trigger" }];
  const cols = list.length + 1; // + Add New Trigger
  const widthClass = cols >= 3 ? "max-w-3xl" : "max-w-xl";
  return (
    <div className={`relative w-full mx-auto overflow-visible ${widthClass}`}>
      <div
        className="w-full grid items-end"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {list.map((node, i) => (
          <div key={`trig-${i}`} className="flex flex-col items-center min-w-0 px-1.5 sm:px-2.5">
            <GhlNode node={node} animateDelay={i * 35} />
          </div>
        ))}
        <div className="flex flex-col items-center min-w-0 px-1.5 sm:px-2.5 self-stretch">
          <GhlAddTriggerCard />
        </div>
      </div>
      <GhlTriggerMerge columns={cols} />
    </div>
  );
}

function GhlBranchLane({ label, tone, nodes, animateBase, showMergeStub }) {
  const pill =
    tone === "yes"
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : "text-orange-600 bg-orange-50 border-orange-200";
  return (
    <div className="flex flex-col items-center w-full h-full relative px-1">
      <GhlWireStub h={22} />
      <span
        className={`absolute top-0 text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 rounded z-10 ${pill}`}
      >
        {label}
      </span>
      {nodes.map((node, i) => (
        <React.Fragment key={`${label}-${i}`}>
          {i > 0 && <GhlPlusConnector />}
          <GhlNode node={node} animateDelay={(animateBase + i) * 40} />
        </React.Fragment>
      ))}
      {showMergeStub && (
        <div className="w-[1.75px] flex-1 min-h-[18px] bg-slate-300 mx-auto -my-px rounded-full" />
      )}
    </div>
  );
}

export function GhlCanvas({ nodes, branched, animateKey, title, branchLabels }) {
  const multiTrigger =
    (nodes || []).filter((n) => n.type === "trigger" && !n.branch).length > 1;
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom(
    animateKey,
    multiTrigger ? 0.7 : 0.9
  );
  const { ref: panRef, isDragging, offset, panProps } = useCanvasPan(animateKey);
  const { trunk, yesNodes, noNodes, sideNodes, mergeTail } = splitBranches(
    branched ? nodes : nodes.map((n) => ({ ...n, branch: undefined }))
  );

  const sourceNodes = branched ? trunk : nodes;
  const triggerNodes = [];
  let trunkIdx = 0;
  while (trunkIdx < sourceNodes.length && sourceNodes[trunkIdx]?.type === "trigger") {
    triggerNodes.push(sourceNodes[trunkIdx]);
    trunkIdx += 1;
  }
  if (!triggerNodes.length && sourceNodes[0]) {
    triggerNodes.push({ ...sourceNodes[0], type: "trigger" });
    trunkIdx = Math.min(1, sourceNodes.length);
  }
  const trunkActions = sourceNodes.slice(trunkIdx);
  const timeoutNodes = noNodes.length ? noNodes : sideNodes;
  const yesLabel = branchLabels?.yes || "Yes";
  const noLabel = branchLabels?.no || "No";
  const hasBranches = branched && (yesNodes.length > 0 || timeoutNodes.length > 0);
  // Always room for trigger + Add New (2 cols); wider when dual real triggers
  const flowWidth = triggerNodes.length > 1 ? "max-w-3xl" : "max-w-xl";

  const body = (
    <div className="relative flex flex-col items-center max-w-4xl mx-auto px-2 py-5 overflow-visible">
      <div className={`w-full mx-auto flex flex-col items-center overflow-visible ${flowWidth}`}>
        <GhlTriggerRow
          triggers={
            triggerNodes.length
              ? triggerNodes
              : [{ label: "Trigger", type: "trigger" }]
          }
        />

        {trunkActions.map((n, i) => (
          <React.Fragment key={`trunk-${i}`}>
            <GhlPlusConnector />
            <GhlNode node={n} animateDelay={(i + 1) * 45} />
          </React.Fragment>
        ))}

        {hasBranches && (
          <>
            <GhlBranchJunction />
            <div className="w-full grid grid-cols-2 items-stretch">
              <GhlBranchLane
                label={yesLabel}
                tone="yes"
                nodes={yesNodes}
                animateBase={0}
                showMergeStub={mergeTail.length > 0}
              />
              <GhlBranchLane
                label={noLabel}
                tone="no"
                nodes={timeoutNodes}
                animateBase={8}
                showMergeStub={mergeTail.length > 0}
              />
            </div>
            {mergeTail.length > 0 && (
              <>
                <GhlBranchMerge />
                {mergeTail.map((n, i) => (
                  <React.Fragment key={`merge-${i}`}>
                    {i > 0 ? <GhlPlusConnector /> : null}
                    <GhlNode node={n} animateDelay={(i + 12) * 40} />
                  </React.Fragment>
                ))}
              </>
            )}
          </>
        )}

        {branched &&
          !hasBranches &&
          mergeTail.map((n, i) => (
            <React.Fragment key={`merge-only-${i}`}>
              <GhlPlusConnector />
              <GhlNode node={n} animateDelay={(i + 12) * 40} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 bg-[#eef1f4] shadow-xl shadow-black/20">
      {/* GHL top chrome */}
      <div className="bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <button type="button" className="text-[11px] text-sky-600 inline-flex items-center gap-0.5 font-medium">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Workflows
          </button>
          <p className="text-[11px] sm:text-xs font-semibold text-zinc-800 truncate max-w-[45%] text-center">
            {title}
          </p>
          <button
            type="button"
            className="text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded-md"
          >
            Save
          </button>
        </div>
        <div className="flex items-center gap-4 px-3 text-[11px] border-t border-zinc-100">
          {["Builder", "Settings", "Enrollment History", "Execution Logs"].map((tab, i) => (
            <span
              key={tab}
              className={`py-2 border-b-2 ${
                i === 0
                  ? "border-sky-600 text-sky-700 font-semibold"
                  : "border-transparent text-zinc-500"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-50 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-600 border border-zinc-200 bg-white px-2 py-1 rounded">
              Standard Builder ▾
            </span>
            <button
              type="button"
              className="text-[11px] text-sky-700 font-medium border border-sky-200 bg-sky-50 px-2 py-1 rounded inline-flex items-center gap-1"
            >
              <Play className="w-3 h-3" /> Test Workflow
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500">Draft</span>
            <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-emerald-500 px-0.5">
              <span className="ml-auto h-4 w-4 rounded-full bg-white shadow" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-700">Publish</span>
            <ZoomControls
              zoom={zoom}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onZoomReset={zoomReset}
              light
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[280px]">
        <div className="hidden md:flex w-10 flex-col items-center gap-2.5 py-3 border-r border-zinc-200 bg-white text-zinc-400">
          {[MessageSquare, Zap, BarChart2, Database, Webhook, Settings2, MoreHorizontal].map(
            (Icon, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-zinc-100"
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            )
          )}
        </div>
        <div
          ref={panRef}
          {...panProps}
          className={`relative flex-1 overflow-hidden max-h-[320px] sm:max-h-[420px] md:max-h-[560px] touch-none select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: `${offset.x}px ${offset.y}px`,
            backgroundColor: "#f1f5f9",
          }}
        >
          <div
            className="will-change-transform py-6 px-4 sm:px-8"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: "top center",
              width: "100%",
              minWidth: 640,
            }}
          >
            {body}
          </div>
          <div className="absolute bottom-2 right-2 w-20 h-14 rounded border border-zinc-300 bg-white/90 shadow-sm pointer-events-none overflow-hidden opacity-80">
            <div className="absolute inset-1 grid grid-cols-3 gap-0.5 p-0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[1px] bg-zinc-300" />
              ))}
            </div>
          </div>
          <p className="absolute bottom-2 left-2 text-[10px] text-zinc-500 bg-white/80 border border-zinc-200 px-2 py-0.5 rounded pointer-events-none">
            Drag to pan
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   n8n - authentic LTR canvas + Bézier wires
   ═══════════════════════════════════════════ */

const N8N_NODE_W = 168;
const N8N_NODE_H = 72;
const N8N_H_GAP = 78;
const N8N_V_LANE = 48;
const N8N_PAD = 48;
const N8N_WIRE = "#909399";

function n8nBezier(x1, y1, x2, y2) {
  const dx = Math.max(Math.abs(x2 - x1) * 0.45, 48);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function n8nOut(pos) {
  return { x: pos.x + N8N_NODE_W, y: pos.y + N8N_NODE_H / 2 };
}
function n8nIn(pos) {
  return { x: pos.x, y: pos.y + N8N_NODE_H / 2 };
}
function n8nBottom(pos) {
  return { x: pos.x + N8N_NODE_W / 2, y: pos.y + N8N_NODE_H };
}
function n8nTop(pos) {
  return { x: pos.x + N8N_NODE_W / 2, y: pos.y };
}

/** Layout trunk → branched lanes → optional detached error strip */
function layoutN8nGraph({
  trunk,
  yesNodes,
  noNodes,
  sideNodes,
  mergeTail,
  errorNodes,
  branchLabels,
}) {
  const placed = [];
  const edges = [];
  const byKey = {};
  let idSeq = 0;
  const add = (node, x, y) => {
    const id = `n${idSeq++}`;
    placed.push({ id, node, x, y });
    if (node.key) byKey[node.key] = id;
    return id;
  };

  const labels = {
    yes: branchLabels?.yes || "true",
    no: branchLabels?.no || "false",
    side: branchLabels?.side || "extra",
  };

  const lanes = [
    yesNodes.length > 0 && { key: "yes", label: labels.yes, nodes: yesNodes },
    // Include an empty false lane when a merge tail exists (false → merge with no nodes)
    (noNodes.length > 0 ||
      (mergeTail.length > 0 && yesNodes.length > 0)) && {
      key: "no",
      label: labels.no,
      nodes: noNodes,
    },
    sideNodes.length > 0 && { key: "side", label: labels.side, nodes: sideNodes },
  ].filter(Boolean);

  const laneCount = Math.max(lanes.length, 1);
  const branchBlockH =
    laneCount * N8N_NODE_H + Math.max(0, laneCount - 1) * N8N_V_LANE;
  const hasAgentSubs = trunk.some((n) => n.subs?.length);
  const allNodes = [
    ...trunk,
    ...yesNodes,
    ...noNodes,
    ...sideNodes,
    ...mergeTail,
    ...(errorNodes || []),
  ];
  const hasLoop = allNodes.some((n) => n.loopBackTo);
  const midY =
    N8N_PAD +
    Math.max(0, (branchBlockH - N8N_NODE_H) / 2) +
    (hasAgentSubs ? 72 : 0) +
    (hasLoop ? 24 : 0);

  let x = N8N_PAD;
  let prevId = null;
  const pendingLoops = [];

  const chain = trunk.length ? trunk : [];
  chain.forEach((node, ni) => {
    const id = add(node, x, midY);
    if (prevId) {
      const fromNode = chain[ni - 1];
      edges.push({
        from: prevId,
        to: id,
        label: fromNode?.wireLabel || "1 item",
        meta: fromNode?.wireMeta || null,
        tone: "run",
      });
    }
    if (node.subs?.length) {
      // Attach chat model / parser under agent ports (n8n Tools Agent layout)
      const subY = midY + N8N_NODE_H + 72;
      const span = Math.max(N8N_NODE_W + 120, N8N_AGENT_PORTS.length * 52);
      const left = x + N8N_NODE_W / 2 - span / 2;
      node.subs.forEach((sub) => {
        const port = sub.port || "Chat Model";
        let pi = N8N_AGENT_PORTS.findIndex(
          (p) => p.toLowerCase() === port.toLowerCase()
        );
        if (pi < 0) {
          if (/model/i.test(port)) pi = 0;
          else if (/parser/i.test(port)) pi = 3;
          else pi = 0;
        }
        const slotX =
          left +
          (pi + 0.5) * (span / N8N_AGENT_PORTS.length) -
          N8N_NODE_W / 2;
        const sid = add(sub, slotX, subY);
        edges.push({
          from: id,
          to: sid,
          label: port,
          tone: "sub",
          fromPort: "bottom",
          toPort: "top",
          fromAnchorX:
            x +
            ((pi + 0.5) / N8N_AGENT_PORTS.length) * N8N_NODE_W,
        });
      });
    }
    if (node.loopBackTo) {
      pendingLoops.push({ fromId: id, toKey: node.loopBackTo });
    }
    prevId = id;
    x += N8N_NODE_W + N8N_H_GAP;
  });

  const ifId = prevId;
  const branchStartX = x;
  const laneMeta = [];

  if (ifId && lanes.length) {
    const firstLaneY = midY - ((laneCount - 1) * (N8N_NODE_H + N8N_V_LANE)) / 2;
    lanes.forEach((lane, li) => {
      let bx = branchStartX;
      const ly = firstLaneY + li * (N8N_NODE_H + N8N_V_LANE);
      if (!lane.nodes.length) {
        laneMeta.push({
          lastId: ifId,
          endX: branchStartX,
          empty: true,
          branchLabel: lane.label,
          viaY: ly + N8N_NODE_H / 2,
        });
        return;
      }
      let lanePrev = null;
      lane.nodes.forEach((node, ni) => {
        const id = add(node, bx, ly);
        if (node.loopBackTo) {
          pendingLoops.push({ fromId: id, toKey: node.loopBackTo });
        }
        if (ni === 0) {
          edges.push({
            from: ifId,
            to: id,
            label: lane.label,
            tone: "branch",
          });
        } else {
          edges.push({ from: lanePrev, to: id, label: "1 item", tone: "run" });
        }
        lanePrev = id;
        bx += N8N_NODE_W + N8N_H_GAP;
      });
      laneMeta.push({ lastId: lanePrev, endX: bx - N8N_H_GAP, empty: false });
    });

    if (mergeTail.length && laneMeta.length) {
      const mergeX = Math.max(...laneMeta.map((l) => l.endX)) + N8N_H_GAP;
      let mergePrev = null;
      mergeTail.forEach((node, i) => {
        const id = add(node, mergeX + i * (N8N_NODE_W + N8N_H_GAP), midY);
        if (i === 0) {
          laneMeta.forEach((l) => {
            if (!l.lastId) return;
            edges.push({
              from: l.lastId,
              to: id,
              label: l.empty ? l.branchLabel : "1 item",
              tone: l.empty ? "branch" : "merge",
              viaY: l.empty ? l.viaY : undefined,
            });
          });
        } else {
          edges.push({ from: mergePrev, to: id, label: "1 item", tone: "run" });
        }
        mergePrev = id;
      });
    }
  } else if (mergeTail.length) {
    mergeTail.forEach((node) => {
      const id = add(node, x, midY);
      if (prevId) edges.push({ from: prevId, to: id, label: "1 item", tone: "run" });
      prevId = id;
      x += N8N_NODE_W + N8N_H_GAP;
    });
  }

  pendingLoops.forEach(({ fromId, toKey }) => {
    const toId = byKey[toKey];
    if (toId) {
      edges.push({
        from: fromId,
        to: toId,
        tone: "loop",
        fromPort: "bottom",
        toPort: "bottom",
        label: "",
      });
    }
  });

  let maxX = placed.reduce((m, p) => Math.max(m, p.x + N8N_NODE_W), 0) + N8N_PAD;
  let maxY = placed.reduce((m, p) => Math.max(m, p.y + N8N_NODE_H), 0) + N8N_PAD;
  if (pendingLoops.length) maxY += 90;

  if (errorNodes?.length) {
    const ey = maxY + 36;
    let ex = N8N_PAD;
    let errPrev = null;
    errorNodes.forEach((node) => {
      const id = add(node, ex, ey);
      if (errPrev) {
        edges.push({ from: errPrev, to: id, label: "1 item", tone: "run" });
      }
      errPrev = id;
      ex += N8N_NODE_W + N8N_H_GAP;
    });
    maxX = Math.max(maxX, ex + N8N_PAD);
    maxY = ey + N8N_NODE_H + N8N_PAD;
  }

  return { placed, edges, width: maxX, height: maxY };
}

function layoutN8nLinear(nodes) {
  const placed = [];
  const edges = [];
  let idSeq = 0;
  const add = (node, x, y) => {
    const id = `n${idSeq++}`;
    placed.push({ id, node, x, y });
    return id;
  };

  if (!nodes?.length) {
    return { placed, edges, width: 400, height: 200 };
  }

  const y = N8N_PAD;
  const stride = N8N_NODE_W + N8N_H_GAP;
  const ids = nodes.map((node, i) => add(node, N8N_PAD + i * stride, y));

  for (let i = 1; i < ids.length; i++) {
    edges.push({ from: ids[i - 1], to: ids[i], label: "1 item", tone: "run" });
  }

  const maxX = placed.reduce((m, p) => Math.max(m, p.x + N8N_NODE_W), 0) + N8N_PAD;
  const maxY = placed.reduce((m, p) => Math.max(m, p.y + N8N_NODE_H), 0) + N8N_PAD;
  return { placed, edges, width: maxX, height: maxY };
}

/** Resolve n8n card icon + optional brand logo (node overrides win). */
function resolveN8nVisual(node) {
  const meta = nodeMeta(node.type);
  const sub = (node.subtitle || meta.n8nAction || "").toLowerCase();
  const color = node.n8nColor || meta.n8nColor;

  let iconKey = node.n8nIcon || null;
  if (!iconKey) {
    if (/scheduletrigger|cron/.test(sub) || /daily|schedule/i.test(node.label || "")) {
      iconKey = "clock";
    } else if (/waitwebhook|^wait$|wait\s/i.test(sub) || /^wait /i.test(node.label || "")) {
      iconKey = "pause";
    } else if (/splitinbatches|loop/i.test(sub)) {
      iconKey = "loop";
    } else if (/^manual$|edit fields|set /i.test(sub)) {
      iconKey = "pencil";
    } else if (
      /http|get:|post:|put:|patch:|delete:/i.test(sub) ||
      node.type === "webhook"
    ) {
      iconKey = "globe";
    } else if (
      /structuredoutputparser|outputparser/i.test(sub) ||
      node.n8nIcon === "angles"
    ) {
      iconKey = "angles";
    } else if (node.type === "parser" || /^code$/i.test(sub)) {
      iconKey = "braces";
    } else if (node.type === "condition") {
      iconKey = "signpost";
    } else if (node.type === "openai" || /agent|llm|tools agent|basic llm/i.test(sub)) {
      iconKey = "bot";
    } else if (node.type === "trigger") {
      iconKey = "zap";
    } else if (node.type === "error") {
      iconKey = "bug";
    } else if (node.type === "wait") {
      iconKey = "pause";
    } else if (node.type === "action") {
      iconKey = "pencil";
    }
  }

  // Prefer brand n8n mark over HTTP globe when provided
  if (typeof node.logo === "string") {
    iconKey = iconKey === "globe" ? null : iconKey;
  }

  const Icon =
    (iconKey && N8N_ICON_MAP[iconKey]) || meta.icon || Settings2;

  // Lucide-only node kinds (HTTP, Wait, Set, Code, If, Schedule) - no brand logo.
  // Brand apps (Slack, Notion, OpenAI, GHL, …) keep TYPE_META.logo unless overridden.
  const lucideOnly = [
    "globe",
    "pause",
    "pencil",
    "loop",
    "braces",
    "angles",
    "signpost",
    "clock",
    "bug",
    "bot",
  ].includes(iconKey);

  let logo = null;
  if (node.logo === false || node.logo === null) {
    logo = null;
  } else if (typeof node.logo === "string") {
    logo = node.logo;
  } else if (node.type === "gmail" || node.type === "email") {
    logo = "/gmail.svg";
  } else if (!lucideOnly && meta.logo) {
    logo = meta.logo;
  }

  return { Icon, color, logo, meta };
}

function N8nNodeCard({ node, style, animateDelay = 0 }) {
  const { Icon, color, logo, meta } = resolveN8nVisual(node);
  const isTrigger =
    node.trigger === true ||
    node.type === "trigger" ||
    node.type === "error" ||
    /scheduletrigger|errortrigger/i.test(node.subtitle || "");
  const isCondition = node.type === "condition";
  const subtitle =
    node.hideSubtitle || node.subtitle === ""
      ? null
      : node.subtitle || meta.n8nAction || null;

  return (
    <div
      className="wf-anim absolute z-[2]"
      style={{ ...style, width: N8N_NODE_W, height: N8N_NODE_H, animationDelay: `${animateDelay}ms` }}
    >
      <div
        className={`relative h-full w-full rounded-lg border bg-[#2d2e32] shadow-[0_4px_16px_rgba(0,0,0,0.35)] px-2.5 py-2 flex items-start gap-2 ${
          isCondition ? "" : "border-[#40414a]"
        }`}
        style={
          isCondition
            ? { borderColor: `${color}cc` }
            : undefined
        }
      >
        {isTrigger && node.type !== "error" && (
          <span className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-[#ff6d5a] text-white flex items-center justify-center shadow z-10">
            <Zap className="w-2.5 h-2.5 fill-white" strokeWidth={0} />
          </span>
        )}
        <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#2d2e32] border border-[#909399] z-10" />
        <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#2d2e32] border border-[#909399] z-10" />

        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${color}22` }}
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              className={`w-5 h-5 object-contain ${
                node.type === "notion" || node.logoInvert ? "invert" : ""
              }`}
            />
          ) : (
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[11px] font-semibold text-zinc-100 leading-snug line-clamp-2">
            {node.label}
          </p>
          {subtitle ? (
            <p className="text-[9px] text-zinc-500 leading-tight mt-0.5 truncate">{subtitle}</p>
          ) : null}
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2ecc71] text-white flex items-center justify-center shadow ring-2 ring-[#1a1a1e] z-10">
          <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function N8nEdgeLayer({ placed, edges }) {
  const byId = Object.fromEntries(placed.map((p) => [p.id, p]));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-visible" aria-hidden>
      <defs>
        <marker
          id="n8n-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#b0b4bc" />
        </marker>
      </defs>
      {edges.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return null;
        const p1 =
          e.fromPort === "bottom"
            ? e.fromAnchorX != null
              ? { x: e.fromAnchorX, y: a.y + N8N_NODE_H }
              : n8nBottom(a)
            : e.fromPort === "top"
              ? n8nTop(a)
              : n8nOut(a);
        const p2 =
          e.toPort === "top"
            ? n8nTop(b)
            : e.toPort === "bottom"
              ? n8nBottom(b)
              : n8nIn(b);
        let d;
        if (e.viaY != null) {
          const midX = p1.x + Math.max((p2.x - p1.x) * 0.4, 48);
          d = `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${e.viaY} L ${p2.x} ${e.viaY} L ${p2.x} ${p2.y}`;
        } else if (e.tone === "loop") {
          const y = Math.max(p1.y, p2.y) + 78;
          d = `M ${p1.x} ${p1.y} L ${p1.x} ${y} L ${p2.x} ${y} L ${p2.x} ${p2.y}`;
        } else if (e.tone === "sub") {
          const dy = Math.max((p2.y - p1.y) * 0.55, 28);
          d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
        } else {
          d = n8nBezier(p1.x, p1.y, p2.x, p2.y);
        }
        const stroke =
          e.tone === "sub" ? "#7a7f88" : e.tone === "loop" ? "#8b9099" : "#b0b4bc";
        const midX =
          e.viaY != null
            ? p1.x + Math.max((p2.x - p1.x) * 0.4, 48)
            : (p1.x + p2.x) / 2;
        const midY =
          e.viaY != null
            ? e.viaY
            : e.tone === "loop"
              ? Math.max(p1.y, p2.y) + 78
              : (p1.y + p2.y) / 2 - (e.tone === "branch" ? 0 : 8);

        const labelW = e.label ? Math.max(24, e.label.length * 6.2) : 0;

        return (
          <g key={`${e.from}-${e.to}-${i}`}>
            <path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={e.tone === "loop" ? 1.5 : 1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={e.tone === "sub" ? "4 4" : undefined}
              markerEnd={e.tone === "sub" ? undefined : "url(#n8n-arrow)"}
            />
            {e.label && (
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x={-labelW / 2}
                  y={-6.5}
                  width={labelW}
                  height={13}
                  rx={3}
                  fill="#1e1e22"
                  stroke="#3f3f46"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#d4d4d8"
                  fontSize="8"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {e.label}
                </text>
              </g>
            )}
            {e.meta && (
              <text
                x={midX}
                y={midY + 14}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {e.meta}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function N8nGraphView({ layout }) {
  const { placed, edges, width, height } = layout;
  return (
    <div className="relative" style={{ width, height, minWidth: width, minHeight: height }}>
      <N8nEdgeLayer placed={placed} edges={edges} />
      {placed.map((p, i) => (
        <N8nNodeCard
          key={p.id}
          node={p.node}
          animateDelay={i * 35}
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </div>
  );
}

function N8nBranchedGraph({
  trunk,
  yesNodes,
  noNodes,
  sideNodes,
  mergeTail,
  errorNodes,
  branchLabels,
}) {
  const layout = layoutN8nGraph({
    trunk,
    yesNodes,
    noNodes,
    sideNodes,
    mergeTail,
    errorNodes,
    branchLabels,
  });
  if (!layout.placed.length) {
    return <div className="p-10 text-zinc-500 text-sm">No workflow nodes</div>;
  }
  return (
    <div className="p-2">
      <N8nGraphView layout={layout} />
    </div>
  );
}

function N8nLinearGraph({ nodes }) {
  const layout = layoutN8nLinear(nodes);
  return (
    <div className="p-2">
      <N8nGraphView layout={layout} />
    </div>
  );
}

export function N8nCanvas({ nodes, branched, animateKey, title, branchLabels }) {
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom(animateKey, 0.55);
  const { ref: panRef, isDragging, offset, panProps } = useCanvasPan(animateKey);
  const { trunk, yesNodes, noNodes, sideNodes, mergeTail, errorNodes } = splitBranches(nodes);

  const body = branched ? (
    <N8nBranchedGraph
      trunk={trunk}
      yesNodes={yesNodes}
      noNodes={noNodes}
      sideNodes={sideNodes}
      mergeTail={mergeTail}
      errorNodes={errorNodes}
      branchLabels={branchLabels}
    />
  ) : (
    <N8nLinearGraph nodes={nodes} />
  );

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700/90 bg-[#1a1a1e] shadow-xl shadow-black/40">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-zinc-700/80 bg-[#212126]">
        <div className="min-w-0">
          <p className="text-[10px] text-zinc-500 truncate">
            Personal / <span className="text-zinc-300">{title}</span>
          </p>
          <div className="flex gap-4 mt-1.5 text-[11px]">
            {["Editor", "Executions", "Evaluations"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 0
                    ? "text-[#ff6d5a] font-semibold border-b-2 border-[#ff6d5a] pb-0.5"
                    : "text-zinc-500"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            className="text-[11px] font-semibold text-white bg-[#ff6d5a] hover:bg-[#ff5a44] px-3 py-1.5 rounded-md shadow-sm"
          >
            Publish
          </button>
          <ZoomControls
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onZoomReset={zoomReset}
            light={false}
          />
        </div>
      </div>

      <div className="flex min-h-[300px]">
        <div className="hidden md:flex w-11 flex-col items-center gap-3.5 py-3.5 border-r border-zinc-700/80 bg-[#151518] text-zinc-500">
          {[Zap, Database, MessageSquare, GitBranch, Settings2, Webhook].map((Icon, i) => (
            <Icon key={i} className="w-4 h-4 hover:text-zinc-300 transition-colors" />
          ))}
        </div>
        <div
          ref={panRef}
          {...panProps}
          className={`relative flex-1 overflow-hidden max-h-[300px] sm:max-h-[400px] md:max-h-[520px] touch-none select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            backgroundImage: "radial-gradient(circle, #3f3f46 1.1px, transparent 1.1px)",
            backgroundSize: "18px 18px",
            backgroundPosition: `${offset.x}px ${offset.y}px`,
            backgroundColor: "#1a1a1e",
          }}
        >
          <div
            className="inline-block origin-top-left will-change-transform"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {body}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#ff6d5a] hover:bg-[#ff5a44] px-4 py-2 rounded-full shadow-lg shadow-orange-900/40"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Execute workflow
            </button>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] text-emerald-300 bg-[#212126]/90 border border-emerald-500/35 px-2.5 py-1 rounded-md pointer-events-none backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Workflow executed successfully
          </div>
          <p className="absolute bottom-3 left-3 text-[10px] text-zinc-500 pointer-events-none">
            Drag to pan
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAKE - horizontal scenario (circular modules)
   ═══════════════════════════════════════════ */

function MakeModule({ node, version, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon = meta.icon;
  const color = meta.makeColor || meta.color;
  const logo = typeof node.logo === "string" ? node.logo : meta.logo;

  return (
    <div
      className="wf-anim relative flex flex-col items-center w-[112px] flex-shrink-0"
      style={{ animationDelay: `${animateDelay}ms` }}
    >
      <span className="mb-1.5 text-[9px] font-medium text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
        {version}
      </span>
      <div
        className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-md bg-white border-[3px]"
        style={{ borderColor: color }}
      >
        <div
          className="w-[58px] h-[58px] rounded-full flex items-center justify-center"
          style={{ background: `${color}14` }}
        >
          {logo ? (
            <img src={logo} alt="" className="w-8 h-8 object-contain" />
          ) : (
            <Icon className="w-8 h-8" style={{ color }} strokeWidth={2} />
          )}
        </div>
        {(node.type === "gmail" || node.type === "email") && /trigger|watch/i.test(node.sublabel || node.label || "") && (
          <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow">
            <Clock className="w-3 h-3 text-zinc-500" />
          </span>
        )}
      </div>
      <p className="mt-2.5 text-[11px] font-semibold text-zinc-800 text-center leading-snug line-clamp-2 min-h-[2.2em]">
        {node.label}
      </p>
      {node.sublabel && (
        <p className="text-[9px] text-zinc-500 text-center leading-tight">{node.sublabel}</p>
      )}
    </div>
  );
}

function MakeConnector() {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0 w-14 self-center pt-6" aria-hidden>
      <div
        className="absolute left-0 right-0 top-[42px] border-t-2 border-dotted border-zinc-300"
      />
      <span className="relative z-[1] w-6 h-6 rounded-full bg-white border border-zinc-200 text-zinc-400 flex items-center justify-center shadow-sm">
        <Wrench className="w-3 h-3" />
      </span>
    </div>
  );
}

export function MakeCanvas({ nodes, animateKey, title }) {
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom(animateKey, 0.85);
  const { ref: panRef, isDragging, offset, panProps } = useCanvasPan(animateKey);
  const list = nodes || [];

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 bg-[#fafafa] shadow-xl shadow-black/15">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/make.svg" alt="" className="w-7 h-7 object-contain flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs text-zinc-900 truncate font-semibold">{title}</p>
            <p className="text-[10px] text-zinc-500">Make · Scenario</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            className="text-[11px] font-semibold text-zinc-700 border border-zinc-200 hover:bg-zinc-50 px-2.5 py-1 rounded-md"
          >
            Share
          </button>
          <ZoomControls
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onZoomReset={zoomReset}
            light
          />
        </div>
      </div>

      <div
        ref={panRef}
        {...panProps}
        className={`relative overflow-hidden max-h-[300px] sm:max-h-[380px] md:max-h-[480px] touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          backgroundImage: "radial-gradient(circle, #e4e4e7 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: `${offset.x}px ${offset.y}px`,
          backgroundColor: "#f4f4f5",
        }}
      >
        <div
          className="will-change-transform py-10 px-8 inline-flex items-start min-w-max"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {list.map((n, i) => (
            <React.Fragment key={`${n.label}-${i}`}>
              {i > 0 && <MakeConnector />}
              <MakeModule
                node={n}
                version={`v${i === 0 ? 1 : i + 8}`}
                animateDelay={i * 50}
              />
            </React.Fragment>
          ))}
          <div className="flex flex-col items-center w-[72px] flex-shrink-0 self-center pt-8 ml-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full border-2 border-dashed border-zinc-300 text-zinc-400 flex items-center justify-center hover:border-violet-400 hover:text-violet-500 bg-white/80"
              aria-label="Add module"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#6c2bd9] hover:bg-[#5b21b6] px-3.5 py-1.5 rounded-full shadow-md"
          >
            <Play className="w-3 h-3 fill-white" /> Run once
          </button>
          <span className="text-[10px] text-zinc-500 bg-white/90 border border-zinc-200 px-2 py-1 rounded-full">
            Every 15 minutes
          </span>
        </div>
        <p className="absolute bottom-3 left-3 text-[10px] text-zinc-400 pointer-events-none">
          Drag to pan
        </p>
      </div>
    </div>
  );
}

/** Picks GHL / Zapier / n8n / Make builder from slide.style */
export function WorkflowPlatformCanvas({ slide, animateKey }) {
  const style = slide.style || "zapier";
  const props = {
    nodes: slide.nodes,
    branched: Boolean(slide.branched),
    animateKey,
    title: slide.title,
    branchLabels: slide.branchLabels,
  };

  return (
    <>
      {style === "ghl" ? (
        <GhlCanvas {...props} />
      ) : style === "n8n" ? (
        <N8nCanvas {...props} />
      ) : style === "make" ? (
        <MakeCanvas {...props} />
      ) : (
        <ZapierCanvas {...props} />
      )}
      <style>{`
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
