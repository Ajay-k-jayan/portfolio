'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Palette, Bell, Eye, Share2, FileText, 
  ChevronRight, ChevronDown, RotateCcw, Check, CheckCircle,
  Info, Type, Sparkles, Zap,
  Home, TrendingUp, Clock, Search, X, Moon, Globe,
  Calendar, Cloud, MapPin, Wifi, Cpu, Download, 
  Layout, Gauge, Mail as MailIcon, Navigation, Activity
} from 'lucide-react'
import { useAppStore, PortfolioSettings, defaultSettings } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { AlertBox } from '@/components/ui/alert-box'

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
    small: 'text-[10px]',
    medium: 'text-xs',
    large: 'text-sm'
  }
  return (
    <div className={`w-full h-16 rounded border-2 transition-all ${
      active 
        ? 'border-vscode-blue bg-gradient-to-br from-vscode-blue/20 to-vscode-blue/10' 
        : 'border-vscode-border bg-vscode-active/80 hover:bg-vscode-hover'
    }`}>
      <div className="p-2.5 h-full flex items-center justify-center">
        <p className={`${sizeMap[size]} text-vscode-text font-medium ${active ? 'text-vscode-blue' : ''}`}>
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
      active 
        ? 'border-vscode-blue bg-gradient-to-br from-vscode-blue/20 to-vscode-blue/10' 
        : 'border-vscode-border bg-vscode-active/80 hover:bg-vscode-hover'
    }`}>
      <div className="p-2.5 h-full flex items-center justify-center">
        <p className={`text-xs font-medium ${familyMap[family]} ${active ? 'text-vscode-blue' : 'text-vscode-text'}`}>
          {family === 'mono' ? 'Consolas Mono' : family === 'sans' ? 'Inter Sans' : 'System Font'}
        </p>
      </div>
    </div>
  )
}

const ThemePreviewCard = ({ theme, active, onClick }: { theme: any, active: boolean, onClick: () => void }) => {
  return (
    <div className="flex flex-col gap-2">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full rounded-lg border-2 transition-all overflow-hidden ${
          active 
            ? 'border-vscode-blue ring-2 ring-vscode-blue/50 shadow-lg shadow-vscode-blue/20' 
            : 'border-vscode-border hover:border-vscode-blue/50 hover:shadow-md'
        }`}
      >
        {/* Code Editor Preview */}
        <div 
          className="h-20 w-full relative"
          style={{ 
            backgroundColor: theme.colors.bg
          }}
        >
          {/* Editor Title Bar */}
          <div 
            className="h-4 flex items-center px-1.5 border-b"
            style={{ 
              backgroundColor: theme.colors.sidebar,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.red || '#f48771' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.yellow || '#dcdcaa' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.green || '#4ec9b0' }} />
            </div>
            <div 
              className="text-[7px] ml-1.5 font-mono"
              style={{ color: theme.colors.textSecondary || theme.colors.text }}
            >
              app.ts
            </div>
          </div>

          {/* Code Content */}
          <div className="p-1.5 h-full font-mono text-[8px] leading-[1.2]">
            <div className="flex items-start gap-1">
              <div 
                className="text-[7px] text-right select-none flex-shrink-0"
                style={{ color: theme.colors.textSecondary, width: '14px' }}
              >
                1
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ color: theme.colors.blue || '#007acc' }}>function</span>
                <span style={{ color: theme.colors.text }}> func(</span>
                <span style={{ color: theme.colors.text }}>param</span>
                <span style={{ color: theme.colors.text }}>) {'{'}</span>
              </div>
            </div>
            <div className="flex items-start gap-1 mt-0.5">
              <div 
                className="text-[7px] text-right select-none flex-shrink-0"
                style={{ color: theme.colors.textSecondary, width: '14px' }}
              >
                2
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ color: theme.colors.textSecondary }}>  </span>
                <span style={{ color: theme.colors.blue || '#007acc' }}>const</span>
                <span style={{ color: theme.colors.text }}> text = </span>
                <span style={{ color: theme.colors.orange || '#ce9178' }}>&quot;Sample&quot;</span>
                <span style={{ color: theme.colors.text }}>;</span>
              </div>
            </div>
            <div className="flex items-start gap-1 mt-0.5">
              <div 
                className="text-[7px] text-right select-none flex-shrink-0"
                style={{ color: theme.colors.textSecondary, width: '14px' }}
              >
                3
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ color: theme.colors.textSecondary }}>  </span>
                <span style={{ color: theme.colors.purple || '#c586c0' }}>return</span>
                <span style={{ color: theme.colors.text }}> {'{'} text, </span>
                <span style={{ color: theme.colors.text }}>boolean</span>
                <span style={{ color: theme.colors.text }}>: </span>
                <span style={{ color: theme.colors.blue || '#007acc' }}>true</span>
                <span style={{ color: theme.colors.text }}> {'}'}</span>
              </div>
            </div>
          </div>
        </div>

        {active && (
          <div className="absolute top-1.5 right-1.5 z-20">
            <div className="w-4 h-4 bg-vscode-blue rounded-full flex items-center justify-center shadow-lg">
              <Check size={10} className="text-white" />
            </div>
          </div>
        )}
      </motion.button>

      {/* Theme Name - Outside Card */}
      <div className="text-center">
        <div 
          className="text-xs font-medium"
          style={{ color: active ? 'var(--theme-blue, #007acc)' : theme.colors.text || '#cccccc' }}
        >
          {theme.name}
        </div>
      </div>
    </div>
  )
}

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

