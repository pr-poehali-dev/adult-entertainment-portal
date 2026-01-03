import { createContext, useContext, ReactNode } from 'react';
import { Language, translations, Translations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

let currentLanguage: Language = 'ru';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
  };

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t: translations[currentLanguage] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};