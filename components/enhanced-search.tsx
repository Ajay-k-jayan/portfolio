'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, FileText, Code, Briefcase, BookOpen, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
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
  project: Briefcase,
  skill: Code,
  blog: BookOpen,
  page: FileText,
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
      {/* Search Input - Dark Theme Design matching the image */}
      <div className="relative">
        <div
          className={`relative rounded-xl transition-all duration-300 ${
            isFocused
              ? 'ring-2 ring-vscode-blue/50 shadow-lg shadow-vscode-blue/20'
              : 'shadow-md'
          }`}
          style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #4A4A4A',
          }}
        >
          {/* Magnifying Glass Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search
              size={18}
              style={{ 
                color: isFocused ? '#007acc' : '#CCCCCC'
              }}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={t('searchPlaceholder') || 'Search'}
            className="w-full pl-12 pr-10 py-3 bg-transparent border-0 outline-none text-sm font-normal"
            style={{
              color: '#CCCCCC',
            }}
          />

          {/* Clear Button */}
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-vscode-hover transition-colors"
              style={{ color: '#CCCCCC' }}
            >
              <X size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #4A4A4A',
            }}
          >
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type]
                const isSelected = index === selectedIndex
                return (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-vscode-blue/20'
                        : 'hover:bg-vscode-hover'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(0, 122, 204, 0.2)' : 'transparent',
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: isSelected ? '#007acc' : '#CCCCCC',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium mb-0.5"
                        style={{
                          color: isSelected ? '#007acc' : '#CCCCCC',
                        }}
                      >
                        {result.title}
                      </div>
                      {result.description && (
                        <div
                          className="text-xs"
                          style={{ color: '#858585' }}
                        >
                          {result.description}
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {isFocused && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 p-4 text-center"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #4A4A4A',
            }}
          >
            <div style={{ color: '#858585' }} className="text-sm">
              No results found for &quot;{query}&quot;
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
