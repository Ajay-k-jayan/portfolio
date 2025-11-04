'use client'

import { Github, Download, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'
import { useAppStore } from '@/lib/store'

export function SocialLinksWidget() {
  const { portfolioSettings, addNotification } = useAppStore()
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ajay-k-jayan',
      icon: Github,
      color: 'hover:text-gray-300',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ajay-k-jayan',
      icon: Linkedin,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Email',
      url: 'mailto:ajaykj2000@gmail.com',
      icon: Mail,
      color: 'hover:text-green-400',
    },
  ]

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Ajay_K_J_Resume.pdf'
    link.click()
    
    // Show download started notification
    addNotification({
      title: 'Resume Download',
      message: 'Resume download started: Ajay_K_J_Resume.pdf',
      type: 'info'
    })
    
    // Show completion notification after a delay
    setTimeout(() => {
      addNotification({
        title: 'Resume Download Complete',
        message: 'Resume download completed successfully: Ajay_K_J_Resume.pdf',
        type: 'success'
      })
    }, 2000)
  }

  return (
    <div className="flex items-center gap-1">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <Tooltip
            key={social.name}
            content={
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  {social.name}
                  <ExternalLink size={10} className="opacity-70" />
                </span>
                <span className="text-xs opacity-75">{social.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}</span>
              </div>
            }
            position="top"
          >
            <motion.a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded hover:bg-black/20 transition-colors cursor-pointer flex-shrink-0 ${social.color}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={12} />
            </motion.a>
          </Tooltip>
        )
      })}
      {portfolioSettings.showResumeDownload && (
        <Tooltip 
          content={
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Download Resume</span>
              <span className="text-xs opacity-75">Ajay_K_J_Resume.pdf</span>
            </div>
          } 
          position="top"
        >
          <motion.button
            onClick={handleDownloadResume}
            className="p-1.5 rounded hover:bg-black/20 transition-colors cursor-pointer hover:text-green-400 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download size={12} />
          </motion.button>
        </Tooltip>
      )}
    </div>
  )
}

