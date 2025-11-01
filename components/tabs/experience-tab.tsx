'use client'

import { Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface Experience {
  id: string
  title: string
  company: string
  period: string
  location?: string
  description: string
  achievements: string[]
  technologies: string[]
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Beinex',
    period: 'Sep 2023 – Present',
    location: 'Kerala, India',
    description: 'Leading front-end development initiatives with focus on scalable dashboards, AI-driven workflows, and real-time analytics.',
    achievements: [
      'Developed scalable dashboards and reporting modules with rich user experiences.',
      'Integrated AI-driven workflows using WebSockets for real-time data analytics.',
      'Collaborated with AI and backend teams to enhance predictive analytics and performance.',
      'Conducted mentoring sessions for junior developers to promote Angular best practices.',
    ],
    technologies: ['Angular', 'TypeScript', 'WebSockets', 'D3.js', 'AI Integration'],
  },
  {
    id: '2',
    title: 'Associate Software Engineer',
    company: 'Beinex',
    period: 'Sep 2022 – Sep 2023',
    location: 'Kerala, India',
    description: 'Built interactive data visualizations and optimized web application performance through modular component architecture.',
    achievements: [
      'Built interactive data visualizations using D3.js and Angular material tree components.',
      'Created modular, reusable components to maintain consistent design and faster performance.',
      'Introduced lazy loading and caching to enhance web app speed and reliability.',
    ],
    technologies: ['Angular', 'D3.js', 'Angular Material', 'Performance Optimization'],
  },
  {
    id: '3',
    title: 'Full Stack Developer Intern',
    company: 'Beinex',
    period: 'Jun 2022 – Sep 2022',
    location: 'Kerala, India',
    description: 'Developed full-stack applications and contributed to team success, recognized as Star Performer.',
    achievements: [
      'Built full-stack applications using Python Django (backend) and Angular (frontend).',
      'Designed responsive UIs, integrated RESTful APIs, and maintained MySQL databases.',
      'Recognized as a Star Performer for exceptional contribution.',
    ],
    technologies: ['Angular', 'Python', 'Django', 'MySQL', 'RESTful APIs'],
  },
]

export function ExperienceTab() {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0].id)

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-6">Work Experience</h1>
          <div className="space-y-4">
            {experiences.map((exp) => {
              const isExpanded = expandedId === exp.id
              return (
                <div
                  key={exp.id}
                  className="bg-vscode-active border border-vscode-border rounded-lg overflow-hidden hover:border-vscode-blue transition-colors"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="text-vscode-blue" size={20} />
                          <div>
                            <h3 className="text-xl font-semibold text-vscode-text">{exp.title}</h3>
                            <p className="text-vscode-green font-medium">{exp.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-vscode-text-secondary mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{exp.period}</span>
                          </div>
                          {exp.location && (
                            <span className="text-vscode-text-secondary">📍 {exp.location}</span>
                          )}
                        </div>
                        <p className="text-vscode-text-secondary text-sm mb-3">{exp.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-vscode-sidebar text-vscode-blue text-xs rounded border border-vscode-border"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="text-vscode-text-secondary hover:text-vscode-text">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-vscode-border pt-4">
                      <h4 className="text-sm font-semibold text-vscode-text mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-vscode-text-secondary">
                            <span className="text-vscode-blue mt-1">▹</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

