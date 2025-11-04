import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { translations } from '../locales/translations'

export type Language = 'de' | 'fr' | 'en' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.de
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to 'de'
    const saved = localStorage.getItem('app_language') as Language
    return saved && ['de', 'fr', 'en', 'it'].includes(saved) ? saved : 'de'
  })

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('app_language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

