'use client'

import { Terminal, Code, Sparkles, Rocket } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { TypingAnimation } from '@/components/typing-animation'
import { motion } from 'framer-motion'

export function WelcomeTab() {
  const { addTab } = useAppStore()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const quickActions = [
    { label: 'View Projects', tabId: 'projects', icon: Code },
    { label: 'About Me', tabId: 'about', icon: Terminal },
    { label: 'Skills', tabId: 'skills', icon: Sparkles },
  ]

  return (
    <div className="h-full p-8 flex items-center justify-center overflow-hidden relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full space-y-8 z-10"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <motion.div
            className="flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Rocket className="text-vscode-blue" size={48} />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-vscode-text">
                <TypingAnimation text="Ajay K J" speed={150} />
              </h1>
              <motion.p
                className="text-lg text-vscode-green mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Software Engineer
              </motion.p>
            </div>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-xl text-vscode-text-secondary"
          >
            <TypingAnimation text="Front-End Developer | Angular | UI Design | Web Performance" speed={50} />
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-vscode-text">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.tabId}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Will be implemented with actual tab content
                    console.log(`Opening ${action.label}`)
                  }}
                  className="flex flex-col items-center gap-3 p-4 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg transition-all duration-300 group hover:border-vscode-blue hover:shadow-lg hover:shadow-vscode-blue/20"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="text-vscode-blue group-hover:text-vscode-green transition-colors" size={32} />
                  </motion.div>
                  <span className="text-vscode-text font-medium group-hover:text-vscode-green transition-colors">
                    {action.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-vscode-text mb-4">Features</h2>
          <ul className="space-y-2 text-vscode-text-secondary">
            {[
              'AI-powered chatbot for instant assistance',
              'Interactive code playground',
              'Real-time analytics dashboard',
              'Voice navigation assistant',
              'Gamification badges & achievements',
            ].map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                whileHover={{ x: 5, color: '#007acc' }}
              >
                <span className="text-vscode-blue">▹</span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

