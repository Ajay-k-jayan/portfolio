'use client'

import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, ChevronDown, Check, Palette, Sparkles, Droplet, Paintbrush, Brush, Circle, Square, Hexagon, Stars, Rocket } from 'lucide-react'
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

  // Get icon based on theme name/type
  const getIconForTheme = (themeId: string, themeType: string) => {
    const iconMap: Record<string, typeof Moon> = {
      'dark': Moon,
      'light': Sun,
      'blue': Droplet,
      'monokai': Paintbrush,
      'dracula': Sparkles,
      'github-dark': Circle,
      'github-light': Sun,
      'high-contrast': Square,
      'nord': Hexagon,
      'one-dark': Stars,
    }
    return iconMap[themeId] || (themeType === 'light' ? Sun : Palette)
  }

  const getIcon = () => {
    if (!currentTheme) return Palette
    return getIconForTheme(currentTheme.id, currentTheme.type)
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
                      {(() => {
                        const ThemeIcon = getIconForTheme(theme.id, theme.type)
                        const iconColors: Record<string, string> = {
                          'dark': 'text-vscode-blue',
                          'light': 'text-yellow-400',
                          'blue': 'text-blue-400',
                          'monokai': 'text-green-400',
                          'dracula': 'text-purple-400',
                          'github-dark': 'text-gray-400',
                          'github-light': 'text-orange-400',
                          'high-contrast': 'text-white',
                          'nord': 'text-cyan-400',
                          'one-dark': 'text-vscode-blue',
                        }
                        return (
                          <ThemeIcon 
                            size={14} 
                            className={iconColors[theme.id] || 'text-vscode-text-secondary'} 
                          />
                        )
                      })()}
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

