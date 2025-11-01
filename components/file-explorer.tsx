'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, File, Code, Image, FileText } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { ProjectsTab } from './tabs/projects-tab'
import { AboutTab } from './tabs/about-tab'
import { SkillsTab } from './tabs/skills-tab'
import { ExperienceTab } from './tabs/experience-tab'
import { EducationTab } from './tabs/education-tab'
import { CodePlayground } from './code-playground'
import { AnalyticsDashboard } from './analytics-dashboard'
import { BlogSystem } from './blog-system'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  icon?: React.ReactNode
  children?: FileItem[]
  content?: React.ReactNode
  tabId?: string
}

const fileStructure: FileItem[] = [
  {
    name: 'portfolio',
    type: 'folder',
    icon: <Folder size={16} />,
    children: [
      {
        name: 'src',
        type: 'folder',
        icon: <Folder size={16} />,
        children: [
          { name: 'about.tsx', type: 'file', icon: <Code size={16} />, tabId: 'about', content: <AboutTab /> },
          { name: 'skills.tsx', type: 'file', icon: <Code size={16} />, tabId: 'skills', content: <SkillsTab /> },
          { name: 'experience.tsx', type: 'file', icon: <Code size={16} />, tabId: 'experience', content: <ExperienceTab /> },
          { name: 'projects.tsx', type: 'file', icon: <Code size={16} />, tabId: 'projects', content: <ProjectsTab /> },
          { name: 'education.tsx', type: 'file', icon: <Code size={16} />, tabId: 'education', content: <EducationTab /> },
        ],
      },
      {
        name: 'tools',
        type: 'folder',
        icon: <Folder size={16} />,
        children: [
          { name: 'playground.tsx', type: 'file', icon: <Code size={16} />, tabId: 'playground', content: <CodePlayground /> },
          { name: 'analytics.tsx', type: 'file', icon: <Code size={16} />, tabId: 'analytics', content: <AnalyticsDashboard /> },
          { name: 'blog.tsx', type: 'file', icon: <Code size={16} />, tabId: 'blog', content: <BlogSystem /> },
        ],
      },
      {
        name: 'assets',
        type: 'folder',
        icon: <Folder size={16} />,
        children: [
          { name: 'resume.pdf', type: 'file', icon: <FileText size={16} /> },
          { name: 'profile.jpg', type: 'file', icon: <Image size={16} /> },
        ],
      },
      { name: 'README.md', type: 'file', icon: <FileText size={16} /> },
    ],
  },
]

function FileItemComponent({ item, level = 0 }: { item: FileItem; level?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const { addTab } = useAppStore()

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen)
    } else if (item.content) {
      addTab({
        id: item.tabId || item.name,
        label: item.name,
        content: item.content,
        icon: item.icon?.toString(),
      })
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2 py-1 hover:bg-vscode-hover cursor-pointer text-sm"
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {item.type === 'folder' && (
          <span className="text-vscode-text-secondary">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        <span className="text-vscode-text-secondary flex items-center gap-1.5">
          {item.icon}
        </span>
        <span className="text-vscode-text">{item.name}</span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItemComponent key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  return (
    <div className="py-2">
      {fileStructure.map((item) => (
        <FileItemComponent key={item.name} item={item} />
      ))}
    </div>
  )
}
