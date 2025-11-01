import { create } from 'zustand'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: string
}

interface AppState {
  tabs: Tab[]
  activeTabId: string | null
  sidebarCollapsed: boolean
  activeSidebarView: string
  activeMenuItem: string
  recentlySelected: string[]
  fileExploreExpanded: boolean
  openSidebarView: (view: string) => void
  closeSidebarView: () => void
  addTab: (tab: Tab) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  toggleSidebar: () => void
  setActiveMenuItem: (menuId: string) => void
  toggleFileExplore: () => void
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

export const useAppStore = create<AppState>((set) => ({
  tabs: [],
  activeTabId: null,
  sidebarCollapsed: false,
  activeSidebarView: 'explorer',
  activeMenuItem: 'welcome',
  recentlySelected: loadRecentlySelected(),
  fileExploreExpanded: false,
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
}))

