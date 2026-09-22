import translations from "./translations";

/**
 * Core translation engine.
 * Can be used independently of React.
 */

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "bn"];

export function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

export function translate(key, language = DEFAULT_LANGUAGE, variables = {}) {
  const activeLanguage = isSupportedLanguage(language)
    ? language
    : DEFAULT_LANGUAGE;

  const dictionary = translations[activeLanguage] || {};
  const fallbackDictionary = translations[DEFAULT_LANGUAGE] || {};

  // Supports nested keys such as "booking.confirmed" if added later.
  const getValue = (source, path) =>
    path.split(".").reduce((value, part) => value?.[part], source);

  let value = getValue(dictionary, key);

  // English is the fallback if Bengali or another dictionary is incomplete.
  if (value === undefined) {
    value = getValue(fallbackDictionary, key);
  }

  // If no translation exists, return the original key.
  if (value === undefined) {
    value = key;
  }

  // Optional interpolation:
  // t("Hello, {name}", { name: "Ankit" })
  return String(value).replace(/\{(\w+)\}/g, (_, variable) => {
    return variables[variable] !== undefined
      ? String(variables[variable])
      : `{${variable}}`;
  });
}

export function getLanguageLabel(language) {
  return language === "bn" ? "বাংলা" : "English";
}
