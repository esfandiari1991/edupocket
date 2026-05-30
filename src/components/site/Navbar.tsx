import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/site/BrandMark";
import { Container } from "@/components/site/Container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06111f]/88 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-20 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <BrandMark />
          <nav aria-label="Primary navigation" className="flex w-full flex-wrap gap-1 text-sm font-medium text-slate-300 md:w-auto md:items-center">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[8px] px-2.5 py-2 transition hover:bg-white/6 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300/70 md:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/articles"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(251,191,36,0.22)] transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 md:w-auto"
          >
            Start reading
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
