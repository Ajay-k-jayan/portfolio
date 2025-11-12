'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Send, Bot, User, Sparkles, Download,
  Linkedin, Github, Mail, ChevronRight,
  Infinity, AtSign, Image as ImageIcon, Square,
  FileText, Command, Briefcase, Code, Award,
  MessageSquare, Globe, Mic, Volume2
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { recommendationsData } from '@/lib/recommendations-data'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'

// NLP: Intent Classification
enum Intent {
  ABOUT = 'about',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  EXPERIENCE = 'experience',
  CONTACT = 'contact',
  ACHIEVEMENTS = 'achievements',
  TESTIMONIALS = 'testimonials',
  RESUME = 'resume',
  WALKTHROUGH = 'walkthrough',
  RECRUITER = 'recruiter',
  GREETING = 'greeting',
  UNKNOWN = 'unknown'
}

// NLP: Entity Types
interface Entity {
  type: 'project' | 'technology' | 'date' | 'skill' | 'company' | 'person'
  value: string
  confidence: number
}

// NLP: Sentiment Analysis
enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  PROFESSIONAL = 'professional'
}

// Dialogue State Management
interface DialogueState {
  context: string[]
  lastIntent: Intent | null
  visitorProfile: 'recruiter' | 'developer' | 'client' | 'general'
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  entities: Entity[]
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  intent?: Intent
  sentiment?: Sentiment
  suggestions?: string[]
  quickActions?: QuickAction[]
  walkthrough?: WalkthroughStep[]
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  type?: 'navigate' | 'download' | 'external' | 'contact'
}

interface WalkthroughStep {
  id: string
  title: string
  description: string
  action: () => void
}

