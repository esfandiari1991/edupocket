import Link from "next/link";
import { EduPocketMark } from "@/components/site/EduPocketMark";
import { siteConfig } from "@/lib/site";
import { LocalizedText } from "@/components/site/LocalizedText";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="EduPocket home">
      <span className="motion-logo-mark flex size-11 items-center justify-center rounded-[8px] shadow-[0_0_32px_rgba(251,191,36,0.24)]">
        <EduPocketMark className="size-11" />
      </span>
      <span className="leading-none">
        <span className="block text-lg font-semibold text-white transition group-hover:text-amber-100">
          {siteConfig.name}
        </span>
        <span className="mt-1 block text-xs font-medium text-slate-400">
          <LocalizedText en={`by ${siteConfig.shortAuthor}`} fa="با علی راد" />
        </span>
      </span>
    </Link>
  );
}
