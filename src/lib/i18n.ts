import { en, es } from '@/locales';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    common: en.common,
    home: en.home,
  },
  es: {
    common: es.common,
    home: es.home,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    defaultNS: 'resource',
    ns: [
      'common',
    ],
    interpolation: {
      escapeValue: false,
    },
    keySeparator: '.',
    nsSeparator: false,
  });

export default i18n;
