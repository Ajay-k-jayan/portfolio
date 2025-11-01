import { themes, Theme, ThemeColors } from './themes'

export type { Theme, ThemeColors }

export class ThemeManager {
  private themes: Theme[] = themes
  private currentTheme: Theme
  private customThemes: Theme[] = []
  private scheduledThemeTimer: NodeJS.Timeout | null = null

  constructor() {
    // Initialize with default theme first (SSR safe)
    this.currentTheme = this.themes[0]
    
    // Load custom themes and apply saved theme only on client
    if (typeof window !== 'undefined') {
      this.loadCustomThemes()
      
      // Get saved theme or default to dark
      const savedThemeId = localStorage.getItem('selectedTheme') || 'dark'
      const savedTheme = this.getThemeById(savedThemeId)
      if (savedTheme) {
        this.currentTheme = savedTheme
        this.applyTheme(savedTheme)
      }
    }
  }

  getAllThemes(): Theme[] {
    return [...this.themes, ...this.customThemes]
  }

  getThemeById(id: string): Theme | undefined {
    return [...this.themes, ...this.customThemes].find(t => t.id === id)
  }

  getCurrentTheme(): Theme {
    return this.currentTheme
  }

  setTheme(themeId: string): void {
    const theme = this.getThemeById(themeId)
    if (theme) {
      this.currentTheme = theme
      this.applyTheme(theme)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTheme', themeId)
      }
    }
  }

  applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const colors = theme.colors

    // Apply CSS custom properties
    root.style.setProperty('--theme-bg', colors.bg)
    root.style.setProperty('--theme-sidebar', colors.sidebar)
    root.style.setProperty('--theme-active', colors.active)
    root.style.setProperty('--theme-hover', colors.hover)
    root.style.setProperty('--theme-border', colors.border)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--theme-blue', colors.blue)
    root.style.setProperty('--theme-blue-accent', colors.blueAccent)
    root.style.setProperty('--theme-green', colors.green)
    root.style.setProperty('--theme-orange', colors.orange)
    root.style.setProperty('--theme-purple', colors.purple)
    root.style.setProperty('--theme-red', colors.red)
    root.style.setProperty('--theme-yellow', colors.yellow)

    // Set theme attribute for CSS selectors
    root.setAttribute('data-theme', theme.id)
    root.setAttribute('data-theme-type', theme.type)
  }

  addCustomTheme(theme: Theme): void {
    // Ensure custom theme has unique ID
    const existingTheme = this.customThemes.find(t => t.id === theme.id)
    if (existingTheme) {
      Object.assign(existingTheme, theme)
    } else {
      this.customThemes.push(theme)
    }
    this.saveCustomThemes()
  }

  removeCustomTheme(themeId: string): void {
    this.customThemes = this.customThemes.filter(t => t.id !== themeId)
    this.saveCustomThemes()
  }

  exportTheme(themeId: string): string {
    const theme = this.getThemeById(themeId)
    if (!theme) throw new Error(`Theme ${themeId} not found`)
    return JSON.stringify(theme, null, 2)
  }

  importTheme(json: string): Theme {
    try {
      const theme = JSON.parse(json) as Theme
      if (!theme.id || !theme.name || !theme.colors) {
        throw new Error('Invalid theme format')
      }
      // Ensure it's marked as custom
      theme.id = `custom-${theme.id}`
      this.addCustomTheme(theme)
      return theme
    } catch (error) {
      throw new Error('Failed to parse theme JSON')
    }
  }

  scheduleThemeChange(themeId: string, time: Date): void {
    // Clear existing schedule
    if (this.scheduledThemeTimer) {
      clearTimeout(this.scheduledThemeTimer)
    }

    const now = Date.now()
    const scheduleTime = time.getTime()
    const delay = scheduleTime - now

    if (delay > 0) {
      this.scheduledThemeTimer = setTimeout(() => {
        this.setTheme(themeId)
      }, delay)
    }
  }

  scheduleDayNightTheme(darkThemeId: string, lightThemeId: string): void {
    const now = new Date()
    const hour = now.getHours()
    
    // Switch to dark at 6 PM (18:00), light at 6 AM (6:00)
    if (hour >= 18 || hour < 6) {
      this.setTheme(darkThemeId)
    } else {
      this.setTheme(lightThemeId)
    }

    // Schedule next change
    const nextChange = new Date()
    if (hour >= 18) {
      // Next change is at 6 AM
      nextChange.setHours(6, 0, 0, 0)
      nextChange.setDate(nextChange.getDate() + 1)
      this.scheduleThemeChange(lightThemeId, nextChange)
    } else if (hour >= 6) {
      // Next change is at 6 PM
      nextChange.setHours(18, 0, 0, 0)
      this.scheduleThemeChange(darkThemeId, nextChange)
    }
  }

  private saveCustomThemes(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customThemes', JSON.stringify(this.customThemes))
    }
  }

  private loadCustomThemes(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customThemes')
      if (saved) {
        try {
          this.customThemes = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load custom themes:', e)
        }
      }
    }
  }
}

// Singleton instance
export const themeManager = typeof window !== 'undefined' 
  ? new ThemeManager()
  : null

