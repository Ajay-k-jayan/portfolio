'use client'

import { Award, ExternalLink, Calendar, Search, ArrowUpDown, LayoutGrid, LayoutList } from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from '../ui/tooltip'
import { useLanguage } from '@/contexts/language-context'

type ViewMode = 'grid' | 'list'

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url: string
}

const certifications: Certification[] = [
  {
    id: '1',
    name: 'Programming with JavaScript',
    issuer: 'Meta, Coursera',
    date: 'Aug 2023',
    url: 'https://www.coursera.org/account/accomplishments/certificate/7CHPEWSYGXD9',
  },
  {
    id: '2',
    name: 'Version Control',
    issuer: 'Meta, Coursera',
    date: 'Aug 2023',
    url: 'https://www.coursera.org/account/accomplishments/certificate/2GZUY2SUXAVB',
  },
  {
    id: '3',
    name: 'Introduction to Front-End Development',
    issuer: 'Meta, Coursera',
    date: 'Jul 2023',
    url: 'https://google.com/',
  },
  {
    id: '4',
    name: 'Modern JavaScript: ES6 Basics',
    issuer: 'Google, Coursera',
    date: 'Jul 2023',
    url: 'https://coursera.org/share/e6eeaf6c1b164db0eea5ab20f68680b9',
  },
  {
    id: '5',
    name: 'React.js Essentials Bootcamp',
    issuer: 'LetsUpgrade',
    date: 'Jun 2023',
    url: 'https://verify.letsupgrade.in/certificate/LUERJSJUN123217',
  },
  {
    id: '6',
    name: 'Regular Expressions in Python',
    issuer: 'Coursera',
    date: 'Sep 2022',
    url: 'https://www.coursera.org/account/accomplishments/certificate/PJJXDR63PLZZ',
  },
  {
    id: '7',
    name: 'Get Started with Figma',
    issuer: 'Coursera',
    date: 'Aug 2022',
    url: 'https://www.coursera.org/account/accomplishments/certificate/TM6KQS57MASK',
  },
  {
    id: '8',
    name: 'AI For Everyone',
    issuer: 'DeepLearning.AI, Coursera',
    date: 'Sep 2020',
    url: 'https://www.coursera.org/account/accomplishments/certificate/27YGB49FSF6Q',
  },
  {
    id: '9',
    name: 'Amazon Web Services (AWS)',
    issuer: 'Amazon Web Services (AWS), Coursera',
    date: 'Sep 2020',
    url: 'https://www.coursera.org/account/accomplishments/certificate/9KLJZPV5CWY6',
  },
  {
    id: '10',
    name: 'Programming for Everybody (Getting Started with Python)',
    issuer: 'University of Michigan, Coursera',
    date: 'Jun 2020',
    url: 'https://www.coursera.org/account/accomplishments/certificate/V6RS8KL44Q5B',
  },
]

export function CertificationsView() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'issuer'>('date')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredAndSorted = useMemo(() => {
    let filtered = certifications.filter((cert) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        cert.name.toLowerCase().includes(searchLower) ||
        cert.issuer.toLowerCase().includes(searchLower) ||
        cert.date.toLowerCase().includes(searchLower)
      )
    })

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          // Parse dates like "Dec 2024", "Jun - Aug 2022"
          const parseDate = (dateStr: string): number => {
            const cleanDate = dateStr.trim()
            
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

  const CertificationCard = ({ cert, index, isListView = false }: { cert: Certification; index: number; isListView?: boolean }) => {
    return (
      <motion.a
        key={cert.id}
        href={cert.url}
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
              <Award className="text-vscode-blue" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors truncate">
                {cert.name}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs text-vscode-text-secondary flex-shrink-0">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{cert.date}</span>
              </div>
              <span>•</span>
              <span className="truncate max-w-[150px]">{cert.issuer}</span>
            </div>
            <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue flex-shrink-0" />
          </>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Award className="text-vscode-blue" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-vscode-text group-hover:text-vscode-blue transition-colors">
                  {cert.name}
                </h4>
                <ExternalLink size={14} className="text-vscode-text-secondary group-hover:text-vscode-blue flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3 text-xs text-vscode-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{cert.date}</span>
                </div>
                <span>•</span>
                <span className="truncate">{cert.issuer}</span>
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue text-[10px] rounded font-medium">
                Certification
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
                  <Award className="text-vscode-blue" size={20} />
                  Certifications
                </h1>
                {/* Count Badge */}
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {certifications.length}
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
                Professional certifications and course completions
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              {/* Grid/List View Toggle */}
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

        {/* Certifications Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAndSorted.map((cert, index) => (
                  <CertificationCard key={cert.id} cert={cert} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredAndSorted.map((cert, index) => (
                  <CertificationCard key={cert.id} cert={cert} index={index} isListView={true} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-vscode-text-secondary">
            <p>No certifications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

