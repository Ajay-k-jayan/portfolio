'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Search, X, FileText, Code, Briefcase, BookOpen, Trophy, Award, Mail, MessageSquare, Mic, Sparkles, User, MapPin, Phone, Github, Linkedin, Calendar, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'
import { portfolioData } from '@/lib/portfolio-data'

interface SearchResult {
  id: string
  type: 'project' | 'skill' | 'blog' | 'page' | 'experience' | 'achievement' | 'certification' | 'contact' | 'chat' | 'voice' | 'education'
  title: string
  description?: string
  url?: string
  metadata?: Record<string, any>
}

const typeIcons = {
  project: Briefcase,
  skill: Code,
  blog: BookOpen,
  page: FileText,
  experience: Building2,
  achievement: Trophy,
  certification: Award,
  contact: Mail,
  chat: MessageSquare,
  voice: Mic,
  education: BookOpen,
}

const typeLabels = {
  project: 'Project',
  skill: 'Skill',
  blog: 'Blog',
  page: 'Page',
  experience: 'Experience',
  achievement: 'Achievement',
  certification: 'Certification',
  contact: 'Contact',
  chat: 'AI Chat',
  voice: 'Voice Assistant',
  education: 'Education',
}

// Blog posts data (from blog-system.tsx)
const blogPosts = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'building-modern-web-apps-nextjs-14',
    excerpt: 'Exploring the latest features in Next.js 14 and how they revolutionize web development.',
    tags: ['Next.js', 'React', 'Web Development'],
  },
  {
    id: '2',
    title: 'Mastering TypeScript: Advanced Patterns and Techniques',
    slug: 'mastering-typescript-advanced-patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns that every developer should know.',
    tags: ['TypeScript', 'Programming'],
  },
]

