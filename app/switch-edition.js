#!/usr/bin/env node

/*
 * Development utility to switch between CE and SE versions
 * Usage: node switch-edition.js [ce|se]
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'services', 'BibiscoPropertiesService.js');

function switchEdition(edition) {
  if (!['ce', 'se'].includes(edition.toLowerCase())) {
    console.error('Error: Edition must be "ce" or "se"');
    process.exit(1);
  }

  const targetVersion = edition.toLowerCase() === 'se' ? '4.0.0-SE' : '4.0.0-CE';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the version line
    content = content.replace(
      /const version = '4\.0\.0-(CE|SE)';/,
      `const version = '${targetVersion}';`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ Successfully switched to ${edition.toUpperCase()} edition`);
    console.log(`   Version is now: ${targetVersion}`);
    console.log('   Restart the application to see changes.');
    
  } catch (error) {
    console.error('Error switching edition:', error.message);
    process.exit(1);
  }
}

const edition = process.argv[2];

if (!edition) {
  console.log('Usage: node switch-edition.js [ce|se]');
  console.log('');
  console.log('Examples:');
  console.log('  node switch-edition.js se   # Switch to Supporters Edition');
  console.log('  node switch-edition.js ce   # Switch to Community Edition');
  process.exit(1);
}

switchEdition(edition);
