'use client'

import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, ChevronDown, Check } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { motion, AnimatePresence } from 'framer-motion'

export function SimpleThemeSwitcher() {
  const { currentTheme, themes, setTheme } = useEnhancedTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Get icon based on current theme type
  const getIcon = () => {
    if (!currentTheme) return Moon
    return currentTheme.type === 'light' ? Sun : Moon
  }

  const Icon = getIcon()

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vscode-active hover:bg-vscode-hover border border-vscode-border transition-colors"
      >
        <Icon size={16} className="text-vscode-text-secondary" />
        <span className="text-sm text-vscode-text">{currentTheme?.name || 'Theme'}</span>
        <ChevronDown 
          size={14} 
          className={`text-vscode-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

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
              className="absolute top-full left-0 mt-2 min-w-[200px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="py-1">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-vscode-active transition-colors ${
                      currentTheme?.id === theme.id
                        ? 'bg-vscode-active text-vscode-blue'
                        : 'text-vscode-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {theme.type === 'light' ? (
                        <Sun size={14} className="text-vscode-text-secondary" />
                      ) : (
                        <Moon size={14} className="text-vscode-text-secondary" />
                      )}
                      <span>{theme.name}</span>
                    </div>
                    {currentTheme?.id === theme.id && (
                      <Check size={14} className="text-vscode-blue" />
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

