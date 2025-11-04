'use client'

import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'

export function NotificationToast() {
  const { notifications, markNotificationAsRead } = useAppStore()
  const { currentTheme } = useEnhancedTheme()
  const [showToast, setShowToast] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)
  const previousNotificationsLength = useRef(0)

  useEffect(() => {
    // Check if a new notification was added
    if (notifications.length > previousNotificationsLength.current) {
      // Get the latest notification (first one in the array)
      const latestNotification = notifications[0]
      if (latestNotification && !latestNotification.read) {
        setCurrentNotification(latestNotification)
        setShowToast(true)
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setShowToast(false)
          // Mark as read after hiding
          markNotificationAsRead(latestNotification.id)
          setTimeout(() => {
            setCurrentNotification(null)
          }, 300)
        }, 5000)
        
        previousNotificationsLength.current = notifications.length
        return () => clearTimeout(timer)
      }
    }
    previousNotificationsLength.current = notifications.length
  }, [notifications, markNotificationAsRead])

  // Get theme-aware colors
  const getThemeColors = () => {
    const colors = currentTheme.colors
    const isDark = currentTheme.type === 'dark'
    
    return {
      bg: colors.sidebar || colors.bg,
      border: colors.border,
      text: colors.text,
      textSecondary: colors.textSecondary,
      success: colors.green || '#4ec9b0',
      warning: colors.yellow || '#dcdcaa',
      error: colors.red || '#f48771',
      info: colors.blue || colors.blueAccent || '#007acc',
      hover: colors.hover || (isDark ? '#2a2d2e' : '#f5f5f5'),
      isDark
    }
  }

  const themeColors = getThemeColors()

  const getNotificationIcon = (type: string) => {
    const iconSize = 16
    const iconStroke = 2.5
    
    switch (type) {
      case 'success':
        return (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{
              backgroundColor: `${themeColors.success}20`,
              borderColor: `${themeColors.success}40`,
            }}
          >
            <CheckCircle size={iconSize} strokeWidth={iconStroke} style={{ color: themeColors.success }} />
          </div>
        )
      case 'warning':
        return (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{
              backgroundColor: `${themeColors.warning}20`,
              borderColor: `${themeColors.warning}40`,
            }}
          >
            <AlertTriangle 
              size={iconSize} 
              strokeWidth={iconStroke} 
              style={{ color: themeColors.warning }}
              fill={themeColors.warning}
              fillOpacity={0.15}
            />
          </div>
        )
      case 'error':
        return (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{
              backgroundColor: `${themeColors.error}20`,
              borderColor: `${themeColors.error}40`,
            }}
          >
            <AlertCircle size={iconSize} strokeWidth={iconStroke} style={{ color: themeColors.error }} />
          </div>
        )
      default:
        return (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{
              backgroundColor: `${themeColors.info}20`,
              borderColor: `${themeColors.info}40`,
            }}
          >
            <Info size={iconSize} strokeWidth={iconStroke} style={{ color: themeColors.info }} />
          </div>
        )
    }
  }

  const getNotificationStyles = (type: string) => {
    let accentColor: string
    
    switch (type) {
      case 'success':
        accentColor = themeColors.success
        break
      case 'warning':
        accentColor = themeColors.warning
        break
      case 'error':
        accentColor = themeColors.error
        break
      default:
        accentColor = themeColors.info
    }

    return {
      bg: themeColors.bg,
      border: themeColors.border,
      borderLeft: accentColor,
      titleText: themeColors.text,
      messageText: themeColors.textSecondary,
      hover: themeColors.hover,
      accentColor
    }
  }

  if (!currentNotification || !showToast) return null

  const styles = getNotificationStyles(currentNotification.type)

  return (
    <AnimatePresence>
      {showToast && currentNotification && (
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
          className="fixed bottom-12 right-2 z-[100] w-[380px]"
        >
          <div 
            className="border border-l-4 rounded-sm relative overflow-hidden shadow-lg"
            style={{
              backgroundColor: styles.bg,
              borderColor: styles.border,
              borderLeftColor: styles.borderLeft,
              boxShadow: themeColors.isDark 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                : '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Advanced background pattern - theme-aware */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: themeColors.isDark
                  ? 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.03) 50%, transparent 75%, transparent 100%)'
                  : 'linear-gradient(45deg, transparent 25%, rgba(0,0,0,.02) 50%, transparent 75%, transparent 100%)',
                backgroundSize: '20px 20px',
                opacity: 0.5,
              }}
            />
            
            {/* Subtle gradient overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: themeColors.isDark
                  ? `linear-gradient(135deg, ${styles.borderLeft}05 0%, transparent 100%)`
                  : `linear-gradient(135deg, ${styles.borderLeft}08 0%, transparent 100%)`,
              }}
            />
            
            <div className="relative z-10 p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(currentNotification.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 
                      className="font-semibold text-sm leading-tight"
                      style={{ color: styles.titleText }}
                    >
                      {currentNotification.title}
                    </h3>
                    <button
                      onClick={() => {
                        setShowToast(false)
                        markNotificationAsRead(currentNotification.id)
                        setTimeout(() => {
                          setCurrentNotification(null)
                        }, 300)
                      }}
                      className="flex-shrink-0 p-1 rounded transition-all duration-150"
                      style={{
                        color: styles.messageText,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = styles.hover
                        e.currentTarget.style.color = styles.titleText
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = styles.messageText
                      }}
                      aria-label="Close notification"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                  <p 
                    className="text-xs leading-relaxed"
                    style={{ color: styles.messageText }}
                  >
                    {currentNotification.message}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress bar for auto-dismiss - theme-aware color */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-0.5 absolute bottom-0 left-0"
              style={{ backgroundColor: styles.borderLeft }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
