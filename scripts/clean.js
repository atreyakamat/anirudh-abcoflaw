import fs from 'fs';
import path from 'path';

console.log('🧹 Cleaning build artifacts...');

const targets = ['backend/dist', 'frontend/.next', 'coverage'];

targets.forEach((target) => {
  const fullPath = path.resolve(target);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed ${target}`);
    } catch (err) {
      console.warn(`⚠️ Could not remove ${target}: ${err.message}`);
    }
  }
});

console.log('✨ Cleanup complete.\n');
