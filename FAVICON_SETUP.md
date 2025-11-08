# Favicon and Profile Photo Setup Guide

## Steps to Add Your Photo

### 1. Add Profile Photo (Required)
1. Save your profile photo as `profile-photo.jpg` in the `public` folder
2. Recommended size: 400x400px or larger (square aspect ratio works best)
3. The photo will automatically be used in:
   - **SVG Favicon** (browser tabs)
   - Welcome page avatar
   - About page avatar
   - ProfileAvatar component throughout the portfolio

### 2. SVG Favicon (Already Created!)
✅ **SVG favicon files are already created and configured:**
- `public/favicon.svg` - Main SVG favicon
- `app/icon.svg` - Next.js app icon
- Both automatically use your `profile-photo.jpg`

The SVG favicon will:
- Display your photo in a circular frame
- Work in all modern browsers
- Scale perfectly at any size
- Fallback to "AKJ" initials if image not found

### 3. Optional: ICO Fallback (For Older Browsers)
If you want to support older browsers:
1. Create an ICO file from your photo:
   - Use [Favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Upload your profile photo
   - Generate `favicon.ico`
2. Save it to the `public` folder

### File Structure
```
public/
  ├── profile-photo.jpg  (Your profile photo - REQUIRED)
  ├── favicon.svg        (SVG favicon - Already created ✅)
  └── favicon.ico        (ICO fallback - Optional)

app/
  └── icon.svg           (Next.js icon - Already created ✅)
```

### ProfileAvatar Component
A reusable component has been created at `components/profile-avatar.tsx`:
- Automatically uses your profile photo
- Falls back to "AKJ" initials if image fails
- Available in multiple sizes: `sm`, `md`, `lg`, `xl`
- Used in Welcome and About pages

### Usage Example
```tsx
import { ProfileAvatar } from '@/components/profile-avatar'

<ProfileAvatar size="lg" />
```

### Notes
- ✅ SVG favicon is already configured and ready
- ✅ ProfileAvatar component is ready to use
- ⚠️ You only need to add `profile-photo.jpg` to the `public` folder
- The favicon will appear in browser tabs and bookmarks automatically
- All images will fallback to "AKJ" initials if the photo file is missing

