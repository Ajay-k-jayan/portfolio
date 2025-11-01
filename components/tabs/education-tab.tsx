'use client'

import { GraduationCap, Calendar, MapPin } from 'lucide-react'

export function EducationTab() {
  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-6">Education</h1>
          <div className="bg-vscode-active border border-vscode-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-vscode-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-vscode-text mb-2">
                  Diploma in Computer Engineering
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-vscode-text-secondary mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>Government Polytechnic College, Perumbavoor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>2018 – 2021</span>
                  </div>
                </div>
                <p className="text-vscode-text-secondary text-sm">
                  Completed comprehensive coursework in computer engineering fundamentals including
                  programming languages, data structures, algorithms, web development, and software engineering principles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

