'use client'

import { useState, useEffect, useMemo } from 'react'
import { NewSidebar } from './new-sidebar'
import { PortfolioHeader } from './portfolio-header'
import { TabBar } from './tab-bar'
import { StatusBar } from './status-bar'
import { ParticleBackground } from './particle-background'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotionConfig, advancedPageTransition } from '@/lib/motionConfig'
import { WelcomeTab } from './tabs/welcome-tab'
import { SkillsTab } from './tabs/skills-tab'
import { ProjectsTab } from './tabs/projects-tab'
import { AchievementsView } from './sidebar-views/achievements-view'
import { CertificationsView } from './sidebar-views/certifications-view'
import { PortfolioTimeline } from './sidebar-views/portfolio-timeline'
import { ExperienceTab } from './tabs/experience-tab'
import { BlogSystem } from './blog-system'
import { RecommendationsTab } from './tabs/recommendations-tab'
import { SettingsView } from './sidebar-views/settings-view'
import { NotificationToast } from './notification-toast'
import { ContactTab } from './tabs/contact-tab'

export function VSCodeLayout({ children }: { children: React.ReactNode }) {
  const { tabs, activeTabId, sidebarCollapsed, activeMenuItem, portfolioSettings } = useAppStore()
  const { variants } = useMotionConfig(portfolioSettings.animationSpeed)

  // Apply font size and family settings dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Apply font size
      const fontSizeMap = {
        small: '0.875rem',
        medium: '1rem',
        large: '1.125rem'
      }
      root.style.fontSize = fontSizeMap[portfolioSettings.fontSize]
      
      // Apply font family
      const fontFamilyMap = {
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"Consolas", "Monaco", "Courier New", monospace',
        sans: '"Inter", "Segoe UI", Roboto, sans-serif'
      }
      root.style.fontFamily = fontFamilyMap[portfolioSettings.fontFamily]
      
      // Apply animation speed
      const animationSpeedMap = {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      }
      root.style.setProperty('--animation-speed', animationSpeedMap[portfolioSettings.animationSpeed])
    }
  }, [portfolioSettings.fontSize, portfolioSettings.fontFamily, portfolioSettings.animationSpeed])

  // Get content based on active menu item (from sidebar) - memoized
  const contentMap = useMemo(() => ({
    'welcome': <WelcomeTab />,
    'timeline': <PortfolioTimeline />,
    'skills': <SkillsTab />,
    'project': <ProjectsTab />,
    'achievement': <AchievementsView />,
    'experience': <ExperienceTab />,
    'certifications': <CertificationsView />,
    'blogs': <BlogSystem />,
    'contact': <ContactTab />,
    'recommendation': <RecommendationsTab />,
    'settings': <SettingsView />,
  }), [])

  // Use tabs only if activeMenuItem is 'file-explore', otherwise use sidebar menu item content
  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId), [tabs, activeTabId])
  const activeContent = useMemo(() => {
    if (activeMenuItem === 'file-explore' && activeTab?.content) {
      return activeTab.content
    }
    return contentMap[activeMenuItem] || <WelcomeTab />
  }, [activeMenuItem, activeTab, contentMap])

  return (
    <div className="h-screen w-screen flex flex-col bg-vscode-bg text-vscode-text overflow-hidden relative">
      <ParticleBackground />
      <PortfolioHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - visible on desktop, mobile menu drawer on mobile */}
        <div className="hidden md:block">
          <NewSidebar />
        </div>
        {/* Mobile sidebar (always rendered for menu drawer) */}
        <div className="md:hidden">
          <NewSidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Only show TabBar if there are tabs from file explorer */}
          {tabs.length > 0 && <TabBar />}
          <div className="flex-1 overflow-auto bg-vscode-bg relative z-10">
            <AnimatePresence mode="wait">
              {portfolioSettings.showAnimations ? (
                <motion.div
                  key={activeTabId || activeMenuItem || 'welcome'}
                  variants={variants(advancedPageTransition, portfolioSettings.showAnimations)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {activeContent}
                </motion.div>
              ) : (
                <div className="w-full">
                  {activeContent}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <StatusBar />
      <NotificationToast />
    </div>
  )
}
