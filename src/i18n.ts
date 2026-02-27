import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/lang.json';
import translationKA from './locales/ka/lang.json';


const storedLanguage = localStorage.getItem('@lang') || 'ka';

const resources = {
  en: {
    translation: translationEN,
  },
  ka: {
    translation: translationKA,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'ka',
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
  });

export default i18n;
