'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { Tooltip } from './ui/tooltip'

export function VoiceAssistant({ onTriggerClick }: { onTriggerClick?: () => void }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const { openSidebarView, addTab } = useAppStore()

  const handleVoiceCommand = useCallback((command: string) => {
    const lower = command.toLowerCase()
    
    if (lower.includes('open') || lower.includes('show')) {
      if (lower.includes('project')) {
        openSidebarView('run-debug')
        toast.success('Opening projects')
      } else if (lower.includes('about')) {
        openSidebarView('explorer')
        addTab({ id: 'about', label: 'about.tsx', content: <div>About content</div> })
        toast.success('Opening about')
      } else if (lower.includes('skill')) {
        openSidebarView('explorer')
        addTab({ id: 'skills', label: 'skills.tsx', content: <div>Skills content</div> })
        toast.success('Opening skills')
      } else if (lower.includes('blog')) {
        openSidebarView('blog')
        toast.success('Opening blog')
      } else if (lower.includes('contact')) {
        openSidebarView('contact')
        toast.success('Opening contact')
      }
    } else if (lower.includes('close') || lower.includes('hide')) {
      if (lower.includes('sidebar')) {
        // Toggle sidebar
        toast.success('Toggling sidebar')
      }
    }
  }, [openSidebarView, addTab])

  useEffect(() => {
    let recognition: any = null

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript.trim())
          handleVoiceCommand(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          toast.error('No speech detected. Try again.')
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied.')
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [handleVoiceCommand])

  const startListening = useCallback(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript.trim())
          handleVoiceCommand(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
      setIsListening(true)
      toast.success('Listening...')
    } else {
      toast.error('Voice recognition not supported in your browser.')
    }
  }, [handleVoiceCommand])

  const stopListening = useCallback(() => {
    setIsListening(false)
    toast.success('Stopped listening')
  }, [])

  // Expose trigger function to parent
  useEffect(() => {
    ;(window as any).triggerVoiceAssistant = () => {
      if (!isListening) {
        startListening()
      } else {
        stopListening()
      }
    }
    return () => {
      delete (window as any).triggerVoiceAssistant
    }
  }, [isListening, startListening, stopListening])

  // Return null since we're using the button in the header now
  return null
}

