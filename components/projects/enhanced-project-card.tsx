'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, Github, Calendar } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { staggerItem, useMotionConfig, advancedStaggerItem, smoothFade } from '@/lib/motionConfig'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  codePreview?: string
  image?: string
  period?: string
}

interface EnhancedProjectCardProps {
  project: Project
  onCardClick: (project: Project) => void
  index?: number
}

export function EnhancedProjectCard({ project, onCardClick, index = 0 }: EnhancedProjectCardProps) {
  const { portfolioSettings } = useAppStore()
  const { variants } = useMotionConfig(portfolioSettings.animationSpeed)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7.5, -7.5]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7.5, 7.5]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    x.set(mouseX / rect.width)
    y.set(mouseY / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      layoutId={`project-card-${project.id}`}
      initial="hidden"
      animate="visible"
      variants={variants(advancedStaggerItem, portfolioSettings.showAnimations)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onCardClick(project)}
      className="group relative cursor-pointer preserve-3d"
      whileHover={{ scale: 1.05, z: 50, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Enhanced Glow border effect with animation */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 122, 204, 0.6), rgba(0, 122, 204, 0.2), rgba(0, 122, 204, 0.4))',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Additional subtle glow layer */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(0, 122, 204, 0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Card container with enhanced effects */}
      <div className="relative bg-vscode-sidebar border border-vscode-border rounded-xl p-5 h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:border-vscode-blue/70 group-hover:shadow-2xl group-hover:shadow-vscode-blue/30 border-glow">
        {/* Project Image with enhanced effects */}
        {project.image ? (
          <motion.div 
            className="relative w-full h-48 mb-4 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-vscode-sidebar/90 via-vscode-sidebar/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            />
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            className="relative w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-vscode-blue/20 via-vscode-blue/10 to-vscode-blue/5 flex items-center justify-center animate-gradient"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="text-6xl opacity-20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              💻
            </motion.div>
          </motion.div>
        )}

        {/* Header with enhanced animation */}
        <motion.div 
          className="flex items-start justify-between gap-2 mb-3"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h3 
            className="font-bold text-vscode-text text-lg leading-tight line-clamp-2 group-hover:text-vscode-blue transition-colors relative z-10"
            whileHover={{ scale: 1.02 }}
          >
            {project.title}
          </motion.h3>
        </motion.div>

        {/* Description */}
        <p className="text-vscode-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Technologies Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + idx * 0.02 }}
              className="px-2.5 py-1 bg-vscode-blue/10 text-vscode-blue text-xs rounded-md border border-vscode-blue/20 font-medium"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2.5 py-1 bg-vscode-sidebar text-vscode-text-secondary text-xs rounded-md border border-vscode-border">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-xs rounded-md transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blue hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
            >
              <ExternalLink size={14} />
              <span>Live</span>
            </motion.a>
          )}
        </div>

        {/* Period */}
        {project.period && (
          <div className="flex items-center gap-1.5 text-xs text-vscode-text-secondary pt-3 border-t border-vscode-border">
            <Calendar size={12} />
            <span>{project.period}</span>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-vscode-blue/5 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none transition-opacity duration-300"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
    </motion.div>
  )
}

