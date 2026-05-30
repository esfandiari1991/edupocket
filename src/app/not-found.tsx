import Link from "next/link";
import { Container } from "@/components/site/Container";
import { LocalizedText } from "@/components/site/LocalizedText";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.045] p-8 text-center">
        <p className="text-sm font-semibold uppercase text-amber-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          <LocalizedText en="This pocket is not here yet." fa="این پاکت هنوز اینجا نیست." />
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          <LocalizedText
            en="The page may have moved, or it may be a future EduPocket idea that has not been published."
            fa="ممکن است صفحه جابه جا شده باشد، یا ایده ای برای آینده EduPocket باشد که هنوز منتشر نشده."
          />
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link className="rounded-[8px] bg-amber-400 px-4 py-2.5 text-slate-950" href="/">
            <LocalizedText en="Home" fa="خانه" />
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/articles">
            <LocalizedText en="Articles" fa="مقاله ها" />
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/lessons">
            <LocalizedText en="Lessons" fa="درس ها" />
          </Link>
          <Link className="rounded-[8px] border border-white/10 px-4 py-2.5 text-slate-100" href="/podcasts">
            <LocalizedText en="Podcasts" fa="پادکست ها" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
