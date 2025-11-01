import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vscode-bg': 'var(--theme-bg, #1e1e1e)',
        'vscode-sidebar': 'var(--theme-sidebar, #252526)',
        'vscode-active': 'var(--theme-active, #2d2d30)',
        'vscode-hover': 'var(--theme-hover, #2a2d2e)',
        'vscode-border': 'var(--theme-border, #3e3e42)',
        'vscode-text': 'var(--theme-text, #cccccc)',
        'vscode-text-secondary': 'var(--theme-text-secondary, #858585)',
        'vscode-blue': 'var(--theme-blue, #007acc)',
        'vscode-blue-accent': 'var(--theme-blue-accent, #569cd6)',
        'vscode-green': 'var(--theme-green, #4ec9b0)',
        'vscode-orange': 'var(--theme-orange, #ce9178)',
        'vscode-purple': 'var(--theme-purple, #c586c0)',
        'vscode-red': 'var(--theme-red, #f48771)',
        'vscode-yellow': 'var(--theme-yellow, #dcdcaa)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

