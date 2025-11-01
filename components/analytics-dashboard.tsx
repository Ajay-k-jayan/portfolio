'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, Clock, MapPin } from 'lucide-react'

interface AnalyticsData {
  totalVisitors: number
  uniqueVisitors: number
  pageViews: number
  avgSessionDuration: string
  topCountries: { country: string; visitors: number }[]
  popularPages: { page: string; views: number }[]
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    avgSessionDuration: '0:00',
    topCountries: [],
    popularPages: [],
  })

  useEffect(() => {
    // Simulate analytics data (in production, fetch from analytics API)
    const fetchData = () => {
      setData({
        totalVisitors: 1247,
        uniqueVisitors: 892,
        pageViews: 3842,
        avgSessionDuration: '3:45',
        topCountries: [
          { country: 'United States', visitors: 456 },
          { country: 'India', visitors: 234 },
          { country: 'United Kingdom', visitors: 189 },
          { country: 'Germany', visitors: 156 },
          { country: 'Canada', visitors: 123 },
        ],
        popularPages: [
          { page: '/projects', views: 1245 },
          { page: '/about', views: 892 },
          { page: '/skills', views: 678 },
          { page: '/blog', views: 543 },
          { page: '/contact', views: 234 },
        ],
      })
    }

    fetchData()
    const interval = setInterval(() => {
      // Simulate real-time updates
      setData((prev) => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 3),
        pageViews: prev.pageViews + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string | number; trend?: string }) => (
    <div className="bg-vscode-active border border-vscode-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="text-vscode-blue" size={24} />
        {trend && (
          <span className="text-xs text-vscode-green flex items-center gap-1">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-vscode-text">{value}</h3>
      <p className="text-sm text-vscode-text-secondary mt-1">{label}</p>
    </div>
  )

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-vscode-text">Analytics Dashboard</h1>
          <span className="text-sm text-vscode-text-secondary">Real-time updates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Visitors" value={data.totalVisitors.toLocaleString()} trend="+12%" />
          <StatCard icon={Eye} label="Unique Visitors" value={data.uniqueVisitors.toLocaleString()} trend="+8%" />
          <StatCard icon={TrendingUp} label="Page Views" value={data.pageViews.toLocaleString()} trend="+15%" />
          <StatCard icon={Clock} label="Avg. Session" value={data.avgSessionDuration} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-vscode-text mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-vscode-blue" />
              Top Countries
            </h2>
            <div className="space-y-3">
              {data.topCountries.map((item, idx) => (
                <div key={item.country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-vscode-text">{item.country}</span>
                    <span className="text-sm text-vscode-text-secondary">{item.visitors}</span>
                  </div>
                  <div className="h-2 bg-vscode-active rounded-full overflow-hidden">
                    <div
                      className="h-full bg-vscode-blue transition-all duration-500"
                      style={{ width: `${(item.visitors / data.topCountries[0].visitors) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-vscode-text mb-4">Popular Pages</h2>
            <div className="space-y-3">
              {data.popularPages.map((item) => (
                <div key={item.page} className="flex items-center justify-between p-3 bg-vscode-active rounded-lg">
                  <span className="text-sm text-vscode-text font-mono">{item.page}</span>
                  <span className="text-sm text-vscode-text-secondary">{item.views} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

