'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Mail, Github, Linkedin, Send, Loader2, CheckCircle2, 
  Clock, Download, MapPin, Phone, MessageSquare,
  AlertCircle, MessageCircle, Search, X,
  Code, Star,
  ExternalLink, Users, ChevronRight,
  LayoutGrid, LayoutList, Filter, SortAsc, SortDesc, Building2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { portfolioData } from '@/lib/portfolio-data'
import { Tooltip } from '@/components/ui/tooltip'

interface GitHubData {
  followers?: number
  following?: number
  public_repos?: number
  bio?: string
  avatar_url?: string
  name?: string
  login?: string
  html_url?: string
}

interface Repository {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  html_url: string
}

interface ContactItem {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<any>
  iconColor: string
  bgColor: string
  url?: string
  value?: string
  verified?: boolean
}

interface ContactCategory {
  name: string
  items: ContactItem[]
}

// Custom Icons
const GitHubIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

type ViewMode = 'grid' | 'list'
type SortOption = 'name-asc' | 'name-desc'

export function ContactTab() {
  const { addNotification } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'contact-methods': true,
    'social-platforms': true,
    'professional-info': true,
    'github-repos': true,
  })
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [githubLoading, setGithubLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setGithubLoading(true)
        const [profileResponse, reposResponse] = await Promise.all([
          fetch('https://api.github.com/users/Ajay-k-jayan'),
          fetch('https://api.github.com/users/Ajay-k-jayan/repos?sort=updated&per_page=6')
        ])
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setGithubData(profileData)
        }

        if (reposResponse.ok) {
          const reposData = await reposResponse.json()
          const formattedRepos: Repository[] = reposData.map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description',
            language: repo.language || 'Other',
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            html_url: repo.html_url
          }))
          setRepositories(formattedRepos)
        }
      } catch (error) {
        console.error('GitHub API Error:', error)
      } finally {
        setGithubLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  // Build contact categories
  const contactCategories: ContactCategory[] = useMemo(() => {
    const categories: ContactCategory[] = [
      {
        name: 'CONTACT METHODS',
        items: [
          {
            id: 'email',
            name: 'Email',
            description: portfolioData.profile.email,
            category: 'Contact',
            icon: Mail,
            iconColor: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            url: `mailto:${portfolioData.profile.email}`,
            value: portfolioData.profile.email,
            verified: true,
          },
          {
            id: 'phone',
            name: 'Phone',
            description: portfolioData.profile.phone,
            category: 'Contact',
            icon: Phone,
            iconColor: 'text-green-400',
            bgColor: 'bg-green-500/10',
            url: `tel:${portfolioData.profile.phone.replace(/\s/g, '')}`,
            value: portfolioData.profile.phone,
            verified: true,
          },
          {
            id: 'location',
            name: 'Location',
            description: portfolioData.profile.location,
            category: 'Contact',
            icon: MapPin,
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            value: portfolioData.profile.location,
          },
        ],
      },
      {
        name: 'SOCIAL PLATFORMS',
        items: [
          {
            id: 'github',
            name: 'GitHub',
            description: githubData?.followers ? `${githubData.followers} followers` : 'Code repositories',
            category: 'Social',
            icon: GitHubIcon,
            iconColor: 'text-gray-300',
            bgColor: 'bg-gray-500/10',
            url: portfolioData.profile.github,
            verified: true,
          },
          {
            id: 'linkedin',
            name: 'LinkedIn',
            description: 'Professional network',
            category: 'Social',
            icon: LinkedInIcon,
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            url: portfolioData.profile.linkedin,
            verified: true,
          },
          {
            id: 'telegram',
            name: 'Telegram',
            description: 'Secure messaging',
            category: 'Social',
            icon: MessageCircle,
            iconColor: 'text-blue-300',
            bgColor: 'bg-blue-300/10',
            url: 'https://t.me/ajaykj',
          },
        ],
      },
      {
        name: 'PROFESSIONAL INFO',
        items: [
          {
            id: 'availability',
            name: 'Availability',
            description: 'Available for Freelance • Mon-Fri: 9AM-6PM IST',
            category: 'Professional',
            icon: Clock,
            iconColor: 'text-green-400',
            bgColor: 'bg-green-500/10',
          },
          {
            id: 'company',
            name: 'Company',
            description: `${portfolioData.profile.company} • ${portfolioData.profile.experience}`,
            category: 'Professional',
            icon: Building2,
            iconColor: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
          },
        ],
      },
    ]

    // Add GitHub repositories
    if (repositories.length > 0) {
      categories.push({
        name: 'GITHUB REPOSITORIES',
        items: repositories.slice(0, 6).map((repo) => ({
          id: `repo-${repo.name}`,
          name: repo.name,
          description: repo.description,
          category: 'Repository',
          icon: Code,
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          url: repo.html_url,
        })),
      })
    }

    return categories
  }, [githubData, repositories])

  // Filter and sort
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = contactCategories

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.value?.toLowerCase().includes(query)
        )
      })).filter(cat => cat.items.length > 0)
    }

    // Apply sorting
    filtered = filtered.map(cat => ({
      ...cat,
      items: [...cat.items].sort((a, b) => {
        return sortBy === 'name-asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      })
    }))

    return filtered
  }, [contactCategories, searchQuery, sortBy])

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const handleItemClick = (item: ContactItem) => {
    if (item.url?.startsWith('mailto:') || item.url?.startsWith('tel:')) {
      window.location.href = item.url
    } else if (item.url?.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener noreferrer')
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormError('All fields are required')
      setFormStatus('error')
      return
    }

    setFormStatus('sending')
    setTimeout(() => {
      try {
        const subject = encodeURIComponent(formData.subject)
        const body = encodeURIComponent(
          `Hello Ajay,\n\nFrom: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}\n\n---\nSent from Portfolio Contact Form`
        )
        const mailtoLink = `mailto:${portfolioData.profile.email}?subject=${subject}&body=${body}`
        window.location.href = mailtoLink
        setFormStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        addNotification({
          title: 'Contact Form',
          message: 'Email client opened. Please send your message.',
          type: 'success'
        })
        setTimeout(() => setFormStatus('idle'), 3000)
      } catch (error) {
        setFormStatus('error')
        setFormError('Failed to open email client')
      }
    }, 500)
  }

  const totalItems = contactCategories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <MessageSquare className="text-vscode-blue" size={20} />
                  Contact & Social Media
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-vscode-blue rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-vscode-text-secondary">
                Browse contact methods, social platforms, and professional information organized by category
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Tooltip content={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'} position="bottom">
                <motion.button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="relative w-8 h-8 flex items-center justify-center bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover hover:border-vscode-border/80 transition-all duration-200 group"
                  whileHover={{ scale: 1.08, borderColor: 'rgba(0, 122, 204, 0.3)' }}
                  whileTap={{ scale: 0.92 }}
                >
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.7, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7, rotate: 180 }}
                    transition={{ 
                      duration: 0.25, 
                      ease: [0.34, 1.56, 0.64, 1],
                      opacity: { duration: 0.15 }
                    }}
                    className="flex items-center justify-center"
                  >
                    {viewMode === 'grid' ? (
                      <LayoutGrid size={15} className="text-vscode-text-secondary group-hover:text-vscode-text transition-colors" />
                    ) : (
                      <LayoutList size={15} className="text-vscode-text-secondary group-hover:text-vscode-text transition-colors" />
                    )}
                  </motion.div>
                </motion.button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 mt-4">
          <div className="relative">
            <div className="relative rounded-sm h-8 flex items-center border border-vscode-border bg-vscode-sidebar transition-colors">
              <Search
                size={16}
                className="absolute left-3 text-vscode-text-secondary pointer-events-none z-10"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search contact methods and social platforms"
                className="w-full pl-10 pr-8 h-full bg-transparent border-0 outline-none text-sm font-normal text-vscode-text placeholder:text-vscode-text-secondary focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 p-1 hover:bg-vscode-hover rounded transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue"
                >
                  <X size={14} className="text-vscode-text-secondary" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort contact items"
            className="px-3 h-8 bg-vscode-sidebar border border-vscode-border rounded text-xs text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1"
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
          </select>
          <button
            onClick={() => setSortBy(sortBy === 'name-asc' ? 'name-desc' : 'name-asc')}
            aria-label={`Sort ${sortBy === 'name-asc' ? 'descending' : 'ascending'}`}
            className="w-8 h-8 flex items-center justify-center bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-1"
          >
            {sortBy === 'name-asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>

        {/* Contact Categories */}
        <div className="space-y-6">
          {filteredAndSortedCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-vscode-text-secondary mb-2">No items found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search filters"
                className="text-vscode-blue hover:text-vscode-blue-accent text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-1 rounded px-2 py-1"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredAndSortedCategories.map((category) => {
              const sectionKey = category.name.toLowerCase().replace(/\s+/g, '-')
              const isExpanded = expandedSections[sectionKey] ?? true

              return (
                <div key={category.name} className="mb-5">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleSection(sectionKey)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleSection(sectionKey)
                      }
                    }}
                    aria-expanded={isExpanded}
                    aria-controls={`section-${sectionKey}`}
                    className="w-full flex items-center gap-2.5 px-0 py-2 text-left hover:opacity-80 transition-opacity group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-2 rounded"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronRight size={14} className="text-vscode-text-secondary" />
                    </motion.div>
                    <span id={`section-header-${sectionKey}`} className="text-sm font-medium text-vscode-text uppercase tracking-wide flex-1 text-left">
                      {category.name}
                    </span>
                    <span className="text-xs text-vscode-text-secondary bg-[#2d2d30] border border-[#3e3e42] px-2 py-0.5 rounded font-medium">
                      {category.items.length}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`section-${sectionKey}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                        role="region"
                        aria-labelledby={`section-header-${sectionKey}`}
                      >
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {category.items.map((item, index) => {
                              const Icon = item.icon
                              return (
                                <motion.button
                                  key={item.id}
                                  onClick={() => handleItemClick(item)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      handleItemClick(item)
                                    }
                                  }}
                                  aria-label={`${item.name}: ${item.description}`}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="group relative overflow-hidden rounded-lg border border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/50 hover:bg-vscode-hover transition-all p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-2"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2.5 rounded-lg ${item.bgColor} flex-shrink-0`}>
                                      <Icon size={24} className={item.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">
                                          {item.name}
                                        </h3>
                                        {item.verified && (
                                          <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                                        )}
                                      </div>
                                      <p className="text-xs text-vscode-text-secondary line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
                                    {item.url && (
                                      <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue transition-colors flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                </motion.button>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {category.items.map((item, index) => {
                              const Icon = item.icon
                              return (
                                <motion.button
                                  key={item.id}
                                  onClick={() => handleItemClick(item)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      handleItemClick(item)
                                    }
                                  }}
                                  aria-label={`${item.name}: ${item.description}`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  className="w-full flex items-center gap-3 p-3 rounded border border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/50 hover:bg-vscode-hover transition-all text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-2"
                                  whileHover={{ x: 4 }}
                                >
                                  <div className={`p-2 rounded-lg ${item.bgColor} flex-shrink-0`}>
                                    <Icon size={20} className={item.iconColor} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">
                                        {item.name}
                                      </h3>
                                      {item.verified && (
                                        <CheckCircle2 size={12} className="text-green-400" />
                                      )}
                                    </div>
                                    <p className="text-xs text-vscode-text-secondary line-clamp-1">
                                      {item.description}
                                    </p>
                                  </div>
                                  {item.url && (
                                    <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue transition-colors flex-shrink-0" />
                                  )}
                                </motion.button>
                              )
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>

        {/* Contact Form Section */}
        <div className="mt-8 bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
          <button
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            aria-controls="contact-form-content"
            className="w-full px-4 py-3 bg-vscode-active/50 border-b border-vscode-border flex items-center justify-between hover:bg-vscode-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-blue focus-visible:ring-offset-1"
          >
            <div className="flex items-center gap-3">
              <Send className="text-vscode-blue" size={18} />
              <span id="contact-form-header" className="text-sm font-semibold text-vscode-text">
                Contact Form
              </span>
            </div>
            <motion.div
              animate={{ rotate: showForm ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-vscode-text-secondary" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showForm && (
              <motion.div
                id="contact-form-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
                role="region"
                aria-labelledby="contact-form-header"
              >
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4" aria-label="Contact form">
                  {formError && formStatus === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formStatus === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Message sent successfully! Email client opened.</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium mb-2 text-vscode-text-secondary">
                      Name <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1 transition-all"
                      placeholder="Your name"
                      required
                      aria-required="true"
                      aria-invalid={formStatus === 'error' && !formData.name.trim()}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium mb-2 text-vscode-text-secondary">
                      Email <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1 transition-all"
                      placeholder="your.email@example.com"
                      required
                      aria-required="true"
                      aria-invalid={formStatus === 'error' && !formData.email.trim()}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-medium mb-2 text-vscode-text-secondary">
                      Subject <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1 transition-all"
                      placeholder="What's this about?"
                      required
                      aria-required="true"
                      aria-invalid={formStatus === 'error' && !formData.subject.trim()}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium mb-2 text-vscode-text-secondary">
                      Message <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue focus:ring-2 focus:ring-vscode-blue focus:ring-offset-1 transition-all resize-none"
                      placeholder="Tell me about your project or just say hello..."
                      required
                      aria-required="true"
                      aria-invalid={formStatus === 'error' && !formData.message.trim()}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={formStatus === 'sending' || formStatus === 'success'}
                    whileHover={{ scale: formStatus === 'idle' ? 1.02 : 1 }}
                    whileTap={{ scale: formStatus === 'idle' ? 0.98 : 1 }}
                    className="w-full px-4 py-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded text-sm font-medium transition-all shadow-lg shadow-vscode-blue/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : formStatus === 'success' ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
