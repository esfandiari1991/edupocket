import Image from "next/image";
import { BookOpenText, GraduationCap, Headphones } from "lucide-react";
import { ButtonLink } from "@/components/site/ButtonLink";
import { Container } from "@/components/site/Container";

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(251,191,36,0.12),transparent_26%),linear-gradient(180deg,#06111f_0%,#081827_48%,#050b16_100%)]">
      <Container className="grid items-center gap-10 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-16 lg:py-20">
        <div className="relative z-10 min-w-0">
          <h1 className="max-w-[20rem] break-words text-[2rem] font-semibold leading-[1.12] text-white min-[420px]:max-w-[calc(100vw_-_2rem)] min-[420px]:text-4xl sm:max-w-3xl sm:text-5xl lg:text-6xl">
            Learning systems for teachers, students, and <span className="whitespace-nowrap">AI-powered</span> creators.
          </h1>
          <p className="mt-6 max-w-[18.5rem] break-words text-base leading-8 text-slate-300 min-[420px]:max-w-[calc(100vw_-_2rem)] sm:max-w-2xl sm:text-lg">
            EduPocket collects practical notes, micro-lessons, podcast episodes, and frameworks from Ali Rad&apos;s work in
            English teaching, AI, programming, and language learning.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/articles" icon={BookOpenText} variant="primary">
              Read Articles
            </ButtonLink>
            <ButtonLink href="/lessons" icon={GraduationCap}>
              Explore Lessons
            </ButtonLink>
            <ButtonLink href="/podcasts" icon={Headphones}>
              Listen to Podcasts
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
