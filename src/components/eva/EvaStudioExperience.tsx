"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Clock, Compass, Download, FileText, Layers3, LockKeyhole, PenLine, RotateCcw, Target } from "lucide-react";
import type { EvaChapter } from "@/lib/eva-private-content";
import { cn } from "@/lib/utils";

type EvaStudioExperienceProps = {
  chapters: EvaChapter[];
};

export function EvaStudioExperience({ chapters }: EvaStudioExperienceProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [activeTrack, setActiveTrack] = useState("All");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [writing, setWriting] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activeChapter = useMemo(() => chapters.find((chapter) => chapter.id === activeId) ?? chapters[0], [activeId, chapters]);
  const tracks = useMemo(() => ["All", ...Array.from(new Set(chapters.map((chapter) => chapter.track)))], [chapters]);
  const filteredChapters = useMemo(
    () => (activeTrack === "All" ? chapters : chapters.filter((chapter) => chapter.track === activeTrack)),
    [activeTrack, chapters],
  );

  if (!activeChapter) return null;

  const wordCount = writing.trim().split(/\s+/).filter(Boolean).length;
  const completedAnswers = Object.keys(answers).filter((key) => key.startsWith(`${activeChapter.id}-`)).length;
  const completedChapterChecks = Object.keys(checked).filter((key) => key.startsWith(`${activeChapter.id}-`) && checked[key]).length;
  const progress = Math.min(100, Math.round(((completedAnswers + completedChapterChecks + (wordCount >= 90 ? 1 : 0)) / 7) * 100));

  function setAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((current) => ({ ...current, [`${activeChapter.id}-${questionIndex}`]: optionIndex }));
  }

  function resetChapter() {
    setAnswers((current) =>
      Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${activeChapter.id}-`))),
    );
    setWriting("");
    setChecked((current) =>
      Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${activeChapter.id}-`))),
    );
  }

  function exportNotes() {
    const text = [
      `# ${activeChapter.title}`,
      "",
      `Track: ${activeChapter.track}`,
      `Focus: ${activeChapter.focus}`,
      `Outcome: ${activeChapter.outcome}`,
      `Artifact: ${activeChapter.artifact}`,
      "",
      "## Writing",
      writing || "No writing yet.",
      "",
      "## Practice Ladder",
      activeChapter.practiceLadder.map((item) => `- ${item.level}: ${item.prompt}`).join("\n"),
      "",
      "## Vocabulary",
      activeChapter.vocabulary.join(", "),
    ].join("\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeChapter.id}-eva-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.1),rgba(14,165,233,0.075),rgba(255,255,255,0.035))] p-4 shadow-[0_22px_90px_rgba(0,0,0,0.18)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-amber-200">Ali + EduPocket product system</p>
            <h2 className="mt-2 max-w-3xl text-xl font-semibold leading-tight text-white sm:text-3xl">
              A private booklet becomes a guided study studio.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              The PDF stays as a visual master, but the web version breaks it into chapters, session modes, practice ladders, exportable notes, and a portfolio route.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 lg:w-[32rem]">
            {[
              { label: "Chapters", value: chapters.length.toString(), icon: Layers3 },
              { label: "Tracks", value: (tracks.length - 1).toString(), icon: Compass },
              { label: "Active", value: activeChapter.time, icon: Clock },
              { label: "Artifact", value: activeChapter.number, icon: FileText },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/36 p-2 sm:p-3">
                  <Icon aria-hidden="true" className="size-3.5 text-amber-200 sm:size-4" />
                  <p className="mt-2 text-base font-semibold text-white sm:mt-3 sm:text-lg">{item.value}</p>
                  <p className="text-[0.68rem] leading-4 text-slate-400 sm:text-xs">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[19rem_1fr]">
      <aside className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Eva Digital Booklet</p>
            <p className="text-xs text-slate-400">Private studio</p>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-400">{progress}% active chapter progress</p>

        <div className="mt-5 grid gap-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Choose by track</p>
          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => setActiveTrack(track)}
                className={cn(
                  "rounded-[8px] border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                  activeTrack === track ? "border-amber-300/45 bg-amber-300/12 text-amber-100" : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-amber-300/30 hover:text-slate-200",
                )}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-2">
          {filteredChapters.map((chapter) => {
            const active = activeChapter.id === chapter.id;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => setActiveId(chapter.id)}
                className={cn(
                  "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                  active ? "border-amber-300/50 bg-amber-300/10 text-white" : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-amber-300/35",
                )}
              >
                <span className="flex items-center justify-between gap-3 text-xs font-semibold text-amber-200">
                  <span>{chapter.number}</span>
                  <span className="text-slate-500">{chapter.time}</span>
                </span>
                <span className="mt-1 block text-sm font-semibold">{chapter.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{chapter.track} · {chapter.level}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="grid gap-5 xl:grid-cols-[1fr_21rem]">
        <div className="space-y-5">
          <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-200">{activeChapter.number} / {activeChapter.track} / {activeChapter.time}</p>
                <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">{activeChapter.title}</h1>
                <p className="mt-1 text-sm text-slate-400">{activeChapter.faTitle}</p>
              </div>
              <button
                type="button"
                onClick={resetChapter}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Reset
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { label: "Outcome", text: activeChapter.outcome, icon: Target },
                { label: "Use when", text: activeChapter.useCase, icon: Compass },
                { label: "Final artifact", text: activeChapter.artifact, icon: FileText },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-200">
                      <Icon aria-hidden="true" className="size-4" />
                      {item.label}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.065] p-4">
              <h2 className="text-lg font-semibold text-white">{activeChapter.reading.title}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-300">{activeChapter.reading.text}</p>
              <p className="mt-3 text-xs text-slate-500">{activeChapter.reading.source}</p>
            </div>

            <div className="mt-5 grid gap-3">
              {activeChapter.reading.questions.map((question, questionIndex) => {
                const selected = answers[`${activeChapter.id}-${questionIndex}`];

                return (
                  <fieldset key={question.prompt} className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4">
                    <legend className="text-sm font-semibold text-white">{question.prompt}</legend>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrect = question.answer === optionIndex;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAnswer(questionIndex, optionIndex)}
                            className={cn(
                              "rounded-[8px] border px-3 py-2.5 text-start text-sm transition",
                              isSelected && isCorrect
                                ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-100"
                                : isSelected
                                  ? "border-rose-300/45 bg-rose-300/10 text-rose-100"
                                  : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-amber-300/35",
                            )}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {activeChapter.practiceLadder.map((item) => (
                <div key={item.level} className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4">
                  <p className="text-xs font-semibold text-amber-200">{item.level}</p>
                  <h3 className="mt-2 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.prompt}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                <PenLine aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">Writing Studio</h2>
                <p className="text-sm leading-6 text-slate-400">{activeChapter.writing.task}</p>
              </div>
            </div>
            <textarea
              value={writing}
              onChange={(event) => setWriting(event.target.value)}
              className="mt-5 min-h-52 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
              placeholder="Start writing here..."
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Word count: {wordCount} · Artifact: {activeChapter.artifact}</p>
              <button
                type="button"
                onClick={exportNotes}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                <Download aria-hidden="true" className="size-4" />
                Export notes
              </button>
            </div>
          </article>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-lg font-semibold text-white">Session Flow</h2>
            <div className="mt-4 grid gap-2">
              {activeChapter.microTasks.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-[8px] border border-white/10 bg-slate-950/28 p-3 text-sm leading-6 text-slate-300">
                  <span className="text-xs font-semibold text-amber-200">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-lg font-semibold text-white">Checklist</h2>
            <div className="mt-4 grid gap-3">
              {activeChapter.writing.checklist.map((item) => {
                const id = `${activeChapter.id}-${item}`;
                const done = Boolean(checked[id]);

                return (
                  <label key={item} className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-slate-950/28 px-3 py-2.5 text-sm text-slate-300">
                    <span>{item}</span>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={(event) => setChecked((current) => ({ ...current, [id]: event.target.checked }))}
                      className="sr-only"
                    />
                    <span className={cn("flex size-6 items-center justify-center rounded-[6px] border", done ? "border-amber-200 bg-amber-200 text-slate-950" : "border-white/20")}>
                      {done ? <Check aria-hidden="true" className="size-4" /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-lg font-semibold text-white">Vocabulary Vault</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeChapter.vocabulary.map((word) => (
                <span key={word} className="rounded-[8px] border border-white/10 bg-slate-950/38 px-3 py-2 text-sm font-semibold text-slate-200">
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-amber-200/25 bg-amber-200/8 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/12 text-amber-200">
                <LockKeyhole aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-amber-100">Speaking is a 1:1 add-on</h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">Personal feedback sessions stay separate from the booklet.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
      </div>
    </div>
  );
}
