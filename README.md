# VS Code Style Portfolio Website

An ultra-advanced developer portfolio website that perfectly replicates the Visual Studio Code interface using Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Core VS Code Interface
- ✅ Authentic VS Code sidebar with icon navigation
- ✅ Expandable/collapsible file explorer
- ✅ Tabbed browsing system
- ✅ Top menu bar with dropdowns (File, Edit, View, Go, Run, Terminal, Help)
- ✅ Status bar with visitor count and system info
- ✅ Dark theme with light theme toggle

### Advanced Features
- ✅ **AI-Powered Chatbot** - Interactive assistant for portfolio navigation
- ✅ **Voice Assistant** - Hands-free navigation using speech recognition
- ✅ **Dynamic Project Gallery** - Projects with code previews and live demos
- ✅ **Code Playground** - Embedded Monaco editor for code testing
- ✅ **Blog System** - MDX support with AI-generated summaries
- ✅ **Analytics Dashboard** - Real-time visitor insights and statistics
- ✅ **Gamification** - Achievement badges and skills tracking
- ✅ **Social Integrations** - GitHub, LinkedIn, and contact forms
- ✅ **Resume Download** - PDF resume download functionality

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── vscode-layout.tsx  # Main layout wrapper
│   ├── sidebar.tsx        # VS Code sidebar
│   ├── top-menu-bar.tsx   # Menu bar
│   ├── tab-bar.tsx        # Tab navigation
│   ├── status-bar.tsx     # Status bar
│   ├── file-explorer.tsx  # File tree
│   ├── ai-chatbot.tsx     # AI assistant
│   ├── voice-assistant.tsx # Voice navigation
│   ├── code-playground.tsx # Code editor
│   ├── analytics-dashboard.tsx # Analytics
│   ├── blog-system.tsx    # Blog component
│   ├── tabs/              # Tab content components
│   └── sidebar-views/     # Sidebar panel views
├── contexts/              # React contexts
├── lib/                   # Utilities and stores
└── public/                # Static assets
```

## Customization

### Update Personal Information

1. Edit `components/tabs/about-tab.tsx` for about information
2. Edit `components/tabs/skills-tab.tsx` for skills
3. Edit `components/tabs/projects-tab.tsx` for projects
4. Edit `components/social-integrations.tsx` for social links

### Themes

The theme system supports dark, light, and custom themes. Configure in `contexts/theme-context.tsx`.

### AI Integration

To integrate real AI services:
1. Update `components/ai-chatbot.tsx` with your API endpoint
2. Add environment variables for API keys
3. Implement actual AI responses

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Monaco Editor** - Code playground
- **Zustand** - State management
- **React Markdown** - Blog rendering
- **Lucide React** - Icons

## License

MIT License - feel free to use this portfolio template for your own projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

