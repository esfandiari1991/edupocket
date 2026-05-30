import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, GraduationCap, Sparkles } from "lucide-react";
import { Container } from "@/components/site/Container";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { LocalizedText } from "@/components/site/LocalizedText";

const routes = [
  { en: "English coaching", fa: "کوچینگ انگلیسی", icon: GraduationCap },
  { en: "AI study systems", fa: "سیستم مطالعه با AI", icon: BrainCircuit },
  { en: "Interactive practice", fa: "تمرین تعاملی", icon: Sparkles },
];

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#06111f_0%,#071522_52%,#050b16_100%)]">
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="relative z-10 min-w-0 lg:col-span-7">
            <h1 className="max-w-4xl text-[2.35rem] font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            <LocalizedText
              en={
                <>
                  Practical learning, direct coaching, and <span className="text-amber-200">AI-powered</span> English systems.
                </>
              }
              fa="یادگیری عملی، کوچینگ مستقیم، و سیستم های انگلیسی با کمک هوش مصنوعی."
            />
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            <LocalizedText
              en={
                <>
                  EduPocket is Ali Rad&apos;s focused learning hub for students, teachers, and self-learners who want sharper
                  English, smarter study routines, and useful AI habits.
                </>
              }
              fa="EduPocket هاب متمرکز علی راد برای دانشجوها، معلم ها و خودآموزهایی است که انگلیسی قوی تر، روتین مطالعه بهتر و عادت های کاربردی AI می خواهند."
            />
            </p>

            <div className="mt-8 grid gap-3 sm:max-w-2xl sm:grid-cols-[1fr_auto] sm:items-stretch">
              <DirectContactButtons
                variant="hero"
                showSecondary={false}
                primaryLabel={{ en: "Collaborate with me", fa: "همکاری با من" }}
                primarySubLabel={{ en: "Tutoring, AI study plans, projects", fa: "تدریس، برنامه AI، پروژه آموزشی" }}
              />
              <Link
                href="/english-lab"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15 focus:outline-none focus:ring-2 focus:ring-sky-200/60"
              >
                <LocalizedText en="Enter English Lab" fa="ورود به آزمایشگاه زبان" />
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {routes.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.en} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      <LocalizedText en={item.en} fa={item.fa} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-5">
            <div className="absolute inset-4 rounded-full bg-amber-300/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] p-3 shadow-[0_36px_100px_rgba(0,0,0,0.34)]">
              <Image
                src="/images/ali-rad-learning.jpg"
                alt="Ali Rad studying and building learning systems"
                width={752}
                height={1360}
                priority
                className="h-[25rem] w-full rounded-[6px] object-cover object-[50%_34%] sm:h-[34rem] lg:h-[38rem]"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase text-amber-200">
                    <LocalizedText en="Human first" fa="اول انسان" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    <LocalizedText en="Real teaching practice, not anonymous content." fa="تجربه واقعی تدریس، نه محتوای بی هویت." />
                  </p>
                </div>
                <div className="rounded-[8px] border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase text-sky-200">
                    <LocalizedText en="Focused path" fa="مسیر متمرکز" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    <LocalizedText en="English, AI, and study systems in one place." fa="انگلیسی، AI و سیستم مطالعه در یک مسیر." />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
