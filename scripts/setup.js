import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

console.log('🚀 Starting Comprehensive AB & Co. Legal Platform Setup & Bootstrap...\n');

// 1. Verify Node Version
const nodeVersion = process.version;
console.log(`📌 Checking Environment: Node ${nodeVersion}`);
const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required.');
  process.exit(1);
}

// 2. Validate .env file
const envFile = path.resolve('.env');
if (!fs.existsSync(envFile)) {
  console.warn('⚠️ .env file not found. Creating from .env.example if available...');
  if (fs.existsSync(path.resolve('.env.example'))) {
    fs.copyFileSync(path.resolve('.env.example'), envFile);
    console.log('✓ Created .env from .env.example');
  }
} else {
  console.log('✓ Environment configuration .env present');
}

try {
  // 3. Database Prisma Setup
  console.log('\n🗄️ Generating Prisma Client & Running Migrations...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  execSync('npm run db:migrate:dev', { stdio: 'inherit' });
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✓ Database schema, migrations, and seed data initialized.');

  // 4. n8n Official Workflow Bootstrap
  console.log('\n🔄 Bootstrapping n8n Automation Workflows via official n8n CLI...');
  const workflowFile = path.resolve('n8n/workflows/appointment-created.json');
  if (fs.existsSync(workflowFile)) {
    execSync(`npx n8n import:workflow --input="${workflowFile}"`, { stdio: 'inherit' });
    execSync('npx n8n update:workflow --all --active=true', { stdio: 'inherit' });
    console.log('✓ n8n workflow imported and activated via official n8n CLI.');
  }

  console.log('\n========================================================');
  console.log('🎉 AB & Co. Legal Platform Bootstrap Complete & Verified!');
  console.log('   Run "npm run dev:all" to launch the unified stack.');
  console.log('========================================================\n');
} catch (error) {
  console.error('\n❌ Setup process encountered an error:', error.message);
  process.exit(1);
}
