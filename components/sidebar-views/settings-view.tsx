'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Palette, Layout, Bell, Globe, Monitor, Moon, Sun, 
  Layers, Eye, Zap, Search, User, Mail, Share2, Code, 
  Briefcase, Award, BookOpen, Home, Folder, ChevronRight, ChevronDown,
  RotateCcw, Check, Grid, List, Clock, Activity, TrendingUp, FileText
} from 'lucide-react'
import { useAppStore, PortfolioSettings } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'

export function SettingsView() {
  const { portfolioSettings, updateSettings, resetSettings, setActiveMenuItem } = useAppStore()
  const { themes, setTheme } = useEnhancedTheme()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['display', 'appearance']))
  const [showResetNotification, setShowResetNotification] = useState(false)

  // Listen for theme changes from settings
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const themeId = event.detail
      const themeToApply = themes.find(t => t.id === themeId)
      if (themeToApply) {
        setTheme(themeToApply.id)
      }
    }

    window.addEventListener('themeChange', handleThemeChange as EventListener)
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener)
  }, [themes, setTheme])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const handleSettingChange = <K extends keyof PortfolioSettings>(
    key: K,
    value: PortfolioSettings[K]
  ) => {
    // Apply immediately
    updateSettings({ [key]: value })
  }

  const handleReset = () => {
    resetSettings()
    setShowResetNotification(true)
    setTimeout(() => setShowResetNotification(false), 3000)
    
    // Reset theme if changed
    const themeToApply = themes.find(t => t.id === 'dark')
    if (themeToApply) {
      setTheme('dark')
    }
  }

  return (
    <div className="h-full overflow-auto bg-vscode-bg text-vscode-text">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 border-b border-vscode-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-vscode-blue/20 rounded-lg">
                <Settings className="text-vscode-blue" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-vscode-text">Settings</h1>
                <p className="text-sm text-vscode-text-secondary mt-1">
                  Customize your portfolio experience - changes apply immediately
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded text-sm text-vscode-text transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} />
              <span>Reset to Defaults</span>
            </motion.button>
          </div>
        </div>

        {/* Reset Notification */}
        <AnimatePresence>
          {showResetNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"
            >
              <Check size={16} />
              <span className="text-sm">Settings reset to defaults successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Sections */}
        <div className="space-y-3">
          {/* Display Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('display')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Eye className="text-blue-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">DISPLAY</span>
              </div>
              {expandedSections.has('display') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('display') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Welcome on Startup</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showWelcomeOnStartup}
                        onChange={(e) => handleSettingChange('showWelcomeOnStartup', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Compact View</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.compactView}
                        onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Animations</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showAnimations}
                        onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Animation Speed</label>
                      <select
                        value={portfolioSettings.animationSpeed}
                        onChange={(e) => handleSettingChange('animationSpeed', e.target.value as 'fast' | 'normal' | 'slow')}
                        className="w-full px-3 py-2 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:border-vscode-blue"
                      >
                        <option value="fast">Fast</option>
                        <option value="normal">Normal</option>
                        <option value="slow">Slow</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Appearance Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('appearance')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Palette className="text-purple-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">APPEARANCE</span>
              </div>
              {expandedSections.has('appearance') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('appearance') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Theme</label>
                      <select
                        value={portfolioSettings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="w-full px-3 py-2 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:border-vscode-blue"
                      >
                        {themes.map(theme => (
                          <option key={theme.id} value={theme.id}>{theme.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Font Size</label>
                      <select
                        value={portfolioSettings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                        className="w-full px-3 py-2 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:border-vscode-blue"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Font Family</label>
                      <select
                        value={portfolioSettings.fontFamily}
                        onChange={(e) => handleSettingChange('fontFamily', e.target.value as 'system' | 'mono' | 'sans')}
                        className="w-full px-3 py-2 bg-vscode-active border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:border-vscode-blue"
                      >
                        <option value="system">System</option>
                        <option value="mono">Monospace</option>
                        <option value="sans">Sans Serif</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Layout Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('layout')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Layout className="text-green-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">LAYOUT</span>
              </div>
              {expandedSections.has('layout') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('layout') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">
                        Sidebar Width: {portfolioSettings.sidebarWidth}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="400"
                        value={portfolioSettings.sidebarWidth}
                        onChange={(e) => handleSettingChange('sidebarWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-vscode-active rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">
                        Panel Width: {portfolioSettings.panelWidth}px
                      </label>
                      <input
                        type="range"
                        min="300"
                        max="600"
                        value={portfolioSettings.panelWidth}
                        onChange={(e) => handleSettingChange('panelWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-vscode-active rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Grid Layout</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSettingChange('gridLayout', 'grid')}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                            portfolioSettings.gridLayout === 'grid'
                              ? 'bg-vscode-blue text-white'
                              : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'
                          }`}
                        >
                          <Grid size={16} className="inline mr-2" />
                          Grid
                        </button>
                        <button
                          onClick={() => handleSettingChange('gridLayout', 'list')}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                            portfolioSettings.gridLayout === 'list'
                              ? 'bg-vscode-blue text-white'
                              : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'
                          }`}
                        >
                          <List size={16} className="inline mr-2" />
                          List
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <FileText className="text-yellow-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">CONTENT</span>
              </div>
              {expandedSections.has('content') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('content') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Statistics</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showStats}
                        onChange={(e) => handleSettingChange('showStats', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Social Links</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showSocialLinks}
                        onChange={(e) => handleSettingChange('showSocialLinks', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show GitHub Stats</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showGitHubStats}
                        onChange={(e) => handleSettingChange('showGitHubStats', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Recent Items</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showRecentItems}
                        onChange={(e) => handleSettingChange('showRecentItems', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('notifications')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Bell className="text-orange-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">NOTIFICATIONS</span>
              </div>
              {expandedSections.has('notifications') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('notifications') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Email Notifications</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Form Success Alerts</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.formSuccessAlerts}
                        onChange={(e) => handleSettingChange('formSuccessAlerts', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Update Notifications</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.updateNotifications}
                        onChange={(e) => handleSettingChange('updateNotifications', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('navigation')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Share2 className="text-pink-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">NAVIGATION</span>
              </div>
              {expandedSections.has('navigation') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('navigation') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Enable Quick Navigation</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.enableQuickNav}
                        onChange={(e) => handleSettingChange('enableQuickNav', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Recently Viewed</span>
                      <input
                        type="checkbox"
                        checked={portfolioSettings.showRecentlyViewed}
                        onChange={(e) => handleSettingChange('showRecentlyViewed', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
