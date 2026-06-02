import { Handshake } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/site/BrandMark";
import { Container } from "@/components/site/Container";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { LocalizedText } from "@/components/site/LocalizedText";
import { NavLinks } from "@/components/site/NavLinks";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06111f]/88 backdrop-blur-xl">
      <Container>
        <div className="grid min-h-20 min-w-0 gap-4 py-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center xl:gap-5">
          <div className="flex min-w-0 flex-col items-start gap-3 min-[520px]:w-full min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between xl:justify-start">
            <BrandMark />
            <div className="w-full min-[520px]:w-[15.25rem] sm:w-[18.5rem] xl:hidden">
              <LanguageToggle />
            </div>
          </div>
          <NavLinks />
          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-center xl:w-auto xl:justify-end">
            <div className="hidden xl:block">
              <LanguageToggle className="w-[18.5rem]" />
            </div>
            <a
              href={siteConfig.contact.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-button-pop inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(251,191,36,0.22)] transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:w-auto"
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
