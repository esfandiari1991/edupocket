"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Download, LockKeyhole, PenLine, RotateCcw } from "lucide-react";
import type { EvaChapter } from "@/lib/eva-private-content";
import { cn } from "@/lib/utils";

type EvaStudioExperienceProps = {
  chapters: EvaChapter[];
};

export function EvaStudioExperience({ chapters }: EvaStudioExperienceProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [writing, setWriting] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activeChapter = useMemo(() => chapters.find((chapter) => chapter.id === activeId) ?? chapters[0], [activeId, chapters]);
  if (!activeChapter) return null;

  const wordCount = writing.trim().split(/\s+/).filter(Boolean).length;
  const completedChecks = Object.values(checked).filter(Boolean).length;
  const progress = Math.min(100, Math.round(((Object.keys(answers).length + completedChecks + (wordCount >= 80 ? 1 : 0)) / 8) * 100));

  function setAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((current) => ({ ...current, [`${activeChapter.id}-${questionIndex}`]: optionIndex }));
  }

  function resetChapter() {
    setAnswers({});
    setWriting("");
    setChecked({});
  }

  function exportNotes() {
    const text = [
      `# ${activeChapter.title}`,
      "",
      `Focus: ${activeChapter.focus}`,
      "",
      "## Writing",
      writing || "No writing yet.",
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
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
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

        <div className="mt-6 grid gap-2">
          {chapters.map((chapter) => {
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
                <span className="text-xs font-semibold text-amber-200">{chapter.number}</span>
                <span className="mt-1 block text-sm font-semibold">{chapter.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{chapter.level}</span>
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
                <p className="text-xs font-semibold text-amber-200">{activeChapter.number} / {activeChapter.focus}</p>
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
          </article>

          <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                <PenLine aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">Writing Studio</h2>
                <p className="text-sm text-slate-400">{activeChapter.writing.task}</p>
              </div>
            </div>
            <textarea
              value={writing}
              onChange={(event) => setWriting(event.target.value)}
              className="mt-5 min-h-52 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
              placeholder="Start writing here..."
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Word count: {wordCount}</p>
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
  );
}
