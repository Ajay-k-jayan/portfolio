/**
 * AI Analytics and Machine Learning Module
 * Tracks visitor behavior, analyzes interactions, and provides personalized recommendations
 */

export interface VisitorInteraction {
  id: string
  timestamp: string
  type: 'query' | 'navigation' | 'download' | 'click' | 'voice'
  data: {
    query?: string
    intent?: string
    section?: string
    action?: string
    duration?: number
  }
  visitorProfile?: 'recruiter' | 'developer' | 'client' | 'general'
  sentiment?: 'positive' | 'neutral' | 'negative' | 'professional'
}

export interface VisitorAnalytics {
  totalInteractions: number
  uniqueVisitors: number
  averageSessionDuration: number
  topIntents: Array<{ intent: string; count: number }>
  topSections: Array<{ section: string; views: number }>
  visitorProfiles: Record<string, number>
  sentimentDistribution: Record<string, number>
  recommendations: string[]
}

class AIAnalytics {
  private storageKey = 'portfolio_ai_analytics'
  private visitorId: string
  private sessionStart: Date

  constructor() {
    this.visitorId = this.getOrCreateVisitorId()
    this.sessionStart = new Date()
  }

  private getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let visitorId = localStorage.getItem('portfolio_visitor_id')
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('portfolio_visitor_id', visitorId)
    }
    return visitorId
  }

  trackInteraction(interaction: Omit<VisitorInteraction, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return

    const fullInteraction: VisitorInteraction = {
      ...interaction,
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }

    try {
      const existing = this.getStoredInteractions()
      existing.push(fullInteraction)
      
      // Keep only last 1000 interactions for privacy
      const trimmed = existing.slice(-1000)
      localStorage.setItem(this.storageKey, JSON.stringify(trimmed))
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }

  private getStoredInteractions(): VisitorInteraction[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  getAnalytics(): VisitorAnalytics {
    const interactions = this.getStoredInteractions()
    
    // Calculate metrics
    const uniqueVisitors = new Set(interactions.map(i => i.id.split('_')[1])).size
    const totalInteractions = interactions.length
    
    // Top intents
    const intentCounts: Record<string, number> = {}
    interactions.forEach(i => {
      if (i.data.intent) {
        intentCounts[i.data.intent] = (intentCounts[i.data.intent] || 0) + 1
      }
    })
    const topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top sections
    const sectionCounts: Record<string, number> = {}
    interactions.forEach(i => {
      if (i.data.section) {
        sectionCounts[i.data.section] = (sectionCounts[i.data.section] || 0) + 1
      }
    })
    const topSections = Object.entries(sectionCounts)
      .map(([section, views]) => ({ section, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Visitor profiles
    const profileCounts: Record<string, number> = {}
    interactions.forEach(i => {
      if (i.visitorProfile) {
        profileCounts[i.visitorProfile] = (profileCounts[i.visitorProfile] || 0) + 1
      }
    })

    // Sentiment distribution
    const sentimentCounts: Record<string, number> = {}
    interactions.forEach(i => {
      if (i.sentiment) {
        sentimentCounts[i.sentiment] = (sentimentCounts[i.sentiment] || 0) + 1
      }
    })

    // Calculate average session duration
    const durations = interactions
      .filter(i => i.data.duration)
      .map(i => i.data.duration!)
    const averageSessionDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0

    // Generate recommendations based on patterns
    const recommendations = this.generateRecommendations(interactions)

    return {
      totalInteractions,
      uniqueVisitors,
      averageSessionDuration,
      topIntents,
      topSections,
      visitorProfiles: profileCounts,
      sentimentDistribution: sentimentCounts,
      recommendations
    }
  }

  private generateRecommendations(interactions: VisitorInteraction[]): string[] {
    const recommendations: string[] = []
    
    // Analyze patterns
    const recentInteractions = interactions.slice(-20)
    const intents = recentInteractions
      .map(i => i.data.intent)
      .filter(Boolean) as string[]
    
    // Recommend based on popular intents
    if (intents.includes('projects')) {
      recommendations.push('Explore detailed project case studies')
    }
    if (intents.includes('skills')) {
      recommendations.push('View technical skills breakdown')
    }
    if (intents.includes('contact')) {
      recommendations.push('Download resume or connect on LinkedIn')
    }
    
    // Check for recruiter pattern
    const hasRecruiter = recentInteractions.some(i => i.visitorProfile === 'recruiter')
    if (hasRecruiter) {
      recommendations.push('View availability and interview readiness')
    }

    return recommendations.length > 0 ? recommendations : ['Explore portfolio sections', 'View projects', 'Check skills']
  }

  predictInterest(interactions: VisitorInteraction[]): string[] {
    // Simple ML-based prediction using pattern recognition
    const recent = interactions.slice(-10)
    const interests: string[] = []
    
    const projectQueries = recent.filter(i => 
      i.data.query?.toLowerCase().includes('project') || 
      i.data.intent === 'projects'
    ).length
    
    const skillQueries = recent.filter(i => 
      i.data.query?.toLowerCase().includes('skill') || 
      i.data.intent === 'skills'
    ).length
    
    if (projectQueries > skillQueries) {
      interests.push('projects', 'case studies', 'technologies')
    } else {
      interests.push('skills', 'expertise', 'technologies')
    }
    
    return interests
  }

  // Privacy-compliant data export (anonymized)
  exportAnonymizedData(): string {
    const interactions = this.getStoredInteractions()
    const anonymized = interactions.map(i => ({
      type: i.type,
      timestamp: i.timestamp,
      intent: i.data.intent,
      section: i.data.section,
      // Remove any personally identifiable information
    }))
    
    return JSON.stringify(anonymized, null, 2)
  }

  // Clear all analytics (GDPR compliance)
  clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem('portfolio_visitor_id')
    }
  }
}

export const aiAnalytics = new AIAnalytics()

