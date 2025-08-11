#!/usr/bin/env node

/**
 * Interactive ELEVATE Component Changelog CLI
 * 
 * A user-friendly command-line interface for generating component changelogs
 */

const readline = require('readline');
const ChangelogGenerator = require('./generate-changelog');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function interactiveCLI() {
  console.log(`
🎯 ELEVATE Component Changelog Generator
${'─'.repeat(50)}

Choose an option:
1. Generate changelog for a specific component
2. Generate changelogs for all components  
3. Update existing changelog
4. List available components
5. Exit
`);

  const choice = await question('Enter your choice (1-5): ');
  
  const generator = new ChangelogGenerator();
  await generator.initialize();
  
  switch (choice.trim()) {
    case '1':
      await generateSingleComponent(generator);
      break;
    case '2':
      await generateAllComponents(generator);
      break;
    case '3':
      await updateExistingChangelog(generator);
      break;
    case '4':
      await listComponents(generator);
      break;
    case '5':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid choice. Please try again.');
      await interactiveCLI();
      return;
  }
  
  const continueChoice = await question('\nWould you like to do something else? (y/n): ');
  if (continueChoice.toLowerCase().startsWith('y')) {
    await interactiveCLI();
  } else {
    console.log('👋 Goodbye!');
    rl.close();
  }
}

async function generateSingleComponent(generator) {
  console.log('\n📝 Generate Single Component Changelog');
  console.log('─'.repeat(40));
  
  const components = await generator.discoverComponents();
  console.log('\nAvailable components:');
  components.forEach((comp, index) => {
    console.log(`  ${index + 1}. ${comp}`);
  });
  
  const choice = await question('\nEnter component name or number: ');
  let componentName;
  
  if (/^\d+$/.test(choice.trim())) {
    const index = parseInt(choice.trim()) - 1;
    if (index >= 0 && index < components.length) {
      componentName = components[index];
    } else {
      console.log('❌ Invalid number');
      return;
    }
  } else {
    componentName = choice.trim();
  }
  
  if (!componentName) {
    console.log('❌ No component specified');
    return;
  }
  
  const version = await question(`Version (press Enter for auto): `);
  const includeOld = await question('Include older commits? (y/n): ');
  
  try {
    const options = {
      version: version || undefined,
      maxCommits: includeOld.toLowerCase().startsWith('y') ? 50 : 20
    };
    
    const changelogData = await generator.generateComponentChangelog(componentName, options);
    await generator.saveChangelog(componentName, changelogData);
    
    console.log(`\n✅ Successfully generated changelog for ${componentName}`);
    console.log(`   📊 ${changelogData.changelog[0]?.changes.length || 0} changes found`);
    console.log(`   📁 Saved to static/component-changelogs/${componentName}-changes.json`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function generateAllComponents(generator) {
  console.log('\n🚀 Generate All Component Changelogs');
  console.log('─'.repeat(40));
  
  const confirm = await question('This will generate/update changelogs for ALL components. Continue? (y/n): ');
  
  if (!confirm.toLowerCase().startsWith('y')) {
    console.log('Operation cancelled.');
    return;
  }
  
  const version = await question('Version for all components (press Enter for auto): ');
  
  try {
    const results = await generator.generateAll({
      version: version || undefined
    });
    
    const successful = results.filter(r => r.status === 'success');
    console.log(`\n🎉 Generated ${successful.length} changelogs successfully!`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function updateExistingChangelog(generator) {
  console.log('\n✏️ Update Existing Changelog');
  console.log('─'.repeat(40));
  
  // List existing changelog files
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const files = await fs.readdir('./static/component-changelogs');
    const changelogFiles = files.filter(f => f.endsWith('-changes.json'));
    
    if (changelogFiles.length === 0) {
      console.log('❌ No existing changelog files found.');
      return;
    }
    
    console.log('\nExisting changelogs:');
    changelogFiles.forEach((file, index) => {
      const componentName = file.replace('-changes.json', '');
      console.log(`  ${index + 1}. ${componentName}`);
    });
    
    const choice = await question('\nChoose component to update: ');
    let componentName;
    
    if (/^\d+$/.test(choice.trim())) {
      const index = parseInt(choice.trim()) - 1;
      if (index >= 0 && index < changelogFiles.length) {
        componentName = changelogFiles[index].replace('-changes.json', '');
      }
    } else {
      componentName = choice.trim();
    }
    
    if (!componentName) {
      console.log('❌ Invalid selection');
      return;
    }
    
    const version = await question('New version: ');
    if (!version) {
      console.log('❌ Version is required for updates');
      return;
    }
    
    const options = {
      version: version.trim(),
      update: true
    };
    
    const changelogData = await generator.generateComponentChangelog(componentName, options);
    await generator.saveChangelog(componentName, changelogData);
    
    console.log(`\n✅ Successfully updated changelog for ${componentName}`);
    console.log(`   📊 Version ${version} added with ${changelogData.changelog[0]?.changes.length || 0} changes`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function listComponents(generator) {
  console.log('\n📋 Available Components');
  console.log('─'.repeat(40));
  
  try {
    const components = await generator.discoverComponents();
    
    console.log(`Found ${components.length} components:\n`);
    
    components.forEach((component, index) => {
      console.log(`  ${(index + 1).toString().padStart(2)}. ${component}`);
    });
    
    // Show which ones have existing changelogs
    const fs = require('fs').promises;
    try {
      const files = await fs.readdir('./static/component-changelogs');
      const existing = files
        .filter(f => f.endsWith('-changes.json'))
        .map(f => f.replace('-changes.json', ''));
      
      if (existing.length > 0) {
        console.log(`\n📝 Components with existing changelogs (${existing.length}):`);
        existing.forEach(comp => console.log(`     ✅ ${comp}`));
      }
      
      const missing = components.filter(comp => !existing.includes(comp));
      if (missing.length > 0) {
        console.log(`\n❌ Components without changelogs (${missing.length}):`);
        missing.forEach(comp => console.log(`     📝 ${comp}`));
      }
      
    } catch (e) {
      console.log('\n⚠️ Could not check existing changelog files');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Handle CLI arguments for non-interactive mode
async function handleCLIArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // No arguments, run interactive mode
    return interactiveCLI();
  }
  
  // Non-interactive mode - pass to main generator
  const { spawn } = require('child_process');
  const child = spawn('node', ['scripts/generate-changelog.js', ...args], {
    stdio: 'inherit'
  });
  
  child.on('close', (code) => {
    process.exit(code);
  });
}

// Start the CLI
console.log('🚀 Starting ELEVATE Changelog Generator...\n');

handleCLIArgs().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});