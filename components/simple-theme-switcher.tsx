'use client'

import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, ChevronDown, Check, Palette, Sparkles, Droplet, Paintbrush, Brush, Circle, Square, Hexagon, Stars, Rocket } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'

export function SimpleThemeSwitcher() {
  const { currentTheme, themes, setTheme } = useEnhancedTheme()
  const { addNotification } = useAppStore()
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
      <Tooltip content="Change Theme" position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 h-7 rounded-sm hover:bg-vscode-hover transition-colors"
          aria-label="Change Theme"
        >
          <Icon size={13} className="text-vscode-text-secondary" />
          <span className="text-xs text-vscode-text inline">{currentTheme?.name || 'Theme'}</span>
          <ChevronDown 
            size={11} 
            className={`text-vscode-text-secondary transition-transform block ${isOpen ? 'rotate-180' : ''}`} 
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
              className="absolute top-full right-0 mt-1 min-w-[180px] bg-vscode-sidebar border border-vscode-border rounded shadow-xl z-50 overflow-hidden"
            >
              <div className="py-1">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      const previousTheme = currentTheme?.id
                      setTheme(theme.id)
                      setIsOpen(false)
                      
                      // Show notification when theme changes
                      if (previousTheme !== theme.id) {
                        addNotification({
                          title: 'Theme Changed',
                          message: `Theme updated to ${theme.name}`,
                          type: 'info'
                        })
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-vscode-active transition-colors ${
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
                          'light': 'text-yellow-500',
                          'blue': 'text-blue-500',
                          'monokai': 'text-green-500',
                          'dracula': 'text-purple-500',
                          'github-dark': 'text-gray-400',
                          'github-light': 'text-orange-500',
                          'high-contrast': 'text-white',
                          'nord': 'text-cyan-500',
                          'one-dark': 'text-vscode-blue',
                        }
                        return (
                          <ThemeIcon 
                            size={13} 
                            className={iconColors[theme.id] || 'text-vscode-text-secondary'} 
                          />
                        )
                      })()}
                      <span>{theme.name}</span>
                    </div>
                    {currentTheme?.id === theme.id && (
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

