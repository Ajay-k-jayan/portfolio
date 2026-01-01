'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Code2, Calendar } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useMotionConfig } from '@/lib/motionConfig'

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

interface ProjectDetailModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  if (!project) return null

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop with blur and scale */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            style={{
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Background content scale down */}
          <motion.div
            initial={{ scale: 1, filter: 'blur(0px)' }}
            animate={{ scale: 0.95, filter: 'blur(4px)' }}
            exit={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 pointer-events-none"
          />

          {/* Modal */}
          <motion.div
            layoutId={`project-card-${project.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-vscode-sidebar border border-vscode-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg text-vscode-text transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1">
                {/* Project Image */}
                {project.image ? (
                  <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vscode-sidebar to-transparent" />
                  </div>
                ) : (
                  <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-vscode-blue/20 to-vscode-blue/5 flex items-center justify-center">
                    <div className="text-8xl opacity-20">💻</div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-vscode-text mb-3">
                      {project.title}
                    </h2>
                    {project.period && (
                      <div className="flex items-center gap-2 text-vscode-text-secondary">
                        <Calendar size={16} />
                        <span>{project.period}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <p className="text-lg text-vscode-text-secondary leading-relaxed">
                      {project.description}
                    </p>
                  </motion.div>

                  {/* Technologies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-vscode-text mb-3 uppercase tracking-wide">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.03 }}
                          className="px-3 py-1.5 bg-vscode-blue/10 text-vscode-blue text-sm rounded-lg border border-vscode-blue/20 font-medium"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Code Preview */}
                  {project.codePreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6"
                    >
                      <h3 className="text-sm font-semibold text-vscode-text mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Code2 size={16} />
                        Code Preview
                      </h3>
                      <pre className="bg-vscode-active p-4 rounded-lg overflow-x-auto border border-vscode-border">
                        <code className="text-sm text-vscode-orange">{project.codePreview}</code>
                      </pre>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 flex-wrap"
                  >
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text rounded-lg transition-colors font-medium"
                      >
                        <Github size={18} />
                        <span>View on GitHub</span>
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                      >
                        <ExternalLink size={18} />
                        <span>Live Demo</span>
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

