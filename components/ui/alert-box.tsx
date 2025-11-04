'use client'

import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'

interface AlertBoxProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  onClose?: () => void
  showCloseButton?: boolean
}

export function AlertBox({ 
  type, 
  title, 
  message, 
  onClose, 
  showCloseButton = false 
}: AlertBoxProps) {
  const { currentTheme } = useEnhancedTheme()

  // Get theme-aware colors
  const getTypeColors = () => {
    const colors = currentTheme.colors
    const isDark = currentTheme.type === 'dark'
    
    switch (type) {
      case 'success':
        return {
          accent: colors.green || '#4ec9b0',
          icon: CheckCircle,
        }
      case 'warning':
        return {
          accent: colors.yellow || '#dcdcaa',
          icon: AlertTriangle,
        }
      case 'error':
        return {
          accent: colors.red || '#f48771',
          icon: AlertCircle,
        }
      default:
        return {
          accent: colors.blue || colors.blueAccent || '#007acc',
          icon: Info,
        }
    }
  }

  const typeColors = getTypeColors()
  const Icon = typeColors.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="border border-l-4 rounded-sm relative overflow-hidden shadow-lg"
      style={{
        backgroundColor: currentTheme.colors.sidebar || currentTheme.colors.bg,
        borderColor: currentTheme.colors.border,
        borderLeftColor: typeColors.accent,
        boxShadow: currentTheme.type === 'dark' 
          ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: currentTheme.type === 'dark'
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
          background: currentTheme.type === 'dark'
            ? `linear-gradient(135deg, ${typeColors.accent}05 0%, transparent 100%)`
            : `linear-gradient(135deg, ${typeColors.accent}08 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{
              backgroundColor: `${typeColors.accent}20`,
              borderColor: `${typeColors.accent}40`,
            }}
          >
            <Icon
              size={16}
              strokeWidth={2.5}
              style={{ color: typeColors.accent }}
              fill={type === 'warning' ? typeColors.accent : undefined}
              fillOpacity={type === 'warning' ? 0.15 : undefined}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 
                className="font-semibold text-sm leading-tight"
                style={{ color: currentTheme.colors.text }}
              >
                {title}
              </h3>
              {showCloseButton && onClose && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1 rounded transition-all duration-150"
                  style={{
                    color: currentTheme.colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover || (currentTheme.type === 'dark' ? '#2a2d2e' : '#f5f5f5')
                    e.currentTarget.style.color = currentTheme.colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = currentTheme.colors.textSecondary
                  }}
                  aria-label="Close alert"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>
            <p 
              className="text-xs leading-relaxed"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

