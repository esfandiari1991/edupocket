import Link from "next/link";
import { tagLabel } from "@/lib/i18n";
import { slugify } from "@/lib/utils";
import { LocalizedText } from "@/components/site/LocalizedText";

export function TagPill({ tag }: { tag: string }) {
  const label = tagLabel(tag);

  return (
    <Link
      href={`/tags/${slugify(tag)}`}
      className="inline-flex items-center rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-amber-300/50 hover:text-amber-100"
    >
      <LocalizedText en={label.en} fa={label.fa} />
    </Link>
  );
}
