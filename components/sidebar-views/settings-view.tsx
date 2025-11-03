'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Palette, Bell, Eye, Share2, FileText, 
  ChevronRight, ChevronDown, RotateCcw, Check, 
  Info, Type, Sparkles, Zap,
  Home, TrendingUp, Clock
} from 'lucide-react'
import { useAppStore, PortfolioSettings, defaultSettings } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'

// Visual Preview Components
const GridLayoutPreview = ({ active }: { active: boolean }) => (
  <div className={`w-full h-20 rounded border-2 transition-all ${
    active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
  }`}>
    <div className="p-2 h-full flex flex-col gap-1">
      <div className="flex gap-1 flex-1">
        <div className="flex-1 bg-vscode-border rounded" />
        <div className="flex-1 bg-vscode-border rounded" />
        <div className="flex-1 bg-vscode-border rounded" />
      </div>
      <div className="flex gap-1 flex-1">
        <div className="flex-1 bg-vscode-border rounded" />
        <div className="flex-1 bg-vscode-border rounded" />
        <div className="flex-1 bg-vscode-border rounded" />
      </div>
    </div>
  </div>
)

const ListLayoutPreview = ({ active }: { active: boolean }) => (
  <div className={`w-full h-20 rounded border-2 transition-all ${
    active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
  }`}>
    <div className="p-2 h-full flex flex-col gap-1.5">
      <div className="h-3 bg-vscode-border rounded" />
      <div className="h-3 bg-vscode-border rounded w-3/4" />
      <div className="h-3 bg-vscode-border rounded" />
      <div className="h-3 bg-vscode-border rounded w-2/3" />
    </div>
  </div>
)

const CompactViewPreview = ({ active }: { active: boolean }) => (
  <div className={`w-full h-16 rounded border-2 transition-all ${
    active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
  }`}>
    <div className="p-2 h-full flex flex-col gap-1">
      <div className="h-2 bg-vscode-border rounded" />
      <div className="h-2 bg-vscode-border rounded w-5/6" />
      <div className="h-2 bg-vscode-border rounded w-4/6" />
    </div>
  </div>
)

const NormalViewPreview = ({ active }: { active: boolean }) => (
  <div className={`w-full h-16 rounded border-2 transition-all ${
    active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
  }`}>
    <div className="p-2 h-full flex flex-col gap-2">
      <div className="h-2.5 bg-vscode-border rounded" />
      <div className="h-2.5 bg-vscode-border rounded w-5/6" />
      <div className="h-2.5 bg-vscode-border rounded w-4/6" />
    </div>
  </div>
)

const FontSizePreview = ({ size, active }: { size: 'small' | 'medium' | 'large', active: boolean }) => {
  const sizeMap = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  return (
    <div className={`w-full h-16 rounded border-2 transition-all ${
      active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
    }`}>
      <div className="p-3 h-full flex items-center">
        <p className={`${sizeMap[size]} text-vscode-text font-medium`}>
          Sample Text
        </p>
      </div>
    </div>
  )
}

const FontFamilyPreview = ({ family, active }: { family: 'system' | 'mono' | 'sans', active: boolean }) => {
  const familyMap = {
    system: 'font-sans',
    mono: 'font-mono',
    sans: 'font-sans'
  }
  return (
    <div className={`w-full h-16 rounded border-2 transition-all ${
      active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
    }`}>
      <div className="p-3 h-full flex items-center">
        <p className={`text-sm text-vscode-text ${familyMap[family]}`}>
          {family === 'mono' ? 'Consolas Mono' : family === 'sans' ? 'Inter Sans' : 'System Font'}
        </p>
      </div>
    </div>
  )
}

