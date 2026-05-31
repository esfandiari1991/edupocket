import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  level?: 1 | 2;
};

export function SectionHeading({ title, description, action, level = 2 }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Heading className="text-2xl font-semibold text-white sm:text-3xl">{title}</Heading>
        {description ? <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
