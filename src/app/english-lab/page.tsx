import type { Metadata } from "next";
import { EnglishLabExperience } from "@/components/english-lab/EnglishLabExperience";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "English Test Lab",
  description: "An interactive EduPocket English practice hub for grammar, vocabulary, reading, listening, writing, exams, and level checks.",
  keywords: ["English test practice", "grammar practice", "vocabulary practice", "IELTS practice", "TOEFL practice", "AI English learning"],
  alternates: {
    canonical: "/english-lab",
  },
  openGraph: {
    title: "EduPocket English Test Lab",
    description: "An interactive EduPocket English practice hub for grammar, vocabulary, reading, listening, writing, exams, and level checks.",
    url: "/english-lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Test Lab | EduPocket",
    description: "An interactive EduPocket English practice hub for grammar, vocabulary, reading, listening, writing, exams, and level checks.",
  },
};

export default function EnglishLabPage() {
  return (
    <Container className="py-14">
      <EnglishLabExperience />
    </Container>
  );
}
