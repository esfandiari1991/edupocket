import type { Metadata } from "next";
import Image from "next/image";
import { Award, BrainCircuit, Globe2, GraduationCap, Languages, Laptop, ListChecks, Repeat } from "lucide-react";
import { ContactPanel } from "@/components/site/ContactPanel";
import { Container } from "@/components/site/Container";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Ali Rad - CELTA-qualified English Teacher, IELTS, TOEFL, FCE, ESP, GRE & GMAT Tutor",
  description:
    "Ali Esfandiari Rad is a Cambridge CELTA-qualified English teacher with 15+ years of experience in IELTS, TOEFL, Cambridge exams, PTE, Duolingo, TOEIC, OET, GRE, GMAT, specialized English, academic writing, business English, and AI-assisted learning systems.",
  keywords: [
    "Ali Esfandiari Rad",
    "Ali Rad",
    "Cambridge CELTA-qualified English teacher",
    "CELTA-certified English tutor",
    "English teacher 15 years experience",
    "IELTS tutor online",
    "TOEFL iBT teacher",
    "PTE Academic tutor",
    "Duolingo English Test tutor",
    "TOEIC tutor",
    "OET English tutor",
    "LanguageCert tutor",
    "CELPIP tutor",
    "CAEL tutor",
    "MSRT TOLIMO EPT tutor",
    "FCE teacher for teens",
    "Cambridge B2 First tutor",
    "GRE verbal tutor",
    "GMAT verbal tutor",
    "specialized English teacher",
    "English for Specific Purposes tutor",
    "medical English tutor",
    "engineering English tutor",
    "technology English tutor",
    "online English teacher China Taiwan Canada USA",
    "AI learning-system builder",
    "online tutor",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ali Rad - CELTA-qualified English Teacher and EduPocket Founder",
    description: "15+ years of English teaching, exam coaching, specialized English, Cambridge CELTA training, and AI-assisted learning-system design.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ali Rad | CELTA-qualified English Teacher | EduPocket",
    description: "Cambridge CELTA-qualified English teacher with 15+ years of IELTS, TOEFL, Cambridge exams, PTE, Duolingo, TOEIC, OET, GRE, GMAT, specialized English, and academic English coaching experience.",
  },
};

const strengths = [
  {
    title: { en: "English teaching", fa: "آموزش انگلیسی" },
    text: { en: "15+ years of IELTS, TOEFL, Cambridge English, specialized English, business English, academic writing, conversation, kids, and teen English.", fa: "بیش از ۱۵ سال تجربه در آیلتس، تافل، آزمون‌های کمبریج، زبان تخصصی، انگلیسی کسب‌وکار، رایتینگ آکادمیک، مکالمه و انگلیسی کودک و نوجوان." },
    icon: GraduationCap,
  },
  {
    title: { en: "Cambridge CELTA", fa: "CELTA کمبریج" },
    text: { en: "CELTA-qualified teaching habits: clear lesson aims, learner-centered practice, useful feedback, and measurable progress.", fa: "رویکرد دارنده مدرک CELTA: هدف روشن، تمرین زبان‌آموزمحور، بازخورد کاربردی و پیشرفت قابل سنجش." },
    icon: Award,
  },
  {
    title: { en: "Languages", fa: "زبان‌ها" },
    text: { en: "Arabic teaching, bilingual support, vocabulary systems, and language coaching.", fa: "آموزش عربی، پشتیبانی دوزبانه، سیستم واژگان و کوچینگ زبان." },
    icon: Languages,
  },
  {
    title: { en: "Technology", fa: "تکنولوژی" },
    text: { en: "Computer engineering, Python, SQL, AI practice, and learning-system design.", fa: "مهندسی کامپیوتر، پایتون، SQL، تمرین هوش مصنوعی و طراحی سیستم یادگیری." },
    icon: Laptop,
  },
  {
    title: { en: "Frameworks", fa: "چارچوب‌ها" },
    text: { en: "Structured teaching frameworks, micro-lessons, exam strategy, and practical roadmaps.", fa: "چارچوب‌های تدریس، درس‌های کوتاه، استراتژی آزمون و نقشه‌های کاربردی." },
    icon: ListChecks,
  },
  {
    title: { en: "Practice loops", fa: "چرخه‌های تمرین" },
    text: { en: "Spaced repetition, error logs, feedback cycles, and small measurable habits.", fa: "مرور فاصله‌دار، دفتر خطا، چرخه بازخورد و عادت‌های کوچک قابل سنجش." },
    icon: Repeat,
  },
  {
    title: { en: "AI learning", fa: "یادگیری با AI" },
    text: { en: "AI as a thinking partner for teachers, students, and creators, not a shortcut.", fa: "هوش مصنوعی به عنوان همراه فکر برای معلم‌ها، زبان‌آموزها و سازنده‌ها؛ نه میانبر." },
    icon: BrainCircuit,
  },
];

