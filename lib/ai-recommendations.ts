/**
 * AI-Powered Recommendation System
 * Provides personalized recommendations based on visitor behavior and portfolio content
 */

import { portfolioData } from './portfolio-data'
import { recommendationsData } from './recommendations-data'
import { aiAnalytics, VisitorInteraction } from './ai-analytics'

export interface Recommendation {
  id: string
  type: 'project' | 'skill' | 'section' | 'action' | 'content'
  title: string
  description: string
  priority: number
  reason: string
  action?: () => void
}

export class RecommendationEngine {
  private visitorInteractions: VisitorInteraction[] = []

  updateInteractions(interactions: VisitorInteraction[]): void {
    this.visitorInteractions = interactions
  }

  generateRecommendations(visitorProfile?: string, currentIntent?: string): Recommendation[] {
    const recommendations: Recommendation[] = []
    const recentInteractions = this.visitorInteractions.slice(-10)

    // Profile-based recommendations
    if (visitorProfile === 'recruiter') {
      recommendations.push({
        id: 'recruiter-resume',
        type: 'action',
        title: 'Download Resume',
        description: 'Get detailed resume with complete work history',
        priority: 10,
        reason: 'Recruiters typically need resume for evaluation'
      })
      recommendations.push({
        id: 'recruiter-skills',
        type: 'skill',
        title: 'Technical Skills Overview',
        description: 'View comprehensive skills alignment',
        priority: 9,
        reason: 'Skills matching is crucial for recruiters'
      })
    }

    if (visitorProfile === 'developer') {
      recommendations.push({
        id: 'dev-projects',
        type: 'project',
        title: 'Project Case Studies',
        description: 'Explore detailed project implementations',
        priority: 10,
        reason: 'Developers want to see code and architecture'
      })
      recommendations.push({
        id: 'dev-github',
        type: 'action',
        title: 'View GitHub',
        description: 'Check out code repositories',
        priority: 9,
        reason: 'Developers prefer code samples'
      })
    }

    // Intent-based recommendations
    if (currentIntent === 'projects') {
      recommendations.push({
        id: 'project-skills',
        type: 'skill',
        title: 'Technologies Used',
        description: 'See all technologies in these projects',
        priority: 8,
        reason: 'Related to current interest'
      })
    }

    if (currentIntent === 'skills') {
      recommendations.push({
        id: 'skills-projects',
        type: 'project',
        title: 'Projects Using These Skills',
        description: 'See projects that demonstrate these skills',
        priority: 8,
        reason: 'Shows practical application'
      })
    }

    // Pattern-based recommendations
    const projectQueries = recentInteractions.filter(i => 
      i.data.intent === 'projects' || i.data.query?.toLowerCase().includes('project')
    ).length

    if (projectQueries > 2) {
      recommendations.push({
        id: 'deep-dive-projects',
        type: 'project',
        title: 'Detailed Project Analysis',
        description: 'Get in-depth project breakdowns',
        priority: 7,
        reason: 'High interest in projects detected'
      })
    }

    // Popular content recommendations
    recommendations.push({
      id: 'testimonials',
      type: 'content',
      title: 'Client Testimonials',
      description: `Read ${recommendationsData.length} professional recommendations`,
      priority: 6,
      reason: 'Social proof and credibility'
    })

    recommendations.push({
      id: 'achievements',
      type: 'content',
      title: 'Awards & Certifications',
      description: `View ${portfolioData.achievements.length} awards and ${portfolioData.certifications.length} certifications`,
      priority: 5,
      reason: 'Demonstrates expertise and recognition'
    })

    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5)
  }

  getPersonalizedCTA(visitorProfile?: string): string {
    if (visitorProfile === 'recruiter') {
      return 'Schedule an interview or request more information'
    }
    if (visitorProfile === 'developer') {
      return 'Connect on GitHub or collaborate on projects'
    }
    if (visitorProfile === 'client') {
      return 'Discuss project requirements or get a quote'
    }
    return 'Get in touch or explore more portfolio content'
  }

  suggestNextSteps(currentSection: string, visitorProfile?: string): string[] {
    const steps: string[] = []

    switch (currentSection) {
      case 'about':
        steps.push('Explore projects', 'View technical skills', 'Check work experience')
        break
      case 'projects':
        steps.push('View technologies used', 'Check GitHub repositories', 'Read testimonials')
        break
      case 'skills':
        steps.push('See projects using these skills', 'View certifications', 'Check experience')
        break
      case 'experience':
        steps.push('Explore related projects', 'View achievements', 'Download resume')
        break
      default:
        steps.push('Explore projects', 'View skills', 'Check contact information')
    }

    if (visitorProfile === 'recruiter') {
      steps.push('Download resume', 'View LinkedIn profile')
    }

    return steps
  }
}

export const recommendationEngine = new RecommendationEngine()

