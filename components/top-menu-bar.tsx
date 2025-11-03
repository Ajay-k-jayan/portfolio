'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { File, Edit, View, Go, Run, Terminal, Help, Moon, Sun, Palette } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function TopMenuBar() {
  const { theme, setTheme } = useTheme()
  const { portfolioSettings } = useAppStore()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const fileMenuItems = [
    { label: 'New File', shortcut: 'Ctrl+N' },
    { label: 'Open File...', shortcut: 'Ctrl+O' },
    { label: 'Save', shortcut: 'Ctrl+S' },
    { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
    { type: 'separator' },
    ...(portfolioSettings.showResumeDownload ? [{ label: 'Download Resume', shortcut: 'Ctrl+D' }] : []),
    { label: 'Print...', shortcut: 'Ctrl+P' },
  ]

  const menus = [
    {
      name: 'File',
      items: fileMenuItems,
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', shortcut: 'Ctrl+Y' },
        { type: 'separator' },
        { label: 'Cut', shortcut: 'Ctrl+X' },
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' },
      ],
    },
    {
      name: 'View',
      items: [
        { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P' },
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { type: 'separator' },
        { label: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
        { label: 'Toggle Status Bar', shortcut: 'Ctrl+J' },
      ],
    },
    {
      name: 'Go',
      items: [
        { label: 'Back', shortcut: 'Alt+←' },
        { label: 'Forward', shortcut: 'Alt+→' },
        { label: 'Go to File...', shortcut: 'Ctrl+P' },
        { label: 'Go to Symbol...', shortcut: 'Ctrl+Shift+O' },
      ],
    },
    {
      name: 'Run',
      items: [
        { label: 'Start Debugging', shortcut: 'F5' },
        { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
        { label: 'Stop', shortcut: 'Shift+F5' },
      ],
    },
    {
      name: 'Terminal',
      items: [
        { label: 'New Terminal', shortcut: 'Ctrl+`' },
        { label: 'Split Terminal', shortcut: 'Ctrl+Shift+`' },
      ],
    },
    {
      name: 'Help',
      items: [
        { label: 'Welcome', shortcut: '' },
        { label: 'Documentation', shortcut: '' },
        { label: 'Keyboard Shortcuts', shortcut: '' },
      ],
    },
  ]

  return (
    <div className="h-8 bg-vscode-sidebar border-b border-vscode-border flex items-center px-2 text-xs relative z-50">
      {menus.map((menu) => (
        <div key={menu.name} className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === menu.name ? null : menu.name)}
            className="px-3 h-8 hover:bg-vscode-hover text-vscode-text"
            onMouseLeave={() => setActiveMenu(null)}
          >
            {menu.name}
          </button>
          {activeMenu === menu.name && (
            <div className="absolute top-8 left-0 bg-vscode-sidebar border border-vscode-border shadow-lg min-w-[200px] py-1">
              {menu.items.map((item, idx) => (
                item.type === 'separator' ? (
                  <div key={idx} className="h-px bg-vscode-border my-1" />
                ) : (
                  <button
                    key={idx}
                    className="w-full text-left px-4 py-1.5 hover:bg-vscode-active text-vscode-text text-xs flex justify-between items-center"
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="text-vscode-text-secondary ml-8">{item.shortcut}</span>
                    )}
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button
          onClick={() => setTheme('custom')}
          className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
          title="Custom Theme"
        >
          <Palette size={14} />
        </button>
      </div>
    </div>
  )
}

