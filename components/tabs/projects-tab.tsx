'use client'

import { useState } from 'react'
import { ExternalLink, Github, ChevronDown, ChevronUp, Code2, Play } from 'lucide-react'
import { CodePreview } from '@/components/code-preview'
import { LiveDemo } from '@/components/live-demo'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  codePreview?: string
  image?: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Aurex (Augmented Risk and Audit Analytics)',
    description: 'Developed a cloud-based analytics platform integrating risk management, audit management, and continuous audit processes. Leveraged Angular for front-end visualization and implemented secure, responsive reporting dashboards with seamless data integration.',
    technologies: ['Angular', 'TypeScript', 'D3.js', 'Angular Material', 'WebSockets', 'RESTful APIs'],
    period: 'Sep 2022 – Present',
    codePreview: `// Angular component for dashboard visualization
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-aurex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AurexDashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  
  ngOnInit() {
    this.loadAnalyticsData();
  }
  
  loadAnalyticsData() {
    this.dashboardService.getRiskMetrics()
      .subscribe(data => this.updateVisualizations(data));
  }
}`,
  },
]

export function ProjectsTab() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [showCodePreview, setShowCodePreview] = useState<string | null>(null)
  const [showLiveDemo, setShowLiveDemo] = useState<string | null>(null)

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-6">Featured Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const isExpanded = expandedProject === project.id
              return (
                <div
                  key={project.id}
                  className="bg-vscode-active border border-vscode-border rounded-lg overflow-hidden hover:border-vscode-blue transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-vscode-text">{project.title}</h3>
                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                        className="text-vscode-text-secondary hover:text-vscode-text"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    <p className="text-vscode-text-secondary text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-vscode-sidebar text-vscode-green text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-sidebar hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
                        >
                          <Github size={14} />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blue hover:bg-blue-600 text-white text-sm rounded transition-colors"
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.codePreview && (
                        <button
                          onClick={() => setShowCodePreview(project.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-sidebar hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
                        >
                          <Code2 size={14} />
                          <span>Code</span>
                        </button>
                      )}
                    </div>
                    {isExpanded && project.codePreview && (
                      <div className="mt-4 pt-4 border-t border-vscode-border">
                        <pre className="text-xs text-vscode-orange bg-vscode-sidebar p-3 rounded overflow-x-auto">
                          <code>{project.codePreview}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {showCodePreview && (
        <CodePreview
          projectId={showCodePreview}
          code={projects.find(p => p.id === showCodePreview)?.codePreview || ''}
          onClose={() => setShowCodePreview(null)}
        />
      )}
      {showLiveDemo && (
        <LiveDemo
          projectId={showLiveDemo}
          url={projects.find(p => p.id === showLiveDemo)?.liveUrl || ''}
          onClose={() => setShowLiveDemo(null)}
        />
      )}
    </div>
  )
}

