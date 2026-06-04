"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LocalizedText } from "@/components/site/LocalizedText";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="primary-nav grid w-full min-w-0 grid-cols-2 gap-1.5 rounded-[8px] border border-white/15 bg-slate-950/60 p-1.5 text-center shadow-[0_18px_58px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.07)] min-[520px]:grid-cols-3 min-[560px]:flex min-[560px]:flex-wrap min-[560px]:justify-center xl:w-auto xl:flex-nowrap xl:items-center xl:gap-1 xl:p-1"
    >
      {siteConfig.nav.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-active={active ? "true" : "false"}
            className={cn(
              "primary-nav-link group relative isolate inline-flex min-h-11 min-w-0 items-center justify-center overflow-hidden rounded-[7px] border px-1.5 py-2 text-[0.8125rem] font-extrabold text-slate-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/70 min-[430px]:px-2 min-[430px]:text-sm sm:px-3 xl:min-h-10 xl:px-2 xl:text-[0.8125rem]",
              active
                ? "border-amber-300/70 bg-[linear-gradient(180deg,rgba(251,191,36,0.22),rgba(251,191,36,0.1))] text-amber-50 shadow-[0_14px_42px_rgba(251,191,36,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                : "border-slate-500/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.66))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.22)] hover:border-amber-300/50 hover:bg-[linear-gradient(180deg,rgba(30,41,59,0.9),rgba(15,23,42,0.78))] hover:text-white hover:shadow-[0_12px_34px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08)]",
            )}
          >
            <span aria-hidden="true" className="primary-nav-link-glow" />
            <span aria-hidden="true" className="primary-nav-link-rail" />
            <span className="relative z-10 text-balance leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.24)]">
              <LocalizedText en={item.label} fa={item.faLabel} />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
