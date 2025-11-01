'use client'

import { Terminal, Code, Sparkles, Rocket } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function WelcomeTab() {
  const { addTab } = useAppStore()

  const quickActions = [
    { label: 'View Projects', tabId: 'projects', icon: Code },
    { label: 'About Me', tabId: 'about', icon: Terminal },
    { label: 'Skills', tabId: 'skills', icon: Sparkles },
  ]

  return (
    <div className="h-full p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Rocket className="text-vscode-blue" size={48} />
            <div className="text-center">
              <h1 className="text-4xl font-bold text-vscode-text">
                Ajay K J
              </h1>
              <p className="text-lg text-vscode-green mt-2">Software Engineer</p>
            </div>
          </div>
          <p className="text-xl text-vscode-text-secondary">
            Front-End Developer | Angular | UI Design | Web Performance
          </p>
        </div>

        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-vscode-text">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.tabId}
                  onClick={() => {
                    // Will be implemented with actual tab content
                    console.log(`Opening ${action.label}`)
                  }}
                  className="flex flex-col items-center gap-3 p-4 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg transition-colors group"
                >
                  <Icon className="text-vscode-blue group-hover:scale-110 transition-transform" size={32} />
                  <span className="text-vscode-text font-medium">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-vscode-text mb-4">Features</h2>
          <ul className="space-y-2 text-vscode-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-vscode-blue">▹</span>
              <span>AI-powered chatbot for instant assistance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vscode-blue">▹</span>
              <span>Interactive code playground</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vscode-blue">▹</span>
              <span>Real-time analytics dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vscode-blue">▹</span>
              <span>Voice navigation assistant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vscode-blue">▹</span>
              <span>Gamification badges & achievements</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

