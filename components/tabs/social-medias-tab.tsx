'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Share2, Mail as MailIcon, MessageSquare as MessageSquareIcon, Check, Loader2,
  User, Search, X, Send, Mail, Code, AlertCircle, AlertTriangle, ChevronRight, ChevronDown,
  Github, Linkedin, Instagram, Facebook, MessageCircle, Briefcase, Bell,
  ExternalLink, Filter, Star, TrendingUp, Activity, Layers, Zap, Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'
import { useAppStore } from '@/lib/store'
import { AlertBox } from '@/components/ui/alert-box'

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
  const { portfolioSettings, addNotification } = useAppStore()
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
    // Clear error state when user starts typing
    if (formStatus === 'error') {
      setFormStatus('idle')
      setFormError('')
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      const errorMsg = 'Name is required'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
      return false
    }
    if (!formData.email.trim()) {
      const errorMsg = 'Email is required'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errorMsg = 'Please enter a valid email address'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
      return false
    }
    if (!formData.subject.trim()) {
      const errorMsg = 'Subject is required'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
      return false
    }
    if (!formData.message.trim()) {
      const errorMsg = 'Message is required'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
      return false
    }
    if (formData.message.trim().length < 10) {
      const errorMsg = 'Message must be at least 10 characters'
      addNotification({
        title: 'Form Validation Error',
        message: errorMsg,
        type: 'warning'
      })
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
      
      // Try to open email client
      const link = document.createElement('a')
      link.href = mailtoLink
      link.click()

      // Check if email client opened successfully
      await new Promise(resolve => setTimeout(resolve, 1500))

      // If we're still here, assume success (can't reliably detect if email client opened)
      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

      // Add success notification
      addNotification({
        title: 'Contact Form',
        message: `Form submitted successfully! Email client opened for ${formData.name}`,
        type: 'success'
      })

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle')
        setFormError('')
      }, 5000)
    } catch (error) {
      const errorMsg = 'Failed to send email. Please check your email client or try again.'
      setFormStatus('error')
      setFormError(errorMsg)
      
      // Add warning notification for mail failure
      addNotification({
        title: 'Email Send Failed',
        message: `Warning: Could not open email client. Please try again or contact directly at ajaykj2000@gmail.com`,
        type: 'warning'
      })
    }
  }

  return (
    <div className="h-full overflow-auto bg-vscode-bg text-vscode-text">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Header - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden rounded-2xl"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-vscode-blue/10 via-purple-500/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-vscode-blue/20 via-transparent to-transparent" />
          
          <div className="relative bg-vscode-sidebar/80 backdrop-blur-sm border border-vscode-border/50 rounded-2xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                    className="p-3 bg-gradient-to-br from-vscode-blue/30 to-purple-500/20 rounded-xl"
                  >
                    <Share2 className="text-vscode-blue" size={24} />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-vscode-text mb-1"
                    >
                      Social Media
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-sm sm:text-base text-vscode-text-secondary"
                    >
                      Connect with me across various platforms
                    </motion.p>
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-vscode-blue/20 to-purple-500/20 border border-vscode-border/50 rounded-full backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {githubLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={16} className="text-vscode-blue" />
                      </motion.div>
                    )}
                    <span className="text-sm font-semibold text-vscode-text">
                      {filteredPlatforms.length} Platforms
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-vscode-sidebar/80 backdrop-blur-sm border border-vscode-border/50 rounded-xl p-5 shadow-lg mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-12 pr-10 bg-vscode-active/50 border border-vscode-border/50 rounded-xl text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue focus:bg-vscode-active transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-vscode-text-secondary hover:text-vscode-text hover:bg-vscode-hover rounded-lg transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat, index) => {
                const Icon = cat.icon
                const isActive = selectedCategory === cat.id
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-vscode-blue to-blue-600 text-white shadow-lg shadow-vscode-blue/30'
                        : 'bg-vscode-active/50 text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text border border-vscode-border/50'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {githubError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <AlertBox
              type="warning"
              title="Warning"
              message={githubError}
              onClose={() => setGithubError(null)}
              showCloseButton={true}
            />
          </motion.div>
        )}

        {/* Social Platforms Section - Modern Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-vscode-sidebar/80 backdrop-blur-sm border border-vscode-border/50 rounded-xl overflow-hidden shadow-lg mb-6"
        >
          <button
            onClick={() => toggleSection('platforms')}
            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-vscode-active/50 to-vscode-active/30 hover:from-vscode-hover/50 hover:to-vscode-hover/30 transition-all border-b border-vscode-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-vscode-blue/30 to-purple-500/20 rounded-lg">
                <Share2 className="text-vscode-blue" size={18} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide text-vscode-text">Social Platforms</span>
              <span className="px-2.5 py-1 bg-vscode-blue/20 border border-vscode-blue/30 rounded-full text-xs font-semibold text-vscode-blue">
                {filteredPlatforms.length}
              </span>
            </div>
            {expandedSections.has('platforms') ? (
              <ChevronDown className="text-vscode-text-secondary" size={18} />
            ) : (
              <ChevronRight className="text-vscode-text-secondary" size={18} />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.has('platforms') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="group"
                        >
                          <div className="h-full p-5 bg-gradient-to-br from-vscode-active/50 to-vscode-active/30 border border-vscode-border/50 rounded-xl hover:border-vscode-blue/50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden min-h-[160px] backdrop-blur-sm">
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-vscode-blue/0 to-vscode-blue/0 group-hover:from-vscode-blue/5 group-hover:to-transparent transition-all" />
                            
                            {/* Icon Container */}
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              className={`w-14 h-14 flex items-center justify-center rounded-xl ${platform.bgColor} text-white group-hover:shadow-2xl transition-all relative z-10 mb-4`}
                            >
                              <IconComponent className="w-7 h-7" />
                            </motion.div>

                            {/* Platform Name */}
                            <div className="flex items-center gap-1.5 relative z-10 mb-2">
                              <span className="text-sm font-bold text-vscode-text group-hover:text-vscode-blue transition-colors">
                                {platform.name}
                              </span>
                              {platform.verified && (
                                <Tooltip content="Verified" position="top">
                                  <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className="p-0.5 bg-vscode-blue/20 rounded-full"
                                  >
                                    <Check className="size-3 text-vscode-blue flex-shrink-0" />
                                  </motion.div>
                                </Tooltip>
                              )}
                            </div>

                            {/* Description */}
                            {platform.description && (
                              <p className="text-xs text-vscode-text-secondary text-center line-clamp-2 mb-2 relative z-10">
                                {platform.description}
                              </p>
                            )}

                            {/* Stats */}
                            {platform.followers !== undefined && (
                              <div className="mt-auto flex items-center gap-1.5 text-xs text-vscode-text-secondary relative z-10">
                                <TrendingUp size={12} className="text-green-400" />
                                <span className="font-medium">{platform.followers} followers</span>
                              </div>
                            )}

                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute top-3 right-3 p-1.5 bg-vscode-sidebar/80 rounded-lg backdrop-blur-sm"
                            >
                              <ExternalLink size={14} className="text-vscode-text-secondary" />
                            </motion.div>
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* GitHub Integration Section - Modern Design */}
        {githubData && portfolioSettings.showGitHubStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-vscode-sidebar/80 backdrop-blur-sm border border-vscode-border/50 rounded-xl overflow-hidden shadow-lg mb-6"
          >
            <button
              onClick={() => toggleSection('github')}
              className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-vscode-active/50 to-vscode-active/30 hover:from-vscode-hover/50 hover:to-vscode-hover/30 transition-all border-b border-vscode-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg">
                  <Github className="text-vscode-text" size={18} />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-vscode-text">GitHub Profile</span>
                {githubData.followers !== undefined && (
                  <span className="px-2.5 py-1 bg-vscode-blue/20 border border-vscode-blue/30 rounded-full text-xs font-semibold text-vscode-blue">
                    {githubData.followers} followers
                  </span>
                )}
              </div>
              {expandedSections.has('github') ? (
                <ChevronDown className="text-vscode-text-secondary" size={18} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={18} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('github') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 space-y-5">
                    {/* GitHub Stats - Modern Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Repositories', value: githubData.public_repos || 0, icon: Code, color: 'text-blue-400' },
                        { label: 'Followers', value: githubData.followers || 0, icon: Users, color: 'text-green-400' },
                        { label: 'Following', value: githubData.following || 0, icon: Activity, color: 'text-purple-400' },
                      ].map((stat, index) => {
                        const Icon = stat.icon
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="bg-gradient-to-br from-vscode-active/50 to-vscode-active/30 border border-vscode-border/50 rounded-xl p-4 text-center backdrop-blur-sm"
                          >
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Icon className={stat.color} size={18} />
                            </div>
                            <div className="text-2xl font-bold text-vscode-text mb-1">{stat.value}</div>
                            <div className="text-xs text-vscode-text-secondary font-medium">{stat.label}</div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Recent Repositories - Modern Cards */}
                    {repositories.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-vscode-text mb-4 flex items-center gap-2">
                          <Star className="text-vscode-blue" size={16} />
                          Recent Repositories
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {repositories.slice(0, 3).map((repo, index) => (
                            <motion.a
                              key={index}
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              className="block p-4 bg-gradient-to-br from-vscode-active/50 to-vscode-active/30 border border-vscode-border/50 rounded-xl hover:border-vscode-blue/50 transition-all group backdrop-blur-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">{repo.name}</span>
                                <ExternalLink size={14} className="text-vscode-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-xs text-vscode-text-secondary line-clamp-2 mb-3">{repo.description}</p>
                              <div className="flex items-center gap-3 text-xs text-vscode-text-secondary">
                                <span className="px-2 py-1 bg-vscode-blue/20 rounded text-vscode-blue font-medium">{repo.language}</span>
                                <span className="flex items-center gap-1">
                                  <Star size={12} className="text-yellow-400" />
                                  <span>{repo.stars}</span>
                                </span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Contact Form Section - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-vscode-sidebar/80 backdrop-blur-sm border border-vscode-border/50 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 bg-gradient-to-r from-vscode-active/50 to-vscode-active/30 border-b border-vscode-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 rounded-lg">
                <MailIcon className="text-emerald-400" size={18} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide text-vscode-text">Contact Form</span>
            </div>
          </div>
          <div className="p-6 sm:p-8">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formStatus === 'success' && (
                    <AlertBox
                      type="success"
                      title="Success"
                      message="Email client opened successfully! Please send your message from there."
                      onClose={() => setFormStatus('idle')}
                      showCloseButton={true}
                    />
                  )}

                  {formStatus === 'error' && formError && (
                    <AlertBox
                      type="error"
                      title="Error"
                      message={formError}
                      onClose={() => {
                        setFormStatus('idle')
                        setFormError('')
                      }}
                      showCloseButton={true}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-vscode-text-secondary mb-2 flex items-center gap-2">
                        <User size={14} className="text-vscode-blue" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="John Doe"
                        className="w-full bg-vscode-active/50 border border-vscode-border/50 rounded-xl px-4 py-3 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue focus:bg-vscode-active transition-all backdrop-blur-sm"
                        disabled={formStatus === 'sending'}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-vscode-text-secondary mb-2 flex items-center gap-2">
                        <MailIcon size={14} className="text-vscode-blue" />
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="john@example.com"
                        className="w-full bg-vscode-active/50 border border-vscode-border/50 rounded-xl px-4 py-3 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue focus:bg-vscode-active transition-all backdrop-blur-sm"
                        disabled={formStatus === 'sending'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-vscode-text-secondary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      placeholder="e.g., Project Collaboration Inquiry"
                      className="w-full bg-vscode-active/50 border border-vscode-border/50 rounded-xl px-4 py-3 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue focus:bg-vscode-active transition-all backdrop-blur-sm"
                      disabled={formStatus === 'sending'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-vscode-text-secondary mb-2 flex items-center gap-2">
                      <MessageSquareIcon size={14} className="text-vscode-blue" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={6}
                      placeholder="Write your message here... (minimum 10 characters)"
                      className="w-full bg-vscode-active/50 border border-vscode-border/50 rounded-xl px-4 py-3 text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:border-vscode-blue focus:bg-vscode-active transition-all resize-none backdrop-blur-sm"
                      disabled={formStatus === 'sending'}
                    />
                    <p className="text-xs text-vscode-text-secondary mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded ${formData.message.length >= 10 ? 'bg-green-500/20 text-green-400' : 'bg-vscode-border/50 text-vscode-text-secondary'}`}>
                        {formData.message.length} characters
                      </span>
                      <span className="text-vscode-text-secondary">(minimum 10 required)</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-vscode-border/50">
                    <p className="text-xs text-vscode-text-secondary">
                      * Required fields. Your default email client will open to send this message.
                    </p>
                    <motion.button
                      type="submit"
                      disabled={formStatus === 'sending' || formStatus === 'success'}
                      whileHover={{ scale: formStatus === 'sending' || formStatus === 'success' ? 1 : 1.05 }}
                      whileTap={{ scale: formStatus === 'sending' || formStatus === 'success' ? 1 : 0.95 }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-vscode-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-vscode-blue/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Opening Email...</span>
                        </>
                      ) : formStatus === 'success' ? (
                        <>
                          <Check size={18} />
                          <span>Email Opened!</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Email</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
      </div>
    </div>
  )
}
