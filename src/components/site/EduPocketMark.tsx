import { cn } from "@/lib/utils";

type EduPocketMarkProps = {
  className?: string;
};

export function EduPocketMark({ className }: EduPocketMarkProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      role="img"
      aria-label="EduPocket"
      className={cn("h-10 w-10", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="16" y="16" width="224" height="224" rx="44" className="fill-amber-400" />
      <path
        d="M64 72C84 61 103 63 128 80C153 63 172 61 192 72V172C171 161 151 164 128 181C105 164 85 161 64 172V72Z"
        className="fill-slate-950"
      />
      <path d="M78 91C94 84 108 88 122 99V153C108 142 94 138 78 144V91Z" className="fill-amber-100" />
      <path d="M178 91C162 84 148 88 134 99V153C148 142 162 138 178 144V91Z" className="fill-sky-200" />
      <path d="M128 82V182" className="stroke-amber-400" strokeWidth="7" strokeLinecap="round" />
      <path d="M93 113H113M143 113H163M93 133H110M146 133H163" className="stroke-slate-950" strokeWidth="8" strokeLinecap="round" />
      <circle cx="194" cy="69" r="8" className="fill-slate-950" />
      <path d="M194 43V55M194 83V95M168 69H180M208 69H220" className="stroke-slate-950" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
