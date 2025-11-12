'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  FileQuestion, 
  Home as HomeIcon, 
  ArrowLeft,
} from 'lucide-react'
import { VSCodeLayout } from '@/components/vscode-layout'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    document.title = '404 - Page Not Found | Ajay K J Portfolio'
  }, [])

  return (
    <VSCodeLayout>
      <div className="h-full w-full bg-vscode-bg text-vscode-text overflow-auto">
        <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              {/* Compact 404 Display */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative inline-block"
              >
                <div className="flex items-center justify-center gap-6 mb-6">
                  {/* Icon Box */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 bg-vscode-sidebar border-2 border-vscode-blue/30 rounded-xl flex items-center justify-center"
                  >
                    <FileQuestion className="text-vscode-blue" size={40} />
                  </motion.div>
                  
                  {/* 404 Number */}
                  <h1 className="text-7xl md:text-8xl font-black leading-none bg-gradient-to-r from-vscode-blue to-vscode-blue/70 bg-clip-text text-transparent">
                    404
                  </h1>
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-vscode-text">
                  Page Not Found
                </h2>
                <p className="text-base md:text-lg text-vscode-text-secondary max-w-xl mx-auto">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-vscode-blue text-white rounded-lg hover:bg-vscode-blue/90 transition-all flex items-center gap-2 font-semibold shadow-lg w-full sm:w-auto"
                >
                  <HomeIcon size={18} />
                  <span>Go to Homepage</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-vscode-sidebar border border-vscode-border rounded-lg hover:bg-vscode-hover hover:border-vscode-blue/50 transition-all flex items-center gap-2 font-semibold w-full sm:w-auto"
                >
                  <ArrowLeft size={18} />
                  <span>Go Back</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </VSCodeLayout>
  )
}
