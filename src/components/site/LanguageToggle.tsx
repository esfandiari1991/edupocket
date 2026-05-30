"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n";

const storageKey = "edupocket-language";

function applyLanguage(language: Language) {
  document.documentElement.dataset.lang = language;
  document.documentElement.lang = language === "fa" ? "fa" : "en";
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
}

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("en");

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

  return (
    <div
      className="language-toggle group relative inline-grid min-w-[9.7rem] grid-cols-2 items-center rounded-[8px] border border-white/10 bg-white/[0.055] p-1 text-xs font-semibold shadow-[0_14px_44px_rgba(0,0,0,0.18)]"
      dir="ltr"
      aria-label="Language"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[6px] bg-amber-400 shadow-[0_12px_30px_rgba(251,191,36,0.24)] transition-transform duration-300 ease-out",
          language === "fa" && "translate-x-full",
        )}
      />
      <button
        type="button"
        aria-pressed={language === "en"}
        onClick={() => selectLanguage("en")}
        className={cn(
          "relative z-10 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[6px] px-3 transition",
          language === "en" ? "text-slate-950" : "text-slate-300 hover:text-white",
        )}
      >
        <Languages aria-hidden="true" className="size-3.5" />
        EN
      </button>
      <button
        type="button"
        aria-pressed={language === "fa"}
        onClick={() => selectLanguage("fa")}
        className={cn(
          "relative z-10 min-h-9 rounded-[6px] px-3 transition",
          language === "fa" ? "text-slate-950" : "text-slate-300 hover:text-white",
        )}
      >
        فارسی
      </button>
    </div>
  );
}
