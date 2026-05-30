import type { Metadata } from "next";
import { BrainCircuit, GraduationCap, Languages, Laptop, ListChecks, Repeat } from "lucide-react";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "About Ali Rad",
  description: "Learn about Ali Rad, the teacher and builder behind EduPocket.",
};

const strengths = [
  { title: "English teaching", text: "IELTS, TOEFL, KET, Business English, conversational English, and kids English.", icon: GraduationCap },
  { title: "Languages", text: "Arabic teaching, bilingual support, vocabulary systems, and language coaching.", icon: Languages },
  { title: "Technology", text: "Computer engineering, Python, SQL, AI practice, and learning-system design.", icon: Laptop },
  { title: "Frameworks", text: "Structured teaching frameworks, micro-lessons, exam strategy, and practical roadmaps.", icon: ListChecks },
  { title: "Practice loops", text: "Spaced repetition, error logs, feedback cycles, and small measurable habits.", icon: Repeat },
  { title: "AI learning", text: "AI as a thinking partner for teachers, students, and creators, not a shortcut.", icon: BrainCircuit },
];

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="About Ali Rad"
        description="EduPocket is the public learning library of Ali Esfandiari Rad: English teacher, computer engineer, Arabic teacher, AI practitioner, CELTA student, online tutor, and language coach."
      />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-semibold text-white">A practical education lab</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Ali teaches English, exam preparation, math, SQL, Python, and AI learning systems online. EduPocket brings
            those lessons into a structured content hub: notes, micro-lessons, podcasts, and frameworks that help learners
            practice with clarity.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            The focus is simple: make learning easier to repeat. That means clear frameworks, short lessons, error logs,
            spaced repetition, bilingual support, and AI-assisted study habits that improve real performance.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
                <Icon aria-hidden="true" className="size-6 text-amber-200" />
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
