'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Palette, Sparkles, Moon, Sun, Star } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { Theme } from '@/lib/theme-manager'
import { motion, AnimatePresence, useSpring } from 'framer-motion'

export function AdvancedThemeDropdown() {
  const { currentTheme, themes, setTheme } = useEnhancedTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const safeThemes = themes || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Theme Preview Mini Card
  const ThemePreviewMini = ({ theme }: { theme: Theme }) => {
    const isSelected = currentTheme?.id === theme.id
    const isHovered = hoveredThemeId === theme.id

    return (
      <motion.div
        onMouseEnter={() => setHoveredThemeId(theme.id)}
        onMouseLeave={() => setHoveredThemeId(null)}
        className="relative"
        whileHover={{ scale: 1.02 }}
      >
        <motion.button
          onClick={() => {
            setTheme(theme.id)
            setIsOpen(false)
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
            isSelected
              ? 'bg-gradient-to-r from-vscode-blue/30 to-purple-500/20 border-2 border-vscode-blue shadow-lg'
              : 'bg-vscode-active/50 border-2 border-vscode-border hover:border-vscode-blue/50 hover:bg-vscode-active/70 shadow-md'
          }`}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated Background Gradient */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.blue}20, ${theme.colors.purple}20)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* Theme Color Preview */}
          <div className="relative flex-shrink-0">
            <motion.div
              className="w-14 h-14 rounded-xl overflow-hidden shadow-xl border-2 border-white/20"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.bg}, ${theme.colors.sidebar})`,
              }}
              whileHover={{ rotate: [0, 5, -5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 p-1.5 grid grid-cols-2 gap-0.5">
                <div
                  className="rounded-sm"
                  style={{ backgroundColor: theme.colors.blue }}
                />
                <div
                  className="rounded-sm"
                  style={{ backgroundColor: theme.colors.green }}
                />
                <div
                  className="rounded-sm"
                  style={{ backgroundColor: theme.colors.orange }}
                />
                <div
                  className="rounded-sm"
                  style={{ backgroundColor: theme.colors.purple }}
                />
              </div>
            </motion.div>

            {/* Type Badge */}
            <motion.div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-vscode-sidebar flex items-center justify-center shadow-lg ${
                theme.type === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'
              }`}
              whileHover={{ scale: 1.2, rotate: 360 }}
            >
              {theme.type === 'dark' ? (
                <Moon size={10} className="text-white" />
              ) : (
                <Sun size={10} className="text-gray-800" />
              )}
            </motion.div>
          </div>

          {/* Theme Info */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <motion.span
                className="font-bold text-sm text-vscode-text truncate"
                animate={{
                  color: isHovered ? theme.colors.blue : undefined,
                }}
              >
                {theme.name}
              </motion.span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-vscode-blue to-purple-500 flex items-center justify-center"
                >
                  <Check size={10} className="text-white" />
                </motion.div>
              )}
            </div>
            <div
              className="text-xs text-vscode-text-secondary truncate"
              style={{ color: isHovered ? theme.colors.textSecondary : undefined }}
            >
              {theme.description}
            </div>
          </div>

          {/* Hover Glow Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px ${theme.colors.blue}30`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.button>
      </motion.div>
    )
  }

  const getThemeIcon = (theme: Theme) => {
    if (theme.type === 'dark') return Moon
    return Sun
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* Dropdown Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full max-w-xs flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-vscode-active via-vscode-sidebar to-vscode-active border-2 border-vscode-border hover:border-vscode-blue transition-all duration-300 shadow-lg group overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated Background */}
        {currentTheme && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.blue}15, ${currentTheme.colors.purple}15)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Current Theme Display */}
        <div className="relative flex items-center gap-3 flex-1 min-w-0">
          {currentTheme ? (
            <>
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg shadow-lg border-2 border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.bg}, ${currentTheme.colors.sidebar})`,
                  }}
                >
                  <div className="absolute inset-0 p-1 grid grid-cols-2 gap-0.5">
                    <div
                      className="rounded"
                      style={{ backgroundColor: currentTheme.colors.blue }}
                    />
                    <div
                      className="rounded"
                      style={{ backgroundColor: currentTheme.colors.green }}
                    />
                    <div
                      className="rounded"
                      style={{ backgroundColor: currentTheme.colors.orange }}
                    />
                    <div
                      className="rounded"
                      style={{ backgroundColor: currentTheme.colors.purple }}
                    />
                  </div>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-vscode-sidebar flex items-center justify-center shadow-md ${
                    currentTheme.type === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'
                  }`}
                >
                  {currentTheme.type === 'dark' ? (
                    <Moon size={8} className="text-white" />
                  ) : (
                    <Sun size={8} className="text-gray-800" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="font-bold text-sm text-vscode-text truncate">
                  {currentTheme.name}
                </div>
                <div className="text-xs text-vscode-text-secondary truncate">
                  {currentTheme.description}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-vscode-text-secondary" />
              <span className="text-vscode-text-secondary">Select Theme</span>
            </div>
          )}
        </div>

        {/* Dropdown Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <ChevronDown size={20} className="text-vscode-text-secondary group-hover:text-vscode-text transition-colors" />
        </motion.div>

        {/* Sparkle Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.6, 0],
                x: [0, Math.sin(i) * 15],
                y: [0, Math.cos(i) * 15],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles size={6} className="text-vscode-blue/60" />
            </motion.div>
          ))}
        </div>
      </motion.button>

      {/* Advanced Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-full left-0 mt-2 w-full max-w-md bg-vscode-sidebar/98 backdrop-blur-2xl border-2 border-vscode-border rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{
                boxShadow: currentTheme
                  ? `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px ${currentTheme.colors.border}, inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 80px ${currentTheme.colors.blue}20`
                  : undefined,
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-vscode-border bg-gradient-to-r from-vscode-blue/10 via-transparent to-purple-500/10">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-vscode-blue" />
                  <span className="font-bold text-vscode-text">Choose Theme</span>
                  <span className="text-xs text-vscode-text-secondary ml-auto">
                    {safeThemes.length} themes
                  </span>
                </div>
              </div>

              {/* Themes List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-2">
                <AnimatePresence>
                  {safeThemes.map((theme, index) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ThemePreviewMini theme={theme} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-vscode-border bg-vscode-active/30 flex items-center justify-between text-xs">
                <span className="text-vscode-text-secondary">
                  {currentTheme ? `Active: ${currentTheme.name}` : 'No theme selected'}
                </span>
                <motion.div
                  className="w-6 h-6 rounded-full border-2 border-vscode-blue"
                  style={{
                    backgroundColor: currentTheme?.colors.blue || '#007acc',
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

