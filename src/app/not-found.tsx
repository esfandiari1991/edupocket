import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.045] p-8 text-center">
        <p className="text-sm font-semibold uppercase text-amber-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">This pocket is not here yet.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          The page may have moved, or it may be a future EduPocket idea that has not been published.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link className="rounded-[8px] bg-amber-400 px-4 py-2.5 text-slate-950" href="/">
            Home
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/articles">
            Articles
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/lessons">
            Lessons
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/podcasts">
            Podcasts
          </Link>
        </div>
      </div>
    </Container>
  );
}
