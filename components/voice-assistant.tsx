'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, MicOff, X, Volume2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'

export function VoiceAssistant({ onTriggerClick }: { onTriggerClick?: () => void }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [showListeningPanel, setShowListeningPanel] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const { setActiveMenuItem, addNotification, toggleSidebar } = useAppStore()

  const handleVoiceCommand = useCallback((command: string) => {
    const lower = command.toLowerCase().trim()
    setLastCommand(command)
    
    // Navigation commands
    if (lower.includes('open') || lower.includes('show') || lower.includes('go to')) {
      if (lower.includes('project') || lower.includes('projects')) {
        setActiveMenuItem('project')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Projects',
          type: 'success'
        })
      } else if (lower.includes('skill') || lower.includes('skills')) {
        setActiveMenuItem('skills')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Skills',
          type: 'success'
        })
      } else if (lower.includes('experience') || lower.includes('work')) {
        setActiveMenuItem('experience')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Experience',
          type: 'success'
        })
      } else if (lower.includes('about') || lower.includes('welcome')) {
        setActiveMenuItem('welcome')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Welcome Page',
          type: 'success'
        })
      } else if (lower.includes('blog') || lower.includes('blogs')) {
        setActiveMenuItem('blogs')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Blogs',
          type: 'success'
        })
      } else if (lower.includes('contact')) {
        setActiveMenuItem('contact')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Contact',
          type: 'success'
        })
      } else if (lower.includes('achievement') || lower.includes('achievements')) {
        setActiveMenuItem('achievement')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Achievements',
          type: 'success'
        })
      } else if (lower.includes('certification') || lower.includes('certifications')) {
        setActiveMenuItem('certifications')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Certifications',
          type: 'success'
        })
      } else if (lower.includes('recommendation') || lower.includes('recommendations')) {
        setActiveMenuItem('recommendation')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Recommendations',
          type: 'success'
        })
      } else if (lower.includes('setting') || lower.includes('settings')) {
        setActiveMenuItem('settings')
        addNotification({
          title: 'Voice Command',
          message: 'Opening Settings',
          type: 'success'
        })
      } else {
        addNotification({
          title: 'Voice Command',
          message: `Command recognized: "${command}". Try: "Open projects", "Show skills", "Go to contact"`,
          type: 'info'
        })
      }
    } else if (lower.includes('close') || lower.includes('hide') || lower.includes('toggle')) {
      if (lower.includes('sidebar')) {
        toggleSidebar()
        addNotification({
          title: 'Voice Command',
          message: 'Toggling Sidebar',
          type: 'info'
        })
      }
    } else if (lower.includes('help') || lower.includes('what can you do')) {
      addNotification({
        title: 'Voice Commands',
        message: 'Try: "Open projects", "Show skills", "Go to contact", "Toggle sidebar"',
        type: 'info'
      })
    } else {
      addNotification({
        title: 'Voice Command',
        message: `I heard: "${command}". Try commands like "Open projects" or "Show skills"`,
        type: 'info'
      })
    }
  }, [setActiveMenuItem, addNotification, toggleSidebar])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

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
      {/* Listening Panel */}
      <AnimatePresence>
        {showListeningPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl z-[99] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-vscode-border bg-vscode-active/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isListening 
                    ? 'bg-red-500/20 border-2 border-red-500' 
                    : 'bg-vscode-blue/20 border-2 border-vscode-blue'
                }`}>
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Mic className="text-red-400" size={20} />
                    </motion.div>
                  ) : (
                    <CheckCircle className="text-vscode-blue" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-vscode-text">
                    {isListening ? 'Listening...' : 'Voice Assistant'}
                  </h3>
                  <p className="text-xs text-vscode-text-secondary">
                    {isListening ? 'Speak your command' : 'Ready to listen'}
                  </p>
                </div>
              </div>
              <button
                onClick={stopListening}
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Audio Waveform Animation */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 h-12">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-vscode-blue rounded-full"
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.1,
                      }}
                      style={{ height: 8 }}
                    />
                  ))}
                </div>
              )}

              {/* Transcript Display */}
              <div className="min-h-[60px] bg-vscode-active rounded-lg p-4 border border-vscode-border">
                {transcript ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-vscode-text-secondary">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Command recognized</span>
                    </div>
                    <p className="text-sm text-vscode-text font-medium">{transcript}</p>
                  </div>
                ) : interimTranscript ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-vscode-text-secondary">
                      <Volume2 size={14} className="text-vscode-blue" />
                      <span>Listening...</span>
                    </div>
                    <p className="text-sm text-vscode-text italic">{interimTranscript}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="text-sm text-vscode-text-secondary">
                      {isListening ? 'Waiting for your command...' : 'Click the microphone to start'}
                    </p>
                  </div>
                )}
              </div>

              {/* Command Examples */}
              {!transcript && !interimTranscript && (
                <div className="space-y-2">
                  <p className="text-xs text-vscode-text-secondary font-medium">Try saying:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Open projects', 'Show skills', 'Go to contact'].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => {
                          setTranscript(cmd)
                          handleVoiceCommand(cmd)
                        }}
                        className="px-3 py-1.5 text-xs bg-vscode-active border border-vscode-border rounded hover:bg-vscode-hover text-vscode-text transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Command Result */}
              {lastCommand && transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <CheckCircle size={16} className="text-green-500" />
                  <p className="text-xs text-vscode-text">
                    Executed: <span className="font-medium">{lastCommand}</span>
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-vscode-border bg-vscode-active/30">
              <div className="flex items-center justify-between">
                <p className="text-xs text-vscode-text-secondary">
                  {isListening ? 'Speak clearly into your microphone' : 'Click mic icon to start'}
                </p>
                {isListening && (
                  <button
                    onClick={stopListening}
                    className="px-4 py-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors border border-red-500/30"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
