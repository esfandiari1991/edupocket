import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { LocalizedText } from "@/components/site/LocalizedText";
import { cn } from "@/lib/utils";

type ContactPanelProps = {
  context?: "general" | "article" | "lesson" | "podcast" | "about";
  className?: string;
};

const copy = {
  general: {
    title: { en: "Want a personal learning route?", fa: "مسیر یادگیری شخصی می خواهی؟" },
    text: {
      en: "Send Ali a direct message for English, AI study plans, lessons, content ideas, or collaboration.",
      fa: "برای انگلیسی، برنامه مطالعه با هوش مصنوعی، کلاس، ایده محتوا یا همکاری مستقیم به علی پیام بده.",
    },
  },
  article: {
    title: { en: "Want this idea turned into a plan?", fa: "می خواهی این ایده تبدیل به برنامه شود؟" },
    text: {
      en: "Message Ali with your goal and get a practical next step for study, teaching, or AI-supported learning.",
      fa: "هدفت را برای علی بفرست تا قدم بعدی کاربردی برای مطالعه، تدریس یا یادگیری با AI بگیری.",
    },
  },
  lesson: {
    title: { en: "Need feedback on your practice?", fa: "برای تمرینت بازخورد می خواهی؟" },
    text: {
      en: "Send a short message with your level, exam goal, or study problem.",
      fa: "سطح، هدف آزمون یا مشکل مطالعه ات را کوتاه بفرست.",
    },
  },
  podcast: {
    title: { en: "Want the audio notes as a study routine?", fa: "می خواهی نکات صوتی تبدیل به روتین مطالعه شود؟" },
    text: {
      en: "Message Ali and turn the episode into a small weekly learning loop.",
      fa: "به علی پیام بده تا این اپیزود را به یک چرخه کوچک هفتگی تبدیل کنی.",
    },
  },
  about: {
    title: { en: "Work with Ali directly", fa: "مستقیم با علی در ارتباط باش" },
    text: {
      en: "For tutoring, language coaching, AI learning systems, or education projects, start with a direct message.",
      fa: "برای تدریس، کوچینگ زبان، سیستم های یادگیری با هوش مصنوعی یا پروژه آموزشی، با یک پیام مستقیم شروع کن.",
    },
  },
};

export function ContactPanel({ context = "general", className }: ContactPanelProps) {
  const selected = copy[context];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[8px] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.14),rgba(96,165,250,0.08)_48%,rgba(255,255,255,0.045))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:p-6 lg:p-8",
        className,
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-amber-200">
            <LocalizedText en="Direct contact" fa="ارتباط مستقیم" />
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
            <LocalizedText en={selected.title.en} fa={selected.title.fa} />
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            <LocalizedText en={selected.text.en} fa={selected.text.fa} />
          </p>
        </div>
        <DirectContactButtons variant="hero" />
      </div>
    </section>
  );
}
