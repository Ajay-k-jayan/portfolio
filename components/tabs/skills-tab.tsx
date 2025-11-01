'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Settings, Clock, Star, CheckCircle2, Star as StarIcon, Search, X, Filter, SortAsc, SortDesc, Download, ChevronDown as ChevronDownIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
}

interface SkillCategory {
  name: string
  skills: Skill[]
}

type SortOption = 'name' | 'level' | 'years' | 'category'
type LevelFilter = 'all' | 'expert' | 'advanced' | 'intermediate' | 'beginner'

export function SkillsTab() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primary: true,
    additional: true,
    tools: true,
  })
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('level')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const skillCategories: SkillCategory[] = [
    {
      name: 'PRIMARY SKILLS',
      skills: [
        {
          id: 'angular',
          name: 'Angular',
          description: 'Advanced frontend framework expertise — Building scalable applications with reactive forms, routing, and state management',
          category: 'Frontend Framework',
          level: 92,
          years: '3+',
          verified: true,
          tags: ['frontend', 'framework', 'typescript', 'spa'],
          publisher: 'Google',
          projects: 8,
          experience: 'Expert',
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          description: 'Type-safe JavaScript development — Strong typing, interfaces, and modern ES6+ features',
          category: 'Programming Language',
          level: 88,
          years: '3+',
          verified: true,
          tags: ['language', 'typescript', 'javascript', 'typing'],
          publisher: 'Microsoft',
          projects: 12,
          experience: 'Advanced',
        },
        {
          id: 'javascript',
          name: 'JavaScript',
          description: 'Core web development language — ES6+, async programming, and modern patterns',
          category: 'Programming Language',
          level: 90,
          years: '4+',
          verified: true,
          tags: ['language', 'javascript', 'frontend', 'web'],
          publisher: 'ECMAScript',
          projects: 15,
          experience: 'Expert',
        },
        {
          id: 'd3',
          name: 'D3.js',
          description: 'Data visualization and interactive charts — Complex visualizations and custom graphics',
          category: 'Data Visualization',
          level: 85,
          years: '2+',
          verified: true,
          tags: ['visualization', 'charts', 'data', 'd3'],
          publisher: 'Observable',
          projects: 5,
          experience: 'Advanced',
        },
        {
          id: 'angular-material',
          name: 'Angular Material',
          description: 'Material Design component library — Consistent UI components and theming',
          category: 'UI Framework',
          level: 90,
          years: '3+',
          verified: true,
          tags: ['ui', 'material', 'components', 'design'],
          publisher: 'Google',
          projects: 7,
          experience: 'Expert',
        },
        {
          id: 'bootstrap',
          name: 'Bootstrap',
          description: 'Responsive CSS framework — Grid system and utility classes for rapid development',
          category: 'CSS Framework',
          level: 88,
          years: '3+',
          verified: true,
          tags: ['css', 'framework', 'responsive', 'grid'],
          publisher: 'Twitter',
          projects: 10,
          experience: 'Advanced',
        },
        {
          id: 'html',
          name: 'HTML5',
          description: 'Semantic markup and modern web standards — Accessibility and SEO optimization',
          category: 'Markup Language',
          level: 95,
          years: '4+',
          verified: true,
          tags: ['html', 'markup', 'semantic', 'web'],
          publisher: 'W3C',
          projects: 20,
          experience: 'Expert',
        },
        {
          id: 'css',
          name: 'CSS3',
          description: 'Advanced styling and animations — Flexbox, Grid, and responsive design',
          category: 'Styling',
          level: 92,
          years: '4+',
          verified: true,
          tags: ['css', 'styling', 'responsive', 'animations'],
          publisher: 'W3C',
          projects: 18,
          experience: 'Expert',
        },
        {
          id: 'scss',
          name: 'SCSS/SASS',
          description: 'CSS preprocessor — Variables, mixins, and modular styling architecture',
          category: 'Preprocessor',
          level: 85,
          years: '3+',
          verified: true,
          tags: ['css', 'preprocessor', 'sass', 'scss'],
          publisher: 'Sass Team',
          projects: 9,
          experience: 'Advanced',
        },
      ],
    },
    {
      name: 'ADDITIONAL SKILLS',
      skills: [
        {
          id: 'python',
          name: 'Python',
          description: 'Backend development and scripting — Django framework and automation',
          category: 'Backend Language',
          level: 75,
          years: '2+',
          tags: ['backend', 'python', 'scripting', 'automation'],
          publisher: 'Python Foundation',
          projects: 4,
          experience: 'Intermediate',
        },
        {
          id: 'django',
          name: 'Django',
          description: 'Python web framework — REST APIs and server-side development',
          category: 'Backend Framework',
          level: 70,
          years: '1+',
          tags: ['backend', 'framework', 'python', 'api'],
          publisher: 'Django Foundation',
          projects: 2,
          experience: 'Intermediate',
        },
        {
          id: 'mysql',
          name: 'MySQL',
          description: 'Relational database management — Queries, optimization, and data modeling',
          category: 'Database',
          level: 78,
          years: '3+',
          tags: ['database', 'sql', 'rdbms', 'data'],
          publisher: 'Oracle',
          projects: 6,
          experience: 'Intermediate',
        },
        {
          id: 'jquery',
          name: 'jQuery',
          description: 'JavaScript library — DOM manipulation and event handling',
          category: 'JavaScript Library',
          level: 80,
          years: '2+',
          tags: ['library', 'javascript', 'dom', 'jquery'],
          publisher: 'jQuery Foundation',
          projects: 8,
          experience: 'Advanced',
        },
        {
          id: 'php',
          name: 'PHP',
          description: 'Server-side scripting — Dynamic web pages and backend logic',
          category: 'Backend Language',
          level: 72,
          years: '2+',
          tags: ['backend', 'php', 'server', 'scripting'],
          publisher: 'PHP Group',
          projects: 3,
          experience: 'Intermediate',
        },
      ],
    },
    {
      name: 'TOOLS & TECHNOLOGIES',
      skills: [
        {
          id: 'git',
          name: 'Git',
          description: 'Version control system — Branching, merging, and collaborative workflows',
          category: 'Version Control',
          level: 90,
          years: '4+',
          verified: true,
          tags: ['version-control', 'git', 'collaboration', 'devops'],
          publisher: 'Linus Torvalds',
          projects: 25,
          experience: 'Expert',
        },
        {
          id: 'figma',
          name: 'Figma',
          description: 'UI/UX design and prototyping — Design systems and collaboration',
          category: 'Design Tool',
          level: 85,
          years: '3+',
          tags: ['design', 'ui', 'ux', 'prototyping'],
          publisher: 'Figma Inc',
          projects: 12,
          experience: 'Advanced',
        },
        {
          id: 'adobe-xd',
          name: 'Adobe XD',
          description: 'User experience design — Prototyping and wireframing',
          category: 'Design Tool',
          level: 80,
          years: '2+',
          tags: ['design', 'adobe', 'ux', 'prototyping'],
          publisher: 'Adobe',
          projects: 6,
          experience: 'Advanced',
        },
        {
          id: 'jenkins',
          name: 'Jenkins',
          description: 'CI/CD automation — Build pipelines and deployment',
          category: 'DevOps',
          level: 75,
          years: '1+',
          tags: ['devops', 'ci-cd', 'automation', 'pipeline'],
          publisher: 'Jenkins Project',
          projects: 3,
          experience: 'Intermediate',
        },
        {
          id: 'storybook',
          name: 'Storybook',
          description: 'Component development environment — Isolated component testing and documentation',
          category: 'Development Tool',
          level: 80,
          years: '1+',
          tags: ['development', 'components', 'testing', 'documentation'],
          publisher: 'Storybook Team',
          projects: 5,
          experience: 'Advanced',
        },
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
    return skillCategories.map((category) => {
      let filteredSkills = category.skills.filter((skill) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        // Category filter
        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(skill.category)

        // Level filter
        const matchesLevel = (() => {
          if (levelFilter === 'all') return true
          if (levelFilter === 'expert') return skill.level >= 90
          if (levelFilter === 'advanced') return skill.level >= 80 && skill.level < 90
          if (levelFilter === 'intermediate') return skill.level >= 70 && skill.level < 80
          if (levelFilter === 'beginner') return skill.level < 70
          return true
        })()

        return matchesSearch && matchesCategory && matchesLevel
      })

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
    }).filter((cat) => cat.skills.length > 0)
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

  // Get skill image URL from Simple Icons CDN (SVG format)
  const getSkillImageUrl = (skillId: string) => {
    const skillLogoMap: Record<string, string> = {
      'angular': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg',
      'typescript': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg',
      'javascript': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg',
      'd3': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/d3dotjs.svg',
      'angular-material': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angularmaterial.svg',
      'html': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/html5.svg',
      'css': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/css3.svg',
      'scss': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sass.svg',
      'bootstrap': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bootstrap.svg',
      'python': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg',
      'django': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/django.svg',
      'mysql': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg',
      'jquery': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jquery.svg',
      'php': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg',
      'git': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg',
      'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg',
      'adobe-xd': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobexd.svg',
      'jenkins': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jenkins.svg',
      'storybook': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/storybook.svg',
    }
    return skillLogoMap[skillId] || null
  }

  // Skill Icon Component with SVG images
  const SkillIcon = ({ skillId, skillName }: { skillId: string; skillName: string }) => {
    const [imageError, setImageError] = useState(false)
    const imageUrl = getSkillImageUrl(skillId)
    
    if (imageUrl && !imageError) {
      return (
        <div className="w-14 h-14 bg-white rounded flex items-center justify-center p-2.5 border border-vscode-border flex-shrink-0 shadow-sm">
          <img
            src={imageUrl}
            alt={`${skillName} logo`}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )
    }
    
    // Fallback to text icon if image fails
    return (
      <div className="w-14 h-14 bg-vscode-active border border-vscode-border rounded flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-vscode-blue">
          {skillName.substring(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  const getProficiencyBadge = (level: number) => {
    if (level >= 90) return { text: 'Expert', color: 'text-green-400' }
    if (level >= 80) return { text: 'Advanced', color: 'text-blue-400' }
    if (level >= 70) return { text: 'Intermediate', color: 'text-yellow-400' }
    return { text: 'Beginner', color: 'text-gray-400' }
  }

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    (levelFilter !== 'all' ? 1 : 0) +
    (sortBy !== 'level' || sortOrder !== 'desc' ? 1 : 0)

  return (
    <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-vscode-text mb-2">Skills & Expertise</h1>
          <p className="text-sm text-vscode-text-secondary">
            Browse my technical skills, tools, and technologies organized by category
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-vscode-text-secondary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by name, description, or tags..."
              className="w-full pl-11 pr-10 py-2.5 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text placeholder-vscode-text-secondary focus:outline-none focus:ring-2 focus:ring-vscode-blue focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-vscode-hover rounded transition-colors"
              >
                <X size={16} className="text-vscode-text-secondary" />
              </button>
            )}
          </div>

          {/* Filter Toggle and Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text hover:bg-vscode-hover transition-colors flex-shrink-0 ${
                showFilters ? 'bg-vscode-active' : ''
              }`}
            >
              <Filter size={16} className="flex-shrink-0" />
              <span className="whitespace-nowrap">Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-vscode-blue text-white text-xs rounded-full flex-shrink-0">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Options */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-vscode-sidebar border border-vscode-border rounded text-sm text-vscode-text focus:outline-none focus:ring-2 focus:ring-vscode-blue whitespace-nowrap"
              >
                <option value="level">Sort by Level</option>
                <option value="name">Sort by Name</option>
                <option value="years">Sort by Experience</option>
                <option value="category">Sort by Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-vscode-sidebar border border-vscode-border rounded hover:bg-vscode-hover transition-colors flex-shrink-0"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc size={16} className="text-vscode-text-secondary" />
                ) : (
                  <SortDesc size={16} className="text-vscode-text-secondary" />
                )}
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-vscode-blue hover:text-vscode-blue-accent transition-colors whitespace-nowrap flex-shrink-0"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-vscode-sidebar border border-vscode-border rounded overflow-hidden"
              >
                <div className="p-4 space-y-4">
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
                            className={`px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${
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

                  {/* Level Filter */}
                  <div>
                    <label className="text-xs font-semibold text-vscode-text-secondary uppercase mb-2 block">
                      Proficiency Level
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'all', label: 'All Levels' },
                        { value: 'expert', label: 'Expert (90%+)' },
                        { value: 'advanced', label: 'Advanced (80-89%)' },
                        { value: 'intermediate', label: 'Intermediate (70-79%)' },
                        { value: 'beginner', label: 'Beginner (<70%)' },
                      ].map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setLevelFilter(level.value as LevelFilter)}
                          className={`px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${
                            levelFilter === level.value
                              ? 'bg-vscode-blue text-white border border-vscode-blue'
                              : 'bg-vscode-active text-vscode-text border border-vscode-border hover:bg-vscode-hover'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        {activeFilterCount > 0 && (
          <div className="mb-4 text-xs text-vscode-text-secondary">
            Showing {filteredAndSortedCategories.reduce((sum, cat) => sum + cat.skills.length, 0)} skill
            {filteredAndSortedCategories.reduce((sum, cat) => sum + cat.skills.length, 0) !== 1 ? 's' : ''}
          </div>
        )}

        {/* Skills Cards Grid */}
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
              const skillCount = category.skills.length

              return (
                <div key={category.name} className="space-y-4">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full px-4 py-3 bg-vscode-sidebar border border-vscode-border rounded-lg flex items-center justify-between hover:bg-vscode-hover transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-vscode-text-secondary" />
                      ) : (
                        <ChevronRight size={16} className="text-vscode-text-secondary" />
                      )}
                      <span className="text-sm font-semibold text-vscode-text uppercase tracking-wide">
                        {category.name}
                      </span>
                      <span className="px-2 py-0.5 bg-vscode-active border border-vscode-border rounded-full text-xs text-vscode-text-secondary">
                        {skillCount}
                      </span>
                    </div>
                  </button>

                  {/* Skills Cards Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg divide-y divide-vscode-border">
                          {category.skills.map((skill, index) => {
                            const isSelected = selectedSkill === skill.id
                            const proficiency = getProficiencyBadge(skill.level)

                            return (
                              <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => setSelectedSkill(isSelected ? null : skill.id)}
                                className={`px-4 py-3 cursor-pointer transition-colors border-l-2 group ${
                                  isSelected
                                    ? 'bg-[#007acc]/10 border-vscode-blue'
                                    : 'hover:bg-vscode-hover border-transparent'
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* Skill Icon */}
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10">
                                      <SkillIcon skillId={skill.id} skillName={skill.name} />
                                    </div>
                                  </div>

                                  {/* Skill Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-sm font-semibold text-vscode-text break-words">
                                        {skill.name}
                                      </h3>
                                      {skill.verified && (
                                        <CheckCircle2 size={14} className="text-vscode-blue flex-shrink-0" />
                                      )}
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="text-xs text-vscode-text-secondary line-clamp-1 mb-1">
                                      {skill.description}
                                    </p>
                                    
                                    {/* Category and Verified */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs text-vscode-text-secondary">
                                        {skill.category}
                                      </span>
                                      {skill.verified && (
                                        <>
                                          <span className="text-vscode-text-secondary">•</span>
                                          <span className="text-xs text-vscode-blue">Verified</span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right Side - Metrics */}
                                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                    {/* Star and Percentage */}
                                    <div className="flex items-center gap-1.5">
                                      <StarIcon size={12} className="text-yellow-400 flex-shrink-0" />
                                      <span className="text-xs text-vscode-text-secondary whitespace-nowrap">
                                        {skill.level}%
                                      </span>
                                    </div>

                                    {/* Years */}
                                    {skill.years && (
                                      <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-vscode-text-secondary opacity-60 flex-shrink-0" />
                                        <span className="text-xs text-vscode-text-secondary whitespace-nowrap">
                                          {skill.years}
                                        </span>
                                      </div>
                                    )}

                                    {/* Proficiency Badge */}
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${proficiency.color} bg-opacity-10`}>
                                      {proficiency.text}
                                    </span>

                                    {/* Settings Icon */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // Handle settings click
                                      }}
                                      className="p-1.5 hover:bg-vscode-active rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                      title="Settings"
                                    >
                                      <Settings size={14} className="text-vscode-text-secondary" />
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Details (if selected) */}
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 pt-3 border-t border-vscode-border"
                                  >
                                    <div className="space-y-2">
                                      {/* Full Description */}
                                      <p className="text-xs text-vscode-text-secondary">
                                        {skill.description}
                                      </p>
                                      
                                      {/* Additional Info */}
                                      <div className="flex items-center gap-4 flex-wrap">
                                        {skill.publisher && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-vscode-text-secondary">Publisher:</span>
                                            <span className="text-xs text-vscode-text">{skill.publisher}</span>
                                          </div>
                                        )}
                                        {skill.projects && (
                                          <div className="flex items-center gap-1.5">
                                            <Download size={12} className="text-vscode-text-secondary opacity-60" />
                                            <span className="text-xs text-vscode-text-secondary">
                                              {skill.projects} projects
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Tags */}
                                      {skill.tags && skill.tags.length > 0 && (
                                        <div>
                                          <div className="flex flex-wrap gap-1.5 mt-2">
                                            {skill.tags.map((tag) => (
                                              <span
                                                key={tag}
                                                className="text-xs px-2 py-0.5 bg-vscode-active border border-vscode-border rounded text-vscode-text-secondary"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Proficiency Bar */}
                                      <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs text-vscode-text-secondary">Proficiency Level</span>
                                          <span className="text-xs text-vscode-text">{skill.level}%</span>
                                        </div>
                                        <div className="h-1.5 bg-vscode-active rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.level}%` }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="h-full bg-vscode-blue"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
