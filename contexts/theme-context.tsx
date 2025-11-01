'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system' | 'custom'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    setMounted(true)
    
    // Get saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme && ['dark', 'light', 'system', 'custom'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Detect system preference on first load
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setSystemTheme(prefersDark ? 'dark' : 'light')
        if (!savedTheme) {
          setTheme('system')
        }
      }
    }

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      
      // Determine actual theme to apply
      let actualTheme = theme
      if (theme === 'system') {
        actualTheme = systemTheme
      }
      
      document.documentElement.setAttribute('data-theme', actualTheme)
      
      // Update body class for theme transitions
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      document.body.classList.add(`theme-${actualTheme}`)
    }
  }, [theme, mounted, systemTheme])

  // Always provide the context value, even during initial mount
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

