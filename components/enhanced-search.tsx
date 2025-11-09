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

  // Projects
  portfolioData.projects.forEach((project) => {
    results.push({
      id: `project-${project.id}`,
      type: 'project',
      title: project.name || project.title,
      description: project.description,
      url: '#project',
      metadata: {
        technologies: project.technologies,
        period: project.period,
      },
    })
  })

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

export function EnhancedSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  const { setActiveMenuItem, addNotification } = useAppStore()

  // Build search index once
  const searchIndex = useMemo(() => buildSearchIndex(), [])

  // Search function
  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      const filtered = searchIndex.filter((item) => {
        // Search in title
        const titleMatch = item.title.toLowerCase().includes(searchTerm)
        
        // Search in description
        const descMatch = item.description?.toLowerCase().includes(searchTerm)
        
        // Search in metadata
        const metadataMatch = item.metadata && Object.values(item.metadata).some((value) => {
          if (Array.isArray(value)) {
            return value.some((v) => String(v).toLowerCase().includes(searchTerm))
          }
          return String(value).toLowerCase().includes(searchTerm)
        })

        // Search in tags (for skills and blogs)
        const tagsMatch = item.metadata?.tags?.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm)
        )

        return titleMatch || descMatch || metadataMatch || tagsMatch
      })

      // Sort by relevance (title matches first, then description)
      const sorted = filtered.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().startsWith(searchTerm) ? 2 : 
                          a.title.toLowerCase().includes(searchTerm) ? 1 : 0
        const bTitleMatch = b.title.toLowerCase().startsWith(searchTerm) ? 2 : 
                          b.title.toLowerCase().includes(searchTerm) ? 1 : 0
        
        if (aTitleMatch !== bTitleMatch) {
          return bTitleMatch - aTitleMatch
        }
        
        return a.title.localeCompare(b.title)
      })

      setResults(sorted.slice(0, 10)) // Limit to 10 results
    } else {
      setResults([])
    }
    setSelectedIndex(-1)
  }, [query, searchIndex])

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

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && results.length > 0 && (
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

        {/* No Results */}
        {isFocused && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-2xl z-50 p-4 text-center bg-vscode-sidebar border border-vscode-border"
          >
            <div style={{ color: '#858585' }} className="text-sm">
              No results found for &quot;{query}&quot;
            </div>
            <div style={{ color: '#858585' }} className="text-xs mt-2">
              Try searching for projects, skills, experience, or contact info
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
