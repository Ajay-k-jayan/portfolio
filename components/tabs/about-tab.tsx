'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { ProfileAvatar } from '@/components/profile-avatar'
import { portfolioData } from '@/lib/portfolio-data'
import { useAppStore } from '@/lib/store'
import { 
  pageTransition, 
  staggerContainer, 
  staggerItem,
  scaleIn,
  useMotionConfig 
} from '@/lib/motionConfig'

export const AboutTab = memo(function AboutTab() {
  const { portfolioSettings } = useAppStore()
  const { variants } = useMotionConfig(portfolioSettings.animationSpeed)

  return (
    <motion.div 
      className="h-full overflow-auto"
      variants={variants(pageTransition, portfolioSettings.showAnimations)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <motion.div 
          className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6"
          variants={variants(scaleIn, portfolioSettings.showAnimations)}
        >
          <h1 className="text-3xl font-bold text-vscode-text mb-4">About Me</h1>
          <div className="prose prose-invert max-w-none space-y-4 text-vscode-text">
            <motion.div 
              className="flex items-center gap-4 mb-6"
              variants={variants(staggerItem, portfolioSettings.showAnimations)}
            >
              <ProfileAvatar size="lg" />
              <div>
                <h2 className="text-2xl font-bold text-vscode-text mb-1">{portfolioData.profile.name}</h2>
                <p className="text-vscode-text-secondary">{portfolioData.profile.title}</p>
                <p className="text-sm text-vscode-green mt-1">{portfolioData.profile.subtitle}</p>
              </div>
            </motion.div>
            <motion.p 
              className="text-lg leading-relaxed"
              variants={variants(staggerItem, portfolioSettings.showAnimations)}
            >
              {portfolioData.profile.bio}
            </motion.p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
              variants={variants(staggerContainer, portfolioSettings.showAnimations)}
            >
              <motion.div 
                className="bg-vscode-active p-4 rounded-lg"
                variants={variants(staggerItem, portfolioSettings.showAnimations)}
              >
                <h3 className="text-vscode-blue font-semibold mb-2">Experience</h3>
                <p className="text-vscode-text-secondary text-sm">
                  {portfolioData.profile.experience} of professional development at {portfolioData.profile.company}
                </p>
              </motion.div>
              <motion.div 
                className="bg-vscode-active p-4 rounded-lg"
                variants={variants(staggerItem, portfolioSettings.showAnimations)}
              >
                <h3 className="text-vscode-blue font-semibold mb-2">Location</h3>
                <p className="text-vscode-text-secondary text-sm">
                  {portfolioData.profile.location}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

