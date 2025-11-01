'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor, Palette } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { AdvancedThemeSelector } from './advanced-theme-selector'
import { motion, AnimatePresence } from 'framer-motion'

type ThemeOption = 'dark' | 'light' | 'system' | 'custom'

export function EnhancedThemeSwitcher() {
  const { currentTheme, setTheme } = useEnhancedTheme()
  const [showMenu, setShowMenu] = useState(false)

  const themes: Array<{ id: ThemeOption; label: string; icon: typeof Moon; description: string }> = [
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
    { id: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follow system' },
  ]

  const handleThemeChange = (newTheme: ThemeOption) => {
    if (newTheme === 'system') {
      // For system, we'd need to implement system theme detection
      // For now, just switch to the system's current preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(newTheme)
    }
    setShowMenu(false)
  }

  const getActiveIcon = () => {
    if (currentTheme.id === 'system') return Monitor
    if (currentTheme.id.includes('custom')) return Palette
    if (currentTheme.type === 'light') return Sun
    return Moon
  }

  const ActiveIcon = getActiveIcon()

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="relative p-2.5 rounded-lg bg-vscode-active/50 backdrop-blur-sm border border-vscode-border/50 hover:bg-vscode-active hover:border-vscode-border transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
      >
        {/* Animated Background Glow */}
        {showMenu && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-vscode-blue/20 to-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Icon with Smooth Rotation */}
        <motion.div
          animate={{
            rotate: showMenu ? 180 : 0,
            scale: showMenu ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <ActiveIcon
            size={18}
            className={`transition-colors duration-300 ${
              currentTheme.id === 'system'
                ? 'text-purple-400'
                : currentTheme.type === 'light'
                ? 'text-yellow-400'
                : currentTheme.id.includes('custom')
                ? 'text-purple-400'
                : 'text-vscode-blue'
            }`}
          />
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-vscode-blue/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Theme Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 bg-vscode-sidebar/95 backdrop-blur-xl border border-vscode-border rounded-xl shadow-2xl py-1.5 min-w-[160px] z-50 overflow-hidden"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 122, 204, 0.1)',
              }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-vscode-blue/5 via-transparent to-purple-500/5 pointer-events-none" />

              {/* Quick Theme Toggle */}
              <div className="px-2 py-1.5 border-b border-vscode-border/50">
                <div className="flex items-center gap-1.5 text-xs text-vscode-text-secondary mb-1">
                  <span>Quick Switch:</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setTheme('dark')
                      setShowMenu(false)
                    }}
                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                      currentTheme.type === 'dark'
                        ? 'bg-vscode-blue/20 text-vscode-blue'
                        : 'hover:bg-vscode-active text-vscode-text-secondary'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme('light')
                      setShowMenu(false)
                    }}
                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                      currentTheme.type === 'light'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'hover:bg-vscode-active text-vscode-text-secondary'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="px-2 py-1.5">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    // Trigger advanced selector
                    window.dispatchEvent(new CustomEvent('openThemeSelector'))
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-vscode-text hover:bg-vscode-active/50 rounded transition-colors"
                >
                  <Palette size={14} />
                  <span>All Themes...</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Advanced Theme Selector */}
      <AdvancedThemeSelector />
    </div>
  )
}
