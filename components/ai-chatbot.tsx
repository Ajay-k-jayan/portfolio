'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, Send, Bot, User, Sparkles, Copy, Check, Loader2, Plus, RotateCcw, Settings, 
  MoreHorizontal, Maximize2, Minimize2, Paperclip, ChevronDown, Mic, Download,
  FileText, Zap, Brain, Code, MessageSquare, History, Trash2, Save, Edit3,
  Sliders, Volume2, VolumeX, ChevronRight, ChevronLeft, Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useAppStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSettings {
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'claude-3-opus' | 'claude-3-sonnet'
  temperature: number
  maxTokens: number
  systemPrompt: string
  responseStyle: 'concise' | 'detailed' | 'creative' | 'technical'
  enableCodeFormatting: boolean
  enableVoiceInput: boolean
  contextWindow: number
}

const defaultSettings: ChatSettings = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: `You are an AI assistant helping users explore ${portfolioData.profile.name}'s portfolio. Provide helpful, accurate information about projects, skills, experience, and achievements.`,
  responseStyle: 'detailed',
  enableCodeFormatting: true,
  enableVoiceInput: false,
  contextWindow: 10,
}

export function AIChatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings)
  const [chatHistory, setChatHistory] = useState<Message[][]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setActiveMenuItem, addNotification } = useAppStore()

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiChatbotSettings')
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) })
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('aiChatbotSettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (!isMinimized && !showSettings && !showHistory) {
      inputRef.current?.focus()
    }
  }, [isMinimized, showSettings, showHistory])

  const copyToClipboard = useCallback((text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
    addNotification({
      title: 'Copied',
      message: 'Message copied to clipboard',
      type: 'success'
    })
  }, [addNotification])

  const clearChat = useCallback(() => {
    if (messages.length > 0) {
      setChatHistory(prev => [...prev, messages])
    }
    setMessages([])
    setCurrentChatId(null)
    addNotification({
      title: 'Chat Cleared',
      message: 'Chat history has been cleared',
      type: 'info'
    })
  }, [messages, addNotification])

  const newChat = useCallback(() => {
    if (messages.length > 0) {
      setChatHistory(prev => [...prev, messages])
    }
    setMessages([])
    setCurrentChatId(Date.now().toString())
    addNotification({
      title: 'New Chat',
      message: 'Started a new conversation',
      type: 'info'
    })
  }, [messages, addNotification])

  const exportChat = useCallback(() => {
    if (messages.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No messages to export',
        type: 'error'
      })
      return
    }

    const chatText = messages.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'Assistant'
      const time = msg.timestamp.toLocaleString()
      return `[${time}] ${role}: ${msg.content}\n`
    }).join('\n')

    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)

    addNotification({
      title: 'Export Successful',
      message: 'Chat exported to file',
      type: 'success'
    })
  }, [messages, addNotification])

  const loadChatFromHistory = useCallback((chat: Message[]) => {
    setMessages(chat)
    setShowHistory(false)
    addNotification({
      title: 'Chat Loaded',
      message: 'Loaded chat from history',
      type: 'info'
    })
  }, [addNotification])

  const generateContextualResponse = useCallback((userInput: string): { content: string; action?: () => void } => {
    const lower = userInput.toLowerCase()
    
    if (lower.includes('project')) {
      const project = portfolioData.projects[0]
      return {
        content: `I can help you with projects! ${portfolioData.profile.name} has worked on **${project.name}**, a ${project.description}. The project uses technologies like ${project.technologies.join(', ')}. Would you like me to open the Projects section?`,
        action: () => {
          setActiveMenuItem('project')
          addNotification({
            title: 'Navigation',
            message: 'Opening Projects section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('skill') || lower.includes('technology') || lower.includes('tech stack')) {
      return {
        content: `${portfolioData.profile.name} is a ${portfolioData.profile.title} with expertise in ${portfolioData.profile.subtitle}. The portfolio includes detailed information about technical skills, frameworks, and tools. Would you like me to open the Skills section?`,
        action: () => {
          setActiveMenuItem('skills')
          addNotification({
            title: 'Navigation',
            message: 'Opening Skills section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('experience') || lower.includes('work') || lower.includes('job') || lower.includes('career')) {
      const exp = portfolioData.experience[0]
      return {
        content: `${portfolioData.profile.name} is currently working as a **${exp.title}** at **${exp.company}** (${exp.period}). Previously worked as ${portfolioData.experience[1]?.title} at ${portfolioData.experience[1]?.company}. Would you like me to open the Experience section?`,
        action: () => {
          setActiveMenuItem('experience')
          addNotification({
            title: 'Navigation',
            message: 'Opening Experience section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('reach')) {
      return {
        content: `You can contact ${portfolioData.profile.name} via:\n\n📧 Email: ${portfolioData.profile.email}\n📱 Phone: ${portfolioData.profile.phone}\n💼 LinkedIn: ${portfolioData.profile.linkedin}\n🔗 GitHub: ${portfolioData.profile.github}\n\nWould you like me to open the Contact section?`,
        action: () => {
          setActiveMenuItem('contact')
          addNotification({
            title: 'Navigation',
            message: 'Opening Contact section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('about') || lower.includes('who') || lower.includes('bio') || lower.includes('introduction')) {
      return {
        content: `${portfolioData.profile.bio}\n\n${portfolioData.profile.name} is located in ${portfolioData.profile.location} and has ${portfolioData.profile.experience} of experience. Would you like me to open the About section?`,
        action: () => {
          setActiveMenuItem('welcome')
          addNotification({
            title: 'Navigation',
            message: 'Opening About section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('achievement') || lower.includes('award') || lower.includes('recognition')) {
      const achievement = portfolioData.achievements[0]
      return {
        content: `${portfolioData.profile.name} has received the **${achievement.name}** (${achievement.date}) from ${achievement.issuer}. There are more achievements in the portfolio. Would you like me to open the Achievements section?`,
        action: () => {
          setActiveMenuItem('achievement')
          addNotification({
            title: 'Navigation',
            message: 'Opening Achievements section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('certification') || lower.includes('certificate') || lower.includes('course')) {
      return {
        content: `${portfolioData.profile.name} has ${portfolioData.certifications.length} certifications from platforms like Coursera, Meta, and Google. These include courses on JavaScript, React, Version Control, and more. Would you like me to open the Certifications section?`,
        action: () => {
          setActiveMenuItem('certifications')
          addNotification({
            title: 'Navigation',
            message: 'Opening Certifications section',
            type: 'info'
          })
        }
      }
    }
    
    if (lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('college')) {
      return {
        content: `${portfolioData.profile.name} completed a **${portfolioData.education.degree}** from ${portfolioData.education.institution} (${portfolioData.education.period}) in ${portfolioData.education.location}.`,
      }
    }
    
    const styleResponses = {
      concise: `I can help you explore ${portfolioData.profile.name}'s portfolio. Ask about projects, skills, experience, contact info, achievements, or certifications.`,
      detailed: `I can help you explore ${portfolioData.profile.name}'s portfolio. You can ask me about:\n\n• Projects and work experience\n• Skills and technologies\n• Contact information\n• Achievements and certifications\n• Education background\n\nTry asking: "Tell me about projects" or "What are the skills?"`,
      creative: `✨ Welcome! I'm your creative AI assistant for ${portfolioData.profile.name}'s portfolio. Let's explore together! 🚀\n\nI can help you discover:\n🎯 Projects & Case Studies\n💡 Skills & Technologies\n📈 Experience & Career\n📞 Contact Information\n🏆 Achievements & Certifications\n\nWhat would you like to explore?`,
      technical: `I'm an AI assistant specialized in ${portfolioData.profile.name}'s technical portfolio.\n\nAvailable data:\n- Projects: ${portfolioData.projects.length}\n- Experience: ${portfolioData.experience.length} positions\n- Certifications: ${portfolioData.certifications.length}\n- Skills: Multiple categories\n\nQuery format: "Show [category] details" or "Explain [topic]"`,
    }
    
    return {
      content: styleResponses[settings.responseStyle] || styleResponses.detailed
    }
  }, [setActiveMenuItem, addNotification, settings.responseStyle])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const delay = settings.model.includes('gpt-4') ? 1200 : 800
    await new Promise(resolve => setTimeout(resolve, delay))

    const response = generateContextualResponse(userMessage.content)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)

    if (response.action) {
      setTimeout(() => response.action!(), 500)
    }

    setTimeout(() => inputRef.current?.focus(), 100)
  }, [input, isTyping, generateContextualResponse, settings.model])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const showWelcome = messages.length === 0 && !isTyping

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-20 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[600px] ${
        isMinimized ? 'h-12' : 'h-[calc(100vh-8rem)] md:h-[650px]'
      } max-h-[650px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex flex-col z-[100] overflow-hidden transition-all duration-300`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 md:px-4 h-12 bg-vscode-active/30 border-b border-vscode-border flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-gradient-to-br from-vscode-blue to-blue-600 rounded flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-medium text-vscode-text border-b-2 border-vscode-blue pb-1 whitespace-nowrap">
              CHAT
            </h3>
          </div>
          {messages.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-xs text-vscode-text-secondary">
              <MessageSquare size={12} />
              <span>{messages.length}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
          <button
            onClick={newChat}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="New Chat"
            title="New Chat"
          >
            <Plus size={14} className="md:w-4 md:h-4" />
          </button>
          
          <button
            onClick={() => {
              setShowHistory(!showHistory)
              setShowSettings(false)
            }}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Chat History"
            title="Chat History"
          >
            <History size={14} className="md:w-4 md:h-4" />
          </button>
          
          <button
            onClick={exportChat}
            disabled={messages.length === 0}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Export Chat"
            title="Export Chat"
          >
            <Download size={14} className="md:w-4 md:h-4" />
          </button>
          
          <button
            onClick={() => {
              setShowSettings(!showSettings)
              setShowHistory(false)
            }}
            className={`p-1.5 hover:bg-vscode-hover rounded transition-colors ${
              showSettings ? 'bg-vscode-hover text-vscode-blue' : 'text-vscode-text-secondary hover:text-vscode-text'
            }`}
            aria-label="Settings"
            title="Advanced Settings"
          >
            <Sliders size={14} className="md:w-4 md:h-4" />
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} className="md:w-4 md:h-4" /> : <Minimize2 size={14} className="md:w-4 md:h-4" />}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            showSettings || showHistory ? 'md:mr-[300px]' : ''
          }`}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-vscode-border scrollbar-track-transparent">
              {showWelcome ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 md:mb-8"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-vscode-blue/30 flex items-center justify-center mb-4 md:mb-6 bg-gradient-to-br from-vscode-blue/10 to-blue-600/10">
                      <Sparkles size={36} className="md:w-12 md:h-12 text-vscode-blue" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-vscode-text mb-2 md:mb-3">
                    Ask about your portfolio
                  </h2>
                  <p className="text-xs md:text-sm text-vscode-text-secondary mb-6 md:mb-8 max-w-md">
                    AI responses may be inaccurate. Use advanced settings to customize your experience.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6 md:mb-8 w-full max-w-md">
                    {['Tell me about projects', 'What are your skills?', 'Show experience', 'Contact information'].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion)
                          inputRef.current?.focus()
                        }}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-vscode-active border border-vscode-border rounded-lg hover:bg-vscode-hover hover:border-vscode-blue/50 text-vscode-text transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setInput('Tell me about the portfolio')
                      setTimeout(() => {
                        inputRef.current?.focus()
                        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }, 100)
                    }}
                    className="text-vscode-blue hover:text-blue-400 text-xs md:text-sm underline transition-colors"
                  >
                    Generate Agent Instructions to onboard AI onto your codebase.
                  </button>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-vscode-blue to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="text-white" size={16} />
                          </div>
                        )}
                        <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[80%] min-w-0">
                          <div
                            className={`rounded-lg p-3 md:p-4 ${
                              message.role === 'user'
                                ? 'bg-vscode-blue text-white shadow-lg'
                                : 'bg-vscode-active text-vscode-text border border-vscode-border'
                            }`}
                          >
                            <div className={`text-xs md:text-sm whitespace-pre-wrap break-words ${
                              settings.enableCodeFormatting && message.role === 'assistant' ? 'font-mono' : ''
                            }`}>
                              {message.content.split('\n').map((line, i) => (
                                <span key={i}>
                                  {line}
                                  {i < message.content.split('\n').length - 1 && <br />}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] md:text-xs text-vscode-text-secondary">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.role === 'assistant' && (
                              <button
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                                aria-label="Copy message"
                              >
                                {copiedId === message.id ? (
                                  <Check size={10} className="md:w-3 md:h-3 text-green-500" />
                                ) : (
                                  <Copy size={10} className="md:w-3 md:h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-vscode-border flex items-center justify-center flex-shrink-0">
                            <User className="text-vscode-text-secondary" size={16} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 md:gap-4 justify-start"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-vscode-blue to-blue-600 flex items-center justify-center">
                        <Bot className="text-white" size={16} />
                      </div>
                      <div className="bg-vscode-active rounded-lg p-3 md:p-4 border border-vscode-border">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-vscode-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-vscode-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-vscode-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-vscode-border bg-vscode-active/20 p-3 md:p-4 flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-xs md:text-sm text-vscode-text-secondary hover:text-vscode-text transition-colors">
                    <Paperclip size={14} className="md:w-4 md:h-4" />
                    <span className="hidden md:inline">Add Context...</span>
                  </button>
                  <div className="hidden md:flex items-center gap-2 text-xs text-vscode-text-secondary">
                    <span>Model: {settings.model}</span>
                    <span>•</span>
                    <span>Style: {settings.responseStyle}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your portfolio..."
                    disabled={isTyping}
                    className="flex-1 bg-vscode-sidebar border border-vscode-border rounded-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Chat input"
                  />
                  
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 md:p-3 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg flex-shrink-0"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <Loader2 size={16} className="md:w-[18px] md:h-[18px] animate-spin" />
                    ) : (
                      <Send size={16} className="md:w-[18px] md:h-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings Panel - Fixed Position */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                className="hidden md:block absolute top-0 right-0 w-[300px] h-full border-l border-vscode-border bg-vscode-active/80 backdrop-blur-sm overflow-y-auto z-10"
              >
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-vscode-text flex items-center gap-2">
                      <Sliders size={16} />
                      Advanced Settings
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-vscode-hover rounded"
                    >
                      <ChevronRight size={16} className="text-vscode-text-secondary" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-vscode-text-secondary mb-2 block">
                      AI Model
                    </label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value as ChatSettings['model'] }))}
                      className="w-full bg-vscode-sidebar border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue"
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-vscode-text-secondary">
                        Temperature
                      </label>
                      <span className="text-xs text-vscode-text">{settings.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-vscode-text-secondary">
                        Max Tokens
                      </label>
                      <span className="text-xs text-vscode-text">{settings.maxTokens}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-vscode-text-secondary mb-2 block">
                      Response Style
                    </label>
                    <select
                      value={settings.responseStyle}
                      onChange={(e) => setSettings(prev => ({ ...prev, responseStyle: e.target.value as ChatSettings['responseStyle'] }))}
                      className="w-full bg-vscode-sidebar border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue"
                    >
                      <option value="concise">Concise</option>
                      <option value="detailed">Detailed</option>
                      <option value="creative">Creative</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-vscode-text-secondary">
                        Context Window
                      </label>
                      <span className="text-xs text-vscode-text">{settings.contextWindow}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={settings.contextWindow}
                      onChange={(e) => setSettings(prev => ({ ...prev, contextWindow: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-medium text-vscode-text-secondary">Code Formatting</span>
                      <input
                        type="checkbox"
                        checked={settings.enableCodeFormatting}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableCodeFormatting: e.target.checked }))}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-sidebar text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-medium text-vscode-text-secondary">Voice Input</span>
                      <input
                        type="checkbox"
                        checked={settings.enableVoiceInput}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableVoiceInput: e.target.checked }))}
                        className="w-4 h-4 rounded border-vscode-border bg-vscode-sidebar text-vscode-blue focus:ring-vscode-blue"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-vscode-text-secondary mb-2 block">
                      System Prompt
                    </label>
                    <textarea
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      rows={4}
                      className="w-full bg-vscode-sidebar border border-vscode-border rounded px-3 py-2 text-xs text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue resize-none font-mono"
                      placeholder="Custom system prompt..."
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSettings(defaultSettings)
                      addNotification({
                        title: 'Settings Reset',
                        message: 'All settings restored to defaults',
                        type: 'info'
                      })
                    }}
                    className="w-full px-4 py-2 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text hover:bg-vscode-hover transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History Panel - Fixed Position */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                className="hidden md:block absolute top-0 right-0 w-[300px] h-full border-l border-vscode-border bg-vscode-active/80 backdrop-blur-sm overflow-y-auto z-10"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-vscode-text flex items-center gap-2">
                      <History size={16} />
                      Chat History
                    </h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="p-1 hover:bg-vscode-hover rounded"
                    >
                      <ChevronRight size={16} className="text-vscode-text-secondary" />
                    </button>
                  </div>
                  {chatHistory.length > 0 ? (
                    <div className="space-y-2">
                      {chatHistory.map((chat, index) => (
                        <button
                          key={index}
                          onClick={() => loadChatFromHistory(chat)}
                          className="w-full text-left p-3 bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover transition-colors"
                        >
                          <div className="text-xs font-medium text-vscode-text mb-1">
                            Chat {index + 1}
                          </div>
                          <div className="text-xs text-vscode-text-secondary">
                            {chat.length} messages
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-vscode-text-secondary text-center py-8">
                      No chat history yet
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
