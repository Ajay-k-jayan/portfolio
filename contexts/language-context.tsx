'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LanguageCode, languages, translations, getTranslation, type Translations } from '@/lib/translations'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: keyof Translations) => string
  currentLanguage: typeof languages[0] | undefined
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en-US')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode | null
    if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language || 'en-US'
      const detectedLang = languages.find(l => l.code === browserLang) || languages.find(l => l.code.startsWith(browserLang.split('-')[0]))
      if (detectedLang) {
        setLanguage(detectedLang.code)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
      // Update document language attribute
      document.documentElement.lang = language.split('-')[0]
    }
  }, [language])

  const t = (key: keyof Translations): string => {
    return getTranslation(language, key)
  }

  const currentLanguage = languages.find(l => l.code === language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
