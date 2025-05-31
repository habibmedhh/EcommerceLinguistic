import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Language, type I18nContextType } from "@/lib/i18n";

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("preferred-language");
    return (stored as Language) || "ar";
  });

  useEffect(() => {
    localStorage.setItem("preferred-language", language);
    
    // Update document direction and lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // Update body class for RTL styling
    if (language === "ar") {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    direction: language === "ar" ? "rtl" : "ltr",
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
