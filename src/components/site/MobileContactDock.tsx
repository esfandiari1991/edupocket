import { Camera, Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { LocalizedText } from "@/components/site/LocalizedText";

export function MobileContactDock() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid gap-2 sm:hidden">
      <a
        href={siteConfig.contact.telegram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[8px] border border-amber-100/70 bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.42)] focus:outline-none focus:ring-2 focus:ring-amber-100"
      >
        <Send aria-hidden="true" className="size-5 rtl:rotate-180" />
        <span>
          <LocalizedText en="Collaborate with me" fa="همکاری با من" />
        </span>
      </a>
      <a
        href={siteConfig.contact.instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-slate-950/88 px-4 py-2 text-xs font-semibold text-slate-100 shadow-[0_16px_54px_rgba(0,0,0,0.32)] backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-300/60"
      >
        <Camera aria-hidden="true" className="size-4 text-amber-200" />
        <span>
          <LocalizedText en="insta" fa="insta" />
        </span>
      </a>
    </div>
  );
}
