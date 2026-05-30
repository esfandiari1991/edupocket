import Link from "next/link";
import { ArrowRight, BookMarked, BrainCircuit, Headphones, Languages, PenTool, Sparkles } from "lucide-react";
import { getAllTags, getFeaturedArticles, getFeaturedLessons, getFeaturedPodcasts } from "@/lib/content";
import { slugify } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { ContentCard } from "@/components/site/ContentCard";
import { Hero } from "@/components/site/Hero";
import { SectionHeading } from "@/components/site/SectionHeading";

const comingSoon = [
  { title: "Book summaries", description: "Consciousness, quantum physics, self-development, and big ideas.", icon: BookMarked },
  { title: "Mini educational apps", description: "Small tools for practice, recall, planning, and learning loops.", icon: Sparkles },
  { title: "Language tools", description: "Vocabulary systems, error logs, and bilingual learning support.", icon: Languages },
  { title: "Deep knowledge pockets", description: "Connected notes that turn difficult ideas into usable maps.", icon: BrainCircuit },
];

export default function HomePage() {
  const featuredArticles = getFeaturedArticles().slice(0, 3);
  const featuredLessons = getFeaturedLessons().slice(0, 3);
  const featuredPodcasts = getFeaturedPodcasts().slice(0, 3);
  const tags = getAllTags();

  return (
    <>
      <Hero />

      <section className="border-b border-white/10 py-16">
        <Container>
          <SectionHeading
            title="Featured pockets"
            description="Articles, micro-lessons, and audio notes designed for practical study, better teaching, and AI-supported learning."
            action={
              <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
                View all
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {[...featuredArticles, ...featuredLessons, ...featuredPodcasts].slice(0, 6).map((item) => (
              <ContentCard key={`${item.kind}-${item.slug}`} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[#050b16] py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeading
              title="What is EduPocket?"
              description="A premium learning notebook for practical notes, teaching systems, AI experiments, language frameworks, and podcast lessons from Ali Rad's work."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <PenTool aria-hidden="true" className="size-7 text-amber-200" />
                <h3 className="mt-5 text-lg font-semibold text-white">Built for practical learning</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Every page is designed to turn ideas into frameworks, repetitions, decisions, and next actions.
                </p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <Headphones aria-hidden="true" className="size-7 text-amber-200" />
                <h3 className="mt-5 text-lg font-semibold text-white">Ready for audio lessons</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Podcast notes and transcripts live beside the player, so listening becomes a study workflow.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16">
        <Container>
          <SectionHeading
            title="Topic cloud"
            description="Start with a tag and follow connected ideas across articles, lessons, and episodes."
          />
          <div className="flex flex-wrap gap-3">
            {tags.map((topic) => (
              <Link
                key={topic}
                href={`/tags/${slugify(topic)}`}
                className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                {topic}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            title="Coming soon"
            description="Future features are teased honestly here, without empty destination pages."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {comingSoon.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
                  <Icon aria-hidden="true" className="size-6 text-amber-200" />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <span className="rounded-[6px] bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-100">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
