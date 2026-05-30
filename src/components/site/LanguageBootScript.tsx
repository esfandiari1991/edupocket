const script = `
try {
  var language = localStorage.getItem("edupocket-language");
  if (language !== "fa" && language !== "en") language = "en";
  document.documentElement.dataset.lang = language;
  document.documentElement.lang = language === "fa" ? "fa" : "en";
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
} catch (error) {
  document.documentElement.dataset.lang = "en";
}
`;

export function LanguageBootScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
