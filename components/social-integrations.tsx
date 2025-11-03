'use client'

import { Github, Linkedin, Mail, Download, ExternalLink, Share2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function SocialIntegrations() {
  const { portfolioSettings } = useAppStore()
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ajay-k-jayan',
      icon: Github,
      color: 'text-gray-300 hover:text-white',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ajay-k-jayan',
      icon: Linkedin,
      color: 'text-blue-400 hover:text-blue-300',
    },
    {
      name: 'Email',
      url: 'mailto:ajaykj2000@gmail.com',
      icon: Mail,
      color: 'text-green-400 hover:text-green-300',
    },
  ]

  const handleDownloadResume = () => {
    // In production, this would download the actual resume PDF
    const link = document.createElement('a')
    link.href = '/resume.pdf' // Path to your resume
    link.download = 'Resume.pdf'
    link.click()
  }

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2 mb-1">
            <Share2 className="text-vscode-blue" size={20} />
            Social Medias
          </h1>
          <p className="text-sm text-vscode-text-secondary">Connect with me on social platforms and download my resume</p>
        </div>
        
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-vscode-text mb-4">Connect with Me</h2>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 bg-vscode-active hover:bg-vscode-hover border border-vscode-border rounded-lg transition-colors ${social.color}`}
              >
                <Icon size={18} />
                <span>{social.name}</span>
                <ExternalLink size={14} />
              </a>
            )
          })}
        </div>
      </div>

      {portfolioSettings.showResumeDownload && (
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-vscode-text mb-4">Resume</h2>
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-4 py-2 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            <span>Download Resume (PDF)</span>
          </button>
          <p className="text-sm text-vscode-text-secondary mt-2">
            Get the latest version of my resume
          </p>
        </div>
      )}

      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-vscode-text mb-4">Contact Information</h2>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-vscode-text">
            <span className="text-vscode-text-secondary">📍</span>
            <span>Kerala, India</span>
          </div>
          <div className="flex items-center gap-2 text-vscode-text">
            <span className="text-vscode-text-secondary">📧</span>
            <a href="mailto:ajaykj2000@gmail.com" className="text-vscode-blue hover:underline">
              ajaykj2000@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-vscode-text">
            <span className="text-vscode-text-secondary">📱</span>
            <a href="tel:+918289917044" className="text-vscode-blue hover:underline">
              +91 8289917044
            </a>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-vscode-text mb-4 mt-6">Contact Form</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-vscode-text-secondary mb-1">Name</label>
            <input
              type="text"
              className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-vscode-text focus:outline-none focus:border-vscode-blue"
            />
          </div>
          <div>
            <label className="block text-sm text-vscode-text-secondary mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-vscode-text focus:outline-none focus:border-vscode-blue"
            />
          </div>
          <div>
            <label className="block text-sm text-vscode-text-secondary mb-1">Message</label>
            <textarea
              rows={4}
              className="w-full bg-vscode-active border border-vscode-border rounded px-3 py-2 text-vscode-text focus:outline-none focus:border-vscode-blue resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-vscode-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
      </div>
    </div>
  )
}

