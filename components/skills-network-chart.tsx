'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code, Palette, Database, Zap, Layers, Target, Sparkles,
  TrendingUp, Filter, Search, X, Sun, Moon, Grid3x3, Network,
  Award, Briefcase, BookOpen, Settings, Globe, Cpu, GitBranch,
  Box, Rocket, Shield, Eye, Heart, Star, ChevronRight, ExternalLink, Clock, ArrowLeft,
  ZoomIn, ZoomOut, Download, RotateCcw, Move, Image as ImageIcon, Copy, Check,
  Minimize2, Maximize2, ChevronDown, ChevronUp, FileText, Share2, Save, Clipboard,
  Languages, Monitor, Smartphone, Tablet, FileDown
} from 'lucide-react'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'
import { skillWebsites } from '@/lib/skill-websites'
import { languages } from '@/lib/translations'
import { useLanguage } from '@/contexts/language-context'
import { useAppStore } from '@/lib/store'
import { useEnhancedTheme } from '@/contexts/enhanced-theme-context'
import { toast } from 'react-hot-toast'
import { Tooltip } from '@/components/ui/tooltip'

// Skill data structure matching the skills-tab
interface Skill {
  id: string
  name: string
  description: string
  category: string
  level: number
  years?: string
  verified?: boolean
  icon?: string
  tags?: string[]
  publisher?: string
  projects?: number
  experience?: string
  certifications?: string[]
  contributions?: string[]
  badge?: string
  website?: string
}

// Node and Link types for the graph
interface GraphNode extends Skill {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  group?: string
  size?: number
  color?: string
  glowColor?: string
  shape?: 'circle' | 'hexagon' | 'star' | 'diamond' | 'square' | 'triangle' | 'wave' | 'gear' | 'vortex'
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  value?: number
  type?: string
  color?: string
}

// Icon mapping for skills
const skillIconMap: Record<string, any> = {
  // Languages
  javascript: Code,
  typescript: Code,
  html: Globe,
  css: Palette,
  scss: Palette,
  sass: Palette,
  python: Code,
  php: Code,
  sql: Database,
  c: Code,
  cpp: Code,
  
  // Frameworks
  react: Zap,
  angular: Rocket,
  nextjs: Rocket,
  bootstrap: Layers,
  tailwind: Layers,
  'angular-material': Layers,
  jquery: Zap,
  rxjs: Zap,
  d3: Eye,
  storybook: BookOpen,
  nodejs: Cpu,
  django: Rocket,
  'django-rest': Rocket,
  'micro-frontend': Network,
  
  // Tools
  git: GitBranch,
  gitlab: GitBranch,
  'git-desktop': GitBranch,
  figma: Palette,
  'adobe-xd': Palette,
  jenkins: Settings,
  'mysql-workbench': Database,
  'visual-studio': Code,
  vscode: Code,
  'chrome-devtools': Settings,
  postman: Globe,
  office: Briefcase,
  cursor: Code,
  npm: Box,
  
  // Expertise
  'frontend-dev': Rocket,
  'responsive-design': Eye,
  'ui-design': Palette,
  'api-integration': Network,
  performance: Zap,
  agile: Target,
  collaboration: Heart,
  'code-review': Shield,
  'state-management': Layers,
  accessibility: Eye,
  pwa: Rocket,
  testing: Shield,
  auth: Shield,
}

// Category to group mapping
const categoryToGroup: Record<string, string> = {
  'Frontend Language': 'design',
  'Programming Language': 'development',
  'Frontend Library': 'development',
  'Frontend Framework': 'development',
  'JavaScript Library': 'development',
  'CSS Framework': 'design',
  'UI Framework': 'design',
  'Backend Runtime': 'development',
  'Backend Framework': 'development',
  'Version Control': 'tools',
  'Design Tool': 'design',
  'DevOps Tool': 'tools',
  'Database Tool': 'tools',
  'IDE': 'tools',
  'Code Editor': 'tools',
  'Development Tool': 'tools',
  'API Tool': 'tools',
  'Productivity Tool': 'tools',
  'Collaboration Tool': 'tools',
  'Package Manager': 'tools',
  'Architecture': 'development',
  'Expertise': 'visualization',
}

// Group colors
const groupColors: Record<string, { base: string; glow: string; bg: string }> = {
  design: { base: '#FF6B9D', glow: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.1)' },
  development: { base: '#4ECDC4', glow: '#4ECDC4', bg: 'rgba(78, 205, 196, 0.1)' },
  tools: { base: '#95E1D3', glow: '#95E1D3', bg: 'rgba(149, 225, 211, 0.1)' },
  visualization: { base: '#F38181', glow: '#F38181', bg: 'rgba(243, 129, 129, 0.1)' },
}

// Shape definitions
const getNodeShape = (skill: Skill): GraphNode['shape'] => {
  const name = skill.name.toLowerCase()
  if (name.includes('design') || name.includes('ui') || name.includes('figma')) return 'vortex'
  if (name.includes('performance') || name.includes('optimization')) return 'gear'
  if (name.includes('creative') || name.includes('animation')) return 'wave'
  if (skill.level >= 90) return 'star'
  if (skill.level >= 80) return 'hexagon'
  if (skill.level >= 70) return 'diamond'
  return 'circle'
}

// Shape drawing functions
const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const px = x + size * Math.cos(angle)
    const py = y + size * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, points: number) => {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i
    const radius = i % 2 === 0 ? size : size * 0.5
    const px = x + radius * Math.cos(angle - Math.PI / 2)
    const py = y + radius * Math.sin(angle - Math.PI / 2)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x + size, y)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x - size, y)
  ctx.closePath()
}

const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x - size * 0.866, y + size * 0.5)
  ctx.lineTo(x + size * 0.866, y + size * 0.5)
  ctx.closePath()
}

const drawWave = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i
    const radius = size * (1 + 0.3 * Math.sin(angle * 3))
    const px = x + radius * Math.cos(angle)
    const py = y + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

const drawGear = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  const teeth = 8
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI / teeth) * i
    const radius = i % 2 === 0 ? size : size * 0.7
    const px = x + radius * Math.cos(angle)
    const py = y + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

const drawVortex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath()
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 / 16) * i
    const radius = size * (0.5 + (i / 16) * 0.5)
    const px = x + radius * Math.cos(angle)
    const py = y + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

