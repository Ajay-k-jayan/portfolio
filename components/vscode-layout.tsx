'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { TopMenuBar } from './top-menu-bar'
import { TabBar } from './tab-bar'
import { StatusBar } from './status-bar'
import { AIChatbot } from './ai-chatbot'
import { VoiceAssistant } from './voice-assistant'
import { useAppStore } from '@/lib/store'

export function VSCodeLayout({ children }: { children: React.ReactNode }) {
  const { tabs, activeTabId, sidebarCollapsed } = useAppStore()
  const [showChatbot, setShowChatbot] = useState(false)

  const activeTab = tabs.find(t => t.id === activeTabId)
  const activeContent = activeTab?.content || children

  return (
    <div className="h-screen w-screen flex flex-col bg-vscode-bg text-vscode-text overflow-hidden">
      <TopMenuBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TabBar />
          <div className="flex-1 overflow-auto bg-vscode-bg">
            {activeContent}
          </div>
        </div>
      </div>
      <StatusBar />
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
      <VoiceAssistant />
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-20 right-6 bg-vscode-blue text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors z-50"
        aria-label="Toggle AI Chatbot"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  )
}
