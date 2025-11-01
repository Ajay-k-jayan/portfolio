'use client'

import { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 -mt-px border-t-[#3e3e42] border-l-transparent border-r-transparent border-b-transparent border-4'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 -mb-px border-b-[#3e3e42] border-l-transparent border-r-transparent border-t-transparent border-4'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 -ml-px border-l-[#3e3e42] border-t-transparent border-b-transparent border-r-transparent border-4'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 -mr-px border-r-[#3e3e42] border-t-transparent border-b-transparent border-l-transparent border-4'
      default:
        return 'top-full left-1/2 -translate-x-1/2 -mt-px border-t-[#3e3e42] border-l-transparent border-r-transparent border-b-transparent border-4'
    }
  }

  return (
    <div className="relative group inline-flex items-center justify-center">
      {children}
      <div
        className={`absolute z-[9999] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${getPositionClasses()}`}
        style={{ willChange: 'opacity' }}
      >
        <div className="px-2.5 py-1.5 bg-[#1e1e1e] border border-[#3e3e42] rounded text-xs text-[#cccccc] whitespace-nowrap shadow-2xl">
          {content}
          {/* Arrow */}
          <div className={`absolute ${getArrowClasses()}`} />
        </div>
      </div>
    </div>
  )
}

