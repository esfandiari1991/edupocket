import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookMarked, BrainCircuit, Headphones, Languages, PenTool, Sparkles } from "lucide-react";
import { commonText, tagLabel } from "@/lib/i18n";
import { getAllTags, getFeaturedArticles, getFeaturedLessons, getFeaturedPodcasts } from "@/lib/content";
import { slugify } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { ContactPanel } from "@/components/site/ContactPanel";
import { ContentCard } from "@/components/site/ContentCard";
import { Hero } from "@/components/site/Hero";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";

const comingSoon = [
  {
    title: { en: "Book summaries", fa: "خلاصه کتاب ها" },
    description: { en: "Consciousness, quantum physics, self-development, and big ideas.", fa: "آگاهی، فیزیک کوانتوم، رشد فردی و ایده های بزرگ." },
    icon: BookMarked,
  },
  {
    title: { en: "Mini educational apps", fa: "مینی اپ های آموزشی" },
    description: { en: "Small tools for practice, recall, planning, and learning loops.", fa: "ابزارهای کوچک برای تمرین، یادآوری، برنامه ریزی و چرخه های یادگیری." },
    icon: Sparkles,
  },
  {
    title: { en: "Language tools", fa: "ابزارهای زبان" },
    description: { en: "Vocabulary systems, error logs, and bilingual learning support.", fa: "سیستم واژگان، دفتر خطاها و پشتیبانی دوزبانه برای یادگیری زبان." },
    icon: Languages,
  },
  {
    title: { en: "Deep knowledge pockets", fa: "پاکت های دانش عمیق" },
    description: { en: "Connected notes that turn difficult ideas into usable maps.", fa: "یادداشت های متصل که ایده های سخت را به نقشه های قابل استفاده تبدیل می کنند." },
    icon: BrainCircuit,
  },
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
            title={<LocalizedText en="Featured pockets" fa="پاکت های منتخب" />}
            description={
              <LocalizedText
                en="Articles, micro-lessons, and audio notes designed for practical study, better teaching, and AI-supported learning."
                fa="مقاله ها، درس های کوتاه و یادداشت های صوتی برای مطالعه کاربردی، تدریس بهتر و یادگیری با کمک هوش مصنوعی."
              />
            }
            action={
              <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
                <LocalizedText en={commonText.viewAll.en} fa={commonText.viewAll.fa} />
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
              title={<LocalizedText en="What is EduPocket?" fa="EduPocket چیست؟" />}
              description={
                <LocalizedText
                  en="A premium learning notebook for practical notes, teaching systems, AI experiments, language frameworks, and podcast lessons from Ali Rad's work."
                  fa="یک دفتر یادگیری حرفه ای برای یادداشت های کاربردی، سیستم های تدریس، تجربه های هوش مصنوعی، چارچوب های زبان و درس های صوتی از کارهای علی راد."
                />
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <PenTool aria-hidden="true" className="size-7 text-amber-200" />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  <LocalizedText en="Built for practical learning" fa="ساخته شده برای یادگیری عملی" />
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  <LocalizedText
                    en="Every page is designed to turn ideas into frameworks, repetitions, decisions, and next actions."
                    fa="هر صفحه طوری طراحی شده که ایده ها را به چارچوب، تکرار، تصمیم و قدم بعدی تبدیل کند."
                  />
                </p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <Headphones aria-hidden="true" className="size-7 text-amber-200" />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  <LocalizedText en="Ready for audio lessons" fa="آماده برای درس های صوتی" />
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  <LocalizedText
                    en="Podcast notes and transcripts live beside the player, so listening becomes a study workflow."
                    fa="یادداشت ها و راهنمای شنیدن کنار پلیر قرار می گیرند تا گوش دادن تبدیل به یک روند مطالعه شود."
                  />
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16">
        <Container>
          <ContactPanel context="general" />
        </Container>
      </section>

      <section className="border-b border-white/10 py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
              <Image
                src="/images/ali-rad-learning.jpg"
                alt="Ali Rad studying and building learning systems"
                width={752}
                height={1360}
                loading="eager"
                className="h-[32rem] w-full object-cover object-[50%_34%] sm:h-[38rem] lg:h-[34rem]"
              />
            </div>
            <div>
              <SectionHeading
                title={<LocalizedText en="Recognizable, human, and practical." fa="قابل شناخت، انسانی و کاربردی." />}
                description={
                  <LocalizedText
                    en="EduPocket should feel like a real teacher-builder is behind it. The content comes from Ali's classroom work, online tutoring, language coaching, and daily experiments with AI as a learning partner."
                    fa="EduPocket باید حس کند پشت آن یک معلم و سازنده واقعی حضور دارد. محتوا از کلاس ها، تدریس آنلاین، کوچینگ زبان و تجربه های روزانه علی با هوش مصنوعی به عنوان همراه یادگیری می آید."
                  />
                }
              />
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { en: "English", fa: "انگلیسی" },
                  { en: "AI practice", fa: "تمرین با AI" },
                  { en: "Study systems", fa: "سیستم مطالعه" },
                ].map((item) => (
                  <div key={item.en} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-amber-100">
                    <LocalizedText en={item.en} fa={item.fa} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16">
        <Container>
          <SectionHeading
            title={<LocalizedText en="Topic cloud" fa="ابر موضوع ها" />}
            description={<LocalizedText en="Start with a tag and follow connected ideas across articles, lessons, and episodes." fa="با یک برچسب شروع کن و ایده های مرتبط را در مقاله ها، درس ها و اپیزودها دنبال کن." />}
          />
          <div className="flex flex-wrap gap-3">
            {tags.map((topic) => {
              const label = tagLabel(topic);
              return (
              <Link
                key={topic}
                href={`/tags/${slugify(topic)}`}
                className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                <LocalizedText en={label.en} fa={label.fa} />
              </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            title={<LocalizedText en="Coming soon" fa="به زودی" />}
            description={<LocalizedText en="Future features are teased honestly here, without empty destination pages." fa="ایده های آینده شفاف معرفی می شوند، بدون اینکه مخاطب وارد صفحه های خالی شود." />}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {comingSoon.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title.en} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
                  <Icon aria-hidden="true" className="size-6 text-amber-200" />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">
                      <LocalizedText en={item.title.en} fa={item.title.fa} />
                    </h3>
                    <span className="rounded-[6px] bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-100">
                      <LocalizedText en={commonText.comingSoon.en} fa={commonText.comingSoon.fa} />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    <LocalizedText en={item.description.en} fa={item.description.fa} />
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
