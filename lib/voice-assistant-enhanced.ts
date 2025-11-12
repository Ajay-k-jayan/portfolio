/**
 * Enhanced Voice Assistant with Web Speech API
 * Supports voice input/output, multilingual, and voice-driven navigation
 */

export interface VoiceCommand {
  command: string
  action: () => void
  confidence: number
}

export class EnhancedVoiceAssistant {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening: boolean = false
  private language: string = 'en-US'

  constructor(language: string = 'en-US') {
    this.language = language
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
  }

  private initializeSpeechRecognition(): void {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = this.language
    this.recognition.maxAlternatives = 1
  }

  private initializeSpeechSynthesis(): void {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
    }
  }

  setLanguage(language: string): void {
    this.language = language
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser')
      return
    }

    if (this.isListening) {
      this.stopListening()
    }

    this.isListening = true

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      this.isListening = false
      onResult(transcript)
    }

    this.recognition.onerror = (event: any) => {
      this.isListening = false
      onError?.(event.error || 'Recognition error occurred')
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    try {
      this.recognition.start()
    } catch (error) {
      this.isListening = false
      onError?.('Failed to start recognition')
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text: string, options?: { lang?: string; rate?: number; pitch?: number }): void {
    if (!this.synthesis) return

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options?.lang || this.language
    utterance.rate = options?.rate || 1.0
    utterance.pitch = options?.pitch || 1.0

    this.synthesis.speak(utterance)
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  isAvailable(): boolean {
    return !!this.recognition && !!this.synthesis
  }

  getIsListening(): boolean {
    return this.isListening
  }

  // Voice command recognition
  recognizeCommand(transcript: string): VoiceCommand[] {
    const lower = transcript.toLowerCase()
    const commands: VoiceCommand[] = []

    // Navigation commands
    if (lower.includes('show projects') || lower.includes('open projects')) {
      commands.push({
        command: 'navigate-projects',
        action: () => {},
        confidence: 0.9
      })
    }

    if (lower.includes('show skills') || lower.includes('open skills')) {
      commands.push({
        command: 'navigate-skills',
        action: () => {},
        confidence: 0.9
      })
    }

    if (lower.includes('show contact') || lower.includes('open contact')) {
      commands.push({
        command: 'navigate-contact',
        action: () => {},
        confidence: 0.9
      })
    }

    // Action commands
    if (lower.includes('download resume') || lower.includes('get resume')) {
      commands.push({
        command: 'download-resume',
        action: () => {
          const link = document.createElement('a')
          link.href = '/resume.pdf'
          link.download = 'resume.pdf'
          link.click()
        },
        confidence: 0.95
      })
    }

    if (lower.includes('open linkedin') || lower.includes('show linkedin')) {
      commands.push({
        command: 'open-linkedin',
        action: () => {
          window.open('https://www.linkedin.com/in/ajay-k-jayan-4a55b1224/', '_blank')
        },
        confidence: 0.9
      })
    }

    // Information commands
    if (lower.includes('tell me about') || lower.includes('what is')) {
      commands.push({
        command: 'query-info',
        action: () => {},
        confidence: 0.8
      })
    }

    return commands.sort((a, b) => b.confidence - a.confidence)
  }
}

export const voiceAssistant = new EnhancedVoiceAssistant()

