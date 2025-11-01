'use client'

import { FilePlus, FolderOpen, Folder, GitBranch, Zap, Rocket, Lightbulb, GitBranch as GitIcon, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

export function WelcomeTab() {
  const { setActiveMenuItem } = useAppStore()

  const quickStartActions = [
    { 
      id: 'about',
      label: 'About Me',
      icon: FilePlus,
      description: 'View my background, experience, and professional journey',
      action: () => setActiveMenuItem('welcome')
    },
    { 
      id: 'skills',
      label: 'Skills & Expertise',
      icon: FolderOpen,
      description: 'Explore my technical skills and proficiencies',
      action: () => setActiveMenuItem('skills')
    },
    { 
      id: 'projects',
      label: 'View Projects',
      icon: Folder,
      description: 'Browse my portfolio projects and case studies',
      action: () => setActiveMenuItem('project')
    },
    { 
      id: 'experience',
      label: 'Work Experience',
      icon: GitBranch,
      description: 'See my professional experience and career timeline',
      action: () => setActiveMenuItem('experience')
    },
    { 
      id: 'contact',
      label: 'Connect With Me',
      icon: Zap,
      description: 'Get in touch via email, LinkedIn, or GitHub',
      action: () => setActiveMenuItem('social-medias')
    },
    { 
      id: 'ai-chat',
      label: 'AI Portfolio Assistant',
      icon: Rocket,
      description: 'Chat with AI assistant about my portfolio',
      action: () => {
        // Trigger chatbot
        const event = new CustomEvent('openChatbot')
        window.dispatchEvent(event)
      }
    },
  ]

  const recentItems = [
    { name: 'Aurex Analytics Platform', path: 'Projects / Aurex', action: () => setActiveMenuItem('project') },
    { name: 'Skills & Technologies', path: 'Skills / Frontend Development', action: () => setActiveMenuItem('skills') },
    { name: 'Work Experience', path: 'Experience / Beinex', action: () => setActiveMenuItem('experience') },
    { name: 'Certifications', path: 'Achievements / Meta Certifications', action: () => setActiveMenuItem('achievement') },
    { name: 'Blog Posts', path: 'Blogs / Technical Articles', action: () => setActiveMenuItem('blogs') },
  ]

  const walkthroughs = [
    {
      id: 'get-started',
      title: 'Get started with Portfolio',
      description: 'Explore my skills, projects, and experience to understand my capabilities',
      icon: Rocket,
      color: 'text-blue-400',
    },
    {
      id: 'skills',
      title: 'Learn My Skills',
      description: 'Discover the technologies and frameworks I work with',
      icon: Lightbulb,
      color: 'text-yellow-400',
    },
    {
      id: 'projects',
      title: 'View My Projects',
      description: 'Check out real-world projects I\'ve built and contributed to',
      icon: GitIcon,
      color: 'text-green-400',
      badge: 'Featured',
    },
    {
      id: 'ai-assistant',
      title: 'AI Portfolio Assistant',
      description: 'Chat with AI to learn more about my work and experience',
      icon: Sparkles,
      color: 'text-purple-400',
      badge: 'New',
    },
  ]

  return (
    <div className="w-full bg-vscode-bg text-vscode-text py-8">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-vscode-text mb-2">
            Ajay K J
          </h1>
          <p className="text-lg text-vscode-text-secondary">
            Portfolio evolved • Software Engineer • Front-End Developer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Start Section */}
            <div>
              <h2 className="text-lg font-semibold text-vscode-text mb-4">Start</h2>
              <div className="space-y-1">
                {quickStartActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.id}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-vscode-hover transition-colors group text-left"
                      whileHover={{ x: 4 }}
                    >
                      <Icon size={18} className="text-vscode-blue flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-vscode-blue group-hover:text-vscode-blue-accent transition-colors">
                          {action.label}
                        </div>
                        <div className="text-xs text-vscode-text-secondary mt-0.5 line-clamp-1">
                          {action.description}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Recent Section */}
            <div>
              <h2 className="text-lg font-semibold text-vscode-text mb-4">Recent</h2>
              <div className="space-y-1">
                {recentItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={item.action}
                    className="w-full flex flex-col items-start px-3 py-2 rounded hover:bg-vscode-hover transition-colors group text-left"
                    whileHover={{ x: 4 }}
                  >
                    <div className="text-sm text-vscode-blue group-hover:text-vscode-blue-accent transition-colors">
                      {item.name}
                    </div>
                    <div className="text-xs text-vscode-text-secondary mt-0.5 line-clamp-1">
                      {item.path}
                    </div>
                  </motion.button>
                ))}
                <motion.button
                  className="w-full text-left px-3 py-2 text-sm text-vscode-blue hover:text-vscode-blue-accent transition-colors"
                  whileHover={{ x: 4 }}
                >
                  More...
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column - Walkthroughs */}
          <div>
            <h2 className="text-lg font-semibold text-vscode-text mb-4">Walkthroughs</h2>
            <div className="space-y-3">
              {walkthroughs.map((walkthrough) => {
                const Icon = walkthrough.icon
                return (
                  <motion.button
                    key={walkthrough.id}
                    onClick={() => {
                      if (walkthrough.id === 'skills') setActiveMenuItem('skills')
                      else if (walkthrough.id === 'projects') setActiveMenuItem('project')
                      else if (walkthrough.id === 'ai-assistant') {
                        const event = new CustomEvent('openChatbot')
                        window.dispatchEvent(event)
                      }
                    }}
                    className="w-full bg-vscode-active border border-vscode-border rounded-lg p-4 hover:border-vscode-blue transition-all group text-left relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={24} className={`${walkthrough.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-vscode-text">
                            {walkthrough.title}
                          </h3>
                          {walkthrough.badge && (
                            <span className="px-2 py-0.5 bg-vscode-blue text-white text-[10px] rounded-full font-medium">
                              {walkthrough.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-vscode-text-secondary leading-relaxed">
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

        {/* Footer Options */}
        <div className="mt-12 pt-8 border-t border-vscode-border flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-vscode-text-secondary cursor-pointer hover:text-vscode-text transition-colors">
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
            />
            <span>Show welcome page on startup</span>
          </label>
          
          <motion.button
            className="flex items-center gap-2 px-3 py-1.5 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-blue hover:bg-vscode-hover transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reload Portfolio</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
