import { LocalizedText } from "@/components/site/LocalizedText";

type AudioTranscriptProps = {
  enabled: boolean;
  title: string;
  titleFa?: string;
};

const sampleBeats = [
  ["00:00", "Welcome and the learning problem", "خوشامد و مسئله یادگیری"],
  ["01:30", "Why systems beat motivation", "چرا سیستم از انگیزه قوی تر است"],
  ["03:10", "Practice, feedback, and error logs", "تمرین، بازخورد و دفتر خطا"],
  ["05:45", "How AI can support thinking", "هوش مصنوعی چطور به فکر کردن کمک می کند"],
  ["07:20", "A small action for this week", "یک اقدام کوچک برای این هفته"],
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
              Use these listening beats as a study map for <span className="text-slate-200">{title}</span>. The full transcript can be
              expanded later when the audio is attached.
            </>
          }
          fa={
            <>
              از این ایستگاه های شنیداری به عنوان نقشه مطالعه برای <span className="text-slate-200">{titleFa ?? title}</span> استفاده کن. وقتی فایل صوتی اضافه شود، متن کامل هم قابل گسترش است.
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
