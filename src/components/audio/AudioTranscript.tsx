import { LocalizedText } from "@/components/site/LocalizedText";

type AudioTranscriptProps = {
  enabled: boolean;
  title: string;
  titleFa?: string;
};

const sampleBeats = [
  ["00:00", "Topic and learning problem", "موضوع و مسئله یادگیری"],
  ["00:08", "Core rule", "قانون اصلی"],
  ["00:18", "Practice move", "حرکت تمرینی"],
  ["00:30", "Feedback and reflection", "بازخورد و بازتاب"],
  ["00:42", "Next small action", "قدم کوچک بعدی"],
];

export function AudioTranscript({ enabled, title, titleFa }: AudioTranscriptProps) {
  if (!enabled) return null;

  return (
    <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-semibold text-white">
        <LocalizedText en="Transcript guide" fa="راهنمای شنیدن" />
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        <LocalizedText
          en={
            <>
              Use these listening beats as a study map for <span className="text-slate-200">{title}</span>. The original short audio
              is attached above, and the notes below expand the lesson.
            </>
          }
          fa={
            <>
              از این ایستگاه های شنیداری به عنوان نقشه مطالعه برای <span className="text-slate-200">{titleFa ?? title}</span> استفاده کن. فایل صوتی کوتاه و اصلی بالا اضافه شده و یادداشت های پایین درس را گسترش می دهند.
            </>
          }
        />
      </p>
      <dl className="mt-5 grid gap-3">
        {sampleBeats.map(([time, text, faText]) => (
          <div key={time} className="grid grid-cols-[4rem_1fr] gap-3 text-sm">
            <dt className="font-medium tabular-nums text-amber-200">{time}</dt>
            <dd className="text-slate-300">
              <LocalizedText en={text} fa={faText} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
