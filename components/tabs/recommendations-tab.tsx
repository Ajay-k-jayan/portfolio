'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Quote, 
  Linkedin, 
  Building2, 
  Calendar,
  ExternalLink,
  MessageSquare,
  ArrowUpRight,
  Search,
  Filter,
  X,
  LayoutGrid,
  LayoutList
} from 'lucide-react'
import { Tooltip } from '../ui/tooltip'
import { recommendationsData } from '@/lib/recommendations-data'
import { useLanguage } from '@/contexts/language-context'
import { ViewSwitcher } from '../ui/view-switcher'

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'
type ViewMode = 'grid' | 'list'

export function RecommendationsTab() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Filter and sort recommendations
  const filteredAndSortedRecommendations = useMemo(() => {
    let filtered = recommendationsData

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(rec => 
        rec.name.toLowerCase().includes(query) ||
        rec.position.toLowerCase().includes(query) ||
        rec.quote.toLowerCase().includes(query) ||
        (rec.company && rec.company.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
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
                  <MessageSquare className="text-vscode-blue" size={20} />
                  {t('recommendations')}
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {recommendationsData.length}
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
                Testimonials and recommendations from colleagues, managers, and collaborators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewSwitcher
                viewMode={viewMode}
                onViewChange={(mode) => setViewMode(mode)}
                options="grid-list"
              />
              <motion.a
                href="https://www.linkedin.com/in/ajay-k-jayan/details/recommendations/?detailScreenTabIndex=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vscode-blue text-white hover:bg-vscode-blue-accent transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={16} />
                <span>View on LinkedIn</span>
                <ArrowUpRight size={14} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Search and Sort - Same style as Skills Tab */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
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

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-vscode-text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-8 px-3 bg-vscode-sidebar border border-vscode-border rounded-sm text-sm text-vscode-text focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Recommendations Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredAndSortedRecommendations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vscode-sidebar border border-vscode-border flex items-center justify-center">
                  <MessageSquare className="text-vscode-text-secondary" size={40} />
                </div>
                <p className="text-vscode-text-secondary text-base">
                  {searchQuery ? 'No recommendations found matching your search.' : 'No recommendations available.'}
                </p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAndSortedRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  >
                    {/* User Details - Compact Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-vscode-text text-sm mb-1">
                          {recommendation.name}
                        </h3>
                        <p className="text-xs text-vscode-text-secondary mb-1">
                          {recommendation.position}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {recommendation.company && 
                           recommendation.company.toLowerCase() !== 'current company' && 
                           recommendation.company.toLowerCase() !== 'company name' && (
                            <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                              {recommendation.companyUrl ? (
                                <a
                                  href={recommendation.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-vscode-blue hover:text-vscode-blue-accent transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Building2 size={10} />
                                  <span className="truncate max-w-[100px]">{recommendation.company}</span>
                                </a>
                              ) : (
                                <>
                                  <Building2 size={10} />
                                  <span className="truncate max-w-[100px]">{recommendation.company}</span>
                                </>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                            <Calendar size={10} />
                            <span>{new Date(recommendation.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quote Text - Compact */}
                    <div className="flex items-start gap-2 flex-1">
                      <div className="p-1 bg-vscode-blue/10 rounded flex-shrink-0 mt-0.5">
                        <Quote className="text-vscode-blue" size={12} />
                      </div>
                      <blockquote className="text-vscode-text text-xs leading-relaxed whitespace-pre-wrap flex-1 line-clamp-4">
                        &ldquo;{recommendation.quote}&rdquo;
                      </blockquote>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-blue/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* User Details - Compact Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-vscode-text text-base mb-1">
                          {recommendation.name}
                        </h3>
                        <p className="text-xs text-vscode-text-secondary mb-1">
                          {recommendation.position}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {recommendation.company && 
                           recommendation.company.toLowerCase() !== 'current company' && 
                           recommendation.company.toLowerCase() !== 'company name' && (
                            <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                              {recommendation.companyUrl ? (
                                <a
                                  href={recommendation.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-vscode-blue hover:text-vscode-blue-accent transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Building2 size={11} />
                                  <span>{recommendation.company}</span>
                                </a>
                              ) : (
                                <>
                                  <Building2 size={11} />
                                  <span>{recommendation.company}</span>
                                </>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                            <Calendar size={11} />
                            <span>{new Date(recommendation.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quote Text - Compact */}
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-vscode-blue/10 rounded flex-shrink-0 mt-0.5">
                        <Quote className="text-vscode-blue" size={14} />
                      </div>
                      <blockquote className="text-vscode-text text-sm leading-relaxed whitespace-pre-wrap flex-1">
                        &ldquo;{recommendation.quote}&rdquo;
                      </blockquote>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
