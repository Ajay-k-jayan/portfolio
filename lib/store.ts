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
  openSidebarView: (view: string) => void
  closeSidebarView: () => void
  addTab: (tab: Tab) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  tabs: [],
  activeTabId: null,
  sidebarCollapsed: false,
  activeSidebarView: 'explorer',
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
}))

