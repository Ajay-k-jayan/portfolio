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
  Trophy,
  ExternalLink,
  Filter,
  Search,
  X,
  Layout,
  LayoutGrid
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { Tooltip } from '../ui/tooltip'
import { useLanguage } from '@/contexts/language-context'

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

type TimelineView = 'vertical' | 'horizontal'

export function PortfolioTimeline() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [view, setView] = useState<TimelineView>('horizontal')

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
        url: (project as any).url
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

  // Sort events chronologically for horizontal view
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
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
      'all': t('allEvents'),
      'education': t('education'),
      'experience': t('experience'),
      'project': t('projects'),
      'achievement': t('achievements'),
      'certification': t('certifications')
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <Calendar className="text-vscode-blue" size={20} />
                  {t('timeline')}
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {timelineEvents.length}
                    </span>
                  </div>
                  {/* Pulse effect */}
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
                {t('timelineDescription')}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              {/* Horizontal/Vertical View Toggle - Sliding Indicator Design */}
              <div className="relative flex items-center bg-vscode-sidebar rounded-md p-0.5 border border-vscode-border">
                {/* Sliding background indicator */}
                <motion.div
                  className="absolute bg-vscode-blue rounded"
                  style={{
                    height: 'calc(100% - 4px)',
                    width: 'calc(50% - 2px)',
                  }}
                  animate={{
                    x: view === 'horizontal' ? '0%' : '100%',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
                
                <Tooltip content={t('horizontalView')} position="bottom">
                  <motion.button
                    onClick={() => setView('horizontal')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center justify-center flex-1 p-1.5 rounded transition-colors duration-200 z-10 min-w-0"
                  >
                    <LayoutGrid 
                      size={16} 
                      className={`transition-colors duration-200 flex-shrink-0 ${
                        view === 'horizontal' ? 'text-white' : 'text-vscode-text-secondary'
                      }`}
                    />
                  </motion.button>
                </Tooltip>
                <Tooltip content={t('verticalView')} position="bottom">
                  <motion.button
                    onClick={() => setView('vertical')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center justify-center flex-1 p-1.5 rounded transition-colors duration-200 z-10 min-w-0"
                  >
                    <Layout 
                      size={16} 
                      className={`transition-colors duration-200 flex-shrink-0 ${
                        view === 'vertical' ? 'text-white' : 'text-vscode-text-secondary'
                      }`}
                    />
                  </motion.button>
                </Tooltip>
              </div>
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
                placeholder={t('searchTimeline')}
                className="w-full pl-10 pr-8 h-full bg-transparent border-0 outline-none text-sm font-normal text-vscode-text placeholder:text-vscode-text-secondary focus:outline-none focus:ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 p-1 hover:bg-vscode-hover rounded transition-colors flex items-center justify-center"
                >
                  <X size={14} className="text-vscode-text-secondary" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-4 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-vscode-text-secondary" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 h-8 bg-vscode-sidebar border border-vscode-border rounded text-xs text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue"
              >
                {['all', 'education', 'experience', 'project', 'achievement', 'certification'].map(type => (
                  <option key={type} value={type}>
                    {getTypeLabel(type)} ({typeCounts[type] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="text-vscode-text-secondary mx-auto mb-4" size={48} />
            <p className="text-vscode-text-secondary">
              {searchQuery ? t('noEventsFound') : t('noEventsToDisplay')}
            </p>
          </div>
        ) : view === 'horizontal' ? (
          <div className="relative h-[600px] overflow-x-auto overflow-y-visible">
            <div className="relative h-full" style={{ minWidth: `${sortedEvents.length * 300}px`, paddingLeft: '140px', paddingRight: '140px' }}>
              {/* Horizontal Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-vscode-blue via-vscode-blue/50 to-vscode-blue transform -translate-y-1/2" style={{
                boxShadow: '0 0 10px rgba(0, 122, 204, 0.5)',
              }} />

              {/* Events */}
              <div className="relative h-full flex items-center">
                {sortedEvents.map((event, idx) => {
                  const Icon = event.icon
                  const isExpanded = expandedEvents.has(event.id)
                  const totalWidth = sortedEvents.length * 300
                  const availableWidth = totalWidth - 280 // Subtract card width (140px on each side)
                  const left = sortedEvents.length === 1 
                    ? '50%' 
                    : `${140 + (idx / (sortedEvents.length - 1)) * availableWidth}px`

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="absolute transform -translate-x-1/2"
                      style={{ left }}
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-12 h-12 rounded-full ${event.bgColor} border-2 ${event.borderColor} flex items-center justify-center shadow-lg cursor-pointer mx-auto mb-4`}
                        onClick={() => {
                          if (event.description || event.achievements || event.technologies) {
                            toggleExpand(event.id)
                          }
                        }}
                      >
                        <Icon size={20} className={event.iconColor} />
                      </motion.div>

                      {/* Event Card - Positioned above or below */}
                      <div className={`absolute ${idx % 2 === 0 ? 'bottom-full mb-4' : 'top-full mt-4'}`} style={{ width: '280px', left: '50%', transform: 'translateX(-50%)' }}>
                        <div 
                          className={`bg-vscode-sidebar border ${event.borderColor} rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer relative ${
                            isExpanded ? 'border-vscode-blue/50 shadow-xl' : ''
                          }`}
                          onClick={() => {
                            if (event.description || event.achievements || event.technologies) {
                              toggleExpand(event.id)
                            }
                          }}
                        >
                          <div>
                            <h3 className="text-base font-semibold mb-1 text-vscode-text">
                              {event.title}
                            </h3>
                            <p className="text-xs text-vscode-text-secondary mb-2">
                              {event.subtitle}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-vscode-text-secondary flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar size={10} />
                                <span>
                                  {event.date}
                                  {event.endDate && ` - ${event.endDate}`}
                                </span>
                              </div>
                              {event.endDate === 'Present' && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                  <span>{t('ongoing')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
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
                      {events.length} {events.length === 1 ? t('event') : t('events')}
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
                            className={`flex-1 bg-vscode-sidebar border ${event.borderColor} rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer relative ${
                              isExpanded ? 'border-vscode-blue/50 shadow-xl' : ''
                            }`}
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
                                      <span>{t('ongoing')}</span>
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
                                            {t('keyAchievements')}
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
                                            {t('technologies')}
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
            { label: t('totalEvents'), value: timelineEvents.length, icon: Calendar, color: 'text-vscode-blue' },
            { label: t('experience'), value: timelineEvents.filter(e => e.type === 'experience').length, icon: Briefcase, color: 'text-green-400' },
            { label: t('projects'), value: timelineEvents.filter(e => e.type === 'project').length, icon: FolderOpen, color: 'text-purple-400' },
            { label: t('achievements'), value: timelineEvents.filter(e => e.type === 'achievement').length, icon: Trophy, color: 'text-orange-400' },
            { label: t('certifications'), value: timelineEvents.filter(e => e.type === 'certification').length, icon: Award, color: 'text-yellow-400' }
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
