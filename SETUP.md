# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Customization Guide

### Personal Information

1. **About Section**: Edit `components/tabs/about-tab.tsx`
2. **Skills**: Update `components/tabs/skills-tab.tsx`
3. **Projects**: Modify `components/tabs/projects-tab.tsx`
4. **Social Links**: Update `components/social-integrations.tsx`

### Resume

1. Place your resume PDF in `public/resume.pdf`
2. Update the download link in `components/social-integrations.tsx` if needed

### Blog Posts

1. Add blog posts in `components/blog-system.tsx`
2. Support MDX format for rich content
3. Add AI summaries for each post

### AI Integration

The chatbot currently uses simulated responses. To integrate real AI:

1. Add your API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_key_here
   ```

2. Update `components/ai-chatbot.tsx` to use your API

### Analytics

Currently using mock data. To integrate real analytics:

1. Set up Google Analytics or similar
2. Update `components/analytics-dashboard.tsx` with real data endpoints

### Voice Assistant

Voice assistant uses browser's Web Speech API. To improve:

1. Add better command parsing
2. Integrate with backend for complex commands
3. Add language support

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

```bash
npm run build
npm start
```

## Features Checklist

- ✅ VS Code Interface Replication
- ✅ File Explorer
- ✅ Tab System
- ✅ Top Menu Bar
- ✅ Status Bar
- ✅ Dark/Light Theme
- ✅ AI Chatbot
- ✅ Voice Assistant
- ✅ Code Playground
- ✅ Project Gallery
- ✅ Blog System
- ✅ Analytics Dashboard
- ✅ Social Integrations
- ✅ Achievements/Badges
- ✅ Notifications
- ✅ Resume Download

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (voice features may vary)

## Troubleshooting

### Monaco Editor not loading
- Clear browser cache
- Check console for errors
- Ensure @monaco-editor/react is installed

### Voice Assistant not working
- Grant microphone permissions
- Use Chrome/Edge for best support
- Check browser console for errors

### Styles not applying
- Run `npm install` again
- Clear `.next` folder and rebuild
- Check Tailwind config

