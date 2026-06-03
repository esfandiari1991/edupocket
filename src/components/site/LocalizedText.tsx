import type { ReactNode } from "react";

type LocalizedTextProps = {
  en: ReactNode;
  fa: ReactNode;
};

export function LocalizedText({ en, fa }: LocalizedTextProps) {
  return (
    <>
      <span className="lang-en">{en}</span>
      <span className="lang-fa" lang="fa" dir="rtl">
        {fa}
      </span>
    </>
  );
}
