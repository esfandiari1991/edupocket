import Link from "next/link";
import { Handshake } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/site/BrandMark";
import { Container } from "@/components/site/Container";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { LocalizedText } from "@/components/site/LocalizedText";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06111f]/88 backdrop-blur-xl">
      <Container>
        <div className="grid min-h-20 min-w-0 gap-4 py-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-col items-start gap-3 min-[380px]:w-full min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between lg:justify-start">
            <BrandMark />
            <div className="lg:hidden">
              <LanguageToggle />
            </div>
          </div>
          <nav
            aria-label="Primary navigation"
            className="grid w-full min-w-0 grid-cols-3 gap-1 text-center text-sm font-medium text-slate-300 min-[560px]:flex min-[560px]:flex-wrap min-[560px]:justify-center lg:w-auto lg:items-center"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-w-0 rounded-[8px] px-2 py-2 transition hover:bg-white/6 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300/70 md:px-3"
              >
                <LocalizedText en={item.label} fa={item.faLabel} />
              </Link>
            ))}
          </nav>
          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:w-auto lg:justify-end">
            <div className="hidden lg:block">
              <LanguageToggle />
            </div>
            <a
              href={siteConfig.contact.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(251,191,36,0.22)] transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:w-auto"
            >
              <LocalizedText en="Collaborate with me" fa="همکاری با من" />
              <Handshake aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
