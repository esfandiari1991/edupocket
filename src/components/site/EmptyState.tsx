import { BookOpen } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[8px] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <BookOpen aria-hidden="true" className="mx-auto size-8 text-amber-300" />
      <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
