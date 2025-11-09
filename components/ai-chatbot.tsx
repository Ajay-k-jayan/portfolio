'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, Send, Bot, User, Sparkles, Copy, Check, Loader2, Plus, RotateCcw, Settings, 
  MoreHorizontal, Maximize2, Minimize2, Paperclip, ChevronDown, Mic, Download,
  FileText, Zap, Brain, Code, MessageSquare, History, Trash2, Save, Edit3,
  Sliders, Volume2, VolumeX, ChevronRight, ChevronLeft, Info, GitCommit, 
  CheckCircle2, AlertCircle, Clock, Bug, RefreshCw, Layout, Eye, FileCode,
  Terminal, Play, Search, Filter, ChevronUp,
  Monitor, Smartphone, Tablet, Globe, Keyboard, MousePointerClick, Shield,
  MessageSquareReply, FilePlus, Image as ImageIcon, Video, Link as LinkIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useAppStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  codeSnippet?: string
  language?: string
  status?: 'fixed' | 'in-progress' | 'pending' | 'reviewed'
  attachments?: Array<{ name: string; type: string; url?: string }>
  replyTo?: string
}

interface CodeIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  file: string
  line: number
  message: string
  suggestion: string
  severity: 'high' | 'medium' | 'low'
}

interface QuickCommand {
  id: string
  label: string
  icon: any
  action: () => void
  category: 'code' | 'ui' | 'design' | 'review'
}

