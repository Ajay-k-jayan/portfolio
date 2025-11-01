'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Theme, ThemeManager } from '@/lib/theme-manager'

interface EnhancedThemeContextType {
  currentTheme: Theme
  themes: Theme[]
  setTheme: (themeId: string) => void
  themeManager: ThemeManager | null
  transitionDuration: number
  setTransitionDuration: (duration: number) => void
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined)

export function EnhancedThemeProvider({ children }: { children: ReactNode }) {
  const [themeManager] = useState<ThemeManager | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const { ThemeManager } = require('@/lib/theme-manager')
      return new ThemeManager()
    } catch (error) {
      console.error('Failed to initialize ThemeManager:', error)
      return null
    }
  })
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themeManager?.getCurrentTheme() || {
      id: 'dark',
      name: 'Dark',
      type: 'dark',
      colors: {
        bg: '#1e1e1e',
        sidebar: '#252526',
        active: '#2d2d30',
        hover: '#2a2d2e',
        border: '#3e3e42',
        text: '#cccccc',
        textSecondary: '#858585',
        blue: '#007acc',
        blueAccent: '#569cd6',
        green: '#4ec9b0',
        orange: '#ce9178',
        purple: '#c586c0',
        red: '#f48771',
        yellow: '#dcdcaa',
      },
      description: 'Default theme',
    }
  )
  const [transitionDuration, setTransitionDuration] = useState(300)

  useEffect(() => {
    if (!themeManager) return

    // Initialize theme
    const savedThemeId = localStorage.getItem('selectedTheme') || 'dark'
    const theme = themeManager.getThemeById(savedThemeId)
    if (theme) {
      setCurrentTheme(theme)
      themeManager.applyTheme(theme)
    }

    // Update CSS transition duration
    document.documentElement.style.setProperty(
      '--theme-transition-duration',
      `${transitionDuration}ms`
    )
  }, [themeManager, transitionDuration])

  const setTheme = useCallback(
    (themeId: string) => {
      if (!themeManager) return

      const theme = themeManager.getThemeById(themeId)
      if (theme) {
        // Apply theme with transition
        themeManager.applyTheme(theme)
        setCurrentTheme(theme)
      }
    },
    [themeManager]
  )

  const themes = themeManager?.getAllThemes() || []

  return (
    <EnhancedThemeContext.Provider
      value={{
        currentTheme,
        themes,
        setTheme,
        themeManager,
        transitionDuration,
        setTransitionDuration,
      }}
    >
      {children}
    </EnhancedThemeContext.Provider>
  )
}

export function useEnhancedTheme() {
  const context = useContext(EnhancedThemeContext)
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider')
  }
  return context
}

