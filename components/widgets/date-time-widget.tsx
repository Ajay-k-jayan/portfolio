'use client'

import { Calendar, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

export function DateTimeWidget() {
  const [mounted, setMounted] = useState(false)
  const [dateTime, setDateTime] = useState({
    day: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    setMounted(true)
    const updateDateTime = () => {
      const now = new Date()
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const day = days[now.getDay()]
      const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

      setDateTime({ day, date, time })
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        <Calendar size={12} className="flex-shrink-0" />
        <span className="text-xs">Loading...</span>
      </div>
    )
  }

  return (
    <Tooltip content={`${dateTime.day}, ${dateTime.date} • ${dateTime.time}`}>
      <div className="flex items-center gap-2 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        <Calendar size={12} className="flex-shrink-0" />
        <span className="text-xs">{dateTime.day}</span>
        <span className="text-xs opacity-75">{dateTime.date}</span>
        <div className="flex items-center gap-1 ml-1">
          <Clock size={11} className="opacity-75 flex-shrink-0" />
          <span className="text-xs opacity-75">{dateTime.time}</span>
        </div>
      </div>
    </Tooltip>
  )
}

