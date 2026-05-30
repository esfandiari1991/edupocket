import Link from "next/link";
import { slugify } from "@/lib/utils";

export function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${slugify(tag)}`}
      className="inline-flex items-center rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-amber-300/50 hover:text-amber-100"
    >
      {tag}
    </Link>
  );
}
