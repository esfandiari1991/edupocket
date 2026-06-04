import type { Metadata } from "next";
import { EnglishLabExperience } from "@/components/english-lab/EnglishLabExperience";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "English Test Lab - IELTS, TOEFL, FCE & Cambridge English Practice",
  description:
    "An interactive EduPocket English practice hub for IELTS, TOEFL, Cambridge FCE/B2 First, grammar, vocabulary, reading, listening, writing, exams, and level checks by Ali Rad.",
  keywords: [
    "English test practice",
    "IELTS practice",
    "TOEFL practice",
    "FCE practice",
    "Cambridge B2 First practice",
    "grammar practice",
    "vocabulary practice",
    "English teacher for teens",
    "AI English learning",
  ],
  alternates: {
    canonical: "/english-lab",
  },
  openGraph: {
    title: "EduPocket English Test Lab - IELTS, TOEFL, FCE & Cambridge Practice",
    description: "Interactive English practice for IELTS, TOEFL, Cambridge FCE/B2 First, grammar, vocabulary, reading, writing, and level checks.",
    url: "/english-lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Test Lab - IELTS, TOEFL, FCE Practice | EduPocket",
    description: "Interactive English practice for IELTS, TOEFL, Cambridge FCE/B2 First, grammar, vocabulary, reading, writing, and level checks.",
  },
};

export default function EnglishLabPage() {
  return (
    <Container className="py-14">
      <EnglishLabExperience />
    </Container>
  );
}
