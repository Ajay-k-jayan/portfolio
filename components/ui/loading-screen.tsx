'use client'

import { motion } from 'framer-motion'
import { Code, Zap, Sparkles, Layers, Rocket, Cpu } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  showProgress?: boolean
  progress?: number
}

export function LoadingScreen({ 
  message = 'Initializing portfolio...', 
  showProgress = false,
  progress = 0 
}: LoadingScreenProps) {
  const loadingSteps = [
    { id: 1, text: 'Loading assets', icon: Layers, delay: 0 },
    { id: 2, text: 'Initializing components', icon: Code, delay: 0.3 },
    { id: 3, text: 'Setting up theme', icon: Sparkles, delay: 0.6 },
    { id: 4, text: 'Optimizing performance', icon: Zap, delay: 0.9 },
    { id: 5, text: 'Finalizing setup', icon: Rocket, delay: 1.2 },
  ]

  return (
    <div className="fixed inset-0 bg-vscode-bg z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(0, 122, 204, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(0, 122, 204, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(0, 122, 204, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(0, 122, 204, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 122, 204, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 122, 204, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 122, 204, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 122, 204, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Logo & Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            {/* 3D Rotating Logo */}
            <div className="relative w-32 h-32">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-vscode-blue via-vscode-blue/80 to-vscode-blue/60 rounded-2xl shadow-2xl flex items-center justify-center">
                  <Code className="text-white" size={48} />
                </div>
              </motion.div>
              
              {/* Orbiting Particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                  className="absolute inset-0"
                  style={{
                    transformOrigin: 'center',
                  }}
                >
                  <motion.div
                    animate={{
                      x: [0, Math.cos(i * 120 * Math.PI / 180) * 60],
                      y: [0, Math.sin(i * 120 * Math.PI / 180) * 60],
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-vscode-blue rounded-full"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pulsing Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{
                  scale: [0.8, 1.4, 0.8],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeOut",
                }}
                className="absolute w-32 h-32 border-2 border-vscode-blue/30 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </motion.div>

          {/* Right Side - Loading Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-vscode-text flex items-center gap-3"
              >
                <Cpu className="text-vscode-blue" size={32} />
                <span>Portfolio</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-vscode-text-secondary text-sm"
              >
                {message}
              </motion.p>
            </div>

            {/* Loading Steps */}
            <div className="space-y-3">
              {loadingSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = progress >= (index + 1) * 20
                const isCurrent = progress >= index * 20 && progress < (index + 1) * 20
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-vscode-blue/10 border-vscode-blue/50'
                        : isCurrent
                        ? 'bg-vscode-sidebar border-vscode-border'
                        : 'bg-vscode-active/50 border-vscode-border/50 opacity-50'
                    }`}
                  >
                    <div className={`p-2 rounded ${
                      isActive
                        ? 'bg-vscode-blue/20'
                        : isCurrent
                        ? 'bg-vscode-blue/10'
                        : 'bg-vscode-active'
                    }`}>
                      <Icon
                        className={isActive ? 'text-vscode-blue' : 'text-vscode-text-secondary'}
                        size={18}
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-vscode-text' : 'text-vscode-text-secondary'
                      }`}>
                        {step.text}
                      </p>
                      {isCurrent && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.5 }}
                          className="h-0.5 bg-vscode-blue mt-1"
                        />
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-vscode-blue rounded-full"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-3 pt-4 border-t border-vscode-border"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-vscode-text-secondary font-medium">Loading Progress</span>
                  <span className="text-vscode-blue font-bold">{progress}%</span>
                </div>
                <div className="relative h-3 bg-vscode-active rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-vscode-blue via-vscode-blue/90 to-vscode-blue relative"
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                    {/* Glow Effect */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-vscode-blue blur-sm"
                    />
                  </motion.div>
                </div>
                {/* Progress Steps Indicator */}
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: progress >= (i + 1) * 10 ? 1 : 0.8,
                        opacity: progress >= (i + 1) * 10 ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        progress >= (i + 1) * 10 ? 'bg-vscode-blue' : 'bg-vscode-border'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-4 text-xs text-vscode-text-secondary"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-vscode-blue/30 border-t-vscode-blue rounded-full"
            />
            <span>Preparing your experience...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

