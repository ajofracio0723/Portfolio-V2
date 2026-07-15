import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WorkflowOrbit from "./WorkflowOrbit";
import TicketSyncOrbit from "./TicketSyncOrbit";
import EmailSequenceOrbit from "./EmailSequenceOrbit";
import LeadLifecycleOrbit from "./LeadLifecycleOrbit";

const SLIDES = [
  {
    id: "lifecycle",
    label: "Full Lead Lifecycle",
    hint: "Enterprise GHL · 5 triggers · appts · won/lost",
    render: () => <LeadLifecycleOrbit />,
  },
  {
    id: "crm",
    label: "CRM Multi-Branch",
    hint: "Lead + payment rails",
    render: () => <WorkflowOrbit />,
  },
  {
    id: "tickets",
    label: "Ticket Sync Pipeline",
    hint: "n8n-style attachment ops",
    render: () => <TicketSyncOrbit />,
  },
  {
    id: "email",
    label: "Nurture Email Sequence",
    hint: "3-email drip · open/click gates",
    render: () => <EmailSequenceOrbit />,
  },
];

export default function WorkflowOrbitCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next) => {
    setIndex((i) => (next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      className="mb-16 relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-indigo-400/90 font-medium">
            Workflow Previews
          </p>
          <p className="text-sm text-slate-400 leading-snug">
            <span className="block sm:inline">{slide.label}</span>
            <span className="hidden sm:inline text-slate-600"> · </span>
            <span className="block sm:inline text-slate-500 sm:text-slate-600 text-xs sm:text-sm mt-0.5 sm:mt-0">
              {slide.hint}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
            aria-label="Previous workflow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5 px-1">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-indigo-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Show ${s.label}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
            aria-label="Next workflow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">{slide.render()}</div>

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