// All skills data (from skills-tab)
const allSkills: Skill[] = [
  // Frontend Languages
  { id: 'javascript', name: 'JavaScript', description: 'Core web development language — ES6+, async programming, and modern patterns', category: 'Frontend Language', level: 90, years: '4+', verified: true, tags: ['frontend', 'javascript', 'es6'], publisher: 'ECMAScript', projects: 15, experience: 'Expert', certifications: ['Meta Front-End Developer'], contributions: ['Modern ES6+ Patterns', 'Async Programming'] },
  { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript development — Strong typing, interfaces, and modern ES6+ features', category: 'Frontend Language', level: 88, years: '3+', verified: true, tags: ['typescript', 'typing', 'javascript'], publisher: 'Microsoft', projects: 12, experience: 'Advanced', contributions: ['Type Safety', 'Advanced Types'] },
  { id: 'html', name: 'HTML', description: 'Semantic markup and modern web standards — Accessibility and SEO optimization', category: 'Frontend Language', level: 95, years: '4+', verified: true, tags: ['html', 'markup', 'semantic'], publisher: 'W3C', projects: 20, experience: 'Expert', badge: 'Expert' },
  { id: 'css', name: 'CSS', description: 'Advanced styling and animations — Flexbox, Grid, and responsive design', category: 'Frontend Language', level: 92, years: '4+', verified: true, tags: ['css', 'styling', 'responsive'], publisher: 'W3C', projects: 18, experience: 'Expert', badge: 'Expert' },
  { id: 'scss', name: 'SCSS', description: 'CSS preprocessor — Variables, mixins, and modular styling architecture', category: 'Frontend Language', level: 85, years: '3+', verified: true, tags: ['scss', 'preprocessor', 'sass'], publisher: 'Sass Team', projects: 9, experience: 'Advanced' },
  { id: 'sass', name: 'SASS', description: 'Syntactically Awesome Stylesheets — CSS extension language with variables and nesting', category: 'Frontend Language', level: 85, years: '3+', tags: ['sass', 'preprocessor', 'css'], publisher: 'Sass Team', projects: 9, experience: 'Advanced' },
  
  // Programming Languages
  { id: 'c', name: 'C', description: 'General-purpose programming language — System programming and low-level development', category: 'Programming Language', level: 70, years: '2+', tags: ['c', 'system', 'programming'], publisher: 'Bell Labs', projects: 3, experience: 'Intermediate' },
  { id: 'cpp', name: 'C++', description: 'Object-oriented programming language — System development and performance-critical applications', category: 'Programming Language', level: 72, years: '2+', tags: ['cpp', 'oop', 'system'], publisher: 'Bjarne Stroustrup', projects: 3, experience: 'Intermediate' },
  { id: 'python', name: 'Python', description: 'Backend development and scripting — Django framework and automation', category: 'Programming Language', level: 75, years: '2+', tags: ['python', 'backend', 'scripting'], publisher: 'Python Foundation', projects: 4, experience: 'Intermediate' },
  { id: 'php', name: 'PHP', description: 'Server-side scripting — Dynamic web pages and backend logic', category: 'Programming Language', level: 72, years: '2+', tags: ['php', 'backend', 'server'], publisher: 'PHP Group', projects: 3, experience: 'Intermediate' },
  { id: 'sql', name: 'SQL', description: 'Database query language — Data manipulation, optimization, and management across multiple database systems', category: 'Programming Language', level: 78, years: '3+', tags: ['sql', 'database', 'mysql', 'sqlite'], publisher: 'Various', projects: 6, experience: 'Intermediate' },
  
  // Frameworks and Libraries
  { id: 'jquery', name: 'jQuery', description: 'JavaScript library — DOM manipulation and event handling', category: 'JavaScript Library', level: 80, years: '2+', tags: ['jquery', 'javascript', 'dom'], publisher: 'jQuery Foundation', projects: 8, experience: 'Advanced' },
  { id: 'react', name: 'React', description: 'Frontend library — Component-based UI development and state management', category: 'Frontend Library', level: 85, years: '2+', verified: true, tags: ['react', 'frontend', 'components'], publisher: 'Meta', projects: 7, experience: 'Advanced', certifications: ['Meta React Basics'] },
  { id: 'rxjs', name: 'RxJS', description: 'Reactive Extensions for JavaScript — Reactive programming and observables', category: 'Frontend Library', level: 80, years: '2+', tags: ['rxjs', 'reactive', 'observables'], publisher: 'Microsoft', projects: 5, experience: 'Advanced' },
  { id: 'angular', name: 'Angular', description: 'Frontend framework — Building scalable applications with reactive forms, routing, and state management', category: 'Frontend Framework', level: 92, years: '3+', verified: true, tags: ['angular', 'framework', 'typescript'], publisher: 'Google', projects: 8, experience: 'Expert', badge: 'Expert', certifications: ['Angular Certification'] },
  { id: 'nextjs', name: 'Next.js', description: 'React framework — Server-side rendering, static site generation, and full-stack development', category: 'Frontend Framework', level: 82, years: '2+', verified: true, tags: ['nextjs', 'react', 'ssr', 'fullstack'], publisher: 'Vercel', projects: 6, experience: 'Advanced' },
  { id: 'bootstrap', name: 'Bootstrap', description: 'Responsive CSS framework — Grid system and utility classes for rapid development', category: 'CSS Framework', level: 88, years: '3+', verified: true, tags: ['bootstrap', 'css', 'responsive'], publisher: 'Twitter', projects: 10, experience: 'Advanced' },
  { id: 'angular-material', name: 'Angular Material', description: 'Material Design component library — Consistent UI components and theming', category: 'UI Framework', level: 90, years: '3+', verified: true, tags: ['angular-material', 'ui', 'material'], publisher: 'Google', projects: 7, experience: 'Expert', badge: 'Expert' },
  { id: 'micro-frontend', name: 'Micro Frontend', description: 'Architectural pattern — Modular frontend applications and independent deployment', category: 'Architecture', level: 80, years: '2+', tags: ['micro-frontend', 'architecture', 'modular'], publisher: 'Community', projects: 4, experience: 'Advanced' },
  { id: 'd3', name: 'D3.js', description: 'Data visualization library — Complex visualizations and interactive charts', category: 'JavaScript Library', level: 85, years: '2+', verified: true, tags: ['d3', 'visualization', 'charts'], publisher: 'Observable', projects: 5, experience: 'Advanced' },
  { id: 'storybook', name: 'Storybook', description: 'Component development environment — Isolated component testing and documentation', category: 'JavaScript Library', level: 80, years: '1+', tags: ['storybook', 'components', 'testing'], publisher: 'Storybook Team', projects: 5, experience: 'Advanced' },
  { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime — Backend development and server-side scripting', category: 'Backend Runtime', level: 78, years: '2+', tags: ['nodejs', 'backend', 'javascript'], publisher: 'Node.js Foundation', projects: 5, experience: 'Intermediate' },
  { id: 'django', name: 'Django', description: 'Python web framework — Rapid development of secure and maintainable websites', category: 'Backend Framework', level: 70, years: '1+', tags: ['django', 'python', 'backend'], publisher: 'Django Foundation', projects: 2, experience: 'Intermediate' },
  { id: 'django-rest', name: 'Django REST', description: 'Django toolkit — Building RESTful APIs with Django', category: 'Backend Framework', level: 72, years: '1+', tags: ['django', 'rest', 'api'], publisher: 'Django REST Framework', projects: 3, experience: 'Intermediate' },
  { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework — Rapid UI development with utility classes', category: 'CSS Framework', level: 85, years: '2+', verified: true, tags: ['tailwind', 'css', 'utilities'], publisher: 'Tailwind Labs', projects: 8, experience: 'Advanced' },
  
  // Version Control
  { id: 'git', name: 'Git', description: 'Distributed version control system — Branching, merging, and collaborative workflows', category: 'Version Control', level: 90, years: '4+', verified: true, tags: ['git', 'version-control', 'vcs'], publisher: 'Linus Torvalds', projects: 25, experience: 'Expert', badge: 'Expert' },
  { id: 'gitlab', name: 'GitLab', description: 'Git repository management — CI/CD, code review, and project management', category: 'Version Control', level: 85, years: '3+', tags: ['gitlab', 'repository', 'ci-cd'], publisher: 'GitLab Inc', projects: 12, experience: 'Advanced' },
  { id: 'git-desktop', name: 'Git Desktop', description: 'Git GUI application — Visual version control and repository management', category: 'Version Control', level: 80, years: '3+', tags: ['git-desktop', 'gui', 'git'], publisher: 'GitHub', projects: 10, experience: 'Advanced' },
  
  // Tools
  { id: 'figma', name: 'Figma', description: 'UI/UX design and prototyping — Design systems and collaboration', category: 'Design Tool', level: 85, years: '3+', tags: ['figma', 'design', 'ui', 'ux'], publisher: 'Figma Inc', projects: 12, experience: 'Advanced' },
  { id: 'adobe-xd', name: 'Adobe XD', description: 'User experience design — Prototyping and wireframing', category: 'Design Tool', level: 80, years: '2+', tags: ['adobe-xd', 'design', 'prototyping'], publisher: 'Adobe', projects: 6, experience: 'Advanced' },
  { id: 'jenkins', name: 'Jenkins', description: 'CI/CD automation — Build pipelines and deployment', category: 'DevOps Tool', level: 75, years: '1+', tags: ['jenkins', 'ci-cd', 'automation'], publisher: 'Jenkins Project', projects: 3, experience: 'Intermediate' },
  { id: 'mysql-workbench', name: 'MySQL Workbench', description: 'Database design and administration — Visual database tools and SQL development', category: 'Database Tool', level: 78, years: '3+', tags: ['mysql', 'database', 'sql'], publisher: 'Oracle', projects: 6, experience: 'Intermediate' },
  { id: 'visual-studio', name: 'Visual Studio', description: 'Integrated development environment — Full-featured IDE for various languages', category: 'IDE', level: 80, years: '3+', tags: ['visual-studio', 'ide', 'development'], publisher: 'Microsoft', projects: 15, experience: 'Advanced' },
  { id: 'vscode', name: 'VS Code', description: 'Code editor — Lightweight IDE with extensive extension support', category: 'Code Editor', level: 92, years: '4+', verified: true, tags: ['vscode', 'editor', 'ide'], publisher: 'Microsoft', projects: 20, experience: 'Expert', badge: 'Expert' },
  { id: 'chrome-devtools', name: 'Chrome DevTools', description: 'Web development tools — Debugging, profiling, and performance analysis', category: 'Development Tool', level: 88, years: '4+', tags: ['devtools', 'debugging', 'chrome'], publisher: 'Google', projects: 18, experience: 'Advanced' },
  { id: 'postman', name: 'Postman', description: 'API development and testing — REST API testing and documentation', category: 'API Tool', level: 82, years: '2+', tags: ['postman', 'api', 'testing'], publisher: 'Postman', projects: 8, experience: 'Advanced' },
  { id: 'office', name: 'Microsoft Office', description: 'Productivity suite — Word, Excel, PowerPoint, Outlook, Teams', category: 'Productivity Tool', level: 85, years: '4+', tags: ['office', 'productivity', 'microsoft'], publisher: 'Microsoft', projects: 12, experience: 'Advanced' },
  { id: 'cursor', name: 'Cursor', description: 'Real-time collaborative coding tool — Pair programming and code collaboration', category: 'Collaboration Tool', level: 80, years: '2+', tags: ['cursor', 'collaboration', 'coding'], publisher: 'Cursor', projects: 5, experience: 'Advanced' },
  { id: 'npm', name: 'npm', description: 'Node Package Manager — Package management and dependency resolution', category: 'Package Manager', level: 88, years: '4+', tags: ['npm', 'package-manager', 'node'], publisher: 'npm Inc', projects: 20, experience: 'Advanced' },
  
  // Expertise
  { id: 'frontend-dev', name: 'Frontend Development', description: 'Building responsive and interactive web applications', category: 'Expertise', level: 92, years: '4+', verified: true, tags: ['frontend', 'development', 'web'], publisher: 'Expert', projects: 20, experience: 'Expert', badge: 'Expert' },
  { id: 'responsive-design', name: 'Responsive Design', description: 'Creating mobile-first and adaptive user interfaces', category: 'Expertise', level: 90, years: '4+', verified: true, tags: ['responsive', 'mobile', 'design'], publisher: 'Expert', projects: 18, experience: 'Expert', badge: 'Expert' },
  { id: 'ui-design', name: 'UI Design', description: 'Designing intuitive and accessible user interfaces', category: 'Expertise', level: 88, years: '3+', tags: ['ui', 'design', 'ux'], publisher: 'Expert', projects: 15, experience: 'Advanced' },
  { id: 'api-integration', name: 'API Integration', description: 'Integrating RESTful APIs and third-party services', category: 'Expertise', level: 88, years: '3+', verified: true, tags: ['api', 'integration', 'rest'], publisher: 'Expert', projects: 14, experience: 'Advanced' },
  { id: 'performance', name: 'Performance Optimization', description: 'Optimizing application performance and load times', category: 'Expertise', level: 85, years: '3+', tags: ['performance', 'optimization', 'speed'], publisher: 'Expert', projects: 12, experience: 'Advanced' },
  { id: 'agile', name: 'Agile Methodologies', description: 'Scrum, Kanban, and iterative development practices', category: 'Expertise', level: 85, years: '3+', tags: ['agile', 'scrum', 'methodology'], publisher: 'Expert', projects: 10, experience: 'Advanced' },
  { id: 'collaboration', name: 'Cross-Functional Collaboration', description: 'Working with designers, backend developers, and stakeholders', category: 'Expertise', level: 88, years: '3+', tags: ['collaboration', 'teamwork'], publisher: 'Expert', projects: 15, experience: 'Advanced' },
  { id: 'code-review', name: 'Code Review', description: 'Reviewing code for quality, maintainability, and best practices', category: 'Expertise', level: 85, years: '3+', tags: ['code-review', 'quality'], publisher: 'Expert', projects: 12, experience: 'Advanced' },
  { id: 'state-management', name: 'State Management', description: 'Managing application state with NgRx and reactive patterns', category: 'Expertise', level: 82, years: '2+', tags: ['ngrx', 'state', 'management'], publisher: 'Expert', projects: 6, experience: 'Advanced' },
  { id: 'accessibility', name: 'Web Accessibility', description: 'Ensuring web applications meet WCAG accessibility standards', category: 'Expertise', level: 80, years: '2+', tags: ['accessibility', 'wcag', 'a11y'], publisher: 'Expert', projects: 8, experience: 'Advanced' },
  { id: 'pwa', name: 'Progressive Web Apps', description: 'Building Progressive Web Applications with offline support', category: 'Expertise', level: 78, years: '2+', tags: ['pwa', 'progressive', 'offline'], publisher: 'Expert', projects: 4, experience: 'Intermediate' },
  { id: 'testing', name: 'Testing Frameworks', description: 'Jasmine, Karma, Cypress — Unit, integration, and e2e testing', category: 'Expertise', level: 80, years: '2+', tags: ['testing', 'jasmine', 'cypress'], publisher: 'Expert', projects: 7, experience: 'Advanced' },
  { id: 'auth', name: 'Secure Authentication', description: 'JWT, OAuth — Implementing secure authentication and authorization', category: 'Expertise', level: 82, years: '2+', tags: ['auth', 'jwt', 'oauth', 'security'], publisher: 'Expert', projects: 6, experience: 'Advanced' },
]

export function SkillsNetworkChart() {
  // Language and theme integration
  const { language, setLanguage, t } = useLanguage()
  const { portfolioSettings, updateSettings } = useAppStore()
  const { themes, setTheme, currentTheme } = useEnhancedTheme()
  
  // Component state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [copied, setCopied] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'svg'>('png')
  const hoverTooltipPosRef = useRef({ x: 0, y: 0 })
  const [hoverTooltipPos, setHoverTooltipPos] = useState({ x: 0, y: 0 })
  
  // Canvas and simulation refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simulationRef = useRef<any>(null)
  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isExpanded, setIsExpanded] = useState(false)
  const isDraggingRef = useRef(false)
  const isPanningRef = useRef(false)
  const dragNodeRef = useRef<GraphNode | null>(null)
  const lastPanPointRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 })
  const panRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Cache for skill logo images
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map())
  
  // Animation time for floating effect
  const animationTimeRef = useRef(0)
  
  // Sync refs with state
  useEffect(() => {
    panRef.current = pan
  }, [pan])
  
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  // Handle fullscreen API
  const enterFullscreen = async () => {
    try {
      const element = containerRef.current || document.documentElement
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
      setIsExpanded(true)
    } catch (err) {
      console.error('Error entering fullscreen:', err)
      // Fallback to CSS fullscreen if API fails
      setIsExpanded(true)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
      setIsExpanded(false)
    } catch (err) {
      console.error('Error exiting fullscreen:', err)
      setIsExpanded(false)
    }
  }

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
      setIsExpanded(isFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        exitFullscreen()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isExpanded])
  
  // Sync with global theme - listen to both store and enhanced theme context
  useEffect(() => {
    const updateTheme = () => {
      // Check enhanced theme context first (most accurate)
      if (currentTheme) {
        const isDark = currentTheme.type === 'dark'
        setIsDarkMode(isDark)
        return
      }
      
      // Fallback to portfolio settings
      const actualTheme = portfolioSettings.theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : portfolioSettings.theme
      setIsDarkMode(actualTheme === 'dark')
    }
    
    updateTheme()
    
    // Listen to theme change events from store
    const handleThemeChange = () => {
      updateTheme()
    }
    
    window.addEventListener('themeChange', handleThemeChange)
    
    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (portfolioSettings.theme === 'system') {
        updateTheme()
      }
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [portfolioSettings.theme, currentTheme])

  // Generate nodes and links
  const { nodes, links } = useMemo(() => {
    // Filter skills based on search and filters
    let filteredSkills = allSkills.filter(skill => {
      const matchesSearch = !searchQuery || 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesGroup = selectedGroups.length === 0 || 
        selectedGroups.includes(categoryToGroup[skill.category] || 'development')
      
      const matchesLevel = skill.level >= minLevel
      
      return matchesSearch && matchesGroup && matchesLevel
    })

    // Create nodes
    const nodeMap = new Map<string, GraphNode>()
    filteredSkills.forEach(skill => {
      const group = categoryToGroup[skill.category] || 'development'
      const colors = groupColors[group] || groupColors.development
      const shape = getNodeShape(skill)
      const size = 8 + (skill.level / 10)
      
      nodeMap.set(skill.id, {
        ...skill,
        group,
        size,
        color: colors.base,
        glowColor: colors.glow,
        shape,
      })
    })

    // Create links based on hierarchical parent-child relationships
    const linkMap = new Map<string, GraphLink>()
    
    // Define parent-child relationships (hierarchical structure)
    const parentChildMap: Record<string, string[]> = {
      // Frameworks contain libraries
      'angular': ['angular-material', 'rxjs', 'typescript'],
      'react': ['nextjs', 'javascript'],
      'nextjs': ['react', 'javascript'],
      // Languages contain frameworks
      'javascript': ['react', 'nextjs', 'jquery', 'rxjs', 'd3', 'nodejs'],
      'typescript': ['angular', 'nextjs'],
      'python': ['django', 'django-rest'],
      // Expertise contains related skills
      'frontend-dev': ['react', 'angular', 'nextjs', 'javascript', 'typescript', 'html', 'css'],
      'responsive-design': ['css', 'bootstrap', 'tailwind', 'html'],
      'ui-design': ['figma', 'adobe-xd', 'css', 'angular-material'],
      'api-integration': ['postman', 'nodejs', 'django-rest'],
      'performance': ['javascript', 'nodejs', 'chrome-devtools'],
      'testing': ['javascript', 'typescript'],
      'state-management': ['angular', 'rxjs', 'react'],
      'accessibility': ['html', 'css'],
      'pwa': ['javascript', 'react', 'nextjs'],
      'auth': ['nodejs', 'javascript'],
      // Categories as parents
      'git': ['gitlab', 'git-desktop'],
    }

    // Create parent-child links (hierarchical - stronger connections)
    Object.entries(parentChildMap).forEach(([parentId, childIds]) => {
      const parent = filteredSkills.find(s => s.id === parentId)
      if (!parent) return
      
      childIds.forEach(childId => {
        const child = filteredSkills.find(s => s.id === childId)
        if (!child) return
        
        const key = `${parentId}-${childId}`
        if (!linkMap.has(key)) {
          linkMap.set(key, {
            source: parentId,
            target: childId,
            value: 3,
            type: 'parent-child',
            color: isDarkMode ? 'rgba(78, 205, 196, 0.6)' : 'rgba(78, 205, 196, 0.8)',
          })
        }
      })
    })
    
    // Link skills in the same category (sibling relationships)
    filteredSkills.forEach(skill1 => {
      filteredSkills.forEach(skill2 => {
        if (skill1.id !== skill2.id && skill1.category === skill2.category) {
          const key = [skill1.id, skill2.id].sort().join('-')
          if (!linkMap.has(key)) {
            linkMap.set(key, {
              source: skill1.id,
              target: skill2.id,
              value: 1,
              type: 'category',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            })
          }
        }
      })
    })

    // Link related skills (shared tags)
    filteredSkills.forEach(skill1 => {
      filteredSkills.forEach(skill2 => {
        if (skill1.id !== skill2.id && skill1.tags && skill2.tags) {
          const sharedTags = skill1.tags.filter(tag => skill2.tags!.includes(tag))
          if (sharedTags.length > 0) {
            const key = [skill1.id, skill2.id].sort().join('-')
            if (!linkMap.has(key)) {
              linkMap.set(key, {
                source: skill1.id,
                target: skill2.id,
                value: sharedTags.length,
                type: 'tag',
                color: isDarkMode ? 'rgba(78, 205, 196, 0.3)' : 'rgba(78, 205, 196, 0.5)',
              })
            }
          }
        }
      })
    })

    // Link expertise to related skills (if not already linked as parent-child)
    const expertiseSkills = filteredSkills.filter(s => s.category === 'Expertise')
    expertiseSkills.forEach(expertise => {
      filteredSkills.forEach(skill => {
        if (skill.id !== expertise.id && 
            !linkMap.has(`${expertise.id}-${skill.id}`) &&
            !linkMap.has(`${skill.id}-${expertise.id}`) &&
            (expertise.tags?.some(tag => skill.tags?.includes(tag)) ||
             expertise.name.toLowerCase().includes(skill.name.toLowerCase()) ||
             skill.name.toLowerCase().includes(expertise.name.toLowerCase()))) {
          const key = [expertise.id, skill.id].sort().join('-')
          if (!linkMap.has(key)) {
            linkMap.set(key, {
              source: expertise.id,
              target: skill.id,
              value: 2,
              type: 'expertise',
              color: isDarkMode ? 'rgba(255, 107, 157, 0.4)' : 'rgba(255, 107, 157, 0.6)',
            })
          }
        }
      })
    })

    return {
      nodes: Array.from(nodeMap.values()),
      links: Array.from(linkMap.values()),
    }
  }, [searchQuery, selectedGroups, minLevel, isDarkMode])

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node === selectedNode ? null : node)
  }, [selectedNode])

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node)
  }, [])

  // Get skill logo URL from CDN (same as skills-tab) - defined early for use in useEffect
  const getSkillImageUrl = useCallback((skillId: string) => {
    const skillLogoMap: Record<string, string> = {
      'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'scss': 'https://cdn.simpleicons.org/sass/CC6699',
      'sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      'cpp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'sql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'jquery': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg',
      'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'rxjs': 'https://cdn.simpleicons.org/rxjs/7175C2',
      'angular': 'https://cdn.simpleicons.org/angular/DD0031',
      'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'angular-material': 'https://cdn.simpleicons.org/angularmaterial/FF5722',
      'micro-frontend': 'https://cdn.simpleicons.org/modulefederation/5A0FC8',
      'd3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg',
      'storybook': 'https://cdn.simpleicons.org/storybook/FF4785',
      'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg',
      'django-rest': 'https://cdn.simpleicons.org/djangorest/092E20',
      'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'gitlab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
      'git-desktop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'adobe-xd': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-line.svg',
      'jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
      'mysql-workbench': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'visual-studio': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg',
      'vscode': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      'chrome-devtools': 'https://cdn.simpleicons.org/googlechrome/4285F4',
      'postman': 'https://cdn.simpleicons.org/postman/FF6C37',
      'office': 'https://cdn.simpleicons.org/microsoftoffice/D83B01',
      'cursor': 'https://cdn.simpleicons.org/cursor/000000',
      'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
      'frontend-dev': 'https://cdn.simpleicons.org/react/61DAFB',
      'responsive-design': 'https://cdn.simpleicons.org/css3/1572B6',
      'ui-design': 'https://cdn.simpleicons.org/adobe/FF0000',
      'api-integration': 'https://cdn.simpleicons.org/insomnia/5849BE',
      'performance': 'https://cdn.simpleicons.org/lighthouse/F44B21',
      'agile': 'https://cdn.simpleicons.org/jira/0052CC',
      'collaboration': 'https://cdn.simpleicons.org/slack/4A154B',
      'code-review': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'state-management': 'https://cdn.simpleicons.org/redux/764ABC',
      'accessibility': 'https://cdn.simpleicons.org/w3c/005A9C',
      'pwa': 'https://cdn.simpleicons.org/pwa/5A0FC8',
      'testing': 'https://cdn.simpleicons.org/jest/C21325',
      'auth': 'https://cdn.simpleicons.org/auth0/EB5424',
    }
    return skillLogoMap[skillId] || null
  }, [])

  // Load and cache skill logo images (same as list view)
  useEffect(() => {
    allSkills.forEach(skill => {
      const imageUrl = getSkillImageUrl(skill.id)
      if (imageUrl && !imageCacheRef.current.has(skill.id)) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          imageCacheRef.current.set(skill.id, img)
        }
        img.onerror = () => {
          // Image failed to load, will use fallback
        }
        img.src = imageUrl
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // getSkillImageUrl is stable (useCallback with empty deps), allSkills is a constant

  // Draw node on canvas with floating animation
  const drawNodeOnCanvas = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = selectedNode?.id === node.id
    const isHovered = hoveredNode?.id === node.id
    
    // Calculate floating animation offset (unique per node based on ID)
    const nodeIdHash = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const floatSpeed = 0.5 + (nodeIdHash % 100) / 200 // 0.5 to 1.0 seconds per cycle
    const floatAmount = 2 + (nodeIdHash % 50) / 25 // 2 to 4 pixels
    const floatX = Math.sin(animationTimeRef.current * Math.PI * 2 / floatSpeed + nodeIdHash) * floatAmount
    const floatY = Math.cos(animationTimeRef.current * Math.PI * 2 / floatSpeed + nodeIdHash * 0.7) * floatAmount
    
    // Breathing scale effect
    const breathSpeed = 2 + (nodeIdHash % 100) / 200
    const breathAmount = 0.05 + (nodeIdHash % 30) / 600 // 0.05 to 0.1 scale variation
    const breathScale = 1 + Math.sin(animationTimeRef.current * Math.PI * 2 / breathSpeed) * breathAmount
    
    const baseScale = isSelected ? 1.3 : isHovered ? 1.15 : 1
    const scale = baseScale * breathScale
    const size = (node.size || 10) * scale
    const glowSize = size * 1.5

    if (!node.x || !node.y) return

    // Apply floating offset to position
    const animatedX = node.x + floatX
    const animatedY = node.y + floatY

    // Draw glow
    if (isSelected || isHovered) {
      const gradient = ctx.createRadialGradient(animatedX, animatedY, 0, animatedX, animatedY, glowSize)
      gradient.addColorStop(0, `${node.glowColor || node.color}80`)
      gradient.addColorStop(0.5, `${node.glowColor || node.color}40`)
      gradient.addColorStop(1, `${node.glowColor || node.color}00`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(animatedX, animatedY, glowSize, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw skill logo image (same as list view)
    const skillImage = imageCacheRef.current.get(node.id)
    // Circle size directly based on skill level/rating: higher level = larger circle
    // Level ranges from 0-100, map to circle radius: min 14px (level 0) to max 28px (level 100)
    // More direct relationship: radius = 14 + (level / 100) * 14
    const baseCircleRadius = 14 + (node.level / 100) * 14
    const circleRadius = baseCircleRadius * scale
    const iconSize = circleRadius * 2.0 // Icon size based on circle size
    
    if (skillImage && skillImage.complete) {
      ctx.save()
      ctx.translate(animatedX, animatedY)
      ctx.scale(scale, scale)
      
      // Draw circular white background (same as list view: w-10 h-10 bg-white rounded-full)
      const bgRadius = circleRadius / scale // Use the calculated circle radius
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, 0, bgRadius, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw subtle border (same as list view: border border-vscode-border/20)
      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw skill logo (same as list view: object-contain)
      const logoSize = bgRadius * 0.75 // Logo takes 75% of the background circle (balanced size)
      ctx.drawImage(skillImage, -logoSize / 2, -logoSize / 2, logoSize, logoSize)
      ctx.restore()
    } else {
      // Fallback: show initials in white circle (same as list view)
      ctx.save()
      ctx.translate(animatedX, animatedY)
      ctx.scale(scale, scale)
      
      // Draw circular white background
      const bgRadius = circleRadius / scale
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, 0, bgRadius, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw subtle border
      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw initials (first 2 letters, uppercase) - same as list view
      const initials = node.name.substring(0, 2).toUpperCase()
      ctx.fillStyle = isDarkMode ? '#4ECDC4' : '#2563eb' // vscode-blue color
      ctx.font = `bold ${bgRadius * 0.45}px sans-serif` // Slightly smaller for less congestion
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(initials, 0, 0)
      ctx.restore()
    }

    // Draw label with correct position (after all transformations)
    if (showLabels && (globalScale > 0.5 || isSelected || isHovered)) {
      ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000'
      ctx.font = `${isSelected ? 14 : isHovered ? 12 : 10}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      // Calculate actual rendered size: baseCircleRadius * scale = circleRadius
      const actualRenderedSize = baseCircleRadius * scale
      const labelY = animatedY + actualRenderedSize + 15
      ctx.fillText(node.name, animatedX, labelY)
    }
  }, [selectedNode, hoveredNode, isDarkMode, showLabels])

  // Initialize force simulation
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    // Prepare nodes and links for d3
    const d3Nodes = nodes.map(n => ({ ...n, x: n.x || Math.random() * canvas.width, y: n.y || Math.random() * canvas.height }))
    const d3Links = links.map(l => ({
      source: typeof l.source === 'string' ? d3Nodes.find(n => n.id === l.source) : l.source,
      target: typeof l.target === 'string' ? d3Nodes.find(n => n.id === l.target) : l.target,
      ...l
    })).filter(l => l.source && l.target) as any[]

    // Create force simulation with increased spacing
    const simulation = forceSimulation<GraphNode>(d3Nodes as any)
      .force('link', forceLink<GraphNode, GraphLink>(d3Links).id((d: any) => d.id).distance(150)) // Increased from 100 to 150
      .force('charge', forceManyBody().strength(-500)) // Increased repulsion from -300 to -500
      .force('collision', forceCollide().radius((d: any) => {
        // Prevent circles from overlapping - use max circle radius (28px) + padding
        return 28 + 10 // Max radius + 10px padding
      }))
      .force('center', forceCenter(canvas.width / 2, canvas.height / 2))

    simulationRef.current = simulation

    let animationFrameId: number
    let startTime = Date.now()
    
    // Animation loop
    const animate = () => {
      // Update animation time for floating effect
      animationTimeRef.current = (Date.now() - startTime) / 1000
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw beautiful gradient background using theme colors
      const bgColor = currentTheme?.colors?.bg || (isDarkMode ? '#0a0a0f' : '#f5f5f5')
      const bgSecondary = currentTheme?.colors?.sidebar || (isDarkMode ? '#1a1a2e' : '#ffffff')
      const accent1 = currentTheme?.colors?.blue || (isDarkMode ? '#007acc' : '#2563eb')
      const accent2 = currentTheme?.colors?.green || (isDarkMode ? '#4ec9b0' : '#10b981')
      
      // Create diagonal gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, bgColor)
      bgGradient.addColorStop(0.3, bgSecondary)
      bgGradient.addColorStop(0.6, bgColor)
      bgGradient.addColorStop(1, bgSecondary)
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add subtle radial gradients for depth
      const radial1 = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.2, 0, canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.6)
      radial1.addColorStop(0, isDarkMode ? `${accent1}20` : `${accent1}10`)
      radial1.addColorStop(1, 'transparent')
      ctx.fillStyle = radial1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const radial2 = ctx.createRadialGradient(canvas.width * 0.8, canvas.height * 0.8, 0, canvas.width * 0.8, canvas.height * 0.8, canvas.width * 0.6)
      radial2.addColorStop(0, isDarkMode ? `${accent2}20` : `${accent2}10`)
      radial2.addColorStop(1, 'transparent')
      ctx.fillStyle = radial2
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Apply zoom and pan transformations - use ref for smooth panning
      ctx.save()
      ctx.translate(panRef.current.x, panRef.current.y)
      ctx.scale(zoomRef.current, zoomRef.current)

      // Draw links with floating animation
      d3Links.forEach(link => {
        const source = link.source as GraphNode
        const target = link.target as GraphNode
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return

        // Calculate floating offsets for source and target nodes
        const sourceIdHash = source.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const targetIdHash = target.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        
        const sourceFloatSpeed = 0.5 + (sourceIdHash % 100) / 200
        const sourceFloatAmount = 2 + (sourceIdHash % 50) / 25
        const sourceFloatX = Math.sin(animationTimeRef.current * Math.PI * 2 / sourceFloatSpeed + sourceIdHash) * sourceFloatAmount
        const sourceFloatY = Math.cos(animationTimeRef.current * Math.PI * 2 / sourceFloatSpeed + sourceIdHash * 0.7) * sourceFloatAmount
        
        const targetFloatSpeed = 0.5 + (targetIdHash % 100) / 200
        const targetFloatAmount = 2 + (targetIdHash % 50) / 25
        const targetFloatX = Math.sin(animationTimeRef.current * Math.PI * 2 / targetFloatSpeed + targetIdHash) * targetFloatAmount
        const targetFloatY = Math.cos(animationTimeRef.current * Math.PI * 2 / targetFloatSpeed + targetIdHash * 0.7) * targetFloatAmount

        const isHighlighted = hoveredNode && (source.id === hoveredNode.id || target.id === hoveredNode.id)
        const opacity = isHighlighted ? 0.6 : 0.2
        const width = isHighlighted ? 2 : 1

        ctx.strokeStyle = link.color || `${isDarkMode ? '#ffffff' : '#000000'}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = width / zoomRef.current
        ctx.beginPath()
        ctx.moveTo(source.x + sourceFloatX, source.y + sourceFloatY)
        ctx.lineTo(target.x + targetFloatX, target.y + targetFloatY)
        ctx.stroke()
      })

      // Draw nodes
      d3Nodes.forEach(node => {
        if (!node.x || !node.y) return
        drawNodeOnCanvas(node, ctx, zoomRef.current)
      })
      
      ctx.restore()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      updateCanvasSize()
      simulation.force('center', forceCenter(canvas.width / 2, canvas.height / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      simulation.stop()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [nodes, links, hoveredNode, selectedNode, isDarkMode, drawNodeOnCanvas, currentTheme])

  // Zoom and pan handlers
  const handleZoom = useCallback((factor: number) => {
    setZoom(prev => Math.max(0.1, Math.min(prev * factor, 10)))
  }, [])

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Code fragments for background
  const codeFragments = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      text: ['const', 'function', 'return', 'import', 'export', 'interface', 'type', 'class'][i % 8],
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.05 + Math.random() * 0.1,
    }))
  }, [])

  const allGroups = ['design', 'development', 'tools', 'visualization']

  // Get theme colors for background
  const bgColor = currentTheme?.colors?.bg || (isDarkMode ? '#0a0a0f' : '#f5f5f5')
  
  // Render the network chart content
  const networkContent = (
    <>
      {/* Floating code fragments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {codeFragments.map(fragment => (
          <motion.div
            key={fragment.id}
            className={`absolute font-mono text-xs transition-colors duration-300`}
            style={{
              left: `${fragment.x}%`,
              top: `${fragment.y}%`,
              opacity: fragment.opacity,
              color: currentTheme?.colors?.blueAccent || (isDarkMode ? '#4ECDC4' : '#2563eb')
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [fragment.opacity, fragment.opacity * 0.5, fragment.opacity],
            }}
             transition={{
               duration: 3 + Math.random() * 2,
               repeat: Infinity,
             }}
          >
            {fragment.text}
          </motion.div>
        ))}
      </div>

      {/* Skill Icons Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {allSkills.slice(0, 30).map((skill, i) => {
          const imageUrl = getSkillImageUrl(skill.id)
          if (!imageUrl) return null
          
          return (
            <motion.div
              key={skill.id}
              className="absolute"
              style={{
                left: `${(i % 6) * 16.66}%`,
                top: `${Math.floor(i / 6) * 10}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            >
              <img
                src={imageUrl}
                alt={skill.name}
                className="w-6 h-6 object-contain"
                style={{
                  filter: isDarkMode ? 'brightness(0.8) opacity(0.15)' : 'brightness(0.9) opacity(0.2)',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Icon Toolbar - Right Side */}
      <div className="absolute right-4 top-4 z-50 flex flex-col gap-2">

        {/* Expand / Minimize - Browser Fullscreen */}
        <Tooltip content={isExpanded ? "Exit Fullscreen" : "Enter Fullscreen"} position="left">
          <motion.button
            onClick={() => {
              if (isExpanded) {
                exitFullscreen()
              } else {
                enterFullscreen()
              }
            }}
            className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
              isDarkMode
                ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
                : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </motion.button>
        </Tooltip>

        {/* Zoom In */}
        <Tooltip content="Zoom In" position="left">
          <motion.button
            onClick={() => handleZoom(1.2)}
            className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
              isDarkMode
                ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
                : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn size={20} />
          </motion.button>
        </Tooltip>

        {/* Zoom Out */}
        <Tooltip content="Zoom Out" position="left">
          <motion.button
            onClick={() => handleZoom(1 / 1.2)}
            className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
              isDarkMode
                ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
                : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomOut size={20} />
          </motion.button>
        </Tooltip>

        {/* Default Center / Reset */}
        <Tooltip content="Reset View / Center" position="left">
          <motion.button
            onClick={resetView}
            className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
              isDarkMode
                ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
                : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw size={20} />
          </motion.button>
        </Tooltip>

        {/* Download */}
        <Tooltip content="Download" position="left">
          <motion.button
            onClick={async () => {
            if (!canvasRef.current) return
            const canvas = canvasRef.current
            
            // Create a new canvas with background
            const exportCanvas = document.createElement('canvas')
            exportCanvas.width = canvas.width
            exportCanvas.height = canvas.height
            const exportCtx = exportCanvas.getContext('2d')
            if (!exportCtx) return
            
            // Draw background
            const bgGradient = exportCtx.createLinearGradient(0, 0, exportCanvas.width, exportCanvas.height)
            if (isDarkMode) {
              bgGradient.addColorStop(0, '#0a0a0f')
              bgGradient.addColorStop(0.5, '#0a0a1a')
              bgGradient.addColorStop(1, '#0a0a0f')
            } else {
              bgGradient.addColorStop(0, '#f5f5f5')
              bgGradient.addColorStop(0.5, '#ffffff')
              bgGradient.addColorStop(1, '#f5f5f5')
            }
            exportCtx.fillStyle = bgGradient
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            
            // Draw background gradients
            const nebula1 = exportCtx.createRadialGradient(exportCanvas.width * 0.2, exportCanvas.height * 0.3, 0, exportCanvas.width * 0.2, exportCanvas.height * 0.3, exportCanvas.width * 0.5)
            nebula1.addColorStop(0, isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 107, 157, 0.05)')
            nebula1.addColorStop(1, 'transparent')
            exportCtx.fillStyle = nebula1
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            
            const nebula2 = exportCtx.createRadialGradient(exportCanvas.width * 0.8, exportCanvas.height * 0.7, 0, exportCanvas.width * 0.8, exportCanvas.height * 0.7, exportCanvas.width * 0.5)
            nebula2.addColorStop(0, isDarkMode ? 'rgba(78, 205, 196, 0.15)' : 'rgba(78, 205, 196, 0.05)')
            nebula2.addColorStop(1, 'transparent')
            exportCtx.fillStyle = nebula2
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            
            // Draw the network graph on top
            exportCtx.drawImage(canvas, 0, 0)
            
            // Download
            const link = document.createElement('a')
            const format = downloadFormat === 'svg' ? 'svg' : downloadFormat
            link.download = `skills-network.${format}`
            
            if (format === 'svg') {
              const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportCanvas.width}" height="${exportCanvas.height}">
                <foreignObject width="100%" height="100%">
                  <img src="${exportCanvas.toDataURL('image/png')}" width="${exportCanvas.width}" height="${exportCanvas.height}"/>
                </foreignObject>
              </svg>`
              const blob = new Blob([svg], { type: 'image/svg+xml' })
              link.href = URL.createObjectURL(blob)
            } else {
              link.href = exportCanvas.toDataURL(`image/${format}`)
            }
            link.click()
            toast.success(`Downloaded ${format.toUpperCase()} with background`)
          }}
          className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
            isDarkMode
              ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
              : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Download"
        >
          <Download size={20} />
        </motion.button>
        </Tooltip>

        {/* Copy / Share (Combined) */}
        <Tooltip content={copied ? "Copied!" : "Copy / Share"} position="left">
          <motion.button
            onClick={async () => {
            if (!canvasRef.current) return
            try {
              const canvas = canvasRef.current
              
              // Create canvas with background
              const exportCanvas = document.createElement('canvas')
              exportCanvas.width = canvas.width
              exportCanvas.height = canvas.height
              const exportCtx = exportCanvas.getContext('2d')
              if (!exportCtx) return
              
              // Draw background
              const bgGradient = exportCtx.createLinearGradient(0, 0, exportCanvas.width, exportCanvas.height)
              if (isDarkMode) {
                bgGradient.addColorStop(0, '#0a0a0f')
                bgGradient.addColorStop(0.5, '#0a0a1a')
                bgGradient.addColorStop(1, '#0a0a0f')
              } else {
                bgGradient.addColorStop(0, '#f5f5f5')
                bgGradient.addColorStop(0.5, '#ffffff')
                bgGradient.addColorStop(1, '#f5f5f5')
              }
              exportCtx.fillStyle = bgGradient
              exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
              
              // Draw background gradients
              const nebula1 = exportCtx.createRadialGradient(exportCanvas.width * 0.2, exportCanvas.height * 0.3, 0, exportCanvas.width * 0.2, exportCanvas.height * 0.3, exportCanvas.width * 0.5)
              nebula1.addColorStop(0, isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 107, 157, 0.05)')
              nebula1.addColorStop(1, 'transparent')
              exportCtx.fillStyle = nebula1
              exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
              
              const nebula2 = exportCtx.createRadialGradient(exportCanvas.width * 0.8, exportCanvas.height * 0.7, 0, exportCanvas.width * 0.8, exportCanvas.height * 0.7, exportCanvas.width * 0.5)
              nebula2.addColorStop(0, isDarkMode ? 'rgba(78, 205, 196, 0.15)' : 'rgba(78, 205, 196, 0.05)')
              nebula2.addColorStop(1, 'transparent')
              exportCtx.fillStyle = nebula2
              exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
              
              // Draw network graph
              exportCtx.drawImage(canvas, 0, 0)
              
              // Copy to clipboard
              exportCanvas.toBlob(async (blob) => {
                if (blob) {
                  await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                  ])
                  setCopied(true)
                  toast.success('Copied to clipboard!')
                  setTimeout(() => setCopied(false), 2000)
                }
              })
            } catch (err) {
              // Fallback: download as image
              const canvas = canvasRef.current
              const link = document.createElement('a')
              link.download = 'skills-network.png'
              link.href = canvas.toDataURL('image/png')
              link.click()
              toast.success('Downloaded as PNG')
            }
          }}
          className={`p-3 rounded-lg backdrop-blur-xl border shadow-lg ${
            isDarkMode
              ? 'bg-[#1a1a2e]/90 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-[#1a1a2e]'
              : 'bg-white/90 border-blue-500/40 text-gray-900 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:bg-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {copied ? <Check size={20} /> : <Share2 size={20} />}
        </motion.button>
        </Tooltip>

      </div>

      {/* Network Graph */}
      <div className="absolute inset-0">
        {nodes.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseMove={(e) => {
              if (!canvasRef.current) return
              const rect = canvasRef.current.getBoundingClientRect()
              
              if (isPanningRef.current) {
                // Smooth panning - update ref directly to avoid re-renders
                const dx = e.clientX - lastPanPointRef.current.x
                const dy = e.clientY - lastPanPointRef.current.y
                panRef.current = { 
                  x: panRef.current.x + dx, 
                  y: panRef.current.y + dy 
                }
                lastPanPointRef.current = { x: e.clientX, y: e.clientY }
                // Throttle state update to reduce flickering
                if (hoverUpdateTimeoutRef.current) {
                  clearTimeout(hoverUpdateTimeoutRef.current)
                }
                hoverUpdateTimeoutRef.current = setTimeout(() => {
                  setPan(panRef.current)
                }, 16) // Update at ~60fps
                return // Don't process hover when panning
              }
              
              const x = (e.clientX - rect.left - panRef.current.x) / zoomRef.current
              const y = (e.clientY - rect.top - panRef.current.y) / zoomRef.current
              
              if (isDraggingRef.current && dragNodeRef.current) {
                // Smooth drag - calculate relative movement from drag start
                const dx = (e.clientX - dragStartRef.current.x) / zoomRef.current
                const dy = (e.clientY - dragStartRef.current.y) / zoomRef.current
                dragNodeRef.current.fx = dragStartRef.current.nodeX + dx
                dragNodeRef.current.fy = dragStartRef.current.nodeY + dy
                if (simulationRef.current) {
                  simulationRef.current.alpha(0.3).restart()
                }
              } else {
                // Find hovered node with better detection
                const hovered = nodes.find(node => {
                  if (!node.x || !node.y) return false
                  const dx = x - node.x
                  const dy = y - node.y
                  const distance = Math.sqrt(dx * dx + dy * dy)
                  const nodeSize = (node.size || 10) * (selectedNode?.id === node.id ? 1.3 : hoveredNode?.id === node.id ? 1.15 : 1)
                  return distance < nodeSize * 2.5
                })
                
                // Only update hover state if it changed
                if (hovered?.id !== hoveredNode?.id) {
                  handleNodeHover(hovered || null)
                }
                
                // Throttle tooltip position updates
                hoverTooltipPosRef.current = { x: e.clientX, y: e.clientY }
                if (hovered && hoverUpdateTimeoutRef.current === null) {
                  hoverUpdateTimeoutRef.current = setTimeout(() => {
                    setHoverTooltipPos(hoverTooltipPosRef.current)
                    hoverUpdateTimeoutRef.current = null
                  }, 16) // Update at ~60fps
                }
              }
            }}
            onClick={(e) => {
              if (isDraggingRef.current || isPanningRef.current) return // Don't click if dragging or panning
              if (!canvasRef.current) return
              const rect = canvasRef.current.getBoundingClientRect()
              const x = (e.clientX - rect.left - panRef.current.x) / zoomRef.current
              const y = (e.clientY - rect.top - panRef.current.y) / zoomRef.current
              
              // Find clicked node
              const clicked = nodes.find(node => {
                if (!node.x || !node.y) return false
                const dx = x - node.x
                const dy = y - node.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                return distance < (node.size || 10) * 2
              })
              if (clicked) handleNodeClick(clicked)
            }}
            onMouseDown={(e) => {
              if (!canvasRef.current) return
              e.preventDefault() // Prevent text selection
              const rect = canvasRef.current.getBoundingClientRect()
              const x = (e.clientX - rect.left - panRef.current.x) / zoomRef.current
              const y = (e.clientY - rect.top - panRef.current.y) / zoomRef.current
              
              const clicked = nodes.find(node => {
                if (!node.x || !node.y) return false
                const dx = x - node.x
                const dy = y - node.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                return distance < (node.size || 10) * 2
              })
              
              if (clicked) {
                isDraggingRef.current = true
                dragNodeRef.current = clicked
                dragStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  nodeX: clicked.x || 0,
                  nodeY: clicked.y || 0
                }
                if (simulationRef.current) {
                  clicked.fx = clicked.x || 0
                  clicked.fy = clicked.y || 0
                  simulationRef.current.alphaTarget(0.3).restart()
                }
                // Change cursor to grabbing
                if (canvasRef.current) {
                  canvasRef.current.style.cursor = 'grabbing'
                }
              } else {
                // Start panning
                isPanningRef.current = true
                lastPanPointRef.current = { x: e.clientX, y: e.clientY }
                // Change cursor to grabbing
                if (canvasRef.current) {
                  canvasRef.current.style.cursor = 'grabbing'
                }
              }
            }}
            onMouseUp={() => {
              if (dragNodeRef.current) {
                dragNodeRef.current.fx = null
                dragNodeRef.current.fy = null
                dragNodeRef.current = null
              }
              isDraggingRef.current = false
              isPanningRef.current = false
              // Reset cursor
              if (canvasRef.current) {
                canvasRef.current.style.cursor = 'move'
              }
            }}
            onMouseLeave={() => {
              if (dragNodeRef.current) {
                dragNodeRef.current.fx = null
                dragNodeRef.current.fy = null
                dragNodeRef.current = null
              }
              isDraggingRef.current = false
              isPanningRef.current = false
              handleNodeHover(null)
              // Reset cursor
              if (canvasRef.current) {
                canvasRef.current.style.cursor = 'move'
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center p-8 rounded-lg backdrop-blur-lg ${
              isDarkMode
                ? 'bg-[#1a1a2e]/90 border border-cyan-500/30 text-white'
                : 'bg-white/90 border border-blue-500/30 text-gray-900'
            }`}>
              <Network size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No Skills Found</h3>
              <p className="text-sm opacity-75">Try adjusting your filters to see more skills.</p>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip - Using Project Tooltip Style */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-[9999] pointer-events-none"
            style={{
              left: `${hoverTooltipPos.x + 10}px`,
              top: `${hoverTooltipPos.y - 10}px`,
            }}
          >
            <div className="px-2.5 py-1.5 bg-[#1e1e1e] border border-[#3e3e42] rounded text-xs text-[#cccccc] whitespace-nowrap shadow-2xl">
              <div className="font-semibold">{hoveredNode.name}</div>
              <div className="text-[#858585] mt-0.5">{hoveredNode.category}</div>
              <div className="text-vscode-blue-accent mt-0.5">Level: {hoveredNode.level}%</div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-t-[#3e3e42] border-l-transparent border-r-transparent border-b-transparent border-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Detail Card */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`absolute right-4 top-4 z-50 w-96 p-6 rounded-lg border backdrop-blur-lg shadow-2xl ${
              isDarkMode
                ? 'bg-[#1a1a2e]/95 border-cyan-500/30 text-white'
                : 'bg-white/95 border-blue-500/30 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{selectedNode.name}</h3>
                <p className="text-sm text-gray-400">{selectedNode.category}</p>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={async () => {
                    const text = `${selectedNode.name}\n${selectedNode.description}\nLevel: ${selectedNode.level}%\nCategory: ${selectedNode.category}`
                    try {
                      await navigator.clipboard.writeText(text)
                      toast.success(t('copied') || 'Copied to clipboard!')
                    } catch (err) {
                      toast.error('Failed to copy')
                    }
                  }}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Copy size={16} />
                </motion.button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <p className="text-sm mb-4 text-gray-300">{selectedNode.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                <span className="text-sm">Level: {selectedNode.level}%</span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedNode.level}%` }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                </div>
              </div>

              {selectedNode.years && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-cyan-400" />
                  <span>Experience: {selectedNode.years}</span>
                </div>
              )}

              {selectedNode.projects && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-cyan-400" />
                  <span>Projects: {selectedNode.projects}</span>
                </div>
              )}

              {selectedNode.certifications && selectedNode.certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                    <Award size={16} className="text-cyan-400" />
                    <span>Certifications</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {selectedNode.certifications.map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedNode.website || skillWebsites[selectedNode.id]) && (
                <a
                  href={selectedNode.website || skillWebsites[selectedNode.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Learn more</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )

  // Normal view - Browser Fullscreen API handles hiding browser UI
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden transition-colors duration-300" 
      style={{ backgroundColor: bgColor }}
    >
      {networkContent}
    </div>
  )
}

