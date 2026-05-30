import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/site/BrandMark";
import { Container } from "@/components/site/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#030914] py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md space-y-5">
            <BrandMark />
            <p className="text-sm leading-6 text-slate-400">{siteConfig.description}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-amber-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Built for</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Students, teachers, self-learners, and creators building practical learning systems.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {year} EduPocket. All rights reserved.</p>
          <p>Built with Next.js and deployed on Vercel.</p>
        </div>
      </Container>
    </footer>
  );
}
