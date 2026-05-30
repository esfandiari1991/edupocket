import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ComponentType<LucideProps>;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, icon: Icon, variant = "secondary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2",
        variant === "primary"
          ? "bg-amber-400 text-slate-950 shadow-[0_18px_44px_rgba(251,191,36,0.24)] hover:bg-amber-300 focus:ring-amber-200"
          : "border border-white/15 bg-white/[0.03] text-slate-100 hover:border-amber-300/50 hover:bg-white/[0.06] focus:ring-amber-300/60",
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      {children}
    </Link>
  );
}
