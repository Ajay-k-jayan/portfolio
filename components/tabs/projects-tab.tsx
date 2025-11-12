'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, Github, FolderOpen, Code2, Search, Filter, X, LayoutGrid, LayoutList, Calendar } from 'lucide-react'
import { CodePreview } from '@/components/code-preview'
import { LiveDemo } from '@/components/live-demo'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '../ui/tooltip'
import { useLanguage } from '@/contexts/language-context'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  codePreview?: string
  image?: string
  period?: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Aurex (Augmented Risk and Audit Analytics)',
    description: 'Developed a cloud-based analytics platform integrating risk management, audit management, and continuous audit processes. Leveraged Angular for front-end visualization and implemented secure, responsive reporting dashboards with seamless data integration.',
    technologies: ['Angular', 'TypeScript', 'D3.js', 'Angular Material', 'WebSockets', 'RESTful APIs'],
    period: 'Sep 2022 – Present',
    codePreview: `// Angular component for dashboard visualization
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-aurex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AurexDashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  
  ngOnInit() {
    this.loadAnalyticsData();
  }
  
  loadAnalyticsData() {
    this.dashboardService.getRiskMetrics()
      .subscribe(data => this.updateVisualizations(data));
  }
}`,
  },
]

type SortOption = 'title-asc' | 'title-desc' | 'period-desc' | 'period-asc'
type ViewMode = 'grid' | 'list'

export function ProjectsTab() {
  const { t } = useLanguage()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [showCodePreview, setShowCodePreview] = useState<string | null>(null)
  const [showLiveDemo, setShowLiveDemo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('period-desc')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'period-desc':
          // Parse periods - extract year for comparison
          const getYear = (period?: string) => {
            if (!period) return 0
            const match = period.match(/(\d{4})/)
            return match ? parseInt(match[1]) : 0
          }
          return getYear(b.period) - getYear(a.period)
        case 'period-asc':
          const getYearAsc = (period?: string) => {
            if (!period) return 0
            const match = period.match(/(\d{4})/)
            return match ? parseInt(match[1]) : 0
          }
          return getYearAsc(a.period) - getYearAsc(b.period)
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
                  <FolderOpen className="text-vscode-blue" size={20} />
                  {t('featuredProjects')}
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {projects.length}
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
                {t('projectsPageDescription')}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              {/* Grid/List View Toggle */}
              <Tooltip content={viewMode === 'grid' ? t('listView') : t('gridView')} position="bottom">
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

        {/* Search and Sort */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search"
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
              <option value="period-desc">Period (Newest)</option>
              <option value="period-asc">Period (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredAndSortedProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vscode-sidebar border border-vscode-border flex items-center justify-center">
                  <FolderOpen className="text-vscode-text-secondary" size={40} />
                </div>
                <p className="text-vscode-text-secondary text-base">
                  {searchQuery ? 'No projects found matching your search.' : 'No projects available.'}
                </p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAndSortedProjects.map((project, index) => {
                  const isExpanded = expandedProject === project.id
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-vscode-text text-sm mb-1 line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-vscode-text-secondary text-xs leading-relaxed mb-2 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 bg-vscode-blue/10 text-vscode-blue text-[10px] rounded border border-vscode-blue/20"
                          >
                            {tech.length > 10 ? tech.substring(0, 10) + '...' : tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-vscode-sidebar text-vscode-text-secondary text-[10px] rounded border border-vscode-border">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-[10px] rounded transition-colors"
                          >
                            <Github size={10} />
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-vscode-blue hover:bg-blue-600 text-white text-[10px] rounded transition-colors"
                          >
                            <ExternalLink size={10} />
                            <span>Live</span>
                          </a>
                        )}
                        {project.codePreview && (
                          <button
                            onClick={() => setShowCodePreview(project.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-[10px] rounded transition-colors"
                          >
                            <Code2 size={10} />
                            <span>Code</span>
                          </button>
                        )}
                      </div>

                      {/* Period at the bottom */}
                      {project.period && (
                        <div className="flex items-center gap-1 text-[10px] text-vscode-text-secondary mt-auto pt-2 border-t border-vscode-border">
                          <Calendar size={9} />
                          <span>{project.period}</span>
                        </div>
                      )}

                      {/* Expandable Code Preview */}
                      {isExpanded && project.codePreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 pt-2 border-t border-vscode-border"
                        >
                          <button
                            onClick={() => setExpandedProject(null)}
                            className="text-[10px] text-vscode-blue hover:text-vscode-blue-accent mb-2"
                          >
                            Hide Code
                          </button>
                          <pre className="text-[9px] text-vscode-orange bg-vscode-active p-2 rounded overflow-x-auto">
                            <code>{project.codePreview}</code>
                          </pre>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedProjects.map((project, index) => {
                  const isExpanded = expandedProject === project.id
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FolderOpen className="text-vscode-blue flex-shrink-0" size={18} />
                            <h3 className="font-semibold text-vscode-text text-base">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-vscode-text-secondary text-sm leading-relaxed mb-3 ml-6">
                        {project.description}
                      </p>

                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-2 mb-3 ml-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-vscode-blue/10 text-vscode-blue text-xs rounded border border-vscode-blue/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-3 ml-6">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
                          >
                            <Github size={14} />
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blue hover:bg-blue-600 text-white text-sm rounded transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {project.codePreview && (
                          <button
                            onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
                          >
                            <Code2 size={14} />
                            <span>Code</span>
                          </button>
                        )}
                      </div>

                      {/* Period at the bottom */}
                      {project.period && (
                        <div className="flex items-center gap-1 text-xs text-vscode-text-secondary ml-6 pt-3 border-t border-vscode-border">
                          <Calendar size={11} />
                          <span>{project.period}</span>
                        </div>
                      )}

                      {/* Expandable Code Preview */}
                      {isExpanded && project.codePreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-vscode-border ml-6"
                        >
                          <pre className="text-xs text-vscode-orange bg-vscode-active p-3 rounded overflow-x-auto">
                            <code>{project.codePreview}</code>
                          </pre>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {showCodePreview && (
        <CodePreview
          projectId={showCodePreview}
          code={projects.find(p => p.id === showCodePreview)?.codePreview || ''}
          onClose={() => setShowCodePreview(null)}
        />
      )}
      {showLiveDemo && (
        <LiveDemo
          projectId={showLiveDemo}
          url={projects.find(p => p.id === showLiveDemo)?.liveUrl || ''}
          onClose={() => setShowLiveDemo(null)}
        />
      )}
    </div>
  )
}
