'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  GraduationCap,
  Award,
  FolderOpen,
  Calendar,
  MapPin,
  Building2,
  Code,
  Trophy,
  ExternalLink,
  Filter,
  Search,
  X
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { useAppStore } from '@/lib/store'
import { Tooltip } from '../ui/tooltip'

interface TimelineEvent {
  id: string
  type: 'education' | 'experience' | 'project' | 'achievement' | 'certification'
  title: string
  subtitle: string
  description?: string
  date: string
  endDate?: string
  location?: string
  icon: React.ComponentType<any>
  iconColor: string
  bgColor: string
  borderColor: string
  url?: string
  technologies?: string[]
  achievements?: string[]
}

export function PortfolioTimeline() {
  const { setActiveMenuItem } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  // Build timeline from portfolio data
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = []

    // Education
    if (portfolioData.education) {
      events.push({
        id: 'edu-1',
        type: 'education',
        title: portfolioData.education.degree,
        subtitle: portfolioData.education.institution,
        description: `Completed ${portfolioData.education.degree} from ${portfolioData.education.institution}`,
        date: portfolioData.education.period.split('-')[0].trim(),
        endDate: portfolioData.education.period.split('-')[1]?.trim(),
        location: portfolioData.education.location,
        icon: GraduationCap,
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
      })
    }

    // Work Experience
    portfolioData.experience.forEach((exp) => {
      const startDate = exp.period.split('–')[0].trim()
      const endDate = exp.period.includes('Present') ? 'Present' : exp.period.split('–')[1]?.trim()
      
      events.push({
        id: `exp-${exp.id}`,
        type: 'experience',
        title: exp.title,
        subtitle: exp.company,
        description: exp.achievements?.join(' • ') || '',
        date: startDate,
        endDate: endDate,
        location: exp.location,
        achievements: exp.achievements,
        icon: Briefcase,
        iconColor: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30'
      })
    })

    // Projects
    portfolioData.projects.forEach((project) => {
      const startDate = project.period.split('–')[0].trim()
      const endDate = project.period.includes('Present') ? 'Present' : project.period.split('–')[1]?.trim()
      
      events.push({
        id: `proj-${project.id}`,
        type: 'project',
        title: project.name || project.title,
        subtitle: 'Portfolio Project',
        description: project.description,
        date: startDate,
        endDate: endDate,
        technologies: project.technologies,
        icon: FolderOpen,
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        url: project.url
      })
    })

    // Achievements
    portfolioData.achievements?.forEach((achievement, idx) => {
      events.push({
        id: `ach-${idx + 1}`,
        type: 'achievement',
        title: achievement.name,
        subtitle: achievement.issuer,
        description: achievement.description,
        date: achievement.date,
        icon: Trophy,
        iconColor: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        url: achievement.url
      })
    })

    // Certifications
    portfolioData.certifications?.forEach((cert, idx) => {
      events.push({
        id: `cert-${idx + 1}`,
        type: 'certification',
        title: cert.name,
        subtitle: cert.issuer,
        date: cert.date,
        icon: Award,
        iconColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        url: cert.url
      })
    })

    // Sort by date (newest first)
    return events.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }, [])

  // Filter and search
  const filteredEvents = useMemo(() => {
    let filtered = timelineEvents

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.subtitle.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.technologies?.some(tech => tech.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [timelineEvents, filterType, searchQuery])

  // Group events by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {}
    
    filteredEvents.forEach(event => {
      const year = new Date(event.date).getFullYear() || 'Other'
      if (!groups[year]) {
        groups[year] = []
      }
      groups[year].push(event)
    })

    return Object.entries(groups).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  }, [filteredEvents])

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'all': 'All Events',
      'education': 'Education',
      'experience': 'Experience',
      'project': 'Projects',
      'achievement': 'Achievements',
      'certification': 'Certifications'
    }
    return labels[type] || type
  }

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: timelineEvents.length,
      education: timelineEvents.filter(e => e.type === 'education').length,
      experience: timelineEvents.filter(e => e.type === 'experience').length,
      project: timelineEvents.filter(e => e.type === 'project').length,
      achievement: timelineEvents.filter(e => e.type === 'achievement').length,
      certification: timelineEvents.filter(e => e.type === 'certification').length
    }
    return counts
  }, [timelineEvents])

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
              <Calendar className="text-vscode-blue" size={24} />
              Portfolio Timeline
            </h1>
          </div>
          <p className="text-sm text-vscode-text-secondary">
            Visual timeline of career journey, projects, and achievements
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-8 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-vscode-text-secondary" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 px-3 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            >
              {['all', 'education', 'experience', 'project', 'achievement', 'certification'].map(type => (
                <option key={type} value={type}>
                  {getTypeLabel(type)} ({typeCounts[type] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="text-vscode-text-secondary mx-auto mb-4" size={48} />
            <p className="text-vscode-text-secondary">
              {searchQuery ? 'No events found matching your search.' : 'No events to display.'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line - Vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-vscode-border" />

            {/* Timeline Events */}
            <div className="space-y-8">
              {groupedByYear.map(([year, events]) => (
                <div key={year} className="relative">
                  {/* Year Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-0.5 bg-vscode-border" />
                      <div className="px-3 py-1 bg-vscode-blue/20 border border-vscode-blue/30 rounded-full">
                        <span className="text-sm font-semibold text-vscode-blue">{year}</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-vscode-border" />
                    </div>
                    <span className="text-xs text-vscode-text-secondary">
                      {events.length} {events.length === 1 ? 'event' : 'events'}
                    </span>
                  </div>

                  {/* Events for this year */}
                  <div className="space-y-6 ml-0">
                    {events.map((event, idx) => {
                      const Icon = event.icon
                      const isExpanded = expandedEvents.has(event.id)

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative flex items-start gap-4"
                        >
                          {/* Timeline Dot */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full ${event.bgColor} border-2 ${event.borderColor} flex items-center justify-center shadow-lg`}>
                              <Icon size={24} className={event.iconColor} />
                            </div>
                            {/* Connecting line to main timeline */}
                            <div className="absolute left-1/2 top-full w-0.5 h-6 bg-vscode-border transform -translate-x-1/2" />
                          </div>

                          {/* Event Card */}
                          <div 
                            className={`flex-1 bg-vscode-sidebar border ${event.borderColor} rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer ${isExpanded ? 'border-vscode-blue/50 shadow-xl' : ''}`}
                            onClick={() => {
                              if (event.description || event.achievements || event.technologies) {
                                toggleExpand(event.id)
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-vscode-text">
                                    {event.title}
                                  </h3>
                                  {event.url && (
                                    <a
                                      href={event.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-vscode-text-secondary hover:text-vscode-blue transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-vscode-text-secondary mb-3">
                                  {event.subtitle}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-vscode-text-secondary flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>
                                      {event.date}
                                      {event.endDate && ` - ${event.endDate}`}
                                    </span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin size={12} />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  {event.endDate === 'Present' && (
                                    <div className="flex items-center gap-1 text-green-400">
                                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                      <span>Ongoing</span>
                                    </div>
                                  )}
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-4 pt-4 border-t border-vscode-border space-y-3"
                                    >
                                      {event.description && (
                                        <p className="text-sm text-vscode-text-secondary leading-relaxed">
                                          {event.description}
                                        </p>
                                      )}
                                      {event.achievements && event.achievements.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-semibold text-vscode-text-secondary mb-2 uppercase tracking-wide">
                                            Key Achievements
                                          </h4>
                                          <ul className="space-y-1.5">
                                            {event.achievements.map((achievement, aIdx) => (
                                              <li key={aIdx} className="text-sm text-vscode-text-secondary flex items-start gap-2">
                                                <span className="text-vscode-blue mt-1">•</span>
                                                <span>{achievement}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {event.technologies && event.technologies.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-semibold text-vscode-text-secondary mb-2 uppercase tracking-wide">
                                            Technologies
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {event.technologies.map((tech, tIdx) => (
                                              <span
                                                key={tIdx}
                                                className="px-2.5 py-1 bg-vscode-active border border-vscode-border rounded text-xs text-vscode-text-secondary"
                                              >
                                                {tech}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { label: 'Total Events', value: timelineEvents.length, icon: Calendar, color: 'text-vscode-blue' },
            { label: 'Experience', value: timelineEvents.filter(e => e.type === 'experience').length, icon: Briefcase, color: 'text-green-400' },
            { label: 'Projects', value: timelineEvents.filter(e => e.type === 'project').length, icon: FolderOpen, color: 'text-purple-400' },
            { label: 'Achievements', value: timelineEvents.filter(e => e.type === 'achievement').length, icon: Trophy, color: 'text-orange-400' },
            { label: 'Certifications', value: timelineEvents.filter(e => e.type === 'certification').length, icon: Award, color: 'text-yellow-400' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4 text-center">
                <Icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-vscode-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-vscode-text-secondary">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
