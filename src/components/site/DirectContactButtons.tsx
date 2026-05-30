import { ArrowUpRight, Camera, Mail, MessageCircle, Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LocalizedText } from "@/components/site/LocalizedText";

type DirectContactButtonsProps = {
  variant?: "hero" | "compact" | "footer";
  className?: string;
  showSecondary?: boolean;
  primaryLabel?: {
    en: string;
    fa: string;
  };
  primarySubLabel?: {
    en: string;
    fa: string;
  };
};

const secondaryLinks = [
  {
    key: "instagram",
    icon: Camera,
    en: "Instagram",
    fa: "اینستاگرام",
    href: siteConfig.contact.instagram.href,
  },
  {
    key: "bale",
    icon: MessageCircle,
    en: "Bale",
    fa: "بله",
    href: siteConfig.contact.bale.href,
  },
  {
    key: "email",
    icon: Mail,
    en: "Email",
    fa: "ایمیل",
    href: siteConfig.contact.email.href,
  },
];

export function DirectContactButtons({
  variant = "compact",
  className,
  showSecondary = true,
  primaryLabel = { en: "Message me directly", fa: "پیام مستقیم به من" },
  primarySubLabel = { en: siteConfig.contact.telegram.handle, fa: siteConfig.contact.telegram.handle },
}: DirectContactButtonsProps) {
  const isHero = variant === "hero";
  const isFooter = variant === "footer";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3",
        isHero ? "sm:flex-row sm:flex-wrap sm:items-stretch" : "sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      <a
        href={siteConfig.contact.telegram.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "motion-button-pop group relative isolate inline-flex min-h-14 min-w-0 items-center justify-between gap-3 overflow-hidden rounded-[8px] border border-amber-100/70 bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200 px-4 py-3 text-start font-semibold text-slate-950 shadow-[0_22px_70px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(251,191,36,0.34)] focus:outline-none focus:ring-2 focus:ring-amber-100",
          isHero ? "sm:min-w-[18rem] sm:px-5" : "w-full sm:w-auto",
          isFooter ? "sm:w-full" : "",
        )}
      >
        <span className="absolute inset-y-0 left-0 z-[-1] w-1/3 skew-x-[-18deg] bg-white/35 opacity-0 blur-sm transition-[opacity,transform] duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" />
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-slate-950 text-amber-200">
          <Send aria-hidden="true" className="size-5 rtl:rotate-180" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base leading-5">
            <LocalizedText en={primaryLabel.en} fa={primaryLabel.fa} />
          </span>
          <span className="mt-1 block truncate text-xs font-semibold text-slate-700">
            <LocalizedText en={primarySubLabel.en} fa={primarySubLabel.fa} />
          </span>
        </span>
        <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 rtl:-rotate-90" />
      </a>

      {showSecondary
        ? secondaryLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.key}
                href={item.href}
                target={item.key === "email" ? undefined : "_blank"}
                rel={item.key === "email" ? undefined : "noopener noreferrer"}
                className={cn(
                  "inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-amber-300/50 hover:bg-white/[0.07] hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/60",
                  isHero ? "sm:min-w-36" : "w-full sm:w-auto",
                  isFooter ? "sm:w-full sm:justify-start" : "",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">
                  <LocalizedText en={item.en} fa={item.fa} />
                </span>
              </a>
            );
          })
        : null}
    </div>
  );
}
