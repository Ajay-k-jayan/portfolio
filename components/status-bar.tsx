'use client'

import { GitBranch } from 'lucide-react'
import { Notifications } from './notifications'
import { DateTimeWidget } from './widgets/date-time-widget'
import { WeatherWidget } from './widgets/weather-widget'
import { LocationWidget } from './widgets/location-widget'
import { SocialLinksWidget } from './widgets/social-links-widget'
import { SystemInfoWidget } from './widgets/system-info-widget'
import { NetworkStatusWidget } from './widgets/network-status-widget'

export function StatusBar() {

  return (
    <>
      {/* Main Status Bar */}
      <div className="h-7 bg-vscode-blue text-white text-xs flex items-center justify-between px-2 relative overflow-hidden">
        {/* Left Section - System Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Date/Time Widget */}
          <DateTimeWidget />

          {/* Weather Widget */}
          <WeatherWidget />

          {/* Location Widget */}
          <LocationWidget />

          {/* Divider */}
          <div className="h-4 w-px bg-white/20" />

          {/* Network Status */}
          <NetworkStatusWidget />
        </div>

        {/* Right Section - Actions & Info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* System Info Widget */}
          <SystemInfoWidget />

          {/* Social Links & Resume Download */}
          <SocialLinksWidget />

          {/* Divider */}
          <div className="h-4 w-px bg-white/20" />

          {/* Notifications */}
          <Notifications />
        </div>
      </div>
    </>
  )
}
