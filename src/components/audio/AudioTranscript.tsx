type AudioTranscriptProps = {
  enabled: boolean;
  title: string;
};

const sampleBeats = [
  ["00:00", "Welcome and the learning problem"],
  ["01:30", "Why systems beat motivation"],
  ["03:10", "Practice, feedback, and error logs"],
  ["05:45", "How AI can support thinking"],
  ["07:20", "A small action for this week"],
];

export function AudioTranscript({ enabled, title }: AudioTranscriptProps) {
  if (!enabled) return null;

  return (
    <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-semibold text-white">Transcript guide</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Use these listening beats as a study map for <span className="text-slate-200">{title}</span>. The full transcript can be
        expanded later when the audio is attached.
      </p>
      <dl className="mt-5 grid gap-3">
        {sampleBeats.map(([time, text]) => (
          <div key={time} className="grid grid-cols-[4rem_1fr] gap-3 text-sm">
            <dt className="font-medium tabular-nums text-amber-200">{time}</dt>
            <dd className="text-slate-300">{text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
