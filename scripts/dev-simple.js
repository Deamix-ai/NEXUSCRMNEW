#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM-Nexus Development Environment\n');

let runningProcess = null;
let isShuttingDown = false;

// Enhanced process cleanup
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n🛑 Shutting down development servers...');
  
  if (runningProcess && !runningProcess.killed) {
    try {
      // Kill the process group to ensure all child processes are terminated
      process.kill(-runningProcess.pid, 'SIGTERM');
      setTimeout(() => {
        if (!runningProcess.killed) {
          process.kill(-runningProcess.pid, 'SIGKILL');
        }
      }, 5000);
    } catch (error) {
      console.log('   Warning: Could not gracefully stop processes');
    }
  }
  
  console.log('✅ Development servers stopped');
  process.exit(0);
}

// Handle process termination gracefully
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Kill any existing processes on our ports first
async function clearPorts() {
  const ports = [3000, 3001];
  
  for (const port of ports) {
    try {
      await new Promise((resolve) => {
        exec(`lsof -ti:${port}`, (error, stdout) => {
          if (!error && stdout.trim()) {
            const pids = stdout.trim().split('\n');
            console.log(`🧹 Clearing port ${port} (${pids.length} process(es))`);
            exec(`kill -9 ${pids.join(' ')}`, () => resolve());
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.log(`   Warning: Could not clear port ${port}`);
    }
  }
  
  // Wait a moment for ports to clear
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function startDevelopment() {
  try {
    // Clear any existing processes on our ports
    await clearPorts();
    
    console.log('🚦 Starting development servers with concurrently...\n');
    
    // Use concurrently to start both servers with better output handling
    runningProcess = spawn('npx', [
      'concurrently',
      '--prefix', '[{name}]',
      '--names', 'API,WEB',
      '--prefix-colors', 'green,blue',
      '--kill-others-on-fail',
      '--restart-tries', '3',
      'cd apps/api && npm run dev',
      'cd apps/web && npm run dev'
    ], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      detached: true, // Create a new process group
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    
    runningProcess.on('exit', (code, signal) => {
      if (!isShuttingDown) {
        if (code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
          console.log(`\n⚠️  Development servers exited with code ${code}`);
          console.log('🔄 Restarting in 3 seconds...');
          setTimeout(() => {
            if (!isShuttingDown) {
              startDevelopment();
            }
          }, 3000);
        }
      }
    });
    
    runningProcess.on('error', (error) => {
      console.error('❌ Failed to start development servers:', error.message);
      process.exit(1);
    });
    
    console.log('\n✅ Development environment started!');
    console.log('📱 Web: http://localhost:3000');
    console.log('🔌 API: http://localhost:3001');
    console.log('\n💡 Press Ctrl+C to stop all servers\n');
    
  } catch (error) {
    console.error('❌ Failed to start development environment:', error.message);
    process.exit(1);
  }
}

startDevelopment();