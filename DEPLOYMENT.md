# Deployment Guide - Step 4

## Deploy to Vercel (Recommended - Easiest)

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VS Code Portfolio"
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live in minutes!

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

## Deploy to Other Platforms

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder, OR
   - Connect your GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `.next`

### Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

### Self-Hosted (Docker)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## Pre-Deployment Checklist

- [ ] Update personal information in components
- [ ] Add your resume PDF to `public/resume.pdf`
- [ ] Update social links in `components/social-integrations.tsx`
- [ ] Set environment variables for AI features (if using)
- [ ] Test all features locally
- [ ] Update `README.md` with your info
- [ ] Add your domain name (if you have one)

## Environment Variables

If using AI features, add these to your hosting platform:

```
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Build for Production

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test production build locally
npm start
```

## Custom Domain Setup

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel/Netlify:
   - Go to project settings
   - Add custom domain
   - Update DNS records as instructed
   - Wait for SSL certificate (automatic)

## Post-Deployment

- Test all pages and features
- Set up analytics (Google Analytics, etc.)
- Submit to search engines
- Share your portfolio!

