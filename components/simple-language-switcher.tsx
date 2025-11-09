'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check, Search } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { languages } from '@/lib/translations'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const { addNotification } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter languages based on search
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  return (
    <div ref={dropdownRef} className="relative">
      <Tooltip content="Change Language" position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-vscode-hover rounded transition-colors text-vscode-text-secondary hover:text-vscode-text"
          aria-label="Change Language"
        >
          <Globe size={16} />
          <span className="text-xs font-medium hidden md:inline">{currentLang.flag}</span>
          <ChevronDown size={12} className={`transition-transform hidden md:block ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
              onClick={() => {
                setIsOpen(false)
                setSearchQuery('')
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-1 min-w-[280px] max-w-[320px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-xl z-[101] overflow-hidden"
            >
              {/* Search Bar */}
              <div className="p-2 border-b border-vscode-border">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={14} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full pl-8 pr-3 py-1.5 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue"
                    autoFocus
                  />
                </div>
              </div>

              {/* Language List */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredLanguages.length > 0 ? (
                  <div className="py-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          const previousLang = language
                          setLanguage(lang.code)
                          setIsOpen(false)
                          setSearchQuery('')
                          
                          // Show notification when language changes
                          if (previousLang !== lang.code) {
                            addNotification({
                              title: 'Language Changed',
                              message: `Interface language updated to ${lang.nativeName}`,
                              type: 'info'
                            })
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-vscode-active transition-colors ${
                          language === lang.code
                            ? 'bg-vscode-active text-vscode-blue'
                            : 'text-vscode-text'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{lang.flag}</span>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-medium truncate">{lang.nativeName}</div>
                            {lang.name !== lang.nativeName && (
                              <div className="text-[10px] text-vscode-text-secondary truncate">{lang.name}</div>
                            )}
                          </div>
                        </div>
                        {language === lang.code && (
                          <Check size={14} className="text-vscode-blue flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-vscode-text-secondary">No languages found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
