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
        <div className="eva-premium-frame motion-view grid min-w-0 gap-6 overflow-hidden rounded-[8px] border border-amber-200/20 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.28)] sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-stretch lg:p-7">
          <div className="hidden min-h-[18rem] min-w-0 overflow-hidden rounded-[8px] border border-white/10 bg-[radial-gradient(circle_at_18%_16%,rgba(251,191,36,0.16),transparent_12rem),linear-gradient(145deg,rgba(6,17,31,0.74),rgba(15,31,39,0.82))] p-4 sm:min-h-[22rem] sm:p-5 lg:relative lg:order-1 lg:block lg:min-h-full">
            <div className="absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent via-amber-200/46 to-transparent" />
            <div className="absolute bottom-8 left-7 top-8 w-px bg-gradient-to-b from-amber-200/30 via-sky-200/18 to-transparent" />
            <div className="relative flex h-full min-h-[16rem] flex-col justify-between gap-4">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-stretch">
                <div className="rounded-[8px] border border-amber-100/16 bg-slate-950/48 p-4 shadow-[0_20px_64px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                      <Layers3 aria-hidden="true" className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-amber-100/72">01</span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-amber-100">
                    <LocalizedText en="Ali Rad's study system" fa="سیستم مطالعه علی راد" />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    <LocalizedText en="The first official digital release, organized through EduPocket." fa="اولین انتشار دیجیتال رسمی که داخل EduPocket سازماندهی شده است." />
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-[18rem] overflow-hidden rounded-[10px] sm:mx-0 sm:max-w-none">
                  <div className="absolute inset-0 rounded-[10px] bg-[conic-gradient(from_150deg,rgba(251,191,36,0.82),rgba(125,211,252,0.2),rgba(251,191,36,0.5),rgba(15,23,42,0.2))] opacity-80 blur-[2px]" />
                  <div className="relative overflow-hidden rounded-[8px] border border-amber-100/22 bg-slate-950/70 shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
                    <Image
                      src="/images/eva/eva-digital-booklet-portrait.jpg"
                      alt="Premium member studying inside the Eva Digital Booklet portal"
                      width={720}
                      height={720}
                      priority
                      quality={88}
                      className="aspect-[4/5] w-full object-cover object-[50%_34%] contrast-[1.03] saturate-[1.02]"
                      sizes="(max-width: 640px) 18rem, 13rem"
                    />
                    <div className="absolute inset-0 rounded-[8px] ring-1 ring-inset ring-white/12" />
                  </div>
                  <div className="relative mt-2 rounded-[6px] border border-white/10 bg-slate-950/52 px-2.5 py-1.5 text-center text-[11px] font-semibold leading-4 text-amber-100/84">
                    <LocalizedText en="Premium learner" fa="زبان‌آموز پریمیوم" />
                  </div>
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

          <div className="order-1 grid min-w-0 gap-5 lg:order-2">
            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase text-amber-200/90">
                  <LocalizedText en="By Ali Rad, inside EduPocket" fa="از علی راد، داخل EduPocket" />
                </p>
                {compact ? (
                  <h2 className={cn(titleClassName, "break-words")}>
                    <LocalizedText en={evaPublicOffer.title.en} fa={evaPublicOffer.title.fa} />
                  </h2>
                ) : (
                  <h1 className={cn(titleClassName, "break-words")}>
                    <LocalizedText en={evaPublicOffer.title.en} fa={evaPublicOffer.title.fa} />
                  </h1>
                )}
                <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-slate-300 sm:text-base">
                  <LocalizedText en={evaPublicOffer.description.en} fa={evaPublicOffer.description.fa} />
                </p>
                {!compact ? (
                  <p className="mt-3 max-w-xl text-xs font-semibold leading-5 text-amber-100/80">
                    <LocalizedText en="Public gateway. Premium chapters stay protected." fa="درگاه عمومی است؛ فصل های پریمیوم محافظت می‌شوند." />
                  </p>
                ) : null}
                {!compact ? (
                  <div className="relative mt-5 overflow-hidden rounded-[8px] border border-amber-100/18 bg-slate-950/62 shadow-[0_22px_68px_rgba(0,0,0,0.28)] lg:hidden">
                    <Image
                      src="/images/eva/eva-digital-booklet-study.jpg"
                      alt="Premium member studying inside the Eva Digital Booklet portal"
                      width={920}
                      height={824}
                      priority
                      quality={88}
                      className="aspect-[16/11] w-full object-cover object-[50%_28%] contrast-[1.03] saturate-[1.02]"
                      sizes="(max-width: 1024px) calc(100vw - 4rem), 1px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(2,6,23,0.7))]" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-[7px] border border-white/10 bg-slate-950/58 px-3 py-2 text-xs font-semibold text-amber-100 backdrop-blur-sm">
                      <LocalizedText en="Premium learner profile" fa="پروفایل زبان‌آموز پریمیوم" />
                      <span className="text-slate-400">01</span>
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-2">
                  {evaPublicOffer.included.map((item) => (
                    <span key={item.en} className="inline-flex min-w-0 items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200">
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
