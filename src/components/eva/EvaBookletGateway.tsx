import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/site/Container";
import { EvaLoginForm } from "@/components/eva/EvaLoginForm";
import { LocalizedText } from "@/components/site/LocalizedText";
import { evaPublicOffer } from "@/lib/eva-public";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type EvaBookletGatewayProps = {
  compact?: boolean;
  loginError?: string;
};

export function EvaBookletGateway({ compact = false, loginError }: EvaBookletGatewayProps) {
  const titleClassName = cn("type-display font-semibold leading-tight text-white", compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl");

  return (
    <section
      className={cn(
        "motion-section-band border-b border-white/10 bg-[#050b16]",
        compact ? "py-12 sm:py-14" : "py-14 sm:py-16",
      )}
    >
      <Container>
        <div className="eva-premium-frame motion-view grid gap-6 overflow-hidden rounded-[8px] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(14,165,233,0.08)_42%,rgba(255,255,255,0.035))] p-4 shadow-[0_28px_100px_rgba(0,0,0,0.28)] sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:p-7">
          <div className="relative min-h-[18rem] overflow-hidden rounded-[8px] border border-white/10 bg-slate-950/50 sm:min-h-[24rem] lg:min-h-full">
            <Image
              src="/images/eva/eva-digital-booklet-study.jpg"
              alt="Eva studying in the digital booklet portal"
              fill
              priority
              unoptimized
              className="object-cover object-[50%_42%] saturate-[0.95]"
              sizes="(min-width: 1024px) 43vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/8 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[8px] border border-white/10 bg-slate-950/68 p-3 backdrop-blur-md">
              <p className="text-sm font-semibold text-amber-100">
                <LocalizedText en="Reading + Writing Core" fa="هسته ریدینگ + رایتینگ" />
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                <LocalizedText en="A focused study portal, not a crowded course shelf." fa="یک پرتال متمرکز، نه قفسه شلوغ دوره ها." />
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_17rem]">
              <div>
                {compact ? (
                  <h2 className={titleClassName}>
                    <LocalizedText en={evaPublicOffer.title.en} fa={evaPublicOffer.title.fa} />
                  </h2>
                ) : (
                  <h1 className={titleClassName}>
                    <LocalizedText en={evaPublicOffer.title.en} fa={evaPublicOffer.title.fa} />
                  </h1>
                )}
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  <LocalizedText en={evaPublicOffer.description.en} fa={evaPublicOffer.description.fa} />
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {evaPublicOffer.included.map((item) => (
                    <span key={item.en} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200">
                      <CheckCircle2 aria-hidden="true" className="size-4 text-amber-200" />
                      <LocalizedText en={item.en} fa={item.fa} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-amber-200/20 bg-slate-950/46 p-4">
                <p className="text-xs font-semibold uppercase text-amber-200">
                  <LocalizedText en="Access" fa="دسترسی" />
                </p>
                <p className="mt-2 text-5xl font-semibold text-amber-100">{evaPublicOffer.price}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  <LocalizedText en="Manual access. No online checkout." fa="دسترسی دستی. پرداخت آنلاین داخل سایت ندارد." />
                </p>
                <a
                  href={siteConfig.contact.telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-button-pop mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_54px_rgba(251,191,36,0.22)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  <LocalizedText en="Message on Telegram" fa="پیام در تلگرام" />
                </a>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {evaPublicOffer.updates.map((item, index) => (
                <div
                  key={item.en}
                  className={cn(
                    "rounded-[8px] border p-4 text-sm leading-6",
                    index === 2 ? "border-amber-200/25 bg-amber-200/8 text-amber-100" : "border-white/10 bg-white/[0.035] text-slate-300",
                  )}
                >
                  <div className="mb-3 flex size-9 items-center justify-center rounded-[8px] bg-white/[0.045] text-amber-200">
                    {index === 2 ? <LockKeyhole aria-hidden="true" className="size-4" /> : <Sparkles aria-hidden="true" className="size-4" />}
                  </div>
                  <LocalizedText en={item.en} fa={item.fa} />
                </div>
              ))}
            </div>

            {compact ? (
              <Link
                href="/eva-digital-booklet"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
              >
                <LocalizedText en="Open booklet gateway" fa="ورود به درگاه جزوه" />
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
            ) : (
              <EvaLoginForm error={loginError} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