const examGroups = [
  {
    title: { en: "English proficiency exams", fa: "آزمون‌های مهارت انگلیسی" },
    items: ["IELTS Academic", "IELTS General Training", "TOEFL iBT", "TOEFL Essentials", "TOEFL ITP", "PTE Academic", "PTE Core", "Duolingo English Test", "TOEIC", "OET", "LanguageCert", "Oxford Test of English", "CELPIP", "CAEL", "iTEP"],
  },
  {
    title: { en: "Cambridge English exams", fa: "آزمون‌های کمبریج" },
    items: ["Pre A1 Starters", "A1 Movers", "A2 Flyers", "KET / A2 Key", "PET / B1 Preliminary", "FCE / B2 First", "CAE / C1 Advanced", "CPE / C2 Proficiency", "Linguaskill"],
  },
  {
    title: { en: "Iran-focused English exams", fa: "آزمون‌های انگلیسی رایج در ایران" },
    items: ["MSRT", "TOLIMO", "EPT", "UTEPT", "MHLE"],
  },
  {
    title: { en: "Academic entrance exams", fa: "آزمون‌های ورودی آکادمیک" },
    items: ["GRE Verbal", "GMAT Verbal", "SAT English", "ACT English", "AP English Language", "AP English Literature"],
  },
  {
    title: { en: "Global language exam map", fa: "نقشه آزمون‌های زبان جهان" },
    items: [...siteConfig.teacherProfile.globalLanguageExams],
  },
  {
    title: { en: "Learner pathways", fa: "مسیرهای زبان‌آموزی" },
    items: ["Academic Writing", "Business English", "Conversation", "English for kids", "English for teens", "AI-assisted study routines"],
  },
  {
    title: { en: "Specialized English / ESP", fa: "زبان تخصصی / ESP" },
    items: [...siteConfig.teacherProfile.specializedEnglish],
  },
];

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        level={1}
        title={<LocalizedText en="About Ali Rad" fa="درباره علی راد" />}
        description={
          <LocalizedText
            en="EduPocket is the public learning library of Ali Esfandiari Rad: CELTA-qualified English teacher, computer engineer, Arabic teacher, AI practitioner, online tutor, and language coach."
            fa="EduPocket کتابخانه عمومی یادگیری علی اسفندیاری راد است: مدرس انگلیسی دارنده مدرک CELTA کمبریج، مهندس کامپیوتر، مدرس عربی، فعال در هوش مصنوعی، مدرس آنلاین و کوچ زبان."
          />
        }
      />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
          <Image
            src="/images/ali-rad-profile.jpg"
            alt="Ali Rad"
            width={1024}
            height={1024}
            priority
            className="aspect-square w-full object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white">
              <LocalizedText en="A practical education lab" fa="یک آزمایشگاه آموزش کاربردی" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              <LocalizedText
                en="Ali teaches English, exam preparation, specialized English, academic writing, business English, conversation, SQL, Python, and AI learning systems online. EduPocket brings those lessons into a structured content hub: notes, micro-lessons, podcasts, and frameworks that help learners practice with clarity."
                fa="علی انگلیسی، آمادگی آزمون، زبان تخصصی، رایتینگ آکادمیک، انگلیسی کسب‌وکار، مکالمه، SQL، پایتون و سیستم‌های یادگیری با هوش مصنوعی را آنلاین تدریس می‌کند. EduPocket این تجربه‌ها را به یک هاب محتوایی ساختارمند تبدیل می‌کند: یادداشت، درس کوتاه، پادکست و چارچوب‌هایی که تمرین را شفاف‌تر می‌کنند."
              />
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              <LocalizedText
                en="The focus is simple: make learning easier to repeat. That means clear frameworks, short lessons, error logs, spaced repetition, bilingual support, and AI-assisted study habits that improve real performance."
                fa="تمرکز ساده است: یادگیری باید راحت‌تر تکرار شود. یعنی چارچوب روشن، درس کوتاه، دفتر خطا، مرور فاصله‌دار، پشتیبانی دوزبانه و عادت‌های مطالعه با کمک هوش مصنوعی که عملکرد واقعی را بهتر می‌کنند."
              />
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title.en} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
                <Icon aria-hidden="true" className="size-6 text-amber-200" />
                <h3 className="mt-4 font-semibold text-white">
                  <LocalizedText en={item.title.en} fa={item.title.fa} />
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  <LocalizedText en={item.text.en} fa={item.text.fa} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <section className="mt-8 rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_15%_0%,rgba(251,191,36,0.12),transparent_28rem),rgba(255,255,255,0.04)] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
              <Globe2 aria-hidden="true" className="size-4" />
              <LocalizedText en="Online English coaching" fa="کوچینگ آنلاین انگلیسی" />
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              <LocalizedText en="Exam preparation and specialized English for learners worldwide." fa="آمادگی آزمون و زبان تخصصی برای زبان‌آموزها در سراسر جهان." />
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              <LocalizedText
                en="The goal is not only to pass a test or memorize field vocabulary. The goal is to build a repeatable English system: diagnosis, strategy, practice, feedback, review, and performance."
                fa="هدف فقط قبول شدن در آزمون یا حفظ کردن واژگان تخصصی نیست. هدف ساختن یک سیستم تکرارپذیر انگلیسی است: تشخیص، استراتژی، تمرین، بازخورد، مرور و عملکرد."
              />
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              <LocalizedText
                en={`Remote lessons are suitable for learners in ${siteConfig.teacherProfile.regions.join(", ")}.`}
                fa={`کلاس‌های آنلاین برای زبان‌آموزهای ${siteConfig.teacherProfile.faRegions.join("، ")} مناسب است.`}
              />
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {examGroups.map((group) => (
              <article key={group.title.en} className="rounded-[8px] border border-white/10 bg-slate-950/35 p-4">
                <h3 className="text-sm font-semibold text-white">
                  <LocalizedText en={group.title.en} fa={group.title.fa} />
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-[7px] border border-white/10 bg-white/[0.045] px-2.5 py-1.5 text-xs font-semibold text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactPanel context="about" className="mt-8" />
    </Container>
  );
}
