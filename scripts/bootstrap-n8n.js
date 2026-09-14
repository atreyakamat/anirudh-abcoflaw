import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔄 Starting Official n8n Workflow Bootstrap...');

const workflowFile = path.resolve('n8n/workflows/appointment-created.json');

if (!fs.existsSync(workflowFile)) {
  console.error(`❌ Workflow file not found at: ${workflowFile}`);
  process.exit(1);
}

try {
  // 1. Import workflow using official n8n CLI command
  console.log('📥 Importing n8n workflow definition via n8n CLI...');
  const importOutput = execSync(`npx n8n import:workflow --input="${workflowFile}"`, { encoding: 'utf-8' });
  console.log(importOutput.trim());

  // 2. Activate/publish workflow using official n8n CLI command
  console.log('⚡ Activating workflows via official n8n CLI...');
  try {
    const publishOutput = execSync(`npx n8n publish:workflow --id="appointment-created"`, { encoding: 'utf-8' });
    console.log(publishOutput.trim());
  } catch (_pubErr) {
    const activateOutput = execSync(`npx n8n update:workflow --all --active=true`, { encoding: 'utf-8' });
    console.log(activateOutput.trim());
  }

  console.log('🎉 n8n Official CLI Bootstrap Completed Successfully!');
} catch (error) {
  console.error('❌ n8n Bootstrap Failed:', error.message);
  process.exit(1);
}
