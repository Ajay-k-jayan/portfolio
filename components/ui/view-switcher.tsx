'use client'

import { LayoutGrid, LayoutList, Network } from 'lucide-react'
import { motion } from 'framer-motion'

type ViewMode = 'grid' | 'list' | 'network'
type ViewOptions = 'grid-list' | 'grid-list-network'

interface ViewSwitcherProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  options?: ViewOptions
  className?: string
}

export function ViewSwitcher({ viewMode, onViewChange, options = 'grid-list', className = '' }: ViewSwitcherProps) {
  const views: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', icon: LayoutGrid, label: 'Grid View' },
    { mode: 'list', icon: LayoutList, label: 'List View' },
  ]

  if (options === 'grid-list-network') {
    views.push({ mode: 'network', icon: Network, label: 'Network View' })
  }

  return (
    <div className={`flex items-center gap-1 bg-vscode-sidebar border border-vscode-border rounded-lg p-1 ${className}`}>
      {views.map(({ mode, icon: Icon, label }) => (
        <motion.button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={`relative flex items-center justify-center w-8 h-8 rounded transition-all duration-200 ${
            viewMode === mode
              ? 'bg-vscode-blue text-white'
              : 'bg-vscode-sidebar text-vscode-text-secondary hover:text-vscode-text hover:bg-vscode-hover'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={label}
        >
          <Icon size={16} />
        </motion.button>
      ))}
    </div>
  )
}

