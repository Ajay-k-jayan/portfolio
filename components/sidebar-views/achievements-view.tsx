'use client'

import { Trophy, ExternalLink, Calendar, Search, ArrowUpDown, LayoutGrid, LayoutList } from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '../ui/tooltip'
import { useLanguage } from '@/contexts/language-context'
import { ViewSwitcher } from '../ui/view-switcher'

type ViewMode = 'grid' | 'list'

interface Achievement {
  id: string
  name: string
  issuer: string
  date: string
  url: string
  description: string
}

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Beinex Excelencia Award',
    issuer: 'Beinex',
    date: 'Dec 2024',
    url: 'https://www.linkedin.com/posts/ajay-k-jayan_beinex-aurex-excellenceaward-activity-7272685557753737216-j5G5?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADhUQH0B75sHXxuJZHIofzdfcMBiTv5KIp0',
    description: 'Excellence Award for outstanding performance and contribution',
  },
  {
    id: '2',
    name: 'Star Performer in Full Stack Web Development Internship Program',
    issuer: 'Beinex',
    date: 'Jun - Aug 2022',
    url: 'https://academy.beinex.com/certificates/yW0BUsGUQ1UKeiFhPEozwI4Bwk4m?ref',
    description: 'Recognized as Star Performer for exceptional contribution during internship program',
  },
]

export function AchievementsView() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'issuer'>('date')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredAndSorted = useMemo(() => {
    let filtered = achievements.filter((achievement) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        achievement.name.toLowerCase().includes(searchLower) ||
        achievement.issuer.toLowerCase().includes(searchLower) ||
        achievement.date.toLowerCase().includes(searchLower) ||
        achievement.description.toLowerCase().includes(searchLower)
      )
    })

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          // Parse dates like "Dec 2024", "Jun - Aug 2022"
          const parseDate = (dateStr: string): number => {
            // Handle ranges like "Jun - Aug 2022" - use the later date
            const cleanDate = dateStr.includes(' - ') 
              ? dateStr.split(' - ')[1].trim()
              : dateStr.trim()
            
            // Parse month abbreviations
            const months: Record<string, number> = {
              'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
              'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
            }
            
            const parts = cleanDate.split(' ')
            if (parts.length >= 2) {
              const month = months[parts[0].toLowerCase()]
              const year = parseInt(parts[1])
              if (month !== undefined && !isNaN(year)) {
                return new Date(year, month).getTime()
              }
            }
            return 0
          }
          
          return parseDate(b.date) - parseDate(a.date)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'issuer':
          return a.issuer.localeCompare(b.issuer)
        default:
          return 0
      }
    })

    return sorted
  }, [searchQuery, sortBy])

  const AchievementCard = ({ achievement, index, isListView = false }: { achievement: Achievement; index: number; isListView?: boolean }) => {
    return (
      <motion.a
        key={achievement.id}
        href={achievement.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02, duration: 0.2 }}
        className={`relative bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/50 hover:shadow-lg transition-all group cursor-pointer ${
          isListView ? 'p-2.5 rounded flex items-center gap-3' : 'rounded-lg p-4'
        }`}
      >
        {isListView ? (
          <>
            <div className="flex-shrink-0">
              <Trophy className="text-vscode-blue" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors truncate">
                {achievement.name}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs text-vscode-text-secondary flex-shrink-0">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{achievement.date}</span>
              </div>
              <span>•</span>
              <span className="truncate max-w-[150px]">{achievement.issuer}</span>
            </div>
            <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue flex-shrink-0" />
          </>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Trophy className="text-vscode-blue" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">
                  {achievement.name}
                </h4>
                <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3 text-xs text-vscode-text-secondary mb-2">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{achievement.date}</span>
                </div>
                <span>•</span>
                <span className="truncate">{achievement.issuer}</span>
              </div>
              <p className="text-xs text-vscode-text-secondary line-clamp-2 mb-2">
                {achievement.description}
              </p>
              <span className="inline-block px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue text-[10px] rounded font-medium">
                Achievement
              </span>
            </div>
          </div>
        )}
      </motion.a>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <Trophy className="text-vscode-blue" size={20} />
                  {t('achievements')}
                </h1>
                {/* Count Badge */}
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {achievements.length}
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
                Awards and recognitions for outstanding performance
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
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-10 pr-8 bg-vscode-bg border border-vscode-border rounded-sm text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text p-1"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-vscode-text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'issuer')}
              className="h-8 px-3 bg-vscode-bg border border-vscode-border rounded-sm text-sm text-vscode-text focus:outline-none focus:ring-1 focus:ring-vscode-blue"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="issuer">Issuer</option>
            </select>
          </div>
        </div>

        {/* Achievements Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAndSorted.map((achievement, index) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredAndSorted.map((achievement, index) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={index} isListView={true} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-vscode-text-secondary">
            <p>No achievements found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
