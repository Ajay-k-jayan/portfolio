'use client'

import { Activity, HardDrive, Cpu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

export function SystemInfoWidget() {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    active: true,
  })

  useEffect(() => {
    // Simulate system stats (in production, connect to real metrics if available)
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 20,
        memory: Math.floor(Math.random() * 40) + 40,
        active: true,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Tooltip 
      content={
        <div className="text-left space-y-1">
          <div className="font-semibold">System Status</div>
          <div className="border-t border-[#3e3e42] pt-1 mt-1">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-green-400" />
              <span>System Active</span>
            </div>
          </div>
          <div className="border-t border-[#3e3e42] pt-1 mt-1">
            <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span>CPU Usage: {stats.cpu}%</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <HardDrive size={12} />
              <span>Memory Usage: {stats.memory}%</span>
            </div>
          </div>
        </div>
      } 
      position="top"
    >
      <div className="flex items-center gap-2 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap hover:bg-black/10 transition-colors">
        <Activity size={12} className={stats.active ? 'text-green-400 flex-shrink-0' : 'text-gray-400 flex-shrink-0'} />
        <div className="flex items-center gap-1">
          <Cpu size={11} className="opacity-75 flex-shrink-0" />
          <span className="text-xs">{stats.cpu}%</span>
        </div>
        <div className="flex items-center gap-1">
          <HardDrive size={11} className="opacity-75 flex-shrink-0" />
          <span className="text-xs">{stats.memory}%</span>
        </div>
      </div>
    </Tooltip>
  )
}

