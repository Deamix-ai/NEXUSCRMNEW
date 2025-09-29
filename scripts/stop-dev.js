#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🛑 Stopping CRM-Nexus development servers...\n');

const ports = [3000, 3001];

function killPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`   Port ${port}: No process found`);
        resolve();
        return;
      }
      
      const pids = stdout.trim().split('\n');
      console.log(`   Port ${port}: Killing ${pids.length} process(es)`);
      
      exec(`kill -9 ${pids.join(' ')}`, (killError) => {
        if (killError) {
          console.log(`   Port ${port}: Error killing processes - ${killError.message}`);
        } else {
          console.log(`   Port ${port}: ✅ Stopped`);
        }
        resolve();
      });
    });
  });
}

async function stopAll() {
  for (const port of ports) {
    await killPort(port);
  }
  
  console.log('\n✅ All CRM-Nexus processes stopped!');
  console.log('You can now run "npm run dev" to start fresh servers.');
}

stopAll().catch(console.error);