export function AdvancedAIAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your Advanced Generative AI Portfolio Assistant powered by state-of-the-art NLP and NLG technologies.\n\nI deeply understand ${portfolioData.profile.name}'s complete portfolio and can help you explore:\n• Professional background & career journey\n• Projects with detailed case studies\n• Technical skills & specializations\n• Work experience & achievements\n• Contact information & resume\n\n**Quick Commands:** Type \`/help\` for all commands\n**Voice:** Click the mic icon for voice interaction\n\nHow can I assist you today?`,
      timestamp: new Date(),
      intent: Intent.GREETING,
      sentiment: Sentiment.POSITIVE
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<{ menuId: string; label: string } | null>(null)
  const [dialogueState, setDialogueState] = useState<DialogueState>({
    context: [],
    lastIntent: null,
    visitorProfile: 'general',
    conversationHistory: [],
    entities: []
  })
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setActiveMenuItem } = useAppStore()
  const { language, setLanguage, t } = useLanguage()

  const menuItemLabels: Record<string, string> = {
    'welcome': 'Welcome',
    'file-explore': 'File Explorer',
    'project': 'Projects',
    'experience': 'Work Experience',
    'skills': 'Skills',
    'achievement': 'Achievements',
    'certifications': 'Certifications',
    'recommendations': 'Recommendations',
    'contact': 'Contact',
    'blog': 'Blog',
    'settings': 'Settings',
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setInput('/')
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // NLP: Intent Recognition
  const recognizeIntent = useCallback((text: string): Intent => {
    const lower = text.toLowerCase()
    
    if (lower.match(/\b(hi|hello|hey|greetings|good morning|good afternoon)\b/)) return Intent.GREETING
    if (lower.match(/\b(about|who|background|introduce|bio)\b/)) return Intent.ABOUT
    if (lower.match(/\b(project|work|portfolio|aurex|case study)\b/)) return Intent.PROJECTS
    if (lower.match(/\b(skill|technology|tech|expertise|angular|next\.js|tailwind|rxjs)\b/)) return Intent.SKILLS
    if (lower.match(/\b(experience|work history|career|job|position|role)\b/)) return Intent.EXPERIENCE
    if (lower.match(/\b(contact|email|phone|reach|hire|connect|linkedin|github)\b/)) return Intent.CONTACT
    if (lower.match(/\b(achievement|award|certification|recognition)\b/)) return Intent.ACHIEVEMENTS
    if (lower.match(/\b(testimonial|recommendation|review|feedback|colleague)\b/)) return Intent.TESTIMONIALS
    if (lower.match(/\b(resume|cv|download|pdf)\b/)) return Intent.RESUME
    if (lower.match(/\b(walkthrough|tour|guide|show around)\b/)) return Intent.WALKTHROUGH
    if (lower.match(/\b(recruiter|hiring|available|interview|position|role|job)\b/)) return Intent.RECRUITER
    
    return Intent.UNKNOWN
  }, [])

  // NLP: Entity Extraction
  const extractEntities = useCallback((text: string): Entity[] => {
    const entities: Entity[] = []
    const lower = text.toLowerCase()
    
    // Extract technologies
    const technologies = ['angular', 'next.js', 'tailwind', 'rxjs', 'typescript', 'javascript', 'd3.js', 'websockets']
    technologies.forEach(tech => {
      if (lower.includes(tech)) {
        entities.push({ type: 'technology', value: tech, confidence: 0.9 })
      }
    })
    
    // Extract projects
    if (lower.includes('aurex')) {
      entities.push({ type: 'project', value: 'Aurex', confidence: 0.95 })
    }
    
    // Extract skills
    const skills = ['frontend', 'backend', 'fullstack', 'ui/ux', 'design']
    skills.forEach(skill => {
      if (lower.includes(skill)) {
        entities.push({ type: 'skill', value: skill, confidence: 0.85 })
      }
    })
    
    // Extract company
    if (lower.includes('beinex')) {
      entities.push({ type: 'company', value: 'Beinex', confidence: 0.9 })
    }
    
    return entities
  }, [])

  // NLP: Sentiment Analysis
  const analyzeSentiment = useCallback((text: string, intent: Intent): Sentiment => {
    const lower = text.toLowerCase()
    
    if (intent === Intent.RECRUITER) return Sentiment.PROFESSIONAL
    
    const positiveWords = ['great', 'excellent', 'amazing', 'impressive', 'wonderful', 'love', 'fantastic']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed']
    
    const hasPositive = positiveWords.some(word => lower.includes(word))
    const hasNegative = negativeWords.some(word => lower.includes(word))
    
    if (hasPositive) return Sentiment.POSITIVE
    if (hasNegative) return Sentiment.NEGATIVE
    return Sentiment.NEUTRAL
  }, [])

  // NLG: Visitor Profile Detection
  const detectVisitorProfile = useCallback((text: string, intent: Intent): DialogueState['visitorProfile'] => {
    const lower = text.toLowerCase()
    
    if (intent === Intent.RECRUITER || lower.includes('recruiter') || lower.includes('hiring')) {
      return 'recruiter'
    }
    if (lower.includes('developer') || lower.includes('programmer') || lower.includes('code')) {
      return 'developer'
    }
    if (lower.includes('client') || lower.includes('project') || lower.includes('collaborate')) {
      return 'client'
    }
    return 'general'
  }, [])

  // NLG: Tone Customization
  const customizeTone = useCallback((baseContent: string, profile: DialogueState['visitorProfile'], sentiment: Sentiment): string => {
    if (profile === 'recruiter' || sentiment === Sentiment.PROFESSIONAL) {
      return baseContent.replace(/I'm/g, 'I am').replace(/can't/g, 'cannot')
    }
    if (profile === 'developer') {
      return baseContent + '\n\n*Technical details available upon request.*'
    }
    return baseContent
  }, [])

  // NLG: Generate Response
  const generateResponse = useCallback((userInput: string, state: DialogueState): {
    content: string
    suggestions?: string[]
    quickActions?: QuickAction[]
    walkthrough?: WalkthroughStep[]
    navigateTo?: string
    intent: Intent
    sentiment: Sentiment
  } => {
    const intent = recognizeIntent(userInput)
    const entities = extractEntities(userInput)
    const sentiment = analyzeSentiment(userInput, intent)
    const profile = detectVisitorProfile(userInput, intent)
    
    // Update dialogue state
    const newState: DialogueState = {
      ...state,
      lastIntent: intent,
      visitorProfile: profile,
      entities: [...state.entities, ...entities],
      context: [...state.context, userInput],
      conversationHistory: [...state.conversationHistory, { role: 'user', content: userInput }]
    }
    setDialogueState(newState)

    let content = ''
    let suggestions: string[] = []
    let quickActions: QuickAction[] = []
    let navigateTo: string | undefined

    // Generate content based on intent
    switch (intent) {
      case Intent.ABOUT:
        content = generateAboutResponse(profile, sentiment)
        suggestions = ['Tell me about projects', 'What are the skills?', 'Show work experience']
        break
      
      case Intent.PROJECTS:
        content = generateProjectsResponse(entities)
        suggestions = ['Tell me about Aurex in detail', 'What technologies are used?', 'Show project highlights']
        quickActions = getProjectQuickActions()
        navigateTo = 'project'
        break
      
      case Intent.SKILLS:
        content = generateSkillsResponse(entities)
        suggestions = ['Show Angular projects', 'Tell me about Next.js work', 'What about RxJS?']
        navigateTo = 'skills'
        break
      
      case Intent.EXPERIENCE:
        content = generateExperienceResponse()
        suggestions = ['Tell me about projects', 'What are the skills?', 'Show achievements']
        navigateTo = 'experience'
        break
      
      case Intent.CONTACT:
        content = generateContactResponse(profile)
        suggestions = ['Download resume', 'Open LinkedIn', 'Open GitHub']
        quickActions = getContactQuickActions()
        navigateTo = 'contact'
        break
      
      case Intent.ACHIEVEMENTS:
        content = generateAchievementsResponse()
        suggestions = ['Show all certifications', 'Tell me about testimonials', 'View award details']
        navigateTo = 'achievement'
        break
      
      case Intent.TESTIMONIALS:
        content = generateTestimonialsResponse()
        suggestions = ['Tell me about work experience', 'What are the achievements?']
        navigateTo = 'recommendations'
        break
      
      case Intent.RESUME:
        content = generateResumeResponse()
        quickActions = getResumeQuickActions()
        break
      
      case Intent.WALKTHROUGH:
        content = generateWalkthroughResponse()
        suggestions = ['Start walkthrough', 'Skip to projects', 'View skills first']
        break
      
      case Intent.RECRUITER:
        content = generateRecruiterResponse()
        suggestions = ['Download resume', 'View LinkedIn', 'Contact directly']
        quickActions = getContactQuickActions()
        break
      
      case Intent.GREETING:
        content = generateGreetingResponse(profile)
        suggestions = ['Tell me about the professional background', 'Show me the projects', 'What are the key skills?']
        quickActions = getContactQuickActions()
        break
      
      default:
        content = generateDefaultResponse(userInput, state)
        suggestions = ['Tell me about projects', 'What are the skills?', 'How can I contact?']
        quickActions = getContactQuickActions()
    }

    // Apply tone customization
    content = customizeTone(content, profile, sentiment)

    return { content, suggestions, quickActions, navigateTo, intent, sentiment }
  }, [recognizeIntent, extractEntities, analyzeSentiment, detectVisitorProfile, customizeTone])

  // NLG: Response Generators
  const generateAboutResponse = (profile: DialogueState['visitorProfile'], sentiment: Sentiment): string => {
    const exp = portfolioData.experience
    const base = `**${portfolioData.profile.name} - Professional Profile**\n\n**Current Role:**\n${portfolioData.profile.title} at ${portfolioData.profile.company}\n${portfolioData.profile.experience} of experience\n\n**Bio:**\n${portfolioData.profile.bio}\n\n**Specialization:**\n${portfolioData.profile.subtitle}\n\n**Career Journey:**\n${exp.map(e => `**${e.title}** at ${e.company}\n${e.period} | ${e.location}\n\nKey Achievements:\n${e.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n---\n\n')}`
    return base
  }

  const generateProjectsResponse = (entities: Entity[]): string => {
    const projects = portfolioData.projects
    const mentionedTech = entities.find(e => e.type === 'technology')
    return `**Featured Projects**\n\n${projects.map(p => `**${p.name}**\n\n${p.description}\n\n**Duration:** ${p.period}\n**Technologies:** ${p.technologies?.join(', ') || 'N/A'}\n\n**Key Highlights:**\n• Cloud-based analytics platform\n• Risk and audit management integration\n• Real-time data processing with WebSockets\n• Advanced reporting capabilities\n• Responsive UI with Angular Material`).join('\n\n---\n\n')}${mentionedTech ? `\n\n*I noticed you're interested in ${mentionedTech.value}. This project heavily utilizes ${mentionedTech.value} for ${mentionedTech.value === 'angular' ? 'component architecture and state management' : mentionedTech.value === 'next.js' ? 'server-side rendering and API routes' : 'styling and responsive design'}.*` : ''}`
  }

  const generateSkillsResponse = (entities: Entity[]): string => {
    const coreSkills = ['Angular', 'Next.js', 'Tailwind CSS', 'TypeScript', 'JavaScript', 'RxJS', 'D3.js', 'WebSockets']
    const mentionedTech = entities.find(e => e.type === 'technology')
    return `**Technical Skills & Expertise**\n\n**Core Technologies:**\n${coreSkills.map(s => `• **${s}** - ${getSkillDescription(s)}`).join('\n')}\n\n**Frontend Specializations:**\n• Component-based architecture\n• State management (RxJS)\n• Data visualization (D3.js)\n• Real-time communication (WebSockets)\n• Responsive design\n• Performance optimization\n\n**Development Tools:**\n• Git & Version Control\n• Figma (UI/UX Design)\n• Jenkins (CI/CD)\n• Angular Material\n• Bootstrap${mentionedTech ? `\n\n*Deep expertise in ${mentionedTech.value} with ${portfolioData.profile.experience} of hands-on experience.*` : ''}`
  }

  const generateExperienceResponse = (): string => {
    const exp = portfolioData.experience
    return `**Work Experience**\n\n${exp.map(e => `**${e.title}**\n${e.company} | ${e.period}\n${e.location}\n\n**Key Achievements:**\n${e.achievements.map(a => `• ${a}`).join('\n')}\n\n**Impact:**\n• Contributed to company growth through innovative solutions\n• Improved application performance and user experience\n• Mentored team members and shared best practices`).join('\n\n---\n\n')}\n\n**Total Experience:** ${portfolioData.profile.experience}\n**Current Company:** ${portfolioData.profile.company}`
  }

  const generateContactResponse = (profile: DialogueState['visitorProfile']): string => {
    const professional = profile === 'recruiter'
    return `**Contact Information**\n\n**Direct Contact:**\n• **Email:** ${portfolioData.profile.email}\n• **Phone:** ${portfolioData.profile.phone}\n• **Location:** ${portfolioData.profile.location}\n\n**Professional Profiles:**\n• **LinkedIn:** [${portfolioData.profile.name}](${portfolioData.profile.linkedin})\n• **GitHub:** [@${portfolioData.profile.github.split('/').pop()}](${portfolioData.profile.github})\n\n${professional ? '**For Recruiters:**\nEmail is the fastest way to reach out. Include position details and I can provide tailored information about fit and availability.\n\n' : ''}**Quick Actions:**\n• Download resume for detailed information\n• Connect on LinkedIn for professional networking\n• View GitHub for code samples and projects`
  }

  const generateAchievementsResponse = (): string => {
    const achievements = portfolioData.achievements
    const certifications = portfolioData.certifications
    return `**Achievements & Recognitions**\n\n**Awards:**\n${achievements.map(a => `**${a.name}**\nIssued by: ${a.issuer}\nDate: ${a.date}\n${a.description}${a.url ? `\n[View Certificate](${a.url})` : ''}`).join('\n\n---\n\n')}\n\n**Professional Certifications (${certifications.length} total):**\n${certifications.slice(0, 5).map(c => `• ${c.name} - ${c.issuer} (${c.date})`).join('\n')}${certifications.length > 5 ? `\n\n*Showing 5 of ${certifications.length}. Ask for "all certifications" to see complete list.*` : ''}`
  }

  const generateTestimonialsResponse = (): string => {
    const recs = recommendationsData
    return `**Testimonials & Recommendations**\n\n**${recs.length} Professional Recommendations:**\n\n${recs.map(r => `**${r.name}**\n${r.position} at ${r.company}\n\n"${r.quote}"\n\n*${r.relationship} • ${r.date}*${r.linkedinUrl ? `\n[View on LinkedIn](${r.linkedinUrl})` : ''}`).join('\n\n---\n\n')}\n\nThese recommendations highlight ${portfolioData.profile.name}'s expertise in Angular development, problem-solving abilities, and collaborative approach.`
  }

  const generateResumeResponse = (): string => {
    return `**Resume Download**\n\nI can help you download ${portfolioData.profile.name}'s resume. The resume includes:\n• Complete work experience\n• Technical skills and certifications\n• Educational background\n• Professional achievements\n\nClick the download button below to get the PDF.`
  }

  const generateWalkthroughResponse = (): string => {
    return `**Portfolio Walkthrough**\n\nI'll guide you through ${portfolioData.profile.name}'s portfolio step by step. This interactive tour will cover:\n• Professional background\n• Featured projects\n• Technical skills\n• Work experience\n• Contact information\n\nLet's begin!`
  }

  const generateRecruiterResponse = (): string => {
    return `**Recruiter Information - ${portfolioData.profile.name}**\n\n**Current Status:**\n• Position: ${portfolioData.profile.title} at ${portfolioData.profile.company}\n• Experience: ${portfolioData.profile.experience}\n• Location: ${portfolioData.profile.location}\n\n**Key Skills Alignment:**\n• **Frontend:** Angular, Next.js, TypeScript, JavaScript\n• **Styling:** Tailwind CSS, SCSS, CSS3\n• **Libraries:** RxJS, D3.js, Angular Material\n• **Tools:** Git, Figma, Jenkins\n\n**Availability:** Currently employed but open to opportunities\n\n**Interview Readiness:** Available for technical discussions and portfolio walkthroughs\n\n**Best Contact:** ${portfolioData.profile.email} or LinkedIn\n\nWould you like to schedule a call or get more specific information?`
  }

  const generateGreetingResponse = (profile: DialogueState['visitorProfile']): string => {
    const personalized = profile === 'recruiter' 
      ? 'As a recruiter, I can provide detailed information about skills alignment, availability, and interview readiness.'
      : profile === 'developer'
      ? 'As a fellow developer, I can share technical details, code samples, and implementation strategies.'
      : 'I can help you explore the portfolio and answer any questions you have.'
    
    return `Hello! I'm your Advanced Generative AI Portfolio Assistant powered by state-of-the-art NLP and NLG technologies.\n\nI deeply understand ${portfolioData.profile.name}'s complete portfolio. ${personalized}\n\n**I can help with:**\n• Professional background and career journey\n• Detailed project information\n• Technical skills and specializations\n• Work experience and achievements\n• Contact information and resume\n\n**Quick Commands:** Type \`/help\` for all commands\n\nWhat would you like to explore?`
  }

  const generateDefaultResponse = (userInput: string, state: DialogueState): string => {
    const lastIntent = state.lastIntent
    const context = state.context
    
    if (lastIntent) {
      return `I understand you're asking about "${userInput}". Based on our conversation, you might be interested in:\n\n• More details about ${lastIntent}\n• Related portfolio sections\n• Contact information\n\nCould you rephrase your question, or would you like me to help you explore a specific area?`
    }
    
    return `I'm your Advanced Generative AI Portfolio Assistant. I can help you explore ${portfolioData.profile.name}'s portfolio including:\n\n• Professional background\n• Projects and case studies\n• Technical skills\n• Work experience\n• Achievements and certifications\n• Contact information\n\n**Try asking:**\n• "Tell me about the projects"\n• "What are the key skills?"\n• "How can I contact?"\n• Or type \`/help\` for commands`
  }

  const getSkillDescription = (skill: string): string => {
    const descriptions: Record<string, string> = {
      'Angular': 'Frontend framework expertise',
      'Next.js': 'Full-stack React framework',
      'Tailwind CSS': 'Utility-first CSS framework',
      'TypeScript': 'Type-safe JavaScript',
      'JavaScript': 'Core programming language',
      'RxJS': 'Reactive programming library',
      'D3.js': 'Data visualization library',
      'WebSockets': 'Real-time communication'
    }
    return descriptions[skill] || 'Proficient'
  }

  const getContactQuickActions = (): QuickAction[] => [
    {
      id: 'resume',
      label: 'Download Resume',
      icon: <Download size={16} />,
      type: 'download',
      action: () => {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = `${portfolioData.profile.name}-Resume.pdf`
        link.click()
        addMessage('assistant', 'Resume download initiated!')
      }
    },
    {
      id: 'linkedin',
      label: 'View LinkedIn',
      icon: <Linkedin size={16} />,
      type: 'external',
      action: () => {
        window.open(portfolioData.profile.linkedin, '_blank')
        addMessage('assistant', 'Opening LinkedIn profile...')
      }
    },
    {
      id: 'github',
      label: 'View GitHub',
      icon: <Github size={16} />,
      type: 'external',
      action: () => {
        window.open(portfolioData.profile.github, '_blank')
        addMessage('assistant', 'Opening GitHub profile...')
      }
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail size={16} />,
      type: 'contact',
      action: () => setPendingNavigation({ menuId: 'contact', label: 'Contact' })
    }
  ]

  const getProjectQuickActions = (): QuickAction[] => [
    ...getContactQuickActions(),
    {
      id: 'view-project',
      label: 'View Project Details',
      icon: <Briefcase size={16} />,
      type: 'navigate',
      action: () => setPendingNavigation({ menuId: 'project', label: 'Projects' })
    }
  ]

  const getResumeQuickActions = (): QuickAction[] => [
    {
      id: 'resume',
      label: 'Download Resume',
      icon: <Download size={16} />,
      type: 'download',
      action: () => {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = `${portfolioData.profile.name}-Resume.pdf`
        link.click()
        addMessage('assistant', 'Resume download initiated!')
      }
    }
  ]

  const addMessage = (role: 'user' | 'assistant', content: string, intent?: Intent, sentiment?: Sentiment, suggestions?: string[], quickActions?: QuickAction[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      intent,
      sentiment,
      suggestions,
      quickActions
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSend = async (customInput?: string) => {
    const userInput = customInput || input.trim()
    if (!userInput) return

    addMessage('user', userInput)

    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(userInput, dialogueState)
      addMessage('assistant', response.content, response.intent, response.sentiment, response.suggestions, response.quickActions)
      setIsTyping(false)

      if (response.navigateTo) {
        const menuLabel = menuItemLabels[response.navigateTo] || response.navigateTo
        setPendingNavigation({ menuId: response.navigateTo, label: menuLabel })
      }
    }, 800)
  }

  const handleNavigationConfirm = (confirmed: boolean) => {
    if (confirmed && pendingNavigation) {
      setActiveMenuItem(pendingNavigation.menuId)
      addMessage('assistant', `Redirecting to ${pendingNavigation.label}...`)
      setTimeout(() => onClose(), 500)
    }
    setPendingNavigation(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') {
      if (pendingNavigation) setPendingNavigation(null)
      else onClose()
    }
  }

  // Voice Recognition (Web Speech API)
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addMessage('assistant', 'Voice recognition is not supported in your browser.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language

    setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
      handleSend(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
      addMessage('assistant', 'Voice recognition error. Please try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const exportConversation = () => {
    const transcript = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`
    ).join('\n\n')
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portfolio-chat-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    addMessage('assistant', 'Conversation exported successfully!')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
        aria-hidden="true"
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-vscode-sidebar border-l border-vscode-border shadow-2xl flex flex-col z-[100]"
        role="dialog"
        aria-label="Advanced AI Assistant"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-vscode-border bg-vscode-sidebar">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-vscode-active border border-vscode-border flex items-center justify-center">
              <Sparkles className="text-vscode-blue" size={12} />
            </div>
            <h2 className="text-xs font-semibold text-vscode-text uppercase tracking-wide">AI Assistance</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportConversation}
              className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
              aria-label="Export conversation"
              title="Export conversation"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={messagesEndRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded bg-vscode-blue flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="text-white" size={12} />
                  </div>
                )}
                <div className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end max-w-[75%]' : 'items-start max-w-[85%]'}`}>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.role === 'user' ? 'bg-vscode-blue text-white' : 'bg-vscode-active text-vscode-text'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-xs text-vscode-text-secondary">
                      <span>AI Assistant</span>
                    </div>
                  )}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-vscode-active hover:bg-vscode-hover text-vscode-text rounded border border-vscode-border transition-colors"
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className="text-left text-xs px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text-secondary hover:text-vscode-text rounded border border-vscode-border transition-colors flex items-center gap-2"
                        >
                          <ChevronRight size={12} />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-vscode-border flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="text-vscode-text-secondary" size={12} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-6 h-6 rounded bg-vscode-blue flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="text-white" size={12} />
              </div>
              <div className="bg-vscode-active rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-vscode-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Navigation Confirmation */}
        <AnimatePresence>
          {pendingNavigation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[101]"
              onClick={() => setPendingNavigation(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
              >
                <h3 className="text-sm font-semibold text-vscode-text mb-4">Navigate to {pendingNavigation.label}?</h3>
                <p className="text-sm text-vscode-text-secondary mb-6">
                  This will close the AI Assistant panel.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleNavigationConfirm(true)}
                    className="flex-1 px-4 py-2 bg-vscode-blue hover:bg-blue-600 text-white rounded text-sm"
                  >
                    Yes, Navigate
                  </button>
                  <button
                    onClick={() => handleNavigationConfirm(false)}
                    className="flex-1 px-4 py-2 bg-vscode-active hover:bg-vscode-hover text-vscode-text rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        {isTyping && (
          <div className="px-4 py-2 border-t border-vscode-border bg-vscode-sidebar flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-vscode-text-secondary">
              <ChevronRight size={12} />
              <span>Processing...</span>
            </div>
            <button
              onClick={() => setIsTyping(false)}
              className="text-xs text-vscode-text-secondary hover:text-vscode-text"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-vscode-border bg-vscode-sidebar">
          <div className="flex items-center gap-2 bg-vscode-active border border-vscode-border rounded-lg px-3 py-2">
            <button
              className="flex items-center gap-1 text-xs text-vscode-text-secondary hover:text-vscode-text transition-colors"
              aria-label="Auto mode"
            >
              <Infinity size={14} />
              <ChevronRight size={10} className="rotate-90" />
            </button>
            <select className="text-xs bg-transparent border-none text-vscode-text-secondary hover:text-vscode-text focus:outline-none cursor-pointer">
              <option>Auto</option>
            </select>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add a follow-up"
                className="w-full bg-transparent border-none text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none"
                aria-label="Ask a question"
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={`p-1.5 hover:bg-vscode-hover rounded transition-colors ${
                  isListening ? 'bg-vscode-blue text-white' : 'text-vscode-text-secondary hover:text-vscode-text'
                }`}
                aria-label="Voice input"
                title="Voice input"
              >
                <Mic size={14} />
              </button>
              <button
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                aria-label="Mention"
              >
                <AtSign size={14} />
              </button>
              <button
                className="p-1.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                aria-label="Attach"
              >
                <ImageIcon size={14} />
              </button>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-1.5 bg-vscode-text hover:bg-vscode-text-secondary disabled:opacity-50 disabled:cursor-not-allowed text-vscode-bg rounded transition-colors"
                aria-label="Send"
              >
                <Square size={12} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

