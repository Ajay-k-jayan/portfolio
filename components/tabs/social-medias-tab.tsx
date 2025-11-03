'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Share2, Mail as MailIcon, MessageSquare as MessageSquareIcon, Check, Loader2,
  User, Search, X, Send, Mail, Code, AlertCircle,   ChevronRight, ChevronDown,
  Github, Linkedin, Instagram, Facebook, MessageCircle, Briefcase, Bell,
  ExternalLink, Filter, Star, TrendingUp, Activity, Layers, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'

interface GitHubData {
  followers?: number
  following?: number
  public_repos?: number
  bio?: string
  location?: string
  company?: string
  blog?: string
  created_at?: string
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
  updated_at: string
  html_url: string
}

interface SocialPlatform {
  id: string
  name: string
  url: string
  iconComponent: React.ComponentType<{ className?: string }>
  bgColor: string
  hoverColor: string
  category: string
  verified?: boolean
  followers?: number
  description?: string
}

// Brand-specific SVG Icon Components
const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export function SocialMediasTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [githubLoading, setGithubLoading] = useState(true)
  const [githubError, setGithubError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['platforms', 'github']))
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  const categories = [
    { id: 'all', label: 'All', icon: Share2 },
    { id: 'development', label: 'Development', icon: Code },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'communication', label: 'Communication', icon: MailIcon },
    { id: 'social', label: 'Social', icon: Share2 },
  ]

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

  // Fetch GitHub profile data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setGithubLoading(true)
        const [profileResponse, reposResponse] = await Promise.all([
          fetch('https://api.github.com/users/Ajay-k-jayan'),
          fetch('https://api.github.com/users/Ajay-k-jayan/repos?sort=updated&per_page=6')
        ])
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch GitHub profile')
        }

        const profileData = await profileResponse.json()
        setGithubData(profileData)

        if (reposResponse.ok) {
          const reposData = await reposResponse.json()
          const formattedRepos: Repository[] = reposData.map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description',
            language: repo.language || 'Other',
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            updated_at: repo.updated_at,
            html_url: repo.html_url
          }))
          setRepositories(formattedRepos)
        }

        setGithubError(null)
      } catch (error) {
        console.error('GitHub API Error:', error)
        setGithubError('Unable to load GitHub data')
      } finally {
        setGithubLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  const socialPlatforms: SocialPlatform[] = useMemo(() => [
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/Ajay-k-jayan',
      iconComponent: GitHubIcon,
      bgColor: 'bg-gray-900',
      hoverColor: 'hover:bg-gray-800',
      category: 'development',
      verified: true,
      followers: githubData?.followers,
      description: 'Code repositories and contributions'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ajay-k-jayan-4a55b1224/',
      iconComponent: LinkedInIcon,
      bgColor: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#004182]',
      category: 'professional',
      verified: true,
      description: 'Professional network and career updates'
    },
    {
      id: 'email',
      name: 'Email',
      url: 'mailto:ajaykj2000@gmail.com',
      iconComponent: Mail,
      bgColor: 'bg-emerald-600',
      hoverColor: 'hover:bg-emerald-700',
      category: 'communication',
      description: 'Direct email communication'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com',
      iconComponent: InstagramIcon,
      bgColor: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]',
      hoverColor: 'hover:opacity-90',
      category: 'social',
      description: 'Visual content and stories'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com',
      iconComponent: FacebookIcon,
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0C63D4]',
      category: 'social',
      description: 'Social connections and updates'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: 'https://wa.me/918289917044',
      iconComponent: WhatsAppIcon,
      bgColor: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#20BA5A]',
      category: 'communication',
      description: 'Instant messaging'
    }
  ], [githubData])

  const filteredPlatforms = useMemo(() => {
    let filtered = socialPlatforms

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [socialPlatforms, selectedCategory, searchQuery])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setFormError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return false
    }
    if (!formData.subject.trim()) {
      setFormError('Subject is required')
      return false
    }
    if (!formData.message.trim()) {
      setFormError('Message is required')
      return false
    }
    if (formData.message.trim().length < 10) {
      setFormError('Message must be at least 10 characters')
      return false
    }
    return true
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormStatus('sending')
    setFormError('')

    try {
      const emailSubject = encodeURIComponent(formData.subject)
      const emailBody = encodeURIComponent(
        `Hello Ajay,\n\nFrom: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}\n\n---\nSent from Portfolio Contact Form`
      )
      
      const mailtoLink = `mailto:ajaykj2000@gmail.com?subject=${emailSubject}&body=${emailBody}`
      window.location.href = mailtoLink

      await new Promise(resolve => setTimeout(resolve, 1000))

      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

      setTimeout(() => {
        setFormStatus('idle')
      }, 3000)
    } catch (error) {
      setFormStatus('error')
      setFormError('Failed to open email client. Please try again or email directly.')
    }
  }

  return (
    <div className="h-full overflow-auto bg-vscode-bg text-vscode-text">
      <div className="w-full">
        {/* Main Content */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-vscode-border pb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-vscode-blue/20 rounded-lg">
                    <Share2 className="text-vscode-blue" size={20} />
                  </div>
                  <h1 className="text-2xl font-semibold text-vscode-text">Social Medias</h1>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400">
                    {filteredPlatforms.length}
                  </span>
                  {githubLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 size={16} className="text-vscode-text-secondary" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-vscode-text-secondary ml-[52px]">
                  Connect with me across various social media platforms
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={16} />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-10 pr-8 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const isActive = selectedCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-vscode-blue text-white'
                            : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                        }`}
                      >
                        <Icon size={14} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Error State */}
            {githubError && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
                <AlertCircle size={16} />
                <span>{githubError}</span>
              </div>
            )}

            {/* Social Platforms Section */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <button
                onClick={() => toggleSection('platforms')}
                className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">SOCIAL PLATFORMS</span>
                  <span className="px-1.5 py-0.5 bg-vscode-border rounded text-[10px] text-vscode-text-secondary">
                    {filteredPlatforms.length}
                  </span>
                </div>
                {expandedSections.has('platforms') ? (
                  <ChevronDown className="text-vscode-text-secondary" size={16} />
                ) : (
                  <ChevronRight className="text-vscode-text-secondary" size={16} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.has('platforms') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredPlatforms.map((platform, index) => {
                          const IconComponent = platform.iconComponent
                          return (
                            <motion.a
                              key={platform.id}
                              href={platform.url}
                              target={platform.id === 'email' ? undefined : '_blank'}
                              rel={platform.id === 'email' ? undefined : 'noopener noreferrer'}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              className="group"
                            >
                              <div className={`h-full p-4 bg-vscode-active border border-vscode-border rounded-lg hover:border-vscode-blue transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden min-h-[140px]`}>
                                {/* Icon Container */}
                                <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${platform.bgColor} text-white group-hover:scale-110 group-hover:shadow-lg transition-all relative z-10 mb-3`}>
                                  <IconComponent className="w-6 h-6" />
                                </div>

                                {/* Platform Name */}
                                <div className="flex items-center gap-1.5 relative z-10 mb-1">
                                  <span className="text-xs font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">
                                    {platform.name}
                                  </span>
                                  {platform.verified && (
                                    <Tooltip content="Verified" position="top">
                                      <Check className="size-3 text-vscode-blue flex-shrink-0" />
                                    </Tooltip>
                                  )}
                                </div>

                                {/* Description */}
                                {platform.description && (
                                  <p className="text-[10px] text-vscode-text-secondary text-center line-clamp-2">
                                    {platform.description}
                                  </p>
                                )}

                                {/* Stats */}
                                {platform.followers !== undefined && (
                                  <div className="mt-2 flex items-center gap-1 text-[10px] text-vscode-text-secondary">
                                    <TrendingUp size={10} />
                                    <span>{platform.followers} followers</span>
                                  </div>
                                )}

                                <ExternalLink size={12} className="absolute top-2 right-2 text-vscode-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </motion.a>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GitHub Integration Section */}
            {githubData && (
              <div className="bg-vscode-sidebar border border-vscode-border rounded">
                <button
                  onClick={() => toggleSection('github')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
                >
                  <div className="flex items-center gap-2">
                    <Github className="text-vscode-blue" size={16} />
                    <span className="text-sm font-medium text-vscode-text">GITHUB PROFILE</span>
                    {githubData.followers !== undefined && (
                      <span className="px-1.5 py-0.5 bg-vscode-border rounded text-[10px] text-vscode-text-secondary">
                        {githubData.followers} followers
                      </span>
                    )}
                  </div>
                  {expandedSections.has('github') ? (
                    <ChevronDown className="text-vscode-text-secondary" size={16} />
                  ) : (
                    <ChevronRight className="text-vscode-text-secondary" size={16} />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.has('github') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        {/* GitHub Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-vscode-active rounded p-3 text-center">
                            <div className="text-lg font-bold text-vscode-text">{githubData.public_repos || 0}</div>
                            <div className="text-xs text-vscode-text-secondary">Repositories</div>
                          </div>
                          <div className="bg-vscode-active rounded p-3 text-center">
                            <div className="text-lg font-bold text-vscode-text">{githubData.followers || 0}</div>
                            <div className="text-xs text-vscode-text-secondary">Followers</div>
                          </div>
                          <div className="bg-vscode-active rounded p-3 text-center">
                            <div className="text-lg font-bold text-vscode-text">{githubData.following || 0}</div>
                            <div className="text-xs text-vscode-text-secondary">Following</div>
                          </div>
                        </div>

                        {/* Recent Repositories */}
                        {repositories.length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold text-vscode-text mb-2">Recent Repositories</h3>
                            <div className="space-y-2">
                              {repositories.slice(0, 3).map((repo, index) => (
                                <a
                                  key={index}
                                  href={repo.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-2 bg-vscode-active hover:bg-vscode-hover rounded border border-vscode-border hover:border-vscode-blue transition-all group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-vscode-text group-hover:text-vscode-blue">{repo.name}</span>
                                    <ExternalLink size={12} className="text-vscode-text-secondary opacity-0 group-hover:opacity-100" />
                                  </div>
                                  <p className="text-[10px] text-vscode-text-secondary line-clamp-1">{repo.description}</p>
                                  <div className="flex items-center gap-3 mt-1 text-[10px] text-vscode-text-secondary">
                                    <span>{repo.language}</span>
                                    <span className="flex items-center gap-1">
                                      <Star size={10} />
                                      {repo.stars}
                                    </span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Contact Form Section */}
            <div className="bg-vscode-sidebar border border-vscode-border rounded">
              <div className="px-4 py-3 bg-vscode-active border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <MailIcon className="text-vscode-blue" size={16} />
                  <span className="text-sm font-medium text-vscode-text">CONTACT FORM</span>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formStatus === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm">
                      <Check size={16} />
                      <span>Email client opened successfully! Please send your message from there.</span>
                    </div>
                  )}

                  {formStatus === 'error' && formError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formError && formStatus === 'idle' && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-1.5">
                        <User size={12} className="inline mr-1" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="John Doe"
                        className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue transition-colors"
                        disabled={formStatus === 'sending'}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-1.5">
                        <MailIcon size={12} className="inline mr-1" />
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="john@example.com"
                        className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue transition-colors"
                        disabled={formStatus === 'sending'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-vscode-text-secondary mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      placeholder="e.g., Project Collaboration Inquiry"
                      className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue transition-colors"
                      disabled={formStatus === 'sending'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-vscode-text-secondary mb-1.5">
                      <MessageSquareIcon size={12} className="inline mr-1" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={6}
                      placeholder="Write your message here... (minimum 10 characters)"
                      className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue transition-colors resize-none"
                      disabled={formStatus === 'sending'}
                    />
                    <p className="text-xs text-vscode-text-secondary mt-1">
                      {formData.message.length} characters (minimum 10 required)
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-vscode-text-secondary">
                      * Required fields. Your default email client will open to send this message.
                    </p>
                    <button
                      type="submit"
                      disabled={formStatus === 'sending' || formStatus === 'success'}
                      className="flex items-center gap-2 px-6 py-2 bg-vscode-blue hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Opening Email...</span>
                        </>
                      ) : formStatus === 'success' ? (
                        <>
                          <Check size={16} />
                          <span>Email Opened!</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
