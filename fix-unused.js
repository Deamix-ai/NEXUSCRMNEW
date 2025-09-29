#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixUnusedImports(content, filePath) {
  // Remove unused imports based on common patterns
  const lines = content.split('\n');
  const importLines = [];
  const otherLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      importLines.push({ line: lines[i], index: i });
    } else {
      otherLines.push(lines[i]);
    }
  }
  
  const contentWithoutImports = otherLines.join('\n');
  const usedImports = [];
  
  for (const importInfo of importLines) {
    const line = importInfo.line;
    
    // Extract imported names
    const match = line.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from/);
    if (match) {
      let isUsed = false;
      
      if (match[1]) {
        // Named imports: import { Component1, Component2 } from 'module'
        const namedImports = match[1].split(',').map(s => s.trim().split(/\s+as\s+/).pop());
        const usedNamedImports = namedImports.filter(name => {
          const cleanName = name.trim();
          // Check if the imported name is used in the file
          return contentWithoutImports.includes(cleanName) || 
                 contentWithoutImports.includes(`<${cleanName}`) ||
                 contentWithoutImports.includes(`${cleanName}(`);
        });
        
        if (usedNamedImports.length > 0) {
          if (usedNamedImports.length === namedImports.length) {
            usedImports.push(line);
          } else {
            // Reconstruct import with only used imports
            const fromPart = line.substring(line.indexOf(' from '));
            const newLine = `import { ${usedNamedImports.join(', ')} }${fromPart}`;
            usedImports.push(newLine);
          }
        }
      } else if (match[2]) {
        // Namespace import: import * as name from 'module'
        const name = match[2];
        if (contentWithoutImports.includes(name)) {
          usedImports.push(line);
        }
      } else if (match[3]) {
        // Default import: import Component from 'module'
        const name = match[3];
        if (contentWithoutImports.includes(name) || 
            contentWithoutImports.includes(`<${name}`) ||
            contentWithoutImports.includes(`${name}(`)) {
          usedImports.push(line);
        }
      }
    } else {
      // Keep side-effect imports and imports we can't parse
      usedImports.push(line);
    }
  }
  
  // Reconstruct file
  const result = usedImports.concat([''], otherLines).join('\n');
  return result;
}

function fixUnusedVariables(content) {
  // Add underscore prefix to unused variables in common patterns
  content = content.replace(
    /const\s+(\w+)\s*=\s*[^;]+;\s*$/gm,
    (match, varName) => {
      // Don't modify if already prefixed or if it's clearly used later
      if (varName.startsWith('_') || content.indexOf(varName, content.indexOf(match) + match.length) > -1) {
        return match;
      }
      return match.replace(varName, `_${varName}`);
    }
  );
  
  return content;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    const originalContent = content;
    
    // Fix unused imports
    content = fixUnusedImports(content, filePath);
    
    // Only write if modified
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports: ${filePath}`);
      modified = true;
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

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
  console.log('Processing unused imports...');
  walkDir(srcDir);
  console.log('Done!');
} else {
  console.log('No src directory found');
}