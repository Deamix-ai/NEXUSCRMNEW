#!/usr/bin/env node

const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM-Nexus Development Environment\n');

// Track running processes for cleanup
const runningProcesses = [];
let isShuttingDown = false;

// Enhanced process cleanup
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n🛑 Shutting down development servers...');
  
  runningProcesses.forEach((proc, index) => {
    if (proc && !proc.killed) {
      console.log(`   Stopping process ${index + 1}...`);
      try {
        // Kill the process group to ensure all child processes are terminated
        process.kill(-proc.pid, 'SIGTERM');
      } catch (error) {
        console.log(`   Warning: Could not gracefully stop process ${index + 1}`);
        try {
          process.kill(-proc.pid, 'SIGKILL');
        } catch (killError) {
          console.log(`   Error: Could not force stop process ${index + 1}`);
        }
      }
    }
  });
  
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

// Enhanced process spawning with restart capability
function spawnServer(name, command, args, cwd, color = '\x1b[36m') {
  const reset = '\x1b[0m';
  let restartCount = 0;
  const maxRestarts = 5;
  
  function startProcess() {
    if (isShuttingDown) return null;
    
    console.log(`${color}📦 Starting ${name}...${reset}`);
    
    const proc = spawn(command, args, {
      cwd: cwd,
      stdio: ['inherit', 'pipe', 'pipe'],
      detached: true, // Create a new process group
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    
    runningProcesses.push(proc);
    
    // Handle stdout with colored prefixes
    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${color}[${name}]${reset} ${line}`);
        }
      });
    });
    
    // Handle stderr with colored prefixes
    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${color}[${name}]${reset} ${line}`);
        }
      });
    });
    
    // Handle process exit
    proc.on('exit', (code, signal) => {
      if (isShuttingDown) return;
      
      if (code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
        restartCount++;
        console.log(`${color}⚠️  ${name} exited with code ${code} (restart ${restartCount}/${maxRestarts})${reset}`);
        
        if (restartCount < maxRestarts) {
          console.log(`${color}🔄 Restarting ${name} in 2 seconds...${reset}`);
          setTimeout(() => {
            if (!isShuttingDown) {
              startProcess();
            }
          }, 2000);
        } else {
          console.log(`${color}❌ ${name} failed too many times, giving up${reset}`);
        }
      } else {
        console.log(`${color}✅ ${name} stopped gracefully${reset}`);
      }
    });
    
    proc.on('error', (error) => {
      console.log(`${color}❌ ${name} error: ${error.message}${reset}`);
    });
    
    return proc;
  }
  
  return startProcess();
}

async function startDevelopment() {
  try {
    // Clear any existing processes on our ports
    await clearPorts();
    
    console.log('🚦 Starting development servers...\n');
    
    // Use turbo to start both servers, which handles workspaces properly
    const devServer = spawnServer(
      'TURBO-DEV', 
      'npx', 
      ['turbo', 'run', 'dev', '--parallel'], 
      path.join(__dirname, '..'),
      '\x1b[35m' // Magenta
    );
    
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