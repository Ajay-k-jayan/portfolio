'use client'

import { useState } from 'react'
import { 
  FolderOpen, Folder, GitBranch, Zap, Rocket, Lightbulb, Sparkles, 
  Code, Briefcase, Award, BookOpen, Share2, MessageSquare, Home,
  ArrowRight, Star, TrendingUp, Settings, ChevronRight, ChevronDown,
  User, Mail, Phone, MapPin, Calendar, Github, Linkedin, Twitter,
  FileText, Download, Bell, Clock, Activity, Layers
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'

export function WelcomeTab() {
  const { setActiveMenuItem, portfolioSettings, addNotification } = useAppStore()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['start', 'recent']))

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const quickStartActions = [
    { 
      id: 'skills',
      label: 'Skills & Expertise',
      icon: Code,
      description: 'Explore technical skills and proficiencies',
      action: () => setActiveMenuItem('skills'),
      color: 'text-blue-400',
      category: 'Development'
    },
    { 
      id: 'projects',
      label: 'View Projects',
      icon: FolderOpen,
      description: 'Browse portfolio projects and case studies',
      action: () => setActiveMenuItem('project'),
      color: 'text-purple-400',
      category: 'Portfolio'
    },
    { 
      id: 'experience',
      label: 'Work Experience',
      icon: Briefcase,
      description: 'See professional experience and career timeline',
      action: () => setActiveMenuItem('experience'),
      color: 'text-green-400',
      category: 'Career'
    },
    { 
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      description: 'View awards, recognitions, and milestones',
      action: () => setActiveMenuItem('achievement'),
      color: 'text-yellow-400',
      category: 'Recognition'
    },
    { 
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      description: 'Browse professional certifications and courses',
      action: () => setActiveMenuItem('certifications'),
      color: 'text-orange-400',
      category: 'Education'
    },
    { 
      id: 'contact',
      label: 'Connect With Me',
      icon: Share2,
      description: 'Get in touch via email, LinkedIn, or GitHub',
      action: () => setActiveMenuItem('social-medias'),
      color: 'text-pink-400',
      category: 'Social'
    },
    { 
      id: 'blogs',
      label: 'Blog Posts',
      icon: BookOpen,
      description: 'Read technical articles and insights',
      action: () => setActiveMenuItem('blogs'),
      color: 'text-indigo-400',
      category: 'Content'
    },
    { 
      id: 'recommendations',
      label: 'Recommendations',
      icon: MessageSquare,
      description: 'Read professional recommendations',
      action: () => setActiveMenuItem('recommendation'),
      color: 'text-cyan-400',
      category: 'Social'
    }
  ]

  const recentItems = [
    { name: 'Aurex Analytics Platform', path: 'Projects / Aurex', action: () => setActiveMenuItem('project') },
    { name: 'Skills & Technologies', path: 'Skills / Frontend Development', action: () => setActiveMenuItem('skills') },
    { name: 'Work Experience', path: 'Experience / Beinex', action: () => setActiveMenuItem('experience') },
    { name: 'Certifications', path: 'Achievements / Meta Certifications', action: () => setActiveMenuItem('certifications') },
  ]

  const stats = [
    { label: 'Years Experience', value: '3+', icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Projects Completed', value: '10+', icon: Folder, color: 'text-purple-400' },
    { label: 'Skills Mastered', value: '50+', icon: Star, color: 'text-yellow-400' },
    { label: 'Certifications', value: '12', icon: Award, color: 'text-green-400' }
  ]

  const personalInfo = [
    { icon: Mail, label: 'Email', value: 'ajaykj2000@gmail.com', action: () => window.location.href = 'mailto:ajaykj2000@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 82899 17044', action: () => window.location.href = 'tel:+918289917044' },
    { icon: MapPin, label: 'Location', value: 'Kerala, India', action: null },
    { icon: Calendar, label: 'Available', value: 'Open to Opportunities', action: null },
  ]

  const socialQuickLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/Ajay-k-jayan', color: 'hover:text-white' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/ajay-k-jayan-4a55b1224/', color: 'hover:text-blue-400' },
  ]

  return (
    <div className="w-full h-full bg-vscode-bg text-vscode-text overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header Section - VSCode Style */}
        <div className="mb-8 border-b border-vscode-border pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-vscode-blue/20 rounded-lg">
                  <Home className="text-vscode-blue" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-vscode-text">
                    Welcome
                  </h1>
                  <p className="text-sm text-vscode-text-secondary mt-1">
                    Ajay K J • Software Engineer • Front-End Developer
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-vscode-text-secondary max-w-3xl mt-3">
              Experienced front-end developer with 3 years of demonstrated expertise in Angular programming, web development, and responsive UI design.
            </p>
          </motion.div>
        </div>

            {/* Stats Grid - VSCode Panel Style */}
        {portfolioSettings.showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-vscode-sidebar border border-vscode-border rounded p-4 hover:border-vscode-blue transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`${stat.color}`} size={20} />
                  <span className="text-xs text-vscode-text-secondary">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-vscode-text">{stat.value}</div>
              </motion.div>
            )
          })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start Section - VSCode Tree View Style */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <button
                onClick={() => toggleSection('start')}
                className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">QUICK START</span>
                </div>
                {expandedSections.has('start') ? (
                  <ChevronDown className="text-vscode-text-secondary" size={16} />
                ) : (
                  <ChevronRight className="text-vscode-text-secondary" size={16} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.has('start') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-1">
                      {quickStartActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                              <motion.button
                                key={action.id}
                                onClick={action.action}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                                className="group w-full flex items-center gap-3 px-3 py-2.5 hover:bg-vscode-active rounded text-left transition-colors"
                                whileHover={{ x: 2 }}
                              >
                                <Icon size={18} className={`${action.color} flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm text-vscode-text group-hover:text-vscode-blue transition-colors">
                                      {action.label}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-vscode-border rounded text-vscode-text-secondary">
                                      {action.category}
                                    </span>
                                  </div>
                                  <div className="text-xs text-vscode-text-secondary line-clamp-1">
                                    {action.description}
                                  </div>
                                </div>
                                <ArrowRight size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                              </motion.button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
            </div>

            {/* Recent Section - VSCode Tree View Style */}
            {portfolioSettings.showRecentItems && (
              <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <button
                onClick={() => toggleSection('recent')}
                className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
              >
                <div className="flex items-center gap-2">
                  <Clock className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">RECENT</span>
                </div>
                {expandedSections.has('recent') ? (
                  <ChevronDown className="text-vscode-text-secondary" size={16} />
                ) : (
                  <ChevronRight className="text-vscode-text-secondary" size={16} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.has('recent') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-1">
                      {recentItems.map((item, index) => (
                            <motion.button
                              key={index}
                              onClick={item.action}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="group w-full flex items-center gap-2 px-3 py-2 hover:bg-vscode-active rounded text-left transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              <Folder size={14} className="text-vscode-text-secondary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-vscode-text group-hover:text-vscode-blue transition-colors mb-0.5">
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-vscode-text-secondary line-clamp-1">
                                  {item.path}
                                </div>
                              </div>
                              <ArrowRight size={12} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
              </AnimatePresence>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <div className="px-4 py-3 bg-vscode-active border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <User className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">CONTACT INFORMATION</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {personalInfo.map((info, index) => {
                      const Icon = info.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`flex items-center gap-3 px-3 py-2 rounded ${info.action ? 'hover:bg-vscode-active cursor-pointer' : ''} transition-colors`}
                          onClick={info.action || undefined}
                        >
                          <Icon size={16} className="text-vscode-text-secondary flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-vscode-text-secondary">{info.label}</div>
                            <div className="text-sm text-vscode-text">{info.value}</div>
                          </div>
                        </motion.div>
                      )
                    })}
              </div>
            </div>
          </div>

          {/* Right Column - Features & Links */}
          <div className="space-y-6">
            {/* Features Panel */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <div className="px-4 py-3 bg-vscode-active border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">FEATURES</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { icon: Rocket, title: 'Get Started', desc: 'Explore skills and projects', color: 'text-blue-400' },
                  { icon: Lightbulb, title: 'Learn Skills', desc: 'Discover technologies', color: 'text-yellow-400' },
                  { icon: GitBranch, title: 'View Projects', desc: 'Check real-world work', color: 'text-green-400', badge: 'Featured' },
                  { icon: Sparkles, title: 'AI Assistant', desc: 'Chat with AI', color: 'text-purple-400', badge: 'New' },
                ].map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="relative p-3 bg-vscode-active rounded border border-vscode-border hover:border-vscode-blue transition-all"
                        >
                          {feature.badge && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-vscode-blue text-white text-[10px] rounded font-medium">
                              {feature.badge}
                            </span>
                          )}
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded bg-opacity-10 ${feature.color.replace('text-', 'bg-')}`}>
                              <Icon size={16} className={feature.color} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xs font-semibold text-vscode-text mb-0.5">
                                {feature.title}
                              </h3>
                              <p className="text-[10px] text-vscode-text-secondary leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
              </div>
            </div>

            {/* Quick Social Links */}
            {portfolioSettings.showSocialLinks && (
              <div className="bg-vscode-sidebar border border-vscode-border rounded">
                <div className="px-4 py-3 bg-vscode-active border-b border-vscode-border">
                  <div className="flex items-center gap-2">
                    <Share2 className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">QUICK LINKS</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {socialQuickLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.label}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-vscode-active rounded transition-colors group"
                        >
                          <Icon size={16} className="text-vscode-text-secondary group-hover:text-vscode-blue transition-colors" />
                          <span className="text-sm text-vscode-text group-hover:text-vscode-blue transition-colors">{social.label}</span>
                          <ArrowRight size={12} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                        </motion.a>
                      )
                    })}
                    <motion.button
                      onClick={() => setActiveMenuItem('social-medias')}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-vscode-active rounded transition-colors group mt-2"
                    >
                      <Share2 size={16} className="text-vscode-text-secondary group-hover:text-vscode-blue transition-colors" />
                      <span className="text-sm text-vscode-text group-hover:text-vscode-blue transition-colors">View All Social Links</span>
                      <ArrowRight size={12} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                    </motion.button>
                </div>
              </div>
            )}

            {/* Resume Download */}
            {portfolioSettings.showResumeDownload && (
              <div className="bg-vscode-sidebar border border-vscode-border rounded">
                <div className="px-4 py-3 bg-vscode-active border-b border-vscode-border">
                  <div className="flex items-center gap-2">
                    <FileText className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">RESUME</span>
                  </div>
                </div>
                <div className="p-4">
                  <motion.button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = '/resume.pdf'
                      link.download = 'Ajay_K_J_Resume.pdf'
                      link.click()
                      
                      // Show download started notification
                      addNotification({
                        title: 'Resume Download',
                        message: 'Resume download started: Ajay_K_J_Resume.pdf',
                        type: 'info'
                      })
                      
                      // Show completion notification after a delay
                      setTimeout(() => {
                        addNotification({
                          title: 'Resume Download Complete',
                          message: 'Resume download completed successfully: Ajay_K_J_Resume.pdf',
                          type: 'success'
                        })
                      }, 2000)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    <span>Download Resume</span>
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
