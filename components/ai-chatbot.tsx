'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you navigate the portfolio, answer questions about projects, or provide information about skills and experience. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me help you with that.',
        'I can provide more information about that topic. Would you like me to open the relevant section?',
        'Based on the portfolio content, I can tell you more about this.',
        'Would you like to see a code example or a live demo of that feature?',
      ]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + ' ' + generateContextualResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const generateContextualResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase()
    if (lower.includes('project')) {
      return 'You can explore projects in the Explorer sidebar or click on the Run & Debug icon. Each project has code previews and live demos available.'
    }
    if (lower.includes('skill') || lower.includes('experience')) {
      return 'Check out the Skills tab in the file explorer or visit the About section for detailed information about technical expertise.'
    }
    if (lower.includes('contact') || lower.includes('hire')) {
      return 'You can find contact information in the Contact section of the sidebar, or download the resume from the File menu.'
    }
    return 'Feel free to explore the portfolio using the sidebar navigation. I\'m here to help guide you!'
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-vscode-border bg-vscode-active">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-vscode-blue rounded">
            <Sparkles className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-vscode-text">AI Assistant</h3>
            <p className="text-xs text-vscode-text-secondary">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-vscode-blue flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-vscode-blue text-white'
                  : 'bg-vscode-active text-vscode-text'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-vscode-text-secondary'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-vscode-border flex items-center justify-center flex-shrink-0">
                <User className="text-vscode-text-secondary" size={16} />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-vscode-blue flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
            <div className="bg-vscode-active rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-vscode-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:border-vscode-blue"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-vscode-blue hover:bg-blue-600 text-white rounded transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

