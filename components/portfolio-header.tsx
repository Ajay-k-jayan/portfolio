'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedSearch } from './enhanced-search'
import { SimpleThemeSwitcher } from './simple-theme-switcher'
import { SimpleLanguageSwitcher } from './simple-language-switcher'
import { AIChatbot } from './ai-chatbot'
import { VoiceAssistant } from './voice-assistant'
import { Sparkles, Mic } from 'lucide-react'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'

export function PortfolioHeader() {
  const { portfolioSettings } = useAppStore()
  const [showSearchMobile, setShowSearchMobile] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <>
      <header className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center px-3 py-1.5 relative z-50">
        {/* Left: Portfolio Brand */}
        <div className="flex-shrink-0">
          <h1 className="text-sm font-semibold text-vscode-text">
            <span className="text-vscode-blue">Ajay</span>{' '}
            <span className="text-vscode-text">Portfolio</span>
          </h1>
        </div>

        {/* Center: Enhanced Global Search Bar with AI Assistant */}
        <div className="flex-1 flex justify-center px-3">
          <div className="w-full max-w-2xl hidden md:flex items-center gap-2 justify-center">
            <div className="flex-1 max-w-md">
              <EnhancedSearch />
            </div>
            
            {/* AI Chatbot Button */}
            <Tooltip content="AI Assistant" position="bottom">
              <motion.button
                onClick={() => setShowChatbot(!showChatbot)}
                className={`p-2 rounded hover:bg-vscode-active transition-colors ${
                  showChatbot ? 'bg-vscode-active text-vscode-blue' : 'text-vscode-text-secondary hover:text-vscode-text'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={18} />
              </motion.button>
            </Tooltip>

            {/* Voice Assistant Button */}
            <Tooltip content="Voice Assistant" position="bottom">
              <motion.button
                onClick={() => {
                  const trigger = (window as any).triggerVoiceAssistant
                  if (trigger) {
                    trigger()
                  }
                }}
                className="p-2 rounded hover:bg-vscode-active text-vscode-text-secondary hover:text-vscode-text transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic size={18} />
              </motion.button>
            </Tooltip>
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
          {portfolioSettings.showThemeSwitcher && <SimpleThemeSwitcher />}
          
          {/* Simple Language Switcher */}
          {portfolioSettings.showLanguageSwitcher && <SimpleLanguageSwitcher />}
        </div>
      </header>

      {/* Voice Assistant Component (invisible button, handles voice recognition) */}
      <VoiceAssistant onTriggerClick={() => {}} />

      {/* AI Chatbot Panel */}
      <AnimatePresence>
        {showChatbot && (
          <AIChatbot onClose={() => setShowChatbot(false)} />
        )}
      </AnimatePresence>

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
    </>
  )
}

