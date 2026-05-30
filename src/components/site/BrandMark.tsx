import Link from "next/link";
import { BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="EduPocket home">
      <span className="flex size-10 items-center justify-center rounded-[8px] border border-amber-300/40 bg-amber-400 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.22)]">
        <BookOpen aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      <span className="leading-none">
        <span className="block text-lg font-semibold text-white transition group-hover:text-amber-100">
          {siteConfig.name}
        </span>
        <span className="mt-1 block text-xs font-medium text-slate-400">by {siteConfig.shortAuthor}</span>
      </span>
    </Link>
  );
}
