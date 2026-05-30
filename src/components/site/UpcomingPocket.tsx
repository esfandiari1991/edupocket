import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { FlaskConical, LockKeyhole } from "lucide-react";
import { commonText } from "@/lib/i18n";
import { LocalizedText } from "@/components/site/LocalizedText";

type UpcomingPocketProps = {
  title: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  icon: ComponentType<LucideProps>;
  note: {
    en: string;
    fa: string;
  };
};

export function UpcomingPocket({ title, description, icon: Icon, note }: UpcomingPocketProps) {
  return (
    <article
      data-state="upcoming"
      className="motion-upcoming relative overflow-hidden rounded-[8px] border border-dashed border-slate-500/35 bg-slate-900/35 p-5 text-slate-400 shadow-none"
    >
      <div data-motion-bar="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(148,163,184,0.18),rgba(251,191,36,0.28),rgba(96,165,250,0.18),rgba(148,163,184,0.18))]" />
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-10 items-center justify-center rounded-[8px] border border-slate-500/25 bg-white/[0.025] text-slate-300">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] border border-amber-200/20 bg-amber-200/[0.08] px-2 py-1 text-xs font-semibold text-amber-100">
          <LockKeyhole aria-hidden="true" className="size-3" />
          <LocalizedText en={commonText.comingSoon.en} fa={commonText.comingSoon.fa} />
        </span>
      </div>
      <h3 className="mt-5 font-semibold text-slate-100">
        <LocalizedText en={title.en} fa={title.fa} />
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        <LocalizedText en={description.en} fa={description.fa} />
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-[8px] border border-white/[0.08] bg-black/[0.18] px-3 py-2 text-xs font-semibold text-slate-400">
        <FlaskConical aria-hidden="true" className="size-3.5 text-amber-200/80" />
        <span>
          <LocalizedText en={note.en} fa={note.fa} />
        </span>
      </div>
    </article>
  );
}
