'use client'

import { Bell, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tooltip } from './ui/tooltip'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Simulate notifications (in production, connect to real-time service)
    const newNotification: Notification = {
      id: '1',
      title: 'New Visitor',
      message: 'Someone is viewing your portfolio',
      type: 'info',
      timestamp: new Date(),
    }
    setNotifications([newNotification])
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      <Tooltip 
        content={
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Notifications</span>
            {notifications.length > 0 ? (
              <span className="text-xs opacity-75">{notifications.length} unread notification{notifications.length !== 1 ? 's' : ''}</span>
            ) : (
              <span className="text-xs opacity-75">No new notifications</span>
            )}
          </div>
        }
        position="top"
      >
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 hover:bg-blue-600 rounded transition-colors"
        >
          <Bell size={16} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {notifications.length}
            </span>
          )}
        </button>
      </Tooltip>
      {showPanel && (
        <div className="absolute bottom-8 right-0 w-80 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-vscode-border">
            <h3 className="text-sm font-semibold text-vscode-text">Notifications</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-vscode-text-secondary hover:text-vscode-text"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-vscode-text-secondary text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-vscode-border hover:bg-vscode-hover transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-vscode-text">{notification.title}</h4>
                      <p className="text-xs text-vscode-text-secondary mt-1">{notification.message}</p>
                      <p className="text-xs text-vscode-text-secondary mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-vscode-text-secondary hover:text-vscode-text"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}

