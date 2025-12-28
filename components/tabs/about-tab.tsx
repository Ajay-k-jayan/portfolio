'use client'

import { memo } from 'react'
import { ProfileAvatar } from '@/components/profile-avatar'
import { portfolioData } from '@/lib/portfolio-data'

export const AboutTab = memo(function AboutTab() {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-4">About Me</h1>
          <div className="prose prose-invert max-w-none space-y-4 text-vscode-text">
            <div className="flex items-center gap-4 mb-6">
              <ProfileAvatar size="lg" />
              <div>
                <h2 className="text-2xl font-bold text-vscode-text mb-1">{portfolioData.profile.name}</h2>
                <p className="text-vscode-text-secondary">{portfolioData.profile.title}</p>
                <p className="text-sm text-vscode-green mt-1">{portfolioData.profile.subtitle}</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed">
              {portfolioData.profile.bio}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-vscode-active p-4 rounded-lg">
                <h3 className="text-vscode-blue font-semibold mb-2">Experience</h3>
                <p className="text-vscode-text-secondary text-sm">
                  {portfolioData.profile.experience} of professional development at {portfolioData.profile.company}
                </p>
              </div>
              <div className="bg-vscode-active p-4 rounded-lg">
                <h3 className="text-vscode-blue font-semibold mb-2">Location</h3>
                <p className="text-vscode-text-secondary text-sm">
                  {portfolioData.profile.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

