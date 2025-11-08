'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FolderOpen, Folder, GitBranch, Zap, Rocket, Lightbulb, Sparkles, 
  Code, Briefcase, Award, BookOpen, Share2, MessageSquare, Home,
  ArrowRight, Star, TrendingUp, Settings, ChevronRight, ChevronDown,
  User, Mail, Phone, MapPin, Calendar, Github, Linkedin, Twitter,
  FileText, Download, Bell, Clock, Activity, Layers, Search, Command,
  Target, Trophy, BarChart3, Eye, Play, Pause, Filter, Grid3x3,
  List, Layout, TrendingDown, ArrowUp, ArrowDown, RefreshCw, Copy,
  CheckCircle2, XCircle, AlertCircle, Info, Terminal, Keyboard,
  Calendar as CalendarIcon, TrendingDown as TrendingDownIcon, Flame,
  Award as AwardIcon, Zap as ZapIcon, Globe, Users, BookMarked,
  Heart, MessageCircle, ThumbsUp, Share2 as ShareIcon, ExternalLink,
  Maximize2, Minimize2, MoreVertical, Pin, PinOff, Archive, Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { useLanguage } from '@/contexts/language-context'

export function WelcomeTab() {
  const { setActiveMenuItem, portfolioSettings, addNotification } = useAppStore()
  const { currentTheme } = useEnhancedTheme()
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['start', 'recent', 'activity', 'shortcuts']))
  const [searchQuery, setSearchQuery] = useState('')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'insights' | 'shortcuts'>('overview')
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set(['skills', 'projects']))
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const [showStatsDetails, setShowStatsDetails] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const commandPaletteInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when command palette opens
  useEffect(() => {
    if (showCommandPalette && commandPaletteInputRef.current) {
      commandPaletteInputRef.current.focus()
    }
  }, [showCommandPalette])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Escape to close command palette
      if (e.key === 'Escape' && showCommandPalette) {
        setShowCommandPalette(false)
        setSearchQuery('')
      }
      // / to focus search
      if (e.key === '/' && !showCommandPalette && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showCommandPalette])

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

  const togglePin = (id: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
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
      bgColor: 'bg-blue-500/20',
      category: 'Development',
      shortcut: '⌘S',
      badge: '50+',
      pinned: pinnedItems.has('skills'),
      hot: true
    },
    { 
      id: 'projects',
      label: 'View Projects',
      icon: FolderOpen,
      description: 'Browse portfolio projects and case studies',
      action: () => setActiveMenuItem('project'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      category: 'Portfolio',
      shortcut: '⌘P',
      badge: '10+',
      pinned: pinnedItems.has('projects'),
      hot: true
    },
    { 
      id: 'experience',
      label: 'Work Experience',
      icon: Briefcase,
      description: 'See professional experience and career timeline',
      action: () => setActiveMenuItem('experience'),
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      category: 'Career',
      shortcut: '⌘E',
      badge: '3+ Years',
      pinned: pinnedItems.has('experience')
    },
    { 
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      description: 'View awards, recognitions, and milestones',
      action: () => setActiveMenuItem('achievement'),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      category: 'Recognition',
      shortcut: '⌘A',
      badge: '12',
      pinned: pinnedItems.has('achievements')
    },
    { 
      id: 'certifications',
      label: 'Certifications',
      icon: Trophy,
      description: 'Browse professional certifications and courses',
      action: () => setActiveMenuItem('certifications'),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      category: 'Education',
      shortcut: '⌘C',
      badge: '12',
      pinned: pinnedItems.has('certifications')
    },
    { 
      id: 'contact',
      label: 'Connect With Me',
      icon: Share2,
      description: 'Get in touch via email, LinkedIn, or GitHub',
      action: () => setActiveMenuItem('social-medias'),
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      category: 'Social',
      shortcut: '⌘M',
      badge: 'New',
      pinned: pinnedItems.has('contact')
    },
    { 
      id: 'blogs',
      label: 'Blog Posts',
      icon: BookOpen,
      description: 'Read technical articles and insights',
      action: () => setActiveMenuItem('blogs'),
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      category: 'Content',
      shortcut: '⌘B',
      pinned: pinnedItems.has('blogs')
    },
    { 
      id: 'recommendations',
      label: 'Recommendations',
      icon: MessageSquare,
      description: 'Read professional recommendations',
      action: () => setActiveMenuItem('recommendation'),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      category: 'Social',
      pinned: pinnedItems.has('recommendations')
    }
  ]

  // Sort actions: pinned first, then hot, then alphabetical
  const sortedActions = [...quickStartActions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.hot && !b.hot) return -1
    if (!a.hot && b.hot) return 1
    return a.label.localeCompare(b.label)
  })

  const recentItems = [
    { name: 'Aurex Analytics Platform', path: 'Projects / Aurex', action: () => setActiveMenuItem('project'), time: '2h ago', icon: FolderOpen, pinned: false },
    { name: 'Skills & Technologies', path: 'Skills / Frontend Development', action: () => setActiveMenuItem('skills'), time: '1d ago', icon: Code, pinned: false },
    { name: 'Work Experience', path: 'Experience / Beinex', action: () => setActiveMenuItem('experience'), time: '3d ago', icon: Briefcase, pinned: false },
    { name: 'Certifications', path: 'Achievements / Meta Certifications', action: () => setActiveMenuItem('certifications'), time: '1w ago', icon: Award, pinned: false },
  ]

  const stats = [
    { 
      id: 'experience',
      labelKey: 'yearsExperience' as const,
      value: '3+', 
      icon: TrendingUp, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+1',
      trend: 'up' as const,
      description: 'Professional experience',
      details: 'Started career in 2021, working with Angular, React, and modern web technologies'
    },
    { 
      id: 'projects',
      labelKey: 'projectsCompleted' as const,
      value: '10+', 
      icon: Folder, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: '+3',
      trend: 'up' as const,
      description: 'Portfolio projects',
      details: 'Including Aurex Analytics, E-commerce Dashboards, and various client projects'
    },
    { 
      id: 'skills',
      labelKey: 'skillsMastered' as const,
      value: '50+', 
      icon: Star, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      change: '+5',
      trend: 'up' as const,
      description: 'Technical skills',
      details: 'Frontend frameworks, UI/UX design, API integration, and modern development tools'
    },
    { 
      id: 'certifications',
      labelKey: 'certificationsCount' as const,
      value: '12', 
      icon: Award, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: '+2',
      trend: 'up' as const,
      description: 'Professional certs',
      details: 'Meta Frontend Developer, Angular certifications, and various online courses'
    }
  ].map(stat => ({ ...stat, label: t(stat.labelKey) }))

  const activityFeed = [
    { type: 'project', action: 'Updated', item: 'Aurex Analytics Platform', time: '2 hours ago', icon: FolderOpen, color: 'text-purple-400', verified: true },
    { type: 'skill', action: 'Added', item: 'Next.js 14', time: '1 day ago', icon: Code, color: 'text-blue-400', verified: true },
    { type: 'achievement', action: 'Earned', item: 'Meta Frontend Developer Certificate', time: '3 days ago', icon: Trophy, color: 'text-yellow-400', verified: true },
    { type: 'project', action: 'Completed', item: 'E-commerce Dashboard', time: '1 week ago', icon: FolderOpen, color: 'text-green-400', verified: true },
    { type: 'certification', action: 'Completed', item: 'Angular Advanced Patterns', time: '2 weeks ago', icon: Award, color: 'text-orange-400', verified: false },
  ]

  const insights = [
    { label: 'Primary Focus', value: 'Frontend Development', icon: Target, color: 'text-blue-400', change: '+15%' },
    { label: 'Top Skill', value: 'Angular', icon: Star, color: 'text-yellow-400', change: '+5' },
    { label: 'Latest Project', value: 'Aurex Analytics', icon: FolderOpen, color: 'text-purple-400', change: 'Active' },
    { label: 'Availability', value: 'Open to Opportunities', icon: Calendar, color: 'text-green-400', change: 'Now' },
    { label: 'Response Time', value: '< 24 hours', icon: Clock, color: 'text-cyan-400', change: 'Fast' },
    { label: 'Client Satisfaction', value: '98%', icon: ThumbsUp, color: 'text-pink-400', change: '+2%' },
  ]

  const keyboardShortcuts = [
    { keys: '⌘K', description: 'Open Command Palette', action: () => setShowCommandPalette(true) },
    { keys: '⌘S', description: 'Go to Skills', action: () => setActiveMenuItem('skills') },
    { keys: '⌘P', description: 'Go to Projects', action: () => setActiveMenuItem('project') },
    { keys: '⌘E', description: 'Go to Experience', action: () => setActiveMenuItem('experience') },
    { keys: '⌘M', description: 'Go to Social Media', action: () => setActiveMenuItem('social-medias') },
    { keys: '/', description: 'Focus Search', action: () => searchInputRef.current?.focus() },
    { keys: 'Esc', description: 'Close Dialogs', action: () => {} },
  ]

  const personalInfo = [
    { icon: Mail, label: 'Email', value: 'ajaykj2000@gmail.com', action: () => window.location.href = 'mailto:ajaykj2000@gmail.com', copyable: true },
    { icon: Phone, label: 'Phone', value: '+91 82899 17044', action: () => window.location.href = 'tel:+918289917044', copyable: true },
    { icon: MapPin, label: 'Location', value: 'Kerala, India', action: null, copyable: false },
    { icon: Calendar, label: 'Available', value: 'Open to Opportunities', action: null, copyable: false },
  ]

  const socialQuickLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/Ajay-k-jayan', color: 'hover:text-white', followers: '50+', verified: true },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/ajay-k-jayan-4a55b1224/', color: 'hover:text-blue-400', followers: '500+', verified: true },
  ]

  const commandPaletteCommands = [
    { id: 'skills', label: 'Go to Skills', icon: Code, action: () => { setActiveMenuItem('skills'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘S' },
    { id: 'projects', label: 'Go to Projects', icon: FolderOpen, action: () => { setActiveMenuItem('project'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘P' },
    { id: 'experience', label: 'Go to Experience', icon: Briefcase, action: () => { setActiveMenuItem('experience'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘E' },
    { id: 'achievements', label: 'Go to Achievements', icon: Award, action: () => { setActiveMenuItem('achievement'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘A' },
    { id: 'certifications', label: 'Go to Certifications', icon: Trophy, action: () => { setActiveMenuItem('certifications'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘C' },
    { id: 'social', label: 'Go to Social Media', icon: Share2, action: () => { setActiveMenuItem('social-medias'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘M' },
    { id: 'blogs', label: 'Go to Blogs', icon: BookOpen, action: () => { setActiveMenuItem('blogs'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘B' },
    { id: 'settings', label: 'Open Settings', icon: Settings, action: () => { setActiveMenuItem('settings'); setShowCommandPalette(false) }, category: 'Navigation', shortcut: '⌘,' },
    { id: 'download-resume', label: 'Download Resume', icon: Download, action: () => {
      const link = document.createElement('a')
      link.href = '/resume.pdf'
      link.download = 'Ajay_K_J_Resume.pdf'
      link.click()
      addNotification({ title: 'Resume Download', message: 'Resume download started', type: 'info' })
      setTimeout(() => {
        addNotification({ title: 'Resume Download Complete', message: 'Resume download completed', type: 'success' })
      }, 2000)
      setShowCommandPalette(false)
    }, category: 'Actions' },
  ]

  const filteredCommands = commandPaletteCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredActions = sortedActions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    addNotification({
      title: 'Copied',
      message: `${label} copied to clipboard`,
      type: 'success'
    })
  }

  const handleStatClick = (statId: string) => {
    if (selectedStat === statId) {
      setSelectedStat(null)
      setShowStatsDetails(false)
    } else {
      setSelectedStat(statId)
      setShowStatsDetails(true)
    }
  }

  return (
    <div className="w-full h-full bg-vscode-bg text-vscode-text overflow-auto relative">
      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              onClick={() => setShowCommandPalette(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-[201]"
            >
              <div 
                className="rounded-lg border shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <Search size={18} style={{ color: currentTheme.colors.textSecondary }} />
                  <input
                    ref={commandPaletteInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: currentTheme.colors.text }}
                    autoFocus
                  />
                  <div className="flex items-center gap-2 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    <kbd className="px-2 py-1 rounded bg-vscode-active border border-vscode-border">⌘K</kbd>
                    <span>to close</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredCommands.length > 0 ? (
                    <div className="p-2">
                      {filteredCommands.map((cmd, index) => {
                        const Icon = cmd.icon
                        return (
                          <motion.button
                            key={cmd.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={cmd.action}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-vscode-active rounded text-left transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Icon size={18} className="text-vscode-text-secondary group-hover:text-vscode-blue flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm text-vscode-text">{cmd.label}</div>
                                <div className="text-xs text-vscode-text-secondary">{cmd.category}</div>
                              </div>
                            </div>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 rounded bg-vscode-border text-xs text-vscode-text-secondary font-mono">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-vscode-text-secondary">No commands found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Hero Section - Advanced Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div 
            className="rounded-lg p-8 relative overflow-hidden border"
            style={{
              backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
              borderColor: currentTheme.colors.border,
            }}
          >
            {/* Animated Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, ${currentTheme.colors.text} 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} 
            />
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.blue || '#007acc'}05 0%, transparent 50%, ${currentTheme.colors.purple || '#c586c0'}05 100%)`,
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <motion.div 
                    className="p-4 rounded-lg border relative overflow-hidden"
                    style={{
                      backgroundColor: `${currentTheme.colors.blue || '#007acc'}20`,
                      borderColor: `${currentTheme.colors.blue || '#007acc'}40`,
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Home className="text-vscode-blue" size={32} />
                    <div className="absolute inset-0 bg-gradient-to-br from-vscode-blue/20 to-transparent opacity-50" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold text-vscode-text mb-2 leading-tight">
                      {t('welcomeTitle')}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <motion.span 
                        className="px-3 py-1.5 text-sm rounded-full border font-medium"
                        style={{
                          backgroundColor: `${currentTheme.colors.blue || '#007acc'}20`,
                          borderColor: `${currentTheme.colors.blue || '#007acc'}40`,
                          color: currentTheme.colors.blue || '#007acc',
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Software Engineer
                      </motion.span>
                      <motion.span 
                        className="px-3 py-1.5 text-sm rounded-full border font-medium"
                        style={{
                          backgroundColor: `${currentTheme.colors.purple || '#c586c0'}20`,
                          borderColor: `${currentTheme.colors.purple || '#c586c0'}40`,
                          color: currentTheme.colors.purple || '#c586c0',
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Front-End Developer
                      </motion.span>
                      <motion.span 
                        className="px-3 py-1.5 text-sm rounded-full border font-medium"
                        style={{
                          backgroundColor: `${currentTheme.colors.green || '#4ec9b0'}20`,
                          borderColor: `${currentTheme.colors.green || '#4ec9b0'}40`,
                          color: currentTheme.colors.green || '#4ec9b0',
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Open to Opportunities
                      </motion.span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowCommandPalette(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg transition-colors group"
                  title="Open Command Palette (⌘K)"
                >
                  <Command size={16} className="text-vscode-text-secondary group-hover:text-vscode-blue" />
                  <span className="text-sm text-vscode-text-secondary group-hover:text-vscode-text">⌘K</span>
                </motion.button>
              </div>
              
              <p className="text-base text-vscode-text-secondary max-w-3xl leading-relaxed mb-6">
                {t('welcomeSubtitle')}
              </p>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={() => setActiveMenuItem('social-medias')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-vscode-blue/20"
                >
                  <MessageSquare size={18} />
                  <span>{t('getInTouch')}</span>
                </motion.button>
                {portfolioSettings.showResumeDownload && (
                  <motion.button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = '/resume.pdf'
                      link.download = 'Ajay_K_J_Resume.pdf'
                      link.click()
                      addNotification({ title: 'Resume Download', message: 'Resume download started', type: 'info' })
                      setTimeout(() => {
                        addNotification({ title: 'Resume Download Complete', message: 'Resume download completed', type: 'success' })
                      }, 2000)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={18} />
                    <span>{t('downloadResume')}</span>
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setActiveMenuItem('project')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg text-sm font-medium transition-colors"
                >
                  <FolderOpen size={18} />
                  <span>{t('viewProjects')}</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('shortcuts')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg text-sm font-medium transition-colors"
                  title="Keyboard Shortcuts"
                >
                  <Keyboard size={18} />
                  <span>{t('shortcuts')}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Advanced with Trends and Details */}
        {portfolioSettings.showStats && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-vscode-blue" size={20} />
                <h2 className="text-xl font-semibold text-vscode-text">Statistics</h2>
              </div>
              <button
                onClick={() => setShowStatsDetails(!showStatsDetails)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-vscode-text-secondary hover:text-vscode-text hover:bg-vscode-active rounded transition-colors"
              >
                {showStatsDetails ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{showStatsDetails ? 'Hide Details' : 'Show Details'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                const isSelected = selectedStat === stat.id
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleStatClick(stat.id)}
                    className={`rounded-lg p-5 border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected ? 'border-vscode-blue ring-2 ring-vscode-blue/50' : 'border-vscode-border hover:border-vscode-blue'
                    }`}
                    style={{
                      backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                  >
                    {/* Background gradient on hover */}
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${stat.bgColor}`}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                          <Icon className={`${stat.color}`} size={22} />
                        </div>
                        {stat.trend && (
                          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                            stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            <span>{stat.change}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-3xl font-bold text-vscode-text mb-1">{stat.value}</div>
                      <div className="text-xs text-vscode-text-secondary mb-1">{stat.label}</div>
                      <div className="text-[10px] text-vscode-text-secondary/70">{stat.description}</div>
                      
                      {/* Expanded Details */}
                      {isSelected && showStatsDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-vscode-border"
                        >
                          <p className="text-xs text-vscode-text-secondary leading-relaxed">{stat.details}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs for Overview/Activity/Insights/Shortcuts */}
        <div className="mb-6">
          <div className="flex items-center gap-2 border-b border-vscode-border overflow-x-auto">
            {(['overview', 'activity', 'insights', 'shortcuts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-vscode-blue'
                    : 'text-vscode-text-secondary hover:text-vscode-text'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-vscode-blue"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start Section */}
            <div 
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                borderColor: currentTheme.colors.border,
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-vscode-active" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center gap-2">
                  <Rocket className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">{t('quickStart').toUpperCase()}</span>
                  <span className="px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue text-xs rounded-full">
                    {filteredActions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={14} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-1.5 bg-vscode-bg border border-vscode-border rounded text-xs text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue w-40"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 border border-vscode-border rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-vscode-blue text-white' : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'}`}
                      title="Grid View"
                    >
                      <Grid3x3 size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-vscode-blue text-white' : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'}`}
                      title="List View"
                    >
                      <List size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 transition-colors ${viewMode === 'compact' ? 'bg-vscode-blue text-white' : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'}`}
                      title="Compact View"
                    >
                      <Layers size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSection('start')}
                    className="p-1.5 hover:bg-vscode-hover rounded transition-colors"
                  >
                    {expandedSections.has('start') ? (
                      <ChevronDown className="text-vscode-text-secondary" size={16} />
                    ) : (
                      <ChevronRight className="text-vscode-text-secondary" size={16} />
                    )}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expandedSections.has('start') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3 p-4' : viewMode === 'compact' ? 'grid grid-cols-4 gap-2 p-4' : 'p-4 space-y-2'}>
                      {filteredActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                          <motion.button
                            key={action.id}
                            onClick={action.action}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className={`group text-left transition-all relative ${
                              viewMode === 'grid'
                                ? 'p-4 bg-vscode-active rounded-lg border border-vscode-border hover:border-vscode-blue hover:bg-vscode-hover'
                                : viewMode === 'compact'
                                ? 'p-3 bg-vscode-active rounded border border-vscode-border hover:border-vscode-blue hover:bg-vscode-hover flex flex-col items-center justify-center'
                                : 'w-full flex items-center gap-3 px-3 py-2.5 hover:bg-vscode-active rounded'
                            }`}
                            whileHover={{ x: viewMode === 'list' ? 2 : 0, scale: viewMode !== 'list' ? 1.02 : 1 }}
                          >
                            {action.pinned && (
                              <div className="absolute top-2 right-2 z-10">
                                <Pin size={12} className="text-vscode-blue" fill="currentColor" />
                              </div>
                            )}
                            {action.hot && (
                              <div className="absolute top-2 left-2 z-10">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="w-2 h-2 bg-red-500 rounded-full"
                                />
                              </div>
                            )}
                            <div className={viewMode === 'compact' ? 'flex flex-col items-center gap-2' : viewMode === 'grid' ? 'mb-3' : ''}>
                              <div className={`p-2 rounded-lg ${action.bgColor} ${viewMode === 'compact' ? 'w-10 h-10' : ''} flex items-center justify-center`}>
                                <Icon size={viewMode === 'compact' ? 20 : viewMode === 'grid' ? 24 : 18} className={`${action.color} flex-shrink-0`} />
                              </div>
                            </div>
                            <div className={`flex-1 min-w-0 ${viewMode === 'compact' ? 'text-center' : ''}`}>
                              <div className={`flex items-center gap-2 mb-1 ${viewMode === 'compact' ? 'justify-center flex-col' : ''}`}>
                                <span className={`${viewMode === 'compact' ? 'text-xs' : viewMode === 'grid' ? 'text-sm' : 'text-sm'} font-medium text-vscode-text group-hover:text-vscode-blue transition-colors line-clamp-1`}>
                                  {action.label}
                                </span>
                                {action.badge && viewMode !== 'compact' && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-vscode-blue/20 text-vscode-blue rounded-full">
                                    {action.badge}
                                  </span>
                                )}
                              </div>
                              {viewMode !== 'compact' && (
                                <>
                                  <div className={`${viewMode === 'grid' ? 'text-xs' : 'text-xs'} text-vscode-text-secondary line-clamp-2 mb-1`}>
                                    {action.description}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-vscode-border rounded text-vscode-text-secondary">
                                      {action.category}
                                    </span>
                                    {action.shortcut && (
                                      <kbd className="text-[10px] px-1.5 py-0.5 bg-vscode-border rounded text-vscode-text-secondary font-mono">
                                        {action.shortcut}
                                      </kbd>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            {viewMode === 'list' && (
                              <ArrowRight size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePin(action.id)
                              }}
                              className={`absolute ${viewMode === 'compact' ? 'top-1 right-1' : 'top-2 right-2'} p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-vscode-hover rounded`}
                            >
                              {action.pinned ? (
                                <PinOff size={12} className="text-vscode-text-secondary" />
                              ) : (
                                <Pin size={12} className="text-vscode-text-secondary" />
                              )}
                            </button>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent Items Section */}
            {portfolioSettings.showRecentItems && activeTab === 'overview' && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <button
                  onClick={() => toggleSection('recent')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('recent').toUpperCase()}</span>
                    <span className="px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue text-xs rounded-full">
                      {recentItems.length}
                    </span>
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
                      <div className="p-4 space-y-2">
                        {recentItems.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.button
                              key={index}
                              onClick={item.action}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="group w-full flex items-center gap-3 px-3 py-2.5 hover:bg-vscode-active rounded text-left transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              <Icon size={16} className="text-vscode-text-secondary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-sm text-vscode-text group-hover:text-vscode-blue transition-colors">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] text-vscode-text-secondary ml-2">{item.time}</span>
                                </div>
                                <div className="text-xs text-vscode-text-secondary line-clamp-1">
                                  {item.path}
                                </div>
                              </div>
                              <ArrowRight size={12} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Activity Feed Section */}
            {activeTab === 'activity' && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <Activity className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('activity').toUpperCase()} FEED</span>
                    <span className="px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue text-xs rounded-full">
                      {activityFeed.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {activityFeed.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-vscode-active rounded-lg border border-vscode-border hover:border-vscode-blue transition-colors group"
                      >
                        <div className={`p-2 rounded-lg ${activity.verified ? 'bg-green-500/20' : 'bg-vscode-sidebar'}`}>
                          <Icon size={16} className={activity.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-vscode-text font-medium">{activity.action}</span>
                            <span className="text-sm text-vscode-text">{activity.item}</span>
                            {activity.verified && (
                              <CheckCircle2 size={12} className="text-green-400" fill="currentColor" />
                            )}
                          </div>
                          <div className="text-xs text-vscode-text-secondary">{activity.time}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Insights Section */}
            {activeTab === 'insights' && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('insights').toUpperCase()} & ANALYTICS</span>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="p-4 bg-vscode-active rounded-lg border border-vscode-border hover:border-vscode-blue transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={insight.color} />
                            <span className="text-xs text-vscode-text-secondary">{insight.label}</span>
                          </div>
                          {insight.change && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                              {insight.change}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-vscode-text">{insight.value}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts Section */}
            {activeTab === 'shortcuts' && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <Keyboard className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('shortcuts').toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-vscode-active rounded-lg border border-vscode-border hover:border-vscode-blue transition-colors group"
                    >
                      <span className="text-sm text-vscode-text">{shortcut.description}</span>
                      <kbd className="px-2 py-1 rounded bg-vscode-border text-xs text-vscode-text-secondary font-mono">
                        {shortcut.keys}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information Section */}
            {activeTab === 'overview' && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <User className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('contactInformation').toUpperCase()}</span>
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
                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded transition-colors ${
                          info.action ? 'hover:bg-vscode-active cursor-pointer' : ''
                        }`}
                        onClick={info.action || undefined}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Icon size={16} className="text-vscode-text-secondary flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-vscode-text-secondary mb-0.5">{info.label}</div>
                            <div className="text-sm text-vscode-text">{info.value}</div>
                          </div>
                        </div>
                        {info.copyable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(info.value, info.label)
                            }}
                            className="p-1.5 hover:bg-vscode-hover rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy to clipboard"
                          >
                            <Copy size={14} className="text-vscode-text-secondary" />
                          </button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Features Panel */}
            <div 
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                borderColor: currentTheme.colors.border,
              }}
            >
              <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('features').toUpperCase()}</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { icon: Rocket, title: 'Get Started', desc: 'Explore skills and projects', color: 'text-blue-400', badge: null },
                  { icon: Lightbulb, title: 'Learn Skills', desc: 'Discover technologies', color: 'text-yellow-400', badge: null },
                  { icon: GitBranch, title: 'View Projects', desc: 'Check real-world work', color: 'text-green-400', badge: 'Featured' },
                  { icon: Sparkles, title: 'AI Assistant', desc: 'Chat with AI', color: 'text-purple-400', badge: 'New' },
                  { icon: Command, title: 'Command Palette', desc: 'Press ⌘K to open', color: 'text-cyan-400', badge: '⌘K' },
                  { icon: Keyboard, title: 'Shortcuts', desc: 'View all shortcuts', color: 'text-orange-400', badge: null },
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative p-3 bg-vscode-active rounded-lg border border-vscode-border hover:border-vscode-blue transition-all cursor-pointer group"
                      onClick={() => {
                        if (feature.title === 'Command Palette') setShowCommandPalette(true)
                        if (feature.title === 'View Projects') setActiveMenuItem('project')
                        if (feature.title === 'Shortcuts') setActiveTab('shortcuts')
                      }}
                    >
                      {feature.badge && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-vscode-blue text-white text-[10px] rounded font-medium">
                          {feature.badge}
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded ${feature.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                          <Icon size={16} className={feature.color} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xs font-semibold text-vscode-text mb-0.5 group-hover:text-vscode-blue transition-colors">
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
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <Share2 className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('quickLinks').toUpperCase()}</span>
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
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-vscode-active rounded transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className="text-vscode-text-secondary group-hover:text-vscode-blue transition-colors" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-vscode-text group-hover:text-vscode-blue transition-colors">{social.label}</span>
                              {social.verified && (
                                <CheckCircle2 size={12} className="text-green-400" fill="currentColor" />
                              )}
                            </div>
                            {social.followers && (
                              <div className="text-[10px] text-vscode-text-secondary">{social.followers} followers</div>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={12} className="text-vscode-text-secondary group-hover:text-vscode-blue opacity-0 group-hover:opacity-100 transition-all" />
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
              <div 
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="px-4 py-3 bg-vscode-active border-b" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="flex items-center gap-2">
                    <FileText className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">{t('resume').toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-4">
                  <motion.button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = '/resume.pdf'
                      link.download = 'Ajay_K_J_Resume.pdf'
                      link.click()
                      addNotification({ title: 'Resume Download', message: 'Resume download started', type: 'info' })
                      setTimeout(() => {
                        addNotification({ title: 'Resume Download Complete', message: 'Resume download completed', type: 'success' })
                      }, 2000)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-vscode-blue/20"
                  >
                    <Download size={18} />
                    <span>{t('downloadResume')}</span>
                  </motion.button>
                  <p className="text-xs text-vscode-text-secondary mt-2 text-center">
                    PDF • Updated recently
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
