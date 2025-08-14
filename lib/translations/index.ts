import uz from './uz.json';
import ru from './ru.json';
import en from './en.json';

export type Language = 'uz' | 'ru' | 'en';

export const languages: Language[] = ['uz', 'ru', 'en'];

export const defaultLanguage: Language = 'uz';

export const languageNames = {
  uz: 'O\'zbekcha',
  ru: 'Русский',
  en: 'English',
};

const translations = {
  uz,
  ru,
  en,
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations[defaultLanguage];
}

export function t(lang: Language, key: string, params?: Record<string, string>): string {
  const translation = getTranslation(lang);
  
  // Navigate through nested keys (e.g., "header.title")
  const keys = key.split('.');
  let value: any = translation;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to default language
      value = getTranslation(defaultLanguage);
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters in the string
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  
  return value;
}

export function detectLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }
  
  // Check localStorage first
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && languages.includes(savedLang)) {
    return savedLang;
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('uz') || browserLang.startsWith('uz-')) {
    return 'uz';
  }
  
  if (browserLang.startsWith('ru') || browserLang.startsWith('ru-')) {
    return 'ru';
  }
  
  if (browserLang.startsWith('en') || browserLang.startsWith('en-')) {
    return 'en';
  }
  
  return defaultLanguage;
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
} 