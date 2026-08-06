import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🩺 Running AB & Co. Legal Platform Doctor Diagnostics...\n');

let status = true;

// 1. Node check
try {
  const v = process.version;
  console.log(`✓ Node.js version: ${v}`);
} catch (err) {
  console.error('❌ Node.js not detected');
  status = false;
}

// 2. npm check
try {
  const npmV = execSync('npm -v', { encoding: 'utf-8' }).trim();
  console.log(`✓ npm version: ${npmV}`);
} catch (err) {
  console.error('❌ npm command failed');
  status = false;
}

// 3. Database check
try {
  const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
  if (envFile.includes('DATABASE_URL')) {
    console.log('✓ DATABASE_URL configured in .env');
  } else {
    console.error('❌ DATABASE_URL missing from .env');
    status = false;
  }
} catch (err) {
  console.error('❌ Could not read .env file');
  status = false;
}

// 4. n8n CLI check
try {
  const n8nV = execSync('npx n8n --version', { encoding: 'utf-8' }).trim();
  console.log(`✓ n8n version: ${n8nV}`);
} catch (err) {
  console.error('❌ n8n CLI check failed');
}

console.log('\n--------------------------------------------------------');
if (status) {
  console.log('✅ Doctor Diagnostics: All core dependencies operational!');
} else {
  console.error('⚠️ Doctor Diagnostics: Issues detected. Review warnings above.');
}
console.log('--------------------------------------------------------\n');
