import { spawn } from 'child_process';
import http from 'http';

function checkN8n(callback) {
  let called = false;
  const done = (result) => {
    if (!called) {
      called = true;
      callback(result);
    }
  };

  const req = http.get('http://localhost:5678/healthz', (res) => {
    done(res.statusCode === 200);
  });

  req.on('error', () => done(false));
  req.setTimeout(1500, () => {
    req.destroy();
    done(false);
  });
}

checkN8n((isRunning) => {
  if (isRunning) {
    console.log('⚡ [n8n] Active n8n workflow engine detected on http://localhost:5678');
    setInterval(() => {}, 60000);
  } else {
    console.log('🚀 [n8n] Starting local n8n workflow engine on port 5678...');
    const proc = spawn('npx', ['n8n', 'start'], { stdio: 'inherit' });
    proc.on('exit', (code) => process.exit(code || 0));
  }
});
