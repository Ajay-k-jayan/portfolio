'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, Code, BookOpen, User, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

interface SearchResult {
  id: string
  type: 'project' | 'skill' | 'blog' | 'page'
  title: string
  description?: string
  url?: string
}

// Mock search data - replace with real data source
const searchableContent: SearchResult[] = [
  { id: '1', type: 'project', title: 'Aurex Analytics Platform', description: 'Risk management and audit analytics', url: '/projects' },
  { id: '2', type: 'skill', title: 'Angular', description: 'Frontend framework expertise', url: '/skills' },
  { id: '3', type: 'skill', title: 'TypeScript', description: 'Type-safe JavaScript', url: '/skills' },
  { id: '4', type: 'blog', title: 'Building Modern Web Apps', description: 'Next.js 14 features', url: '/blog' },
  { id: '5', type: 'page', title: 'About Me', description: 'My background and experience', url: '/about' },
  { id: '6', type: 'project', title: 'E-Commerce Platform', description: 'Full-featured shopping experience', url: '/projects' },
]

const typeIcons = {
  project: Code,
  skill: Sparkles,
  blog: BookOpen,
  page: User,
}

const typeLabels = {
  project: 'Project',
  skill: 'Skill',
  blog: 'Blog',
  page: 'Page',
}

export function EnhancedSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchableContent.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered.slice(0, 6))
    } else {
      setResults([])
    }
    setSelectedIndex(-1)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false)
        inputRef.current?.blur()
      } else if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp' && results.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault()
        handleResultClick(results[selectedIndex])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [results, selectedIndex])

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      // Navigate to result
      window.location.href = result.url
    }
    setQuery('')
    setIsFocused(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative group">
        {/* Acrylic Background with Gradient */}
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
            isFocused
              ? 'bg-gradient-to-r from-vscode-blue/20 via-vscode-blue/10 to-transparent backdrop-blur-md border border-vscode-blue/30 shadow-lg shadow-vscode-blue/20'
              : 'bg-vscode-active/80 backdrop-blur-sm border border-vscode-border/50'
          }`}
          style={{
            background: isFocused
              ? 'linear-gradient(135deg, rgba(0, 122, 204, 0.15) 0%, rgba(0, 122, 204, 0.05) 100%)'
              : undefined,
          }}
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Search
            size={18}
            className={`transition-colors duration-300 ${
              isFocused ? 'text-vscode-blue' : 'text-vscode-text-secondary'
            }`}
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={t('searchPlaceholder') || 'Search projects, skills, blog…'}
          className="relative w-full bg-transparent border-0 rounded-xl pl-11 pr-10 py-2.5 text-sm text-vscode-text placeholder-vscode-text-secondary/60 focus:outline-none font-medium transition-all duration-300"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />

        {/* Clear Button */}
        {query && (
          <motion.button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-md hover:bg-vscode-hover/50 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} className="text-vscode-text-secondary hover:text-vscode-text" />
          </motion.button>
        )}

        {/* Focus Ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.4), 0 4px 12px rgba(0, 122, 204, 0.15)',
            }}
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-full bg-vscode-sidebar/95 backdrop-blur-xl border border-vscode-border rounded-xl shadow-2xl overflow-hidden z-50"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 122, 204, 0.1)',
            }}
          >
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type]
                const isSelected = index === selectedIndex

                return (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-vscode-blue/20 border-l-2 border-l-vscode-blue'
                        : 'hover:bg-vscode-active/50'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-vscode-blue/30' : 'bg-vscode-active'}`}>
                      <Icon
                        size={16}
                        className={isSelected ? 'text-vscode-blue' : 'text-vscode-text-secondary'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-vscode-text-secondary uppercase tracking-wide">
                          {typeLabels[result.type]}
                        </span>
                        <span className="text-xs text-vscode-text-secondary">•</span>
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? 'text-vscode-blue' : 'text-vscode-text'
                          }`}
                        >
                          {result.title}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-xs text-vscode-text-secondary line-clamp-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-vscode-active/50 border-t border-vscode-border text-xs text-vscode-text-secondary flex items-center justify-between">
              <span>Navigate with ↑↓ or mouse</span>
              <span>Press Enter to open</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results Message */}
      <AnimatePresence>
        {isFocused && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-vscode-sidebar/95 backdrop-blur-xl border border-vscode-border rounded-xl shadow-2xl p-6 text-center z-50"
          >
            <p className="text-sm text-vscode-text-secondary">
              No results found for &quot;{query}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

