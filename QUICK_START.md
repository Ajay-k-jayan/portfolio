# Quick Start Guide

## First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:3000

## Troubleshooting

### If `npm install` fails:
- Make sure Node.js version 18+ is installed
- Check: `node --version` (should be 18.x or higher)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### If project won't start:
```bash
# Remove old build files
rm -rf .next node_modules package-lock.json

# Fresh install
npm install

# Try again
npm run dev
```

### Common Errors:

**Error: Cannot find module**
- Solution: Run `npm install` again

**Error: Port 3000 already in use**
- Solution: Kill the process or use another port:
  ```bash
  npm run dev -- -p 3001
  ```

**Monaco Editor not loading**
- This is normal on first load, wait a few seconds
- Clear browser cache if persistent

**Voice Assistant not working**
- Grant microphone permissions in browser
- Use Chrome or Edge for best support

## Verify Installation

Check these files exist:
- ✅ `node_modules/` folder
- ✅ `.next/` folder (created after first build)
- ✅ `package.json`
- ✅ `tailwind.config.ts`

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check for errors
```

## Next Steps After Running

1. ✅ Project should open at http://localhost:3000
2. ✅ Test all features:
   - Click sidebar icons
   - Open files in explorer
   - Try AI chatbot (bottom right)
   - Test voice assistant (microphone button)
   - Check code playground
3. ✅ Customize your content
4. ✅ Deploy (see DEPLOYMENT.md)

