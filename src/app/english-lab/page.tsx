import type { Metadata } from "next";
import { EnglishLabExperience } from "@/components/english-lab/EnglishLabExperience";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "English Test Lab - IELTS, TOEFL, Cambridge, PTE, Duolingo, TOEIC, OET, CELPIP, CAEL & ESP",
  description:
    "An interactive EduPocket English practice hub for IELTS, TOEFL, Cambridge KET, PET, FCE/B2 First, CAE, CPE, YLE, Linguaskill, PTE, Duolingo English Test, TOEIC, OET, LanguageCert, Oxford Test of English, CELPIP, CAEL, MSRT, TOLIMO, EPT, GRE, GMAT, SAT, ACT, AP English, specialized English, grammar, vocabulary, reading, writing, and level checks by Ali Rad.",
  keywords: [
    "English test practice",
    "IELTS practice",
    "TOEFL practice",
    "TOEFL iBT practice",
    "TOEFL Essentials practice",
    "TOEFL ITP practice",
    "PTE Academic practice",
    "PTE Core practice",
    "Duolingo English Test practice",
    "TOEIC practice",
    "OET practice",
    "LanguageCert practice",
    "Oxford Test of English practice",
    "CELPIP practice",
    "CAEL practice",
    "KET practice",
    "PET practice",
    "FCE practice",
    "Cambridge B2 First practice",
    "Cambridge C1 Advanced practice",
    "Cambridge C2 Proficiency practice",
    "Cambridge YLE practice",
    "Cambridge Linguaskill practice",
    "MSRT practice",
    "TOLIMO practice",
    "EPT practice",
    "GRE verbal practice",
    "GMAT verbal practice",
    "SAT English practice",
    "ACT English practice",
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
    title: "EduPocket English Test Lab - IELTS, TOEFL, Cambridge, PTE, Duolingo, OET & ESP",
    description: "Interactive English practice for IELTS, TOEFL, Cambridge English, PTE, Duolingo, TOEIC, OET, LanguageCert, CELPIP, CAEL, GRE, GMAT, specialized English, grammar, vocabulary, reading, writing, and level checks.",
    url: "/english-lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Test Lab - IELTS, TOEFL, Cambridge, PTE, Duolingo, OET, ESP | EduPocket",
    description: "Interactive English practice for IELTS, TOEFL, Cambridge English, PTE, Duolingo, TOEIC, OET, CELPIP, CAEL, GRE, GMAT, specialized English, grammar, vocabulary, reading, writing, and level checks.",
  },
};

export default function EnglishLabPage() {
  return (
    <Container className="py-14">
      <EnglishLabExperience />
    </Container>
  );
}
