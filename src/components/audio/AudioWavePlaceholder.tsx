import { cn } from "@/lib/utils";

const bars = [24, 38, 18, 50, 34, 62, 28, 44, 74, 36, 56, 26, 46, 68, 40, 22, 52, 32, 60, 42, 25, 48];

export function AudioWavePlaceholder({ active = false, className }: { active?: boolean; className?: string }) {
  return (
    <div className={cn("flex h-12 items-center gap-1", className)} aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={cn("w-1 rounded-full", active ? "bg-amber-300" : "bg-sky-300/70")}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
