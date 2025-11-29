'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Search, X, Filter, ZoomIn, ZoomOut, RotateCcw, Settings,
  Target, Zap, Layers, Code, TrendingUp, Award, Briefcase, Clock,
  ExternalLink, Sparkles, Eye, ChevronDown, ChevronUp, SlidersHorizontal
} from 'lucide-react'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'
import { skillWebsites } from '@/lib/skill-websites'

interface Skill {
  id: string
  name: string
  description: string
  category: string
  level: number
  years?: string
  verified?: boolean
  tags?: string[]
  projects?: number
  experience?: string
  certifications?: string[]
  website?: string
}

interface StarNode extends Skill {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  constellation?: string
  size?: number
  color?: string
  glowIntensity?: number
  pulsePhase?: number
  orbitRadius?: number
  orbitAngle?: number
}

interface ConstellationLink {
  source: string | StarNode
  target: string | StarNode
  type?: 'constellation' | 'related'
  particleProgress?: number
}

// All skills data
const allSkills: Skill[] = [
  { id: 'javascript', name: 'JavaScript', description: 'Core web development language — ES6+, async programming, and modern patterns', category: 'Frontend Language', level: 90, years: '4+', verified: true, tags: ['frontend', 'javascript', 'es6'], projects: 15, experience: 'Expert', certifications: ['Meta Front-End Developer'] },
  { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript development — Strong typing, interfaces, and modern ES6+ features', category: 'Frontend Language', level: 88, years: '3+', verified: true, tags: ['typescript', 'typing', 'javascript'], projects: 12, experience: 'Advanced' },
  { id: 'html', name: 'HTML', description: 'Semantic markup and modern web standards — Accessibility and SEO optimization', category: 'Frontend Language', level: 95, years: '4+', verified: true, tags: ['html', 'markup', 'semantic'], projects: 20, experience: 'Expert' },
  { id: 'css', name: 'CSS', description: 'Advanced styling and animations — Flexbox, Grid, and responsive design', category: 'Frontend Language', level: 92, years: '4+', verified: true, tags: ['css', 'styling', 'responsive'], projects: 18, experience: 'Expert' },
  { id: 'scss', name: 'SCSS', description: 'CSS preprocessor — Variables, mixins, and modular styling architecture', category: 'Frontend Language', level: 85, years: '3+', verified: true, tags: ['scss', 'preprocessor', 'sass'], projects: 9, experience: 'Advanced' },
  { id: 'sass', name: 'SASS', description: 'Syntactically Awesome Stylesheets — CSS extension language with variables and nesting', category: 'Frontend Language', level: 85, years: '3+', tags: ['sass', 'preprocessor', 'css'], projects: 9, experience: 'Advanced' },
  { id: 'c', name: 'C', description: 'General-purpose programming language — System programming and low-level development', category: 'Programming Language', level: 70, years: '2+', tags: ['c', 'system', 'programming'], projects: 3, experience: 'Intermediate' },
  { id: 'cpp', name: 'C++', description: 'Object-oriented programming language — System development and performance-critical applications', category: 'Programming Language', level: 72, years: '2+', tags: ['cpp', 'oop', 'system'], projects: 3, experience: 'Intermediate' },
  { id: 'python', name: 'Python', description: 'Backend development and scripting — Django framework and automation', category: 'Programming Language', level: 75, years: '2+', tags: ['python', 'backend', 'scripting'], projects: 4, experience: 'Intermediate' },
  { id: 'php', name: 'PHP', description: 'Server-side scripting — Dynamic web pages and backend logic', category: 'Programming Language', level: 72, years: '2+', tags: ['php', 'backend', 'server'], projects: 3, experience: 'Intermediate' },
  { id: 'sql', name: 'SQL', description: 'Database query language — Data manipulation, optimization, and management', category: 'Programming Language', level: 78, years: '3+', tags: ['sql', 'database', 'mysql'], projects: 6, experience: 'Intermediate' },
  { id: 'jquery', name: 'jQuery', description: 'JavaScript library — DOM manipulation and event handling', category: 'JavaScript Library', level: 80, years: '2+', tags: ['jquery', 'javascript', 'dom'], projects: 8, experience: 'Advanced' },
  { id: 'react', name: 'React', description: 'Frontend library — Component-based UI development and state management', category: 'Frontend Library', level: 85, years: '2+', verified: true, tags: ['react', 'frontend', 'components'], projects: 7, experience: 'Advanced', certifications: ['Meta React Basics'] },
  { id: 'rxjs', name: 'RxJS', description: 'Reactive Extensions for JavaScript — Reactive programming and observables', category: 'Frontend Library', level: 80, years: '2+', tags: ['rxjs', 'reactive', 'observables'], projects: 5, experience: 'Advanced' },
  { id: 'angular', name: 'Angular', description: 'Frontend framework — Building scalable applications with reactive forms, routing, and state management', category: 'Frontend Framework', level: 92, years: '3+', verified: true, tags: ['angular', 'framework', 'typescript'], projects: 8, experience: 'Expert', certifications: ['Angular Certification'] },
  { id: 'nextjs', name: 'Next.js', description: 'React framework — Server-side rendering, static site generation, and full-stack development', category: 'Frontend Framework', level: 82, years: '2+', verified: true, tags: ['nextjs', 'react', 'ssr', 'fullstack'], projects: 6, experience: 'Advanced' },
  { id: 'bootstrap', name: 'Bootstrap', description: 'Responsive CSS framework — Grid system and utility classes for rapid development', category: 'CSS Framework', level: 88, years: '3+', verified: true, tags: ['bootstrap', 'css', 'responsive'], projects: 10, experience: 'Advanced' },
  { id: 'angular-material', name: 'Angular Material', description: 'Material Design component library — Consistent UI components and theming', category: 'UI Framework', level: 90, years: '3+', verified: true, tags: ['angular-material', 'ui', 'material'], projects: 7, experience: 'Expert' },
  { id: 'micro-frontend', name: 'Micro Frontend', description: 'Architectural pattern — Modular frontend applications and independent deployment', category: 'Architecture', level: 80, years: '2+', tags: ['micro-frontend', 'architecture', 'modular'], projects: 4, experience: 'Advanced' },
  { id: 'd3', name: 'D3.js', description: 'Data visualization library — Complex visualizations and interactive charts', category: 'JavaScript Library', level: 85, years: '2+', verified: true, tags: ['d3', 'visualization', 'charts'], projects: 5, experience: 'Advanced' },
  { id: 'storybook', name: 'Storybook', description: 'Component development environment — Isolated component testing and documentation', category: 'JavaScript Library', level: 80, years: '1+', tags: ['storybook', 'components', 'testing'], projects: 5, experience: 'Advanced' },
  { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime — Backend development and server-side scripting', category: 'Backend Runtime', level: 78, years: '2+', tags: ['nodejs', 'backend', 'javascript'], projects: 5, experience: 'Intermediate' },
  { id: 'django', name: 'Django', description: 'Python web framework — Rapid development of secure and maintainable websites', category: 'Backend Framework', level: 70, years: '1+', tags: ['django', 'python', 'backend'], projects: 2, experience: 'Intermediate' },
  { id: 'django-rest', name: 'Django REST', description: 'Django toolkit — Building RESTful APIs with Django', category: 'Backend Framework', level: 72, years: '1+', tags: ['django', 'rest', 'api'], projects: 3, experience: 'Intermediate' },
  { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework — Rapid UI development with utility classes', category: 'CSS Framework', level: 85, years: '2+', verified: true, tags: ['tailwind', 'css', 'utilities'], projects: 8, experience: 'Advanced' },
  { id: 'git', name: 'Git', description: 'Distributed version control system — Branching, merging, and collaborative workflows', category: 'Version Control', level: 90, years: '4+', verified: true, tags: ['git', 'version-control', 'vcs'], projects: 25, experience: 'Expert' },
  { id: 'gitlab', name: 'GitLab', description: 'Git repository management — CI/CD, code review, and project management', category: 'Version Control', level: 85, years: '3+', tags: ['gitlab', 'repository', 'ci-cd'], projects: 12, experience: 'Advanced' },
  { id: 'git-desktop', name: 'Git Desktop', description: 'Git GUI application — Visual version control and repository management', category: 'Version Control', level: 80, years: '3+', tags: ['git-desktop', 'gui', 'git'], projects: 10, experience: 'Advanced' },
  { id: 'figma', name: 'Figma', description: 'UI/UX design and prototyping — Design systems and collaboration', category: 'Design Tool', level: 85, years: '3+', tags: ['figma', 'design', 'ui', 'ux'], projects: 12, experience: 'Advanced' },
  { id: 'adobe-xd', name: 'Adobe XD', description: 'User experience design — Prototyping and wireframing', category: 'Design Tool', level: 80, years: '2+', tags: ['adobe-xd', 'design', 'prototyping'], projects: 6, experience: 'Advanced' },
  { id: 'jenkins', name: 'Jenkins', description: 'CI/CD automation — Build pipelines and deployment', category: 'DevOps Tool', level: 75, years: '1+', tags: ['jenkins', 'ci-cd', 'automation'], projects: 3, experience: 'Intermediate' },
  { id: 'mysql-workbench', name: 'MySQL Workbench', description: 'Database design and administration — Visual database tools and SQL development', category: 'Database Tool', level: 78, years: '3+', tags: ['mysql', 'database', 'sql'], projects: 6, experience: 'Intermediate' },
  { id: 'visual-studio', name: 'Visual Studio', description: 'Integrated development environment — Full-featured IDE for various languages', category: 'IDE', level: 80, years: '3+', tags: ['visual-studio', 'ide', 'development'], projects: 15, experience: 'Advanced' },
  { id: 'vscode', name: 'VS Code', description: 'Code editor — Lightweight IDE with extensive extension support', category: 'Code Editor', level: 92, years: '4+', verified: true, tags: ['vscode', 'editor', 'ide'], projects: 20, experience: 'Expert' },
  { id: 'chrome-devtools', name: 'Chrome DevTools', description: 'Web development tools — Debugging, profiling, and performance analysis', category: 'Development Tool', level: 88, years: '4+', tags: ['devtools', 'debugging', 'chrome'], projects: 18, experience: 'Advanced' },
  { id: 'postman', name: 'Postman', description: 'API development and testing — REST API testing and documentation', category: 'API Tool', level: 82, years: '2+', tags: ['postman', 'api', 'testing'], projects: 8, experience: 'Advanced' },
  { id: 'office', name: 'Microsoft Office', description: 'Productivity suite — Word, Excel, PowerPoint, Outlook, Teams', category: 'Productivity Tool', level: 85, years: '4+', tags: ['office', 'productivity', 'microsoft'], projects: 12, experience: 'Advanced' },
  { id: 'cursor', name: 'Cursor', description: 'Real-time collaborative coding tool — Pair programming and code collaboration', category: 'Collaboration Tool', level: 80, years: '2+', tags: ['cursor', 'collaboration', 'coding'], projects: 5, experience: 'Advanced' },
  { id: 'npm', name: 'npm', description: 'Node Package Manager — Package management and dependency resolution', category: 'Package Manager', level: 88, years: '4+', tags: ['npm', 'package-manager', 'node'], projects: 20, experience: 'Advanced' },
  { id: 'frontend-dev', name: 'Frontend Development', description: 'Building responsive and interactive web applications', category: 'Expertise', level: 92, years: '4+', verified: true, tags: ['frontend', 'development', 'web'], projects: 20, experience: 'Expert' },
  { id: 'responsive-design', name: 'Responsive Design', description: 'Creating mobile-first and adaptive user interfaces', category: 'Expertise', level: 90, years: '4+', verified: true, tags: ['responsive', 'mobile', 'design'], projects: 18, experience: 'Expert' },
  { id: 'ui-design', name: 'UI Design', description: 'Designing intuitive and accessible user interfaces', category: 'Expertise', level: 88, years: '3+', tags: ['ui', 'design', 'ux'], projects: 15, experience: 'Advanced' },
  { id: 'api-integration', name: 'API Integration', description: 'Integrating RESTful APIs and third-party services', category: 'Expertise', level: 88, years: '3+', verified: true, tags: ['api', 'integration', 'rest'], projects: 14, experience: 'Advanced' },
  { id: 'performance', name: 'Performance Optimization', description: 'Optimizing application performance and load times', category: 'Expertise', level: 85, years: '3+', tags: ['performance', 'optimization', 'speed'], projects: 12, experience: 'Advanced' },
  { id: 'agile', name: 'Agile Methodologies', description: 'Scrum, Kanban, and iterative development practices', category: 'Expertise', level: 85, years: '3+', tags: ['agile', 'scrum', 'methodology'], projects: 10, experience: 'Advanced' },
  { id: 'collaboration', name: 'Cross-Functional Collaboration', description: 'Working with designers, backend developers, and stakeholders', category: 'Expertise', level: 88, years: '3+', tags: ['collaboration', 'teamwork'], projects: 15, experience: 'Advanced' },
  { id: 'code-review', name: 'Code Review', description: 'Reviewing code for quality, maintainability, and best practices', category: 'Expertise', level: 85, years: '3+', tags: ['code-review', 'quality'], projects: 12, experience: 'Advanced' },
  { id: 'state-management', name: 'State Management', description: 'Managing application state with NgRx and reactive patterns', category: 'Expertise', level: 82, years: '2+', tags: ['ngrx', 'state', 'management'], projects: 6, experience: 'Advanced' },
  { id: 'accessibility', name: 'Web Accessibility', description: 'Ensuring web applications meet WCAG accessibility standards', category: 'Expertise', level: 80, years: '2+', tags: ['accessibility', 'wcag', 'a11y'], projects: 8, experience: 'Advanced' },
  { id: 'pwa', name: 'Progressive Web Apps', description: 'Building Progressive Web Applications with offline support', category: 'Expertise', level: 78, years: '2+', tags: ['pwa', 'progressive', 'offline'], projects: 4, experience: 'Intermediate' },
  { id: 'testing', name: 'Testing Frameworks', description: 'Jasmine, Karma, Cypress — Unit, integration, and e2e testing', category: 'Expertise', level: 80, years: '2+', tags: ['testing', 'jasmine', 'cypress'], projects: 7, experience: 'Advanced' },
  { id: 'auth', name: 'Secure Authentication', description: 'JWT, OAuth — Implementing secure authentication and authorization', category: 'Expertise', level: 82, years: '2+', tags: ['auth', 'jwt', 'oauth', 'security'], projects: 6, experience: 'Advanced' },
]

// Constellation mapping
const constellationMap: Record<string, string> = {
  'Frontend Language': 'Core Skills',
  'Programming Language': 'Core Skills',
  'Frontend Library': 'Frameworks',
  'Frontend Framework': 'Frameworks',
  'JavaScript Library': 'Frameworks',
  'CSS Framework': 'Frameworks',
  'UI Framework': 'Frameworks',
  'Backend Runtime': 'Architecture',
  'Backend Framework': 'Architecture',
  'Architecture': 'Architecture',
  'Version Control': 'Tools',
  'Design Tool': 'Tools',
  'DevOps Tool': 'Tools',
  'Database Tool': 'Tools',
  'IDE': 'Tools',
  'Code Editor': 'Tools',
  'Development Tool': 'Tools',
  'API Tool': 'Tools',
  'Productivity Tool': 'Tools',
  'Collaboration Tool': 'Tools',
  'Package Manager': 'Tools',
  'Expertise': 'Creativity',
}

// Star colors by constellation
const constellationColors: Record<string, string> = {
  'Core Skills': '#FFD700', // Gold
  'Frameworks': '#00FFFF', // Cyan
  'Architecture': '#9933FF', // Purple
  'Tools': '#00FF00', // Green
  'Creativity': '#FF00CC', // Pink
}

export function SkillConstellationGalaxy() {
  const [selectedStar, setSelectedStar] = useState<StarNode | null>(null)
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConstellations, setSelectedConstellations] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState(0)
  const [viewMode, setViewMode] = useState<'current-focus' | 'core-strengths' | 'learning-now'>('current-focus')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(true)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [animationTime, setAnimationTime] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simulationRef = useRef<d3.Simulation<StarNode, ConstellationLink> | null>(null)
  const isDraggingRef = useRef(false)
  const isPanningRef = useRef(false)
  const dragStarRef = useRef<StarNode | null>(null)
  const lastPanPointRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>>([])

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const matchesSearch = !searchQuery ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase())

      const constellation = constellationMap[skill.category] || 'Core Skills'
      const matchesConstellation = selectedConstellations.length === 0 ||
        selectedConstellations.includes(constellation)

      const matchesLevel = skill.level >= minLevel

      // View mode filtering
      let matchesView = true
      if (viewMode === 'core-strengths') {
        matchesView = skill.level >= 85
      } else if (viewMode === 'learning-now') {
        matchesView = skill.level < 80
      }

      return matchesSearch && matchesConstellation && matchesLevel && matchesView
    })
  }, [searchQuery, selectedConstellations, minLevel, viewMode])

  // Generate star nodes and constellation links
  const { stars, links } = useMemo(() => {
    const starMap = new Map<string, StarNode>()
    
    filteredSkills.forEach((skill, index) => {
      const constellation = constellationMap[skill.category] || 'Core Skills'
      const color = constellationColors[constellation] || '#FFFFFF'
      const size = 3 + (skill.level / 20)
      const glowIntensity = skill.level / 100

      starMap.set(skill.id, {
        ...skill,
        constellation,
        size,
        color,
        glowIntensity,
        pulsePhase: Math.random() * Math.PI * 2,
        orbitRadius: 0,
        orbitAngle: Math.random() * Math.PI * 2,
      })
    })

    const linkMap = new Map<string, ConstellationLink>()

    // Create constellation links (same constellation)
    filteredSkills.forEach(skill1 => {
      filteredSkills.forEach(skill2 => {
        if (skill1.id !== skill2.id) {
          const const1 = constellationMap[skill1.category] || 'Core Skills'
          const const2 = constellationMap[skill2.category] || 'Core Skills'
          
          if (const1 === const2) {
            const key = [skill1.id, skill2.id].sort().join('-')
            if (!linkMap.has(key)) {
              linkMap.set(key, {
                source: skill1.id,
                target: skill2.id,
                type: 'constellation',
                particleProgress: Math.random(),
              })
            }
          } else if (skill1.tags && skill2.tags) {
            const sharedTags = skill1.tags.filter(tag => skill2.tags!.includes(tag))
            if (sharedTags.length > 0) {
              const key = [skill1.id, skill2.id].sort().join('-')
              if (!linkMap.has(key)) {
                linkMap.set(key, {
                  source: skill1.id,
                  target: skill2.id,
                  type: 'related',
                  particleProgress: Math.random(),
                })
              }
            }
          }
        }
      })
    })

    return {
      stars: Array.from(starMap.values()),
      links: Array.from(linkMap.values()),
    }
  }, [filteredSkills])

  // Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      setAnimationTime(time / 1000)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])

  // Initialize simulation and rendering
  useEffect(() => {
    if (!canvasRef.current || stars.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    const d3Stars = stars.map(s => ({
      ...s,
      x: s.x || Math.random() * canvas.width,
      y: s.y || Math.random() * canvas.height,
    }))

    const d3Links = links.map(l => ({
      source: typeof l.source === 'string' ? d3Stars.find(s => s.id === l.source) : l.source,
      target: typeof l.target === 'string' ? d3Stars.find(s => s.id === l.target) : l.target,
      ...l
    })).filter(l => l.source && l.target) as any[]

    const simulation = forceSimulation<StarNode>(d3Stars as any)
      .force('link', forceLink<StarNode, ConstellationLink>(d3Links).id((d: any) => d.id).distance(150))
      .force('charge', forceManyBody().strength(-500))
      .force('center', forceCenter(canvas.width / 2, canvas.height / 2))

    simulationRef.current = simulation

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(pan.x, pan.y)
      ctx.scale(zoom, zoom)

      // Draw constellation links with light trails
      d3Links.forEach(link => {
        const source = link.source as StarNode
        const target = link.target as StarNode
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return

        const isHighlighted = hoveredStar && (source.id === hoveredStar.id || target.id === hoveredStar.id)
        const opacity = isHighlighted ? 0.6 : 0.2

        // Draw gradient line
        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y)
        const linkColor = link.type === 'constellation' ? source.color : '#888888'
        gradient.addColorStop(0, `${linkColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.5, `${linkColor}${Math.floor(opacity * 255 * 0.5).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${linkColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = (isHighlighted ? 2 : 1) / zoom
        ctx.shadowBlur = isHighlighted ? 15 : 5
        ctx.shadowColor = linkColor
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw flowing particles
        if (particlesEnabled) {
          const progress = ((animationTime * 0.3 + (link.particleProgress || 0)) % 1)
          const px = source.x + (target.x - source.x) * progress
          const py = source.y + (target.y - source.y) * progress

          const particleGlow = ctx.createRadialGradient(px, py, 0, px, py, 4)
          particleGlow.addColorStop(0, `${linkColor}FF`)
          particleGlow.addColorStop(1, `${linkColor}00`)

          ctx.fillStyle = particleGlow
          ctx.beginPath()
          ctx.arc(px, py, 4, 0, 2 * Math.PI)
          ctx.fill()
        }
      })

      // Draw stars
      d3Stars.forEach(star => {
        if (!star.x || !star.y) return

        const isSelected = selectedStar?.id === star.id
        const isHovered = hoveredStar?.id === star.id
        const scale = (isSelected ? 1.5 : isHovered ? 1.3 : 1)
        const starSize = (star.size || 5) * scale

        // Update pulse phase
        star.pulsePhase = (star.pulsePhase || 0) + 0.03
        if (star.pulsePhase > Math.PI * 2) star.pulsePhase = 0

        // Draw star glow
        const pulse = 0.5 + 0.5 * Math.sin(star.pulsePhase)
        const glowSize = starSize * (2 + pulse)
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize)
        glowGradient.addColorStop(0, `${star.color}${Math.floor((star.glowIntensity || 0.5) * 255 * pulse).toString(16).padStart(2, '0')}`)
        glowGradient.addColorStop(0.5, `${star.color}${Math.floor((star.glowIntensity || 0.5) * 255 * pulse * 0.5).toString(16).padStart(2, '0')}`)
        glowGradient.addColorStop(1, `${star.color}00`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, glowSize, 0, 2 * Math.PI)
        ctx.fill()

        // Draw star core
        const coreGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, starSize)
        coreGradient.addColorStop(0, star.color)
        coreGradient.addColorStop(0.7, `${star.color}CC`)
        coreGradient.addColorStop(1, `${star.color}80`)

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, starSize, 0, 2 * Math.PI)
        ctx.fill()

        // Draw star spikes
        if (isHovered || isSelected) {
          ctx.strokeStyle = star.color
          ctx.lineWidth = 1 / zoom
          ctx.shadowBlur = 10
          ctx.shadowColor = star.color
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i
            const x1 = star.x + Math.cos(angle) * starSize
            const y1 = star.y + Math.sin(angle) * starSize
            const x2 = star.x + Math.cos(angle) * starSize * 1.5
            const y2 = star.y + Math.sin(angle) * starSize * 1.5
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
          ctx.shadowBlur = 0
        }

        // Draw label (only when zoomed in or hovered)
        if (zoom > 0.8 || isSelected || isHovered) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `${isSelected ? 14 : isHovered ? 12 : 10}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowBlur = 10
          ctx.shadowColor = star.color
          ctx.fillText(star.name, star.x, star.y + starSize + 15)
          ctx.shadowBlur = 0
        }

        // Draw tags when very zoomed in
        if (zoom > 1.5 && star.tags && star.tags.length > 0) {
          ctx.fillStyle = '#888888'
          ctx.font = '8px sans-serif'
          ctx.textAlign = 'center'
          star.tags.slice(0, 3).forEach((tag, i) => {
            ctx.fillText(tag, star.x, star.y + starSize + 25 + i * 10)
          })
        }
      })

      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      updateCanvasSize()
      simulation.force('center', forceCenter(canvas.width / 2, canvas.height / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      simulation.stop()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [stars, links, hoveredStar, selectedStar, pan, zoom, particlesEnabled, animationTime])

  // Particle burst on click
  useEffect(() => {
    if (selectedStar && canvasRef.current) {
      const canvas = canvasRef.current
      const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }> = []
      
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i
        const speed = 2 + Math.random() * 3
        particles.push({
          x: selectedStar.x || canvas.width / 2,
          y: selectedStar.y || canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60,
          color: selectedStar.color || '#FFFFFF',
        })
      }
      
      particlesRef.current = particles
    }
  }, [selectedStar])

  const handleStarClick = useCallback((star: StarNode) => {
    setSelectedStar(star === selectedStar ? null : star)
  }, [selectedStar])

  const handleStarHover = useCallback((star: StarNode | null) => {
    setHoveredStar(star)
  }, [])

  const handleZoom = useCallback((factor: number) => {
    setZoom(prev => Math.max(0.1, Math.min(prev * factor, 5)))
  }, [])

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const allConstellations = ['Core Skills', 'Frameworks', 'Architecture', 'Tools', 'Creativity']

  // Generate starfield
  const starfield = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
    }))
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000011]">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {starfield.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: star.twinkle,
            }}
          />
        ))}
      </div>

      {/* Nebula gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(153, 51, 255, 0.15) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.12) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 204, 0.08) 0%, transparent 60%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Holographic HUD Control Dock */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="absolute left-4 top-4 z-50 w-80 p-4 rounded-lg border backdrop-blur-xl bg-[#0a0a1a]/90 border-cyan-500/40 text-white shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Eye size={20} className="text-cyan-400" />
                Galaxy Controls
              </h2>
              <button
                onClick={() => setShowControls(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-2.5 text-cyan-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full pl-8 pr-2 py-2 rounded text-sm bg-[#000011]/50 border border-cyan-500/40 text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block">View Mode</label>
              <div className="flex gap-2">
                {(['current-focus', 'core-strengths', 'learning-now'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                        : 'bg-[#000011]/50 border border-cyan-500/30 text-gray-300 hover:border-cyan-400'
                    }`}
                  >
                    {mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Constellation Filters */}
            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block">Constellations</label>
              <div className="flex flex-wrap gap-2">
                {allConstellations.map(constellation => {
                  const isSelected = selectedConstellations.includes(constellation)
                  const color = constellationColors[constellation]
                  return (
                    <button
                      key={constellation}
                      onClick={() => {
                        setSelectedConstellations(prev =>
                          isSelected ? prev.filter(c => c !== constellation) : [...prev, constellation]
                        )
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        isSelected
                          ? 'text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                          : 'bg-[#000011]/50 border border-cyan-500/30 text-gray-300 hover:border-cyan-400'
                      }`}
                      style={isSelected ? { backgroundColor: color, boxShadow: `0 0 20px ${color}` } : {}}
                    >
                      {constellation}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block">
                Min Level: {minLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={minLevel}
                onChange={(e) => setMinLevel(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <button
                onClick={() => setParticlesEnabled(!particlesEnabled)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-sm border border-cyan-500/40 hover:border-cyan-400 transition-all bg-[#000011]/50"
              >
                <span>Particle Effects</span>
                <Sparkles size={16} className={particlesEnabled ? 'text-cyan-400' : 'text-gray-400'} />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <div className="text-xs text-gray-400">
                <div>Stars: {stars.length}</div>
                <div>Connections: {links.length}</div>
                <div>Zoom: {Math.round(zoom * 100)}%</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle controls button */}
      {!showControls && (
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setShowControls(true)}
          className="absolute left-4 top-4 z-50 p-3 rounded-lg backdrop-blur-xl border bg-[#0a0a1a]/80 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        >
          <Settings size={20} />
        </motion.button>
      )}

      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 z-50 flex flex-col gap-2">
        <motion.button
          onClick={() => handleZoom(1.2)}
          className="p-3 rounded-lg backdrop-blur-xl border bg-[#0a0a1a]/80 border-cyan-500/40 text-white hover:border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn size={20} />
        </motion.button>
        <motion.button
          onClick={() => handleZoom(1 / 1.2)}
          className="p-3 rounded-lg backdrop-blur-xl border bg-[#0a0a1a]/80 border-cyan-500/40 text-white hover:border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut size={20} />
        </motion.button>
        <motion.button
          onClick={resetView}
          className="p-3 rounded-lg backdrop-blur-xl border bg-[#0a0a1a]/80 border-cyan-500/40 text-white hover:border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw size={20} />
        </motion.button>
      </div>

      {/* Galaxy Canvas */}
      <div className="absolute inset-0">
        {stars.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseMove={(e) => {
              if (!canvasRef.current) return
              const rect = canvasRef.current.getBoundingClientRect()
              const x = (e.clientX - rect.left - pan.x) / zoom
              const y = (e.clientY - rect.top - pan.y) / zoom

              if (isDraggingRef.current && dragStarRef.current) {
                dragStarRef.current.fx = x
                dragStarRef.current.fy = y
                if (simulationRef.current) {
                  simulationRef.current.alpha(0.3).restart()
                }
              } else if (isPanningRef.current) {
                const dx = e.clientX - lastPanPointRef.current.x
                const dy = e.clientY - lastPanPointRef.current.y
                setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
                lastPanPointRef.current = { x: e.clientX, y: e.clientY }
              } else {
                const hovered = stars.find(star => {
                  if (!star.x || !star.y) return false
                  const dx = x - star.x
                  const dy = y - star.y
                  const distance = Math.sqrt(dx * dx + dy * dy)
                  return distance < (star.size || 5) * 3
                })
                handleStarHover(hovered || null)
              }
            }}
            onClick={(e) => {
              if (isDraggingRef.current || isPanningRef.current) return
              if (!canvasRef.current) return
              const rect = canvasRef.current.getBoundingClientRect()
              const x = (e.clientX - rect.left - pan.x) / zoom
              const y = (e.clientY - rect.top - pan.y) / zoom

              const clicked = stars.find(star => {
                if (!star.x || !star.y) return false
                const dx = x - star.x
                const dy = y - star.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                return distance < (star.size || 5) * 2
              })
              if (clicked) handleStarClick(clicked)
            }}
            onMouseDown={(e) => {
              if (!canvasRef.current) return
              const rect = canvasRef.current.getBoundingClientRect()
              const x = (e.clientX - rect.left - pan.x) / zoom
              const y = (e.clientY - rect.top - pan.y) / zoom

              const clicked = stars.find(star => {
                if (!star.x || !star.y) return false
                const dx = x - star.x
                const dy = y - star.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                return distance < (star.size || 5) * 2
              })

              if (clicked) {
                isDraggingRef.current = true
                dragStarRef.current = clicked
                if (simulationRef.current) {
                  clicked.fx = x
                  clicked.fy = y
                  simulationRef.current.alphaTarget(0.3).restart()
                }
              } else {
                isPanningRef.current = true
                lastPanPointRef.current = { x: e.clientX, y: e.clientY }
              }
            }}
            onMouseUp={() => {
              if (dragStarRef.current) {
                dragStarRef.current.fx = null
                dragStarRef.current.fy = null
                dragStarRef.current = null
              }
              isDraggingRef.current = false
              isPanningRef.current = false
            }}
            onMouseLeave={() => {
              if (dragStarRef.current) {
                dragStarRef.current.fx = null
                dragStarRef.current.fy = null
                dragStarRef.current = null
              }
              isDraggingRef.current = false
              isPanningRef.current = false
              handleStarHover(null)
            }}
            onWheel={(e) => {
              e.preventDefault()
              const scaleFactor = 1.1
              const newZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor
              setZoom(Math.max(0.1, Math.min(newZoom, 5)))
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 rounded-lg backdrop-blur-xl border bg-[#0a0a1a]/80 border-cyan-500/40 text-white shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <Star size={48} className="mx-auto mb-4 opacity-50 text-cyan-400" />
              <h3 className="text-xl font-bold mb-2">No Stars Found</h3>
              <p className="text-sm opacity-75">Try adjusting your filters to see more skills.</p>
            </div>
          </div>
        )}
      </div>

      {/* Holographic Info Card */}
      <AnimatePresence>
        {hoveredStar && !selectedStar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute z-40 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-2xl pointer-events-none bg-[#0a0a1a]/95 border-cyan-500/50 text-white shadow-[0_0_30px_rgba(0,255,255,0.5)]"
            style={{
              left: `${(hoveredStar.x || 0) + 30}px`,
              top: `${(hoveredStar.y || 0) - 50}px`,
            }}
          >
            <div className="text-sm font-semibold">{hoveredStar.name}</div>
            <div className="text-xs text-gray-400 mt-1">{hoveredStar.constellation}</div>
            <div className="text-xs text-cyan-400 mt-1">Level: {hoveredStar.level}%</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Star Card */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.9 }}
            className="absolute right-4 top-4 z-50 w-96 p-6 rounded-lg border backdrop-blur-xl shadow-2xl bg-[#0a0a1a]/95 border-cyan-500/50 text-white shadow-[0_0_40px_rgba(0,255,255,0.5)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{selectedStar.name}</h3>
                <p className="text-sm text-gray-400">{selectedStar.constellation}</p>
              </div>
              <button
                onClick={() => setSelectedStar(null)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm mb-4 text-gray-300">{selectedStar.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                <span className="text-sm">Level: {selectedStar.level}%</span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedStar.level}%` }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                  />
                </div>
              </div>

              {selectedStar.years && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-cyan-400" />
                  <span>Experience: {selectedStar.years}</span>
                </div>
              )}

              {selectedStar.projects && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-cyan-400" />
                  <span>Projects: {selectedStar.projects}</span>
                </div>
              )}

              {selectedStar.certifications && selectedStar.certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                    <Award size={16} className="text-cyan-400" />
                    <span>Certifications</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {selectedStar.certifications.map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(selectedStar.website || skillWebsites[selectedStar.id]) && (
                <a
                  href={selectedStar.website || skillWebsites[selectedStar.id]}
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
    </div>
  )
}


