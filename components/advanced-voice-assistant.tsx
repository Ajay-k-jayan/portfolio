'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, MicOff, Volume2, X, History, Settings,
  Download, FileText, Briefcase, Code, Mail, Globe,
  Moon, Sun, ChevronRight, Sparkles
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { recommendationsData } from '@/lib/recommendations-data'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'
import { voiceAssistant } from '@/lib/voice-assistant-enhanced'
import { aiAnalytics } from '@/lib/ai-analytics'

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

export function AdvancedVoiceAssistant() {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isActive: false,
    currentTranscript: '',
    confidence: 0
  })
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [language, setLanguage] = useState<'en-US' | 'ml-IN'>('en-US')
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const waveformRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  const { setActiveMenuItem, portfolioSettings, updateSettings } = useAppStore()
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
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
    if (!voiceState.isListening || !waveformRef.current) return

    const canvas = waveformRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#007ACC'
      
      const bars = 20
      const barWidth = canvas.width / bars
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.1
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height)
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

  // Process voice command with NLP
  const processVoiceCommand = useCallback((transcript: string): {
    response: string
    action?: () => void
    actionType?: string
  } => {
    const lower = transcript.toLowerCase()
    const context = conversationContext.join(' ').toLowerCase()

    // Track analytics
    aiAnalytics.trackInteraction({
      type: 'voice',
      data: {
        query: transcript,
        intent: undefined
      }
    })

    // Navigation commands
    if (lower.includes('show projects') || lower.includes('open projects') || lower.includes('view projects')) {
      return {
        response: 'Opening projects section. You can explore all featured projects including Aurex and other portfolio work.',
        action: () => {
          setActiveMenuItem('project')
          setConversationContext(prev => [...prev, 'projects'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show skills') || lower.includes('open skills') || lower.includes('view skills') || lower.includes('technical skills')) {
      return {
        response: 'Opening skills section. You can see all technical skills including Angular, Next.js, Tailwind CSS, RxJS, and more.',
        action: () => {
          setActiveMenuItem('skills')
          setConversationContext(prev => [...prev, 'skills'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show experience') || lower.includes('work experience') || lower.includes('career')) {
      return {
        response: `Opening work experience section. ${portfolioData.profile.name} has ${portfolioData.profile.experience} of experience, currently working as ${portfolioData.profile.title} at ${portfolioData.profile.company}.`,
        action: () => {
          setActiveMenuItem('experience')
          setConversationContext(prev => [...prev, 'experience'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show contact') || lower.includes('contact information') || lower.includes('how to contact')) {
      return {
        response: `Opening contact section. You can reach ${portfolioData.profile.name} at ${portfolioData.profile.email} or phone ${portfolioData.profile.phone}. LinkedIn and GitHub profiles are also available.`,
        action: () => {
          setActiveMenuItem('contact')
          setConversationContext(prev => [...prev, 'contact'])
        },
        actionType: 'navigate'
      }
    }

    if (lower.includes('show about') || lower.includes('about me') || lower.includes('who are you') || lower.includes('introduce')) {
      return {
        response: `${portfolioData.profile.name} is a ${portfolioData.profile.title} with ${portfolioData.profile.experience} of experience. ${portfolioData.profile.bio} Specializes in ${portfolioData.profile.subtitle}.`,
        action: () => {
          setActiveMenuItem('welcome')
          setConversationContext(prev => [...prev, 'about'])
        },
        actionType: 'navigate'
      }
    }

    // Resume commands
    if (lower.includes('download resume') || lower.includes('get resume') || lower.includes('read resume') || lower.includes('show resume')) {
      return {
        response: 'Downloading resume. The resume includes complete work experience, technical skills, certifications, and educational background.',
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

    // Project details
    if (lower.includes('aurex') || (context.includes('project') && lower.includes('details'))) {
      const project = portfolioData.projects[0]
      return {
        response: `${project.name} is a ${project.description}. It was developed using ${project.technologies?.join(', ')}. The project period is ${project.period}. Would you like to know more about specific technologies or features?`,
        action: () => {
          setActiveMenuItem('project')
          setConversationContext(prev => [...prev, 'aurex'])
        },
        actionType: 'navigate'
      }
    }

    // Skills details
    if (lower.includes('angular') || lower.includes('next.js') || lower.includes('tailwind') || lower.includes('rxjs')) {
      const tech = lower.includes('angular') ? 'Angular' : 
                   lower.includes('next.js') ? 'Next.js' : 
                   lower.includes('tailwind') ? 'Tailwind CSS' : 'RxJS'
      return {
        response: `${tech} is a core technology in the portfolio. ${tech === 'Angular' ? 'Used for building component-based frontend applications with TypeScript.' : tech === 'Next.js' ? 'Used for full-stack React applications with server-side rendering.' : tech === 'Tailwind CSS' ? 'Used for utility-first styling and responsive design.' : 'Used for reactive programming and state management.'} Multiple projects utilize ${tech}.`,
        action: () => {
          setActiveMenuItem('skills')
          setConversationContext(prev => [...prev, tech.toLowerCase()])
        },
        actionType: 'navigate'
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
    if (lower.includes('switch language') || lower.includes('change language') || lower.includes('malayalam') || lower.includes('english')) {
      const newLang = language === 'en-US' ? 'ml-IN' : 'en-US'
      return {
        response: `Switching language to ${newLang === 'ml-IN' ? 'Malayalam' : 'English'}.`,
        action: () => {
          setLanguage(newLang)
          if (recognitionRef.current) {
            recognitionRef.current.lang = newLang
          }
          setConversationContext(prev => [...prev, 'language'])
        },
        actionType: 'settings'
      }
    }

    // Testimonials
    if (lower.includes('testimonial') || lower.includes('recommendation') || lower.includes('review')) {
      return {
        response: `There are ${recommendationsData.length} professional recommendations from colleagues and collaborators. These highlight expertise in Angular development, problem-solving abilities, and collaborative approach. Would you like to read specific testimonials?`,
        action: () => {
          setActiveMenuItem('recommendations')
          setConversationContext(prev => [...prev, 'testimonials'])
        },
        actionType: 'navigate'
      }
    }

    // Achievements
    if (lower.includes('achievement') || lower.includes('award') || lower.includes('certification')) {
      return {
        response: `${portfolioData.profile.name} has ${portfolioData.achievements.length} awards including the Beinex Excelencia Award, and ${portfolioData.certifications.length} professional certifications from platforms like Coursera and Meta.`,
        action: () => {
          setActiveMenuItem('achievement')
          setConversationContext(prev => [...prev, 'achievements'])
        },
        actionType: 'navigate'
      }
    }

    // Contact actions
    if (lower.includes('contact ajay') || lower.includes('email ajay') || lower.includes('reach out')) {
      return {
        response: `You can contact ${portfolioData.profile.name} via email at ${portfolioData.profile.email}, phone at ${portfolioData.profile.phone}, or connect on LinkedIn. Opening contact section.`,
        action: () => {
          setActiveMenuItem('contact')
          window.location.href = `mailto:${portfolioData.profile.email}`
          setConversationContext(prev => [...prev, 'contact'])
        },
        actionType: 'contact'
      }
    }

    // LinkedIn
    if (lower.includes('linkedin') || lower.includes('linked in')) {
      return {
        response: 'Opening LinkedIn profile in a new tab.',
        action: () => {
          window.open(portfolioData.profile.linkedin, '_blank')
          setConversationContext(prev => [...prev, 'linkedin'])
        },
        actionType: 'external'
      }
    }

    // GitHub
    if (lower.includes('github') || lower.includes('git hub')) {
      return {
        response: 'Opening GitHub profile in a new tab.',
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
        response: 'I can help you navigate the portfolio, show projects, skills, experience, download resume, switch themes, change languages, and provide information about the portfolio. Try saying "show projects", "download resume", or "contact Ajay".',
        actionType: 'help'
      }
    }

    // Default response with context awareness
    if (conversationContext.length > 0) {
      const lastContext = conversationContext[conversationContext.length - 1]
      return {
        response: `I understand you're asking about "${transcript}". Based on our conversation about ${lastContext}, would you like me to show more details or navigate to that section?`,
        actionType: 'clarify'
      }
    }

    return {
      response: `I heard: "${transcript}". I can help you navigate the portfolio, show projects, skills, experience, download resume, or provide information. Try saying "show projects" or "help" for available commands.`,
      actionType: 'default'
    }
  }, [conversationContext, portfolioSettings.theme, language, setActiveMenuItem, updateSettings])

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || voiceState.isListening) return

    setVoiceState(prev => ({ ...prev, isListening: true, currentTranscript: '' }))

    recognitionRef.current.onstart = () => {
      setVoiceState(prev => ({ ...prev, isListening: true }))
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const confidence = event.results[0][0].confidence || 0.8
      
      setVoiceState(prev => ({
        ...prev,
        currentTranscript: transcript,
        confidence
      }))

      if (event.results[0].isFinal) {
        const result = processVoiceCommand(transcript)
        
        const command: VoiceCommand = {
          id: Date.now().toString(),
          timestamp: new Date(),
          command: transcript,
          response: result.response,
          action: result.actionType
        }
        
        setCommandHistory(prev => [...prev, command].slice(-20))
        setVoiceState(prev => ({ ...prev, isListening: false, currentTranscript: '' }))

        // Execute action
        if (result.action) {
          result.action()
        }

        // Speak response
        if (autoSpeak && synthesisRef.current) {
          speak(result.response)
        }
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
      setVoiceState(prev => ({ ...prev, isListening: false }))
    }

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setVoiceState(prev => ({ ...prev, isListening: false }))
    }
  }, [voiceState.isListening, processVoiceCommand, autoSpeak])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop()
      setVoiceState(prev => ({ ...prev, isListening: false, currentTranscript: '' }))
    }
  }, [voiceState.isListening])

  // Speak text
  const speak = useCallback((text: string) => {
    if (!synthesisRef.current) return

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
  }, [language])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setVoiceState(prev => ({ ...prev, isSpeaking: false }))
    }
  }, [])

  // Toggle voice assistant
  const toggleAssistant = () => {
    const newState = !voiceState.isActive
    setVoiceState(prev => ({ ...prev, isActive: newState }))
    
    if (!newState) {
      stopListening()
      stopSpeaking()
    }
  }

  if (!voiceState.isActive) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 w-16 h-16 bg-vscode-blue rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-blue-600 transition-colors"
        aria-label="Activate Voice Assistant"
        title="Activate Voice Assistant"
      >
        <Mic className="text-white" size={24} />
      </motion.button>
    )
  }

  return (
    <>
      {/* Floating Voice Assistant */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl overflow-hidden w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-vscode-border bg-vscode-active">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${voiceState.isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs font-semibold text-vscode-text">Voice Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
                aria-label="Command History"
              >
                <History size={14} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
                aria-label="Settings"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={toggleAssistant}
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
                aria-label="Close Voice Assistant"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-4">
            {/* Waveform/Mic Display */}
            <div className="flex items-center justify-center h-24 bg-vscode-active rounded-lg relative overflow-hidden">
              {voiceState.isListening ? (
                <canvas
                  ref={waveformRef}
                  width={200}
                  height={80}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Mic className={`text-vscode-text-secondary ${voiceState.isSpeaking ? 'animate-pulse' : ''}`} size={32} />
                  <span className="text-xs text-vscode-text-secondary">
                    {voiceState.isSpeaking ? 'Speaking...' : 'Click to speak'}
                  </span>
                </div>
              )}
            </div>

            {/* Current Transcript */}
            {voiceState.currentTranscript && (
              <div className="bg-vscode-active rounded p-2">
                <p className="text-xs text-vscode-text-secondary mb-1">Listening:</p>
                <p className="text-sm text-vscode-text">{voiceState.currentTranscript}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={voiceState.isListening ? stopListening : startListening}
                disabled={voiceState.isSpeaking}
                className={`flex-1 px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                  voiceState.isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-vscode-blue hover:bg-blue-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={voiceState.isListening ? 'Stop Listening' : 'Start Listening'}
              >
                {voiceState.isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="text-sm font-medium">
                  {voiceState.isListening ? 'Stop' : 'Listen'}
                </span>
              </button>
              {voiceState.isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 bg-vscode-active hover:bg-vscode-hover text-vscode-text rounded transition-colors"
                  aria-label="Stop Speaking"
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>

            {/* Quick Commands */}
            <div className="space-y-1">
              <p className="text-xs text-vscode-text-secondary mb-2">Quick Commands:</p>
              <div className="flex flex-wrap gap-1">
                {['Show Projects', 'Download Resume', 'Contact Ajay', 'Switch Theme'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => {
                      const result = processVoiceCommand(cmd.toLowerCase())
                      if (result.action) {
                        result.action()
                      }
                      if (autoSpeak && synthesisRef.current) {
                        speak(result.response)
                      }
                    }}
                    className="text-xs px-2 py-1 bg-vscode-active hover:bg-vscode-hover text-vscode-text-secondary hover:text-vscode-text rounded border border-vscode-border transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Command History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-vscode-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-vscode-text">Command History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-vscode-hover rounded"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
                {commandHistory.length === 0 ? (
                  <p className="text-sm text-vscode-text-secondary text-center py-8">
                    No commands yet. Start using voice commands to see history.
                  </p>
                ) : (
                  commandHistory.slice().reverse().map((cmd) => (
                    <div key={cmd.id} className="bg-vscode-active rounded p-3 border border-vscode-border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-vscode-text font-medium">{cmd.command}</p>
                        <span className="text-xs text-vscode-text-secondary">
                          {cmd.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-vscode-text-secondary">{cmd.response}</p>
                      {cmd.action && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-vscode-blue/20 text-vscode-blue rounded">
                          {cmd.action}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl w-full max-w-md"
            >
              <div className="p-4 border-b border-vscode-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-vscode-text">Voice Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-vscode-hover rounded"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-vscode-text-secondary mb-2 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value as 'en-US' | 'ml-IN')
                      if (recognitionRef.current) {
                        recognitionRef.current.lang = e.target.value
                      }
                    }}
                    className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="ml-IN">Malayalam</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-vscode-text-secondary">Auto-speak responses</label>
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoSpeak ? 'bg-vscode-blue' : 'bg-vscode-active'
                    } relative`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      autoSpeak ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="pt-2 border-t border-vscode-border">
                  <p className="text-xs text-vscode-text-secondary">
                    Privacy: All voice processing happens locally in your browser. No data is sent to external servers.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

