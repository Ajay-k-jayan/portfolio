'use client'

import { useState, useMemo } from 'react'
import { FolderOpen, Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { ViewSwitcher } from '../ui/view-switcher'
import { useAppStore } from '@/lib/store'
import { 
  pageTransition, 
  staggerContainer, 
  slideUp,
  fadeIn,
  useMotionConfig 
} from '@/lib/motionConfig'
import { EnhancedProjectCard } from '@/components/projects/enhanced-project-card'
import { ProjectDetailModal } from '@/components/projects/project-detail-modal'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { portfolioData } from '@/lib/portfolio-data'

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


type SortOption = 'title-asc' | 'title-desc' | 'period-desc' | 'period-asc'
type ViewMode = 'grid' | 'list'

export function ProjectsTab() {
  const { t } = useLanguage()
  const { portfolioSettings } = useAppStore()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('period-desc')
  const [viewMode, setViewMode] = useState<ViewMode>(portfolioSettings.gridLayout as ViewMode || 'grid')
  const { variants } = useMotionConfig(portfolioSettings.animationSpeed)
  
  // Scroll-triggered animations
  const headerRef = useScrollAnimation({ once: true, amount: 0.3 })
  const descriptionRef = useScrollAnimation({ once: true, amount: 0.3 })
  const gridRef = useScrollAnimation({ once: false, amount: 0.2 })

  // Map portfolioData projects to Project interface (inside component for reactivity)
  const projects: Project[] = useMemo(() => {
    if (!portfolioData?.projects || portfolioData.projects.length === 0) {
      return []
    }
    
    return portfolioData.projects.map((project: any) => ({
      id: project.id || '',
      title: project.title || project.name || 'Untitled Project',
      description: project.description || '',
      technologies: project.technologies || [],
      period: project.period || '',
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl || project.url,
      codePreview: project.codePreview,
      image: project.image,
      // Add code preview for Aurex project
      ...(project.id === '1' && {
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
      }),
    }))
  }, [])

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
  }, [projects, searchQuery, sortBy])

  return (
      <motion.div 
        className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto"
        variants={variants(pageTransition, portfolioSettings.showAnimations)}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="max-w-7xl mx-auto p-6">
        {/* Header with scroll-triggered animation */}
        <motion.div 
          ref={headerRef.ref}
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={headerRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <FolderOpen className="text-vscode-blue" size={20} />
                  {t('projects')}
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
            </div>
            <div className="flex items-center gap-1 ml-4">
              <ViewSwitcher
                viewMode={viewMode}
                onViewChange={(mode) => setViewMode(mode)}
                options="grid-list"
              />
            </div>
          </div>
        </motion.div>

        {/* Description with scroll-triggered animation */}
        <motion.p
          ref={descriptionRef.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={descriptionRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm text-vscode-text-secondary mb-6"
        >
          {t('projectsPageDescription')}
        </motion.p>

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
              <option value="title-asc">{t('sortByTitle')} (A-Z)</option>
              <option value="title-desc">{t('sortByTitle')} (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={variants(fadeIn, portfolioSettings.showAnimations)}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                <p className="text-vscode-text-secondary text-base mb-2">
                  {searchQuery ? t('noProjectsFound') : t('noProjectsAvailable')}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-vscode-blue hover:text-vscode-blue-accent text-sm transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={variants(staggerContainer, portfolioSettings.showAnimations)}
                initial="hidden"
                animate={gridRef.isInView ? "visible" : "hidden"}
              >
                {filteredAndSortedProjects.map((project, index) => (
                  <EnhancedProjectCard
                    key={project.id}
                    project={project}
                    onCardClick={setSelectedProject}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-3"
                variants={variants(staggerContainer, portfolioSettings.showAnimations)}
                initial="hidden"
                animate={gridRef.isInView ? "visible" : "hidden"}
              >
                {filteredAndSortedProjects.map((project, index) => (
                  <EnhancedProjectCard
                    key={project.id}
                    project={project}
                    onCardClick={setSelectedProject}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </motion.div>
  )
}
