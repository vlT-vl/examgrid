import React from "react";
import { useLang } from "../uiText.jsx";

export default function LanguageToggle({ className }) {
  const { lang, toggleLang, t } = useLang();

  return (
    <button
      className={`lang-toggle${className ? ` ${className}` : ""}`}
      onClick={toggleLang}
      type="button"
      aria-label={t("lang.switchTo")}
      title={t("lang.switchTo")}
    >
      {lang.toUpperCase()}
    </button>
  );
}
