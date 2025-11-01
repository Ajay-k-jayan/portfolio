'use client'

import { Wifi, WifiOff, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

export function NetworkStatusWidget() {
  const [mounted, setMounted] = useState(false)
  const [networkStatus, setNetworkStatus] = useState({
    online: true,
    latency: 0,
  })

  useEffect(() => {
    setMounted(true)
    const updateNetworkStatus = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        online: navigator.onLine,
      }))
    }

    // Check latency (simulated, in production use actual ping)
    const checkLatency = () => {
      const latency = Math.floor(Math.random() * 50) + 10 // 10-60ms
      setNetworkStatus((prev) => ({
        ...prev,
        latency,
      }))
    }

    updateNetworkStatus()
    checkLatency()
    const latencyInterval = setInterval(checkLatency, 5000)

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      clearInterval(latencyInterval)
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        <Wifi size={12} className="flex-shrink-0 opacity-50" />
        <span className="text-xs opacity-75">--ms</span>
      </div>
    )
  }

  return (
    <Tooltip content={`Network: ${networkStatus.online ? 'Online' : 'Offline'} • Latency: ${networkStatus.latency}ms`}>
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        {networkStatus.online ? (
          <Wifi size={12} className="text-green-400 flex-shrink-0" />
        ) : (
          <WifiOff size={12} className="text-red-400 flex-shrink-0" />
        )}
        <span className="text-xs">{networkStatus.latency}ms</span>
      </div>
    </Tooltip>
  )
}

