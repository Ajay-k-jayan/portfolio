'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Send, Bot, User, Sparkles, Download,
  Linkedin, Github, Mail, ChevronRight,
  FileText, Command, Briefcase, Code, Award,
  MessageSquare, Globe, Mic, Volume2
} from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { recommendationsData } from '@/lib/recommendations-data'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/contexts/language-context'
import { aiAnalytics } from '@/lib/ai-analytics'
import { recommendationEngine } from '@/lib/ai-recommendations'

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

// NLP: Enhanced Intent Result with Confidence
interface IntentResult {
  intent: Intent
  confidence: number
  alternativeIntents?: Array<{ intent: Intent; confidence: number }>
}

// NLP: Enhanced Sentiment Result
interface SentimentResult {
  sentiment: Sentiment
  intensity: number
  emotions?: string[]
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
  const [navigationNotification, setNavigationNotification] = useState<{ menuId: string; label: string } | null>(null)
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
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    try {
      inputRef.current?.focus()
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow || 'unset'
      }
    } catch (error) {
      console.error('Error setting up AI assistant:', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        if (e.key === 'Escape') onClose()
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault()
          setInput('/')
          inputRef.current?.focus()
        }
      } catch (error) {
        console.error('Error handling keyboard event:', error)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  // NLP: Enhanced Intent Recognition with Confidence Scoring
  const recognizeIntent = useCallback((text: string, context?: DialogueState): IntentResult => {
    const lower = text.toLowerCase().trim()
    const intents: Array<{ intent: Intent; confidence: number }> = []
    
    // Greeting patterns with confidence
    const greetingPatterns = [
      /\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|hi there|hey there)\b/i,
      /^(hi|hello|hey)[\s!.,]*$/i
    ]
    if (greetingPatterns.some(p => p.test(text))) {
      intents.push({ intent: Intent.GREETING, confidence: 0.95 })
    }
    
    // About patterns
    const aboutPatterns = [
      /\b(about|who|background|introduce|bio|tell me about|who is|who are)\b/i,
      /^(who|what) (is|are) (you|he|this|your)/i,
      /\b(biography|introduction|overview|summary)\b/i
    ]
    const aboutMatches = aboutPatterns.filter(p => p.test(text)).length
    if (aboutMatches > 0) {
      intents.push({ intent: Intent.ABOUT, confidence: 0.7 + (aboutMatches * 0.1) })
    }
    
    // Projects patterns
    const projectPatterns = [
      /\b(project|projects|portfolio|aurex|case study|work sample|showcase)\b/i,
      /\b(what projects|tell me about projects|show projects|project details)\b/i,
      /\b(built|developed|created|designed).*(project|application|app|website)\b/i
    ]
    const projectMatches = projectPatterns.filter(p => p.test(text)).length
    if (projectMatches > 0) {
      intents.push({ intent: Intent.PROJECTS, confidence: 0.75 + (projectMatches * 0.08) })
    }
    
    // Skills patterns
    const skillPatterns = [
      /\b(skill|skills|technology|tech|expertise|proficient|know|familiar|experience with)\b/i,
      /\b(angular|next\.js|tailwind|rxjs|typescript|javascript|d3\.js|websockets|react|vue)\b/i,
      /\b(what.*skills|technical skills|technologies|tech stack|programming languages)\b/i
    ]
    const skillMatches = skillPatterns.filter(p => p.test(text)).length
    if (skillMatches > 0) {
      intents.push({ intent: Intent.SKILLS, confidence: 0.8 + (skillMatches * 0.07) })
    }
    
    // Experience patterns
    const experiencePatterns = [
      /\b(experience|work history|career|job|position|role|employment|worked|work at)\b/i,
      /\b(where.*work|current job|previous job|work experience|career history)\b/i,
      /\b(company|employer|organization)\b/i
    ]
    const expMatches = experiencePatterns.filter(p => p.test(text)).length
    if (expMatches > 0) {
      intents.push({ intent: Intent.EXPERIENCE, confidence: 0.75 + (expMatches * 0.08) })
    }
    
    // Contact patterns
    const contactPatterns = [
      /\b(contact|email|phone|reach|hire|connect|linkedin|github|get in touch|reach out)\b/i,
      /\b(how.*contact|contact information|contact details|email address|phone number)\b/i,
      /\b(social media|social links|professional profile)\b/i
    ]
    const contactMatches = contactPatterns.filter(p => p.test(text)).length
    if (contactMatches > 0) {
      intents.push({ intent: Intent.CONTACT, confidence: 0.8 + (contactMatches * 0.07) })
    }
    
    // Achievements patterns
    const achievementPatterns = [
      /\b(achievement|achievements|award|certification|certifications|recognition|accomplishment)\b/i,
      /\b(certified|certificate|badge|credential|qualification)\b/i,
      /\b(what.*achievements|show.*certifications|awards.*received)\b/i
    ]
    const achievementMatches = achievementPatterns.filter(p => p.test(text)).length
    if (achievementMatches > 0) {
      intents.push({ intent: Intent.ACHIEVEMENTS, confidence: 0.75 + (achievementMatches * 0.08) })
    }
    
    // Testimonials patterns
    const testimonialPatterns = [
      /\b(testimonial|testimonials|recommendation|recommendations|review|reviews|feedback|reference)\b/i,
      /\b(what.*people.*say|colleague.*say|recommendations|endorsements)\b/i
    ]
    const testimonialMatches = testimonialPatterns.filter(p => p.test(text)).length
    if (testimonialMatches > 0) {
      intents.push({ intent: Intent.TESTIMONIALS, confidence: 0.7 + (testimonialMatches * 0.1) })
    }
    
    // Resume patterns
    const resumePatterns = [
      /\b(resume|cv|curriculum vitae|download.*resume|get.*resume|resume.*pdf)\b/i,
      /\b(download.*cv|get.*cv|view.*resume|see.*resume)\b/i
    ]
    const resumeMatches = resumePatterns.filter(p => p.test(text)).length
    if (resumeMatches > 0) {
      intents.push({ intent: Intent.RESUME, confidence: 0.85 + (resumeMatches * 0.1) })
    }
    
    // Walkthrough patterns
    const walkthroughPatterns = [
      /\b(walkthrough|tour|guide|show around|introduction|onboarding|help me navigate)\b/i,
      /\b(how.*use|how.*navigate|show me around|guide me|tutorial)\b/i
    ]
    const walkthroughMatches = walkthroughPatterns.filter(p => p.test(text)).length
    if (walkthroughMatches > 0) {
      intents.push({ intent: Intent.WALKTHROUGH, confidence: 0.75 + (walkthroughMatches * 0.1) })
    }
    
    // Recruiter patterns
    const recruiterPatterns = [
      /\b(recruiter|hiring|available|interview|position|role|job|opportunity|open.*position)\b/i,
      /\b(looking.*hire|hiring.*developer|job opening|career opportunity|available.*work)\b/i,
      /\b(interested.*hiring|want.*hire|need.*developer|recruiting)\b/i
    ]
    const recruiterMatches = recruiterPatterns.filter(p => p.test(text)).length
    if (recruiterMatches > 0) {
      intents.push({ intent: Intent.RECRUITER, confidence: 0.8 + (recruiterMatches * 0.08) })
    }
    
    // Context-based boosting
    if (context?.lastIntent) {
      intents.forEach(intent => {
        if (intent.intent === context.lastIntent) {
          intent.confidence += 0.15
        }
      })
    }
    
    // Sort by confidence
    intents.sort((a, b) => b.confidence - a.confidence)
    
    if (intents.length === 0) {
      return { intent: Intent.UNKNOWN, confidence: 0.1 }
    }
    
    const topIntent = intents[0]
    const alternativeIntents = intents.slice(1, 3).map(i => ({
      intent: i.intent,
      confidence: i.confidence
    }))
    
    return {
      intent: topIntent.intent,
      confidence: Math.min(topIntent.confidence, 0.99),
      alternativeIntents: alternativeIntents.length > 0 ? alternativeIntents : undefined
    }
  }, [])

  // NLP: Enhanced Entity Extraction with NER
  const extractEntities = useCallback((text: string, context?: DialogueState): Entity[] => {
    const entities: Entity[] = []
    const lower = text.toLowerCase()
    
    // Enhanced technology extraction with aliases
    const technologyMap: Record<string, { value: string; confidence: number; aliases: string[] }> = {
      'angular': { value: 'Angular', confidence: 0.95, aliases: ['angular', 'angularjs', 'angular.js'] },
      'next.js': { value: 'Next.js', confidence: 0.95, aliases: ['next.js', 'nextjs', 'next'] },
      'react': { value: 'React', confidence: 0.9, aliases: ['react', 'reactjs', 'react.js'] },
      'typescript': { value: 'TypeScript', confidence: 0.95, aliases: ['typescript', 'ts'] },
      'javascript': { value: 'JavaScript', confidence: 0.9, aliases: ['javascript', 'js', 'ecmascript'] },
      'tailwind': { value: 'Tailwind CSS', confidence: 0.9, aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
      'rxjs': { value: 'RxJS', confidence: 0.9, aliases: ['rxjs', 'reactive extensions'] },
      'd3.js': { value: 'D3.js', confidence: 0.9, aliases: ['d3.js', 'd3js', 'd3'] },
      'websockets': { value: 'WebSockets', confidence: 0.9, aliases: ['websockets', 'websocket', 'ws'] },
      'node.js': { value: 'Node.js', confidence: 0.9, aliases: ['node.js', 'nodejs', 'node'] },
      'vue': { value: 'Vue.js', confidence: 0.85, aliases: ['vue', 'vuejs', 'vue.js'] }
    }
    
    Object.entries(technologyMap).forEach(([key, tech]) => {
      const found = tech.aliases.some(alias => {
        const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        return regex.test(text)
      })
      if (found) {
        entities.push({ type: 'technology', value: tech.value, confidence: tech.confidence })
      }
    })
    
    // Enhanced project extraction
    const projectMap: Record<string, { value: string; confidence: number }> = {
      'aurex': { value: 'Aurex', confidence: 0.95 },
      'portfolio': { value: 'Portfolio', confidence: 0.7 }
    }
    
    Object.entries(projectMap).forEach(([key, project]) => {
      if (lower.includes(key)) {
        entities.push({ type: 'project', value: project.value, confidence: project.confidence })
      }
    })
    
    // Enhanced skill extraction
    const skillMap: Record<string, { value: string; confidence: number }> = {
      'frontend': { value: 'Frontend Development', confidence: 0.9 },
      'front-end': { value: 'Frontend Development', confidence: 0.9 },
      'backend': { value: 'Backend Development', confidence: 0.9 },
      'back-end': { value: 'Backend Development', confidence: 0.9 },
      'fullstack': { value: 'Full-stack Development', confidence: 0.9 },
      'full-stack': { value: 'Full-stack Development', confidence: 0.9 },
      'ui/ux': { value: 'UI/UX Design', confidence: 0.85 },
      'ui': { value: 'UI Design', confidence: 0.8 },
      'ux': { value: 'UX Design', confidence: 0.8 },
      'design': { value: 'Design', confidence: 0.75 }
    }
    
    Object.entries(skillMap).forEach(([key, skill]) => {
      if (lower.includes(key)) {
        entities.push({ type: 'skill', value: skill.value, confidence: skill.confidence })
      }
    })
    
    // Company extraction
    const companyMap: Record<string, { value: string; confidence: number }> = {
      'beinex': { value: 'Beinex', confidence: 0.95 }
    }
    
    Object.entries(companyMap).forEach(([key, company]) => {
      if (lower.includes(key)) {
        entities.push({ type: 'company', value: company.value, confidence: company.confidence })
      }
    })
    
    // Date extraction
    const datePatterns = [
      /\b(\d{4})\b/g,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi
    ]
    
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          entities.push({ type: 'date', value: match, confidence: 0.7 })
        })
      }
    })
    
    // Person name extraction
    if (lower.includes(portfolioData.profile.name.toLowerCase())) {
      entities.push({ type: 'person', value: portfolioData.profile.name, confidence: 0.9 })
    }
    
    // Remove duplicates and boost from context
    const uniqueEntities = new Map<string, Entity>()
    entities.forEach(entity => {
      const key = `${entity.type}:${entity.value.toLowerCase()}`
      if (!uniqueEntities.has(key) || uniqueEntities.get(key)!.confidence < entity.confidence) {
        uniqueEntities.set(key, entity)
      }
    })
    
    // Boost confidence from context
    if (context?.entities) {
      uniqueEntities.forEach((entity) => {
        const contextEntity = context.entities.find(e => 
          e.type === entity.type && e.value.toLowerCase() === entity.value.toLowerCase()
        )
        if (contextEntity) {
          entity.confidence = Math.min(entity.confidence + 0.1, 0.99)
        }
      })
    }
    
    return Array.from(uniqueEntities.values())
  }, [])

  // NLP: Enhanced Sentiment Analysis with Intensity
  const analyzeSentiment = useCallback((text: string, intent: Intent): SentimentResult => {
    const lower = text.toLowerCase()
    
    if (intent === Intent.RECRUITER) {
      return { sentiment: Sentiment.PROFESSIONAL, intensity: 0.8, emotions: ['professional', 'formal'] }
    }
    
    // Enhanced positive words with intensity
    const positiveWords: Record<string, number> = {
      'excellent': 0.9, 'amazing': 0.9, 'fantastic': 0.85, 'wonderful': 0.8,
      'great': 0.75, 'impressive': 0.8, 'love': 0.85, 'awesome': 0.8,
      'brilliant': 0.9, 'outstanding': 0.85, 'perfect': 0.9, 'superb': 0.85,
      'incredible': 0.85, 'remarkable': 0.8, 'exceptional': 0.85
    }
    
    // Enhanced negative words with intensity
    const negativeWords: Record<string, number> = {
      'terrible': 0.9, 'awful': 0.85, 'hate': 0.9, 'disappointed': 0.75,
      'bad': 0.7, 'poor': 0.7, 'worst': 0.85, 'horrible': 0.85,
      'frustrated': 0.75, 'annoyed': 0.7
    }
    
    // Emotion detection
    const emotions: string[] = []
    const emotionMap: Record<string, string[]> = {
      'excited': ['excited', 'enthusiastic', 'eager'],
      'curious': ['curious', 'interested', 'wondering'],
      'professional': ['professional', 'formal', 'business'],
      'friendly': ['friendly', 'casual', 'informal'],
      'concerned': ['concerned', 'worried', 'anxious']
    }
    
    Object.entries(emotionMap).forEach(([emotion, keywords]) => {
      if (keywords.some(kw => lower.includes(kw))) {
        emotions.push(emotion)
      }
    })
    
    // Calculate sentiment and intensity
    let positiveScore = 0
    let negativeScore = 0
    let maxPositiveIntensity = 0
    let maxNegativeIntensity = 0
    
    Object.entries(positiveWords).forEach(([word, intensity]) => {
      if (lower.includes(word)) {
        positiveScore += intensity
        maxPositiveIntensity = Math.max(maxPositiveIntensity, intensity)
        if (!emotions.includes('excited')) emotions.push('excited')
      }
    })
    
    Object.entries(negativeWords).forEach(([word, intensity]) => {
      if (lower.includes(word)) {
        negativeScore += intensity
        maxNegativeIntensity = Math.max(maxNegativeIntensity, intensity)
        if (!emotions.includes('concerned')) emotions.push('concerned')
      }
    })
    
    // Determine sentiment
    let sentiment: Sentiment
    let intensity: number
    
    if (positiveScore > negativeScore && positiveScore > 0) {
      sentiment = Sentiment.POSITIVE
      intensity = Math.min(maxPositiveIntensity + (positiveScore / 10), 1.0)
    } else if (negativeScore > positiveScore && negativeScore > 0) {
      sentiment = Sentiment.NEGATIVE
      intensity = Math.min(maxNegativeIntensity + (negativeScore / 10), 1.0)
    } else {
      sentiment = Sentiment.NEUTRAL
      intensity = 0.5
    }
    
    // Punctuation affects intensity
    const exclamationCount = (text.match(/!/g) || []).length
    if (exclamationCount > 0 && sentiment === Sentiment.POSITIVE) {
      intensity = Math.min(intensity + (exclamationCount * 0.1), 1.0)
    }
    
    if (emotions.length === 0) {
      emotions.push('neutral')
    }
    
    return { sentiment, intensity, emotions }
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

  // NLG: Enhanced Response Generation with Context Awareness
  const generateResponse = useCallback((userInput: string, state: DialogueState): {
    content: string
    suggestions?: string[]
    quickActions?: QuickAction[]
    walkthrough?: WalkthroughStep[]
    navigateTo?: string
    intent: Intent
    sentiment: Sentiment
  } => {
    const intentResult = recognizeIntent(userInput, state)
    const intent = intentResult.intent
    const entities = extractEntities(userInput, state)
    const sentimentResult = analyzeSentiment(userInput, intent)
    const sentiment = sentimentResult.sentiment
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
        const projectEntity = entities.find(e => e.type === 'project')
        if (projectEntity) {
          suggestions = [
            'What challenges were solved?',
            'What are the key features?',
            'Tell me about the technology stack',
            'What was the project impact?'
          ]
        } else {
          suggestions = [
            'Tell me about Aurex in detail',
            'What technologies are used?',
            'What were the project challenges?',
            'Show project outcomes and impact'
          ]
        }
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

    // Apply tone customization with enhanced NLG
    content = customizeTone(content, profile, sentiment)
    
    // Enhance response based on sentiment intensity and emotions
    if (sentimentResult.intensity > 0.7 && sentimentResult.emotions) {
      if (sentiment === Sentiment.POSITIVE && sentimentResult.emotions.includes('excited')) {
        content = content.replace(/^/, 'Great question! ')
      }
    }
    
    // Add confidence indicator for low-confidence intents (subtle, doesn't change UI structure)
    if (intentResult.confidence < 0.6 && intent !== Intent.UNKNOWN) {
      // Only add subtle hint, don't change UI
      const confidenceHint = `\n\n*Note: I'm interpreting this as a question about ${intent}.*`
      content = content + confidenceHint
    }

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
    const mentionedProject = entities.find(e => e.type === 'project')
    const mentionedTech = entities.find(e => e.type === 'technology')
    
    // If specific project mentioned, provide detailed information
    if (mentionedProject) {
      const project = projects.find(p => 
        p.name.toLowerCase().includes(mentionedProject.value.toLowerCase()) ||
        p.title?.toLowerCase().includes(mentionedProject.value.toLowerCase())
      ) || projects[0]
      
      return `**${project.name || project.title} - Complete Project Overview**\n\n**Project Description:**\n${project.description}\n\n**Project Duration:**\n${project.period}\n\n**Technology Stack:**\n${project.technologies?.map(tech => `• **${tech}** - ${getTechUsage(tech, project)}`).join('\n') || 'N/A'}\n\n**Key Features & Capabilities:**\n• Cloud-based analytics platform with scalable architecture\n• Integrated risk management and audit management systems\n• Real-time data processing and synchronization using WebSockets\n• Advanced reporting capabilities with custom data fields\n• Responsive UI built with Angular Material components\n• Interactive data visualizations using D3.js\n• Modular, reusable component architecture\n• Performance optimizations including lazy loading and caching\n\n**Project Objectives:**\n• Streamline risk and audit analytics workflows\n• Provide real-time insights and reporting\n• Enhance user experience with intuitive interfaces\n• Enable scalable data processing and visualization\n\n**Technical Challenges Solved:**\n• Implemented complex data visualization requirements using D3.js\n• Built real-time communication layer with WebSockets\n• Created modular components for maintainability\n• Optimized performance with lazy loading strategies\n• Developed custom reporting logic and data field management\n\n**Outcomes & Impact:**\n• Successfully delivered cloud-based platform in production\n• Improved data processing efficiency\n• Enhanced user experience with responsive design\n• Contributed to company growth through innovative solutions\n\n**Related Skills:**\nAngular, TypeScript, D3.js, WebSockets, Angular Material, Component Architecture, State Management, Performance Optimization\n\nWould you like more details about specific technologies, features, or implementation approaches?`
    }
    
    // General projects overview
    return `**Featured Projects - Complete Portfolio**\n\n${projects.map(p => `**${p.name || p.title}**\n\n**Description:**\n${p.description}\n\n**Project Duration:**\n${p.period}\n\n**Technology Stack:**\n${p.technologies?.map(tech => `• ${tech}`).join('\n') || 'N/A'}\n\n**Key Features:**\n• Cloud-based analytics platform\n• Risk and audit management integration\n• Real-time data processing with WebSockets\n• Advanced reporting capabilities\n• Responsive UI with Angular Material\n• Interactive data visualizations using D3.js\n• Modular component architecture\n• Performance optimizations\n\n**Project Impact:**\n• Delivered production-ready platform\n• Improved workflow efficiency\n• Enhanced user experience\n• Contributed to business growth`).join('\n\n---\n\n')}${mentionedTech ? `\n\n*I noticed you're interested in **${mentionedTech.value}**. This technology is extensively used in these projects for ${getTechUsage(mentionedTech.value, projects[0])}.*` : ''}\n\n**Want to know more?** Ask about:\n• Specific project details (e.g., "Tell me about Aurex")\n• Technology usage (e.g., "How is Angular used?")\n• Project challenges and solutions\n• Implementation approaches`
  }

  const getTechUsage = (tech: string, project?: any): string => {
    const usage: Record<string, string> = {
      'Angular': 'building component-based frontend architecture, state management, and reactive forms',
      'TypeScript': 'type-safe development, interfaces, and modern ES6+ features',
      'D3.js': 'interactive data visualizations, charts, and dynamic graphics',
      'WebSockets': 'real-time bidirectional communication, live data updates, and instant synchronization',
      'Next.js': 'server-side rendering, API routes, and full-stack React applications',
      'Tailwind CSS': 'utility-first styling, responsive design, and rapid UI development',
      'RxJS': 'reactive programming, observables, and asynchronous data streams',
      'JavaScript': 'core programming logic, DOM manipulation, and client-side functionality'
    }
    return usage[tech] || 'core functionality and features'
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

  // Direct navigation handler (defined early for use in quick actions)
  const handleDirectNavigation = (menuId: string, label: string) => {
    setActiveMenuItem(menuId)
    setNavigationNotification(null)
    // Close assistant after a brief delay for smooth transition
    setTimeout(() => onClose(), 300)
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
        try {
          if (typeof window !== 'undefined' && portfolioData?.profile?.linkedin) {
            window.open(portfolioData.profile.linkedin, '_blank', 'noopener noreferrer')
            addMessage('assistant', 'Opening LinkedIn profile...')
          } else {
            addMessage('assistant', 'LinkedIn profile not available.')
          }
        } catch (error) {
          console.error('Error opening LinkedIn:', error)
          addMessage('assistant', 'Failed to open LinkedIn profile.')
        }
      }
    },
    {
      id: 'github',
      label: 'View GitHub',
      icon: <Github size={16} />,
      type: 'external',
      action: () => {
        try {
          if (typeof window !== 'undefined' && portfolioData?.profile?.github) {
            window.open(portfolioData.profile.github, '_blank', 'noopener noreferrer')
            addMessage('assistant', 'Opening GitHub profile...')
          } else {
            addMessage('assistant', 'GitHub profile not available.')
          }
        } catch (error) {
          console.error('Error opening GitHub:', error)
          addMessage('assistant', 'Failed to open GitHub profile.')
        }
      }
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail size={16} />,
      type: 'contact',
      action: () => handleDirectNavigation('contact', 'Contact')
    }
  ]

  const getProjectQuickActions = (): QuickAction[] => [
    ...getContactQuickActions(),
    {
      id: 'view-project',
      label: 'View Project Details',
      icon: <Briefcase size={16} />,
      type: 'navigate',
      action: () => handleDirectNavigation('project', 'Projects')
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

    // Track interaction for analytics
    aiAnalytics.trackInteraction({
      type: 'query',
      data: {
        query: userInput,
        intent: undefined, // Will be set after intent recognition
      },
      visitorProfile: dialogueState.visitorProfile,
      sentiment: undefined
    })

    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(userInput, dialogueState)
      
      // Update analytics with recognized intent
      aiAnalytics.trackInteraction({
        type: 'query',
        data: {
          query: userInput,
          intent: response.intent,
          section: response.navigateTo
        },
        visitorProfile: dialogueState.visitorProfile,
        sentiment: response.sentiment
      })

      // Get ML-based recommendations
      const recentInteractions = aiAnalytics.getStoredInteractions().slice(-10)
      recommendationEngine.updateInteractions(recentInteractions)

      const aiRecommendations = recommendationEngine.generateRecommendations(
        dialogueState.visitorProfile,
        response.intent
      )

      // Enhance suggestions with ML recommendations
      const enhancedSuggestions = [
        ...(response.suggestions || []),
        ...aiRecommendations.slice(0, 2).map(r => r.title)
      ]

      addMessage('assistant', response.content, response.intent, response.sentiment, enhancedSuggestions, response.quickActions)
      setIsTyping(false)

      if (response.navigateTo) {
        const menuLabel = menuItemLabels[response.navigateTo] || response.navigateTo
        // Show subtle notification instead of blocking dialog
        setNavigationNotification({ menuId: response.navigateTo, label: menuLabel })
        // Auto-hide notification after 3 seconds
        setTimeout(() => setNavigationNotification(null), 3000)
      }
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') {
      if (navigationNotification) setNavigationNotification(null)
      else onClose()
    }
  }

  // Voice Recognition (Web Speech API)
  const startVoiceRecognition = () => {
    try {
      if (typeof window === 'undefined') {
        addMessage('assistant', 'Voice recognition requires a browser environment.')
        return
      }

      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addMessage('assistant', 'Voice recognition is not supported in your browser.')
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        addMessage('assistant', 'Voice recognition is not available.')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language || 'en-US'

      setIsListening(true)

      recognition.onresult = (event: any) => {
        try {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsListening(false)
            handleSend(transcript)
          }
        } catch (error) {
          console.error('Error processing voice result:', error)
          setIsListening(false)
        }
      }

      recognition.onerror = (event: any) => {
        setIsListening(false)
        const errorMsg = event.error === 'no-speech' 
          ? 'No speech detected. Please try again.'
          : event.error === 'not-allowed'
          ? 'Microphone permission denied.'
          : 'Voice recognition error. Please try again.'
        addMessage('assistant', errorMsg)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error('Error starting voice recognition:', error)
      setIsListening(false)
      addMessage('assistant', 'Failed to start voice recognition.')
    }
  }

  const exportConversation = () => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        addMessage('assistant', 'Export not available in this environment.')
        return
      }

      const transcript = messages.map(m => 
        `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`
      ).join('\n\n')
      
      const blob = new Blob([transcript], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `portfolio-chat-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      addMessage('assistant', 'Conversation exported successfully!')
    } catch (error) {
      console.error('Error exporting conversation:', error)
      addMessage('assistant', 'Failed to export conversation.')
    }
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

        {/* Subtle Navigation Notification */}
        <AnimatePresence>
          {navigationNotification && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-16 left-3 right-3 z-[101]"
            >
              <div className="bg-vscode-active border border-vscode-border rounded-md px-2.5 py-1.5 shadow-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <ChevronRight size={11} className="text-vscode-text-secondary flex-shrink-0" />
                  <span className="text-[11px] text-vscode-text-secondary truncate">
                    Navigate to <span className="text-vscode-text font-medium">{navigationNotification.label}</span>?
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDirectNavigation(navigationNotification.menuId, navigationNotification.label)}
                    className="px-2 py-0.5 bg-vscode-blue hover:bg-blue-600 text-white rounded text-[10px] font-medium transition-colors"
                  >
                    Go
                  </button>
                  <button
                    onClick={() => setNavigationNotification(null)}
                    className="p-0.5 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={11} />
                  </button>
                </div>
                </div>
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
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
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
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-1.5 bg-vscode-text hover:bg-vscode-text-secondary disabled:opacity-50 disabled:cursor-not-allowed text-vscode-bg rounded transition-colors"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

