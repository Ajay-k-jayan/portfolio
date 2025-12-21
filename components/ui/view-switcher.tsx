'use client'

import { LayoutGrid, LayoutList, Network } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tooltip } from './tooltip'
import { useLanguage } from '@/contexts/language-context'

type ViewMode = 'grid' | 'list' | 'network'
type ViewOptions = 'grid-list' | 'grid-list-network'

interface ViewSwitcherProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  options?: ViewOptions
  className?: string
}

export function ViewSwitcher({ viewMode, onViewChange, options = 'grid-list', className = '' }: ViewSwitcherProps) {
  const { t } = useLanguage()
  
  const views: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', icon: LayoutGrid, label: t('gridView') },
    { mode: 'list', icon: LayoutList, label: t('listView') },
  ]

  if (options === 'grid-list-network') {
    views.push({ mode: 'network', icon: Network, label: t('networkView') })
  }

  const activeIndex = views.findIndex(v => v.mode === viewMode)

  return (
    <div className={`relative flex items-center bg-vscode-sidebar rounded-md p-0.5 border border-vscode-border ${className}`}>
      {/* Sliding background indicator */}
      <motion.div
        className="absolute bg-vscode-blue rounded"
        style={{
          height: 'calc(100% - 4px)',
          width: `calc(${100 / views.length}% - 2px)`,
        }}
        animate={{
          x: `${activeIndex * 100}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />
      
      {views.map(({ mode, icon: Icon, label }, index) => {
        const isActive = viewMode === mode
        return (
          <Tooltip key={mode} content={label} position="bottom">
            <motion.button
              onClick={() => onViewChange(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center flex-1 p-1.5 rounded transition-colors duration-200 z-10 min-w-0"
            >
              <Icon 
                size={16} 
                className={`transition-colors duration-200 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-vscode-text-secondary'
                }`}
              />
            </motion.button>
          </Tooltip>
        )
      })}
    </div>
  )
}

