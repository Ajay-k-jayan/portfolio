'use client'

import { Calendar, Building2, Briefcase, Search, Filter, X, LayoutGrid, LayoutList } from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '../ui/tooltip'
import { useLanguage } from '@/contexts/language-context'
import { ViewSwitcher } from '../ui/view-switcher'

interface Experience {
  id: string
  title: string
  company: string
  period: string
  location?: string
  description: string
  achievements: string[]
  technologies: string[]
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Beinex',
    period: 'Sep 2023 – Present',
    location: 'Kerala, India',
    description: 'Leading front-end development initiatives with focus on scalable dashboards, AI-driven workflows, and real-time analytics.',
    achievements: [
      'Developed scalable dashboards and reporting modules with rich user experiences.',
      'Integrated AI-driven workflows using WebSockets for real-time data analytics.',
      'Collaborated with AI and backend teams to enhance predictive analytics and performance.',
      'Conducted mentoring sessions for junior developers to promote Angular best practices.',
    ],
    technologies: ['Angular', 'TypeScript', 'WebSockets', 'D3.js', 'AI Integration'],
  },
  {
    id: '2',
    title: 'Associate Software Engineer',
    company: 'Beinex',
    period: 'Sep 2022 – Sep 2023',
    location: 'Kerala, India',
    description: 'Built interactive data visualizations and optimized web application performance through modular component architecture.',
    achievements: [
      'Built interactive data visualizations using D3.js and Angular material tree components.',
      'Created modular, reusable components to maintain consistent design and faster performance.',
      'Introduced lazy loading and caching to enhance web app speed and reliability.',
    ],
    technologies: ['Angular', 'D3.js', 'Angular Material', 'Performance Optimization'],
  },
  {
    id: '3',
    title: 'Full Stack Developer Intern',
    company: 'Beinex',
    period: 'Jun 2022 – Sep 2022',
    location: 'Kerala, India',
    description: 'Developed full-stack applications and contributed to team success, recognized as Star Performer.',
    achievements: [
      'Built full-stack applications using Python Django (backend) and Angular (frontend).',
      'Designed responsive UIs, integrated RESTful APIs, and maintained MySQL databases.',
      'Recognized as a Star Performer for exceptional contribution.',
    ],
    technologies: ['Angular', 'Python', 'Django', 'MySQL', 'RESTful APIs'],
  },
]

type SortOption = 'period-desc' | 'period-asc' | 'company-asc' | 'company-desc' | 'title-asc' | 'title-desc'
type ViewMode = 'grid' | 'list' | 'network'

