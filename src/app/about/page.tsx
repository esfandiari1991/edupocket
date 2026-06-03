import type { Metadata } from "next";
import Image from "next/image";
import { BrainCircuit, GraduationCap, Languages, Laptop, ListChecks, Repeat } from "lucide-react";
import { ContactPanel } from "@/components/site/ContactPanel";
import { Container } from "@/components/site/Container";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "About Ali Rad",
  description: "Learn about Ali Rad, the teacher and builder behind EduPocket.",
  keywords: ["Ali Esfandiari Rad", "Ali Rad", "English teacher", "AI learning-system builder", "online tutor"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ali Rad",
    description: "Learn about Ali Rad, the teacher and builder behind EduPocket.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ali Rad | EduPocket",
    description: "Learn about Ali Rad, the teacher and builder behind EduPocket.",
  },
};

const strengths = [
  {
    title: { en: "English teaching", fa: "آموزش انگلیسی" },
    text: { en: "IELTS, TOEFL, KET, Business English, conversational English, and kids English.", fa: "آیلتس، تافل، KET، انگلیسی کسب‌وکار، مکالمه و انگلیسی کودکان." },
    icon: GraduationCap,
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

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        level={1}
        title={<LocalizedText en="About Ali Rad" fa="درباره علی راد" />}
        description={
          <LocalizedText
            en="EduPocket is the public learning library of Ali Esfandiari Rad: English teacher, computer engineer, Arabic teacher, AI practitioner, CELTA student, online tutor, and language coach."
            fa="EduPocket کتابخانه عمومی یادگیری علی اسفندیاری راد است: مدرس انگلیسی، مهندس کامپیوتر، مدرس عربی، فعال در هوش مصنوعی، زبان‌آموز CELTA، مدرس آنلاین و کوچ زبان."
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
                en="Ali teaches English, exam preparation, math, SQL, Python, and AI learning systems online. EduPocket brings those lessons into a structured content hub: notes, micro-lessons, podcasts, and frameworks that help learners practice with clarity."
                fa="علی انگلیسی، آمادگی آزمون، ریاضی، SQL، پایتون و سیستم‌های یادگیری با هوش مصنوعی را آنلاین تدریس می‌کند. EduPocket این تجربه‌ها را به یک هاب محتوایی ساختارمند تبدیل می‌کند: یادداشت، درس کوتاه، پادکست و چارچوب‌هایی که تمرین را شفاف‌تر می‌کنند."
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
      <ContactPanel context="about" className="mt-8" />
    </Container>
  );
}
