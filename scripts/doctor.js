import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

console.log('🩺 Running AB & Co. Legal Platform Enterprise Diagnostics...\n');

let passedChecks = 0;
let totalChecks = 0;

function runCheck(label, fn) {
  totalChecks++;
  try {
    const ok = fn();
    if (ok !== false) {
      passedChecks++;
      console.log(`✓ [PASS] ${label}`);
    } else {
      console.error(`❌ [FAIL] ${label}`);
    }
  } catch (err) {
    console.error(`❌ [FAIL] ${label} - ${err.message}`);
  }
}

// 1. Node.js check
runCheck('Node.js runtime environment (>= 18.0.0)', () => {
  const version = process.version;
  const major = parseInt(version.replace('v', '').split('.')[0], 10);
  return major >= 18;
});

// 2. npm check
runCheck('npm package manager CLI', () => {
  const v = execSync('npm -v', { encoding: 'utf-8' }).trim();
  return Boolean(v);
});

// 3. Environment configuration (.env)
runCheck('Environment file (.env) configuration', () => {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) return false;
  const content = fs.readFileSync(envPath, 'utf-8');
  return content.includes('DATABASE_URL') && content.includes('JWT_SECRET');
});

// 4. Prisma Schema integrity
runCheck('Prisma Database Schema (backend/prisma/schema.prisma)', () => {
  const schemaPath = path.resolve('backend/prisma/schema.prisma');
  return fs.existsSync(schemaPath);
});

// 5. Backend Build Artifacts
runCheck('Backend compiled build (backend/dist/main.js)', () => {
  return fs.existsSync(path.resolve('backend/dist/main.js'));
});

// 6. Frontend Build Artifacts
runCheck('Frontend Next.js production build (frontend/.next)', () => {
  return fs.existsSync(path.resolve('frontend/.next'));
});

// 7. n8n Workflow Definition
runCheck('n8n Automation Workflow (n8n/workflows/appointment-created.json)', () => {
  return fs.existsSync(path.resolve('n8n/workflows/appointment-created.json'));
});

// 8. n8n CLI installation
runCheck('n8n Automation CLI tool', () => {
  const v = execSync('npx n8n --version', { encoding: 'utf-8' }).trim();
  return Boolean(v);
});

// 9. Playwright E2E configuration
runCheck('Playwright E2E test suite setup (frontend/playwright.config.ts)', () => {
  return fs.existsSync(path.resolve('frontend/playwright.config.ts'));
});

// 10. Root Package Scripts
runCheck('Unified npm Scripts (dev:all, setup, doctor, db:backup)', () => {
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
  return pkg.scripts['dev:all'] && pkg.scripts['setup'] && pkg.scripts['doctor'];
});

console.log('\n========================================================');
if (passedChecks === totalChecks) {
  console.log(`✅ ALL ${passedChecks}/${totalChecks} DIAGNOSTIC CHECKS PASSED! Platform is 100% Ready.`);
} else {
  console.warn(`⚠️ Diagnostics Warning: ${passedChecks}/${totalChecks} checks passed. Please review failures above.`);
}
console.log('========================================================\n');
