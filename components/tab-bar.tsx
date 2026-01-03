'use client'

import { X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useEffect, useRef } from 'react'

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useAppStore()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Keyboard navigation for tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + 1-9 to switch tabs
        const num = parseInt(e.key)
        if (num >= 1 && num <= 9 && tabs[num - 1]) {
          e.preventDefault()
          setActiveTab(tabs[num - 1].id)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [tabs, setActiveTab])

  if (tabs.length === 0) return null

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveTab(tabId)
    } else if (e.key === 'Delete' || (e.key === 'Backspace' && e.ctrlKey)) {
      e.preventDefault()
      closeTab(tabId)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const currentIndex = tabs.findIndex(t => t.id === tabId)
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1].id)
        tabRefs.current[tabs[currentIndex - 1].id]?.focus()
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const currentIndex = tabs.findIndex(t => t.id === tabId)
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id)
        tabRefs.current[tabs[currentIndex + 1].id]?.focus()
      }
    }
  }

  return (
    <div 
      className="h-9 bg-vscode-sidebar border-b border-vscode-border flex items-end overflow-x-auto custom-scrollbar"
      role="tablist"
      aria-label="Open tabs"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`group flex items-center gap-2 px-4 h-8 border-r border-vscode-border cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-vscode-bg text-vscode-text border-t-2 border-t-vscode-blue'
                : 'bg-vscode-sidebar text-vscode-text-secondary hover:bg-vscode-hover'
            }`}
          >
            {tab.icon && <span className="text-xs" aria-hidden="true">{tab.icon}</span>}
            <span className="text-sm whitespace-nowrap">{tab.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  closeTab(tab.id)
                }
              }}
              aria-label={`Close ${tab.label} tab`}
              className="opacity-0 group-hover:opacity-100 hover:bg-vscode-active rounded p-0.5 transition-opacity focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-vscode-blue"
              tabIndex={-1}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </button>
        )
      })}
    </div>
  )
}

