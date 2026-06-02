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
      className="grid w-full min-w-0 grid-cols-3 gap-1.5 rounded-[8px] border border-white/10 bg-white/[0.045] p-1.5 text-center shadow-[0_16px_52px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] min-[560px]:flex min-[560px]:flex-wrap min-[560px]:justify-center xl:w-auto xl:items-center"
    >
      {siteConfig.nav.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative inline-flex min-h-10 min-w-0 items-center justify-center overflow-hidden rounded-[7px] border px-2.5 py-2 text-sm font-bold text-slate-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/70",
              "before:absolute before:inset-x-2 before:top-0 before:h-px before:bg-white/10 before:opacity-80",
              active
                ? "border-amber-300/60 bg-amber-300/14 text-amber-100 shadow-[0_12px_34px_rgba(251,191,36,0.16),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                : "border-white/10 bg-slate-950/32 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)] hover:border-amber-300/45 hover:bg-white/[0.075] hover:text-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.22)]",
            )}
          >
            <span className="relative z-10 truncate">
              <LocalizedText en={item.label} fa={item.faLabel} />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
