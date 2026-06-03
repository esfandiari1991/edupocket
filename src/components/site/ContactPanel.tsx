import Image from "next/image";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { LocalizedText } from "@/components/site/LocalizedText";
import { cn } from "@/lib/utils";

type ContactPanelProps = {
  context?: "general" | "article" | "lesson" | "podcast" | "about";
  className?: string;
};

const copy = {
  general: {
    title: { en: "Build your next learning step with me.", fa: "قدم بعدی یادگیری‌ات را با من بساز." },
    text: {
      en: "Send one clear message for tutoring, English coaching, AI learning systems, content ideas, or education projects.",
      fa: "برای تدریس، کوچینگ انگلیسی، سیستم یادگیری با هوش مصنوعی، ایده محتوا یا پروژه آموزشی یک پیام واضح بفرست.",
    },
  },
  article: {
    title: { en: "Want this idea turned into a plan?", fa: "می‌خواهی این ایده تبدیل به برنامه شود؟" },
    text: {
      en: "Message me with your goal and get a practical next step for study, teaching, or AI-supported learning.",
      fa: "هدفت را برای من بفرست تا قدم بعدی کاربردی برای مطالعه، تدریس یا یادگیری با AI بگیری.",
    },
  },
  lesson: {
    title: { en: "Need feedback on your practice?", fa: "برای تمرینت بازخورد می‌خواهی؟" },
    text: {
      en: "Send a short message with your level, exam goal, or study problem.",
      fa: "سطح، هدف آزمون یا مشکل مطالعه‌ات را کوتاه بفرست.",
    },
  },
  podcast: {
    title: { en: "Want the audio notes as a study routine?", fa: "می‌خواهی نکات صوتی تبدیل به روتین مطالعه شود؟" },
    text: {
      en: "Message me and turn the episode into a small weekly learning loop.",
      fa: "به من پیام بده تا این اپیزود را به یک چرخه کوچک هفتگی تبدیل کنی.",
    },
  },
  about: {
    title: { en: "Work with me directly", fa: "مستقیم با من در ارتباط باش" },
    text: {
      en: "For tutoring, language coaching, AI learning systems, or education projects, start with a direct message.",
      fa: "برای تدریس، کوچینگ زبان، سیستم‌های یادگیری با هوش مصنوعی یا پروژه آموزشی، با یک پیام مستقیم شروع کن.",
    },
  },
};

export function ContactPanel({ context = "general", className }: ContactPanelProps) {
  const selected = copy[context];

  return (
    <section
      className={cn(
        "motion-contact-panel motion-view relative overflow-hidden rounded-[8px] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(14,165,233,0.1)_48%,rgba(255,255,255,0.045))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:p-6 lg:p-8",
        className,
      )}
    >
      <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-amber-200">
            <LocalizedText en="Collaboration" fa="همکاری" />
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
            <LocalizedText en={selected.title.en} fa={selected.title.fa} />
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            <LocalizedText en={selected.text.en} fa={selected.text.fa} />
          </p>
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-[11rem_1fr] sm:items-stretch">
          <div className="motion-portrait-card relative min-h-52 overflow-hidden rounded-[8px] border border-white/10 bg-slate-950/50 shadow-[0_18px_56px_rgba(0,0,0,0.22)] sm:min-h-[11rem]">
            <Image
              src="/images/ali-rad-friendly.jpg"
              alt="Ali Rad smiling"
              width={1024}
              height={1024}
              className="h-full min-h-52 w-full object-cover object-[50%_42%] brightness-110 saturate-[1.04] sm:min-h-[11rem]"
              sizes="(min-width: 1024px) 176px, (min-width: 640px) 176px, 100vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/72 to-transparent px-3 pb-3 pt-10">
              <p className="text-xs font-semibold text-amber-100">
                <LocalizedText en="Direct reply" fa="پاسخ مستقیم" />
              </p>
            </div>
          </div>
          <DirectContactButtons
            variant="hero"
            primaryLabel={{ en: "Collaborate with me", fa: "همکاری با من" }}
            primarySubLabel={{ en: "Fastest response on Telegram", fa: "سریع‌ترین پاسخ در تلگرام" }}
          />
        </div>
      </div>
    </section>
  );
}