export function AIChatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showQuickCommands, setShowQuickCommands] = useState(true)
  const [codeIssues, setCodeIssues] = useState<CodeIssue[]>([])
  const [isLinting, setIsLinting] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isMultiline, setIsMultiline] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setActiveMenuItem, addNotification } = useAppStore()

  // Quick Commands
  const quickCommands: QuickCommand[] = [
    {
      id: 'check-ui-bugs',
      label: 'Check UI Bugs',
      icon: Bug,
      category: 'ui',
      action: () => handleQuickCommand('check-ui-bugs')
    },
    {
      id: 'refactor-code',
      label: 'Refactor Code',
      icon: RefreshCw,
      category: 'code',
      action: () => handleQuickCommand('refactor-code')
    },
    {
      id: 'redesign-layout',
      label: 'Redesign Layout',
      icon: Layout,
      category: 'design',
      action: () => handleQuickCommand('redesign-layout')
    },
    {
      id: 'code-review',
      label: 'Code Review',
      icon: Eye,
      category: 'review',
      action: () => handleQuickCommand('code-review')
    },
    {
      id: 'explain-code',
      label: 'Explain Code',
      icon: FileCode,
      category: 'code',
      action: () => handleQuickCommand('explain-code')
    },
    {
      id: 'responsive-audit',
      label: 'Responsive Audit',
      icon: Monitor,
      category: 'ui',
      action: () => handleQuickCommand('responsive-audit')
    },
    {
      id: 'accessibility-check',
      label: 'Accessibility',
      icon: Shield,
      category: 'review',
      action: () => handleQuickCommand('accessibility-check')
    },
    {
      id: 'optimize-performance',
      label: 'Optimize Performance',
      icon: Zap,
      category: 'code',
      action: () => handleQuickCommand('optimize-performance')
    }
  ]

  const handleQuickCommand = useCallback((commandId: string) => {
    const command = quickCommands.find(c => c.id === commandId)
    if (!command) return

    const commandMessages: Record<string, string> = {
      'check-ui-bugs': 'Please check for UI bugs and layout issues in the portfolio',
      'refactor-code': 'Help me refactor the code to improve maintainability and performance',
      'redesign-layout': 'Suggest improvements for the layout design',
      'code-review': 'Review the codebase for best practices and potential issues',
      'explain-code': 'Explain how this code works',
      'responsive-audit': 'Audit the responsive design for all screen sizes',
      'accessibility-check': 'Check accessibility issues and WCAG compliance',
      'optimize-performance': 'Analyze and suggest performance optimizations'
    }

    setInput(commandMessages[commandId] || command.label)
    inputRef.current?.focus()
    addNotification({
      title: 'Quick Command',
      message: `Selected: ${command.label}`,
      type: 'info'
    })
  }, [quickCommands, addNotification])

  const runLinter = useCallback(async () => {
    setIsLinting(true)
    addNotification({
      title: 'Linter',
      message: 'Running code analysis...',
      type: 'info'
    })

    // Simulate linter check
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockIssues: CodeIssue[] = [
      {
        id: '1',
        type: 'warning',
        file: 'components/ai-chatbot.tsx',
        line: 45,
        message: 'Unused variable detected',
        suggestion: 'Remove unused variable or use it in the code',
        severity: 'low'
      },
      {
        id: '2',
        type: 'error',
        file: 'components/contact-tab.tsx',
        line: 120,
        message: 'Missing accessibility attribute',
        suggestion: 'Add aria-label to button element',
        severity: 'high'
      },
      {
        id: '3',
        type: 'info',
        file: 'components/welcome-tab.tsx',
        line: 89,
        message: 'Consider using useMemo for expensive computation',
        suggestion: 'Wrap the computation in useMemo hook',
        severity: 'medium'
      }
    ]

    setCodeIssues(mockIssues)
    setIsLinting(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Run linter check',
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Found ${mockIssues.length} issues:\n\n${mockIssues.map(issue => 
        `**${issue.type.toUpperCase()}** in ${issue.file}:${issue.line}\n${issue.message}\n💡 Suggestion: ${issue.suggestion}`
      ).join('\n\n')}`,
      timestamp: new Date(),
      status: 'reviewed'
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    addNotification({
      title: 'Linter Complete',
      message: `Found ${mockIssues.length} issues`,
      type: mockIssues.some(i => i.severity === 'high') ? 'error' : 'warning'
    })
  }, [addNotification])

  const commitChanges = useCallback(async () => {
    if (messages.length === 0) {
      addNotification({
        title: 'No Changes',
        message: 'No changes to commit',
        type: 'info'
      })
      return
    }

    setIsCommitting(true)
    addNotification({
      title: 'Committing',
      message: 'Preparing to commit changes...',
      type: 'info'
    })

    // Simulate commit
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsCommitting(false)
    addNotification({
      title: 'Commit Successful',
      message: 'Changes committed successfully',
      type: 'success'
    })

    const commitMessage = `AI Assistant: Applied fixes and improvements\n\n- Fixed ${codeIssues.filter(i => i.severity === 'high').length} high priority issues\n- Applied code improvements\n- Updated UI components`

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ **Changes Committed Successfully**\n\n\`\`\`\n${commitMessage}\n\`\`\`\n\nAll fixes have been applied and committed.`,
      timestamp: new Date(),
      status: 'fixed'
    }

    setMessages(prev => [...prev, assistantMessage])
  }, [messages, codeIssues, addNotification])

  const handleFileAttachment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles(prev => [...prev, ...files])
    
    files.forEach(file => {
      addNotification({
        title: 'File Attached',
        message: `${file.name} attached`,
        type: 'info'
      })
    })
  }, [addNotification])

  const removeAttachment = useCallback((index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const replyToMessage = useCallback((messageId: string) => {
    setSelectedMessage(messageId)
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setInput(`Replying to: ${message.content.substring(0, 50)}...\n\n`)
      inputRef.current?.focus()
    }
  }, [messages])

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

  const generateContextualResponse = useCallback((userInput: string): { content: string; codeSnippet?: string; language?: string; status?: Message['status'] } => {
    const lower = userInput.toLowerCase()
    
    // Code review responses
    if (lower.includes('bug') || lower.includes('issue') || lower.includes('error')) {
      return {
        content: `I've analyzed the codebase and found several issues:\n\n**High Priority:**\n- Missing accessibility attributes in contact form\n- Unused imports in welcome-tab.tsx\n\n**Medium Priority:**\n- Performance optimization opportunity in file-explorer\n- Consider memoization for expensive computations\n\n**Low Priority:**\n- Code formatting inconsistencies\n- Missing JSDoc comments\n\nWould you like me to generate fixes for these issues?`,
        status: 'in-progress'
      }
    }

    if (lower.includes('refactor') || lower.includes('improve')) {
      return {
        content: `Here's a refactored version with improvements:\n\n\`\`\`typescript\n// Before\nconst handleClick = () => {\n  setState(prev => !prev)\n}\n\n// After - Improved with useCallback\nconst handleClick = useCallback(() => {\n  setState(prev => !prev)\n}, [])\n\`\`\`\n\n**Improvements:**\n- Added memoization to prevent unnecessary re-renders\n- Better performance optimization\n- Cleaner code structure`,
        codeSnippet: `const handleClick = useCallback(() => {\n  setState(prev => !prev)\n}, [])`,
        language: 'typescript',
        status: 'reviewed'
      }
    }

    if (lower.includes('explain') || lower.includes('how does')) {
      return {
        content: `This code works as follows:\n\n1. **State Management**: Uses React hooks to manage component state\n2. **Event Handling**: Processes user interactions\n3. **Rendering**: Updates UI based on state changes\n\n\`\`\`typescript\n// Example explanation\nconst [count, setCount] = useState(0)\n// Creates a state variable 'count' initialized to 0\n// setCount is the function to update it\n\`\`\``,
        codeSnippet: `const [count, setCount] = useState(0)`,
        language: 'typescript'
      }
    }

    if (lower.includes('responsive') || lower.includes('mobile') || lower.includes('layout')) {
      return {
        content: `**Responsive Design Audit Results:**\n\n✅ **Desktop (1920px)**: All layouts working correctly\n⚠️ **Tablet (768px)**: Some spacing issues detected\n❌ **Mobile (375px)**: Header overflow, needs adjustment\n\n**Recommendations:**\n1. Add responsive breakpoints for mobile\n2. Adjust padding for smaller screens\n3. Optimize touch targets (min 44x44px)\n\nWould you like me to generate the fixes?`,
        status: 'in-progress'
      }
    }

    if (lower.includes('accessibility') || lower.includes('a11y') || lower.includes('wcag')) {
      return {
        content: `**Accessibility Audit:**\n\n✅ **Passing:**\n- Semantic HTML structure\n- Keyboard navigation support\n- Focus indicators present\n\n⚠️ **Needs Improvement:**\n- Some images missing alt text\n- Color contrast ratio below 4.5:1 in 3 places\n- Missing ARIA labels on 5 interactive elements\n\n**Priority Fixes:**\n1. Add alt attributes to all images\n2. Improve color contrast for text\n3. Add aria-label to buttons without visible text`,
        status: 'in-progress'
      }
    }

    // Default portfolio responses
    if (lower.includes('project')) {
      const project = portfolioData.projects[0]
      return {
        content: `${portfolioData.profile.name} has worked on **${project.name}**, a ${project.description}. Technologies: ${project.technologies.join(', ')}.`
      }
    }

    return {
      content: `I can help you with:\n\n• **Code Review** - Check for bugs and issues\n• **Refactoring** - Improve code quality\n• **UI/UX Audit** - Find layout problems\n• **Accessibility** - WCAG compliance check\n• **Performance** - Optimization suggestions\n• **Portfolio Info** - Questions about projects and skills\n\nWhat would you like to do?`
    }
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      attachments: attachedFiles.map(f => ({ name: f.name, type: f.type })),
      replyTo: selectedMessage || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachedFiles([])
    setSelectedMessage(null)
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = generateContextualResponse(userMessage.content)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      codeSnippet: response.codeSnippet,
      language: response.language,
      status: response.status
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)

    setTimeout(() => inputRef.current?.focus(), 100)
  }, [input, isTyping, attachedFiles, selectedMessage, generateContextualResponse])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

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
      const attachments = msg.attachments ? `\nAttachments: ${msg.attachments.map(a => a.name).join(', ')}` : ''
      return `[${time}] ${role}: ${msg.content}${attachments}`
    }).join('\n\n')

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

  const getStatusBadge = (status?: Message['status']) => {
    if (!status) return null
    
    const badges = {
      'fixed': { icon: CheckCircle2, color: 'text-green-500 bg-green-500/20', label: 'Fixed' },
      'in-progress': { icon: Clock, color: 'text-yellow-500 bg-yellow-500/20', label: 'In Progress' },
      'pending': { icon: AlertCircle, color: 'text-orange-500 bg-orange-500/20', label: 'Pending' },
      'reviewed': { icon: Eye, color: 'text-blue-500 bg-blue-500/20', label: 'Reviewed' }
    }

    const badge = badges[status]
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    )
  }

  const showWelcome = messages.length === 0 && !isTyping

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-20 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[900px] ${
        isMinimized ? 'h-12' : 'h-[calc(100vh-8rem)] md:h-[750px]'
      } max-h-[750px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex flex-col z-[100] overflow-hidden transition-all duration-300`}
      role="dialog"
      aria-label="AI Assistant Chat"
      aria-modal="true"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-3 md:px-4 h-10 bg-vscode-active/40 border-b border-vscode-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gradient-to-br from-vscode-blue to-blue-600 rounded flex-shrink-0">
            <Sparkles size={12} className="text-white" />
          </div>
          <h3 className="text-xs md:text-sm font-medium text-vscode-text">
            AI ASSISTANT
          </h3>
          {messages.length > 0 && (
            <span className="text-xs text-vscode-text-secondary">
              ({messages.length} messages)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={runLinter}
            disabled={isLinting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover text-vscode-text transition-colors disabled:opacity-50"
            aria-label="Run Linter"
            title="Run Linter (Ctrl+L)"
          >
            {isLinting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <CheckCircle2 size={12} />
            )}
            <span className="hidden md:inline">Lint</span>
          </button>
          
          <button
            onClick={commitChanges}
            disabled={isCommitting || messages.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-vscode-blue hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Commit Changes"
            title="Commit Changes (Ctrl+Shift+C)"
          >
            {isCommitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <GitCommit size={12} />
            )}
            <span className="hidden md:inline">Commit</span>
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 hover:bg-vscode-hover rounded transition-colors ${
              showSettings ? 'bg-vscode-hover text-vscode-blue' : 'text-vscode-text-secondary hover:text-vscode-text'
            }`}
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Quick Commands */}
          {showQuickCommands && (
            <div className="hidden md:block w-48 border-r border-vscode-border bg-vscode-active/20 flex-shrink-0 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-vscode-text uppercase">Quick Commands</h4>
                  <button
                    onClick={() => setShowQuickCommands(false)}
                    className="p-0.5 hover:bg-vscode-hover rounded"
                    aria-label="Hide Quick Commands"
                  >
                    <ChevronLeft size={12} className="text-vscode-text-secondary" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {quickCommands.map((cmd) => {
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full text-left px-2.5 py-2 text-xs bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover hover:border-vscode-blue/50 transition-all group"
                        aria-label={cmd.label}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-vscode-blue flex-shrink-0" />
                          <span className="text-vscode-text group-hover:text-vscode-blue transition-colors">
                            {cmd.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-vscode-border scrollbar-track-transparent">
              {showWelcome ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-vscode-blue/30 flex items-center justify-center mb-4 bg-gradient-to-br from-vscode-blue/10 to-blue-600/10">
                      <Sparkles size={40} className="md:w-12 md:h-12 text-vscode-blue" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-vscode-text mb-2">
                    AI Development Assistant
                  </h2>
                  <p className="text-xs md:text-sm text-vscode-text-secondary mb-6 max-w-md">
                    Get help with code review, bug fixes, refactoring, and portfolio questions
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {quickCommands.slice(0, 4).map((cmd) => {
                      const Icon = cmd.icon
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className="px-3 py-1.5 text-xs bg-vscode-active border border-vscode-border rounded-lg hover:bg-vscode-hover hover:border-vscode-blue/50 text-vscode-text transition-all flex items-center gap-1.5"
                        >
                          <Icon size={12} />
                          {cmd.label}
                        </button>
                      )
                    })}
                  </div>
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
                        <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[75%] min-w-0">
                          {message.replyTo && (
                            <div className="text-xs text-vscode-text-secondary flex items-center gap-1 mb-1">
                              <MessageSquareReply size={10} />
                              <span>Replying to message</span>
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-3 md:p-4 ${
                              message.role === 'user'
                                ? 'bg-vscode-blue text-white shadow-lg'
                                : 'bg-vscode-active text-vscode-text border border-vscode-border'
                            }`}
                          >
                            {message.codeSnippet && (
                              <div className="mb-3 p-3 bg-vscode-sidebar border border-vscode-border rounded font-mono text-xs overflow-x-auto">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-vscode-text-secondary text-[10px] uppercase">{message.language || 'code'}</span>
                                  <button
                                    onClick={() => copyToClipboard(message.codeSnippet!, message.id)}
                                    className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
                                    aria-label="Copy code"
                                  >
                                    <Copy size={10} />
                                  </button>
                                </div>
                                <pre className="text-xs whitespace-pre-wrap break-words">{message.codeSnippet}</pre>
                              </div>
                            )}
                            <div className="text-xs md:text-sm whitespace-pre-wrap break-words">
                              {message.content.split('\n').map((line, i) => (
                                <span key={i}>
                                  {line}
                                  {i < message.content.split('\n').length - 1 && <br />}
                                </span>
                              ))}
                            </div>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-vscode-border/50">
                                <div className="flex flex-wrap gap-2">
                                  {message.attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-vscode-sidebar rounded text-xs">
                                      <Paperclip size={10} />
                                      <span className="text-vscode-text-secondary">{att.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] md:text-xs text-vscode-text-secondary">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.status && getStatusBadge(message.status)}
                            {message.role === 'assistant' && (
                              <>
                                <button
                                  onClick={() => replyToMessage(message.id)}
                                  className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                                  aria-label="Reply"
                                  title="Reply to this message"
                                >
                                  <MessageSquareReply size={10} />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className="p-1 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                                  aria-label="Copy message"
                                >
                                  {copiedId === message.id ? (
                                    <Check size={10} className="text-green-500" />
                                  ) : (
                                    <Copy size={10} />
                                  )}
                                </button>
                              </>
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
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-vscode-sidebar border border-vscode-border rounded text-xs">
                      <Paperclip size={10} />
                      <span className="text-vscode-text-secondary">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-0.5 hover:bg-vscode-hover rounded"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs md:text-sm text-vscode-text-secondary hover:text-vscode-text transition-colors"
                      aria-label="Attach File"
                      title="Attach File"
                    >
                      <Paperclip size={14} />
                      <span className="hidden md:inline">Attach</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileAttachment}
                      className="hidden"
                      aria-label="File input"
                    />
                    <button
                      onClick={() => setIsMultiline(!isMultiline)}
                      className="flex items-center gap-1.5 text-xs md:text-sm text-vscode-text-secondary hover:text-vscode-text transition-colors"
                      aria-label="Toggle Multiline"
                      title="Multiline Input"
                    >
                      {isMultiline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs text-vscode-text-secondary">
                    <kbd className="px-1.5 py-0.5 bg-vscode-sidebar border border-vscode-border rounded text-[10px]">Ctrl+Enter</kbd>
                    <span>to send</span>
                  </div>
                </div>
                
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about code, request reviews, or get help..."
                    disabled={isTyping}
                    rows={isMultiline ? 4 : 1}
                    className={`flex-1 bg-vscode-sidebar border border-vscode-border rounded-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
                      isMultiline ? 'min-h-[100px]' : 'min-h-[40px]'
                    }`}
                    aria-label="Chat input"
                    aria-multiline="true"
                  />
                  
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 md:p-3 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg flex-shrink-0"
                    aria-label="Send message"
                    title="Send (Ctrl+Enter)"
                  >
                    {isTyping ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Settings/History */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                className="hidden md:block absolute top-0 right-0 w-[280px] h-full border-l border-vscode-border bg-vscode-active/90 backdrop-blur-sm overflow-y-auto z-10"
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-vscode-text">Settings</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-vscode-hover rounded"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-vscode-text-secondary mb-1 block">Theme</label>
                      <select className="w-full bg-vscode-sidebar border border-vscode-border rounded px-2 py-1.5 text-xs text-vscode-text">
                        <option>Dark</option>
                        <option>Light</option>
                        <option>High Contrast</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-vscode-text-secondary mb-1 block">Language</label>
                      <select className="w-full bg-vscode-sidebar border border-vscode-border rounded px-2 py-1.5 text-xs text-vscode-text">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-vscode-text-secondary">Keyboard Shortcuts</span>
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-vscode-text-secondary">Sound Notifications</span>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <button
                    onClick={exportChat}
                    className="w-full px-3 py-2 bg-vscode-sidebar border border-vscode-border rounded text-xs text-vscode-text hover:bg-vscode-hover transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={12} />
                    Export Chat History
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
