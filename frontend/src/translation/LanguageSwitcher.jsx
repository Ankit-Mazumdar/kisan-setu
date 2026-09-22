import React from "react";

import { useTranslation } from "./useTranslation";

import "./language-switcher.css";

/**
 * Small reusable language switcher.
 * Default appearance: floating bottom-right button group.
 */
export default function LanguageSwitcher({ floating = true }) {
  const { language, setLanguage } = useTranslation();

  return (
    <div
      className={`translation-switcher ${
        floating ? "translation-switcher--floating" : ""
      }`}
      aria-label="Language selector"
    >
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>

      <button
        type="button"
        className={language === "bn" ? "active" : ""}
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}