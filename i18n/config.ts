import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const defaultLang = localStorage.getItem('i18nextLng');

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: defaultLang || 'en',
    fallbackLng: defaultLang || 'en',
    supportedLngs: ['en', 'tr'], 
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag', 'path'],
      caches: ['cookie'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
  });

export default i18n;
