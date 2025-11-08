'use client'

import { ProfileAvatar } from '@/components/profile-avatar'

export function AboutTab() {
  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-4">About Me</h1>
          <div className="prose prose-invert max-w-none space-y-4 text-vscode-text">
            <div className="flex items-center gap-4 mb-6">
              <ProfileAvatar size="lg" />
              <div>
                <h2 className="text-2xl font-bold text-vscode-text mb-1">Ajay K J</h2>
                <p className="text-vscode-text-secondary">Software Engineer</p>
                <p className="text-sm text-vscode-green mt-1">Front-End Developer | Angular | UI Design | Web Performance</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed">
              Experienced Front-End Developer with 2 years of proven expertise in Angular development,
              web performance optimization, and responsive interfaces. Skilled at transforming business
              requirements into effective, scalable web applications. Committed to clean code, design
              aesthetics, and modern frameworks while collaborating in agile development environments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-vscode-active p-4 rounded-lg">
                <h3 className="text-vscode-blue font-semibold mb-2">Experience</h3>
                <p className="text-vscode-text-secondary text-sm">
                  2+ years of professional Angular development at Beinex
                </p>
              </div>
              <div className="bg-vscode-active p-4 rounded-lg">
                <h3 className="text-vscode-blue font-semibold mb-2">Education</h3>
                <p className="text-vscode-text-secondary text-sm">
                  Diploma in Computer Engineering - Government Polytechnic College, Perumbavoor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

