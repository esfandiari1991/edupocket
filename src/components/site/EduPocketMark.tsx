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
      <defs>
        <linearGradient id="edupocket-mark-gold" x1="36" x2="216" y1="28" y2="224" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE98A" />
          <stop offset="0.48" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient id="edupocket-mark-paper" x1="78" x2="180" y1="78" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7D6" />
          <stop offset="1" stopColor="#BEEBFF" />
        </linearGradient>
      </defs>
      <rect x="15" y="15" width="226" height="226" rx="48" fill="url(#edupocket-mark-gold)" />
      <rect x="30" y="30" width="196" height="196" rx="36" className="fill-slate-950" />
      <path
        d="M61 73C81 60 104 62 128 78C152 62 175 60 195 73V168C173 157 151 162 128 179C105 162 83 157 61 168V73Z"
        fill="url(#edupocket-mark-paper)"
      />
      <path d="M128 78V180" className="stroke-slate-950" strokeWidth="8" strokeLinecap="round" />
      <path d="M84 96H112M84 118H108M84 140H116" className="stroke-slate-950" strokeWidth="9" strokeLinecap="round" />
      <path d="M144 98C158 90 171 89 185 96M144 121C159 113 171 113 185 120M144 144C159 136 171 136 185 143" className="stroke-slate-950" strokeWidth="9" strokeLinecap="round" />
      <path d="M64 168C86 157 106 162 128 179C150 162 170 157 192 168" className="stroke-amber-400" strokeWidth="9" strokeLinecap="round" />
      <path d="M64 188H192" className="stroke-sky-200" strokeWidth="9" strokeLinecap="round" />
      <circle cx="198" cy="58" r="7" className="fill-amber-300" />
      <path d="M198 38V47M198 69V78M178 58H187M209 58H218" className="stroke-amber-300" strokeWidth="7" strokeLinecap="round" />
      <path d="M52 204C77 215 178 215 204 204" className="stroke-amber-300" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
