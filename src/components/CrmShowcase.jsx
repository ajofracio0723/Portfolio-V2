import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function CrmShowcase({
  screenshots = [],
  responsibilities = [],
  technologies = [],
  showcaseLabel = "Live CRM Screens",
  highlight = null,
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShowThumbs(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (lightbox || screenshots.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % screenshots.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [screenshots.length, lightbox]);

  // Prefetch adjacent slides so next/prev feels instant
  useEffect(() => {
    if (screenshots.length < 2) return undefined;
    const next = screenshots[(index + 1) % screenshots.length];
    const prev = screenshots[(index - 1 + screenshots.length) % screenshots.length];
    [next, prev].forEach((s) => {
      const img = new Image();
      img.src = `/agency/${s.file}`;
    });
    return undefined;
  }, [index, screenshots]);

  const shot = screenshots[index];
  if (!shot) return null;

  const src = `/agency/${shot.file}`;

  return (
    <div className="pt-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          {highlight && (
            <div className="mb-4 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/15 to-purple-500/10 px-4 py-3">
              <p className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                {highlight.value}
              </p>
              <p className="text-sm text-slate-300 mt-0.5">{highlight.label}</p>
              {highlight.note && (
                <p className="text-xs text-slate-500 mt-1">{highlight.note}</p>
              )}
            </div>
          )}
          <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
            Responsibilities
          </p>
          <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-crm-scroll">
            {responsibilities.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-300"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-3 gap-2">
            <p className="text-xs uppercase tracking-wider text-indigo-400/80 font-medium">
              {showcaseLabel}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)
                }
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % screenshots.length)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-[#0b1220] text-left transition-all hover:border-indigo-500/40"
          >
            <img
              key={src}
              src={src}
              alt={shot.title}
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm md:text-base font-semibold text-white">
                  {shot.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{shot.caption}</p>
              </div>
              <ZoomIn className="w-4 h-4 text-indigo-300 opacity-70 group-hover:opacity-100 flex-shrink-0" />
            </div>
          </button>

          <div className="flex justify-center gap-2 mt-3">
            {screenshots.map((s, i) => (
              <button
                key={s.file}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-indigo-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Show ${s.title}`}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-crm-scroll">
            {showThumbs &&
              screenshots.map((s, i) => (
              <button
                key={`thumb-${s.file}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative aspect-video rounded-lg overflow-hidden border transition-all ${
                  i === index
                    ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={`/agency/${s.file}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/50 rounded px-1 py-0.5 truncate">
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={src}
            alt={shot.title}
            className="max-w-6xl w-full max-h-[85vh] object-contain rounded-xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .custom-crm-scroll::-webkit-scrollbar { width: 5px; }
        .custom-crm-scroll::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.45);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
