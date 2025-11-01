'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from './ui/tooltip'

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { id: 'en' as const, name: 'English', flag: '🇬🇧' },
    { id: 'ml' as const, name: 'മലയാളം', flag: '🇮🇳' },
  ]

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLang = languages.find(lang => lang.id === language) || languages[0]

  return (
    <div ref={dropdownRef} className="relative">
      <Tooltip content="Change Language" position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 h-7 rounded-sm hover:bg-vscode-hover transition-colors"
        >
          <Globe size={13} className="text-vscode-text-secondary" />
          <span className="text-xs text-vscode-text">{currentLang.name}</span>
          <ChevronDown 
            size={11} 
            className={`text-vscode-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-1 min-w-[160px] bg-vscode-sidebar border border-vscode-border rounded shadow-xl z-50 overflow-hidden"
            >
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-vscode-active transition-colors ${
                      language === lang.id
                        ? 'bg-vscode-active text-vscode-blue'
                        : 'text-vscode-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {language === lang.id && (
                      <Check size={12} className="text-vscode-blue" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

