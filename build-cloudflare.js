const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log(' HealthBridge AI - Cloudflare Build Pipeline ');
console.log('==============================================');

try {
  console.log('[1/3] Installing frontend dependencies...');
  execSync('npm ci', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  console.log('[2/3] Compiling frontend with Vite...');
  execSync('npm run build', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  console.log('[3/3] Syncing output to root dist directory...');
  const srcDir = path.join(__dirname, 'frontend', 'dist');
  const destDir = path.join(__dirname, 'dist');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.cpSync(srcDir, destDir, { recursive: true });

  console.log('SUCCESS: Build completed and assets copied to dist/');
} catch (error) {
  console.error('ERROR during build pipeline:', error);
  process.exit(1);
}
