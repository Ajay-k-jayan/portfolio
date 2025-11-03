'use client'

import { Bell, X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from './ui/tooltip'
import { useAppStore } from '@/lib/store'

export function Notifications() {
  const { notifications, removeNotification, markNotificationAsRead, clearAllNotifications } = useAppStore()
  const [showPanel, setShowPanel] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />
      default:
        return <Info size={16} className="text-blue-400" />
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
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 hover:bg-blue-600 rounded transition-colors"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold px-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </button>
      </Tooltip>
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-8 right-0 w-96 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-vscode-border bg-vscode-active">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-vscode-blue" />
                <h3 className="text-sm font-semibold text-vscode-text">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-vscode-blue text-white text-[10px] rounded-full font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-vscode-text-secondary hover:text-vscode-text transition-colors px-2 py-1 hover:bg-vscode-hover rounded"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-vscode-text-secondary hover:text-vscode-text transition-colors p-1 hover:bg-vscode-hover rounded"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="mx-auto text-vscode-text-secondary mb-3 opacity-50" />
                  <p className="text-sm text-vscode-text-secondary">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-vscode-border">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`p-3 hover:bg-vscode-hover transition-colors cursor-pointer ${
                          !notification.read ? 'bg-vscode-active/50' : ''
                        }`}
                        onClick={() => {
                          if (!notification.read) {
                            markNotificationAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-vscode-text mb-0.5">
                                {notification.title}
                              </h4>
                              <p className="text-[11px] text-vscode-text-secondary leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-vscode-text-secondary mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-1 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-vscode-blue rounded-full mt-1.5" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="text-vscode-text-secondary hover:text-vscode-text transition-colors p-0.5 rounded hover:bg-vscode-active"
                            >
                              <X size={12} />
                            </button>
                          </div>
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

