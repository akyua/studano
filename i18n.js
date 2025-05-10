import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import en from "@/languages/en.json";
import pt from "@/languages/pt.json";

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    const locales = RNLocalize.getLocales();
    callback(locales[0]?.languageCode || "en");
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
