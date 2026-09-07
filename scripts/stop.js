import { execSync } from 'child_process';
import os from 'os';

console.log('🛑 Stopping local development services...');

const isWindows = os.platform() === 'win32';

try {
  if (isWindows) {
    execSync('powershell -ExecutionPolicy Bypass -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'inherit' });
  } else {
    // Linux/macOS
    try {
      execSync('pkill -f "nest start" || true', { stdio: 'ignore' });
      execSync('pkill -f "next dev" || true', { stdio: 'ignore' });
      execSync('pkill -f "n8n start" || true', { stdio: 'ignore' });
    } catch {
      // Ignore if no processes found
    }
  }
  console.log('✓ Development processes stopped successfully.\n');
} catch (err) {
  console.warn(`⚠️ Warning while stopping processes: ${err.message}`);
}
