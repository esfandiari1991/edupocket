import type { Metadata } from "next";
import { EnglishLabExperience } from "@/components/english-lab/EnglishLabExperience";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "English Test Lab - IELTS, TOEFL, PTE, Duolingo, OET, FCE, ESP & Cambridge English Practice",
  description:
    "An interactive EduPocket English practice hub for IELTS, TOEFL, PTE, Duolingo English Test, TOEIC, OET, LanguageCert, Cambridge FCE/B2 First, specialized English vocabulary, grammar, reading, listening, writing, exams, and level checks by Ali Rad.",
  keywords: [
    "English test practice",
    "IELTS practice",
    "TOEFL practice",
    "PTE Academic practice",
    "Duolingo English Test practice",
    "TOEIC practice",
    "OET practice",
    "LanguageCert practice",
    "CELPIP practice",
    "CAEL practice",
    "FCE practice",
    "Cambridge B2 First practice",
    "grammar practice",
    "vocabulary practice",
    "English teacher for teens",
    "specialized English practice",
    "English for Specific Purposes practice",
    "AI English learning",
  ],
  alternates: {
    canonical: "/english-lab",
  },
  openGraph: {
    title: "EduPocket English Test Lab - IELTS, TOEFL, PTE, Duolingo, OET, FCE, ESP & Cambridge Practice",
    description: "Interactive English practice for IELTS, TOEFL, PTE, Duolingo, TOEIC, OET, Cambridge FCE/B2 First, specialized English, grammar, vocabulary, reading, writing, and level checks.",
    url: "/english-lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Test Lab - IELTS, TOEFL, PTE, Duolingo, OET, FCE, ESP Practice | EduPocket",
    description: "Interactive English practice for IELTS, TOEFL, PTE, Duolingo, TOEIC, OET, Cambridge FCE/B2 First, specialized English, grammar, vocabulary, reading, writing, and level checks.",
  },
};

export default function EnglishLabPage() {
  return (
    <Container className="py-14">
      <EnglishLabExperience />
    </Container>
  );
}