// Skills data (from skills-tab.tsx - simplified for search)
const skillCategories = [
  {
    name: 'FRONTEND LANGUAGES',
    skills: [
      { id: 'javascript', name: 'JavaScript', description: 'Core web development language — ES6+, async programming, and modern patterns', category: 'Frontend Language', level: 90, years: '4+', tags: ['frontend', 'javascript', 'es6'] },
      { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript development — Strong typing, interfaces, and modern ES6+ features', category: 'Frontend Language', level: 88, years: '3+', tags: ['typescript', 'typing', 'javascript'] },
      { id: 'html', name: 'HTML', description: 'Semantic markup and modern web standards — Accessibility and SEO optimization', category: 'Frontend Language', level: 95, years: '4+', tags: ['html', 'markup', 'semantic'] },
      { id: 'css', name: 'CSS', description: 'Advanced styling and animations — Flexbox, Grid, and responsive design', category: 'Frontend Language', level: 92, years: '4+', tags: ['css', 'styling', 'responsive'] },
      { id: 'angular', name: 'Angular', description: 'Frontend framework — Building scalable applications with reactive forms, routing, and state management', category: 'Frontend Framework', level: 92, years: '3+', tags: ['angular', 'framework', 'typescript'] },
      { id: 'react', name: 'React', description: 'Frontend library — Component-based UI development and state management', category: 'Frontend Library', level: 85, years: '2+', tags: ['react', 'frontend', 'components'] },
      { id: 'nextjs', name: 'Next.js', description: 'React framework — Server-side rendering, static site generation, and full-stack development', category: 'Frontend Framework', level: 82, years: '2+', tags: ['nextjs', 'react', 'ssr', 'fullstack'] },
    ],
  },
]

// Build comprehensive search index
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  // Projects - Enhanced with complete details
  portfolioData.projects.forEach((project) => {
    results.push({
      id: `project-${project.id}`,
      type: 'project',
      title: project.name || project.title,
      description: `${project.description} | Duration: ${project.period} | Technologies: ${project.technologies?.join(', ') || 'N/A'}`,
      url: '#project',
      metadata: {
        technologies: project.technologies,
        period: project.period,
        name: project.name || project.title,
        description: project.description,
        features: [
          'Cloud-based analytics platform',
          'Risk and audit management integration',
          'Real-time data processing with WebSockets',
          'Advanced reporting capabilities',
          'Responsive UI with Angular Material',
          'Interactive data visualizations using D3.js',
          'Modular component architecture',
          'Performance optimizations'
        ],
        challenges: [
          'Complex data visualization requirements',
          'Real-time communication implementation',
          'Modular component development',
          'Performance optimization',
          'Custom reporting logic'
        ],
        outcomes: [
          'Production-ready platform delivery',
          'Improved data processing efficiency',
          'Enhanced user experience',
          'Contributed to business growth'
        ]
      },
    })
    
    // Add individual technology searches for each project
    project.technologies?.forEach((tech) => {
      results.push({
        id: `project-${project.id}-tech-${tech.toLowerCase()}`,
        type: 'project',
        title: `${tech} in ${project.name || project.title}`,
        description: `${tech} is used in ${project.name || project.title} for ${getTechUsageInProject(tech)}`,
        url: '#project',
        metadata: {
          technology: tech,
          projectName: project.name || project.title,
          projectId: project.id,
        },
      })
    })
    
    // Add feature searches
    const features = [
      'Cloud-based analytics',
      'Risk management',
      'Audit management',
      'Real-time processing',
      'Data visualization',
      'WebSockets',
      'Reporting',
      'Angular Material'
    ]
    features.forEach((feature) => {
      results.push({
        id: `project-${project.id}-feature-${feature.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'project',
        title: `${feature} - ${project.name || project.title}`,
        description: `${feature} feature in ${project.name || project.title}`,
        url: '#project',
        metadata: {
          feature: feature,
          projectName: project.name || project.title,
          projectId: project.id,
        },
      })
    })
  })
  
  // Helper function for tech usage
  function getTechUsageInProject(tech: string): string {
    const usage: Record<string, string> = {
      'Angular': 'component-based frontend architecture and state management',
      'TypeScript': 'type-safe development and modern features',
      'D3.js': 'interactive data visualizations and charts',
      'WebSockets': 'real-time bidirectional communication',
      'Next.js': 'server-side rendering and API routes',
      'Tailwind CSS': 'utility-first styling and responsive design',
      'RxJS': 'reactive programming and observables'
    }
    return usage[tech] || 'core functionality'
  }

  // Experience
  portfolioData.experience.forEach((exp) => {
    results.push({
      id: `exp-${exp.id}`,
      type: 'experience',
      title: `${exp.title} at ${exp.company}`,
      description: `${exp.period} - ${exp.location}. ${exp.achievements?.join(' ')}`,
      url: '#experience',
      metadata: {
        company: exp.company,
        period: exp.period,
        location: exp.location,
        achievements: exp.achievements,
      },
    })
  })

  // Achievements
  portfolioData.achievements.forEach((achievement) => {
    results.push({
      id: `achievement-${achievement.name}`,
      type: 'achievement',
      title: achievement.name,
      description: `${achievement.description} - ${achievement.issuer} (${achievement.date})`,
      url: achievement.url || '#achievement',
      metadata: {
        issuer: achievement.issuer,
        date: achievement.date,
        description: achievement.description,
      },
    })
  })

  // Certifications
  portfolioData.certifications.forEach((cert) => {
    results.push({
      id: `cert-${cert.name}`,
      type: 'certification',
      title: cert.name,
      description: `${cert.issuer} - ${cert.date}`,
      url: cert.url || '#certifications',
      metadata: {
        issuer: cert.issuer,
        date: cert.date,
      },
    })
  })

  // Education
  results.push({
    id: 'education-1',
    type: 'education',
    title: portfolioData.education.degree,
    description: `${portfolioData.education.institution} - ${portfolioData.education.period} (${portfolioData.education.location})`,
    url: '#about',
    metadata: {
      institution: portfolioData.education.institution,
      period: portfolioData.education.period,
      location: portfolioData.education.location,
    },
  })

  // Profile/Contact Info
  results.push({
    id: 'contact-email',
    type: 'contact',
    title: 'Email',
    description: portfolioData.profile.email,
    url: `mailto:${portfolioData.profile.email}`,
    metadata: { type: 'email', value: portfolioData.profile.email },
  })

  results.push({
    id: 'contact-phone',
    type: 'contact',
    title: 'Phone',
    description: portfolioData.profile.phone,
    url: `tel:${portfolioData.profile.phone.replace(/\s/g, '')}`,
    metadata: { type: 'phone', value: portfolioData.profile.phone },
  })

  results.push({
    id: 'contact-linkedin',
    type: 'contact',
    title: 'LinkedIn',
    description: 'Connect on LinkedIn',
    url: portfolioData.profile.linkedin,
    metadata: { type: 'linkedin', value: portfolioData.profile.linkedin },
  })

  results.push({
    id: 'contact-github',
    type: 'contact',
    title: 'GitHub',
    description: 'View GitHub profile',
    url: portfolioData.profile.github,
    metadata: { type: 'github', value: portfolioData.profile.github },
  })

  results.push({
    id: 'contact-location',
    type: 'contact',
    title: 'Location',
    description: portfolioData.profile.location,
    url: '#contact',
    metadata: { type: 'location', value: portfolioData.profile.location },
  })

  // Skills
  skillCategories.forEach((category) => {
    category.skills.forEach((skill) => {
      results.push({
        id: `skill-${skill.id}`,
        type: 'skill',
        title: skill.name,
        description: `${skill.description} - Level: ${skill.level}% (${skill.years})`,
        url: '#skills',
        metadata: {
          category: category.name,
          level: skill.level,
          years: skill.years,
          tags: skill.tags,
        },
      })
    })
  })

  // Blog Posts
  blogPosts.forEach((post) => {
    results.push({
      id: `blog-${post.id}`,
      type: 'blog',
      title: post.title,
      description: `${post.excerpt} Tags: ${post.tags.join(', ')}`,
      url: '#blogs',
      metadata: {
        slug: post.slug,
        tags: post.tags,
      },
    })
  })

  // Pages
  results.push({
    id: 'page-welcome',
    type: 'page',
    title: 'Welcome',
    description: 'Portfolio welcome page',
    url: '#welcome',
  })

  results.push({
    id: 'page-about',
    type: 'page',
    title: 'About Me',
    description: `${portfolioData.profile.bio}`,
    url: '#about',
    metadata: {
      name: portfolioData.profile.name,
      title: portfolioData.profile.title,
      company: portfolioData.profile.company,
      experience: portfolioData.profile.experience,
    },
  })

  // AI Chat
  results.push({
    id: 'feature-chat',
    type: 'chat',
    title: 'AI Chat Assistant',
    description: 'Interactive AI assistant for portfolio navigation and questions',
    url: '#chat',
    metadata: { feature: 'ai-chatbot' },
  })

  // Voice Assistant
  results.push({
    id: 'feature-voice',
    type: 'voice',
    title: 'Voice Assistant',
    description: 'Hands-free navigation using speech recognition and voice commands',
    url: '#voice',
    metadata: { feature: 'voice-assistant' },
  })

  return results
}

// Popular search suggestions
const popularSuggestions = [
  { text: 'Aurex Project', type: 'project', icon: Briefcase },
  { text: 'Angular', type: 'skill', icon: Code },
  { text: 'Work Experience', type: 'experience', icon: Building2 },
  { text: 'Contact Information', type: 'contact', icon: Mail },
  { text: 'Download Resume', type: 'page', icon: FileText },
  { text: 'Skills', type: 'skill', icon: Code },
  { text: 'Projects', type: 'project', icon: Briefcase },
  { text: 'Achievements', type: 'achievement', icon: Trophy },
]

// Quick action suggestions
const quickActions = [
  { text: 'Open AI Assistant', type: 'chat', icon: Sparkles, action: () => window.dispatchEvent(new CustomEvent('openChat')) },
  { text: 'Voice Assistant', type: 'voice', icon: Mic, action: () => (window as any).triggerVoiceAssistant?.() },
  { text: 'View LinkedIn', type: 'contact', icon: Linkedin, action: () => window.open(portfolioData.profile.linkedin, '_blank') },
  { text: 'View GitHub', type: 'contact', icon: Github, action: () => window.open(portfolioData.profile.github, '_blank') },
]

export function EnhancedSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<typeof popularSuggestions>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  const { setActiveMenuItem, addNotification } = useAppStore()

  // Build search index once
  const searchIndex = useMemo(() => buildSearchIndex(), [])

  // Generate intelligent suggestions based on query - only when there's a query
  const generateSuggestions = useCallback((searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    const lower = searchTerm.toLowerCase()
    const matched: typeof popularSuggestions = []

    // Match popular suggestions that are related to the query
    popularSuggestions.forEach(suggestion => {
      if (suggestion.text.toLowerCase().includes(lower) || lower.includes(suggestion.text.toLowerCase().split(' ')[0])) {
        matched.push(suggestion)
      }
    })

    // Match quick actions that are related
    quickActions.forEach(action => {
      if (action.text.toLowerCase().includes(lower) || lower.includes('ai') || lower.includes('voice') || lower.includes('linkedin') || lower.includes('github')) {
        if (action.text.toLowerCase().includes(lower) || 
            (lower.includes('ai') && action.text.includes('AI')) ||
            (lower.includes('voice') && action.text.includes('Voice')) ||
            (lower.includes('linkedin') && action.text.includes('LinkedIn')) ||
            (lower.includes('github') && action.text.includes('GitHub'))) {
          matched.push({ text: action.text, type: action.type as any, icon: action.icon })
        }
      }
    })

    // Generate smart suggestions from search index - only related items
    const indexMatches = searchIndex
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lower)
        const descMatch = item.description?.toLowerCase().includes(lower)
        const metadataMatch = item.metadata && Object.values(item.metadata).some((value) => {
          if (Array.isArray(value)) {
            return value.some((v) => String(v).toLowerCase().includes(lower))
          }
          return String(value).toLowerCase().includes(lower)
        })
        return titleMatch || descMatch || metadataMatch
      })
      .slice(0, 6)
      .map(item => ({
        text: item.title,
        type: item.type,
        icon: typeIcons[item.type] || FileText
      }))

    matched.push(...indexMatches)

    // Remove duplicates and limit
    const unique = Array.from(new Map(matched.map(s => [s.text, s])).values())
    setSuggestions(unique.slice(0, 8))
  }, [searchIndex])

  // Search function with improved relevance scoring
  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      
      // Generate suggestions
      generateSuggestions(searchTerm)
      
      // Calculate relevance scores for better ranking
      const scored = searchIndex.map((item) => {
        let score = 0
        const titleLower = item.title.toLowerCase()
        const descLower = item.description?.toLowerCase() || ''
        
        // Exact title match (highest priority)
        if (titleLower === searchTerm) score += 100
        // Title starts with query
        else if (titleLower.startsWith(searchTerm)) score += 50
        // Title contains query
        else if (titleLower.includes(searchTerm)) score += 30
        
        // Description contains query
        if (descLower.includes(searchTerm)) score += 10
        
        // Metadata matches
        if (item.metadata) {
          Object.values(item.metadata).forEach((value) => {
            if (Array.isArray(value)) {
              if (value.some((v) => String(v).toLowerCase().includes(searchTerm))) score += 15
            } else if (String(value).toLowerCase().includes(searchTerm)) {
              score += 5
            }
          })
        }
        
        // Project features, challenges, outcomes (high relevance)
        if (item.metadata?.features?.some((f: string) => f.toLowerCase().includes(searchTerm))) score += 20
        if (item.metadata?.challenges?.some((c: string) => c.toLowerCase().includes(searchTerm))) score += 20
        if (item.metadata?.outcomes?.some((o: string) => o.toLowerCase().includes(searchTerm))) score += 20
        
        // Tags match
        if (item.metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))) score += 15
        
        // Type priority (projects and skills are more important)
        if (item.type === 'project') score += 5
        if (item.type === 'skill') score += 5
        
        return { item, score }
      })

      // Filter and sort by score
      const filtered = scored
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)

      setResults(filtered.slice(0, 12)) // Increased to 12 results
    } else {
      setResults([])
      setSuggestions([])
    }
    setSelectedIndex(-1)
  }, [query, searchIndex, generateSuggestions])

  const handleResultClick = useCallback((result: SearchResult) => {
    // Handle different result types
    if (result.type === 'chat') {
      // Trigger chat via custom event
      const event = new CustomEvent('openChat')
      window.dispatchEvent(event)
      addNotification({
        title: 'AI Chat',
        message: 'Opening AI Chat Assistant',
        type: 'info',
      })
    } else if (result.type === 'voice') {
      // Trigger voice assistant
      const trigger = (window as any).triggerVoiceAssistant
      if (trigger) {
        trigger()
      } else {
        addNotification({
          title: 'Voice Assistant',
          message: 'Voice assistant is available. Click the microphone icon to activate.',
          type: 'info',
        })
      }
    } else if (result.url?.startsWith('mailto:') || result.url?.startsWith('tel:')) {
      window.location.href = result.url
    } else if (result.url?.startsWith('http')) {
      window.open(result.url, '_blank', 'noopener noreferrer')
    } else if (result.url?.startsWith('#')) {
      // Navigate to internal page
      const menuItem = result.url.substring(1)
      const menuMap: Record<string, string> = {
        'project': 'project',
        'skills': 'skills',
        'experience': 'experience',
        'achievement': 'achievement',
        'certifications': 'certifications',
        'blogs': 'blogs',
        'contact': 'contact',
        'about': 'welcome',
        'welcome': 'welcome',
      }
      
      const targetMenuItem = menuMap[menuItem] || menuItem
      setActiveMenuItem(targetMenuItem)
      
      addNotification({
        title: 'Navigation',
        message: `Navigated to ${result.title}`,
        type: 'info',
      })
    }
    
    setQuery('')
    setIsFocused(false)
  }, [setActiveMenuItem, addNotification])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false)
        inputRef.current?.blur()
      } else if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp' && results.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault()
        handleResultClick(results[selectedIndex])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [results, selectedIndex, handleResultClick])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach((result) => {
      if (!groups[result.type]) {
        groups[result.type] = []
      }
      groups[result.type].push(result)
    })
    return groups
  }, [results])

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input - VS Code Extensions Search Style */}
      <div className="relative my-3">
        <div
          className={`relative rounded-sm h-8 flex items-center border transition-colors ${
            isFocused 
              ? 'border-vscode-blue' 
              : 'border-vscode-border'
          }`}
          style={{
            backgroundColor: 'var(--theme-sidebar)',
          }}
        >
          {/* Magnifying Glass Icon */}
          <div className="absolute left-3 pointer-events-none z-10">
            <Search
              size={16}
              className="text-vscode-text-secondary"
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay blur to allow click on results
              setTimeout(() => setIsFocused(false), 200)
            }}
            placeholder={t('searchPlaceholder') || 'Search portfolio...'}
            className="w-full pl-10 pr-8 h-full bg-transparent border-0 outline-none text-sm font-normal text-vscode-text placeholder:text-vscode-text-secondary"
          />

          {/* Clear Button */}
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearSearch}
              className="absolute right-1 p-0.5 rounded hover:bg-vscode-hover transition-colors flex items-center justify-center"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              <X size={11} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Search Suggestions - Show only when query has related suggestions */}
      <AnimatePresence>
        {isFocused && query.trim().length >= 2 && suggestions.length > 0 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-2xl z-50 overflow-hidden bg-vscode-sidebar border border-vscode-border"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-vscode-text-secondary" />
                <span className="text-xs font-semibold text-vscode-text-secondary uppercase tracking-wide">
                  Related Suggestions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 6).map((suggestion, idx) => {
                  const Icon = suggestion.icon
                  return (
                    <motion.button
                      key={`${suggestion.text}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setQuery(suggestion.text)
                        inputRef.current?.focus()
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded transition-colors text-vscode-text"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={12} className="text-vscode-text-secondary" />
                      <span>{suggestion.text}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results Dropdown */}
        {isFocused && query.trim().length >= 2 && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-2xl z-50 overflow-hidden bg-vscode-sidebar border border-vscode-border"
          >
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {Object.entries(groupedResults).map(([type, typeResults]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons] || FileText
                return (
                  <div key={type}>
                    {/* Type Header */}
                    <div className="px-4 py-2 bg-vscode-active/50 border-b border-vscode-border flex items-center gap-2">
                      <Icon size={14} className="text-vscode-text-secondary" />
                      <span className="text-xs font-semibold text-vscode-text-secondary uppercase tracking-wide">
                        {typeLabels[type as keyof typeof typeLabels] || type}
                      </span>
                      <span className="text-xs text-vscode-text-secondary ml-auto">
                        {typeResults.length}
                      </span>
                    </div>
                    
                    {/* Type Results */}
                    {typeResults.map((result, index) => {
                      const resultIndex = results.indexOf(result)
                      const isSelected = resultIndex === selectedIndex
                      return (
                        <motion.button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(resultIndex)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-vscode-blue/20'
                              : 'hover:bg-vscode-hover'
                          }`}
                          style={{
                            backgroundColor: isSelected ? 'rgba(0, 122, 204, 0.2)' : 'transparent',
                          }}
                        >
                          <Icon
                            size={18}
                            style={{
                              color: isSelected ? '#007acc' : '#CCCCCC',
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium mb-0.5"
                              style={{
                                color: isSelected ? '#007acc' : '#CCCCCC',
                              }}
                            >
                              {result.title}
                            </div>
                            {result.description && (
                              <div
                                className="text-xs line-clamp-2"
                                style={{ color: '#858585' }}
                              >
                                {result.description}
                              </div>
                            )}
                            {/* Show metadata tags if available */}
                            {result.metadata?.tags && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.metadata.tags.slice(0, 3).map((tag: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-1.5 py-0.5 bg-vscode-active rounded text-vscode-text-secondary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* No Results with Suggestions */}
        {isFocused && query.trim().length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-2xl z-50 overflow-hidden bg-vscode-sidebar border border-vscode-border"
          >
            <div className="p-4 text-center border-b border-vscode-border">
              <div style={{ color: '#858585' }} className="text-sm mb-1">
                No results found for &quot;{query}&quot;
              </div>
              <div style={{ color: '#858585' }} className="text-xs">
                Try searching for projects, skills, experience, or contact info
              </div>
            </div>
            {suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-vscode-text-secondary" />
                  <span className="text-xs font-semibold text-vscode-text-secondary uppercase">
                    Try These Instead
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 4).map((suggestion, idx) => {
                    const Icon = suggestion.icon
                    return (
                      <motion.button
                        key={`suggestion-${idx}`}
                        onClick={() => {
                          setQuery(suggestion.text)
                          inputRef.current?.focus()
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded transition-colors text-vscode-text"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={11} className="text-vscode-text-secondary" />
                        <span>{suggestion.text}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
