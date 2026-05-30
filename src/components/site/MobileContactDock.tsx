import { Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { LocalizedText } from "@/components/site/LocalizedText";

export function MobileContactDock() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:hidden">
      <a
        href={siteConfig.contact.telegram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center gap-3 rounded-[8px] border border-amber-100/70 bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200 px-4 py-3 text-sm font-bold text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.42)] focus:outline-none focus:ring-2 focus:ring-amber-100"
      >
        <Send aria-hidden="true" className="size-5 rtl:rotate-180" />
        <span>
          <LocalizedText en="Collaborate with me" fa="همکاری با من" />
        </span>
      </a>
    </div>
  );
}
