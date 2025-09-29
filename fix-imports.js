#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to process TypeScript/TSX files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add React import if file has JSX and doesn't import React
    if (filePath.endsWith('.tsx') && 
        content.includes('<') && 
        !content.includes('import React') && 
        !content.includes("'use client'")) {
      content = "import React from 'react';\n" + content;
      modified = true;
    }

    // Add React import for 'use client' files
    if (filePath.endsWith('.tsx') && 
        content.includes("'use client'") && 
        content.includes('<') && 
        !content.includes('import React')) {
      const lines = content.split('\n');
      const useClientIndex = lines.findIndex(line => line.includes("'use client'"));
      if (useClientIndex !== -1) {
        lines.splice(useClientIndex + 1, 0, '');
        lines.splice(useClientIndex + 2, 0, "import React from 'react';");
        content = lines.join('\n');
        modified = true;
      }
    }

    // Remove console.log statements (except console.error)
    content = content.replace(/^\s*console\.log\(.*?\);?\s*$/gm, '');
    if (content.includes('console.log')) {
      modified = true;
    }

    // Fix common unused variables by prefixing with underscore
    const unusedVarPatterns = [
      /const\s+(\w+)\s*=.*useRouter\(\);/g,
      /const\s+(\w+)\s*=.*useState\(/g,
    ];

    // Only write if modified
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to walk through directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

// Start processing from src directory
const srcDir = path.join(process.cwd(), 'src');
if (fs.existsSync(srcDir)) {
  console.log('Processing TypeScript files...');
  walkDir(srcDir);
  console.log('Done!');
} else {
  console.log('No src directory found');
}