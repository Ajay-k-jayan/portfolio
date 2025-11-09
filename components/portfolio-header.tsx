'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedSearch } from './enhanced-search'
import { SimpleThemeSwitcher } from './simple-theme-switcher'
import { SimpleLanguageSwitcher } from './simple-language-switcher'
import { AIChatbot } from './ai-chatbot'
import { VoiceAssistant } from './voice-assistant'
import { Sparkles, Mic, Search } from 'lucide-react'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'
import { MobileMenuButton } from './new-sidebar'

export function PortfolioHeader() {
  const { portfolioSettings, mobileMenuOpen, setMobileMenuOpen } = useAppStore()
  const [showSearchMobile, setShowSearchMobile] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)

  // Listen for openChat event from search
  useEffect(() => {
    const handleOpenChat = () => {
      setShowChatbot(true)
    }
    
    window.addEventListener('openChat', handleOpenChat)
    return () => window.removeEventListener('openChat', handleOpenChat)
  }, [])

  // Listen for voice assistant state changes
  useEffect(() => {
    const checkVoiceState = () => {
      const listening = (window as any).isVoiceListening
      if (listening !== undefined) {
        setIsVoiceListening(listening)
      }
    }
    
    const interval = setInterval(checkVoiceState, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center justify-between px-3 py-1.5 relative z-50">
        {/* Left: Mobile Menu Button + Portfolio Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <MobileMenuButton 
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <h1 className="text-sm font-semibold text-vscode-text">
            <span className="text-vscode-blue">Ajay</span>{' '}
            <span className="text-vscode-text">Portfolio</span>
          </h1>
        </div>

        {/* Center: Enhanced Global Search Bar with AI Assistant (Desktop Only) */}
        <div className="flex-1 flex justify-center px-3 hidden md:flex">
          <div className="w-full max-w-2xl flex items-center gap-2 justify-center">
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
            <Tooltip content={isVoiceListening ? "Stop Listening" : "Voice Assistant"} position="bottom">
              <motion.button
                onClick={() => {
                  const trigger = (window as any).triggerVoiceAssistant
                  if (trigger) {
                    trigger()
                  }
                }}
                className={`p-2 rounded hover:bg-vscode-active transition-colors relative ${
                  isVoiceListening 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-vscode-text-secondary hover:text-vscode-text'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isVoiceListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: isVoiceListening ? Infinity : 0, duration: 1 }}
              >
                <Mic size={18} />
                {isVoiceListening && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.button>
            </Tooltip>
          </div>
        </div>

        {/* Right: Theme, Language & Search (Mobile) */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <motion.button
            onClick={() => setShowSearchMobile(!showSearchMobile)}
            className="md:hidden p-2 rounded hover:bg-vscode-active text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Toggle Search"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={18} />
          </motion.button>

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

