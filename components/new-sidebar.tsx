'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  Folder,
  Code,
  FolderOpen,
  Trophy,
  Briefcase,
  Award,
  BookOpen,
  Share2,
  MessageSquare,
  History,
  Settings,
  Mail,
  Menu,
  X,
  Calendar,
  MoreVertical
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'
import type { Translations } from '@/lib/translations'
import { WelcomeTab } from './tabs/welcome-tab'
import { SkillsTab } from './tabs/skills-tab'
import { ProjectsTab } from './tabs/projects-tab'
import { AchievementsView } from './sidebar-views/achievements-view'
import { CertificationsView } from './sidebar-views/certifications-view'
import { ExperienceTab } from './tabs/experience-tab'
import { BlogSystem } from './blog-system'
import { SocialIntegrations } from './social-integrations'
import { FileExplorer } from './file-explorer'
import { Tooltip } from './ui/tooltip'

// Menu items configuration - will be translated in component
const getMenuItems = (t: (key: keyof Translations) => string) => [
  { id: 'welcome', label: t('welcome'), icon: Home },
  { id: 'file-explore', label: t('fileExplore'), icon: Folder },
  { id: 'skills', label: t('skills'), icon: Code },
  { id: 'achievement', label: t('achievements'), icon: Trophy },
  { id: 'experience', label: t('experience'), icon: Briefcase },
  { id: 'certifications', label: t('certifications'), icon: Award },
  { id: 'contact', label: t('contact'), icon: Mail },
  { id: 'recommendation', label: t('recommendations'), icon: MessageSquare },
  { id: 'project', label: t('projects'), icon: FolderOpen },
  { id: 'timeline', label: t('timeline'), icon: Calendar },
  { id: 'blogs', label: t('blogs'), icon: BookOpen },
  { id: 'settings', label: t('settings'), icon: Settings },
]

