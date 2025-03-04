import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en.json";
import arTranslation from "../locales/ar.json";

// Create a resources object with our translations
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("carxpert-language") || "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
