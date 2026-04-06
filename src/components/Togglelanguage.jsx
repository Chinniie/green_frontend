import i18n from "../i18n";

export default function LanguageToggle() {
  return (
    <div className="flex gap-2">
      <button onClick={() => i18n.changeLanguage("th")}>
        TH
      </button>
      <button onClick={() => i18n.changeLanguage("en")}>
        EN
      </button>
    </div>
  );
}