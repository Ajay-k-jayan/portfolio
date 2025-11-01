'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedSearch } from './enhanced-search'
import { SimpleThemeSwitcher } from './simple-theme-switcher'
import { SimpleLanguageSwitcher } from './simple-language-switcher'

export function PortfolioHeader() {
  const [showSearchMobile, setShowSearchMobile] = useState(false)

  return (
    <header className="h-14 bg-vscode-sidebar border-b border-vscode-border flex items-center px-4 relative z-50">
      {/* Left: Portfolio Brand */}
      <div className="flex-shrink-0">
        <motion.h1
          className="text-lg font-bold text-vscode-text tracking-wide"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="text-vscode-blue">Ajay</span>{' '}
          <span className="text-vscode-text">Portfolio</span>
        </motion.h1>
      </div>

      {/* Center: Enhanced Global Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-2xl hidden md:block">
          <EnhancedSearch />
        </div>

        {/* Mobile Search Toggle */}
        <motion.button
          onClick={() => setShowSearchMobile(!showSearchMobile)}
          className="md:hidden ml-2 p-2.5 rounded-lg bg-vscode-active/50 backdrop-blur-sm border border-vscode-border/50 hover:bg-vscode-active text-vscode-text-secondary hover:text-vscode-text transition-all"
          aria-label="Toggle Search"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </motion.button>
      </div>

      {/* Right: Theme & Language Changers */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Simple Theme Switcher */}
        <SimpleThemeSwitcher />
        
        {/* Simple Language Switcher */}
        <SimpleLanguageSwitcher />
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearchMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setShowSearchMobile(false)}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 bg-vscode-sidebar/95 backdrop-blur-xl border-b border-vscode-border p-4 z-50 md:hidden shadow-2xl"
            >
              <EnhancedSearch />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

