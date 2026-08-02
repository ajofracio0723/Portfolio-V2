import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const ThumbButton = ({ screenshot, isActive, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative shrink-0 overflow-hidden rounded-lg border transition-all ${className} ${
      isActive
        ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
        : "border-white/10 opacity-70 hover:opacity-100"
    }`}
  >
    <div className="relative h-[79px] w-[140px] sm:h-[90px] sm:w-[160px] bg-[#0b1220]">
      <img
        src={`/agency/${screenshot.file}`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <span className="absolute bottom-1 left-1 right-1 z-10 truncate rounded bg-black/50 px-1 py-0.5 text-[10px] text-white">
        {screenshot.title}
      </span>
    </div>
  </button>
);

export default function CrmShowcase({
  screenshots = [],
  responsibilities = [],
  technologies = [],
  showcaseLabel = "Live CRM Screens",
  highlight = null,
  autoPlay = true,
  showCarouselNav = true,
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);

  const hasManyScreenshots = screenshots.length > 15;
  const showDots = showCarouselNav && !hasManyScreenshots;
  const showArrows = screenshots.length > 1 && (showCarouselNav || hasManyScreenshots);
  const showThumbStrip = !hasManyScreenshots;
  const showCompactThumbStrip = hasManyScreenshots;

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShowThumbs(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!autoPlay || lightbox || screenshots.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % screenshots.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [autoPlay, screenshots.length, lightbox]);

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

  const goPrev = () =>
    setIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  const goNext = () => setIndex((i) => (i + 1) % screenshots.length);

  return (
    <div className="pt-5 min-w-0 overflow-hidden">
      <div className="grid grid-cols-1 2xl:grid-cols-5 gap-5 2xl:gap-6">
        <div className="2xl:col-span-2 order-2 2xl:order-1 min-w-0">
          {highlight && (
            <div className="mb-4 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/15 to-purple-500/10 px-4 py-3">
              <p className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                {highlight.value}
              </p>
              <p className="text-sm text-slate-300 mt-0.5">{highlight.label}</p>
              {highlight.note && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{highlight.note}</p>
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

        <div className="2xl:col-span-3 order-1 2xl:order-2 min-w-0">
          <div className="flex items-center justify-between mb-3 gap-2 min-w-0">
            <p className="text-xs uppercase tracking-wider text-indigo-400/80 font-medium truncate">
              {showcaseLabel}
            </p>
            {showArrows && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={goPrev}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 tabular-nums min-w-[3rem] text-center">
                  {index + 1}/{screenshots.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-white truncate">
                  {shot.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{shot.caption}</p>
              </div>
              <ZoomIn className="w-4 h-4 text-indigo-300 opacity-70 group-hover:opacity-100 flex-shrink-0" />
            </div>
          </button>

          {showDots && (
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
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
          )}

          {showThumbs && showThumbStrip && (
            <div className="mt-3 w-full max-w-full overflow-hidden 2xl:hidden">
              <div
                className="grid grid-flow-col auto-cols-[140px] sm:auto-cols-[160px] gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory pb-2 custom-crm-scroll-x"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {screenshots.map((s, i) => (
                  <ThumbButton
                    key={`thumb-scroll-${s.file}`}
                    screenshot={s}
                    isActive={i === index}
                    onClick={() => setIndex(i)}
                    className="snap-start"
                  />
                ))}
              </div>
            </div>
          )}

          {showThumbs && showCompactThumbStrip && (
            <div className="mt-3 w-full max-w-full overflow-hidden hidden xl:block">
              <p className="text-[11px] text-slate-500 mb-2">
                Scroll the gallery strip to browse all {screenshots.length} examples
              </p>
              <div
                className="grid grid-flow-col auto-cols-[140px] xl:auto-cols-[160px] gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory pb-2 custom-crm-scroll-x"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {screenshots.map((s, i) => (
                  <ThumbButton
                    key={`thumb-scroll-many-${s.file}`}
                    screenshot={s}
                    isActive={i === index}
                    onClick={() => setIndex(i)}
                    className="snap-start"
                  />
                ))}
              </div>
            </div>
          )}

          {showCompactThumbStrip && (
            <p className="mt-3 text-[11px] text-slate-500 text-center xl:hidden">
              Use the arrows above to browse all {screenshots.length} examples
            </p>
          )}

          {showThumbs && showThumbStrip && (
            <div className="mt-3 hidden 2xl:grid 2xl:grid-cols-3 gap-2">
              {screenshots.map((s, i) => (
                <ThumbButton
                  key={`thumb-grid-${s.file}`}
                  screenshot={s}
                  isActive={i === index}
                  onClick={() => setIndex(i)}
                  className="w-full [&>div]:w-full [&>div]:h-auto [&>div]:aspect-video"
                />
              ))}
            </div>
          )}
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
        .custom-crm-scroll-x::-webkit-scrollbar { height: 5px; }
        .custom-crm-scroll-x::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.45);
          border-radius: 6px;
        }
        .custom-crm-scroll-x {
          max-width: 100%;
          width: 100%;
        }
        .custom-crm-scroll-x > button {
          flex: 0 0 auto;
        }
      `}</style>
    </div>
  );
}