interface SettingsCategory {
  id: string
  label: string
  icon: any
  iconColor: string
  settings: Array<{
    key: string
    label: string
    description?: string
  }>
}

// Define settings categories (constant, moved outside component)
const settingsCategories: SettingsCategory[] = [
    {
      id: 'display',
      label: 'Display',
      icon: Eye,
      iconColor: 'text-blue-400',
      settings: [
        { key: 'compactView', label: 'Compact View', description: 'Use compact spacing' },
        { key: 'showAnimations', label: 'Show Animations', description: 'Enable smooth transitions' },
        { key: 'animationSpeed', label: 'Animation Speed', description: 'Control animation duration' },
      ]
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      iconColor: 'text-purple-400',
      settings: [
        { key: 'theme', label: 'Theme', description: 'Choose color theme' },
        { key: 'fontSize', label: 'Font Size', description: 'Adjust text size' },
        { key: 'fontFamily', label: 'Font Family', description: 'Choose font style' },
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      iconColor: 'text-yellow-400',
      settings: [
        { key: 'showStats', label: 'Show Statistics', description: 'Display stats on welcome page' },
        { key: 'showSocialLinks', label: 'Show Social Links', description: 'Display social media links' },
        { key: 'showGitHubStats', label: 'Show GitHub Stats', description: 'Display GitHub profile data' },
        { key: 'showRecentItems', label: 'Show Recent Items', description: 'Display recently viewed items' },
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      iconColor: 'text-orange-400',
      settings: [
        { key: 'updateNotifications', label: 'Update Notifications', description: 'Notify about updates' },
      ]
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: Navigation,
      iconColor: 'text-pink-400',
      settings: [
        { key: 'enableQuickNav', label: 'Enable Quick Navigation', description: 'Fast access to pages' },
        { key: 'showRecentlyViewed', label: 'Show Recently Viewed', description: 'Display recent items in sidebar' },
      ]
    },
    {
      id: 'header',
      label: 'Header',
      icon: Layout,
      iconColor: 'text-indigo-400',
      settings: [
        { key: 'showThemeSwitcher', label: 'Theme Switcher', description: 'Show theme selector in header' },
        { key: 'showLanguageSwitcher', label: 'Language Switcher', description: 'Show language selector in header' },
      ]
    },
    {
      id: 'statusbar',
      label: 'Status Bar',
      icon: Activity,
      iconColor: 'text-cyan-400',
      settings: [
        { key: 'showDateTimeWidget', label: 'Date & Time', description: 'Show date and time in status bar' },
        { key: 'showWeatherWidget', label: 'Weather', description: 'Show weather information' },
        { key: 'showLocationWidget', label: 'Location', description: 'Show current location' },
        { key: 'showNetworkStatusWidget', label: 'Network Status', description: 'Show network latency' },
        { key: 'showSystemInfoWidget', label: 'System Info', description: 'Show CPU and memory usage' },
        { key: 'showSocialLinksWidget', label: 'Social Links', description: 'Show social media links' },
        { key: 'showResumeDownload', label: 'Resume Download', description: 'Show resume download button' },
      ]
    },
]

export function SettingsView() {
  const { portfolioSettings, updateSettings, resetSettings, addNotification } = useAppStore()
  const { themes, setTheme, currentTheme } = useEnhancedTheme()
  // All categories expanded by default
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(settingsCategories.map(cat => cat.id))
  )
  const [showResetNotification, setShowResetNotification] = useState(false)
  const [showChangeNotification, setShowChangeNotification] = useState(false)
  const [lastChangedSetting, setLastChangedSetting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return settingsCategories
    
    const query = searchQuery.toLowerCase()
    return settingsCategories.filter(category => {
      const categoryMatches = category.label.toLowerCase().includes(query)
      const settingsMatch = category.settings.some(setting => 
        setting.label.toLowerCase().includes(query) ||
        setting.description?.toLowerCase().includes(query)
      )
      return categoryMatches || settingsMatch
    }).map(category => ({
      ...category,
      settings: category.settings.filter(setting =>
        setting.label.toLowerCase().includes(query) ||
        setting.description?.toLowerCase().includes(query)
      )
    }))
  }, [searchQuery])

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
      compactView: 'Compact View',
      showAnimations: 'Show Animations',
      animationSpeed: 'Animation Speed',
      showStats: 'Show Statistics',
      showSocialLinks: 'Show Social Links',
      showGitHubStats: 'Show GitHub Stats',
      showRecentItems: 'Show Recent Items',
      updateNotifications: 'Update Notifications',
      enableQuickNav: 'Enable Quick Navigation',
      showRecentlyViewed: 'Show Recently Viewed',
      theme: 'Theme',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
      showDateTimeWidget: 'Date & Time Widget',
      showWeatherWidget: 'Weather Widget',
      showLocationWidget: 'Location Widget',
      showNetworkStatusWidget: 'Network Status Widget',
      showSystemInfoWidget: 'System Info Widget',
      showSocialLinksWidget: 'Social Links Widget',
      showResumeDownload: 'Resume Download',
      showThemeSwitcher: 'Theme Switcher',
      showLanguageSwitcher: 'Language Switcher',
    }
    
    const settingLabel = settingLabels[key] || key
    
    // Add notification for setting change
    if (key === 'theme') {
      const themeNames: Record<string, string> = {
        dark: 'Dark',
        light: 'Light',
        'dark-plus': 'Dark+',
        'light-plus': 'Light+',
        'monokai': 'Monokai',
        'github-dark': 'GitHub Dark',
        'github-light': 'GitHub Light',
        'solarized-dark': 'Solarized Dark',
        'solarized-light': 'Solarized Light',
        'one-dark-pro': 'One Dark Pro',
      }
      const themeName = themeNames[value as string] || (value as string)
      addNotification({
        title: 'Setting Changed',
        message: `Theme updated to ${themeName}`,
        type: 'info'
      })
    } else {
      addNotification({
        title: 'Setting Changed',
        message: `${settingLabel} updated`,
        type: 'info'
      })
    }
    
    setLastChangedSetting(settingLabel)
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
      {/* Floating Notification Toast - Bottom Right (Theme-Aware Visual Studio Style) */}
      <AnimatePresence>
        {showResetNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ 
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="fixed bottom-12 right-2 z-[100]"
          >
            <AlertBox
              type="success"
              title="Settings Reset"
              message="All settings restored to defaults"
              onClose={() => setShowResetNotification(false)}
              showCloseButton={true}
            />
          </motion.div>
        )}
        {showChangeNotification && !showResetNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ 
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="fixed bottom-12 right-2 z-[100]"
          >
            <AlertBox
              type="info"
              title="Setting Changed"
              message={lastChangedSetting ? `${lastChangedSetting} updated` : 'Setting updated'}
              onClose={() => setShowChangeNotification(false)}
              showCloseButton={true}
            />
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
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400"
                  >
                    <Info size={14} />
                    <span>Modified</span>
                  </motion.div>
                  <motion.button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-vscode-border rounded text-sm transition-colors bg-vscode-active hover:bg-vscode-hover text-vscode-text"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} />
                    <span>Reset to Defaults</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Advanced Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 bg-vscode-sidebar border border-vscode-border rounded-lg text-sm text-vscode-text placeholder-vscode-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:border-vscode-blue transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-vscode-text-secondary"
            >
              Found {filteredCategories.reduce((acc, cat) => acc + cat.settings.length, 0)} matching setting{filteredCategories.reduce((acc, cat) => acc + cat.settings.length, 0) !== 1 ? 's' : ''}
            </motion.p>
          )}
        </div>

        {/* Settings Categories - Card Design */}
        <AnimatePresence mode="wait">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <Search className="mx-auto text-vscode-text-secondary mb-3" size={36} />
              <p className="text-sm text-vscode-text-secondary">No settings found matching &quot;{searchQuery}&quot;</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const Icon = category.icon
                const isExpanded = expandedSections.has(category.id)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-vscode-sidebar border border-vscode-border rounded overflow-hidden hover:border-vscode-border/80 transition-all"
                  >
                    <motion.button
                      onClick={() => toggleSection(category.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-vscode-active hover:bg-vscode-hover transition-colors"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${
                          category.iconColor === 'text-blue-400' ? 'bg-blue-500/20' :
                          category.iconColor === 'text-purple-400' ? 'bg-purple-500/20' :
                          category.iconColor === 'text-yellow-400' ? 'bg-yellow-500/20' :
                          category.iconColor === 'text-orange-400' ? 'bg-orange-500/20' :
                          category.iconColor === 'text-pink-400' ? 'bg-pink-500/20' :
                          'bg-vscode-active/50'
                        }`}>
                          <Icon className={category.iconColor} size={16} />
                        </div>
                        <span className="text-xs font-medium text-vscode-text">{category.label}</span>
                      </div>
                      <ChevronRight 
                        className={`text-vscode-text-secondary transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        size={14} 
                      />
                    </motion.button>
                    <AnimatePresence>
                      {isExpanded && category.settings.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-4">
                            {/* Render category-specific content */}
                            {category.id === 'display' && (
                              <>
                                {/* Compact View Toggle */}
                                <div>
                                  <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                                    View Mode
                                  </label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                      onClick={() => handleSettingChange('compactView', false)}
                                      className={`relative p-3 rounded border-2 transition-all ${
                                        !portfolioSettings.compactView
                                          ? 'border-vscode-blue bg-vscode-blue/10'
                                          : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                                      }`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <NormalViewPreview active={!portfolioSettings.compactView} />
                                      {!portfolioSettings.compactView && (
                                        <div className="absolute top-1.5 right-1.5">
                                          <Check size={12} className="text-vscode-blue" />
                                        </div>
                                      )}
                                    </motion.button>
                                    <motion.button
                                      onClick={() => handleSettingChange('compactView', true)}
                                      className={`relative p-3 rounded border-2 transition-all ${
                                        portfolioSettings.compactView
                                          ? 'border-vscode-blue bg-vscode-blue/10'
                                          : 'border-vscode-border bg-vscode-active hover:border-vscode-blue/50'
                                      }`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <CompactViewPreview active={portfolioSettings.compactView} />
                                      {portfolioSettings.compactView && (
                                        <div className="absolute top-1.5 right-1.5">
                                          <Check size={12} className="text-vscode-blue" />
                                        </div>
                                      )}
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Animation Speed */}
                                <div>
                                  <label className="block text-xs font-medium text-vscode-text-secondary mb-2">
                                    Animation Speed
                                  </label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(['fast', 'normal', 'slow'] as const).map((speed) => (
                                      <motion.button
                                        key={speed}
                                        onClick={() => handleSettingChange('animationSpeed', speed)}
                                        className={`relative p-2.5 rounded border-2 transition-all ${
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
                                        {portfolioSettings.animationSpeed === speed && (
                                          <div className="absolute top-1.5 right-1.5">
                                            <Check size={12} className="text-vscode-blue" />
                                          </div>
                                        )}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                {/* Toggle Settings */}
                                <div className="space-y-2">
                                  {category.settings.filter(s => s.key !== 'compactView' && s.key !== 'animationSpeed').map((setting) => {
                                    // Get icon for each setting
                                    const getSettingIcon = (key: string) => {
                                      const iconMap: Record<string, any> = {
                                        showAnimations: Zap,
                                        showStats: TrendingUp,
                                        showSocialLinks: Share2,
                                        showGitHubStats: Sparkles,
                                        showRecentItems: Clock,
                                        updateNotifications: Info,
                                        enableQuickNav: Zap,
                                        showRecentlyViewed: Clock,
                                        showDateTimeWidget: Calendar,
                                        showWeatherWidget: Cloud,
                                        showLocationWidget: MapPin,
                                        showNetworkStatusWidget: Wifi,
                                        showSystemInfoWidget: Cpu,
                                        showSocialLinksWidget: Share2,
                                        showResumeDownload: Download,
                                        showThemeSwitcher: Moon,
                                        showLanguageSwitcher: Globe,
                                      }
                                      return iconMap[key] || Eye
                                    }
                                    
                                    const SettingIcon = getSettingIcon(setting.key)
                                    const iconColorClass = category.iconColor
                                    
                                    return (
                                      <div key={setting.key} className="flex items-center justify-between p-2.5 bg-vscode-active rounded hover:bg-vscode-hover transition-colors">
                                        <div className="flex items-center gap-2.5">
                                          <div className={`p-1.5 rounded ${
                                            category.iconColor === 'text-blue-400' ? 'bg-blue-500/10' :
                                            category.iconColor === 'text-purple-400' ? 'bg-purple-500/10' :
                                            category.iconColor === 'text-yellow-400' ? 'bg-yellow-500/10' :
                                            category.iconColor === 'text-orange-400' ? 'bg-orange-500/10' :
                                            category.iconColor === 'text-pink-400' ? 'bg-pink-500/10' :
                                            category.iconColor === 'text-cyan-400' ? 'bg-cyan-500/10' :
                                            category.iconColor === 'text-indigo-400' ? 'bg-indigo-500/10' :
                                            'bg-vscode-active/50'
                                          }`}>
                                            <SettingIcon className={iconColorClass} size={14} />
                                          </div>
                                          <div>
                                            <div className="text-xs font-medium text-vscode-text">{setting.label}</div>
                                            {setting.description && (
                                              <div className="text-[10px] text-vscode-text-secondary leading-tight">{setting.description}</div>
                                            )}
                                          </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                          <input
                                            type="checkbox"
                                            checked={portfolioSettings[setting.key as keyof PortfolioSettings] as boolean}
                                            onChange={(e) => handleSettingChange(setting.key as keyof PortfolioSettings, e.target.checked)}
                                            className="sr-only peer"
                                          />
                                          <div className="w-9 h-5 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-vscode-blue"></div>
                                        </label>
                                      </div>
                                    )
                                  })}
                                </div>
                              </>
                            )}

                            {category.id === 'appearance' && (
                              <>
                                {/* Theme Selection */}
                                {category.settings.find(s => s.key === 'theme') && (
                                  <div>
                                    <label className="block text-xs font-medium text-vscode-text-secondary mb-3">
                                      Theme
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                )}

                                {/* Font Size */}
                                {category.settings.find(s => s.key === 'fontSize') && (
                                  <div>
                                    <label className="block text-xs font-medium text-vscode-text-secondary mb-2">
                                      Font Size
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                      {(['small', 'medium', 'large'] as const).map((size) => (
                                        <motion.button
                                          key={size}
                                          onClick={() => handleSettingChange('fontSize', size)}
                                          className={`relative rounded-lg border-2 transition-all ${
                                            portfolioSettings.fontSize === size
                                              ? 'border-vscode-blue bg-vscode-sidebar'
                                              : 'border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/50'
                                          }`}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                            <FontSizePreview size={size} active={portfolioSettings.fontSize === size} />
                            <div className="pb-2 text-center">
                              <span className={`text-[10px] font-medium capitalize ${
                                portfolioSettings.fontSize === size 
                                  ? 'text-vscode-blue' 
                                  : 'text-vscode-text-secondary'
                              }`}>
                                {size}
                              </span>
                            </div>
                            {portfolioSettings.fontSize === size && (
                              <div className="absolute top-1.5 right-1.5">
                                <div className="w-4 h-4 bg-vscode-blue rounded-full flex items-center justify-center">
                                  <Check size={10} className="text-white" />
                                </div>
                              </div>
                            )}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Font Family */}
                                {category.settings.find(s => s.key === 'fontFamily') && (
                                  <div>
                                    <label className="block text-xs font-medium text-vscode-text-secondary mb-2">
                                      Font Family
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                      {(['system', 'mono', 'sans'] as const).map((family) => (
                                        <motion.button
                                          key={family}
                                          onClick={() => handleSettingChange('fontFamily', family)}
                                          className={`relative rounded-lg border-2 transition-all ${
                                            portfolioSettings.fontFamily === family
                                              ? 'border-vscode-blue bg-vscode-sidebar'
                                              : 'border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/50'
                                          }`}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                            <FontFamilyPreview family={family} active={portfolioSettings.fontFamily === family} />
                            <div className="pb-2 text-center">
                              <span className={`text-[10px] font-medium capitalize ${
                                portfolioSettings.fontFamily === family 
                                  ? 'text-vscode-blue' 
                                  : 'text-vscode-text-secondary'
                              }`}>
                                {family}
                              </span>
                            </div>
                            {portfolioSettings.fontFamily === family && (
                              <div className="absolute top-1.5 right-1.5">
                                <div className="w-4 h-4 bg-vscode-blue rounded-full flex items-center justify-center">
                                  <Check size={10} className="text-white" />
                                </div>
                              </div>
                            )}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Other categories - Simple toggle switches */}
                            {!['display', 'appearance'].includes(category.id) && (
                              <div className="space-y-3">
                                {category.settings.map((setting) => {
                                  const settingIcons: Record<string, any> = {
                                    showStats: TrendingUp,
                                    showSocialLinks: Share2,
                                    showGitHubStats: Sparkles,
                                    showRecentItems: Clock,
                                    emailNotifications: Share2,
                                    formSuccessAlerts: Check,
                                    updateNotifications: Info,
                                    enableQuickNav: Zap,
                                    showRecentlyViewed: Clock,
                                  }
                                  const settingColors: Record<string, string> = {
                                    showStats: 'bg-blue-500/10 text-blue-400',
                                    showSocialLinks: 'bg-pink-500/10 text-pink-400',
                                    showGitHubStats: 'bg-purple-500/10 text-purple-400',
                                    showRecentItems: 'bg-green-500/10 text-green-400',
                                    emailNotifications: 'bg-blue-500/10 text-blue-400',
                                    formSuccessAlerts: 'bg-green-500/10 text-green-400',
                                    updateNotifications: 'bg-orange-500/10 text-orange-400',
                                    enableQuickNav: 'bg-yellow-500/10 text-yellow-400',
                                    showRecentlyViewed: 'bg-cyan-500/10 text-cyan-400',
                                  }
                                  const SettingIcon = settingIcons[setting.key] || category.icon
                                  const iconColor = settingColors[setting.key] || (
                                    category.iconColor === 'text-blue-400' ? 'bg-blue-500/10' :
                                    category.iconColor === 'text-purple-400' ? 'bg-purple-500/10' :
                                    category.iconColor === 'text-yellow-400' ? 'bg-yellow-500/10' :
                                    category.iconColor === 'text-orange-400' ? 'bg-orange-500/10' :
                                    category.iconColor === 'text-pink-400' ? 'bg-pink-500/10' :
                                    'bg-vscode-active/50'
                                  )
                                  const iconTextColor = settingColors[setting.key]?.split(' ')[1] || category.iconColor
                                  
  return (
                                    <div key={setting.key} className="flex items-center justify-between p-3 bg-vscode-active rounded-lg hover:bg-vscode-hover transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded ${iconColor}`}>
                                          <SettingIcon className={iconTextColor} size={16} />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium text-vscode-text">{setting.label}</div>
                                          {setting.description && (
                                            <div className="text-xs text-vscode-text-secondary">{setting.description}</div>
                                          )}
                                        </div>
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={portfolioSettings[setting.key as keyof PortfolioSettings] as boolean}
                                          onChange={(e) => handleSettingChange(setting.key as keyof PortfolioSettings, e.target.checked)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-vscode-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vscode-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-blue"></div>
                                      </label>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
