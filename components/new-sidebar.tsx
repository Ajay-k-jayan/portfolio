'use client'

import { useEffect, useState } from 'react'
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
import { Tooltip } from './ui/tooltip'

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
  const [mounted, setMounted] = useState(false)

  // Handle SSR - only show recently selected after mount
  useEffect(() => {
    setMounted(true)
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
        {mounted && recentlySelected.length > 0 && (
          <div className="py-1.5 border-b border-vscode-border flex-shrink-0">
            <div className="mb-1 flex justify-center items-center">
              <History size={10} className="text-vscode-text-secondary" />
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              {recentlySelected.slice(0, 3).map((menuId) => {
                const item = menuItems.find(m => m.id === menuId)
                if (!item) return null
                
                const Icon = item.icon
                const isActive = activeMenuItem === menuId
                
                return (
                  <Tooltip key={menuId} content={item.label} position="right">
                    <motion.button
                      onClick={() => handleMenuItemClick(menuId)}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors relative ${
                        isActive
                          ? 'bg-vscode-blue text-white'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                      }`}
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
                    </motion.button>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Menu Icons - Compact Grid */}
        <div className="flex-1 pt-0 flex flex-col items-center gap-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <Tooltip key={item.id} content={item.label} position="right">
                <motion.button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors relative ${
                    isActive
                      ? 'bg-vscode-blue text-white'
                      : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                  }`}
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
                </motion.button>
              </Tooltip>
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
        {mounted && recentlySelected.length > 0 && (
          <div className="pt-1 pb-0.5 border-b border-vscode-border flex-shrink-0">
            <div className="mb-0.5 flex justify-center items-center">
              <History size={10} className="text-vscode-text-secondary" />
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              {recentlySelected.slice(0, 3).map((menuId) => {
                const item = menuItems.find(m => m.id === menuId)
                if (!item) return null
                
                const Icon = item.icon
                const isActive = activeMenuItem === menuId
                
                return (
                  <Tooltip key={menuId} content={item.label} position="right">
                    <motion.button
                      onClick={() => handleMenuItemClick(menuId)}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors relative ${
                        isActive
                          ? 'bg-vscode-blue text-white'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                      }`}
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
                    </motion.button>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Menu Icons - Compact, No Scroll */}
        <div className="flex-1 flex flex-col items-center justify-start pt-0 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <Tooltip key={item.id} content={item.label} position="right">
                <motion.button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors relative ${
                    isActive
                      ? 'bg-vscode-blue text-white'
                      : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                  }`}
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
                </motion.button>
              </Tooltip>
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
