'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, FileCode, FileText, Database, Image, File } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { CodeViewer } from './code-viewer'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  icon?: React.ReactNode
  children?: FileItem[]
  tabId?: string
  code?: string
  language?: string
  metadata?: {
    size?: string
    modified?: string
    lines?: number
    language?: string
  }
}

import { portfolioData } from '@/lib/portfolio-data'

// File structure with code content
const fileStructure: FileItem[] = [
  {
    name: 'portfolio',
    type: 'folder',
    icon: <Folder size={16} />,
    children: [
      {
        name: 'data',
        type: 'folder',
        icon: <Database size={16} />,
        children: [
          {
            name: 'profile.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'profile.json',
            code: JSON.stringify(portfolioData.profile, null, 2),
            language: 'json',
            metadata: { size: '1.2 KB', modified: '2024-12-15', lines: 15, language: 'json' },
          },
          {
            name: 'experience.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'experience.json',
            code: JSON.stringify(portfolioData.experience, null, 2),
            language: 'json',
            metadata: { size: '3.8 KB', modified: '2024-12-15', lines: 68, language: 'json' },
          },
          {
            name: 'projects.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'projects.json',
            code: JSON.stringify(portfolioData.projects, null, 2),
            language: 'json',
            metadata: { size: '1.5 KB', modified: '2024-12-15', lines: 25, language: 'json' },
          },
          {
            name: 'achievements.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'achievements.json',
            code: JSON.stringify(portfolioData.achievements, null, 2),
            language: 'json',
            metadata: { size: '1.2 KB', modified: '2024-12-15', lines: 18, language: 'json' },
          },
          {
            name: 'certifications.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'certifications.json',
            code: JSON.stringify(portfolioData.certifications, null, 2),
            language: 'json',
            metadata: { size: '2.1 KB', modified: '2024-12-15', lines: 32, language: 'json' },
          },
          {
            name: 'education.json',
            type: 'file',
            icon: <FileCode size={16} />,
            tabId: 'education.json',
            code: JSON.stringify(portfolioData.education, null, 2),
            language: 'json',
            metadata: { size: '0.8 KB', modified: '2024-12-15', lines: 12, language: 'json' },
          },
        ],
      },
      {
        name: 'assets',
        type: 'folder',
        icon: <Image size={16} aria-label="Assets folder" />,
        children: [
          {
            name: 'resume.pdf',
            type: 'file',
            icon: <FileText size={16} />,
            tabId: 'resume.pdf',
            code: '// PDF files are not viewable in code editor\n// Click to download resume',
            language: 'plaintext',
            metadata: { size: '245 KB', modified: '2024-12-15', lines: 1, language: 'pdf' },
          },
        ],
      },
      {
        name: 'README.md',
        type: 'file',
        icon: <FileText size={16} />,
        tabId: 'README.md',
        code: `# Ajay K J - Portfolio

## About

This is my personal portfolio website built with Next.js and styled like Visual Studio Code.

## Skills

- **Frontend:** Angular, TypeScript, JavaScript, HTML, CSS, SCSS
- **Frameworks:** Angular Material, Bootstrap, D3.js
- **Tools:** Git, Figma, Adobe XD, Jenkins
- **Backend:** Python, Django, MySQL

## Experience

- **Software Engineer** at Beinex (Sep 2023 - Present)
- **Associate Software Engineer** at Beinex (Sep 2022 - Sep 2023)
- **Full Stack Developer Intern** at Beinex (Jun 2022 - Sep 2022)

## Projects

### Aurex Analytics Platform
Cloud-based risk and audit analytics platform built with Angular and D3.js.

## Contact

- Email: ajaykj2000@gmail.com
- LinkedIn: [ajay-k-j-4a55b1224](https://www.linkedin.com/in/ajay-k-j-4a55b1224/)
- GitHub: [ajay-k-jayan](https://github.com/ajay-k-jayan/)
`,
        language: 'markdown',
        metadata: { size: '1.8 KB', modified: '2024-12-15', lines: 32, language: 'markdown' },
      },
      {
        name: 'package.json',
        type: 'file',
        icon: <FileCode size={16} />,
        tabId: 'package.json',
        code: JSON.stringify({
          name: 'ajay-portfolio',
          version: '1.0.0',
          description: 'Personal portfolio website built with Next.js',
          dependencies: {
            'next': '^14.0.0',
            'react': '^18.0.0',
            'react-dom': '^18.0.0',
            'tailwindcss': '^3.0.0',
            'framer-motion': '^10.0.0',
            'lucide-react': '^0.300.0',
          },
        }, null, 2),
        language: 'json',
        metadata: { size: '1.8 KB', modified: '2024-12-15', lines: 42, language: 'json' },
      },
    ],
  },
]

function FileItemComponent({ item, level = 0 }: { item: FileItem; level?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const { addTab } = useAppStore()

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen)
    } else if (item.code !== undefined) {
      // Open file as code viewer
      addTab({
        id: item.tabId || item.name,
        label: item.name,
            content: (
          <CodeViewer
            language={item.language || 'plaintext'}
            code={item.code}
          />
        ),
      })
    }
  }

  const getFileColor = () => {
    if (item.name.endsWith('.json')) return 'text-yellow-400'
    if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) return 'text-blue-400'
    if (item.name.endsWith('.md')) return 'text-green-400'
    if (item.name.endsWith('.pdf')) return 'text-red-400'
    return 'text-vscode-text-secondary'
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2 py-1 hover:bg-vscode-hover cursor-pointer text-sm group"
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {item.type === 'folder' && (
          <span className="text-vscode-text-secondary">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {item.type === 'file' && (
          <span className={getFileColor()}>
            {item.icon}
          </span>
        )}
        {item.type === 'folder' && (
          <span className="text-vscode-text-secondary">
            {item.icon}
          </span>
        )}
        <span className="text-vscode-text flex-1">{item.name}</span>
        {item.metadata && (
          <span className="text-xs text-vscode-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            {item.metadata.size}
          </span>
        )}
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

// Helper function to find a file by name in the structure
const findFileInStructure = (structure: FileItem[], fileName: string): FileItem | null => {
  for (const item of structure) {
    if (item.type === 'file' && item.name === fileName) {
      return item
    }
    if (item.children) {
      const found = findFileInStructure(item.children, fileName)
      if (found) return found
    }
  }
  return null
}

export function FileExplorer() {
  const { addTab, tabs } = useAppStore()
  const [hasAutoOpened, setHasAutoOpened] = useState(false)

  // Auto-open profile.json when file explorer is first rendered (independent of sidebar)
  useEffect(() => {
    if (!hasAutoOpened) {
      const profileFile = findFileInStructure(fileStructure, 'profile.json')
      if (profileFile && profileFile.code !== undefined) {
        // Check if profile.json is already open
        const isAlreadyOpen = tabs.some(tab => tab.id === 'profile.json')
        if (!isAlreadyOpen) {
          // Small delay to ensure smooth animation
          setTimeout(() => {
            addTab({
              id: profileFile.tabId || profileFile.name,
              label: profileFile.name,
              content: (
                <CodeViewer
                  language={profileFile.language || 'plaintext'}
                  code={profileFile.code || ''}
                />
              ),
            })
            setHasAutoOpened(true)
          }, 100)
        } else {
          setHasAutoOpened(true)
        }
      }
    }
  }, [hasAutoOpened, addTab, tabs])

  return (
    <div className="py-2">
      {fileStructure.map((item) => (
        <FileItemComponent key={item.name} item={item} />
      ))}
    </div>
  )
}