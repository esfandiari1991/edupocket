"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Eye, EyeOff, LockKeyhole, RefreshCw, Sparkles, Timer, X } from "lucide-react";
import { defaultLabModule, englishLevels, labModules, skillTracks, type EnglishLevel, type EnglishSkill, type LabModule } from "@/lib/english-lab";
import { cn } from "@/lib/utils";
import { ContactPanel } from "@/components/site/ContactPanel";
import { LocalizedText } from "@/components/site/LocalizedText";

const allLevels = "all";

function levelResult(score: number, total: number) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.9) return { en: "B2-ready accuracy", fa: "دقت نزدیک به B2" };
  if (ratio >= 0.67) return { en: "B1 growth zone", fa: "محدوده رشد B1" };
  if (ratio >= 0.34) return { en: "A2 strengthening zone", fa: "محدوده تقویت A2" };
  return { en: "A1 foundation reset", fa: "بازسازی پایه A1" };
}

function moduleMatches(module: LabModule, selectedSkill: EnglishSkill, selectedLevel: EnglishLevel | typeof allLevels) {
  return module.skill === selectedSkill && (selectedLevel === allLevels || module.level === selectedLevel);
}

export function EnglishLabExperience() {
  const [selectedSkill, setSelectedSkill] = useState<EnglishSkill>("grammar");
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | typeof allLevels>("all");
  const [activeModuleId, setActiveModuleId] = useState(defaultLabModule.id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [writingText, setWritingText] = useState("");

  const filteredModules = useMemo(
    () => labModules.filter((module) => moduleMatches(module, selectedSkill, selectedLevel)),
    [selectedSkill, selectedLevel],
  );

  const activeModule = labModules.find((module) => module.id === activeModuleId) ?? defaultLabModule;
  const activeQuestions = activeModule.questions;
  const selectedTrack = skillTracks.find((track) => track.id === selectedSkill) ?? skillTracks[0];
  const SelectedTrackIcon = selectedTrack.icon;
  const score = activeQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  const complete = activeQuestions.length > 0 && activeQuestions.every((_, index) => answers[index] !== undefined);
  const wordCount = writingText.trim().split(/\s+/).filter(Boolean).length;
  const writingChecks = [
    { en: "clear opinion", fa: "نظر روشن", done: /\b(i think|in my opinion|i believe|from my point of view)\b/i.test(writingText) || /به نظر|فکر می کنم/.test(writingText) },
    { en: "example included", fa: "مثال دارد", done: /\b(for example|for instance|such as)\b/i.test(writingText) || /مثلا|برای مثال/.test(writingText) },
    { en: "50+ words", fa: "بیش از ۵۰ کلمه", done: wordCount >= 50 },
  ];

  function selectSkill(skill: EnglishSkill) {
    const firstReady = labModules.find((module) => module.skill === skill && module.status === "ready");
    setSelectedSkill(skill);
    setSelectedLevel("all");
    if (firstReady) setActiveModuleId(firstReady.id);
    setAnswers({});
    setSubmitted(false);
  }

  function selectLevel(level: EnglishLevel | typeof allLevels) {
    const firstReady = labModules.find((module) => module.skill === selectedSkill && (level === allLevels || module.level === level) && module.status === "ready");
    setSelectedLevel(level);
    if (firstReady) setActiveModuleId(firstReady.id);
    setAnswers({});
    setSubmitted(false);
  }

  function selectModule(module: LabModule) {
    if (module.status === "upcoming") return;
    setActiveModuleId(module.id);
    setAnswers({});
    setSubmitted(false);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.16),transparent_24rem),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-amber-200">
              <LocalizedText en="English Test Lab" fa="آزمایشگاه تست انگلیسی" />
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              <LocalizedText en="A compact, interactive English practice hub." fa="هاب تمرین انگلیسی فشرده و کاملا تعاملی." />
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              <LocalizedText
                en="Grammar, vocabulary, reading, listening-style tasks, Use of English, writing prompts, exam habits, and a fast level sample. The structure is benchmarked against serious English-practice sites, but every exercise here is original EduPocket material."
                fa="گرامر، واژگان، ریدینگ، تمرین های شبیه شنیداری، کاربرد انگلیسی، نوشتن، عادت های آزمونی و یک نمونه تعیین سطح سریع. ساختار بر اساس سایت های جدی تمرین انگلیسی الگوبرداری شده، اما تمرین ها محتوای اصلی EduPocket هستند."
              />
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { en: "40-50% starter scale", fa: "نسخه شروع ۴۰ تا ۵۰ درصدی" },
                { en: "instant feedback", fa: "بازخورد فوری" },
                { en: "no empty links", fa: "بدون لینک خالی" },
              ].map((item) => (
                <div key={item.en} className="rounded-[8px] border border-white/10 bg-slate-950/30 px-4 py-3 text-sm font-semibold text-slate-200">
                  <LocalizedText en={item.en} fa={item.fa} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-amber-200/20 bg-slate-950/40 p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {skillTracks.map((track) => {
                const Icon = track.icon;
                const selected = selectedSkill === track.id;

                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => selectSkill(track.id)}
                    className={cn(
                      "min-h-24 rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/60",
                      selected ? "border-amber-300/65 bg-amber-300/12 text-white shadow-[0_18px_50px_rgba(251,191,36,0.12)]" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
                    )}
                  >
                    <Icon aria-hidden="true" className={cn("size-5", selected ? "text-amber-200" : "text-slate-400")} />
                    <span className="mt-3 block text-sm font-semibold">
                      <LocalizedText en={track.shortTitle.en} fa={track.shortTitle.fa} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-3">
            <span className={cn("flex size-11 items-center justify-center rounded-[8px] bg-gradient-to-br", selectedTrack.color)}>
              <SelectedTrackIcon aria-hidden="true" className="size-5 text-amber-100" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">
                <LocalizedText en={selectedTrack.title.en} fa={selectedTrack.title.fa} />
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                <LocalizedText en={selectedTrack.description.en} fa={selectedTrack.description.fa} />
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectLevel(allLevels)}
              className={cn(
                "rounded-[8px] border px-3 py-2 text-sm font-semibold transition",
                selectedLevel === allLevels ? "border-amber-300/60 bg-amber-300/12 text-amber-100" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
              )}
            >
              <LocalizedText en="All levels" fa="همه سطح ها" />
            </button>
            {englishLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => selectLevel(level.id)}
                className={cn(
                  "rounded-[8px] border px-3 py-2 text-sm font-semibold transition",
                  selectedLevel === level.id ? "border-amber-300/60 bg-amber-300/12 text-amber-100" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
                )}
              >
                <LocalizedText en={level.label} fa={level.faLabel} />
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => {
                const active = activeModule.id === module.id;
                const locked = module.status === "upcoming";

                return (
                  <button
                    key={module.id}
                    type="button"
                    disabled={locked}
                    onClick={() => selectModule(module)}
                    className={cn(
                      "rounded-[8px] border p-4 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/60 disabled:cursor-not-allowed",
                      active && !locked
                        ? "border-amber-300/60 bg-amber-300/10"
                        : locked
                          ? "border-dashed border-slate-500/35 bg-slate-900/30 opacity-75"
                          : "border-white/10 bg-white/[0.035] hover:border-amber-300/35 hover:bg-white/[0.055]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-amber-200">{module.level}</p>
                        <h3 className="mt-1 font-semibold text-white">
                          <LocalizedText en={module.title.en} fa={module.title.fa} />
                        </h3>
                      </div>
                      {locked ? (
                        <span className="inline-flex items-center gap-1 rounded-[6px] border border-slate-500/35 px-2 py-1 text-xs font-semibold text-slate-300">
                          <LockKeyhole aria-hidden="true" className="size-3" />
                          <LocalizedText en="Upcoming" fa="به زودی" />
                        </span>
                      ) : (
                        <ArrowRight aria-hidden="true" className="mt-1 size-4 text-amber-200 rtl:rotate-180" />
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      <LocalizedText en={module.description.en} fa={module.description.fa} />
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Timer aria-hidden="true" className="size-3.5" />
                        <LocalizedText en={module.duration.en} fa={module.duration.fa} />
                      </span>
                      <span>
                        <LocalizedText en={module.format.en} fa={module.format.fa} />
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[8px] border border-dashed border-slate-500/35 bg-slate-900/30 p-5 text-sm text-slate-400">
                <LocalizedText en="This filter is empty for now. Try another level." fa="این فیلتر فعلا محتوایی ندارد. سطح دیگری را امتحان کن." />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-200">{activeModule.level}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                <LocalizedText en={activeModule.title.en} fa={activeModule.title.fa} />
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                <LocalizedText en={activeModule.description.en} fa={activeModule.description.fa} />
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              <LocalizedText en="Reset" fa="شروع دوباره" />
            </button>
          </div>

          {activeModule.skill === "listening" ? (
            <div className="mt-5 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.08] p-4">
              <button type="button" onClick={() => setShowTranscript((value) => !value)} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
                {showTranscript ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                <LocalizedText en={showTranscript ? "Hide transcript" : "Reveal transcript"} fa={showTranscript ? "پنهان کردن متن" : "نمایش متن شنیداری"} />
              </button>
              {showTranscript ? (
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  <LocalizedText
                    en="I study English after dinner and review five words. It is a small habit, but it helps me remember more."
                    fa="بعد از شام انگلیسی می خوانم و پنج کلمه مرور می کنم. عادت کوچکی است، اما کمک می کند بیشتر یادم بماند."
                  />
                </p>
              ) : (
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  <LocalizedText en="Try the questions first. Then reveal the transcript and check what you missed." fa="اول سوال ها را جواب بده. بعد متن را ببین و بررسی کن چه چیزی را از دست دادی." />
                </p>
              )}
            </div>
          ) : null}

          {activeModule.skill === "writing" ? (
            <div className="mt-5 rounded-[8px] border border-rose-200/15 bg-rose-300/[0.08] p-4">
              <label className="text-sm font-semibold text-rose-100" htmlFor="writing-studio">
                <LocalizedText en="Write 50-90 words: Should students use AI for homework practice?" fa="۵۰ تا ۹۰ کلمه بنویس: آیا دانش آموزها باید برای تمرین تکلیف از AI استفاده کنند؟" />
              </label>
              <textarea
                id="writing-studio"
                value={writingText}
                onChange={(event) => setWritingText(event.target.value)}
                rows={6}
                className="mt-3 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/70 p-3 text-sm leading-7 text-slate-100 outline-none transition focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/25"
                placeholder="In my opinion..."
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-[6px] bg-white/[0.055] px-2 py-1 text-xs font-semibold text-slate-300">
                  <LocalizedText en={`${wordCount} words`} fa={`${wordCount} کلمه`} />
                </span>
                {writingChecks.map((check) => (
                  <span
                    key={check.en}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-semibold",
                      check.done ? "bg-emerald-300/12 text-emerald-100" : "bg-slate-800/80 text-slate-400",
                    )}
                  >
                    {check.done ? <Check aria-hidden="true" className="size-3" /> : <X aria-hidden="true" className="size-3" />}
                    <LocalizedText en={check.en} fa={check.fa} />
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {activeQuestions.map((question, questionIndex) => {
              const selected = answers[questionIndex];
              const correct = selected === question.answer;

              return (
                <fieldset key={question.prompt.en} className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4">
                  <legend className="px-1 text-sm font-semibold text-white">
                    <LocalizedText en={question.prompt.en} fa={question.prompt.fa} />
                  </legend>
                  <div className="mt-4 grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const chosen = selected === optionIndex;
                      const revealCorrect = submitted && optionIndex === question.answer;
                      const revealWrong = submitted && chosen && !correct;

                      return (
                        <label
                          key={option.en}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-[8px] border px-3 py-2.5 text-sm font-medium transition",
                            revealCorrect
                              ? "border-emerald-300/45 bg-emerald-300/12 text-emerald-50"
                              : revealWrong
                                ? "border-rose-300/45 bg-rose-300/10 text-rose-50"
                                : chosen
                                  ? "border-amber-300/45 bg-amber-300/10 text-amber-50"
                                  : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-amber-300/30",
                          )}
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            checked={chosen}
                            onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                            className="size-4 accent-amber-300"
                          />
                          <span>
                            <LocalizedText en={option.en} fa={option.fa} />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {submitted ? (
                    <p className={cn("mt-3 flex items-start gap-2 text-sm leading-6", correct ? "text-emerald-100" : "text-amber-100")}>
                      {correct ? <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> : <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0" />}
                      <span>
                        <LocalizedText en={question.feedback.en} fa={question.feedback.fa} />
                      </span>
                    </p>
                  ) : null}
                </fieldset>
              );
            })}
          </div>

          <div className="mt-6 rounded-[8px] border border-white/10 bg-slate-950/36 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  <LocalizedText en="Instant result" fa="نتیجه فوری" />
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  <LocalizedText en={submitted ? `${score}/${activeQuestions.length} correct` : "Answer every question to unlock feedback."} fa={submitted ? `${score}/${activeQuestions.length} جواب درست` : "همه سوال ها را جواب بده تا بازخورد باز شود."} />
                </p>
              </div>
              <button
                type="button"
                disabled={!complete}
                onClick={() => setSubmitted(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_44px_rgba(251,191,36,0.22)] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                <LocalizedText en="Check answers" fa="بررسی جواب ها" />
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </button>
            </div>
            {submitted ? (
              <div className="mt-4 rounded-[8px] border border-amber-200/20 bg-amber-200/[0.08] p-4">
                <p className="text-lg font-semibold text-white">
                  <LocalizedText en={levelResult(score, activeQuestions.length).en} fa={levelResult(score, activeQuestions.length).fa} />
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  <LocalizedText
                    en="Use this as a sample, not a final certificate. For a personal plan, message Ali with your score and goal."
                    fa="این فقط یک نمونه است، نه مدرک نهایی. برای برنامه شخصی، امتیاز و هدفت را برای علی بفرست."
                  />
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <ContactPanel context="lesson" />
    </div>
  );
}
