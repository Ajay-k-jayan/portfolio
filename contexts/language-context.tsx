'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ml'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    searchPlaceholder: 'Search projects, skills, blog…',
    changeLanguage: 'Change Language',
    theme: 'Theme',
    welcome: 'Welcome',
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Experience',
    contact: 'Contact',
  },
  ml: {
    searchPlaceholder: 'പ്രോജക്റ്റുകൾ, വൈദഗ്ദ്ധ്യം, ബ്ലോഗ് തിരയുക…',
    changeLanguage: 'ഭാഷ മാറ്റുക',
    theme: 'തീം',
    welcome: 'സ്വാഗതം',
    about: 'അബൗട്ട്',
    projects: 'പ്രോജക്റ്റുകൾ',
    skills: 'വൈദഗ്ദ്ധ്യങ്ങൾ',
    experience: 'അനുഭവം',
    contact: 'ബന്ധപ്പെടുക',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ml')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