const ThemePreviewCard = ({ theme, active, onClick }: { theme: any, active: boolean, onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative w-full rounded-lg border-2 transition-all overflow-hidden ${
      active 
        ? 'border-vscode-blue ring-2 ring-vscode-blue/50' 
        : 'border-vscode-border hover:border-vscode-blue/50'
    }`}
  >
    <div 
      className="h-20 w-full"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.sidebar} 100%)`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-semibold text-white drop-shadow-lg">{theme.name}</div>
        </div>
      </div>
    </div>
    {active && (
      <div className="absolute top-2 right-2">
        <div className="w-5 h-5 bg-vscode-blue rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      </div>
    )}
  </motion.button>
)

const AnimationSpeedPreview = ({ speed, active }: { speed: 'fast' | 'normal' | 'slow', active: boolean }) => {
  const speedMap = {
    fast: 0.5,
    normal: 1,
    slow: 2
  }
  return (
    <div className={`w-full h-16 rounded border-2 transition-all ${
      active ? 'border-vscode-blue bg-vscode-blue/10' : 'border-vscode-border bg-vscode-active/50 opacity-50'
    }`}>
      <div className="p-3 h-full flex items-center justify-center">
        <motion.div
          animate={{ x: [0, 60, 0] }}
          transition={{ 
            duration: speedMap[speed],
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-3 h-3 bg-vscode-blue rounded-full"
        />
      </div>
    </div>
  )
}

export function SettingsView() {
  const { portfolioSettings, updateSettings, resetSettings } = useAppStore()
  const { themes, setTheme } = useEnhancedTheme()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['display', 'appearance']))
  const [showResetNotification, setShowResetNotification] = useState(false)
  const [showChangeNotification, setShowChangeNotification] = useState(false)
  const [lastChangedSetting, setLastChangedSetting] = useState<string | null>(null)

  // Check if settings differ from defaults
  const hasChanges = useMemo(() => {
    return JSON.stringify(portfolioSettings) !== JSON.stringify(defaultSettings)
  }, [portfolioSettings])

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

  // Show notification when settings change
  useEffect(() => {
    if (hasChanges && lastChangedSetting) {
      setShowChangeNotification(true)
      const timer = setTimeout(() => {
        setShowChangeNotification(false)
        setLastChangedSetting(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasChanges, lastChangedSetting])

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
    updateSettings({ [key]: value })
    
    const settingLabels: Record<string, string> = {
      showWelcomeOnStartup: 'Welcome on Startup',
      compactView: 'Compact View',
      showAnimations: 'Show Animations',
      animationSpeed: 'Animation Speed',
      showStats: 'Show Statistics',
      showSocialLinks: 'Show Social Links',
      showGitHubStats: 'Show GitHub Stats',
      showRecentItems: 'Show Recent Items',
      emailNotifications: 'Email Notifications',
      formSuccessAlerts: 'Form Success Alerts',
      updateNotifications: 'Update Notifications',
      enableQuickNav: 'Enable Quick Navigation',
      showRecentlyViewed: 'Show Recently Viewed',
      theme: 'Theme',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
    }
    
    setLastChangedSetting(settingLabels[key] || key)
  }

  const handleReset = () => {
    resetSettings()
    setShowResetNotification(true)
    setLastChangedSetting(null)
    setTimeout(() => {
      setShowResetNotification(false)
    }, 3000)
    
    const themeToApply = themes.find(t => t.id === 'dark')
    if (themeToApply) {
      setTheme('dark')
    }
  }

  return (
    <div className="h-full overflow-auto bg-vscode-bg text-vscode-text relative">
      {/* Floating Notification - Bottom Right */}
      <AnimatePresence>
        {(showResetNotification || showChangeNotification) && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`p-4 rounded-lg border shadow-lg flex items-center gap-3 ${
              showResetNotification 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              {showResetNotification ? (
                <>
                  <Check size={20} />
                  <div>
                    <div className="text-sm font-semibold">Settings Reset</div>
                    <div className="text-xs opacity-80">All settings restored to defaults</div>
                  </div>
                </>
              ) : (
                <>
                  <Info size={20} />
                  <div>
                    <div className="text-sm font-semibold">Setting Changed</div>
                    <div className="text-xs opacity-80">{lastChangedSetting} updated</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-6">
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
                  Visual settings - see your changes instantly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400"
                >
                  <Info size={14} />
                  <span>Modified</span>
                </motion.div>
              )}
              <motion.button
                onClick={handleReset}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 border border-vscode-border rounded text-sm transition-colors ${
                  hasChanges
                    ? 'bg-vscode-active hover:bg-vscode-hover text-vscode-text'
                    : 'bg-vscode-active/50 text-vscode-text-secondary cursor-not-allowed'
                }`}
                whileHover={hasChanges ? { scale: 1.05 } : {}}
                whileTap={hasChanges ? { scale: 0.95 } : {}}
              >
                <RotateCcw size={16} />
                <span>Reset to Defaults</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Display Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('display')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye className="text-blue-400" size={18} />
                <span className="text-sm font-semibold text-vscode-text">Display</span>
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
                  <div className="p-4 space-y-6">
                    {/* Compact View Toggle */}
                    <div>
                      <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                        View Mode
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          onClick={() => handleSettingChange('compactView', false)}
                          className={`relative p-4 rounded-lg border-2 transition-all ${
                            !portfolioSettings.compactView
                              ? 'border-vscode-blue bg-vscode-blue/10'
                              : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <NormalViewPreview active={!portfolioSettings.compactView} />
                          <div className="mt-2 text-center">
                            <span className="text-xs font-medium text-vscode-text">Normal</span>
                          </div>
                          {!portfolioSettings.compactView && (
                            <div className="absolute top-2 right-2">
                              <Check size={16} className="text-vscode-blue" />
                            </div>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleSettingChange('compactView', true)}
                          className={`relative p-4 rounded-lg border-2 transition-all ${
                            portfolioSettings.compactView
                              ? 'border-vscode-blue bg-vscode-blue/10'
                              : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CompactViewPreview active={portfolioSettings.compactView} />
                          <div className="mt-2 text-center">
                            <span className="text-xs font-medium text-vscode-text">Compact</span>
                          </div>
                          {portfolioSettings.compactView && (
                            <div className="absolute top-2 right-2">
                              <Check size={16} className="text-vscode-blue" />
                            </div>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Animation Speed */}
                    <div>
                      <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                        Animation Speed
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['fast', 'normal', 'slow'] as const).map((speed) => (
                          <motion.button
                            key={speed}
                            onClick={() => handleSettingChange('animationSpeed', speed)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              portfolioSettings.animationSpeed === speed
                                ? 'border-vscode-blue bg-vscode-blue/10'
                                : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <AnimationSpeedPreview 
                              speed={speed} 
                              active={portfolioSettings.animationSpeed === speed} 
                            />
                            <div className="mt-2 text-center">
                              <span className="text-xs font-medium text-vscode-text capitalize">{speed}</span>
                            </div>
                            {portfolioSettings.animationSpeed === speed && (
                              <div className="absolute top-2 right-2">
                                <Check size={16} className="text-vscode-blue" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded">
                            <Zap className="text-blue-400" size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-vscode-text">Show Animations</div>
                            <div className="text-xs text-vscode-text-secondary">Enable smooth transitions</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={portfolioSettings.showAnimations}
                            onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded">
                            <Home className="text-green-400" size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-vscode-text">Show Welcome on Startup</div>
                            <div className="text-xs text-vscode-text-secondary">Display welcome page when opening</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={portfolioSettings.showWelcomeOnStartup}
                            onChange={(e) => handleSettingChange('showWelcomeOnStartup', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Appearance Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('appearance')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <Palette className="text-purple-400" size={18} />
                <span className="text-sm font-semibold text-vscode-text">Appearance</span>
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
                  <div className="p-4 space-y-6">
                    {/* Theme Selection */}
                    <div>
                      <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {themes.map((theme) => (
                          <ThemePreviewCard
                            key={theme.id}
                            theme={theme}
                            active={portfolioSettings.theme === theme.id}
                            onClick={() => handleSettingChange('theme', theme.id)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                        Font Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                          <motion.button
                            key={size}
                            onClick={() => handleSettingChange('fontSize', size)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              portfolioSettings.fontSize === size
                                ? 'border-vscode-blue bg-vscode-blue/10'
                                : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FontSizePreview size={size} active={portfolioSettings.fontSize === size} />
                            <div className="mt-2 text-center">
                              <span className="text-xs font-medium text-vscode-text capitalize">{size}</span>
                            </div>
                            {portfolioSettings.fontSize === size && (
                              <div className="absolute top-2 right-2">
                                <Check size={16} className="text-vscode-blue" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                        Font Family
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['system', 'mono', 'sans'] as const).map((family) => (
                          <motion.button
                            key={family}
                            onClick={() => handleSettingChange('fontFamily', family)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              portfolioSettings.fontFamily === family
                                ? 'border-vscode-blue bg-vscode-blue/10'
                                : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FontFamilyPreview family={family} active={portfolioSettings.fontFamily === family} />
                            <div className="mt-2 text-center">
                              <span className="text-xs font-medium text-vscode-text capitalize">{family}</span>
                            </div>
                            {portfolioSettings.fontFamily === family && (
                              <div className="absolute top-2 right-2">
                                <Check size={16} className="text-vscode-blue" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="text-yellow-400" size={18} />
                <span className="text-sm font-semibold text-vscode-text">Content</span>
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
                    {[
                      { key: 'showStats', icon: TrendingUp, label: 'Show Statistics', desc: 'Display stats on welcome page', color: 'blue' },
                      { key: 'showSocialLinks', icon: Share2, label: 'Show Social Links', desc: 'Display social media links', color: 'pink' },
                      { key: 'showGitHubStats', icon: Sparkles, label: 'Show GitHub Stats', desc: 'Display GitHub profile data', color: 'purple' },
                      { key: 'showRecentItems', icon: Clock, label: 'Show Recent Items', desc: 'Display recently viewed items', color: 'green' },
                    ].map((item) => {
                      const Icon = item.icon
                      const colorClasses = {
                        blue: 'bg-blue-500/10 text-blue-400',
                        pink: 'bg-pink-500/10 text-pink-400',
                        purple: 'bg-purple-500/10 text-purple-400',
                        green: 'bg-green-500/10 text-green-400',
                      }
                      return (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-vscode-text">{item.label}</div>
                              <div className="text-xs text-vscode-text-secondary">{item.desc}</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={portfolioSettings[item.key as keyof PortfolioSettings] as boolean}
                              onChange={(e) => handleSettingChange(item.key as keyof PortfolioSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('notifications')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bell className="text-orange-400" size={18} />
                <span className="text-sm font-semibold text-vscode-text">Notifications</span>
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
                    {[
                      { key: 'emailNotifications', icon: Share2, label: 'Email Notifications', desc: 'Get notified via email', color: 'blue' },
                      { key: 'formSuccessAlerts', icon: Check, label: 'Form Success Alerts', desc: 'Show alerts on form success', color: 'green' },
                      { key: 'updateNotifications', icon: Info, label: 'Update Notifications', desc: 'Notify about updates', color: 'orange' },
                    ].map((item) => {
                      const Icon = item.icon
                      const colorClasses = {
                        blue: 'bg-blue-500/10 text-blue-400',
                        green: 'bg-green-500/10 text-green-400',
                        orange: 'bg-orange-500/10 text-orange-400',
                      }
                      return (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-vscode-text">{item.label}</div>
                              <div className="text-xs text-vscode-text-secondary">{item.desc}</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={portfolioSettings[item.key as keyof PortfolioSettings] as boolean}
                              onChange={(e) => handleSettingChange(item.key as keyof PortfolioSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Settings */}
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('navigation')}
              className="w-full flex items-center justify-between px-4 py-3 bg-vscode-active hover:bg-vscode-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <Share2 className="text-pink-400" size={18} />
                <span className="text-sm font-semibold text-vscode-text">Navigation</span>
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
                    {[
                      { key: 'enableQuickNav', icon: Zap, label: 'Enable Quick Navigation', desc: 'Fast access to pages', color: 'yellow' },
                      { key: 'showRecentlyViewed', icon: Clock, label: 'Show Recently Viewed', desc: 'Display recent items in sidebar', color: 'cyan' },
                    ].map((item) => {
                      const Icon = item.icon
                      const colorClasses = {
                        yellow: 'bg-yellow-500/10 text-yellow-400',
                        cyan: 'bg-cyan-500/10 text-cyan-400',
                      }
                      return (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-vscode-text">{item.label}</div>
                              <div className="text-xs text-vscode-text-secondary">{item.desc}</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={portfolioSettings[item.key as keyof PortfolioSettings] as boolean}
                              onChange={(e) => handleSettingChange(item.key as keyof PortfolioSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                          </label>
                        </div>
                      )
                    })}
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
