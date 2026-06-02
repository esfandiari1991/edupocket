"use client";

import { type CSSProperties, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n";

const storageKey = "edupocket-language";

function applyLanguage(language: Language) {
  document.documentElement.dataset.lang = language;
  document.documentElement.lang = language === "fa" ? "fa" : "en";
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
}

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [dragging, setDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartProgressRef = useRef(0);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    const initial = stored === "fa" || stored === "en" ? stored : "en";
    applyLanguage(initial);
    window.requestAnimationFrame(() => setLanguage(initial));
  }, []);

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem(storageKey, nextLanguage);
  }

  function progressFromPointer(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return language === "fa" ? 1 : 0;
    const rect = track.getBoundingClientRect();
    return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    const progress = progressFromPointer(event);
    dragStartProgressRef.current = progress;
    suppressClickRef.current = false;
    setDragging(true);
    setDragProgress(progress);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const progress = progressFromPointer(event);
    suppressClickRef.current = Math.abs(progress - dragStartProgressRef.current) > 0.08;
    setDragProgress(progress);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const progress = progressFromPointer(event);
    setDragging(false);
    selectLanguage(progress > 0.5 ? "fa" : "en");
  }

  function handleButtonClick(nextLanguage: Language, event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }
    selectLanguage(nextLanguage);
  }

  const toggleStyle = {
    "--toggle-progress": dragging ? dragProgress : language === "fa" ? 1 : 0,
  } as CSSProperties;

  return (
    <div
      ref={trackRef}
      className={cn(
        "language-toggle language-toggle-unlock group relative inline-grid w-full min-w-0 max-w-full touch-pan-y select-none grid-cols-2 items-center rounded-[8px] border border-white/10 bg-white/[0.055] p-1 text-xs font-semibold shadow-[0_14px_44px_rgba(0,0,0,0.18)]",
        dragging && "is-dragging",
        className,
      )}
      dir="ltr"
      aria-label="Language"
      style={toggleStyle}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={() => setDragging(false)}
    >
      <span aria-hidden="true" className="language-toggle-glide absolute inset-y-1 left-1 right-1 rounded-[6px]" />
      <span
        aria-hidden="true"
        className="language-toggle-thumb absolute inset-y-1 left-1 rounded-[6px] bg-amber-400 shadow-[0_12px_34px_rgba(251,191,36,0.36)]"
      >
        <span className="language-toggle-grip" />
      </span>
      <button
        type="button"
        aria-pressed={language === "en"}
        onClick={(event) => handleButtonClick("en", event)}
        className={cn(
          "relative z-10 inline-flex min-h-10 items-center justify-center gap-1 rounded-[6px] px-2 transition sm:gap-1.5 sm:px-3",
          language === "en" ? "text-slate-950" : "text-slate-300 hover:text-white",
        )}
      >
        <Languages aria-hidden="true" className="size-3.5" />
        EN
      </button>
      <button
        type="button"
        aria-pressed={language === "fa"}
        onClick={(event) => handleButtonClick("fa", event)}
        className={cn(
          "language-toggle-fa relative z-10 min-h-10 rounded-[6px] px-2 transition sm:px-3",
          language === "fa" ? "text-slate-950" : "text-slate-300 hover:text-white",
        )}
        lang="fa"
        dir="rtl"
      >
        فارسی
      </button>
    </div>
  );
}
