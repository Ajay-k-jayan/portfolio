'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  FileText, FolderOpen, GitBranch, 
  Lightbulb, Star, Code,
  Sparkles, Award,
  MessageSquare, FilePlus,
  Linkedin
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { portfolioData } from '@/lib/portfolio-data'
import { useLanguage } from '@/contexts/language-context'
import { 
  slideDown, 
  staggerContainer, 
  staggerItemLeft, 
  staggerItem,
  useMotionConfig,
  advancedStaggerContainer,
  advancedStaggerItem,
  smoothFade,
  magneticHover,
  zoomFade,
  slideFadeRotate
} from '@/lib/motionConfig'

export function WelcomeTab() {
  const { t } = useLanguage()
  const { setActiveMenuItem, recentlySelected, portfolioSettings, addNotification } = useAppStore()
  const { currentTheme } = useEnhancedTheme()
  const [mounted, setMounted] = useState(false)
  const { variants } = useMotionConfig(portfolioSettings.animationSpeed)
  
  const menuItemLabels: Record<string, string> = {
    'project': t('projects'),
    'skills': t('skills'),
    'experience': t('experience'),
    'achievement': t('achievements'),
    'certifications': t('certifications'),
    'contact': t('contact'),
    'blogs': t('blogs'),
    'recommendation': t('recommendations'),
    'settings': t('settings'),
    'welcome': t('welcome'),
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Start actions - VS Code style
  const startActions = [
    { 
      id: 'new-project',
      label: t('newProject'),
      icon: FilePlus,
      action: () => {
        addNotification({
          title: t('newProject'),
          message: t('openProjectsTab'),
          type: 'info'
        })
        setActiveMenuItem('project')
      },
    },
    { 
      id: 'open-project',
      label: t('openProject'),
      icon: FolderOpen,
      action: () => setActiveMenuItem('project'),
    },
    { 
      id: 'clone-git',
      label: t('cloneFromGit'),
      icon: GitBranch,
      action: () => {
        window.open(portfolioData.profile.portfolioRepo, '_blank')
        addNotification({
          title: t('repositoryOpened'),
          message: t('portfolioRepositoryOpened'),
          type: 'info'
        })
      },
    },
    { 
      id: 'contact-me',
      label: t('contactMe'),
      icon: MessageSquare,
      action: () => setActiveMenuItem('contact'),
    },
    { 
      id: 'ai-assistant',
      label: t('generateAgentInstructions'),
      icon: Sparkles,
      action: () => {
        // Open chatbot via global function
        const openChatbot = (window as any).openChatbot
        if (openChatbot) {
          openChatbot()
        } else {
          // Fallback: trigger openChat event
          const event = new CustomEvent('openChat')
          window.dispatchEvent(event)
        }
        addNotification({
          title: 'AI Assistant',
          message: t('openingAIChatbot'),
          type: 'info'
        })
      },
    },
  ]

  // Recent items - VS Code style with file paths
  const recentItems = useMemo(() => {
    const items = recentlySelected
      .filter(item => item !== 'file-explore' && item !== 'welcome')
      .slice(0, 5)
      .map(item => {
        const label = menuItemLabels[item] || item
        let path = ''
        let icon = FolderOpen

        if (item === 'project' && portfolioData.projects.length > 0) {
          path = `C:\\Portfolio\\Projects\\${portfolioData.projects[0].name}`
        } else if (item === 'experience' && portfolioData.experience.length > 0) {
          path = `C:\\Portfolio\\Experience\\${portfolioData.experience[0].company}`
        } else if (item === 'skills') {
          path = 'C:\\Portfolio\\Skills\\Frontend Development'
          icon = Code
        } else if (item === 'achievement') {
          path = 'C:\\Portfolio\\Achievements\\Certifications'
          icon = Award
        } else if (item === 'certifications') {
          path = 'C:\\Portfolio\\Certifications\\Professional'
          icon = Award
        } else if (item === 'contact') {
          path = 'C:\\Portfolio\\Contact\\Connect'
          icon = MessageSquare
        } else {
          path = `C:\\Portfolio\\${label}\\Portfolio`
        }

        return {
          name: label,
          path,
          icon,
          action: () => setActiveMenuItem(item)
        }
      })
    
    // Add some default recent items if none exist
    if (items.length === 0) {
      return [
        {
          name: 'Aurex Project',
          path: 'C:\\Projects\\Aurex\\aurex-analytics',
          icon: FolderOpen,
          action: () => setActiveMenuItem('project')
        },
        {
          name: 'Portfolio',
          path: 'C:\\Projects\\portfolio\\2025-nov-portfolio',
          icon: FolderOpen,
          action: () => setActiveMenuItem('project')
        }
      ]
    }
    
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlySelected, setActiveMenuItem])

  // Walkthroughs - VS Code style cards
  const walkthroughs = [
    {
      id: 'get-started',
      title: t('getStartedWithPortfolio'),
      description: t('exploreSkillsProjects'),
      icon: Star,
      highlighted: true,
      action: () => setActiveMenuItem('skills')
    },
    {
      id: 'fundamentals',
      title: t('learnTheFundamentals'),
      description: t('discoverCoreTechnologies'),
      icon: Lightbulb,
      highlighted: false,
      action: () => setActiveMenuItem('skills')
    },
    {
      id: 'resume',
      title: t('viewResume'),
      description: t('downloadResumeLearn'),
      icon: FileText,
      highlighted: false,
      updated: true,
      action: () => {
      const link = document.createElement('a')
      link.href = '/resume.pdf'
      link.download = 'Ajay_K_J_Resume.pdf'
      link.click()
    addNotification({
          title: t('resume'),
          message: t('resumeDownloadStarted'),
          type: 'info'
        })
      }
    },
    {
      id: 'linkedin',
      title: t('connectOnLinkedIn'),
      description: t('viewProfessionalProfile'),
      icon: Linkedin,
      highlighted: false,
      updated: true,
      action: () => {
        window.open(portfolioData.profile.linkedin, '_blank')
        addNotification({
          title: 'LinkedIn',
          message: t('openingLinkedInProfile'),
          type: 'info'
        })
      }
    }
  ]

  return (
    <motion.div 
      className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto"
      variants={variants(smoothFade, portfolioSettings.showAnimations)}
      initial="hidden"
      animate="visible"
    >
      {/* VS Code Welcome Screen Design */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header with Advanced Animation */}
        <motion.div
          variants={variants(slideFadeRotate, portfolioSettings.showAnimations)}
          initial="hidden"
          animate="visible"
          className="mb-12 relative"
        >
          {/* Glow effect behind header */}
          <motion.div
            className="absolute -inset-4 bg-vscode-blue/10 blur-3xl rounded-full opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <h1 className="text-4xl font-normal text-vscode-text mb-2 relative z-10" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
            {t('welcomeToPortfolio')} {portfolioData.profile.name}&apos;s Portfolio
          </h1>
          <motion.p 
            className="text-base text-vscode-text-secondary relative z-10" 
            style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
            variants={variants(smoothFade, portfolioSettings.showAnimations)}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {portfolioData.profile.subtitle}
          </motion.p>
        </motion.div>

        {/* Main Two-Column Layout - VS Code Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Start & Recent */}
          <div className="lg:col-span-2 space-y-10">
            {/* Start Section with Advanced Animations */}
            <motion.div
              variants={variants(advancedStaggerContainer, portfolioSettings.showAnimations)}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-2xl font-normal text-vscode-text mb-6" 
                style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                variants={variants(smoothFade, portfolioSettings.showAnimations)}
              >
                {t('start')}
              </motion.h2>
              <div className="space-y-1">
                {startActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.id}
                      onClick={action.action}
                      variants={variants(advancedStaggerItem, portfolioSettings.showAnimations)}
                      custom={index}
                      className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-all group flex items-center gap-3 relative overflow-hidden"
                      style={{
                        color: currentTheme?.colors?.blue || '#007acc',
                        fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-vscode-blue/5 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        variants={variants(magneticHover, portfolioSettings.showAnimations)}
                        whileHover="hover"
                      >
                        <Icon 
                          size={18} 
                          className="flex-shrink-0 relative z-10"
                          style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                        />
                      </motion.div>
                      <span className="text-sm font-normal relative z-10">{action.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Recent Section with Advanced Animations */}
            {mounted && portfolioSettings.showRecentItems && (
            <motion.div
              variants={variants(advancedStaggerContainer, portfolioSettings.showAnimations)}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-2xl font-normal text-vscode-text mb-6" 
                style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                variants={variants(smoothFade, portfolioSettings.showAnimations)}
              >
                {t('recent')}
              </motion.h2>
              <div className="space-y-1">
                {recentItems.length > 0 ? (
                  <>
                    {recentItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={index}
                          onClick={item.action}
                          variants={variants(advancedStaggerItem, portfolioSettings.showAnimations)}
                          custom={index}
                          className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-all group relative overflow-hidden"
                          style={{
                            fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            x: 4,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Hover glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-vscode-blue/5 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                          <div className="flex items-center gap-3 mb-0.5 relative z-10">
                            <motion.div
                              variants={variants(magneticHover, portfolioSettings.showAnimations)}
                              whileHover="hover"
                            >
                              <Icon 
                                size={16} 
                                className="flex-shrink-0"
                                style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                              />
                            </motion.div>
                            <span 
                              className="text-sm font-normal"
                              style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                            >
                              {item.name}
                            </span>
                          </div>
                          <div 
                            className="text-xs ml-7 text-vscode-text-secondary truncate relative z-10"
                            style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                          >
                            {item.path}
                          </div>
                        </motion.button>
                      )
                    })}
                    <motion.button
                      variants={variants(advancedStaggerItem, portfolioSettings.showAnimations)}
                      className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-all mt-1 relative overflow-hidden"
                      style={{
                        color: currentTheme?.colors?.blue || '#007acc',
                        fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                      }}
                      onClick={() => setActiveMenuItem('file-explore')}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-vscode-blue/5 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="text-sm font-normal relative z-10">{t('more')}</span>
                    </motion.button>
                  </>
                ) : (
                  <div className="px-3 py-8 text-center">
                    <p className="text-sm text-vscode-text-secondary" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
                      {t('noRecentItems')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
            )}
          </div>

          {/* Right Column - Walkthroughs with Advanced Animations */}
          <motion.div
            className="lg:col-span-1"
            variants={variants(advancedStaggerContainer, portfolioSettings.showAnimations)}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-2xl font-normal text-vscode-text mb-6" 
              style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
              variants={variants(smoothFade, portfolioSettings.showAnimations)}
            >
              Walkthroughs
            </motion.h2>
            <div className="space-y-3">
              {walkthroughs.map((walkthrough, index) => {
                const Icon = walkthrough.icon
                return (
                  <motion.button
                    key={walkthrough.id}
                    onClick={walkthrough.action}
                    variants={variants(advancedStaggerItem, portfolioSettings.showAnimations)}
                    custom={index}
                    className="w-full text-left p-4 bg-vscode-sidebar border border-vscode-border rounded hover:border-vscode-blue/50 transition-all group relative overflow-hidden"
                    style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                    whileHover={{ 
                      scale: 1.03,
                      y: -2,
                      borderColor: 'rgba(0, 122, 204, 0.5)',
                      boxShadow: '0 10px 30px rgba(0, 122, 204, 0.2)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-vscode-blue/10 via-vscode-blue/5 to-transparent opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Star icon for highlighted items */}
                    {walkthrough.highlighted && (
                      <div 
                        className="absolute top-3 right-3"
                        style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                      >
                        <Star size={16} fill="currentColor" />
                  </div>
                    )}
                    
                    {/* Updated badge */}
                    {walkthrough.updated && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-vscode-blue text-white text-[10px] font-medium rounded">
                        Updated
              </div>
            )}

                    <div className="flex items-start gap-3 pr-8 relative z-10">
                      <motion.div 
                        className={`p-2 rounded flex-shrink-0 ${
                          walkthrough.highlighted ? 'bg-vscode-blue/20' : 'bg-vscode-active'
                        }`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Icon 
                          size={18} 
                          style={{
                            color: walkthrough.highlighted 
                              ? (currentTheme?.colors?.blue || '#007acc')
                              : 'var(--vscode-text-secondary, #858585)'
                          }}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-normal mb-1 text-vscode-text group-hover:text-vscode-blue transition-colors">
                          {walkthrough.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-vscode-text-secondary">
                          {walkthrough.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
