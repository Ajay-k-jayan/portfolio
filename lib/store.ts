import { create } from 'zustand'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read?: boolean
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
  showDateTimeWidget: boolean
  showWeatherWidget: boolean
  showLocationWidget: boolean
  showNetworkStatusWidget: boolean
  showSystemInfoWidget: boolean
  showSocialLinksWidget: boolean
  showResumeDownload: boolean
  showThemeSwitcher: boolean
  showLanguageSwitcher: boolean
}

export const defaultSettings: PortfolioSettings = {
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
  showDateTimeWidget: true,
  showWeatherWidget: true,
  showLocationWidget: true,
  showNetworkStatusWidget: true,
  showSystemInfoWidget: true,
  showSocialLinksWidget: true,
  showResumeDownload: true,
  showThemeSwitcher: true,
  showLanguageSwitcher: true,
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
  notifications: Notification[]
  isInitialized: boolean
  mobileMenuOpen: boolean
  voiceAssistantActive: boolean
  setVoiceAssistantActive: (active: boolean) => void
  openSidebarView: (view: string) => void
  closeSidebarView: () => void
  addTab: (tab: Tab) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  toggleSidebar: () => void
  setActiveMenuItem: (menuId: string) => void
  toggleFileExplore: () => void
  setMobileMenuOpen: (open: boolean) => void
  updateSettings: (settings: Partial<PortfolioSettings>, silent?: boolean) => void
  resetSettings: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  clearAllNotifications: () => void
  initializeApp: () => void
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

// Load notifications from localStorage and mark old ones as read
const loadNotifications = (): Notification[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('notifications')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Mark all old notifications as read (from previous sessions)
          const now = new Date()
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
          
          return parsed.map(n => {
            const notificationDate = new Date(n.timestamp)
            // Mark as read if older than 1 hour or if already read
            const shouldBeRead = notificationDate < oneHourAgo || n.read
            return {
              ...n,
              timestamp: notificationDate,
              read: shouldBeRead
            }
          })
        }
      }
    } catch (e) {
      console.error('Failed to load notifications:', e)
    }
  }
  return []
}

// Save notifications to localStorage
const saveNotifications = (notifications: Notification[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (e) {
      console.error('Failed to save notifications:', e)
    }
  }
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
  notifications: loadNotifications(),
  isInitialized: false,
  mobileMenuOpen: false,
  voiceAssistantActive: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setVoiceAssistantActive: (active) => set({ voiceAssistantActive: active }),
  initializeApp: () => {
    // Mark this as initialized and mark all old notifications as read
    const notifications = get().notifications
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    saveNotifications(updatedNotifications)
    set({ 
      isInitialized: true,
      notifications: updatedNotifications
    })
  },
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
  updateSettings: (newSettings, silent = false) => {
    const currentSettings = get().portfolioSettings
    
    // Check if any values actually changed
    const hasChanges = Object.keys(newSettings).some(key => {
      const typedKey = key as keyof PortfolioSettings
      return currentSettings[typedKey] !== newSettings[typedKey]
    })
    
    // If no changes, don't update or notify
    if (!hasChanges) return
    
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

    // Only add notification if not silent (silent = true for initial loads)
    if (silent) return

    // Add notification for settings update
    const settingLabels: Record<string, string> = {
      compactView: 'Compact View',
      showAnimations: 'Show Animations',
      animationSpeed: 'Animation Speed',
      showStats: 'Show Statistics',
      showSocialLinks: 'Show Social Links',
      showGitHubStats: 'Show GitHub Stats',
      showRecentItems: 'Show Recent Items',
      updateNotifications: 'Update Notifications',
      enableQuickNav: 'Enable Quick Navigation',
      showRecentlyViewed: 'Show Recently Viewed',
      theme: 'Theme',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
      showDateTimeWidget: 'Date & Time Widget',
      showWeatherWidget: 'Weather Widget',
      showLocationWidget: 'Location Widget',
      showNetworkStatusWidget: 'Network Status Widget',
      showSystemInfoWidget: 'System Info Widget',
      showSocialLinksWidget: 'Social Links Widget',
      showResumeDownload: 'Resume Download',
      showThemeSwitcher: 'Theme Switcher',
      showLanguageSwitcher: 'Language Switcher',
    }

    const changedKeys = Object.keys(newSettings).filter(key => {
      const typedKey = key as keyof PortfolioSettings
      return currentSettings[typedKey] !== newSettings[typedKey]
    })
    
    if (changedKeys.length > 0) {
      const firstKey = changedKeys[0] as keyof PortfolioSettings
      const settingLabel = settingLabels[firstKey] || firstKey
      const value = newSettings[firstKey]

      if (firstKey === 'theme') {
        const themeNames: Record<string, string> = {
          dark: 'Dark',
          light: 'Light',
          'dark-plus': 'Dark+',
          'light-plus': 'Light+',
          'monokai': 'Monokai',
          'github-dark': 'GitHub Dark',
          'github-light': 'GitHub Light',
          'solarized-dark': 'Solarized Dark',
          'solarized-light': 'Solarized Light',
          'one-dark-pro': 'One Dark Pro',
        }
        const themeName = themeNames[value as string] || (value as string)
        get().addNotification({
          title: 'Setting Changed',
          message: `Theme updated to ${themeName}`,
          type: 'info'
        })
      } else {
        get().addNotification({
          title: 'Setting Changed',
          message: `${settingLabel} updated`,
          type: 'info'
        })
      }
    }
  },
  resetSettings: () => {
    set({ portfolioSettings: defaultSettings })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolioSettings')
      // Dispatch reset event
      window.dispatchEvent(new CustomEvent('settingsReset'))
    }
    // Add notification for reset
    get().addNotification({
      title: 'Settings Reset',
      message: 'All settings have been restored to default values',
      type: 'success'
    })
  },
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }

    set((state) => {
      const updated = [newNotification, ...state.notifications].slice(0, 50) // Keep max 50
      saveNotifications(updated)
      return { notifications: updated }
    })
  },
  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter(n => n.id !== id)
      saveNotifications(updated)
      return { notifications: updated }
    })
  },
  markNotificationAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
      saveNotifications(updated)
      return { notifications: updated }
    })
  },
  markAllNotificationsAsRead: () => {
    set((state) => {
      const updated = state.notifications.map(n => ({ ...n, read: true }))
      saveNotifications(updated)
      return { notifications: updated }
    })
  },
  clearAllNotifications: () => {
    saveNotifications([])
    set({ notifications: [] })
  },
}))

