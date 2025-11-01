'use client'

import { Play, Code2, ExternalLink } from 'lucide-react'

export function ProjectsView() {
  const projects = [
    { id: '1', name: 'E-Commerce Platform', status: 'live' },
    { id: '2', name: 'Chat Application', status: 'live' },
    { id: '3', name: 'AI Content Generator', status: 'dev' },
  ]

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs text-vscode-text-secondary uppercase">Live Demos</div>
      {projects.map((project) => (
        <div
          key={project.id}
          className="px-4 py-2 hover:bg-vscode-hover cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Play className="text-vscode-green" size={14} />
            <span className="text-sm text-vscode-text">{project.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 hover:bg-vscode-active rounded">
              <ExternalLink className="text-vscode-text-secondary" size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

