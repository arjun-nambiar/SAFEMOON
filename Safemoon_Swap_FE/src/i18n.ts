import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const lngList = ['de', 'en', 'es-AR', 'es-US', 'it-IT', 'iw', 'jp', 'ko', 'ro', 'ru-RU', 'vu', 'zh-CN', 'zh-TW' ];
const locale = navigator.language;

const searchLng = () => lngList.find(item => item === locale || item === locale.split('-')[0]);
let lng = searchLng();
if(!lng) {
  lng = 'en-EN';
  localStorage.setItem('i18nextLng', 'en-EN')
}

i18next
  .use(LanguageDetector)
  .use(resourcesToBackend((_, __, callback) => {
    import(`../public/locales/${lng}.json`)
      .then((resources) => {
        callback(null, resources)
      })
      .catch((error) => {
        callback(error, null)
      })
  }))
  .use(initReactI18next)
  .init({
    react: {
      useSuspense: true
    },
    keySeparator: false,
    partialBundledLanguages: true,
    interpolation: { escapeValue: false }
  });

localStorage.setItem('i18nextLng', lng);
window.addEventListener('storage', () => {
  if(!localStorage.getItem('i18nextLng')) localStorage.setItem('i18nextLng', lng);
  lng = searchLng();
  if(!lng) {
    localStorage.setItem('i18nextLng', 'en-EN')
  } else {
    localStorage.setItem('i18nextLng', lng)
  }
});

export default i18next
