'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Bot, User, Sparkles, Copy, Check, Loader2, Plus, RotateCcw, Settings, MoreHorizontal, Maximize2, Minimize2, Paperclip, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useAppStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setActiveMenuItem, addNotification } = useAppStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    // Focus input when chatbot opens
    if (!isMinimized) {
      inputRef.current?.focus()
    }
  }, [isMinimized])

  const copyToClipboard = useCallback((text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    addNotification({
      title: 'Chat Cleared',
      message: 'Chat history has been cleared',
      type: 'info'
    })
  }, [addNotification])

  const generateContextualResponse = useCallback((userInput: string): { content: string; action?: () => void } => {
    const lower = userInput.toLowerCase()
    
    // Projects
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
    
    // Skills
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
    
    // Experience
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
    
    // Contact
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
    
    // About/Bio
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
    
    // Achievements
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
    
    // Certifications
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
    
    // Education
    if (lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('college')) {
      return {
        content: `${portfolioData.profile.name} completed a **${portfolioData.education.degree}** from ${portfolioData.education.institution} (${portfolioData.education.period}) in ${portfolioData.education.location}.`,
      }
    }
    
    // Default response
    return {
      content: `I can help you explore ${portfolioData.profile.name}'s portfolio. You can ask me about:\n\n• Projects and work experience\n• Skills and technologies\n• Contact information\n• Achievements and certifications\n• Education background\n\nTry asking: "Tell me about projects" or "What are the skills?"`
    }
  }, [setActiveMenuItem, addNotification])

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

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const response = generateContextualResponse(userMessage.content)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)

    // Execute action if available
    if (response.action) {
      setTimeout(() => response.action!(), 500)
    }

    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [input, isTyping, generateContextualResponse])

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
        isMinimized ? 'h-12' : 'h-[calc(100vh-8rem)] md:h-[700px]'
      } max-h-[700px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex flex-col z-[100] overflow-hidden transition-all duration-300`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 h-12 bg-vscode-active/30 border-b border-vscode-border">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-vscode-text border-b-2 border-vscode-blue pb-1">
            CHAT
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([])}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="New Chat"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
          
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Clear History"
            title="Clear History"
          >
            <RotateCcw size={16} />
          </button>
          
          <button
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          
          <button
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="More Options"
            title="More Options"
          >
            <MoreHorizontal size={16} />
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-vscode-border scrollbar-track-transparent">
            {showWelcome ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-vscode-text-secondary/30 flex items-center justify-center mb-4">
                    <Sparkles size={40} className="text-vscode-text-secondary/50" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-vscode-text mb-2">
                  Ask about your portfolio
                </h2>
                <p className="text-sm text-vscode-text-secondary mb-6">
                  AI responses may be inaccurate.
                </p>
                <button
                  onClick={() => {
                    setInput('Tell me about the portfolio')
                    inputRef.current?.focus()
                  }}
                  className="text-vscode-blue hover:text-blue-400 text-sm underline transition-colors"
                >
                  Generate Agent Instructions to onboard AI onto your codebase.
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-vscode-active border border-vscode-border flex items-center justify-center flex-shrink-0">
                          <Bot className="text-vscode-text-secondary" size={18} />
                        </div>
                      )}
                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div
                          className={`rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-vscode-blue text-white'
                              : 'bg-vscode-active text-vscode-text border border-vscode-border'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {message.content.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < message.content.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs text-vscode-text-secondary">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                              aria-label="Copy message"
                            >
                              {copiedId === message.id ? (
                                <Check size={12} className="text-green-500" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-vscode-border flex items-center justify-center flex-shrink-0">
                          <User className="text-vscode-text-secondary" size={18} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-vscode-active border border-vscode-border flex items-center justify-center">
                      <Bot className="text-vscode-text-secondary" size={18} />
                    </div>
                    <div className="bg-vscode-active rounded-lg p-4 border border-vscode-border">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-vscode-border bg-vscode-active/20 p-4">
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-sm text-vscode-text-secondary hover:text-vscode-text transition-colors self-start">
                <Paperclip size={16} />
                <span>Add Context...</span>
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your portfolio..."
                  disabled={isTyping}
                  className="flex-1 bg-vscode-sidebar border border-vscode-border rounded px-4 py-2.5 text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Chat input"
                />
                
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-3 py-2.5 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text hover:bg-vscode-hover transition-colors">
                    <span>Ask</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  <button className="flex items-center gap-1 px-3 py-2.5 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text hover:bg-vscode-hover transition-colors">
                    <span>GPT-4</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
