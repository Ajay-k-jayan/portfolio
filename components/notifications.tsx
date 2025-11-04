'use client'

import { Bell, X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'

export function Notifications() {
  const { notifications, removeNotification, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore()
  const [showPanel, setShowPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('button[data-notification-button]')) {
          setShowPanel(false)
        }
      }
    }

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPanel])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-green-400" />
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-400" />
      case 'error':
        return <AlertCircle size={18} className="text-red-400" />
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Info size={12} className="text-white" />
          </div>
        )
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Tooltip 
        content={
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 ? (
              <span className="text-xs opacity-75">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
            ) : (
              <span className="text-xs opacity-75">No new notifications</span>
            )}
          </div>
        }
        position="top"
      >
        <button
          data-notification-button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 hover:bg-blue-600/80 rounded transition-colors"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-semibold px-1 leading-none"
              style={{ transform: 'translate(25%, -25%)' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </button>
      </Tooltip>
      
      <AnimatePresence>
        {showPanel && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-2 w-[420px] bg-[#1e1e1e] border border-[#3e3e3e] rounded shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[600px]"
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
          >
            {/* Header - VSCode Style */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#3e3e3e] bg-[#252526] flex-shrink-0">
              <h3 className="text-xs font-semibold text-[#cccccc] uppercase tracking-wide">NOTIFICATIONS</h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="px-2 py-1 text-xs text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
                    title="Mark all as read"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1.5 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Notification Content */}
            <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell size={40} className="mx-auto text-[#6a6a6a] mb-4 opacity-50" />
                  <p className="text-sm text-[#cccccc]">No notifications</p>
                </div>
              ) : (
                <div>
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`border-b border-[#3e3e3e] hover:bg-[#2a2d2e] transition-colors ${
                          !notification.read ? 'bg-[#2a2d2e]/50' : ''
                        }`}
                        onClick={() => {
                          if (!notification.read) {
                            markNotificationAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#cccccc] leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-[#858585]">
                                  Source: {notification.title}
                                </p>
                                <p className="text-xs text-[#858585]">
                                  {formatTime(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                            
                            {/* Close button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="flex-shrink-0 p-1 text-[#6a6a6a] hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          
                          {/* Action Button */}
                          {!notification.read && (
                            <div className="flex items-center justify-end gap-2 mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markNotificationAsRead(notification.id)
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-[#cccccc] bg-[#3e3e3e] hover:bg-[#454545] border border-[#3e3e3e] rounded transition-colors"
                              >
                                OK
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
