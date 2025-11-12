'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SimpleSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SimpleSearch({ 
  placeholder = 'Search...', 
  onSearch,
  className = '' 
}: SimpleSearchProps) {
  const [query, setQuery] = useState('')

  const handleChange = (value: string) => {
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const clearSearch = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-sm h-8 flex items-center border border-vscode-border bg-vscode-sidebar transition-colors">
        <Search
          size={16}
          className="absolute left-3 text-vscode-text-secondary pointer-events-none z-10"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 h-full bg-transparent border-0 outline-none text-sm font-normal text-vscode-text placeholder:text-vscode-text-secondary focus:outline-none focus:ring-0"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearSearch}
            className="absolute right-2 p-1 hover:bg-vscode-hover rounded transition-colors flex items-center justify-center"
          >
            <X size={14} className="text-vscode-text-secondary" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

