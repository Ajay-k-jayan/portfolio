'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, MicOff, Volume2, X, History, Settings, Sparkles,
  Download, FileText, Briefcase, Code, Mail, Globe, MessageSquare,
  Moon, Sun, ChevronRight, Zap, Command
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { recommendationsData } from '@/lib/recommendations-data'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'

interface VoiceCommand {
  id: string
  timestamp: Date
  command: string
  response: string
  action?: string
}

interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  isActive: boolean
  currentTranscript: string
  confidence: number
}

// Global state to stop other processes
let globalVoiceActive = false
const pausedAnimations: Set<number> = new Set()

export function GlobalVoiceAssistant() {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isActive: false,
    currentTranscript: '',
    confidence: 0
  })
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [language, setLanguage] = useState<'en-US' | 'ml-IN'>('en-US')
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [showAIChat, setShowAIChat] = useState(false)
  const [userManuallyOpened, setUserManuallyOpened] = useState(false)
  const { voiceAssistantActive, setVoiceAssistantActive } = useAppStore()
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const waveformRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  const { setActiveMenuItem, portfolioSettings, updateSettings } = useAppStore()
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage()

  // Stop other processes when voice is active
  useEffect(() => {
    if (voiceState.isListening || voiceState.isSpeaking) {
      globalVoiceActive = true
      setVoiceAssistantActive(true)
      
      // Pause all animations
      const allAnimations = document.querySelectorAll('[data-animation], [style*="animation"]')
      allAnimations.forEach((el) => {
        const htmlEl = el as HTMLElement
        if (htmlEl.style.animationPlayState !== 'paused') {
          htmlEl.style.animationPlayState = 'paused'
        }
      })
      
      // Stop any ongoing speech synthesis from other sources
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
      
      // Pause video/audio elements
      const mediaElements = document.querySelectorAll('video, audio')
      mediaElements.forEach((el) => {
        (el as HTMLVideoElement | HTMLAudioElement).pause()
      })
    } else {
      globalVoiceActive = false
      setVoiceAssistantActive(false)
      
      // Resume animations
      const allAnimations = document.querySelectorAll('[data-animation], [style*="animation"]')
      allAnimations.forEach((el) => {
        (el as HTMLElement).style.animationPlayState = 'running'
      })
    }
    
    // Update global state
    ;(window as any).isVoiceListening = voiceState.isListening
    ;(window as any).isVoiceSpeaking = voiceState.isSpeaking
    ;(window as any).globalVoiceActive = globalVoiceActive
  }, [voiceState.isListening, voiceState.isSpeaking, setVoiceAssistantActive])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true // Keep listening
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = language
    recognitionRef.current.maxAlternatives = 1

    synthesisRef.current = window.speechSynthesis

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  }, [language])

  // Waveform animation
  useEffect(() => {
    if (!voiceState.isListening || !waveformRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const canvas = waveformRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 60

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#007ACC'
      
      const bars = 20
      const barWidth = canvas.width / bars
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.1
        ctx.fillRect(i * barWidth, (canvas.height - height) / 2, barWidth - 2, height)
      }
      
      animationFrameRef.current = requestAnimationFrame(drawWaveform)
    }

    drawWaveform()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [voiceState.isListening])

  // Speak text
  const speak = useCallback((text: string) => {
    if (!synthesisRef.current || !autoSpeak) return

    synthesisRef.current.cancel()
    setVoiceState(prev => ({ ...prev, isSpeaking: true }))

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }))
    }

    utterance.onerror = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }))
    }

    synthesisRef.current.speak(utterance)
  }, [language, autoSpeak])

  // Process voice command with comprehensive action support
  const processVoiceCommand = useCallback((transcript: string): {
    response: string
    action?: () => void
    actionType?: string
  } => {
    const lower = transcript.toLowerCase()
    const context = conversationContext.join(' ').toLowerCase()

    // Navigation commands
    if (lower.includes('show projects') || lower.includes('open projects') || lower.includes('view projects')) {
      return {
        response: 'Opening projects section. You can explore all featured projects.',
        action: () => {
          setActiveMenuItem('project')
          setConversationContext(prev => [...prev, 'projects'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show skills') || lower.includes('open skills') || lower.includes('view skills')) {
      return {
        response: 'Opening skills section. You can see all technical skills.',
        action: () => {
          setActiveMenuItem('skills')
          setConversationContext(prev => [...prev, 'skills'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show experience') || lower.includes('work experience')) {
      return {
        response: `Opening work experience section.`,
        action: () => {
          setActiveMenuItem('experience')
          setConversationContext(prev => [...prev, 'experience'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show contact') || lower.includes('contact information')) {
      return {
        response: `Opening contact section.`,
        action: () => {
          setActiveMenuItem('contact')
          setConversationContext(prev => [...prev, 'contact'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show about') || lower.includes('about me')) {
      return {
        response: `Opening about section.`,
        action: () => {
          setActiveMenuItem('welcome')
          setConversationContext(prev => [...prev, 'about'])
        },
        actionType: 'navigate'
      }
    }

    // Resume commands
    if (lower.includes('download resume') || lower.includes('get resume')) {
      return {
        response: 'Downloading resume.',
        action: () => {
          const link = document.createElement('a')
          link.href = '/resume.pdf'
          link.download = `${portfolioData.profile.name}-Resume.pdf`
          link.click()
          setConversationContext(prev => [...prev, 'resume'])
        },
        actionType: 'download'
      }
    }

    // Theme switching
    if (lower.includes('switch theme') || lower.includes('change theme') || lower.includes('dark mode') || lower.includes('light mode')) {
      const newTheme = portfolioSettings.theme === 'dark' ? 'light' : 'dark'
      return {
        response: `Switching to ${newTheme} theme.`,
        action: () => {
          updateSettings({ theme: newTheme })
          setConversationContext(prev => [...prev, 'theme'])
        },
        actionType: 'settings'
      }
    }

    // Language switching
    if (lower.includes('switch language') || lower.includes('change language')) {
      const newLang = language === 'en-US' ? 'ml-IN' : 'en-US'
      return {
        response: `Switching language to ${newLang === 'ml-IN' ? 'Malayalam' : 'English'}.`,
        action: () => {
          setLanguage(newLang)
          setAppLanguage(newLang === 'ml-IN' ? 'ml' : 'en')
          if (recognitionRef.current) {
            recognitionRef.current.lang = newLang
          }
          setConversationContext(prev => [...prev, 'language'])
        },
        actionType: 'settings'
      }
    }

    // Open AI Chat
    if (lower.includes('open ai') || lower.includes('open chat') || lower.includes('ai assistant') || lower.includes('chat assistant')) {
      return {
        response: 'Opening AI chat assistant.',
        action: () => {
          setShowAIChat(true)
          // Trigger AI chat open event
          window.dispatchEvent(new CustomEvent('openChat'))
          setConversationContext(prev => [...prev, 'ai chat'])
        },
        actionType: 'ai-chat'
      }
    }

    // Contact actions
    if (lower.includes('contact') || lower.includes('email')) {
      return {
        response: `Opening contact section and email.`,
        action: () => {
          setActiveMenuItem('contact')
          window.location.href = `mailto:${portfolioData.profile.email}`
          setConversationContext(prev => [...prev, 'contact'])
        },
        actionType: 'contact'
      }
    }

    // LinkedIn
    if (lower.includes('linkedin')) {
      return {
        response: 'Opening LinkedIn profile.',
        action: () => {
          window.open(portfolioData.profile.linkedin, '_blank')
          setConversationContext(prev => [...prev, 'linkedin'])
        },
        actionType: 'external'
      }
    }

    // GitHub
    if (lower.includes('github')) {
      return {
        response: 'Opening GitHub profile.',
        action: () => {
          window.open(portfolioData.profile.github, '_blank')
          setConversationContext(prev => [...prev, 'github'])
        },
        actionType: 'external'
      }
    }

    // Help
    if (lower.includes('help') || lower.includes('what can you do') || lower.includes('commands')) {
      return {
        response: 'I can help you navigate the portfolio, show projects, skills, experience, download resume, switch themes, change languages, open AI chat, and contact. Try saying "show projects", "download resume", "open AI chat", or "contact".',
        actionType: 'help'
      }
    }

    // Default response
    return {
      response: `I heard: "${transcript}". I can help you navigate the portfolio, show projects, skills, experience, download resume, or open AI chat. Try saying "help" for available commands.`,
      actionType: 'default'
    }
  }, [conversationContext, portfolioSettings.theme, language, setActiveMenuItem, updateSettings, setAppLanguage])

  // Start listening (continuous mode)
  const startListening = useCallback(() => {
    if (!recognitionRef.current || voiceState.isListening) return

    setVoiceState(prev => ({ ...prev, isListening: true, isActive: true, currentTranscript: '' }))
    setShowPanel(true) // Always show panel when listening starts
    setUserManuallyOpened(true) // User started it, they control it

    recognitionRef.current.onstart = () => {
      setVoiceState(prev => ({ ...prev, isListening: true }))
    }

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (interimTranscript) {
        setVoiceState(prev => ({ ...prev, currentTranscript: interimTranscript }))
      }

      if (finalTranscript.trim()) {
        const result = processVoiceCommand(finalTranscript.trim())
        
        const command: VoiceCommand = {
          id: Date.now().toString(),
          timestamp: new Date(),
          command: finalTranscript.trim(),
          response: result.response,
          action: result.actionType
        }
        
        setCommandHistory(prev => [...prev, command].slice(-50))
        setVoiceState(prev => ({ ...prev, currentTranscript: '' }))

        // Execute action
        if (result.action) {
          result.action()
        }

        // Speak response
        if (autoSpeak) {
          speak(result.response)
        }
        
        // Show panel when command is processed to show the response
        setShowPanel(true)
        // Keep panel open for continuous Q&A - don't auto-close
        // User controls when to close via stop button
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Recognition error:', event.error)
      setVoiceState(prev => ({ ...prev, isListening: false }))
      if (autoSpeak) {
        speak('Sorry, I encountered an error. Please try again.')
      }
    }

    recognitionRef.current.onend = () => {
      // Auto-restart continuously if still active (continuous listening mode)
      if (voiceState.isActive && !voiceState.isSpeaking) {
        try {
          // Small delay before restarting for continuous listening
          setTimeout(() => {
            if (voiceState.isActive && recognitionRef.current) {
              recognitionRef.current.start()
            }
          }, 100)
        } catch (e) {
          // Already started or error - try again
          if (voiceState.isActive) {
            setTimeout(() => {
              if (voiceState.isActive && recognitionRef.current) {
                try {
                  recognitionRef.current.start()
                } catch (err) {
                  console.error('Failed to restart recognition:', err)
                }
              }
            }, 500)
          }
        }
      } else {
        setVoiceState(prev => ({ ...prev, isListening: false }))
      }
    }

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setVoiceState(prev => ({ ...prev, isListening: false }))
    }
  }, [voiceState.isListening, voiceState.isActive, voiceState.isSpeaking, processVoiceCommand, autoSpeak, speak])

  // Stop listening (explicit stop)
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current.abort() // Abort to prevent auto-restart
    }
    setVoiceState(prev => ({ ...prev, isListening: false, isActive: false, currentTranscript: '' }))
    setShowPanel(false) // Close panel when stopped
    setUserManuallyOpened(false)
  }, [])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (voiceState.isListening) {
      stopListening()
      setShowPanel(false) // Hide panel when stopping
      setUserManuallyOpened(false)
    } else {
      startListening()
      setShowPanel(true) // Show panel when starting
      setUserManuallyOpened(true) // User manually opened - they control when to close
    }
  }, [voiceState.isListening, startListening, stopListening])
  
  // Auto-show panel when voice is active (for interim transcripts while listening)
  // But respect user's manual close decision
  useEffect(() => {
    if (voiceState.isListening && voiceState.currentTranscript) {
      setShowPanel(true)
    }
  }, [voiceState.isListening, voiceState.currentTranscript])

  return (
    <>
      {/* Always-visible floating button */}
      <motion.button
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          voiceState.isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-vscode-blue hover:bg-vscode-blue/80 text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={voiceState.isListening ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 1, repeat: voiceState.isListening ? Infinity : 0 }}
        aria-label="Voice Assistant"
      >
        {voiceState.isListening ? (
          <MicOff size={24} />
        ) : (
          <Mic size={24} />
        )}
      </motion.button>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[99] w-80 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl p-4"
          >

            {/* Waveform */}
            {voiceState.isListening && (
              <div className="mb-4">
                <canvas ref={waveformRef} className="w-full h-12" />
              </div>
            )}

            {/* Transcript */}
            {voiceState.currentTranscript && (
              <div className="mb-4 p-3 bg-vscode-active rounded text-sm text-vscode-text-secondary">
                {voiceState.currentTranscript}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-2 text-vscode-text-secondary">
                {voiceState.isListening && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening continuously...
                  </span>
                )}
                {voiceState.isSpeaking && (
                  <span className="flex items-center gap-1">
                    <Volume2 size={12} />
                    Speaking...
                  </span>
                )}
                {!voiceState.isListening && !voiceState.isSpeaking && (
                  <span className="text-vscode-text-secondary">Click mic button to start</span>
                )}
              </div>
              {voiceState.isListening && (
                <button
                  onClick={stopListening}
                  className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors flex items-center gap-1"
                >
                  <MicOff size={12} />
                  Stop
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowAIChat(true)
                  window.dispatchEvent(new CustomEvent('openChat'))
                }}
                className="px-3 py-1.5 text-xs bg-vscode-blue/20 hover:bg-vscode-blue/30 rounded transition-colors flex items-center gap-1"
              >
                <MessageSquare size={12} />
                AI Chat
              </button>
              <button
                onClick={() => setActiveMenuItem('project')}
                className="px-3 py-1.5 text-xs bg-vscode-blue/20 hover:bg-vscode-blue/30 rounded transition-colors flex items-center gap-1"
              >
                <Briefcase size={12} />
                Projects
              </button>
              <button
                onClick={() => setActiveMenuItem('skills')}
                className="px-3 py-1.5 text-xs bg-vscode-blue/20 hover:bg-vscode-blue/30 rounded transition-colors flex items-center gap-1"
              >
                <Code size={12} />
                Skills
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-24 right-96 z-[99] w-80 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-vscode-text">Command History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 hover:bg-vscode-active rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {commandHistory.slice().reverse().map((cmd) => (
                <div key={cmd.id} className="p-2 bg-vscode-active rounded text-xs">
                  <div className="text-vscode-text-secondary mb-1">{cmd.command}</div>
                  <div className="text-vscode-text">{cmd.response}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

