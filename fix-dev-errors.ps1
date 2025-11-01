# PowerShell script to fix Next.js development errors
Write-Host "🔧 Fixing Next.js Development Environment..." -ForegroundColor Cyan

# Remove corrupted build folder
if (Test-Path .next) {
    Write-Host "🗑️  Removing .next folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next folder deleted" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next folder not found (that's okay)" -ForegroundColor Blue
}

# Remove cache
if (Test-Path node_modules/.cache) {
    Write-Host "🗑️  Removing cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✅ Cache cleared" -ForegroundColor Green
}

# Check if node_modules exists
if (!(Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Environment cleaned! Now run: npm run dev" -ForegroundColor Green
Write-Host ""

