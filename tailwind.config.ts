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
        'vscode-bg': '#1e1e1e',
        'vscode-sidebar': '#252526',
        'vscode-active': '#2d2d30',
        'vscode-hover': '#2a2d2e',
        'vscode-border': '#3e3e42',
        'vscode-text': '#cccccc',
        'vscode-text-secondary': '#858585',
        'vscode-blue': '#007acc',
        'vscode-green': '#4ec9b0',
        'vscode-orange': '#ce9178',
        'vscode-purple': '#c586c0',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

