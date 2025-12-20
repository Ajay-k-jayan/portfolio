'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Settings, Clock, Star, CheckCircle2, Star as StarIcon, Search, X, Filter, SortAsc, SortDesc, Download, ChevronDown as ChevronDownIcon, Award, TrendingUp, Sparkles, Zap, Target, Layers, Grid3x3, List, Clock as ClockIcon, Info, LayoutGrid, LayoutList, Code, Heart, Network } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillWebsites } from '@/lib/skill-websites'
import { Tooltip } from '@/components/ui/tooltip'
import { SkillsNetworkChart } from '@/components/skills-network-chart'
import { ViewSwitcher } from '@/components/ui/view-switcher'

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

interface SkillCategory {
  name: string
  skills: Skill[]
}

type SortOption = 'name' | 'level' | 'years' | 'category'
type LevelFilter = 'all' | 'expert' | 'advanced' | 'intermediate' | 'beginner'
type ViewMode = 'grid' | 'list' | 'network'

export function SkillsTab() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primary: true,
    additional: true,
    tools: true,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('level')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const skillCategories: SkillCategory[] = [
    {
      name: 'FRONTEND LANGUAGES',
      skills: [
        { id: 'javascript', name: 'JavaScript', description: 'Core web development language — ES6+, async programming, and modern patterns', category: 'Frontend Language', level: 90, years: '4+', verified: true, tags: ['frontend', 'javascript', 'es6'], publisher: 'ECMAScript', projects: 15, experience: 'Expert', certifications: ['Meta Front-End Developer'], contributions: ['Modern ES6+ Patterns', 'Async Programming'] },
        { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript development — Strong typing, interfaces, and modern ES6+ features', category: 'Frontend Language', level: 88, years: '3+', verified: true, tags: ['typescript', 'typing', 'javascript'], publisher: 'Microsoft', projects: 12, experience: 'Advanced', contributions: ['Type Safety', 'Advanced Types'] },
        { id: 'html', name: 'HTML', description: 'Semantic markup and modern web standards — Accessibility and SEO optimization', category: 'Frontend Language', level: 95, years: '4+', verified: true, tags: ['html', 'markup', 'semantic'], publisher: 'W3C', projects: 20, experience: 'Expert', badge: 'Expert' },
        { id: 'css', name: 'CSS', description: 'Advanced styling and animations — Flexbox, Grid, and responsive design', category: 'Frontend Language', level: 92, years: '4+', verified: true, tags: ['css', 'styling', 'responsive'], publisher: 'W3C', projects: 18, experience: 'Expert', badge: 'Expert' },
        { id: 'scss', name: 'SCSS', description: 'CSS preprocessor — Variables, mixins, and modular styling architecture', category: 'Frontend Language', level: 85, years: '3+', verified: true, tags: ['scss', 'preprocessor', 'sass'], publisher: 'Sass Team', projects: 9, experience: 'Advanced' },
        { id: 'sass', name: 'SASS', description: 'Syntactically Awesome Stylesheets — CSS extension language with variables and nesting', category: 'Frontend Language', level: 85, years: '3+', tags: ['sass', 'preprocessor', 'css'], publisher: 'Sass Team', projects: 9, experience: 'Advanced' },
      ],
    },
    {
      name: 'PROGRAMMING LANGUAGES',
      skills: [
        { id: 'c', name: 'C', description: 'General-purpose programming language — System programming and low-level development', category: 'Programming Language', level: 70, years: '2+', tags: ['c', 'system', 'programming'], publisher: 'Bell Labs', projects: 3, experience: 'Intermediate' },
        { id: 'cpp', name: 'C++', description: 'Object-oriented programming language — System development and performance-critical applications', category: 'Programming Language', level: 72, years: '2+', tags: ['cpp', 'oop', 'system'], publisher: 'Bjarne Stroustrup', projects: 3, experience: 'Intermediate' },
        { id: 'python', name: 'Python', description: 'Backend development and scripting — Django framework and automation', category: 'Programming Language', level: 75, years: '2+', tags: ['python', 'backend', 'scripting'], publisher: 'Python Foundation', projects: 4, experience: 'Intermediate' },
        { id: 'php', name: 'PHP', description: 'Server-side scripting — Dynamic web pages and backend logic', category: 'Programming Language', level: 72, years: '2+', tags: ['php', 'backend', 'server'], publisher: 'PHP Group', projects: 3, experience: 'Intermediate' },
        { id: 'sql', name: 'SQL (MySQL, SQLite, CockroachDB)', description: 'Database query language — Data manipulation, optimization, and management across multiple database systems', category: 'Programming Language', level: 78, years: '3+', tags: ['sql', 'database', 'mysql', 'sqlite'], publisher: 'Various', projects: 6, experience: 'Intermediate' },
      ],
    },
    {
      name: 'FRAMEWORKS AND LIBRARIES',
      skills: [
        { id: 'jquery', name: 'jQuery', description: 'JavaScript library — DOM manipulation and event handling', category: 'JavaScript Library', level: 80, years: '2+', tags: ['jquery', 'javascript', 'dom'], publisher: 'jQuery Foundation', projects: 8, experience: 'Advanced' },
        { id: 'react', name: 'React', description: 'Frontend library — Component-based UI development and state management', category: 'Frontend Library', level: 85, years: '2+', verified: true, tags: ['react', 'frontend', 'components'], publisher: 'Meta', projects: 7, experience: 'Advanced', certifications: ['Meta React Basics'] },
        { id: 'rxjs', name: 'RxJS', description: 'Reactive Extensions for JavaScript — Reactive programming and observables', category: 'Frontend Library', level: 80, years: '2+', tags: ['rxjs', 'reactive', 'observables'], publisher: 'Microsoft', projects: 5, experience: 'Advanced' },
        { id: 'angular', name: 'Angular', description: 'Frontend framework — Building scalable applications with reactive forms, routing, and state management', category: 'Frontend Framework', level: 92, years: '3+', verified: true, tags: ['angular', 'framework', 'typescript'], publisher: 'Google', projects: 8, experience: 'Expert', badge: 'Expert', certifications: ['Angular Certification'] },
        { id: 'nextjs', name: 'Next.js', description: 'React framework — Server-side rendering, static site generation, and full-stack development', category: 'Frontend Framework', level: 82, years: '2+', verified: true, tags: ['nextjs', 'react', 'ssr', 'fullstack'], publisher: 'Vercel', projects: 6, experience: 'Advanced' },
        { id: 'bootstrap', name: 'Bootstrap', description: 'Responsive CSS framework — Grid system and utility classes for rapid development', category: 'CSS Framework', level: 88, years: '3+', verified: true, tags: ['bootstrap', 'css', 'responsive'], publisher: 'Twitter', projects: 10, experience: 'Advanced' },
        { id: 'angular-material', name: 'Angular Material', description: 'Material Design component library — Consistent UI components and theming', category: 'UI Framework', level: 90, years: '3+', verified: true, tags: ['angular-material', 'ui', 'material'], publisher: 'Google', projects: 7, experience: 'Expert', badge: 'Expert' },
        { id: 'micro-frontend', name: 'Micro Frontend architecture', description: 'Architectural pattern — Modular frontend applications and independent deployment', category: 'Architecture', level: 80, years: '2+', tags: ['micro-frontend', 'architecture', 'modular'], publisher: 'Community', projects: 4, experience: 'Advanced' },
        { id: 'd3', name: 'D3.js', description: 'Data visualization library — Complex visualizations and interactive charts', category: 'JavaScript Library', level: 85, years: '2+', verified: true, tags: ['d3', 'visualization', 'charts'], publisher: 'Observable', projects: 5, experience: 'Advanced' },
        { id: 'storybook', name: 'Storybook', description: 'Component development environment — Isolated component testing and documentation', category: 'JavaScript Library', level: 80, years: '1+', tags: ['storybook', 'components', 'testing'], publisher: 'Storybook Team', projects: 5, experience: 'Advanced' },
        { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime — Backend development and server-side scripting', category: 'Backend Runtime', level: 78, years: '2+', tags: ['nodejs', 'backend', 'javascript'], publisher: 'Node.js Foundation', projects: 5, experience: 'Intermediate' },
        { id: 'django', name: 'Django', description: 'Python web framework — Rapid development of secure and maintainable websites', category: 'Backend Framework', level: 70, years: '1+', tags: ['django', 'python', 'backend'], publisher: 'Django Foundation', projects: 2, experience: 'Intermediate' },
        { id: 'django-rest', name: 'Django REST Framework', description: 'Django toolkit — Building RESTful APIs with Django', category: 'Backend Framework', level: 72, years: '1+', tags: ['django', 'rest', 'api'], publisher: 'Django REST Framework', projects: 3, experience: 'Intermediate' },
        { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework — Rapid UI development with utility classes', category: 'CSS Framework', level: 85, years: '2+', verified: true, tags: ['tailwind', 'css', 'utilities'], publisher: 'Tailwind Labs', projects: 8, experience: 'Advanced' },
      ],
    },
    {
      name: 'VERSION CONTROL',
      skills: [
        { id: 'git', name: 'Git', description: 'Distributed version control system — Branching, merging, and collaborative workflows', category: 'Version Control', level: 90, years: '4+', verified: true, tags: ['git', 'version-control', 'vcs'], publisher: 'Linus Torvalds', projects: 25, experience: 'Expert', badge: 'Expert' },
        { id: 'gitlab', name: 'GitLab', description: 'Git repository management — CI/CD, code review, and project management', category: 'Version Control', level: 85, years: '3+', tags: ['gitlab', 'repository', 'ci-cd'], publisher: 'GitLab Inc', projects: 12, experience: 'Advanced' },
        { id: 'git-desktop', name: 'Git Desktop', description: 'Git GUI application — Visual version control and repository management', category: 'Version Control', level: 80, years: '3+', tags: ['git-desktop', 'gui', 'git'], publisher: 'GitHub', projects: 10, experience: 'Advanced' },
      ],
    },
    {
      name: 'TOOLS',
      skills: [
        { id: 'figma', name: 'Figma', description: 'UI/UX design and prototyping — Design systems and collaboration', category: 'Design Tool', level: 85, years: '3+', tags: ['figma', 'design', 'ui', 'ux'], publisher: 'Figma Inc', projects: 12, experience: 'Advanced' },
        { id: 'adobe-xd', name: 'Adobe XD', description: 'User experience design — Prototyping and wireframing', category: 'Design Tool', level: 80, years: '2+', tags: ['adobe-xd', 'design', 'prototyping'], publisher: 'Adobe', projects: 6, experience: 'Advanced' },
        { id: 'jenkins', name: 'Jenkins', description: 'CI/CD automation — Build pipelines and deployment', category: 'DevOps Tool', level: 75, years: '1+', tags: ['jenkins', 'ci-cd', 'automation'], publisher: 'Jenkins Project', projects: 3, experience: 'Intermediate' },
        { id: 'mysql-workbench', name: 'MySQL Workbench', description: 'Database design and administration — Visual database tools and SQL development', category: 'Database Tool', level: 78, years: '3+', tags: ['mysql', 'database', 'sql'], publisher: 'Oracle', projects: 6, experience: 'Intermediate' },
        { id: 'visual-studio', name: 'Visual Studio', description: 'Integrated development environment — Full-featured IDE for various languages', category: 'IDE', level: 80, years: '3+', tags: ['visual-studio', 'ide', 'development'], publisher: 'Microsoft', projects: 15, experience: 'Advanced' },
        { id: 'vscode', name: 'Visual Studio Code', description: 'Code editor — Lightweight IDE with extensive extension support', category: 'Code Editor', level: 92, years: '4+', verified: true, tags: ['vscode', 'editor', 'ide'], publisher: 'Microsoft', projects: 20, experience: 'Expert', badge: 'Expert' },
        { id: 'chrome-devtools', name: 'Chrome DevTools', description: 'Web development tools — Debugging, profiling, and performance analysis', category: 'Development Tool', level: 88, years: '4+', tags: ['devtools', 'debugging', 'chrome'], publisher: 'Google', projects: 18, experience: 'Advanced' },
        { id: 'postman', name: 'Postman', description: 'API development and testing — REST API testing and documentation', category: 'API Tool', level: 82, years: '2+', tags: ['postman', 'api', 'testing'], publisher: 'Postman', projects: 8, experience: 'Advanced' },
        { id: 'office', name: 'Microsoft Office Suite', description: 'Productivity suite — Word, Excel, PowerPoint, Outlook, Teams', category: 'Productivity Tool', level: 85, years: '4+', tags: ['office', 'productivity', 'microsoft'], publisher: 'Microsoft', projects: 12, experience: 'Advanced' },
        { id: 'cursor', name: 'Cursor', description: 'Real-time collaborative coding tool — Pair programming and code collaboration', category: 'Collaboration Tool', level: 80, years: '2+', tags: ['cursor', 'collaboration', 'coding'], publisher: 'Cursor', projects: 5, experience: 'Advanced' },
        { id: 'npm', name: 'npm', description: 'Node Package Manager — Package management and dependency resolution', category: 'Package Manager', level: 88, years: '4+', tags: ['npm', 'package-manager', 'node'], publisher: 'npm Inc', projects: 20, experience: 'Advanced' },
      ],
    },
    {
      name: 'AREAS OF EXPERTISE',
      skills: [
        { id: 'frontend-dev', name: 'Frontend Development', description: 'Building responsive and interactive web applications', category: 'Expertise', level: 92, years: '4+', verified: true, tags: ['frontend', 'development', 'web'], publisher: 'Expert', projects: 20, experience: 'Expert', badge: 'Expert' },
        { id: 'responsive-design', name: 'Responsive Design', description: 'Creating mobile-first and adaptive user interfaces', category: 'Expertise', level: 90, years: '4+', verified: true, tags: ['responsive', 'mobile', 'design'], publisher: 'Expert', projects: 18, experience: 'Expert', badge: 'Expert' },
        { id: 'ui-design', name: 'User Interface Design', description: 'Designing intuitive and accessible user interfaces', category: 'Expertise', level: 88, years: '3+', tags: ['ui', 'design', 'ux'], publisher: 'Expert', projects: 15, experience: 'Advanced' },
        { id: 'api-integration', name: 'API Integration', description: 'Integrating RESTful APIs and third-party services', category: 'Expertise', level: 88, years: '3+', verified: true, tags: ['api', 'integration', 'rest'], publisher: 'Expert', projects: 14, experience: 'Advanced' },
        { id: 'performance', name: 'Performance Optimization', description: 'Optimizing application performance and load times', category: 'Expertise', level: 85, years: '3+', tags: ['performance', 'optimization', 'speed'], publisher: 'Expert', projects: 12, experience: 'Advanced' },
        { id: 'agile', name: 'Agile Methodologies', description: 'Scrum, Kanban, and iterative development practices', category: 'Expertise', level: 85, years: '3+', tags: ['agile', 'scrum', 'methodology'], publisher: 'Expert', projects: 10, experience: 'Advanced' },
        { id: 'collaboration', name: 'Cross-Functional Collaboration', description: 'Working with designers, backend developers, and stakeholders', category: 'Expertise', level: 88, years: '3+', tags: ['collaboration', 'teamwork'], publisher: 'Expert', projects: 15, experience: 'Advanced' },
        { id: 'code-review', name: 'Code Review', description: 'Reviewing code for quality, maintainability, and best practices', category: 'Expertise', level: 85, years: '3+', tags: ['code-review', 'quality'], publisher: 'Expert', projects: 12, experience: 'Advanced' },
        { id: 'state-management', name: 'State Management (NgRx)', description: 'Managing application state with NgRx and reactive patterns', category: 'Expertise', level: 82, years: '2+', tags: ['ngrx', 'state', 'management'], publisher: 'Expert', projects: 6, experience: 'Advanced' },
        { id: 'accessibility', name: 'Web Accessibility (WCAG)', description: 'Ensuring web applications meet WCAG accessibility standards', category: 'Expertise', level: 80, years: '2+', tags: ['accessibility', 'wcag', 'a11y'], publisher: 'Expert', projects: 8, experience: 'Advanced' },
        { id: 'pwa', name: 'Progressive Web Apps (PWA)', description: 'Building Progressive Web Applications with offline support', category: 'Expertise', level: 78, years: '2+', tags: ['pwa', 'progressive', 'offline'], publisher: 'Expert', projects: 4, experience: 'Intermediate' },
        { id: 'testing', name: 'Testing Frameworks', description: 'Jasmine, Karma, Cypress — Unit, integration, and e2e testing', category: 'Expertise', level: 80, years: '2+', tags: ['testing', 'jasmine', 'cypress'], publisher: 'Expert', projects: 7, experience: 'Advanced' },
        { id: 'auth', name: 'Secure Authentication', description: 'JWT, OAuth — Implementing secure authentication and authorization', category: 'Expertise', level: 82, years: '2+', tags: ['auth', 'jwt', 'oauth', 'security'], publisher: 'Expert', projects: 6, experience: 'Advanced' },
      ],
    },
  ]

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    skillCategories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        categories.add(skill.category)
      })
    })
    return Array.from(categories).sort()
  }, [])



  // Filter and sort skills
  const filteredAndSortedCategories = useMemo(() => {
    let categories = skillCategories

    // Apply search filter
    if (searchQuery) {
      categories = categories.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }))
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      categories = categories.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill => selectedCategories.includes(skill.category))
      }))
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      categories = categories.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill => {
          if (levelFilter === 'expert') return skill.level >= 80
          if (levelFilter === 'advanced') return skill.level >= 70 && skill.level < 80
          if (levelFilter === 'intermediate') return skill.level >= 60 && skill.level < 70
          if (levelFilter === 'beginner') return skill.level < 60
          return true
        })
      }))
    }

    // Group by category
    return categories.filter(cat => cat.skills.length > 0).map(category => {
      let filteredSkills = category.skills

      // Sort skills
      filteredSkills = [...filteredSkills].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'level':
            comparison = a.level - b.level
            break
          case 'years':
            const aYears = parseInt(a.years || '0')
            const bYears = parseInt(b.years || '0')
            comparison = aYears - bYears
            break
          case 'category':
            comparison = a.category.localeCompare(b.category)
            break
        }
        return sortOrder === 'asc' ? comparison : -comparison
      })

      return {
        ...category,
        skills: filteredSkills,
      }
    })
  }, [searchQuery, selectedCategories, levelFilter, sortBy, sortOrder])

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setLevelFilter('all')
    setSortBy('level')
    setSortOrder('desc')
  }

  // Get colorful skill image URL from CDN
  const getSkillImageUrl = (skillId: string) => {
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
  }

  const SkillIcon = ({ skillId, skillName }: { skillId: string; skillName: string }) => {
    const [imageError, setImageError] = useState(false)
    const imageUrl = getSkillImageUrl(skillId)
    
    if (imageUrl && !imageError) {
      return (
        <img
          src={imageUrl}
          alt={`${skillName} logo`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
          loading="lazy"
          style={{ filter: 'none' }}
        />
      )
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xl font-bold text-vscode-blue">
          {skillName.substring(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  const getProficiencyBadge = (level: number) => {
    if (level >= 80) return { text: 'Expert', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' }
    if (level >= 70) return { text: 'Advanced', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' }
    if (level >= 60) return { text: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' }
    return { text: 'Beginner', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' }
  }

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    (levelFilter !== 'all' ? 1 : 0) +
    (sortBy !== 'level' || sortOrder !== 'desc' ? 1 : 0)

  const SkillCard = ({ skill, index, isListView = false }: { skill: Skill; index: number; isListView?: boolean }) => {
    const starsFilled = Math.floor(skill.level / 20)
    const badge = getProficiencyBadge(skill.level)
    const isExpert = skill.level >= 80
    const website = skill.website || skillWebsites[skill.id]

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02, duration: 0.2 }}
        className={`relative bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/50 hover:shadow-lg transition-all group cursor-pointer ${
          isListView ? 'p-2.5 rounded' : 'rounded-lg p-3'
        }`}
        onClick={() => {
          if (website) {
            window.open(website, '_blank', 'noopener,noreferrer')
          }
        }}
      >
        {/* Card Content */}
        {isListView ? (
          <div className="flex items-center gap-3 w-full">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 p-1 bg-white rounded-full flex items-center justify-center shadow-md border border-vscode-border/20">
                <SkillIcon skillId={skill.id} skillName={skill.name} />
              </div>
            </div>
            
            {/* Skill Name */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-semibold text-vscode-text">
                {skill.name}
              </h3>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={10}
                  className={
                    i < starsFilled
                      ? 'text-orange-400 fill-orange-400'
                      : 'text-vscode-text-secondary opacity-30'
                  }
                />
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Category - Right aligned */}
            <div className="flex-shrink-0">
              <span className="text-xs text-vscode-text-secondary">
                {skill.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 p-2 bg-white rounded-full flex items-center justify-center shadow-md border border-vscode-border/20 transition-transform group-hover:scale-110">
                <SkillIcon skillId={skill.id} skillName={skill.name} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-1.5">
                <h3 className="text-sm font-semibold text-vscode-text line-clamp-1 leading-tight">
                  {skill.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size={10}
                      className={
                        i < starsFilled
                          ? 'text-orange-400 fill-orange-400'
                          : 'text-vscode-text-secondary opacity-30'
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] text-vscode-text-secondary">
                  {skill.category}
                </span>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    )
  }

  return (
    <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2">
                  <Code className="text-vscode-blue" size={20} />
                  Skills
                </h1>
                <div className="relative">
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-vscode-blue rounded-full shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0)}
                    </span>
                  </div>
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 bg-vscode-blue rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-vscode-text-secondary">
                Browse technical skills, tools, and technologies organized by category
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <ViewSwitcher
                viewMode={viewMode}
                onViewChange={(mode) => setViewMode(mode)}
                options="grid-list-network"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 mt-4">
          <div className="relative">
            <div className="relative rounded-sm h-8 flex items-center border border-vscode-border bg-vscode-sidebar transition-colors">
              <Search
                size={16}
                className="absolute left-3 text-vscode-text-secondary pointer-events-none z-10"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-8 h-full bg-transparent border-0 outline-none text-sm font-normal text-vscode-text placeholder:text-vscode-text-secondary focus:outline-none focus:ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 p-1 hover:bg-vscode-hover rounded transition-colors flex items-center justify-center"
                >
                  <X size={14} className="text-vscode-text-secondary" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-4 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 h-8 rounded text-sm transition-colors ${
                showFilters ? 'bg-vscode-blue text-white' : 'bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover text-vscode-text'
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort - Hidden in network view */}
            {viewMode !== 'network' && (
              <>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 h-8 bg-vscode-sidebar border border-vscode-border rounded text-xs text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue"
                >
                  <option value="level">Sort by Level</option>
                  <option value="name">Sort by Name</option>
                  <option value="years">Sort by Experience</option>
                  <option value="category">Sort by Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-8 h-8 flex items-center justify-center bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </button>
              </>
            )}

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-vscode-blue hover:text-vscode-blue-accent transition-colors px-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Level Filter */}
                  <div>
                    <label className="text-xs font-semibold text-vscode-text-secondary uppercase mb-2 block">
                      Proficiency Level
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'expert', 'advanced', 'intermediate', 'beginner'] as LevelFilter[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setLevelFilter(level)}
                          className={`px-3 py-1.5 rounded text-xs transition-all capitalize ${
                            levelFilter === level
                              ? 'bg-vscode-blue text-white border border-vscode-blue'
                              : 'bg-vscode-active text-vscode-text border border-vscode-border hover:bg-vscode-hover'
                          }`}
                        >
                          {level === 'all' ? 'All Levels' : level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div>
                    <label className="text-xs font-semibold text-vscode-text-secondary uppercase mb-2 block">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => {
                        const isSelected = selectedCategories.includes(category)
                        return (
                          <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`px-3 py-1.5 rounded text-xs transition-all ${
                              isSelected
                                ? 'bg-vscode-blue text-white border border-vscode-blue'
                                : 'bg-vscode-active text-vscode-text border border-vscode-border hover:bg-vscode-hover'
                            }`}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Network View */}
        {viewMode === 'network' && (
          <div className="h-[calc(100vh-400px)] min-h-[600px] relative rounded-lg overflow-hidden border border-vscode-border">
            <SkillsNetworkChart />
          </div>
        )}

        {/* Results */}
        {activeFilterCount > 0 && viewMode !== 'network' && (
          <div className="mb-4 text-xs text-vscode-text-secondary">
            Showing {filteredAndSortedCategories.reduce((sum, cat) => sum + cat.skills.length, 0)} skill
            {filteredAndSortedCategories.reduce((sum, cat) => sum + cat.skills.length, 0) !== 1 ? 's' : ''}
          </div>
        )}

        {/* Skills Grid/List */}
        {viewMode !== 'network' && (
        <div className="space-y-6">
          {filteredAndSortedCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-vscode-text-secondary mb-2">No skills found matching your filters.</p>
              <button
                onClick={clearFilters}
                className="text-vscode-blue hover:text-vscode-blue-accent text-sm transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredAndSortedCategories.map((category) => {
              const sectionKey = category.name.toLowerCase().replace(/\s+/g, '-')
              const isExpanded = expandedSections[sectionKey] ?? true

              return (
                <div key={category.name} className="mb-5">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleSection(sectionKey)
                    }}
                    className="w-full flex items-center gap-2.5 px-0 py-2 text-left hover:opacity-80 transition-opacity group cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronRight size={14} className="text-vscode-text-secondary" />
                    </motion.div>
                    <span className="text-sm font-medium text-vscode-text uppercase tracking-wide flex-1 text-left">
                      {category.name}
                    </span>
                    <span className="text-xs text-vscode-text-secondary bg-[#2d2d30] border border-[#3e3e42] px-2 py-0.5 rounded font-medium">
                      {category.skills.length}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {category.skills.map((skill, index) => (
                              <SkillCard key={skill.id} skill={skill} index={index} />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {category.skills.map((skill, index) => (
                              <SkillCard key={skill.id} skill={skill} index={index} isListView={true} />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>
        )}
      </div>
    </div>
  )
}
