'use client'

import { Trophy, Award, Star, Zap, Code2 } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  earnedDate?: string
}

const badges: Badge[] = [
  {
    id: '1',
    name: 'Beinex Excelencia Award',
    description: 'Outstanding performance and contribution',
    icon: <Trophy className="text-yellow-500" size={20} />,
    earned: true,
    earnedDate: '2024-01-01',
  },
  {
    id: '2',
    name: 'Programming with JavaScript — Meta',
    description: 'Meta certification in JavaScript',
    icon: <Code2 className="text-vscode-blue" size={20} />,
    earned: true,
    earnedDate: '2023-06-15',
  },
  {
    id: '3',
    name: 'Version Control — Meta',
    description: 'Git and version control mastery',
    icon: <Zap className="text-green-500" size={20} />,
    earned: true,
    earnedDate: '2023-06-20',
  },
  {
    id: '4',
    name: 'Modern JavaScript ES6 Basics — Google',
    description: 'ES6+ JavaScript fundamentals',
    icon: <Star className="text-purple-500" size={20} />,
    earned: true,
    earnedDate: '2023-05-10',
  },
  {
    id: '5',
    name: 'React.js Essentials Bootcamp — LetsUpgrade',
    description: 'React.js development skills',
    icon: <Award className="text-orange-500" size={20} />,
    earned: true,
    earnedDate: '2023-04-01',
  },
  {
    id: '6',
    name: 'AI for Everyone — DeepLearning.AI',
    description: 'AI fundamentals and applications',
    icon: <Star className="text-blue-400" size={20} />,
    earned: true,
    earnedDate: '2020-08-15',
  },
  {
    id: '7',
    name: 'AWS Cloud Essentials — AWS',
    description: 'AWS cloud computing basics',
    icon: <Award className="text-orange-400" size={20} />,
    earned: true,
    earnedDate: '2020-07-20',
  },
]

export function AchievementsView() {
  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs text-vscode-text-secondary uppercase">Badges & Achievements</div>
      <div className="space-y-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`px-4 py-3 mx-2 rounded-lg border ${
              badge.earned
                ? 'bg-vscode-active border-vscode-blue/50'
                : 'bg-vscode-sidebar border-vscode-border opacity-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{badge.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-vscode-text">{badge.name}</h4>
                  {badge.earned && (
                    <span className="text-xs text-vscode-green">✓ Earned</span>
                  )}
                </div>
                <p className="text-xs text-vscode-text-secondary mt-1">{badge.description}</p>
                {badge.earnedDate && (
                  <p className="text-xs text-vscode-text-secondary mt-1">
                    Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

