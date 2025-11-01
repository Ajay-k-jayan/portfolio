'use client'

export function SkillsTab() {
  const skillCategories = [
    {
      name: 'Frontend Languages',
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'TypeScript', level: 88 },
        { name: 'HTML', level: 95 },
        { name: 'CSS', level: 92 },
        { name: 'SCSS/SASS', level: 85 },
      ],
    },
    {
      name: 'Frameworks & Libraries',
      skills: [
        { name: 'Angular', level: 92 },
        { name: 'Bootstrap', level: 88 },
        { name: 'Angular Material', level: 90 },
        { name: 'D3.js', level: 85 },
        { name: 'Storybook', level: 80 },
      ],
    },
    {
      name: 'Version Control & Tools',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Figma', level: 85 },
        { name: 'Adobe XD', level: 80 },
        { name: 'Jenkins', level: 75 },
        { name: 'MySQL Workbench', level: 82 },
      ],
    },
    {
      name: 'Additional Knowledge',
      skills: [
        { name: 'Python', level: 75 },
        { name: 'Django', level: 70 },
        { name: 'MySQL', level: 78 },
        { name: 'jQuery', level: 80 },
        { name: 'PHP', level: 72 },
      ],
    },
    {
      name: 'Core Areas',
      skills: [
        { name: 'Responsive UI Design', level: 92 },
        { name: 'Performance Optimization', level: 90 },
        { name: 'API Integration', level: 88 },
        { name: 'Code Review', level: 85 },
        { name: 'Agile Collaboration', level: 90 },
      ],
    },
  ]

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-vscode-text mb-6">Skills & Expertise</h1>
          <div className="space-y-8">
            {skillCategories.map((category) => (
              <div key={category.name}>
                <h2 className="text-xl font-semibold text-vscode-text mb-4">{category.name}</h2>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-vscode-text text-sm">{skill.name}</span>
                        <span className="text-vscode-text-secondary text-xs">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-vscode-active rounded-full overflow-hidden">
                        <div
                          className="h-full bg-vscode-blue transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

