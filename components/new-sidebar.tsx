'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  Folder,
  Code,
  FolderOpen,
  Trophy,
  Briefcase,
  Award,
  BookOpen,
  Share2,
  MessageSquare,
  History
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { WelcomeTab } from './tabs/welcome-tab'
import { SkillsTab } from './tabs/skills-tab'
import { ProjectsTab } from './tabs/projects-tab'
import { AchievementsView } from './sidebar-views/achievements-view'
import { ExperienceTab } from './tabs/experience-tab'
import { BlogSystem } from './blog-system'
import { SocialIntegrations } from './social-integrations'
import { FileExplorer } from './file-explorer'

// Menu items configuration
const menuItems = [
  { id: 'welcome', label: 'Welcome', icon: Home },
  { id: 'file-explore', label: 'File Explore', icon: Folder },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'project', label: 'Project', icon: FolderOpen },
  { id: 'achievement', label: 'Achievement', icon: Trophy },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'blogs', label: 'Blogs', icon: BookOpen },
  { id: 'social-medias', label: 'Social Medias', icon: Share2 },
  { id: 'recommendation', label: 'Recommendation', icon: MessageSquare },
]

export function NewSidebar() {
  const { 
    activeMenuItem, 
    recentlySelected, 
    setActiveMenuItem, 
    sidebarCollapsed,
    toggleSidebar
  } = useAppStore()

  // Load recently selected from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentlySelected')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Will be handled by store initialization
          }
        } catch (e) {
          console.error('Failed to load recently selected:', e)
        }
      }
    }
  }, [])

  const handleMenuItemClick = (menuId: string) => {
    setActiveMenuItem(menuId)
    // Don't create tabs - content will be shown directly in main area
  }


  // Collapsed view - compact icon-only sidebar
  if (sidebarCollapsed) {
    return (
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col h-full">
        {/* Recently Selected (Top) - Compact Icons */}
        {recentlySelected.length > 0 && (
          <div className="py-1.5 border-b border-vscode-border">
            <div className="px-2 mb-1 flex justify-center">
              <History size={10} className="text-vscode-text-secondary" />
            </div>
            {recentlySelected.slice(0, 3).map((menuId) => {
              const item = menuItems.find(m => m.id === menuId)
              if (!item) return null
              
              const Icon = item.icon
              const isActive = activeMenuItem === menuId
              
              return (
                <motion.button
                  key={menuId}
                  onClick={() => handleMenuItemClick(menuId)}
                  className={`w-8 h-8 mx-auto mb-0.5 flex items-center justify-center rounded transition-colors relative group ${
                    isActive
                      ? 'bg-vscode-blue text-white'
                      : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                  }`}
                  title={item.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={14} />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicatorCollapsed"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-blue rounded-r"
                    />
                  )}
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-lg">
                    {item.label}
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Main Menu Icons - Compact Grid */}
        <div className="flex-1 py-1.5 grid grid-cols-1 gap-0.5 px-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded transition-colors relative group ${
                  isActive
                    ? 'bg-vscode-blue text-white'
                    : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                }`}
                title={item.label}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorCollapsed"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-blue rounded-r"
                  />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-lg">
                  {item.label}
                </div>
              </motion.button>
            )
          })}
        </div>

      </div>
    )
  }

  // Expanded view - Only show sidebar panel for File Explore
  return (
    <div className="flex h-full">
      {/* Left Icon Bar - Fixed Height, No Scroll */}
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col h-full">
        {/* Recently Selected (Top) - Compact */}
        {recentlySelected.length > 0 && (
          <div className="py-1.5 border-b border-vscode-border flex-shrink-0">
            <div className="px-2 mb-1 flex justify-center">
              <History size={10} className="text-vscode-text-secondary" />
            </div>
            <div className="space-y-0.5">
              {recentlySelected.slice(0, 3).map((menuId) => {
                const item = menuItems.find(m => m.id === menuId)
                if (!item) return null
                
                const Icon = item.icon
                const isActive = activeMenuItem === menuId
                
                return (
                  <motion.button
                    key={menuId}
                    onClick={() => handleMenuItemClick(menuId)}
                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded transition-colors relative group ${
                      isActive
                        ? 'bg-vscode-blue text-white'
                        : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                    }`}
                    title={item.label}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={14} />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorExpanded"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-blue rounded-r"
                      />
                    )}
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-lg">
                      {item.label}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Menu Icons - Compact, No Scroll */}
        <div className="flex-1 flex flex-col justify-center py-1 space-y-0.5 px-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded transition-colors relative group ${
                  isActive
                    ? 'bg-vscode-blue text-white'
                    : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                }`}
                title={item.label}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorExpanded"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-blue rounded-r"
                  />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-lg">
                  {item.label}
                </div>
              </motion.button>
            )
          })}
        </div>

      </div>

      {/* Right Sidebar Panel - ONLY shows for File Explore */}
      <AnimatePresence>
        {activeMenuItem === 'file-explore' && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-vscode-sidebar border-r border-vscode-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-vscode-border flex-shrink-0">
              <h2 className="text-sm font-semibold text-vscode-text uppercase tracking-wide">
                File Explorer
              </h2>
            </div>

            {/* Content - Only this area scrolls */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <FileExplorer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
