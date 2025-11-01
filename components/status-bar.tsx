'use client'

import { GitBranch, Wifi, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Notifications } from './notifications'

export function StatusBar() {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    // Simulate visitor count (in production, connect to analytics)
    setVisitorCount(Math.floor(Math.random() * 100) + 1)
  }, [])

  return (
    <div className="h-6 bg-vscode-blue text-white text-xs flex items-center justify-between px-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={12} />
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={12} />
          <span>{visitorCount} visitors</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Notifications />
        <div>Portfolio v1.0.0</div>
      </div>
    </div>
  )
}

