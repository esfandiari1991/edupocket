import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Container } from "@/components/site/Container";
import { EvaStudioExperience } from "@/components/eva/EvaStudioExperience";
import { evaSessionCookieName, isValidEvaSessionToken } from "@/lib/eva-auth";
import { evaBooklet } from "@/lib/eva-private-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eva Digital Booklet Studio",
  description: "Premium-member Eva Digital Booklet studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EvaBookletStudioPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(evaSessionCookieName)?.value;

  if (!isValidEvaSessionToken(token)) redirect("/eva-digital-booklet");

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-200">Premium member access</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-4xl">Eva Digital Booklet Studio</h1>
        </div>
        <form action="/eva-digital-booklet/logout" method="post">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Logout
          </button>
        </form>
      </div>
      <EvaStudioExperience booklet={evaBooklet} />
    </Container>
  );
}
