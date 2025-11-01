'use client'

import { useState, useEffect } from 'react'
import { Palette, Moon, Sun, Download, Upload, Clock, X } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { Theme } from '@/lib/theme-manager'
import { motion, AnimatePresence } from 'framer-motion'

export function AdvancedThemeSelector() {
  const { currentTheme, themes, setTheme, themeManager, transitionDuration, setTransitionDuration } = useEnhancedTheme()
  const [showSelector, setShowSelector] = useState(false)
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduleThemeId, setScheduleThemeId] = useState('')

  // Listen for open event
  useEffect(() => {
    const handleOpenSelector = () => {
      setShowSelector(true)
    }
    window.addEventListener('openThemeSelector', handleOpenSelector)
    return () => window.removeEventListener('openThemeSelector', handleOpenSelector)
  }, [])

  const darkThemes = themes.filter(t => t.type === 'dark')
  const lightThemes = themes.filter(t => t.type === 'light')

  const handleScheduleTheme = () => {
    if (!themeManager || !scheduleTime || !scheduleThemeId) return

    const [hours, minutes] = scheduleTime.split(':').map(Number)
    const scheduleDate = new Date()
    scheduleDate.setHours(hours, minutes, 0, 0)
    
    // If scheduled time has passed, schedule for tomorrow
    if (scheduleDate.getTime() < Date.now()) {
      scheduleDate.setDate(scheduleDate.getDate() + 1)
    }

    themeManager.scheduleThemeChange(scheduleThemeId, scheduleDate)
    alert(`Theme scheduled to change at ${scheduleTime}`)
    setScheduleTime('')
    setScheduleThemeId('')
  }

  const handleExportTheme = (themeId: string) => {
    if (!themeManager) return
    try {
      const themeJson = themeManager.exportTheme(themeId)
      const blob = new Blob([themeJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${themeId}-theme.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export theme')
    }
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !themeManager) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const theme = themeManager.importTheme(content)
        setTheme(theme.id)
        alert(`Theme "${theme.name}" imported successfully!`)
      } catch (error) {
        alert('Failed to import theme. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const ThemePreview = ({ theme }: { theme: Theme }) => {
    const isSelected = currentTheme.id === theme.id
    return (
      <motion.button
        onClick={() => setTheme(theme.id)}
        className={`relative p-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-vscode-blue shadow-lg shadow-vscode-blue/20 scale-105'
            : 'border-vscode-border hover:border-vscode-blue/50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.sidebar} 100%)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.blue }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.green }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.orange }}
          />
        </div>
        <div className="text-left">
          <div
            className="font-semibold text-sm mb-1"
            style={{ color: theme.colors.text }}
          >
            {theme.name}
          </div>
          <div
            className="text-xs opacity-75"
            style={{ color: theme.colors.textSecondary }}
          >
            {theme.type}
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 bg-vscode-blue rounded-full p-1"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    )
  }

  return (
    <>
      {/* Theme Selector Button */}
      <motion.button
        onClick={() => setShowSelector(true)}
        className="relative p-2.5 rounded-lg bg-vscode-active/50 backdrop-blur-sm border border-vscode-border/50 hover:bg-vscode-active hover:border-vscode-border transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Theme Selector"
      >
        <Palette
          size={18}
          className={`transition-colors duration-300 ${
            currentTheme.type === 'dark' ? 'text-vscode-blue' : 'text-purple-600'
          }`}
        />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: currentTheme.colors.blue }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.button>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowSelector(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl md:h-[85vh] bg-vscode-sidebar/95 backdrop-blur-xl border border-vscode-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-vscode-border">
                <div>
                  <h2 className="text-2xl font-bold text-vscode-text mb-1">Theme Selector</h2>
                  <p className="text-sm text-vscode-text-secondary">
                    Choose from {themes.length} Visual Studio themes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-vscode-text-secondary">
                    Transition:
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={transitionDuration}
                      onChange={(e) => setTransitionDuration(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="w-12 text-xs">{transitionDuration}ms</span>
                  </label>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="p-2 hover:bg-vscode-hover rounded-lg transition-colors"
                  >
                    <X size={20} className="text-vscode-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Dark Themes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Moon className="text-vscode-blue" size={20} />
                    <h3 className="text-lg font-semibold text-vscode-text">Dark Themes</h3>
                    <span className="text-sm text-vscode-text-secondary">({darkThemes.length})</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {darkThemes.map((theme) => (
                      <ThemePreview key={theme.id} theme={theme} />
                    ))}
                  </div>
                </div>

                {/* Light Themes */}
                {lightThemes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sun className="text-yellow-500" size={20} />
                      <h3 className="text-lg font-semibold text-vscode-text">Light Themes</h3>
                      <span className="text-sm text-vscode-text-secondary">({lightThemes.length})</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {lightThemes.map((theme) => (
                        <ThemePreview key={theme.id} theme={theme} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule Theme Change */}
                <div className="bg-vscode-active/50 rounded-xl p-6 border border-vscode-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-vscode-green" size={20} />
                    <h3 className="text-lg font-semibold text-vscode-text">Schedule Theme Change</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={scheduleThemeId}
                      onChange={(e) => setScheduleThemeId(e.target.value)}
                      className="flex-1 bg-vscode-sidebar border border-vscode-border rounded-lg px-4 py-2 text-vscode-text focus:outline-none focus:border-vscode-blue"
                    >
                      <option value="">Select theme...</option>
                      {themes.map((theme) => (
                        <option key={theme.id} value={theme.id}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="bg-vscode-sidebar border border-vscode-border rounded-lg px-4 py-2 text-vscode-text focus:outline-none focus:border-vscode-blue"
                    />
                    <button
                      onClick={handleScheduleTheme}
                      disabled={!scheduleTime || !scheduleThemeId}
                      className="px-4 py-2 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                {/* Import/Export */}
                <div className="bg-vscode-active/50 rounded-xl p-6 border border-vscode-border">
                  <h3 className="text-lg font-semibold text-vscode-text mb-4">Theme Management</h3>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-vscode-sidebar hover:bg-vscode-hover border border-vscode-border rounded-lg cursor-pointer transition-colors">
                      <Upload size={16} className="text-vscode-green" />
                      <span className="text-sm text-vscode-text">Import Theme</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportTheme}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => handleExportTheme(currentTheme.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-vscode-sidebar hover:bg-vscode-hover border border-vscode-border rounded-lg transition-colors"
                    >
                      <Download size={16} className="text-vscode-blue" />
                      <span className="text-sm text-vscode-text">Export Current</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

