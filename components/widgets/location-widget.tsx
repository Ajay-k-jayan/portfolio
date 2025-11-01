'use client'

import { MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

export function LocationWidget() {
  const [mounted, setMounted] = useState(false)
  const [location, setLocation] = useState<string>('Kerala, India')

  useEffect(() => {
    setMounted(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const city = data.city || data.locality || 'Unknown'
            const state = data.principalSubdivision || data.countryName || ''
            setLocation(state ? `${city}, ${state}` : city)
          } catch (error) {
            console.error('Error fetching location:', error)
          }
        },
        () => {
          // Use default location
          setLocation('Kerala, India')
        }
      )
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="text-xs">Loading...</span>
      </div>
    )
  }

  return (
    <Tooltip content={`Current Location: ${location}`}>
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default flex-shrink-0">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="text-xs whitespace-nowrap">{location}</span>
      </div>
    </Tooltip>
  )
}

