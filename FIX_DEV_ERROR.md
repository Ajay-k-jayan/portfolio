# Fix Development Server Error

## Error
```
Error: Cannot find module 'C:\Users\ajayk\OneDrive\Desktop\2025-nov-portfolio\.next\server\middleware-manifest.json'
```

## Solution

This error occurs when the `.next` build folder is corrupted or incomplete. Here's how to fix it:

### Option 1: Quick Fix (Recommended)

Run this PowerShell command:
```powershell
.\fix-dev-errors.ps1
```

Then start the dev server:
```bash
npm run dev
```

### Option 2: Manual Fix

1. **Delete the `.next` folder:**
   ```powershell
   if (Test-Path .next) { Remove-Item -Recurse -Force .next }
   ```

2. **Clear cache (if exists):**
   ```powershell
   if (Test-Path node_modules/.cache) { Remove-Item -Recurse -Force node_modules/.cache }
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

The `.next` folder will be regenerated automatically when you start the dev server.

### Option 3: Complete Clean Install

If the error persists:

```powershell
# Remove build folder
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install

# Start dev server
npm run dev
```

## Why This Happens

- The `.next` folder contains Next.js build artifacts
- If the build process is interrupted, it can become corrupted
- OneDrive sync can sometimes cause file locking issues
- Windows permissions can prevent proper cleanup

## Prevention

1. **Don't interrupt the dev server** while it's building
2. **Close dev server properly** (Ctrl+C) before closing terminal
3. **Exclude `.next` from OneDrive sync** if possible

## After Fixing

Once the dev server starts successfully:
- ✅ `.next` folder will be automatically created
- ✅ All build files will be generated properly
- ✅ Development server should work normally

If you still see errors, share the full error message and I'll help fix it!