export function ExperienceTab() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('period-desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Filter and sort experiences
  const filteredAndSortedExperiences = useMemo(() => {
    let filtered = experiences

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(query) ||
        exp.company.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.technologies.some(tech => tech.toLowerCase().includes(query)) ||
        exp.achievements.some(ach => ach.toLowerCase().includes(query)) ||
        (exp.location && exp.location.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'period-desc':
          // Parse periods - extract year for comparison
          const getYear = (period: string) => {
            const match = period.match(/(\d{4})/)
            return match ? parseInt(match[1]) : 0
          }
          return getYear(b.period) - getYear(a.period)
        case 'period-asc':
          const getYearAsc = (period: string) => {
            const match = period.match(/(\d{4})/)
            return match ? parseInt(match[1]) : 0
          }
          return getYearAsc(a.period) - getYearAsc(b.period)
        case 'company-asc':
          return a.company.localeCompare(b.company)
        case 'company-desc':
          return b.company.localeCompare(a.company)
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return sorted
  }, [searchQuery, sortBy])

  return (
    <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <Briefcase className="text-vscode-blue" size={20} />
                  {t('experience')}
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {experiences.length}
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
              <p className="text-sm text-vscode-text-secondary mt-1">
                {t('experiencePageDescription')}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <ViewSwitcher
                viewMode={viewMode}
                onViewChange={(mode) => setViewMode(mode)}
                options="grid-list"
              />
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={16} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-10 pr-8 bg-vscode-sidebar border border-vscode-border rounded-sm text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-1 focus:ring-vscode-blue"
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-8 px-3 bg-vscode-sidebar border border-vscode-border rounded-sm text-sm text-vscode-text focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            >
              <option value="period-desc">{t('sortByPeriod')} ({t('newest')})</option>
              <option value="period-asc">{t('sortByPeriod')} ({t('oldest')})</option>
              <option value="company-asc">{t('sortByCompany')} (A-Z)</option>
              <option value="company-desc">{t('sortByCompany')} (Z-A)</option>
              <option value="title-asc">{t('sortByTitle')} (A-Z)</option>
              <option value="title-desc">{t('sortByTitle')} (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Experience Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredAndSortedExperiences.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vscode-sidebar border border-vscode-border flex items-center justify-center">
                  <Briefcase className="text-vscode-text-secondary" size={40} />
                </div>
                <p className="text-vscode-text-secondary text-base">
                  {searchQuery ? t('noExperienceFound') : t('noExperienceAvailable')}
                </p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAndSortedExperiences.map((experience, index) => {
                  const isExpanded = expandedId === experience.id
                  return (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                    >
                      {/* Header - Compact */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Building2 className="text-vscode-blue flex-shrink-0" size={14} />
                            <h3 className="font-semibold text-vscode-text text-sm">
                              {experience.title}
                            </h3>
                          </div>
                          <p className="text-vscode-green font-medium text-xs mb-1 ml-5">
                            {experience.company}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap ml-5">
                            <div className="flex items-center gap-1 text-[10px] text-vscode-text-secondary">
                              <Calendar size={9} />
                              <span>{experience.period}</span>
                            </div>
                            {experience.location && (
                              <div className="flex items-center gap-1 text-[10px] text-vscode-text-secondary">
                                <span>📍</span>
                                <span className="truncate max-w-[80px]">{experience.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-vscode-text-secondary text-xs leading-relaxed mb-2 ml-5 line-clamp-2">
                        {experience.description}
                      </p>

                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2 ml-5">
                        {experience.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 bg-vscode-blue/10 text-vscode-blue text-[10px] rounded border border-vscode-blue/20"
                          >
                            {tech.length > 12 ? tech.substring(0, 12) + '...' : tech}
                          </span>
                        ))}
                        {experience.technologies.length > 4 && (
                          <span className="px-1.5 py-0.5 bg-vscode-sidebar text-vscode-text-secondary text-[10px] rounded border border-vscode-border">
                            +{experience.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Expandable Achievements */}
                      <div className="ml-5 mt-auto">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : experience.id)}
                          className="text-[10px] text-vscode-blue hover:text-vscode-blue-accent transition-colors flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'Show'} Achievements</span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.span>
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 pt-2 border-t border-vscode-border"
                          >
                            <h4 className="text-[10px] font-semibold text-vscode-text mb-1.5">Key Achievements:</h4>
                            <ul className="space-y-1">
                              {experience.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-[10px] text-vscode-text-secondary">
                                  <span className="text-vscode-blue mt-0.5 flex-shrink-0">▹</span>
                                  <span className="line-clamp-2">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedExperiences.map((experience, index) => {
                  const isExpanded = expandedId === experience.id
                  return (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header - Compact */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="text-vscode-blue flex-shrink-0" size={18} />
                            <h3 className="font-semibold text-vscode-text text-base">
                              {experience.title}
                            </h3>
                          </div>
                          <p className="text-vscode-green font-medium text-sm mb-1 ml-6">
                            {experience.company}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap ml-6">
                            <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                              <Calendar size={11} />
                              <span>{experience.period}</span>
                            </div>
                            {experience.location && (
                              <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                                <span>📍</span>
                                <span>{experience.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-vscode-text-secondary text-sm leading-relaxed mb-3 ml-6">
                        {experience.description}
                      </p>

                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-2 mb-3 ml-6">
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-vscode-blue/10 text-vscode-blue text-xs rounded border border-vscode-blue/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Achievements */}
                      <div className="ml-6">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : experience.id)}
                          className="text-xs text-vscode-blue hover:text-vscode-blue-accent transition-colors flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'Show'} Achievements</span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.span>
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-vscode-border"
                          >
                            <h4 className="text-xs font-semibold text-vscode-text mb-2">Key Achievements:</h4>
                            <ul className="space-y-1.5">
                              {experience.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-vscode-text-secondary">
                                  <span className="text-vscode-blue mt-1 flex-shrink-0">▹</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
