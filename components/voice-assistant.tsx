'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, X, Volume2, CheckCircle } from 'lucide-react'
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
        response = `Opening work experience section. ${portfolioData?.profile?.name || 'The developer'} has ${portfolioData?.profile?.experience || 'extensive'} of experience, currently working as ${portfolioData?.profile?.title || 'Developer'} at ${portfolioData?.profile?.company || 'their company'}.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'experience'])
      } else if (lower.includes('about') || lower.includes('welcome') || lower.includes('who are you') || lower.includes('introduce')) {
        setActiveMenuItem('welcome')
        response = `${portfolioData?.profile?.name || 'The developer'} is a ${portfolioData?.profile?.title || 'Developer'} with ${portfolioData?.profile?.experience || 'extensive'} of experience. ${portfolioData?.profile?.bio || 'Experienced professional.'}`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'about'])
      } else if (lower.includes('blog') || lower.includes('blogs')) {
        setActiveMenuItem('blogs')
        response = 'Opening blog section.'
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'blogs'])
      } else if (lower.includes('contact') || lower.includes('contact information') || lower.includes('how to contact')) {
        setActiveMenuItem('contact')
        response = `Opening contact section. You can reach ${portfolioData?.profile?.name || 'the developer'} at ${portfolioData?.profile?.email || 'email'} or phone ${portfolioData?.profile?.phone || 'phone'}.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'contact'])
      } else if (lower.includes('achievement') || lower.includes('achievements') || lower.includes('award')) {
        setActiveMenuItem('achievement')
        response = `${portfolioData?.profile?.name || 'The developer'} has ${portfolioData?.achievements?.length || 0} awards including the Beinex Excelencia Award, and ${portfolioData?.certifications?.length || 0} professional certifications.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'achievements'])
      } else if (lower.includes('certification') || lower.includes('certifications')) {
        setActiveMenuItem('certifications')
        response = `Opening certifications section. There are ${portfolioData?.certifications?.length || 0} professional certifications.`
        actionType = 'navigate'
        setConversationContext(prev => [...prev, 'certifications'])
      } else if (lower.includes('recommendation') || lower.includes('recommendations') || lower.includes('testimonial')) {
        setActiveMenuItem('recommendation')
        response = `Opening recommendations section. There are ${recommendationsData?.length || 0} professional recommendations from colleagues and collaborators.`
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
      if (typeof document !== 'undefined') {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = `${portfolioData?.profile?.name || 'Resume'}-Resume.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      setConversationContext(prev => [...prev, 'resume'])
    } else if (lower.includes('contact ajay') || lower.includes('email ajay') || lower.includes('reach out')) {
      response = `You can contact ${portfolioData?.profile?.name || 'the developer'} via email at ${portfolioData?.profile?.email || 'email'}, phone at ${portfolioData?.profile?.phone || 'phone'}, or connect on LinkedIn.`
      actionType = 'contact'
      setActiveMenuItem('contact')
      if (typeof window !== 'undefined' && portfolioData?.profile?.email) {
        window.location.href = `mailto:${portfolioData.profile.email}`
      }
      setConversationContext(prev => [...prev, 'contact'])
    } else if (lower.includes('linkedin') || lower.includes('linked in')) {
      response = 'Opening LinkedIn profile in a new tab.'
      actionType = 'external'
      if (typeof window !== 'undefined' && portfolioData?.profile?.linkedin) {
        window.open(portfolioData.profile.linkedin, '_blank', 'noopener noreferrer')
      }
      setConversationContext(prev => [...prev, 'linkedin'])
    } else if (lower.includes('github') || lower.includes('git hub')) {
      response = 'Opening GitHub profile in a new tab.'
      actionType = 'external'
      if (typeof window !== 'undefined' && portfolioData?.profile?.github) {
        window.open(portfolioData.profile.github, '_blank', 'noopener noreferrer')
      }
      setConversationContext(prev => [...prev, 'github'])
    } else if (lower.includes('aurex') || (conversationContext.includes('project') && (lower.includes('details') || lower.includes('about') || lower.includes('tell me')))) {
      const project = portfolioData?.projects?.[0]
      if (project) {
        response = `${project.name || 'The project'} is a ${project.description || 'professional project'}. It was developed using ${project.technologies?.join(', ') || 'modern technologies'} during ${project.period || 'recent period'}. Key features include cloud-based analytics platform, risk and audit management integration, real-time data processing with WebSockets, advanced reporting capabilities, and responsive UI with Angular Material. The project solved challenges in data visualization, real-time communication, and performance optimization. Would you like to know more about specific technologies, features, challenges, or outcomes?`
      } else {
        response = 'I can provide information about projects. Would you like to see the projects section?'
      }
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

    // Show notification only for non-navigation actions
    if (actionType !== 'navigate') {
      addNotification({
        title: 'Voice Command',
        message: response,
        type: actionType === 'download' ? 'success' : 'info'
      })
    }

    // Speak response
    if (autoSpeak) {
      speak(response)
    }
  }, [setActiveMenuItem, addNotification, toggleSidebar, portfolioSettings.theme, language, conversationContext, autoSpeak, speak, updateSettings, setLanguage])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser')
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language || 'en-US'
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        try {
          if (!event.results || event.results.length === 0) return

          let interim = ''
          let final = ''
          
          for (let i = event.resultIndex || 0; i < event.results.length; i++) {
            if (event.results[i] && event.results[i][0] && event.results[i][0].transcript) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                final += transcript + ' '
              } else {
                interim += transcript
              }
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
        } catch (error) {
          console.error('Error processing speech result:', error)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        try {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          setShowListeningPanel(false)
          setInterimTranscript('')
          
          // Don't show error for user-initiated stops
          if (event.error === 'aborted') {
            return
          }
          
          let errorMessage = 'Voice recognition error'
          if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please try again.'
          } else if (event.error === 'not-allowed') {
            errorMessage = 'Microphone permission denied. Please allow microphone access.'
          } else if (event.error === 'network') {
            errorMessage = 'Network error. Please check your connection.'
          } else if (event.error === 'service-not-allowed') {
            errorMessage = 'Speech recognition service not available.'
          }
          
          addNotification({
            title: 'Voice Assistant Error',
            message: errorMessage,
            type: 'error'
          })
        } catch (error) {
          console.error('Error handling speech recognition error:', error)
        }
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
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors when stopping
        }
        recognitionRef.current = null
      }
    }
  }, [language, handleVoiceCommand, addNotification])

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

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') {
      addNotification({
        title: 'Voice Assistant',
        message: 'Voice recognition requires a browser environment.',
        type: 'error'
      })
      return
    }

    if (!recognitionRef.current) {
      addNotification({
        title: 'Voice Assistant',
        message: 'Voice recognition not supported in your browser.',
        type: 'error'
      })
      return
    }

    try {
      // Check if already listening
      if (isListening) {
        stopListening()
        return
      }

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
      
      // Handle specific error cases
      if (error.message?.includes('already started') || error.name === 'InvalidStateError') {
        // Recognition already running, just update state
        setIsListening(true)
        setShowListeningPanel(true)
      } else {
        addNotification({
          title: 'Voice Assistant Error',
          message: error.message || 'Failed to start voice recognition. Please try again.',
          type: 'error'
        })
      }
    }
  }, [addNotification, isListening, stopListening])

  // Expose trigger function and state to parent
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      ;(window as any).triggerVoiceAssistant = () => {
        if (!isListening) {
          startListening()
        } else {
          stopListening()
        }
      }
      ;(window as any).isVoiceListening = isListening
    } catch (error) {
      console.error('Error exposing voice assistant functions:', error)
    }

    return () => {
      try {
        if (typeof window !== 'undefined') {
          delete (window as any).triggerVoiceAssistant
          delete (window as any).isVoiceListening
        }
      } catch (error) {
        console.error('Error cleaning up voice assistant functions:', error)
      }
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
              className="relative w-48 h-48 md:w-56 md:h-56"
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
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer group"
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
                      <Mic className="text-white" size={28} strokeWidth={2} />
                    ) : (
                      <Mic className="text-white" size={28} strokeWidth={2} />
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

              {/* Status Text - Floating Above Circle */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 text-center z-20 w-40"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xs font-semibold text-white mb-0.5 drop-shadow-lg">
                  {isListening ? 'Listening...' : 'Voice Assistant'}
                </h3>
                <p className="text-[10px] text-gray-300 drop-shadow-md">
                  {isListening ? 'Speak your command' : 'Ready to listen'}
                </p>
              </motion.div>

              {/* Transcript Display - Floating Below Circle */}
              {(transcript || interimTranscript) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-56 z-20"
                >
                  <div
                    className="bg-black/80 backdrop-blur-md rounded-lg p-2.5 border border-white/20"
                    style={{
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {transcript ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                          <CheckCircle size={10} />
                          <span>Recognized</span>
                        </div>
                        <p className="text-xs text-white font-medium break-words">{transcript}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400">
                          <Volume2 size={10} />
                          <span>Listening...</span>
                        </div>
                        <p className="text-xs text-white italic break-words">{interimTranscript}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Control Buttons - Floating Below Circle */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {isSpeaking && (
                  <motion.button
                    onClick={stopSpeaking}
                    className="px-2.5 py-1.5 text-[10px] bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-black/90 transition-all font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    Stop
                  </motion.button>
                )}
                <motion.button
                  onClick={stopListening}
                  className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-white hover:bg-black/90 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                  }}
                  aria-label="Close"
                >
                  <X size={14} />
                </motion.button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

