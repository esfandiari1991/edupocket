import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-xs font-medium text-amber-100",
        className,
      )}
    >
      {children}
    </span>
  );
}
