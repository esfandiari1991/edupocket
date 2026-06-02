import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText, KeyRound, Layers3, LockKeyhole, MessageCircle, PenLine, ShieldCheck, Sparkles } from "lucide-react";
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
        <div className="eva-premium-frame motion-view grid gap-6 overflow-hidden rounded-[8px] border border-amber-200/20 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.28)] sm:p-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch lg:p-7">
          <div className="relative order-2 min-h-[18rem] overflow-hidden rounded-[8px] border border-white/10 bg-[radial-gradient(circle_at_18%_16%,rgba(251,191,36,0.16),transparent_12rem),linear-gradient(145deg,rgba(6,17,31,0.74),rgba(15,31,39,0.82))] p-4 sm:min-h-[22rem] sm:p-5 lg:order-1 lg:min-h-full">
            <div className="absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent via-amber-200/46 to-transparent" />
            <div className="absolute bottom-8 left-7 top-8 w-px bg-gradient-to-b from-amber-200/30 via-sky-200/18 to-transparent" />
            <div className="relative flex h-full min-h-[16rem] flex-col justify-between gap-4">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-start">
                <div className="rounded-[8px] border border-amber-100/16 bg-slate-950/48 p-4 shadow-[0_20px_64px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                      <Layers3 aria-hidden="true" className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-amber-100/72">01</span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-amber-100">
                    <LocalizedText en="Digital booklet system" fa="سیستم جزوه دیجیتال" />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    <LocalizedText en="A private chapter map for serious reading and writing practice." fa="نقشه فصل های خصوصی برای تمرین جدی ریدینگ و رایتینگ." />
                  </p>
                </div>

                <div className="relative mx-auto w-28 overflow-hidden rounded-[8px] border border-white/15 bg-slate-950/62 shadow-[0_18px_56px_rgba(0,0,0,0.32)] sm:mx-0 sm:w-32">
                  <Image
                    src="/images/eva/eva-digital-booklet-study.jpg"
                    alt="Eva studying in the digital booklet portal"
                    width={920}
                    height={824}
                    priority
                    unoptimized
                    className="aspect-[5/6] w-full object-cover object-[50%_38%] saturate-[0.96]"
                    sizes="8rem"
                  />
                  <div className="absolute inset-0 rounded-[8px] ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { icon: BookOpen, en: "Reading lab", fa: "لابراتوار ریدینگ" },
                  { icon: PenLine, en: "Writing studio", fa: "استودیوی رایتینگ" },
                  { icon: FileText, en: "Weekly updates", fa: "آپدیت های هفتگی" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.en} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs font-semibold text-slate-300">
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-amber-200" />
                      <span className="min-w-0">
                        <LocalizedText en={item.en} fa={item.fa} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-1 grid gap-5 lg:order-2">
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
                {!compact ? (
                  <p className="mt-3 max-w-xl text-xs font-semibold leading-5 text-amber-100/80">
                    <LocalizedText en="Public preview. Private chapters stay protected." fa="پیش نمایش عمومی است؛ فصل ها خصوصی می مانند." />
                  </p>
                ) : null}
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
                  <LocalizedText en="Manual access through Telegram." fa="دسترسی دستی از طریق تلگرام." />
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
                <div className="mt-4 grid gap-2">
                  {evaPublicOffer.updates.map((item, index) => (
                    <div key={item.en} className="flex items-start gap-2 text-xs leading-5 text-slate-300">
                      {index === 2 ? <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-amber-200" /> : <Sparkles aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-amber-200" />}
                      <span>
                        <LocalizedText en={item.en} fa={item.fa} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!compact ? (
              <div className="grid gap-3 md:grid-cols-3">
                {evaPublicOffer.accessSteps.map((item, index) => {
                  const icons = [MessageCircle, KeyRound, BookOpen];
                  const Icon = icons[index] ?? ShieldCheck;

                  return (
                    <div key={item.en} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="flex size-9 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <span className="text-xs font-semibold text-slate-500">0{index + 1}</span>
                      </div>
                      <LocalizedText en={item.en} fa={item.fa} />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {!compact ? (
              <div className="flex flex-wrap gap-2">
                {evaPublicOffer.trustSignals.map((item) => (
                  <span key={item.en} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-slate-950/38 px-3 py-2 text-xs font-semibold text-slate-300">
                    <ShieldCheck aria-hidden="true" className="size-3.5 text-sky-200" />
                    <LocalizedText en={item.en} fa={item.fa} />
                  </span>
                ))}
              </div>
            ) : null}

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
