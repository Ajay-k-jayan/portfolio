'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Palette, Layout, Bell, Globe, Monitor, Moon, Sun, 
  Layers, Eye, Zap, Search, User, Mail, Share2, Code, 
  Briefcase, Award, BookOpen, Home, Folder, ChevronRight, ChevronDown,
  Save, RotateCcw, Check, X, RefreshCw, Grid, List, Maximize,
  Minimize, Clock, Activity, TrendingUp, FileText, Download, Upload
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'

interface PortfolioSettings {
  // Display Settings
  showWelcomeOnStartup: boolean
  compactView: boolean
  showAnimations: boolean
  animationSpeed: 'fast' | 'normal' | 'slow'
  
  // Layout Settings
  sidebarWidth: number
  panelWidth: number
  gridLayout: 'grid' | 'list'
  
  // Content Settings
  showStats: boolean
  showSocialLinks: boolean
  showGitHubStats: boolean
  showRecentItems: boolean
  
  // Notification Settings
  emailNotifications: boolean
  formSuccessAlerts: boolean
  updateNotifications: boolean
  
  // Navigation Settings
  enableQuickNav: boolean
  showRecentlyViewed: boolean
  
  // Appearance Settings
  theme: string
  fontSize: 'small' | 'medium' | 'large'
  fontFamily: 'system' | 'mono' | 'sans'
}

const defaultSettings: PortfolioSettings = {
  showWelcomeOnStartup: true,
  compactView: false,
  showAnimations: true,
  animationSpeed: 'normal',
  sidebarWidth: 256,
  panelWidth: 400,
  gridLayout: 'grid',
  showStats: true,
  showSocialLinks: true,
  showGitHubStats: true,
  showRecentItems: true,
  emailNotifications: false,
  formSuccessAlerts: true,
  updateNotifications: true,
  enableQuickNav: true,
  showRecentlyViewed: true,
  theme: 'dark',
  fontSize: 'medium',
  fontFamily: 'system',
}

