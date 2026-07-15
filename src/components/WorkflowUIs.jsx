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
  UserPlus,
  MoreHorizontal,
  BarChart2,
  Copy,
  Sparkles,
  Wrench,
  Table2,
  HardDrive,
  Bug,
  Braces,
} from "lucide-react";

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
    color: "#8b5cf6",
    label: "Email",
    app: "Email by Zapier",
    ghlColor: "#6366f1",
    n8nColor: "#818cf8",
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
   ZAPIER — light vertical zap (Paths A / B)
   ═══════════════════════════════════════════ */

function ZapStepCard({ node, stepNumber, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon = meta.icon;
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
          {meta.logo ? (
            <img src={meta.logo} alt="" className="w-5 h-5 object-contain" />
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

/** Zapier path split: vertical trunk → horizontal T-bar → two down arrows */
function ZapPathJunction({ labels = ["Path A", "Path B"] }) {
  const cols = Math.max(labels.length, 2);
  return (
    <div className="w-full max-w-xl mx-auto" aria-hidden>
      <div className="relative h-14">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 56"
          preserveAspectRatio="none"
        >
          {/* trunk down to T */}
          <line x1="200" y1="0" x2="200" y2="20" stroke="#8b7cf6" strokeWidth="1.75" />
          {/* horizontal crossbar */}
          <line
            x1={cols === 3 ? 50 : 80}
            y1="20"
            x2={cols === 3 ? 350 : 320}
            y2="20"
            stroke="#8b7cf6"
            strokeWidth="1.75"
          />
          {/* down stubs into columns */}
          {(cols === 3 ? [50, 200, 350] : [80, 320]).map((x) => (
            <g key={x}>
              <line x1={x} y1="20" x2={x} y2="44" stroke="#8b7cf6" strokeWidth="1.75" />
              <path d={`M${x - 4},44 L${x},52 L${x + 4},44 Z`} fill="#8b7cf6" />
            </g>
          ))}
        </svg>
      </div>
      <div
        className={`grid gap-4 -mt-1 ${
          cols === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
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
              className={`grid gap-4 mt-3 ${
                colCount === 1
                  ? "grid-cols-1 max-w-[300px] mx-auto"
                  : colCount === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-3"
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
   GOHIGHLEVEL — light Standard Builder
   ═══════════════════════════════════════════ */

function GhlNode({ node, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon =
    node.type === "trigger"
      ? FormInput
      : node.type === "wait"
        ? Clock
        : node.type === "condition"
          ? GitBranch
          : meta.icon;
  const color = meta.ghlColor;

  return (
    <div
      className="wf-anim relative w-full max-w-[280px] mx-auto rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${animateDelay}ms` }}
    >
      <div className="flex items-start gap-2.5 p-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-zinc-800 leading-snug">{node.label}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 capitalize">
            {node.type === "trigger" ? "Trigger" : meta.label}
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
    <div className="relative flex flex-col items-center w-full h-12" aria-hidden>
      <svg width="40" height="48" viewBox="0 0 40 48" className="overflow-visible">
        <line x1="20" y1="0" x2="20" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="20" cy="24" r="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="20" y1="19" x2="20" y2="29" stroke="#64748b" strokeWidth="1.75" />
        <line x1="15" y1="24" x2="25" y2="24" stroke="#64748b" strokeWidth="1.75" />
        <line x1="20" y1="32" x2="20" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/** GHL: merge multi-triggers then fork into Yes/Timeout with orthogonal bars */
function GhlBranchJunction() {
  return (
    <div className="w-full max-w-lg mx-auto h-16 relative" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 64" preserveAspectRatio="none">
        <line x1="200" y1="0" x2="200" y2="18" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="200" cy="28" r="9" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="200" y1="23" x2="200" y2="33" stroke="#64748b" strokeWidth="1.5" />
        <line x1="195" y1="28" x2="205" y2="28" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="37" x2="200" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="100" y1="44" x2="300" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="100" y1="44" x2="100" y2="64" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="300" y1="44" x2="300" y2="64" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function GhlTriggerMerge() {
  return (
    <div className="w-full max-w-lg mx-auto h-10 relative" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 40" preserveAspectRatio="none">
        <line x1="100" y1="0" x2="100" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="100" y1="16" x2="300" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="200" y1="16" x2="200" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function GhlCanvas({ nodes, branched, animateKey, title }) {
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom(animateKey);
  const { ref: panRef, isDragging, offset, panProps } = useCanvasPan(animateKey);
  const { trunk, yesNodes, noNodes, sideNodes, mergeTail } = splitBranches(nodes);

  const yesStart = 0;
  const body = branched ? (
    <div className="flex flex-col items-center max-w-3xl mx-auto px-2 py-5">
      <div className="flex flex-wrap justify-center gap-2 w-full max-w-lg">
        {trunk.slice(0, 1).map((n, i) => (
          <div key={`trig-${i}`} className="flex-1 min-w-[140px] max-w-[200px]">
            <GhlNode node={{ ...n, type: "trigger" }} animateDelay={0} />
          </div>
        ))}
        <div className="flex-1 min-w-[120px] max-w-[160px] rounded-xl border-2 border-dashed border-zinc-300 bg-white/60 flex items-center justify-center gap-1.5 text-xs text-zinc-400 py-6">
          <Plus className="w-3.5 h-3.5" /> Add New Trigger
        </div>
      </div>
      <GhlTriggerMerge />
      {trunk.slice(1).map((n, i) => (
        <React.Fragment key={`t-${i}`}>
          {i > 0 && <GhlPlusConnector />}
          <GhlNode node={n} animateDelay={(i + 1) * 45} />
        </React.Fragment>
      ))}
      {(yesNodes.length > 0 || noNodes.length > 0 || sideNodes.length > 0) && (
        <>
          <GhlBranchJunction />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center relative">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded z-10">
                Contact Reply
              </span>
              {yesNodes.map((n, i) => (
                <React.Fragment key={`y-${i}`}>
                  {i > 0 && <GhlPlusConnector />}
                  <GhlNode node={n} animateDelay={(yesStart + i) * 40} />
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col items-center relative">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded z-10">
                Time Out
              </span>
              {(noNodes.length ? noNodes : sideNodes).map((n, i) => (
                <React.Fragment key={`n-${i}`}>
                  {i > 0 && <GhlPlusConnector />}
                  <GhlNode node={n} animateDelay={(i + 8) * 40} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
      {mergeTail.map((n, i) => (
        <React.Fragment key={`m-${i}`}>
          <GhlPlusConnector />
          <GhlNode node={n} animateDelay={(i + 12) * 40} />
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center px-3 py-5">
      <div className="flex flex-wrap justify-center gap-2 w-full max-w-lg">
        <div className="flex-1 min-w-[140px] max-w-[220px]">
          <GhlNode
            node={nodes[0] || { label: "Trigger", type: "trigger" }}
            animateDelay={0}
          />
        </div>
        <div className="flex-1 min-w-[120px] max-w-[160px] rounded-xl border-2 border-dashed border-zinc-300 bg-white/60 flex items-center justify-center gap-1.5 text-xs text-zinc-400 py-6">
          <UserPlus className="w-3.5 h-3.5" /> Add New Trigger
        </div>
      </div>
      <GhlTriggerMerge />
      {nodes.slice(1).map((n, i) => (
        <React.Fragment key={`L-${i}`}>
          <GhlPlusConnector />
          <GhlNode node={n} animateDelay={(i + 1) * 45} />
        </React.Fragment>
      ))}
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
          className={`relative flex-1 overflow-hidden max-h-[300px] sm:max-h-[380px] md:max-h-[500px] touch-none select-none ${
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
   n8n — authentic LTR canvas + Bézier wires
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
  let idSeq = 0;
  const add = (node, x, y) => {
    const id = `n${idSeq++}`;
    placed.push({ id, node, x, y });
    return id;
  };

  const labels = {
    yes: branchLabels?.yes || "true",
    no: branchLabels?.no || "false",
    side: branchLabels?.side || "extra",
  };

  const lanes = [
    yesNodes.length && { key: "yes", label: labels.yes, nodes: yesNodes },
    noNodes.length && { key: "no", label: labels.no, nodes: noNodes },
    sideNodes.length && { key: "side", label: labels.side, nodes: sideNodes },
  ].filter(Boolean);

  const laneCount = Math.max(lanes.length, 1);
  const branchBlockH =
    laneCount * N8N_NODE_H + Math.max(0, laneCount - 1) * N8N_V_LANE;
  const hasAgentSubs = trunk.some((n) => n.subs?.length);
  const midY =
    N8N_PAD + Math.max(0, (branchBlockH - N8N_NODE_H) / 2) + (hasAgentSubs ? 40 : 0);

  let x = N8N_PAD;
  let prevId = null;

  const chain = trunk.length ? trunk : [];
  chain.forEach((node) => {
    const id = add(node, x, midY);
    if (prevId) {
      edges.push({ from: prevId, to: id, label: "1 item", tone: "run" });
    }
    if (node.subs?.length) {
      const subY = midY + N8N_NODE_H + 56;
      const spread = N8N_NODE_W + 36;
      const startX = x - ((node.subs.length - 1) * spread) / 2;
      node.subs.forEach((sub, si) => {
        const sid = add(sub, startX + si * spread, subY);
        edges.push({
          from: id,
          to: sid,
          label: sub.port || "",
          tone: "sub",
          fromPort: "bottom",
          toPort: "top",
        });
      });
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
      let lanePrev = null;
      lane.nodes.forEach((node, ni) => {
        const id = add(node, bx, ly);
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
      laneMeta.push({ lastId: lanePrev, endX: bx - N8N_H_GAP });
    });

    if (mergeTail.length && laneMeta.length) {
      const mergeX = Math.max(...laneMeta.map((l) => l.endX)) + N8N_H_GAP;
      let mergePrev = null;
      mergeTail.forEach((node, i) => {
        const id = add(node, mergeX + i * (N8N_NODE_W + N8N_H_GAP), midY);
        if (i === 0) {
          laneMeta.forEach((l) => {
            edges.push({ from: l.lastId, to: id, label: "1 item", tone: "merge" });
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

  let maxX = placed.reduce((m, p) => Math.max(m, p.x + N8N_NODE_W), 0) + N8N_PAD;
  let maxY = placed.reduce((m, p) => Math.max(m, p.y + N8N_NODE_H), 0) + N8N_PAD;

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

function N8nNodeCard({ node, style, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon = meta.icon;
  const color = meta.n8nColor;
  const isTrigger =
    node.type === "trigger" ||
    node.type === "error" ||
    /trigger/i.test(node.label || "");
  const isCondition = node.type === "condition";
  const subtitle = node.subtitle || meta.n8nAction || meta.label;

  return (
    <div
      className="wf-anim absolute z-[2]"
      style={{ ...style, width: N8N_NODE_W, height: N8N_NODE_H, animationDelay: `${animateDelay}ms` }}
    >
      <div
        className={`relative h-full w-full rounded-lg border bg-[#2d2e32] shadow-[0_4px_16px_rgba(0,0,0,0.35)] px-2.5 py-2 flex items-start gap-2 ${
          isCondition ? "border-[#7e57c2]/80" : "border-[#40414a]"
        }`}
      >
        {isTrigger && node.type !== "error" && (
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ff6d5a] text-white flex items-center justify-center shadow z-10">
            <Zap className="w-2.5 h-2.5 fill-white" strokeWidth={0} />
          </span>
        )}
        <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#2d2e32] border border-[#909399] z-10" />
        <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#2d2e32] border border-[#909399] z-10" />

        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${color}22` }}
        >
          {meta.logo ? (
            <img
              src={meta.logo}
              alt=""
              className={`w-5 h-5 object-contain ${node.type === "notion" ? "invert" : ""}`}
            />
          ) : (
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[11px] font-semibold text-zinc-100 leading-snug line-clamp-2">
            {node.label}
          </p>
          <p className="text-[9px] text-zinc-500 leading-tight mt-0.5 truncate">{subtitle}</p>
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
      {edges.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return null;
        const p1 = e.fromPort === "bottom" ? n8nBottom(a) : n8nOut(a);
        const p2 = e.toPort === "top" ? n8nTop(b) : n8nIn(b);
        let d;
        if (e.tone === "sub") {
          const dy = Math.max((p2.y - p1.y) * 0.55, 28);
          d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
        } else {
          d = n8nBezier(p1.x, p1.y, p2.x, p2.y);
        }
        const stroke = e.tone === "sub" ? "#7a7f88" : N8N_WIRE;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - (e.tone === "branch" ? 0 : 8);

        return (
          <g key={`${e.from}-${e.to}-${i}`}>
            <path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray={e.tone === "sub" ? "4 4" : undefined}
            />
            {e.label && (
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x={-Math.max(12, e.label.length * 3.1)}
                  y={-6.5}
                  width={Math.max(24, e.label.length * 6.2)}
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
   MAKE — horizontal scenario (circular modules)
   ═══════════════════════════════════════════ */

function MakeModule({ node, version, animateDelay = 0 }) {
  const meta = nodeMeta(node.type);
  const Icon = meta.icon;
  const color = meta.makeColor || meta.color;

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
          {meta.logo ? (
            <img src={meta.logo} alt="" className="w-8 h-8 object-contain" />
          ) : (
            <Icon className="w-8 h-8" style={{ color }} strokeWidth={2} />
          )}
        </div>
        {node.type === "gmail" && (
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
