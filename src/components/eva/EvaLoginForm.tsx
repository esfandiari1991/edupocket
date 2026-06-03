import { LockKeyhole, Send } from "lucide-react";
import { LocalizedText } from "@/components/site/LocalizedText";

type EvaLoginFormProps = {
  error?: string;
};

export function EvaLoginForm({ error }: EvaLoginFormProps) {
  const hasError = error === "passcode";
  const hasConfigError = error === "config";

  return (
    <form action="/eva-digital-booklet/login" method="post" className="rounded-[8px] border border-white/10 bg-slate-950/46 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-[8px] border border-amber-200/20 bg-amber-200/10 text-amber-200">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-white">
            <LocalizedText en="Premium member access" fa="دسترسی اعضای پریمیوم" />
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            <LocalizedText en="Only premium members have access to it." fa="فقط اعضای پریمیوم به آن دسترسی دارند." />
          </p>
        </div>
      </div>

      <label htmlFor="eva-passcode" className="mt-5 block text-sm font-semibold text-slate-200">
        <LocalizedText en="Passcode" fa="رمز ورود" />
      </label>
      <input
        id="eva-passcode"
        name="passcode"
        type="password"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        required
        suppressHydrationWarning
        className="mt-2 min-h-12 w-full rounded-[8px] border border-white/10 bg-slate-950/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/20"
        placeholder="••••••••"
      />
      {hasError ? (
        <p className="mt-3 text-sm leading-6 text-rose-200">
          <LocalizedText en="That passcode did not open the portal." fa="این رمز، پرتال را باز نکرد." />
        </p>
      ) : null}
      {hasConfigError ? (
        <p className="mt-3 text-sm leading-6 text-rose-200">
          <LocalizedText en="Premium access is not configured yet." fa="دسترسی پریمیوم هنوز تنظیم نشده است." />
        </p>
      ) : null}
      <button
        type="submit"
        className="motion-button-pop mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_54px_rgba(251,191,36,0.22)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
      >
        <LocalizedText en="Unlock" fa="ورود" />
        <Send aria-hidden="true" className="size-4 rtl:rotate-180" />
      </button>
    </form>
  );
}
