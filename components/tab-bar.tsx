'use client'

import { X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useAppStore()

  if (tabs.length === 0) return null

  return (
    <div className="h-9 bg-vscode-sidebar border-b border-vscode-border flex items-end overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-2 px-4 h-8 border-r border-vscode-border cursor-pointer transition-colors ${
              isActive
                ? 'bg-vscode-bg text-vscode-text border-t-2 border-t-vscode-blue'
                : 'bg-vscode-sidebar text-vscode-text-secondary hover:bg-vscode-hover'
            }`}
          >
            {tab.icon && <span className="text-xs">{tab.icon}</span>}
            <span className="text-sm whitespace-nowrap">{tab.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-vscode-active rounded p-0.5 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

