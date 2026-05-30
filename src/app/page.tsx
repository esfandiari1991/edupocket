import Link from "next/link";
import { ArrowRight, BookMarked, BrainCircuit, FlaskConical, GraduationCap, Handshake, Microscope, Sparkles } from "lucide-react";
import { commonText } from "@/lib/i18n";
import { getFeaturedArticles, getFeaturedLessons, getFeaturedPodcasts } from "@/lib/content";
import { Container } from "@/components/site/Container";
import { ContactPanel } from "@/components/site/ContactPanel";
import { ContentCard } from "@/components/site/ContentCard";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { Hero } from "@/components/site/Hero";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";
import { UpcomingPocket } from "@/components/site/UpcomingPocket";

const labHighlights = [
  {
    title: { en: "Placement sample", fa: "نمونه تعیین سطح" },
    text: { en: "Quick questions, instant scoring, and clear next steps.", fa: "سوال های کوتاه، امتیاز فوری و قدم بعدی واضح." },
    icon: FlaskConical,
  },
  {
    title: { en: "Expert learning loops", fa: "چرخه های یادگیری حرفه ای" },
    text: { en: "Short cycles inspired by deliberate practice: focus, feedback, and one next move.", fa: "چرخه های کوتاه شبیه تمرین سنجیده: تمرکز، بازخورد و فقط یک قدم بعدی." },
    icon: Microscope,
  },
  {
    title: { en: "AI-augmented review", fa: "مرور تقویت شده با AI" },
    text: { en: "Use AI as a mirror for mistakes, patterns, and stronger memory.", fa: "از AI مثل آینه ای برای خطاها، الگوها و حافظه قوی تر استفاده کن." },
    icon: Sparkles,
  },
  {
    title: { en: "Bilingual flow", fa: "جریان دوزبانه" },
    text: { en: "Persian and English stay aligned across the same interface.", fa: "فارسی و انگلیسی در یک رابط منظم کنار هم می مانند." },
    icon: BrainCircuit,
  },
];

const workModes = [
  {
    title: { en: "Private English coaching", fa: "کوچینگ خصوصی انگلیسی" },
    text: {
      en: "Level diagnosis, speaking feedback, exam habits, and a realistic weekly practice loop.",
      fa: "تشخیص سطح، بازخورد اسپیکینگ، عادت های آزمونی و یک روتین هفتگی واقعی.",
    },
    icon: GraduationCap,
  },
  {
    title: { en: "AI learning systems", fa: "سیستم یادگیری با AI" },
    text: {
      en: "Turn scattered tools into a simple learning workflow for study, teaching, or content.",
      fa: "ابزارهای پراکنده را به یک جریان ساده برای مطالعه، تدریس یا تولید محتوا تبدیل کن.",
    },
    icon: BrainCircuit,
  },
  {
    title: { en: "Education projects", fa: "پروژه های آموزشی" },
    text: {
      en: "Collaborate on lessons, mini-products, language tools, content strategy, or learning apps.",
      fa: "برای درس، مینی محصول، ابزار زبان، استراتژی محتوا یا اپ یادگیری همکاری کنیم.",
    },
    icon: Handshake,
  },
];

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
  const featured = [...featuredArticles.slice(0, 1), ...featuredLessons.slice(0, 1), ...featuredPodcasts.slice(0, 1)];

  return (
    <>
      <Hero />

      <section className="motion-section-band border-b border-white/10 bg-[#050b16] py-14 sm:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="motion-card motion-view flex flex-col justify-between rounded-[8px] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(56,189,248,0.1)_55%,rgba(255,255,255,0.04))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.24)] sm:p-7 lg:col-span-5">
              <div>
                <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
                  <LocalizedText en="English Lab is the main interactive door." fa="English Lab ورودی اصلی و تعاملی سایت است." />
                </h2>
                <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                  <LocalizedText
                    en="A compact practice space for level checks, grammar, vocabulary, reading, writing, and exam habits. It starts small, then grows around feedback, memory cues, and AI-supported study loops."
                    fa="یک فضای تمرین فشرده برای تعیین سطح، گرامر، واژگان، ریدینگ، رایتینگ و عادت های آزمونی. کوچک شروع می شود و بعد حول بازخورد، نشانه های حافظه و چرخه های مطالعه با AI رشد می کند."
                  />
                </p>
              </div>
              <Link
                href="/english-lab"
                className="motion-button-pop mt-8 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-[8px] bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_24px_80px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_100px_rgba(251,191,36,0.35)] focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <Sparkles aria-hidden="true" className="size-5" />
                <LocalizedText en="Start practicing" fa="شروع تمرین" />
                <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {labHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title.en} className="motion-card motion-view rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
                    <div className="flex items-center gap-3">
                      <span className="motion-card-icon flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <h3 className="font-semibold text-white">
                        <LocalizedText en={item.title.en} fa={item.title.fa} />
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      <LocalizedText en={item.text.en} fa={item.text.fa} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="motion-section-band border-b border-white/10 py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                <LocalizedText en="Ways to work with me." fa="راه های همکاری با من." />
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                <LocalizedText
                  en="If your goal is serious, message me and turn it into a clear, doable learning plan."
                  fa="اگر هدفت جدی است، به من پیام بده و آن را به یک برنامه روشن و قابل اجرا تبدیل کن."
                />
              </p>
              <DirectContactButtons
                variant="hero"
                showSecondary={false}
                className="mt-7"
                primaryLabel={{ en: "Collaborate with me", fa: "همکاری با من" }}
                primarySubLabel={{ en: "English, AI, education projects", fa: "انگلیسی، AI، پروژه آموزشی" }}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {workModes.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title.en} className="motion-card motion-view rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
                    <span className="motion-card-icon flex size-11 items-center justify-center rounded-[8px] border border-amber-300/20 bg-amber-300/10 text-amber-200">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold leading-6 text-white">
                      <LocalizedText en={item.title.en} fa={item.title.fa} />
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      <LocalizedText en={item.text.en} fa={item.text.fa} />
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="motion-section-band border-b border-white/10 bg-[#050b16] py-16">
        <Container>
          <SectionHeading
            title={<LocalizedText en="Useful now, not crowded." fa="همین حالا مفید، نه شلوغ." />}
            description={
              <LocalizedText
                en="Only the strongest live content is surfaced here. Deeper libraries remain in their own pages."
                fa="اینجا فقط قوی ترین محتواهای آماده دیده می شوند. کتابخانه های کامل در صفحه های خودشان هستند."
              />
            }
            action={
              <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
                <LocalizedText en={commonText.viewAll.en} fa={commonText.viewAll.fa} />
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {featured.map((item) => (
              <ContentCard key={`${item.kind}-${item.slug}`} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="motion-section-band py-16">
        <Container>
          <SectionHeading
            title={<LocalizedText en="Coming soon" fa="به زودی" />}
            description={<LocalizedText en="Roadmap ideas stay visible, polished, and clearly marked until they are ready." fa="ایده های آینده تا زمان آماده شدن، شفاف، مرتب و چشم نواز در نقشه راه می مانند." />}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {comingSoon.map((item) => (
              <UpcomingPocket key={item.title.en} title={item.title} description={item.description} note={item.note} icon={item.icon} />
            ))}
          </div>
        </Container>
      </section>

      <section className="motion-section-band border-t border-white/10 bg-[#050b16] py-16">
        <Container>
          <ContactPanel context="general" />
        </Container>
      </section>
    </>
  );
}
