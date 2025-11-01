'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Files, 
  Play, 
  GitBranch, 
  Terminal, 
  BookOpen, 
  Mail,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { FileExplorer } from './file-explorer'
import { ProjectsView } from './sidebar-views/projects-view'
import { AchievementsView } from './sidebar-views/achievements-view'
import { BlogSystem } from './blog-system'
import { SocialIntegrations } from './social-integrations'
import { TerminalView } from './sidebar-views/terminal-view'
import { SettingsView } from './sidebar-views/settings-view'

const sidebarItems = [
  { id: 'explorer', icon: Files, label: 'Explorer', component: FileExplorer },
  { id: 'run-debug', icon: Play, label: 'Run & Debug', component: ProjectsView },
  { id: 'source-control', icon: GitBranch, label: 'Source Control', component: SocialIntegrations },
  { id: 'terminal', icon: Terminal, label: 'Terminal', component: TerminalView },
  { id: 'blog', icon: BookOpen, label: 'Blog', component: BlogSystem },
  { id: 'achievements', icon: Trophy, label: 'Achievements', component: AchievementsView },
  { id: 'contact', icon: Mail, label: 'Contact', component: SocialIntegrations },
  { id: 'settings', icon: Settings, label: 'Settings', component: SettingsView },
]

export function Sidebar() {
  const { activeSidebarView, sidebarCollapsed, openSidebarView, toggleSidebar } = useAppStore()
  const activeItem = sidebarItems.find(item => item.id === activeSidebarView)
  const ActiveComponent = activeItem?.component

  return (
    <div className="flex h-full">
      {/* Icon Bar */}
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col items-center py-2">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeSidebarView === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openSidebarView(item.id)}
              className={`w-10 h-10 flex items-center justify-center mb-1 rounded transition-colors relative ${
                isActive
                  ? 'bg-vscode-active text-white'
                  : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
              }`}
              title={item.label}
            >
              <Icon size={20} />
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-vscode-blue rounded-r"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
        <div className="flex-1" />
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text rounded"
          title="Toggle Sidebar"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      {!sidebarCollapsed && (
        <div className="w-64 bg-vscode-sidebar border-r border-vscode-border flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-vscode-border">
            <h2 className="text-sm font-semibold text-vscode-text uppercase tracking-wide">
              {activeItem?.label || 'Explorer'}
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            {ActiveComponent ? <ActiveComponent /> : (
              <div className="p-4 text-vscode-text-secondary text-sm">
                {activeItem?.label} view coming soon...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
