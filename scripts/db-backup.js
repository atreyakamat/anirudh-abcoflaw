import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('📦 Starting PostgreSQL Database Backup Utility...\n');

const backupDir = path.resolve('backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `db-backup-${timestamp}.sql`);

try {
  const schemaFile = path.resolve('backend/prisma/schema.prisma');

  console.log(`💾 Executing database schema backup dump to: ${backupFile}`);
  execSync(`npx prisma db pull --schema="${schemaFile}" --print > "${backupFile}"`, { stdio: 'inherit' });

  console.log('\n--------------------------------------------------------');
  console.log(`✅ Backup Dump Completed Successfully: ${backupFile}`);
  console.log('--------------------------------------------------------\n');
} catch (error) {
  console.error('❌ Database Backup Failed:', error.message);
  process.exit(1);
}
