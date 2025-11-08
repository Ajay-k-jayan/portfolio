'use client'

import { useState, useMemo } from 'react'
import { 
  FileText, FolderOpen, GitBranch, 
  Lightbulb, Star, Code, Briefcase,
  Share2, Sparkles, Award,
  Download, MessageSquare, FilePlus, FolderOpen as FolderOpenIcon,
  Github, Linkedin, BookOpen, User
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { portfolioData } from '@/lib/portfolio-data'
import { ProfileAvatar } from '@/components/profile-avatar'
import { Building2, TrendingUp, MapPin, Command } from 'lucide-react'

const menuItemLabels: Record<string, string> = {
  'project': 'Projects',
  'skills': 'Skills',
  'experience': 'Experience',
  'achievement': 'Achievements',
  'certifications': 'Certifications',
  'contact': 'Contact',
  'blogs': 'Blogs',
  'recommendation': 'Recommendations',
  'settings': 'Settings',
  'welcome': 'Welcome',
}

export function WelcomeTab() {
  const { setActiveMenuItem, recentlySelected, portfolioSettings, addNotification } = useAppStore()
  const { currentTheme } = useEnhancedTheme()

  // Start actions - VS Code style
  const startActions = [
    { 
      id: 'new-project',
      label: 'New Project...',
      icon: FilePlus,
      action: () => {
        addNotification({
          title: 'New Project',
          message: 'Open Projects tab to view portfolio projects',
          type: 'info'
        })
        setActiveMenuItem('project')
      },
    },
    { 
      id: 'open-project',
      label: 'Open Project...',
      icon: FolderOpenIcon,
      action: () => setActiveMenuItem('project'),
    },
    { 
      id: 'clone-git',
      label: 'Clone from Git...',
      icon: GitBranch,
      action: () => {
        window.open(portfolioData.profile.portfolioRepo, '_blank')
        addNotification({
          title: 'Repository Opened',
          message: 'Portfolio repository opened in new tab',
          type: 'info'
        })
      },
    },
    { 
      id: 'contact-me',
      label: 'Contact Me...',
      icon: MessageSquare,
      action: () => setActiveMenuItem('contact'),
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
  }, [recentlySelected, setActiveMenuItem])

  // Walkthroughs - VS Code style cards
  const walkthroughs = [
    {
      id: 'get-started',
      title: 'Get started with Portfolio',
      description: 'Explore my skills, projects, and experience. Learn about my journey as a software engineer.',
      icon: Star,
      highlighted: true,
      action: () => setActiveMenuItem('skills')
    },
    {
      id: 'fundamentals',
      title: 'Learn the Fundamentals',
      description: 'Discover my core technologies: Angular, React, TypeScript, and modern web development.',
      icon: Lightbulb,
      highlighted: false,
      action: () => setActiveMenuItem('skills')
    },
    {
      id: 'resume',
      title: 'View Resume',
      description: 'Download my resume and learn about my professional background and achievements.',
      icon: FileText,
      highlighted: false,
      updated: true,
      action: () => {
      const link = document.createElement('a')
      link.href = '/resume.pdf'
      link.download = 'Ajay_K_J_Resume.pdf'
      link.click()
    addNotification({
          title: 'Resume Download',
          message: 'Resume download started',
          type: 'info'
        })
      }
    },
    {
      id: 'linkedin',
      title: 'Connect on LinkedIn',
      description: 'View my professional profile, recommendations, and connect with me on LinkedIn.',
      icon: Linkedin,
      highlighted: false,
      updated: true,
      action: () => {
        window.open(portfolioData.profile.linkedin, '_blank')
        addNotification({
          title: 'LinkedIn',
          message: 'Opening LinkedIn profile',
          type: 'info'
        })
      }
    }
  ]

  return (
    <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
      {/* VS Code Welcome Screen Design */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Welcome Header */}
            <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-normal text-vscode-text mb-2" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
            Welcome to {portfolioData.profile.name}&apos;s Developer Portfolio
          </h1>
          <p className="text-base text-vscode-text-secondary" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
            {portfolioData.profile.subtitle}
          </p>
        </motion.div>

        {/* Main Two-Column Layout - VS Code Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Start & Recent */}
          <div className="lg:col-span-2 space-y-10">
            {/* Start Section */}
            <div>
              <h2 className="text-2xl font-normal text-vscode-text mb-6" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
                Start
              </h2>
              <div className="space-y-1">
                {startActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                          <motion.button
                            key={action.id}
                            onClick={action.action}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-colors group flex items-center gap-3"
                      style={{
                        color: currentTheme?.colors?.blue || '#007acc',
                        fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--vscode-hover, rgba(255,255,255,0.1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon 
                        size={18} 
                        className="flex-shrink-0"
                        style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                      />
                      <span className="text-sm font-normal">{action.label}</span>
                          </motion.button>
                        )
                      })}
                    </div>
            </div>

            {/* Recent Section */}
            <div>
              <h2 className="text-2xl font-normal text-vscode-text mb-6" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
                Recent
              </h2>
              <div className="space-y-1">
                {recentItems.length > 0 ? (
                  <>
                        {recentItems.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.button
                              key={index}
                              onClick={item.action}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                          className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-colors group"
                          style={{
                            fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--vscode-hover, rgba(255,255,255,0.1))'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-3 mb-0.5">
                            <Icon 
                              size={16} 
                              className="flex-shrink-0"
                              style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                            />
                            <span 
                              className="text-sm font-normal"
                              style={{ color: currentTheme?.colors?.blue || '#007acc' }}
                            >
                                    {item.name}
                                  </span>
                                </div>
                          <div 
                            className="text-xs ml-7 text-vscode-text-secondary truncate"
                            style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                          >
                                  {item.path}
                                </div>
                            </motion.button>
                          )
                        })}
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 + recentItems.length * 0.05 }}
                      className="w-full text-left px-3 py-2.5 rounded hover:bg-vscode-hover transition-colors mt-1"
                style={{
                        color: currentTheme?.colors?.blue || '#007acc',
                        fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)',
                      }}
                      onClick={() => setActiveMenuItem('file-explore')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--vscode-hover, rgba(255,255,255,0.1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span className="text-sm font-normal">More...</span>
                    </motion.button>
                  </>
                ) : (
                  <div className="px-3 py-8 text-center">
                    <p className="text-sm text-vscode-text-secondary" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
                      No recent items yet. Start exploring!
                    </p>
                  </div>
                )}
                </div>
              </div>
          </div>

          {/* Right Column - Walkthroughs */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-normal text-vscode-text mb-6" style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}>
              Walkthroughs
            </h2>
            <div className="space-y-3">
              {walkthroughs.map((walkthrough, index) => {
                const Icon = walkthrough.icon
                  return (
                  <motion.button
                    key={walkthrough.id}
                    onClick={walkthrough.action}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="w-full text-left p-4 bg-vscode-sidebar border border-vscode-border rounded hover:border-vscode-blue/50 transition-all group relative"
                    style={{ fontFamily: 'var(--vscode-font-family, "Segoe UI", sans-serif)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 122, 204, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--vscode-border, rgba(255,255,255,0.1))'
                    }}
                  >
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

                    <div className="flex items-start gap-3 pr-8">
                      <div 
                        className={`p-2 rounded flex-shrink-0 ${
                          walkthrough.highlighted ? 'bg-vscode-blue/20' : 'bg-vscode-active'
                        }`}
                      >
                        <Icon 
                          size={18} 
                style={{
                            color: walkthrough.highlighted 
                              ? (currentTheme?.colors?.blue || '#007acc')
                              : 'var(--vscode-text-secondary, #858585)'
                          }}
                        />
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
