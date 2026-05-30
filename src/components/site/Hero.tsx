import Image from "next/image";
import { BookOpenText, GraduationCap, Headphones } from "lucide-react";
import { ButtonLink } from "@/components/site/ButtonLink";
import { Container } from "@/components/site/Container";
import { LocalizedText } from "@/components/site/LocalizedText";

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(251,191,36,0.12),transparent_26%),linear-gradient(180deg,#06111f_0%,#081827_48%,#050b16_100%)]">
      <Container className="grid items-center gap-10 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-16 lg:py-20">
        <div className="relative z-10 min-w-0">
          <h1 className="max-w-[20rem] break-words text-[2rem] font-semibold leading-[1.12] text-white min-[420px]:max-w-[calc(100vw_-_2rem)] min-[420px]:text-4xl sm:max-w-3xl sm:text-5xl lg:text-6xl">
            <LocalizedText
              en={
                <>
                  Learning systems for teachers, students, and <span className="whitespace-nowrap">AI-powered</span> creators.
                </>
              }
              fa="سیستم های یادگیری برای معلم ها، زبان آموزها و سازنده های هوش مصنوعی."
            />
          </h1>
          <p className="mt-6 max-w-[18.5rem] break-words text-base leading-8 text-slate-300 min-[420px]:max-w-[calc(100vw_-_2rem)] sm:max-w-2xl sm:text-lg">
            <LocalizedText
              en={
                <>
                  EduPocket collects practical notes, micro-lessons, podcast episodes, and frameworks from Ali Rad&apos;s work in
                  English teaching, AI, programming, and language learning.
                </>
              }
              fa="EduPocket یادداشت های کاربردی، درس های کوتاه، اپیزودهای صوتی و چارچوب های کاری علی راد را در آموزش انگلیسی، هوش مصنوعی، برنامه نویسی و یادگیری زبان جمع می کند."
            />
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-2 pr-4 shadow-[0_18px_54px_rgba(0,0,0,0.16)] sm:w-fit">
            <Image
              src="/images/ali-rad-friendly.jpg"
              alt="Ali Rad"
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-[8px] object-cover"
            />
            <p className="text-sm leading-6 text-slate-300">
              <LocalizedText en="Built from Ali Rad's teaching, tutoring, and AI-learning practice." fa="ساخته شده از تجربه تدریس، کوچینگ زبان و تمرین های هوش مصنوعی علی راد." />
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/articles" icon={BookOpenText} variant="primary">
              <LocalizedText en="Read Articles" fa="خواندن مقاله ها" />
            </ButtonLink>
            <ButtonLink href="/lessons" icon={GraduationCap}>
              <LocalizedText en="Explore Lessons" fa="دیدن درس ها" />
            </ButtonLink>
            <ButtonLink href="/podcasts" icon={Headphones}>
              <LocalizedText en="Listen to Podcasts" fa="شنیدن پادکست ها" />
            </ButtonLink>
          </div>
        </div>
        <div className="relative min-w-0">
          <div className="absolute inset-6 rounded-full bg-amber-300/10 blur-3xl" aria-hidden="true" />
          <Image
            src="/images/edupocket-hero-system.png"
            alt="EduPocket notebook with language cards, AI learning checklist, and audio lesson card"
            width={1536}
            height={1024}
            priority
            className="relative mx-auto w-full max-w-[calc(100vw_-_2rem)] rounded-[8px] object-contain shadow-[0_36px_100px_rgba(0,0,0,0.34)] md:max-w-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
