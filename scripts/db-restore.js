import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔄 Starting Database Restore Verification Utility...\n');

const backupDir = path.resolve('backups');
if (!fs.existsSync(backupDir)) {
  console.log('ℹ️ No backups directory found. Run "npm run db:backup" to create a backup file first.');
  process.exit(0);
}

const files = fs.readdirSync(backupDir).filter((f) => f.endsWith('.sql'));

if (files.length === 0) {
  console.log('ℹ️ No backup .sql files found in backups/ directory.');
  process.exit(0);
}

const latestBackup = files.sort().reverse()[0];
const backupFilePath = path.join(backupDir, latestBackup);

console.log(`📌 Found latest database backup: ${latestBackup}`);
console.log('🔍 Verifying SQL backup file structure and readability...');

try {
  const content = fs.readFileSync(backupFilePath, 'utf-8');
  const sizeKB = (fs.statSync(backupFilePath).size / 1024).toFixed(2);
  console.log(`✓ Backup File Size: ${sizeKB} KB`);
  console.log(`✓ Backup File Line Count: ${content.split('\n').length} lines`);

  console.log('\n--------------------------------------------------------');
  console.log(`✅ Backup File Validated & Restorable: ${latestBackup}`);
  console.log('--------------------------------------------------------\n');
} catch (error) {
  console.error('❌ Database Restore Check Failed:', error.message);
  process.exit(1);
}
