'use client'

import { Cloud, CloudRain, Sun, CloudSun, Droplets, Thermometer } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

interface WeatherData {
  temp: number
  condition: string
  icon: string
  humidity?: number
}

export function WeatherWidget() {
  const [mounted, setMounted] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            )
            const data = await response.json()
            setLocation(data.city || data.locality || 'Unknown')

            // For demo, using mock weather data
            // In production, use a weather API like OpenWeatherMap
            setWeather({
              temp: Math.floor(Math.random() * 30) + 15, // 15-45°C
              condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
              icon: 'sun',
              humidity: Math.floor(Math.random() * 40) + 50,
            })
            setLoading(false)
          } catch (error) {
            console.error('Error fetching location:', error)
            setLocation('Kerala, India')
            setWeather({
              temp: 28,
              condition: 'Partly Cloudy',
              icon: 'cloud-sun',
              humidity: 75,
            })
            setLoading(false)
          }
        },
        () => {
          // Fallback to default location
          setLocation('Kerala, India')
          setWeather({
            temp: 28,
            condition: 'Partly Cloudy',
            icon: 'cloud-sun',
            humidity: 75,
          })
          setLoading(false)
        }
      )
    } else {
      setLocation('Kerala, India')
      setWeather({
        temp: 28,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        humidity: 75,
      })
      setLoading(false)
    }
  }, [])

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun size={12} />
      case 'cloud-sun':
        return <CloudSun size={12} />
      case 'cloud':
        return <Cloud size={12} />
      case 'rain':
        return <CloudRain size={12} />
      default:
        return <Sun size={12} />
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap">
        <Cloud size={12} className="animate-pulse" />
        <span className="text-xs opacity-75">Loading...</span>
      </div>
    )
  }

  if (!weather) return null

  return (
    <Tooltip content={`${location}: ${weather.condition}, ${weather.temp}°C${weather.humidity ? ` • Humidity: ${weather.humidity}%` : ''}`}>
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default flex-shrink-0 whitespace-nowrap">
        {getWeatherIcon(weather.icon)}
        <span className="text-xs">
          <Thermometer size={11} className="inline mr-0.5" />
          {weather.temp}°C
        </span>
        <span className="text-xs opacity-75 hidden sm:inline">{weather.condition}</span>
      </div>
    </Tooltip>
  )
}

