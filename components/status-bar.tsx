'use client'

import { GitBranch } from 'lucide-react'
import { Notifications } from './notifications'
import { DateTimeWidget } from './widgets/date-time-widget'
import { WeatherWidget } from './widgets/weather-widget'
import { LocationWidget } from './widgets/location-widget'
import { SocialLinksWidget } from './widgets/social-links-widget'
import { SystemInfoWidget } from './widgets/system-info-widget'
import { NetworkStatusWidget } from './widgets/network-status-widget'
import { useAppStore } from '@/lib/store'

export function StatusBar() {
  const { portfolioSettings } = useAppStore()

  // Check if any left widgets before network status are visible
  const hasLeftWidgetsBeforeNetwork = portfolioSettings.showDateTimeWidget || 
                                       portfolioSettings.showWeatherWidget || 
                                       portfolioSettings.showLocationWidget

  // Check if any right widgets are visible (excluding notifications)
  const hasRightWidgets = portfolioSettings.showSystemInfoWidget || 
                          portfolioSettings.showSocialLinksWidget

  return (
    <>
      {/* Main Status Bar */}
      <div className="h-7 bg-vscode-blue text-white text-xs flex items-center justify-between px-2 relative overflow-hidden">
        {/* Left Section - System Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Date/Time Widget */}
          {portfolioSettings.showDateTimeWidget && <DateTimeWidget />}

          {/* Weather Widget */}
          {portfolioSettings.showWeatherWidget && <WeatherWidget />}

          {/* Location Widget */}
          {portfolioSettings.showLocationWidget && <LocationWidget />}

          {/* Divider - Only show if there are left widgets before network status and network status is visible */}
          {hasLeftWidgetsBeforeNetwork && portfolioSettings.showNetworkStatusWidget && (
            <div className="h-4 w-px bg-white/20" />
          )}

          {/* Network Status */}
          {portfolioSettings.showNetworkStatusWidget && <NetworkStatusWidget />}
        </div>

        {/* Right Section - Actions & Info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* System Info Widget */}
          {portfolioSettings.showSystemInfoWidget && <SystemInfoWidget />}

          {/* Social Links & Resume Download */}
          {portfolioSettings.showSocialLinksWidget && <SocialLinksWidget />}

          {/* Divider - Only show if there are right widgets */}
          {hasRightWidgets && (
            <div className="h-4 w-px bg-white/20" />
          )}

          {/* Notifications */}
          <Notifications />
        </div>
      </div>
    </>
  )
}
