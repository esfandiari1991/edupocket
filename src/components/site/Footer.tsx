import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/site/BrandMark";
import { Container } from "@/components/site/Container";
import { commonText } from "@/lib/i18n";
import { LocalizedText } from "@/components/site/LocalizedText";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#030914] py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md space-y-5">
            <BrandMark />
            <p className="text-sm leading-6 text-slate-400">
              <LocalizedText en={siteConfig.description} fa={siteConfig.faDescription} />
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              <LocalizedText en={commonText.explore.en} fa={commonText.explore.fa} />
            </h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-amber-200">
                  <LocalizedText en={item.label} fa={item.faLabel} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              <LocalizedText en="Built for" fa="ساخته شده برای" />
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              <LocalizedText en={commonText.builtFor.en} fa={commonText.builtFor.fa} />
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {year} EduPocket. All rights reserved.</p>
          <p>
            <LocalizedText en={commonText.builtWith.en} fa={commonText.builtWith.fa} />
          </p>
        </div>
      </Container>
    </footer>
  );
}
