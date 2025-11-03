import { create } from 'zustand'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: string
}

export interface PortfolioSettings {
  showWelcomeOnStartup: boolean
  compactView: boolean
  showAnimations: boolean
  animationSpeed: 'fast' | 'normal' | 'slow'
  sidebarWidth: number
  panelWidth: number
  gridLayout: 'grid' | 'list'
  showStats: boolean
  showSocialLinks: boolean
  showGitHubStats: boolean
  showRecentItems: boolean
  emailNotifications: boolean
  formSuccessAlerts: boolean
  updateNotifications: boolean
  enableQuickNav: boolean
  showRecentlyViewed: boolean
  theme: string
  fontSize: 'small' | 'medium' | 'large'
  fontFamily: 'system' | 'mono' | 'sans'
}

const defaultSettings: PortfolioSettings = {
  showWelcomeOnStartup: true,
  compactView: false,
  showAnimations: true,
  animationSpeed: 'normal',
  sidebarWidth: 256,
  panelWidth: 400,
  gridLayout: 'grid',
  showStats: true,
  showSocialLinks: true,
  showGitHubStats: true,
  showRecentItems: true,
  emailNotifications: false,
  formSuccessAlerts: true,
  updateNotifications: true,
  enableQuickNav: true,
  showRecentlyViewed: true,
  theme: 'dark',
  fontSize: 'medium',
  fontFamily: 'system',
}

// Load settings from localStorage
const loadSettings = (): PortfolioSettings => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('portfolioSettings')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...defaultSettings, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }
  return defaultSettings
}

interface AppState {
  tabs: Tab[]
  activeTabId: string | null
  sidebarCollapsed: boolean
  activeSidebarView: string
  activeMenuItem: string
  recentlySelected: string[]
  fileExploreExpanded: boolean
  portfolioSettings: PortfolioSettings
  openSidebarView: (view: string) => void
  closeSidebarView: () => void
  addTab: (tab: Tab) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  toggleSidebar: () => void
  setActiveMenuItem: (menuId: string) => void
  toggleFileExplore: () => void
  updateSettings: (settings: Partial<PortfolioSettings>) => void
  resetSettings: () => void
}

// Load recently selected from localStorage
const loadRecentlySelected = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('recentlySelected')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 3) // Ensure max 3
        }
      }
    } catch (e) {
      console.error('Failed to load recently selected:', e)
    }
  }
  return []
}

export const useAppStore = create<AppState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  sidebarCollapsed: false,
  activeSidebarView: 'explorer',
  activeMenuItem: 'welcome',
  recentlySelected: loadRecentlySelected(),
  fileExploreExpanded: false,
  portfolioSettings: loadSettings(),
  openSidebarView: (view) => set({ activeSidebarView: view, sidebarCollapsed: false }),
  closeSidebarView: () => set({ activeSidebarView: '' }),
  addTab: (tab) => set((state) => {
    const exists = state.tabs.find(t => t.id === tab.id)
    if (exists) {
      return { activeTabId: tab.id }
    }
    return {
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    }
  }),
  closeTab: (tabId) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== tabId)
    const newActiveId = newTabs.length > 0
      ? newTabs[newTabs.length - 1].id
      : null
    return {
      tabs: newTabs,
      activeTabId: newActiveId,
    }
  }),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveMenuItem: (menuId) => set((state) => {
    // Add to recently selected (excluding 'file-explore' expansion, max 3 items)
    let newRecent = [...state.recentlySelected]
    if (menuId !== 'file-explore') {
      // Remove if already exists
      newRecent = newRecent.filter(id => id !== menuId)
      // Add to beginning
      newRecent.unshift(menuId)
      // Keep only last 3
      newRecent = newRecent.slice(0, 3)
    }
    
    // Load from localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlySelected', JSON.stringify(newRecent))
    }
    
    return {
      activeMenuItem: menuId,
      recentlySelected: newRecent,
    }
  }),
  toggleFileExplore: () => set((state) => ({ fileExploreExpanded: !state.fileExploreExpanded })),
  updateSettings: (newSettings) => {
    const currentSettings = get().portfolioSettings
    const updatedSettings = { ...currentSettings, ...newSettings }
    set({ portfolioSettings: updatedSettings })
    
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioSettings', JSON.stringify(updatedSettings))
    }
    
    // Apply theme immediately if changed
    if (newSettings.theme && newSettings.theme !== currentSettings.theme) {
      // Dispatch custom event for theme change
      window.dispatchEvent(new CustomEvent('themeChange', { detail: newSettings.theme }))
    }
  },
  resetSettings: () => {
    set({ portfolioSettings: defaultSettings })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolioSettings')
      // Dispatch reset event
      window.dispatchEvent(new CustomEvent('settingsReset'))
    }
  },
}))

