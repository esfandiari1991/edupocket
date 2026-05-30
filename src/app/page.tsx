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
import { UpcomingPocket } from "@/components/site/UpcomingPocket";

const comingSoon = [
  {
    title: { en: "Book summaries", fa: "خلاصه کتاب ها" },
    description: { en: "Consciousness, quantum physics, self-development, and big ideas.", fa: "آگاهی، فیزیک کوانتوم، رشد فردی و ایده های بزرگ." },
    note: { en: "No empty page yet", fa: "هنوز صفحه باز ندارد" },
    icon: BookMarked,
  },
  {
    title: { en: "Mini educational apps", fa: "مینی اپ های آموزشی" },
    description: { en: "Small tools for practice, recall, planning, and learning loops.", fa: "ابزارهای کوچک برای تمرین، یادآوری، برنامه ریزی و چرخه های یادگیری." },
    note: { en: "Prototype in the lab", fa: "نمونه اولیه در حال ساخت" },
    icon: Sparkles,
  },
  {
    title: { en: "Language tools", fa: "ابزارهای زبان" },
    description: { en: "Vocabulary systems, error logs, and bilingual learning support.", fa: "سیستم واژگان، دفتر خطاها و پشتیبانی دوزبانه برای یادگیری زبان." },
    note: { en: "Waiting for the first release", fa: "در انتظار اولین نسخه" },
    icon: Languages,
  },
  {
    title: { en: "Deep knowledge pockets", fa: "پاکت های دانش عمیق" },
    description: { en: "Connected notes that turn difficult ideas into usable maps.", fa: "یادداشت های متصل که ایده های سخت را به نقشه های قابل استفاده تبدیل می کنند." },
    note: { en: "Roadmap pocket", fa: "در نقشه راه" },
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

      <section className="border-b border-white/10 bg-[#050b16] py-16">
        <Container>
          <div className="overflow-hidden rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.18),transparent_24rem),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(96,165,250,0.06)_46%,rgba(255,255,255,0.03))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.24)] sm:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  <LocalizedText en="New interactive section" fa="بخش تعاملی جدید" />
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
                  <LocalizedText en="Enter the EduPocket English Test Lab." fa="وارد آزمایشگاه تست انگلیسی EduPocket شو." />
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  <LocalizedText
                    en="A serious practice hub with grammar, vocabulary, reading, listening-style tasks, Use of English, writing, exam habits, and a fast level sample. It is intentionally scaled to a focused 40-50% starter version, with no empty links."
                    fa="یک هاب تمرین جدی با گرامر، واژگان، ریدینگ، تمرین های شبیه شنیداری، کاربرد انگلیسی، نوشتن، عادت های آزمونی و نمونه تعیین سطح. عمدا در نسخه شروع ۴۰ تا ۵۰ درصدی ساخته شده و لینک خالی ندارد."
                  />
                </p>
                <Link
                  href="/english-lab"
                  className="mt-7 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-[8px] bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_24px_80px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_100px_rgba(251,191,36,0.35)] focus:outline-none focus:ring-2 focus:ring-amber-100 sm:w-auto sm:min-w-[20rem]"
                >
                  <Sparkles aria-hidden="true" className="size-5" />
                  <LocalizedText en="Enter English Lab" fa="ورود به آزمایشگاه زبان" />
                  <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: { en: "8 practice zones", fa: "۸ حوزه تمرین" }, text: { en: "Grammar to exams", fa: "از گرامر تا آزمون" } },
                  { title: { en: "A1-B2 starter map", fa: "نقشه شروع A1 تا B2" }, text: { en: "compact, not overwhelming", fa: "فشرده، نه سنگین" } },
                  { title: { en: "Instant feedback", fa: "بازخورد فوری" }, text: { en: "answer, score, explanation", fa: "جواب، امتیاز، توضیح" } },
                  { title: { en: "Upcoming is locked", fa: "آینده قفل است" }, text: { en: "visible, not clickable", fa: "واضح، غیرقابل کلیک" } },
                ].map((item) => (
                  <div key={item.title.en} className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
                    <p className="font-semibold text-white">
                      <LocalizedText en={item.title.en} fa={item.title.fa} />
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      <LocalizedText en={item.text.en} fa={item.text.fa} />
                    </p>
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
                  <LocalizedText en="Podcast notes now, audio soon" fa="فعلا یادداشت پادکست؛ صوت به زودی" />
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  <LocalizedText
                    en="The episode pages are open for notes and transcripts. Full audio files get a clear soon-state until they are attached."
                    fa="صفحه های اپیزود برای یادداشت و راهنما باز هستند. تا وقتی فایل صوتی وصل نشده، وضعیت به زودی شفاف نشان داده می شود."
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
            {comingSoon.map((item) => (
              <UpcomingPocket key={item.title.en} title={item.title} description={item.description} note={item.note} icon={item.icon} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
