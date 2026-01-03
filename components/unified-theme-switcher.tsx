'use client'

import { useState, useEffect, useMemo } from 'react'
import { Palette, Moon, Sun, Search, X, Check, Sparkles, Settings, Grid3x3, List, Zap, Eye, Copy, Star } from 'lucide-react'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { Theme } from '@/lib/theme-manager'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { AdvancedThemeDropdown } from './advanced-theme-dropdown'

export function UnifiedThemeSwitcher() {
  const { currentTheme, themes, setTheme, themeManager, transitionDuration, setTransitionDuration } = useEnhancedTheme()
  const [showSelector, setShowSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'dark' | 'light'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Filter themes based on search and type
  const filteredThemes = useMemo(() => {
    // Safety check - ensure themes array exists
    const safeThemes = themes || []
    return safeThemes.filter(theme => {
      const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           theme.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'all' || theme.type === filterType
      return matchesSearch && matchesType
    })
  }, [themes, searchQuery, filterType])

  const getActiveIcon = () => {
    if (!currentTheme) return Moon
    if (currentTheme.type === 'light') return Sun
    return Moon
  }

  const ActiveIcon = getActiveIcon()
  
  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    if (showSelector) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [showSelector])

  // Safety check for currentTheme
  if (!currentTheme) {
    return (
      <div className="p-2.5 rounded-lg bg-vscode-active/50 border border-vscode-border/50">
        <Moon size={18} className="text-vscode-text-secondary" />
      </div>
    )
  }

  // Premium Theme Card with Advanced Effects
  const PremiumThemeCard = ({ theme, index }: { theme: Theme; index: number }) => {
    const isSelected = currentTheme?.id === theme.id
    const isHovered = hoveredTheme === theme.id
    const isPreviewing = previewTheme === theme.id

    // Parallax effect based on mouse position
    const cardRef = useState(null)[0]
    const [cardBounds, setCardBounds] = useState({ x: 0, y: 0 })
    
    useEffect(() => {
      const updateBounds = () => {
        if (cardRef) {
          const rect = (cardRef as any).getBoundingClientRect()
          setCardBounds({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          })
        }
      }
      updateBounds()
      window.addEventListener('resize', updateBounds)
      return () => window.removeEventListener('resize', updateBounds)
    }, [cardRef])

    const deltaX = mousePosition.x - cardBounds.x
    const deltaY = mousePosition.y - cardBounds.y
    const rotateX = isHovered ? deltaY * 0.02 : 0
    const rotateY = isHovered ? deltaX * -0.02 : 0

    return (
      <motion.div
        ref={cardRef as any}
        initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          z: isHovered ? 50 : 0,
        }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ 
          delay: index * 0.04, 
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
        onHoverStart={() => setHoveredTheme(theme.id)}
        onHoverEnd={() => setHoveredTheme(null)}
        onMouseEnter={() => setPreviewTheme(theme.id)}
        onMouseLeave={() => setPreviewTheme(null)}
        className="relative group perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <motion.button
          onClick={() => {
            setTheme(theme.id)
            setTimeout(() => setShowSelector(false), 400)
          }}
          className={`relative w-full rounded-2xl overflow-hidden transition-all duration-500 ${
            isSelected
              ? 'ring-4 ring-vscode-blue ring-offset-4 ring-offset-vscode-sidebar shadow-2xl'
              : 'ring-2 ring-vscode-border/50 hover:ring-vscode-blue/70 shadow-xl hover:shadow-2xl'
          }`}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: `linear-gradient(145deg, ${theme.colors.bg} 0%, ${theme.colors.sidebar} 50%, ${theme.colors.active} 100%)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Animated Mesh Gradient Overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${theme.colors.blue}30 0%, transparent 50%)`,
            }}
            animate={{
              opacity: isHovered ? 0.4 : 0,
            }}
          />

          {/* Glassmorphism Overlay */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
            animate={{
              opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Neon Glow Effect */}
          {isSelected && (
            <motion.div
              className="absolute -inset-1 rounded-2xl blur-xl"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple}, ${theme.colors.green})`,
                opacity: 0.6,
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Floating Particles */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: theme.colors.blue,
                    left: `${20 + i * 15}%`,
                    top: `${20 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="relative p-5 space-y-4 z-10">
            {/* Animated Header with Color Swatches */}
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                {[theme.colors.blue, theme.colors.green, theme.colors.orange, theme.colors.purple].map((color, idx) => (
                  <motion.div
                    key={idx}
                    className="w-10 h-10 rounded-xl border-2 border-white/30 shadow-lg"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.2, rotate: 360, zIndex: 10 }}
                    animate={{
                      y: isHovered ? [0, -5, 0] : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      duration: 1.5,
                      repeat: Infinity,
                      delay: idx * 0.1,
                    }}
                  />
                ))}
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple})`,
                  }}
                >
                  <Check size={18} className="text-white" />
                </motion.div>
              )}
            </div>

            {/* Live Code Preview with Syntax Highlighting */}
            <motion.div 
              className="bg-black/40 rounded-xl p-4 backdrop-blur-md border border-white/10 relative overflow-hidden"
              animate={{
                scale: isHovered ? 1.02 : 1,
              }}
            >
              {/* Terminal Window Decoration */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-white/50 font-mono">theme.ts</div>
              </div>
              
              {/* Animated Code Sample */}
              <motion.div 
                className="space-y-1.5 font-mono text-xs"
                style={{ color: theme.colors.text }}
                initial="hidden"
                animate={isHovered ? "visible" : "hidden"}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <span style={{ color: theme.colors.purple }}>const</span>{' '}
                  <span style={{ color: theme.colors.blue }}>theme</span>{' '}
                  <span style={{ color: theme.colors.text }}>=</span>{' '}
                  <span style={{ color: theme.colors.green }}>&apos;{theme.name}&apos;</span>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  transition={{ delay: 0.1 }}
                >
                  <span style={{ color: theme.colors.textSecondary }}>{/* {theme.description} */}</span>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  transition={{ delay: 0.2 }}
                >
                  <span style={{ color: theme.colors.orange }}>console</span>.
                  <span style={{ color: theme.colors.blue }}>log</span>(
                  <span style={{ color: theme.colors.green }}>&apos;Beautiful!&apos;</span>)
                </motion.div>
              </motion.div>

              {/* Typing Cursor */}
              {isHovered && (
                <motion.span
                  className="inline-block w-0.5 h-4 ml-1"
                  style={{ backgroundColor: theme.colors.blue }}
                  animate={{
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.div>

            {/* Theme Info with Badge */}
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  className="font-bold text-base mb-1 flex items-center gap-2"
                  style={{ color: theme.colors.text }}
                  animate={{
                    x: isHovered ? [0, 5, 0] : 0,
                  }}
                >
                  {theme.name}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple})`,
                        color: 'white',
                      }}
                    >
                      Active
                    </motion.span>
                  )}
                </motion.div>
                <div
                  className="text-xs opacity-75 flex items-center gap-2"
                  style={{ color: theme.colors.textSecondary }}
                >
                  <Eye size={12} />
                  {theme.description}
                </div>
              </div>
            </div>

            {/* Hover Glow Line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.colors.blue}, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
          />
        </motion.button>
      </motion.div>
    )
  }

  // Compact List View with Advanced Effects
  const PremiumListItem = ({ theme, index }: { theme: Theme; index: number }) => {
    const isSelected = currentTheme?.id === theme.id

    return (
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, type: 'spring' }}
        onClick={() => {
          setTheme(theme.id)
          setTimeout(() => setShowSelector(false), 300)
        }}
        onMouseEnter={() => setPreviewTheme(theme.id)}
        onMouseLeave={() => setPreviewTheme(null)}
        className={`relative w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 overflow-hidden ${
          isSelected
            ? 'bg-gradient-to-r from-vscode-blue/30 to-purple-500/20 border-2 border-vscode-blue shadow-xl'
            : 'bg-vscode-active/50 border-2 border-vscode-border hover:border-vscode-blue/50 hover:bg-vscode-active shadow-lg'
        }`}
        whileHover={{ x: 6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${theme.colors.bg}20, ${theme.colors.sidebar}20, ${theme.colors.active}20)`,
          }}
          animate={{
            opacity: previewTheme === theme.id ? 0.3 : 0,
          }}
        />

        {/* Theme Preview Swatch */}
        <motion.div
          className="w-20 h-20 rounded-xl flex-shrink-0 relative overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.bg}, ${theme.colors.sidebar})`,
            border: `3px solid ${theme.colors.border}`,
          }}
          whileHover={{ rotate: [0, 5, -5, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 p-2 grid grid-cols-2 gap-1">
            {[theme.colors.blue, theme.colors.green, theme.colors.orange, theme.colors.purple].map((color, idx) => (
              <div
                key={idx}
                className="rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>

        {/* Theme Info */}
        <div className="flex-1 text-left z-10">
          <div className="font-bold text-vscode-text mb-1 flex items-center gap-2">
            {theme.name}
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs px-2 py-0.5 rounded-full bg-vscode-blue text-white"
              >
                Active
              </motion.span>
            )}
          </div>
          <div className="text-sm text-vscode-text-secondary">{theme.description}</div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 z-10">
          <motion.div
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: theme.type === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
              color: theme.colors.text,
            }}
          >
            {theme.type}
          </motion.div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-vscode-blue to-purple-500 flex items-center justify-center shadow-lg"
            >
              <Check size={16} className="text-white" />
            </motion.div>
          )}
        </div>
      </motion.button>
    )
  }

  return (
    <>
      {/* Premium Trigger Button */}
      <motion.button
        onClick={() => setShowSelector(true)}
        className="relative p-3 rounded-xl bg-gradient-to-br from-vscode-active via-vscode-sidebar to-vscode-active backdrop-blur-sm border border-vscode-border/50 hover:border-vscode-blue transition-all duration-300 group overflow-hidden"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
        whileTap={{ scale: 0.95 }}
        title="Themes"
      >
        {/* Animated Background */}
        {currentTheme && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.blue}25, ${currentTheme.colors.purple}25)`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Icon with Rotation */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10"
        >
          <ActiveIcon
            size={20}
            className={`transition-colors duration-300 ${
              currentTheme?.type === 'light'
                ? 'text-yellow-400'
                : 'text-vscode-blue'
            }`}
          />
        </motion.div>

        {/* Sparkle Particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                x: [0, Math.sin(i) * 20],
                y: [0, Math.cos(i) * 20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles size={8} className="text-vscode-blue/60" />
            </motion.div>
          ))}
        </div>
      </motion.button>

      {/* Premium Modal with Advanced Animations */}
      <AnimatePresence>
        {showSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-xl z-[60]"
              onClick={() => setShowSelector(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[92vw] md:max-w-7xl md:h-[88vh] bg-vscode-sidebar/95 backdrop-blur-2xl border-2 border-vscode-border rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: currentTheme ? `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px ${currentTheme.colors.border}, inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 100px ${currentTheme.colors.blue}20` : undefined,
              }}
            >
              {/* Animated Header with Gradient */}
              <div className="relative p-6 border-b border-vscode-border bg-gradient-to-r from-vscode-sidebar via-vscode-blue/10 to-vscode-sidebar overflow-hidden">
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${currentTheme?.colors.blue} 0%, transparent 50%)`,
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Palette size={28} className="text-vscode-blue" />
                    </motion.div>
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-vscode-text mb-1 flex items-center gap-2"
                      >
                        Theme Studio
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Zap size={20} className="text-yellow-400" />
                        </motion.span>
                      </motion.h2>
                      <p className="text-sm text-vscode-text-secondary">
                        {filteredThemes.length} premium theme{filteredThemes.length !== 1 ? 's' : ''} • Choose your vibe
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setShowSelector(false)}
                    className="p-2 hover:bg-vscode-hover rounded-xl transition-colors group"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={22} className="text-vscode-text-secondary group-hover:text-vscode-text" />
                  </motion.button>
                </div>
              </div>

              {/* Advanced Search and Filters */}
              <div className="p-6 space-y-4 border-b border-vscode-border bg-gradient-to-b from-vscode-active/30 to-transparent">
                {/* Advanced Theme Dropdown */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <AdvancedThemeDropdown />
                  </div>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vscode-text-secondary" size={20} />
                    <motion.input
                      type="text"
                      placeholder="🔍 Search themes by name or style..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-vscode-sidebar border-2 border-vscode-border rounded-2xl pl-12 pr-4 py-4 text-vscode-text text-base focus:outline-none focus:border-vscode-blue focus:ring-2 focus:ring-vscode-blue/30 transition-all shadow-lg"
                      whileFocus={{ scale: 1.02 }}
                    />
                    {searchQuery && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-vscode-hover rounded-xl"
                      >
                        <X size={18} className="text-vscode-text-secondary" />
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-2">
                    {(['all', 'dark', 'light'] as const).map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => setFilterType(type)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                          filterType === type
                            ? 'bg-gradient-to-r from-vscode-blue to-purple-500 text-white shadow-lg scale-105'
                            : 'bg-vscode-sidebar text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text shadow-md'
                        }`}
                      >
                        {type === 'dark' ? <Moon size={16} /> : type === 'light' ? <Sun size={16} /> : <Star size={16} />}
                        <span className="capitalize">{type === 'all' ? 'All Themes' : type}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-vscode-sidebar rounded-xl p-1 shadow-lg">
                    <motion.button
                      onClick={() => setViewMode('grid')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-gradient-to-r from-vscode-blue to-purple-500 text-white shadow-lg'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                      }`}
                    >
                      <Grid3x3 size={20} />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('list')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-gradient-to-r from-vscode-blue to-purple-500 text-white shadow-lg'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                      }`}
                    >
                      <List size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Themes Display */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {filteredThemes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <div className="text-xl text-vscode-text-secondary mb-2">No themes found</div>
                    <div className="text-sm text-vscode-text-secondary/70">Try adjusting your search or filters</div>
                  </motion.div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredThemes.map((theme, index) => (
                        <PremiumThemeCard key={theme.id} theme={theme} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <AnimatePresence>
                      {filteredThemes.map((theme, index) => (
                        <PremiumListItem key={theme.id} theme={theme} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer with Transition Control */}
              <div className="p-5 border-t border-vscode-border bg-gradient-to-r from-vscode-active/50 to-transparent flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm">
                  <Settings size={18} className="text-vscode-text-secondary" />
                  <span className="text-vscode-text-secondary">Transition:</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={transitionDuration}
                    onChange={(e) => setTransitionDuration(Number(e.target.value))}
                    className="w-40 accent-vscode-blue"
                  />
                  <span className="text-vscode-text font-mono font-semibold">{transitionDuration}ms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-vscode-text-secondary">
                    Active: <span className="text-vscode-blue font-bold">{currentTheme?.name || 'Loading...'}</span>
                  </div>
                  {currentTheme && (
                    <motion.div
                      className="w-8 h-8 rounded-full border-2 border-vscode-blue"
                      style={{ backgroundColor: currentTheme.colors.blue }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
