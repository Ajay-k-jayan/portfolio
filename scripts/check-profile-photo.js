const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const imageFormats = ['profile-photo.jpg', 'profile-photo.jpeg', 'profile-photo.png', 'profile-photo.webp'];

console.log('🔍 Checking for profile photo...\n');

let found = false;
for (const format of imageFormats) {
  const filePath = path.join(publicDir, format);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ Found: ${format}`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
    found = true;
    break;
  }
}

if (!found) {
  console.log('❌ Profile photo not found!\n');
  console.log('📝 To fix this:');
  console.log('   1. Save your profile photo as "profile-photo.jpg"');
  console.log('   2. Place it in the "public" folder');
  console.log('   3. Recommended: 400x400px, square format\n');
  console.log(`   Expected location: ${publicDir}/profile-photo.jpg\n`);
} else {
  console.log('\n✅ Profile photo is ready to use!');
}