export function SettingsView() {
  const { setActiveMenuItem } = useAppStore()
  const { currentTheme, themes, setTheme } = useEnhancedTheme()
  const [settings, setSettings] = useState<PortfolioSettings>(defaultSettings)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['display', 'appearance']))
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioSettings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (e) {
          console.error('Failed to load settings:', e)
        }
      }
    }
  }, [])

  // Watch for changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioSettings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setHasChanges(JSON.stringify(settings) !== JSON.stringify(parsed))
        } catch {
          setHasChanges(true)
        }
      } else {
        setHasChanges(JSON.stringify(settings) !== JSON.stringify(defaultSettings))
      }
    }
  }, [settings])

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

  const updateSetting = <K extends keyof PortfolioSettings>(
    key: K,
    value: PortfolioSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioSettings', JSON.stringify(settings))
      setHasChanges(false)
      setShowSaveNotification(true)
      setTimeout(() => setShowSaveNotification(false), 3000)
      // Apply theme if changed
      if (settings.theme && currentTheme?.id !== settings.theme) {
        const themeToApply = themes.find(t => t.id === settings.theme)
        if (themeToApply) {
          setTheme(themeToApply.id)
        }
      }
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolioSettings')
    }
  }

  const settingSections = [
    {
      id: 'display',
      label: 'Display',
      icon: Eye,
      color: 'text-blue-400'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      color: 'text-purple-400'
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: Layout,
      color: 'text-green-400'
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      color: 'text-yellow-400'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'text-orange-400'
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: Share2,
      color: 'text-pink-400'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: Zap,
      color: 'text-cyan-400'
    }
  ]

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
                  Customize your portfolio experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <motion.button
                  onClick={resetSettings}
                  className="flex items-center gap-2 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded text-sm text-vscode-text-secondary hover:text-vscode-text transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </motion.button>
              )}
              <motion.button
                onClick={saveSettings}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-4 py-2 bg-vscode-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                whileHover={hasChanges ? { scale: 1.05 } : {}}
                whileTap={hasChanges ? { scale: 0.95 } : {}}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Save Notification */}
        <AnimatePresence>
          {showSaveNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"
            >
              <Check size={16} />
              <span className="text-sm">Settings saved successfully!</span>
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
                        checked={settings.showWelcomeOnStartup}
                        onChange={(e) => updateSetting('showWelcomeOnStartup', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Compact View</span>
                      <input
                        type="checkbox"
                        checked={settings.compactView}
                        onChange={(e) => updateSetting('compactView', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Animations</span>
                      <input
                        type="checkbox"
                        checked={settings.showAnimations}
                        onChange={(e) => updateSetting('showAnimations', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Animation Speed</label>
                      <select
                        value={settings.animationSpeed}
                        onChange={(e) => updateSetting('animationSpeed', e.target.value as 'fast' | 'normal' | 'slow')}
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
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value)}
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
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
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
                        value={settings.fontFamily}
                        onChange={(e) => updateSetting('fontFamily', e.target.value as 'system' | 'mono' | 'sans')}
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
                        Sidebar Width: {settings.sidebarWidth}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="400"
                        value={settings.sidebarWidth}
                        onChange={(e) => updateSetting('sidebarWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-vscode-active rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">
                        Panel Width: {settings.panelWidth}px
                      </label>
                      <input
                        type="range"
                        min="300"
                        max="600"
                        value={settings.panelWidth}
                        onChange={(e) => updateSetting('panelWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-vscode-active rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-vscode-text-secondary mb-2">Grid Layout</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateSetting('gridLayout', 'grid')}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                            settings.gridLayout === 'grid'
                              ? 'bg-vscode-blue text-white'
                              : 'bg-vscode-active text-vscode-text-secondary hover:bg-vscode-hover'
                          }`}
                        >
                          <Grid size={16} className="inline mr-2" />
                          Grid
                        </button>
                        <button
                          onClick={() => updateSetting('gridLayout', 'list')}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                            settings.gridLayout === 'list'
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
                        checked={settings.showStats}
                        onChange={(e) => updateSetting('showStats', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Social Links</span>
                      <input
                        type="checkbox"
                        checked={settings.showSocialLinks}
                        onChange={(e) => updateSetting('showSocialLinks', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show GitHub Stats</span>
                      <input
                        type="checkbox"
                        checked={settings.showGitHubStats}
                        onChange={(e) => updateSetting('showGitHubStats', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Recent Items</span>
                      <input
                        type="checkbox"
                        checked={settings.showRecentItems}
                        onChange={(e) => updateSetting('showRecentItems', e.target.checked)}
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
                        checked={settings.emailNotifications}
                        onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Form Success Alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.formSuccessAlerts}
                        onChange={(e) => updateSetting('formSuccessAlerts', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Update Notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.updateNotifications}
                        onChange={(e) => updateSetting('updateNotifications', e.target.checked)}
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
                        checked={settings.enableQuickNav}
                        onChange={(e) => updateSetting('enableQuickNav', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-vscode-active rounded cursor-pointer">
                      <span className="text-xs text-vscode-text-secondary">Show Recently Viewed</span>
                      <input
                        type="checkbox"
                        checked={settings.showRecentlyViewed}
                        onChange={(e) => updateSetting('showRecentlyViewed', e.target.checked)}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-active text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Advanced Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors border-b border-vscode-border"
            >
              <div className="flex items-center gap-2">
                <Zap className="text-cyan-400" size={16} />
                <span className="text-sm font-medium text-vscode-text">ADVANCED</span>
              </div>
              {expandedSections.has('advanced') ? (
                <ChevronDown className="text-vscode-text-secondary" size={16} />
              ) : (
                <ChevronRight className="text-vscode-text-secondary" size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has('advanced') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const settingsJson = JSON.stringify(settings, null, 2)
                          const blob = new Blob([settingsJson], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'portfolio-settings.json'
                          a.click()
                          URL.revokeObjectURL(url)
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded text-sm text-vscode-text transition-colors"
                    >
                      <Download size={16} />
                      <span>Export Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'application/json'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                try {
                                  const imported = JSON.parse(event.target?.result as string)
                                  setSettings({ ...defaultSettings, ...imported })
                                } catch (error) {
                                  alert('Failed to import settings. Invalid file format.')
                                }
                              }
                              reader.readAsText(file)
                            }
                          }
                          input.click()
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded text-sm text-vscode-text transition-colors"
                    >
                      <Upload size={16} />
                      <span>Import Settings</span>
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded text-sm text-vscode-text transition-colors"
                    >
                      <RefreshCw size={16} />
                      <span>Reload Portfolio</span>
                    </button>
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
