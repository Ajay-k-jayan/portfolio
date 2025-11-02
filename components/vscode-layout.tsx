'use client'

import { useState } from 'react'
import { NewSidebar } from './new-sidebar'
import { PortfolioHeader } from './portfolio-header'
import { TabBar } from './tab-bar'
import { StatusBar } from './status-bar'
import { AIChatbot } from './ai-chatbot'
import { VoiceAssistant } from './voice-assistant'
import { ParticleBackground } from './particle-background'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { WelcomeTab } from './tabs/welcome-tab'
import { SkillsTab } from './tabs/skills-tab'
import { ProjectsTab } from './tabs/projects-tab'
import { AchievementsView } from './sidebar-views/achievements-view'
import { ExperienceTab } from './tabs/experience-tab'
import { BlogSystem } from './blog-system'
import { SocialIntegrations } from './social-integrations'
import { RecommendationsTab } from './tabs/recommendations-tab'

export function VSCodeLayout({ children }: { children: React.ReactNode }) {
  const { tabs, activeTabId, sidebarCollapsed, activeMenuItem } = useAppStore()
  const [showChatbot, setShowChatbot] = useState(false)

  // Get content based on active menu item (from sidebar)
  const getContentFromMenuItem = () => {
    const contentMap: Record<string, React.ReactNode> = {
      'welcome': <WelcomeTab />,
      'skills': <SkillsTab />,
      'project': <ProjectsTab />,
      'achievement': <AchievementsView />,
      'experience': <ExperienceTab />,
      'certifications': <AchievementsView />,
      'blogs': <BlogSystem />,
      'social-medias': <SocialIntegrations />,
      'recommendation': <RecommendationsTab />,
    }
    return contentMap[activeMenuItem] || <WelcomeTab />
  }

  // Use tabs only if activeMenuItem is 'file-explore', otherwise use sidebar menu item content
  const activeTab = tabs.find(t => t.id === activeTabId)
  const activeContent = activeMenuItem === 'file-explore' && activeTab?.content
    ? activeTab.content
    : getContentFromMenuItem()

  return (
    <div className="h-screen w-screen flex flex-col bg-vscode-bg text-vscode-text overflow-hidden relative">
      <ParticleBackground />
      <PortfolioHeader />
      <div className="flex flex-1 overflow-hidden">
        <NewSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Only show TabBar if there are tabs from file explorer */}
          {tabs.length > 0 && <TabBar />}
          <div className="flex-1 overflow-auto bg-vscode-bg relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId || activeMenuItem || 'welcome'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <StatusBar />
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
      <VoiceAssistant />
      <motion.button
        onClick={() => setShowChatbot(!showChatbot)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-6 bg-vscode-blue text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors z-50"
        aria-label="Toggle AI Chatbot"
        animate={{
          boxShadow: showChatbot
            ? '0 0 20px rgba(0, 122, 204, 0.5)'
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>
    </div>
  )
}