export function NewSidebar() {
  const { 
    activeMenuItem, 
    recentlySelected, 
    setActiveMenuItem, 
    sidebarCollapsed,
    toggleSidebar,
    closeTab,
    tabs,
    portfolioSettings,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useAppStore()
  const { t } = useLanguage()
  const menuItems = getMenuItems(t)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null) // null = not determined yet
  const [visibleItemsCount, setVisibleItemsCount] = useState(menuItems.length)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [menuContainerRefState, setMenuContainerRef] = useState<HTMLDivElement | null>(null)
  const [moreMenuRefState, setMoreMenuRef] = useState<HTMLDivElement | null>(null)
  const [moreButtonRef, setMoreButtonRef] = useState<HTMLButtonElement | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get settings values
  const { compactView, showAnimations, animationSpeed, fontSize, fontFamily } = portfolioSettings
  
  // Calculate animation duration based on speed setting
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'fast': return 0.15
      case 'slow': return 0.5
      default: return 0.3
    }
  }
  
  // Get spacing based on compact view
  const getSpacing = () => {
    return compactView ? 'space-y-0.5 gap-0.5' : 'space-y-1 gap-1'
  }
  
  // Get font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-xs'
      case 'large': return 'text-base'
      default: return 'text-sm'
    }
  }
  
  // Get font family classes
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'mono': return 'font-mono'
      case 'sans': return 'font-sans'
      default: return 'font-sans'
    }
  }
  
  // Animation props based on settings
  const getAnimationProps = () => {
    if (!showAnimations) {
      return {
        whileHover: {},
        whileTap: {},
        transition: { duration: 0 }
      }
    }
    return {
      whileHover: { scale: 1.1, x: 2 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 20, duration: getAnimationDuration() }
    }
  }

  // Handle SSR - only show recently selected after mount
  useEffect(() => {
    setMounted(true)
    
    // Check if mobile - set immediately to prevent layout shift
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }
    
    // Set immediately on mount
    checkMobile()
    
    // Listen for resize
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate visible items based on available space
  useEffect(() => {
    if (!mounted || isMobile || sidebarCollapsed || !menuContainerRefState) return

    const calculateVisibleItems = () => {
      if (!menuContainerRefState) return

      const container = menuContainerRefState
      const containerHeight = container.clientHeight
      const containerTop = container.getBoundingClientRect().top
      const viewportHeight = window.innerHeight
      const availableHeight = viewportHeight - containerTop - 20 // 20px padding

      // Each icon button is approximately 32px (w-8 h-8) + 2px gap = 34px
      // Reserve space for "More" button (34px)
      const iconHeight = 34
      const moreButtonHeight = 34
      const maxVisible = Math.floor((availableHeight - moreButtonHeight) / iconHeight)

      // Ensure at least 3 items are visible, and show "More" if needed
      const visibleCount = Math.max(3, Math.min(menuItems.length, maxVisible))
      
      setVisibleItemsCount(visibleCount < menuItems.length ? visibleCount : menuItems.length)
    }

    // Initial calculation
    calculateVisibleItems()

    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateVisibleItems, 100)
    })

    resizeObserver.observe(menuContainerRefState)
    window.addEventListener('resize', calculateVisibleItems)
    window.addEventListener('scroll', calculateVisibleItems)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateVisibleItems)
      window.removeEventListener('scroll', calculateVisibleItems)
    }
  }, [mounted, isMobile, sidebarCollapsed, menuContainerRefState, menuItems.length])

  // Close "More" menu on outside click
  useEffect(() => {
    if (!showMoreMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRefState &&
        !moreMenuRefState.contains(event.target as Node) &&
        menuContainerRefState &&
        !menuContainerRefState.contains(event.target as Node)
      ) {
        setShowMoreMenu(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showMoreMenu, moreMenuRefState, menuContainerRefState])

  const handleMenuItemClick = (menuId: string) => {
    // Close all tabs when clicking non-file-explore menu items
    if (menuId !== 'file-explore' && tabs.length > 0) {
      // Create a copy of tabs array to avoid mutation during iteration
      const tabsToClose = [...tabs]
      tabsToClose.forEach(tab => closeTab(tab.id))
    }
    
    setActiveMenuItem(menuId)
    // Close mobile menu after selection
    if (isMobile) {
      setMobileMenuOpen(false)
    }
    // Don't create tabs - content will be shown directly in main area
  }


  // Mobile view - return mobile menu drawer only (button is in header)
  // Use CSS to hide on desktop, show on mobile
  if (isMobile === null) {
    // During SSR or initial render, return null to prevent hydration mismatch
    return null
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              
              {/* Menu Drawer */}
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-12 left-0 bottom-0 w-72 bg-vscode-sidebar border-r border-vscode-border z-50 md:hidden overflow-y-auto custom-scrollbar shadow-2xl"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-vscode-border flex items-center justify-between bg-vscode-active/50">
                  <h2 className="text-sm font-semibold text-vscode-text uppercase tracking-wide">
                    {t('navigation')}
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded hover:bg-vscode-hover transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={18} className="text-vscode-text-secondary" />
                  </button>
                </div>

                {/* Recently Selected */}
                {mounted && portfolioSettings.showRecentlyViewed && recentlySelected.length > 0 && (
                  <div className="px-4 py-3 border-b border-vscode-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Tooltip content={t('displayRecentlyViewedItems')} position="right">
                        <div className="p-1">
                          <History size={14} className="text-vscode-text-secondary hover:text-vscode-text transition-colors duration-200" />
                        </div>
                      </Tooltip>
                      <span className="text-xs font-medium text-vscode-text-secondary uppercase tracking-wide">
                        {t('recent')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {recentlySelected.slice(0, 5).map((menuId) => {
                        const item = menuItems.find(m => m.id === menuId)
                        if (!item) return null
                        
                        const Icon = item.icon
                        const isActive = activeMenuItem === menuId
                        
                        return (
                          <motion.button
                            key={menuId}
                            onClick={() => handleMenuItemClick(menuId)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-left relative group ${
                              isActive
                                ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/30'
                                : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                            }`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Icon size={18} className="relative z-10 transition-transform duration-200 group-hover:scale-110" />
                            <span className="text-sm relative z-10">{item.label}</span>
                            {!isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10 transition-colors duration-200"
                                initial={false}
                              />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Main Menu Items */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Menu size={14} className="text-vscode-text-secondary" />
                    <span className="text-xs font-medium text-vscode-text-secondary uppercase tracking-wide">
                      {t('navigation')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeMenuItem === item.id
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleMenuItemClick(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-left relative group ${
                            isActive
                              ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/30'
                              : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Icon size={18} className="relative z-10 transition-transform duration-200 group-hover:scale-110" />
                          <span className="text-sm relative z-10">{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white/50"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10 transition-colors duration-200"
                              initial={false}
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* File Explorer Panel (if active) */}
                {activeMenuItem === 'file-explore' && (
                  <div className="px-4 py-3 border-t border-vscode-border mt-auto">
                    <FileExplorer />
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Collapsed view - compact icon-only sidebar
  if (sidebarCollapsed) {
    return (
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col h-full">
        {/* Recently Selected (Top) - Compact Icons */}
        {mounted && portfolioSettings.showRecentlyViewed && recentlySelected.length > 0 && (
          <div className="py-1.5 border-b border-vscode-border flex-shrink-0">
            <div className="mb-1 flex justify-center items-center">
              <Tooltip content={t('recent')} position="right">
                <div className="p-1">
                  <History size={12} className="text-vscode-text-secondary hover:text-vscode-text transition-colors duration-200" />
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              {recentlySelected.slice(0, 3).map((menuId) => {
                const item = menuItems.find(m => m.id === menuId)
                if (!item) return null
                
                const Icon = item.icon
                const isActive = activeMenuItem === menuId
                
                return (
                  <Tooltip key={menuId} content={item.label} position="right">
                    <motion.button
                      onClick={() => handleMenuItemClick(menuId)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 relative group ${
                        isActive
                          ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/30'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <Icon size={14} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      </motion.div>
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10 transition-colors duration-300"
                          initial={false}
                        />
                      )}
                    </motion.button>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Menu Icons - Compact Grid */}
            <div className={`flex-1 pt-0 flex flex-col items-center ${compactView ? 'gap-0.5' : 'gap-1'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <Tooltip key={item.id} content={item.label} position="right">
                <motion.button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all relative group ${getFontFamilyClass()} ${
                    isActive
                      ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/30'
                      : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                  }`}
                  style={{ 
                    transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                  }}
                  {...getAnimationProps()}
                >
                  <motion.div
                    initial={false}
                    animate={showAnimations ? {
                      scale: isActive ? 1.1 : 1,
                    } : {}}
                    transition={{ duration: getAnimationDuration(), ease: "easeOut" }}
                  >
                    <Icon size={14} className={`relative z-10 ${showAnimations ? 'transition-transform' : ''}`}
                      style={{ 
                        transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                      }}
                    />
                  </motion.div>
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10"
                      style={{ 
                        transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                      }}
                      initial={false}
                    />
                  )}
                </motion.button>
              </Tooltip>
            )
          })}
        </div>

      </div>
    )
  }

  // Expanded view - Only show sidebar panel for File Explore
  return (
    <div className="flex h-full">
      {/* Left Icon Bar - Fixed Height, No Scroll */}
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col h-full">
        {/* Recently Selected (Top) - Compact */}
        {mounted && portfolioSettings.showRecentlyViewed && recentlySelected.length > 0 && (
          <div className="pt-1 pb-0.5 border-b border-vscode-border flex-shrink-0">
            <div className="mb-0.5 flex justify-center items-center">
              <Tooltip content={t('recent')} position="right">
                <div className="p-1">
                  <History size={12} className="text-vscode-text-secondary hover:text-vscode-text transition-colors duration-200" />
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              {recentlySelected.slice(0, 3).map((menuId) => {
                const item = menuItems.find(m => m.id === menuId)
                if (!item) return null
                
                const Icon = item.icon
                const isActive = activeMenuItem === menuId
                
                return (
                  <Tooltip key={menuId} content={item.label} position="right">
                    <motion.button
                      onClick={() => handleMenuItemClick(menuId)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 relative group ${
                        isActive
                          ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/30'
                          : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <Icon size={14} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      </motion.div>
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10 transition-colors duration-300"
                          initial={false}
                        />
                      )}
                    </motion.button>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Menu Icons - Compact, No Scroll */}
        <div 
          ref={setMenuContainerRef}
          className="flex-1 flex flex-col items-center justify-start pt-0 space-y-0.5 relative overflow-visible"
        >
          {menuItems.slice(0, visibleItemsCount).map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <Tooltip key={item.id} content={item.label} position="right">
                <motion.button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all relative group ${getFontFamilyClass()} ${
                    isActive
                      ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/40'
                      : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                  }`}
                  style={{ 
                    transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                  }}
                  {...getAnimationProps()}
                >
                  <motion.div
                    initial={false}
                    animate={showAnimations ? {
                      scale: isActive ? 1.1 : 1,
                    } : {}}
                    transition={{ duration: getAnimationDuration(), ease: "easeOut" }}
                  >
                    <Icon size={14} className={`relative z-10 ${showAnimations ? 'transition-transform' : ''}`} 
                      style={{ 
                        transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                      }}
                    />
                  </motion.div>
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10"
                      style={{ 
                        transitionDuration: showAnimations ? `${getAnimationDuration()}s` : '0s'
                      }}
                      initial={false}
                    />
                  )}
                </motion.button>
              </Tooltip>
            )
          })}

          {/* More Button - Show if there are overflow items */}
          {visibleItemsCount < menuItems.length && (
            <div 
              className="relative z-30"
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                setShowMoreMenu(true)
              }}
              onMouseLeave={() => {
                hoverTimeoutRef.current = setTimeout(() => setShowMoreMenu(false), 150)
              }}
            >
              <motion.button
                ref={setMoreButtonRef}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMoreMenu(!showMoreMenu)
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-300 relative group ${
                  showMoreMenu
                    ? 'bg-vscode-blue text-white shadow-lg shadow-vscode-blue/40'
                    : 'text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text hover:shadow-md'
                }`}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: showMoreMenu ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <MoreVertical size={14} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </motion.div>
                {!showMoreMenu && (
                  <motion.div
                    className="absolute inset-0 rounded-md bg-vscode-blue/0 group-hover:bg-vscode-blue/10 transition-colors duration-300"
                    initial={false}
                  />
                )}
              </motion.button>

              {/* More Menu Dropdown - Horizontal Row */}
              <AnimatePresence>
                {showMoreMenu && (
                  <>
                    {/* Dropdown Container - Fixed positioning */}
                    <motion.div
                      ref={setMoreMenuRef}
                      initial={{ opacity: 0, scale: 0.95, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -5 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                      className="fixed z-50 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl p-2"
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current)
                          hoverTimeoutRef.current = null
                        }
                        setShowMoreMenu(true)
                      }}
                      onMouseLeave={() => {
                        hoverTimeoutRef.current = setTimeout(() => setShowMoreMenu(false), 150)
                      }}
                      style={{
                        left: moreButtonRef ? `${moreButtonRef.getBoundingClientRect().right + 12}px` : '60px',
                        top: moreButtonRef ? `${moreButtonRef.getBoundingClientRect().top + (moreButtonRef.offsetHeight / 2) - 20}px` : '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <div className="flex flex-row gap-1.5 items-center flex-nowrap">
                        {menuItems.slice(visibleItemsCount).map((item, index) => {
                          const Icon = item.icon
                          const isActive = activeMenuItem === item.id
                          
                          return (
                            <Tooltip key={item.id} content={item.label} position="top">
                              <motion.button
                                onClick={() => {
                                  handleMenuItemClick(item.id)
                                  setShowMoreMenu(false)
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02, duration: 0.15 }}
                                className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 flex-shrink-0 ${
                                  isActive
                                    ? 'bg-vscode-blue text-white shadow-md'
                                    : 'bg-vscode-hover/50 text-vscode-text-secondary hover:bg-vscode-hover hover:text-vscode-text'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Icon size={16} />
                              </motion.button>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

      {/* Right Sidebar Panel - ONLY shows for File Explore */}
      <AnimatePresence>
        {activeMenuItem === 'file-explore' && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-vscode-sidebar border-r border-vscode-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-vscode-border flex-shrink-0">
              <h2 className="text-sm font-semibold text-vscode-text uppercase tracking-wide">
                File Explorer
              </h2>
            </div>

            {/* Content - Only this area scrolls */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <FileExplorer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mobile Menu Button Component (to be used in PortfolioHeader)
export function MobileMenuButton({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean
  onClick: () => void 
}) {
  return (
    <motion.button
      onClick={onClick}
      className="md:hidden p-2 rounded hover:bg-vscode-active transition-colors text-vscode-text-secondary hover:text-vscode-text"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.div>
    </motion.button>
  )
}

// Export hook to control mobile menu from header
export function useMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return { mobileMenuOpen, setMobileMenuOpen }
}
