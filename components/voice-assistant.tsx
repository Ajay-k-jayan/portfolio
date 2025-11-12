'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, X, Volume2, CheckCircle, History, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { portfolioData } from '@/lib/portfolio-data'
import { recommendationsData } from '@/lib/recommendations-data'
import { aiAnalytics } from '@/lib/ai-analytics'
import { useLanguage } from '@/contexts/language-context'

interface VoiceCommand {
  id: string
  timestamp: Date
  command: string
  response: string
  action?: string
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [showListeningPanel, setShowListeningPanel] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [autoSpeak, setAutoSpeak] = useState(true)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const { setActiveMenuItem, addNotification, toggleSidebar, portfolioSettings, updateSettings } = useAppStore()
  const { language, setLanguage } = useLanguage()

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis
    }
  }, [])


  // Speak text
  const speak = useCallback((text: string) => {
    if (!synthesisRef.current || !autoSpeak) return

    synthesisRef.current.cancel()
    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    synthesisRef.current.speak(utterance)
  }, [language, autoSpeak])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const handleVoiceCommand = useCallback((command: string) => {
    const lower = command.toLowerCase().trim()
    setLastCommand(command)
    
    // Track analytics
    aiAnalytics.trackInteraction({
      type: 'voice',
      data: {
        query: command,
        intent: undefined
      }
    })

    let response = ''
    let actionType = ''

    // Navigation commands
    if (lower.includes('open') || lower.includes('show') || lower.includes('go to') || lower.includes('view')) {
      if (lower.includes('project') || lower.includes('projects')) {
        setActiveMenuItem('project')
        response = 'Opening projects section. You can explore all featured projects including Aurex and other portfolio work.'
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'projects'])
      } else if (lower.includes('skill') || lower.includes('skills') || lower.includes('technical skills')) {
        setActiveMenuItem('skills')
        response = 'Opening skills section. You can see all technical skills including Angular, Next.js, Tailwind CSS, RxJS, and more.'
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'skills'])
      } else if (lower.includes('experience') || lower.includes('work') || lower.includes('career')) {
        setActiveMenuItem('experience')
        response = `Opening work experience section. ${portfolioData.profile.name} has ${portfolioData.profile.experience} of experience, currently working as ${portfolioData.profile.title} at ${portfolioData.profile.company}.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'experience'])
      } else if (lower.includes('about') || lower.includes('welcome') || lower.includes('who are you') || lower.includes('introduce')) {
        setActiveMenuItem('welcome')
        response = `${portfolioData.profile.name} is a ${portfolioData.profile.title} with ${portfolioData.profile.experience} of experience. ${portfolioData.profile.bio}`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'about'])
      } else if (lower.includes('blog') || lower.includes('blogs')) {
        setActiveMenuItem('blogs')
        response = 'Opening blog section.'
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'blogs'])
      } else if (lower.includes('contact') || lower.includes('contact information') || lower.includes('how to contact')) {
        setActiveMenuItem('contact')
        response = `Opening contact section. You can reach ${portfolioData.profile.name} at ${portfolioData.profile.email} or phone ${portfolioData.profile.phone}.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'contact'])
      } else if (lower.includes('achievement') || lower.includes('achievements') || lower.includes('award')) {
        setActiveMenuItem('achievement')
        response = `${portfolioData.profile.name} has ${portfolioData.achievements.length} awards including the Beinex Excelencia Award, and ${portfolioData.certifications.length} professional certifications.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'achievements'])
      } else if (lower.includes('certification') || lower.includes('certifications')) {
        setActiveMenuItem('certifications')
        response = `Opening certifications section. There are ${portfolioData.certifications.length} professional certifications.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'certifications'])
      } else if (lower.includes('recommendation') || lower.includes('recommendations') || lower.includes('testimonial')) {
        setActiveMenuItem('recommendation')
        response = `Opening recommendations section. There are ${recommendationsData.length} professional recommendations from colleagues and collaborators.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'recommendations'])
      } else if (lower.includes('setting') || lower.includes('settings')) {
        setActiveMenuItem('settings')
        response = 'Opening settings section.'
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'settings'])
      } else {
        response = `Command recognized: "${command}". Try: "Open projects", "Show skills", "Go to contact"`
        actionType = 'info'
      }
    } else if (lower.includes('download resume') || lower.includes('get resume') || lower.includes('read resume') || lower.includes('show resume')) {
      response = 'Downloading resume. The resume includes complete work experience, technical skills, certifications, and educational background.'
      actionType = 'download'
      const link = document.createElement('a')
      link.href = '/resume.pdf'
      link.download = `${portfolioData.profile.name}-Resume.pdf`
      link.click()
      setConversationContext(prev => [...prev, 'resume'])
    } else if (lower.includes('contact ajay') || lower.includes('email ajay') || lower.includes('reach out')) {
      response = `You can contact ${portfolioData.profile.name} via email at ${portfolioData.profile.email}, phone at ${portfolioData.profile.phone}, or connect on LinkedIn.`
      actionType = 'contact'
      setActiveMenuItem('contact')
      window.location.href = `mailto:${portfolioData.profile.email}`
      setConversationContext(prev => [...prev, 'contact'])
    } else if (lower.includes('linkedin') || lower.includes('linked in')) {
      response = 'Opening LinkedIn profile in a new tab.'
      actionType = 'external'
      window.open(portfolioData.profile.linkedin, '_blank')
      setConversationContext(prev => [...prev, 'linkedin'])
    } else if (lower.includes('github') || lower.includes('git hub')) {
      response = 'Opening GitHub profile in a new tab.'
      actionType = 'external'
      window.open(portfolioData.profile.github, '_blank')
      setConversationContext(prev => [...prev, 'github'])
    } else if (lower.includes('aurex') || (conversationContext.includes('project') && (lower.includes('details') || lower.includes('about') || lower.includes('tell me')))) {
      const project = portfolioData.projects[0]
      response = `${project.name} is a ${project.description}. It was developed using ${project.technologies?.join(', ')} during ${project.period}. Key features include cloud-based analytics platform, risk and audit management integration, real-time data processing with WebSockets, advanced reporting capabilities, and responsive UI with Angular Material. The project solved challenges in data visualization, real-time communication, and performance optimization. Would you like to know more about specific technologies, features, challenges, or outcomes?`
      actionType = 'navigate'
      setActiveMenuItem('project')
      setConversationContext(prev => [...prev, 'aurex'])
    } else if (lower.includes('project') && (lower.includes('challenge') || lower.includes('problem') || lower.includes('difficult'))) {
      response = 'The main challenges solved in the projects include implementing complex data visualizations using D3.js, building real-time communication with WebSockets, creating modular components for maintainability, optimizing performance with lazy loading, and developing custom reporting logic. These solutions improved efficiency and user experience significantly.'
      actionType = 'info'
      setConversationContext(prev => [...prev, 'challenges'])
    } else if (lower.includes('project') && (lower.includes('feature') || lower.includes('capability') || lower.includes('function'))) {
      const project = portfolioData.projects[0]
      response = `Key features of ${project.name} include cloud-based analytics platform, integrated risk and audit management, real-time data processing with WebSockets, advanced reporting with custom data fields, responsive UI with Angular Material, interactive data visualizations using D3.js, modular reusable components, and performance optimizations including lazy loading and caching.`
      actionType = 'info'
      setConversationContext(prev => [...prev, 'features'])
    } else if (lower.includes('project') && (lower.includes('outcome') || lower.includes('impact') || lower.includes('result'))) {
      response = 'Project outcomes include successfully delivering a production-ready cloud-based platform, improving data processing efficiency, enhancing user experience with responsive design, and contributing to company growth through innovative solutions. The platform streamlined workflows and provided real-time insights.'
      actionType = 'info'
      setConversationContext(prev => [...prev, 'outcomes'])
    } else if (lower.includes('project') && (lower.includes('technology') || lower.includes('tech stack') || lower.includes('stack'))) {
      const project = portfolioData.projects[0]
      response = `The technology stack for ${project.name} includes ${project.technologies?.join(', ')}. Angular is used for component-based architecture, TypeScript for type-safe development, D3.js for data visualizations, and WebSockets for real-time communication. Each technology plays a crucial role in the platform's functionality.`
      actionType = 'info'
      setConversationContext(prev => [...prev, 'technologies'])
    } else if (lower.includes('angular') || lower.includes('next.js') || lower.includes('tailwind') || lower.includes('rxjs')) {
      const tech = lower.includes('angular') ? 'Angular' : 
                   lower.includes('next.js') ? 'Next.js' : 
                   lower.includes('tailwind') ? 'Tailwind CSS' : 'RxJS'
      response = `${tech} is a core technology in the portfolio. Multiple projects utilize ${tech}.`
      actionType = 'navigate'
      setActiveMenuItem('skills')
      setConversationContext(prev => [...prev, tech.toLowerCase()])
    } else if (lower.includes('switch theme') || lower.includes('change theme') || lower.includes('dark mode') || lower.includes('light mode')) {
      const newTheme = portfolioSettings.theme === 'dark' ? 'light' : 'dark'
      response = `Switching to ${newTheme} theme.`
      actionType = 'settings'
      updateSettings({ theme: newTheme })
      setConversationContext(prev => [...prev, 'theme'])
    } else if (lower.includes('switch language') || lower.includes('change language') || lower.includes('malayalam') || lower.includes('english')) {
      const newLang = language === 'en-US' ? 'ml-IN' : 'en-US'
      response = `Switching language to ${newLang === 'ml-IN' ? 'Malayalam' : 'English'}.`
      actionType = 'settings'
      setLanguage(newLang as any)
      if (recognitionRef.current) {
        recognitionRef.current.lang = newLang
      }
      setConversationContext(prev => [...prev, 'language'])
    } else if (lower.includes('close') || lower.includes('hide') || lower.includes('toggle')) {
      if (lower.includes('sidebar')) {
        toggleSidebar()
        response = 'Toggling sidebar.'
        actionType = 'toggle'
      }
    } else if (lower.includes('help') || lower.includes('what can you do') || lower.includes('commands')) {
      response = 'I can help you navigate the portfolio, show projects, skills, experience, download resume, switch themes, change languages, and provide information. Try saying "show projects", "download resume", or "contact Ajay".'
      actionType = 'help'
    } else {
      // Context-aware default response
      if (conversationContext.length > 0) {
        const lastContext = conversationContext[conversationContext.length - 1]
        response = `I understand you're asking about "${command}". Based on our conversation about ${lastContext}, would you like me to show more details?`
      } else {
        response = `I heard: "${command}". I can help you navigate the portfolio, show projects, skills, experience, download resume, or provide information. Try saying "show projects" or "help" for available commands.`
      }
      actionType = 'default'
    }

    // Save command to history
    const voiceCommand: VoiceCommand = {
      id: Date.now().toString(),
      timestamp: new Date(),
      command: command,
      response: response,
      action: actionType
    }
    setCommandHistory(prev => [...prev, voiceCommand].slice(-20))

    // Show notification
    addNotification({
      title: 'Voice Command',
      message: response,
      type: actionType === 'navigate' || actionType === 'download' ? 'success' : 'info'
    })

    // Speak response
    if (autoSpeak) {
      speak(response)
    }
  }, [setActiveMenuItem, addNotification, toggleSidebar, portfolioSettings.theme, language, conversationContext, autoSpeak, speak, updateSettings, setLanguage])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = language
        recognitionRef.current.maxAlternatives = 1

        recognitionRef.current.onresult = (event: any) => {
          let interim = ''
          let final = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript + ' '
            } else {
              interim += transcript
            }
          }
          
          if (interim) {
            setInterimTranscript(interim)
          }
          
          if (final.trim()) {
            setInterimTranscript('')
            setTranscript(final.trim())
            handleVoiceCommand(final.trim())
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          setShowListeningPanel(false)
          setInterimTranscript('')
          
          let errorMessage = 'Voice recognition error'
          if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please try again.'
          } else if (event.error === 'not-allowed') {
            errorMessage = 'Microphone permission denied. Please allow microphone access.'
          } else if (event.error === 'network') {
            errorMessage = 'Network error. Please check your connection.'
          } else if (event.error === 'aborted') {
            // User stopped, don't show error
            return
          }
          
          addNotification({
            title: 'Voice Assistant Error',
            message: errorMessage,
            type: 'error'
          })
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          // Keep panel open for a moment to show final result
          setTimeout(() => {
            setShowListeningPanel(false)
            setInterimTranscript('')
          }, 2000)
        }

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setShowListeningPanel(true)
          setTranscript('')
          setInterimTranscript('')
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    }
  }, [handleVoiceCommand, addNotification])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      addNotification({
        title: 'Voice Assistant',
        message: 'Voice recognition not supported in your browser.',
        type: 'error'
      })
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      setShowListeningPanel(true)
      setTranscript('')
      setInterimTranscript('')
      setLastCommand(null)
    } catch (error: any) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
      setShowListeningPanel(false)
      if (error.message?.includes('already started')) {
        // Recognition already running, just update state
        setIsListening(true)
        setShowListeningPanel(true)
      } else {
        addNotification({
          title: 'Voice Assistant Error',
          message: 'Failed to start voice recognition. Please try again.',
          type: 'error'
        })
      }
    }
  }, [addNotification])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore stop errors
      }
    }
    setIsListening(false)
    setShowListeningPanel(false)
    setInterimTranscript('')
  }, [isListening])

  // Expose trigger function and state to parent
  useEffect(() => {
    ;(window as any).triggerVoiceAssistant = () => {
      if (!isListening) {
        startListening()
      } else {
        stopListening()
      }
    }
    ;(window as any).isVoiceListening = isListening
    return () => {
      delete (window as any).triggerVoiceAssistant
      delete (window as any).isVoiceListening
    }
  }, [isListening, startListening, stopListening])

  return (
    <>
      {/* Circular 3D Voice Assistant Panel */}
      <AnimatePresence>
        {showListeningPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-[99]"
            style={{ perspective: '1000px' }}
          >
            {/* Main Circular Container with 3D Effect */}
            <div 
              className="relative w-80 h-80 md:w-96 md:h-96"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Outer Glow Ring */}
              {isListening && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2"
                      style={{
                        borderColor: `rgba(239, 68, 68, ${0.3 - i * 0.1})`,
                        boxShadow: `0 0 ${20 + i * 10}px rgba(239, 68, 68, ${0.4 - i * 0.1})`,
                      }}
                      animate={{
                        scale: [1, 1.2 + i * 0.1, 1],
                        opacity: [0.6, 0.2, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </>
              )}

              {/* Glassmorphism Background Circle */}
              <div
                className="absolute inset-0 rounded-full backdrop-blur-xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: `
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.05)
                  `,
                  transform: 'translateZ(0)',
                }}
              />

              {/* 3D Inner Circle with Depth */}
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  background: isListening
                    ? 'radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.2), rgba(30, 30, 30, 0.8))'
                    : 'radial-gradient(circle at 30% 30%, rgba(0, 122, 204, 0.2), rgba(30, 30, 30, 0.8))',
                  boxShadow: `
                    inset 0 2px 10px rgba(0, 0, 0, 0.5),
                    inset 0 -2px 10px rgba(255, 255, 255, 0.05),
                    0 10px 30px rgba(0, 0, 0, 0.3)
                  `,
                  transform: 'translateZ(20px)',
                }}
              />

              {/* Central 3D Microphone Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking && !isListening}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center cursor-pointer group"
                  style={{
                    background: isListening
                      ? 'radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9))'
                      : 'radial-gradient(circle at 30% 30%, rgba(0, 122, 204, 0.9), rgba(0, 80, 160, 0.9))',
                    boxShadow: isListening
                      ? `
                        0 0 40px rgba(239, 68, 68, 0.6),
                        0 10px 30px rgba(0, 0, 0, 0.4),
                        inset 0 2px 10px rgba(255, 255, 255, 0.2),
                        inset 0 -2px 10px rgba(0, 0, 0, 0.3)
                      `
                      : `
                        0 10px 30px rgba(0, 0, 0, 0.4),
                        inset 0 2px 10px rgba(255, 255, 255, 0.2),
                        inset 0 -2px 10px rgba(0, 0, 0, 0.3)
                      `,
                    transform: 'translateZ(40px)',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 40px rgba(239, 68, 68, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)',
                      '0 0 60px rgba(239, 68, 68, 0.8), 0 15px 40px rgba(0, 0, 0, 0.5)',
                      '0 0 40px rgba(239, 68, 68, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)',
                    ],
                  } : {}}
                  transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                >
                  {/* Inner Highlight */}
                  <div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)',
                      opacity: 0.6,
                    }}
                  />

                  {/* Microphone Icon */}
                  <motion.div
                    className="relative z-10"
                    animate={isListening ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
                  >
                    {isListening ? (
                      <Mic className="text-white" size={48} strokeWidth={2} />
                    ) : (
                      <Mic className="text-white" size={48} strokeWidth={2} />
                    )}
                  </motion.div>

                  {/* Pulsing Dot */}
                  {isListening && (
                    <motion.div
                      className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                      }}
                    />
                  )}
                </motion.button>
              </div>

              {/* Status Text - Floating Around Circle */}
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-sm font-semibold text-white mb-1 drop-shadow-lg">
                  {isListening ? 'Listening...' : 'Voice Assistant'}
                </h3>
                <p className="text-xs text-gray-300 drop-shadow-md">
                  {isListening ? 'Speak your command' : 'Ready to listen'}
                </p>
              </motion.div>

              {/* Transcript Display - Floating Below */}
              {(transcript || interimTranscript) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 z-20"
                >
                  <div
                    className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10"
                    style={{
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {transcript ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <CheckCircle size={12} />
                          <span>Recognized</span>
                        </div>
                        <p className="text-sm text-white font-medium">{transcript}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-blue-400">
                          <Volume2 size={12} />
                          <span>Listening...</span>
                        </div>
                        <p className="text-sm text-white italic">{interimTranscript}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Control Buttons - Floating Around */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                <motion.button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  aria-label="Command History"
                >
                  <History size={14} />
                </motion.button>
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  aria-label="Settings"
                >
                  <Settings size={14} />
                </motion.button>
                {isSpeaking && (
                  <motion.button
                    onClick={stopSpeaking}
                    className="px-3 py-1.5 text-xs bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-black/60 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Stop
                  </motion.button>
                )}
                <motion.button
                  onClick={stopListening}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  aria-label="Close"
                >
                  <X size={14} />
                </motion.button>
              </div>

              {/* Command Examples - Floating Cards */}
              {!transcript && !interimTranscript && !isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -left-32 top-1/2 -translate-y-1/2 z-20"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-white/60 mb-2">Try saying:</p>
                    {['Open projects', 'Show skills', 'Go to contact'].map((cmd, idx) => (
                      <motion.button
                        key={cmd}
                        onClick={() => {
                          setTranscript(cmd)
                          handleVoiceCommand(cmd)
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="block w-full px-3 py-2 text-xs bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-lg hover:bg-black/60 transition-all text-left"
                        whileHover={{ scale: 1.05, x: 5 }}
                        style={{
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {cmd}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center"
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
                      setLanguage(e.target.value as any)
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
