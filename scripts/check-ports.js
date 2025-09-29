#!/usr/bin/env node

const net = require('net');
const { execSync } = require('child_process');

const REQUIRED_PORTS = [
  { port: 3000, name: 'Web App (Next.js)' },
  { port: 3001, name: 'API Server (NestJS)' }
];

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true); // Port is available
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false); // Port is in use
    });
  });
}

function killProcessOnPort(port) {
  try {
    console.log(`🔧 Killing processes on port ${port}...`);
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
    console.log(`✅ Cleared port ${port}`);
    return true;
  } catch (error) {
    console.log(`ℹ️  No processes found on port ${port}`);
    return false;
  }
}

async function checkAllPorts() {
  console.log('🔍 Checking required ports...\n');
  
  const results = [];
  
  for (const { port, name } of REQUIRED_PORTS) {
    const isAvailable = await checkPort(port);
    results.push({ port, name, isAvailable });
    
    if (isAvailable) {
      console.log(`✅ Port ${port} (${name}) - Available`);
    } else {
      console.log(`❌ Port ${port} (${name}) - Already in use`);
    }
  }
  
  const unavailablePorts = results.filter(r => !r.isAvailable);
  
  if (unavailablePorts.length > 0) {
    console.log('\n🚨 Required ports are in use - automatically clearing them...\n');
    
    // Kill processes on all unavailable ports
    for (const { port, name } of unavailablePorts) {
      killProcessOnPort(port);
    }
    
    console.log('\n⏳ Waiting a moment for ports to clear...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Re-check ports after killing processes
    console.log('\n🔍 Re-checking ports...\n');
    
    for (const { port, name } of REQUIRED_PORTS) {
      const isAvailable = await checkPort(port);
      
      if (isAvailable) {
        console.log(`✅ Port ${port} (${name}) - Now available`);
      } else {
        console.log(`❌ Port ${port} (${name}) - Still in use`);
        console.log(`\n🚨 ERROR: Could not clear port ${port}. You may need to manually stop the process.`);
        console.log(`Try running: lsof -ti:${port} | xargs kill -9`);
        process.exit(1);
      }
    }
  }
  
  console.log('\n✅ All required ports are available!');
  console.log('🚀 Starting development servers...\n');
}

checkAllPorts().catch(console.error);
