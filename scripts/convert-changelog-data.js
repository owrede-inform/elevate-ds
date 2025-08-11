const fs = require('fs');
const path = require('path');

// Define paths
const sourceDir = path.join(__dirname, '..', 'sample-data', 'component-changelogs');
const targetDir = path.join(__dirname, '..', 'static', 'component-changelogs');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to parse changelog entries from text
function parseChangelogEntries(text) {
  const changelogSection = text.split('=== CHANGELOG ENTRIES ===')[1];
  if (!changelogSection) return [];
  
  const entries = [];
  const lines = changelogSection.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-'));
  
  for (const line of lines) {
    const cleanLine = line.trim().replace(/^[\*\-]\s*/, '');
    
    // Parse commit hash
    const commitMatch = cleanLine.match(/\[([a-f0-9]{7,})\]/);
    const commit = commitMatch ? commitMatch[1] : '';
    
    // Parse issue number
    const issueMatch = cleanLine.match(/\[#(\d+)\]/);
    const issueNumber = issueMatch ? parseInt(issueMatch[1]) : undefined;
    
    // Extract title (remove commit hash and issue references)
    let title = cleanLine
      .replace(/\s*\([a-f0-9]{7,}\)$/, '')
      .replace(/\s*\[[a-f0-9]{7,}\].*$/, '')
      .replace(/\s*\(#\d+\)/, '')
      .replace(/\s*\[#\d+\].*$/, '')
      .trim();
    
    // Determine change type based on title
    let changeType = 'improvement';
    if (title.toLowerCase().startsWith('add ') || title.toLowerCase().startsWith('new ')) {
      changeType = 'feature';
    } else if (title.toLowerCase().startsWith('fix ') || title.toLowerCase().includes('fix ')) {
      changeType = 'bug-fix';
    } else if (title.toLowerCase().includes('breaking') || title.toLowerCase().includes('remove ')) {
      changeType = 'breaking-change';
    }
    
    // Determine impact based on content
    let impact = 'functionality';
    if (title.toLowerCase().includes('design') || title.toLowerCase().includes('style') || title.toLowerCase().includes('color')) {
      impact = 'visual';
    } else if (title.toLowerCase().includes('api') || title.toLowerCase().includes('property') || title.toLowerCase().includes('method')) {
      impact = 'api';
    } else if (title.toLowerCase().includes('performance') || title.toLowerCase().includes('optimize')) {
      impact = 'performance';
    }
    
    if (title && commit) {
      entries.push({
        type: changeType,
        title: title,
        description: title, // Use title as description for now
        commit: commit,
        issueNumber: issueNumber,
        impact: impact,
        breakingChange: changeType === 'breaking-change'
      });
    }
  }
  
  return entries;
}

// Function to create JSON structure for a component
function createChangelogJSON(componentName, textContent) {
  const entries = parseChangelogEntries(textContent);
  
  // Group entries by version (we'll use a single version for now)
  const currentVersion = '0.0.28-alpha';
  const currentDate = new Date().toISOString().split('T')[0];
  
  return {
    component: `elvt-${componentName}`,
    version: currentVersion,
    lastUpdated: new Date().toISOString(),
    changelog: [
      {
        version: currentVersion,
        date: currentDate,
        type: 'minor',
        changes: entries
      }
    ],
    deprecations: [],
    upcomingChanges: [],
    metadata: {
      totalVersions: 1,
      firstVersion: currentVersion,
      storyCount: 0,
      testCount: 0,
      fileCount: 0,
      lastCommit: entries.length > 0 ? entries[0].commit : ''
    }
  };
}

// Process all component info files
console.log('🔄 Converting changelog data from .txt to JSON format...\n');

const processedComponents = [];
const files = fs.readdirSync(sourceDir);

for (const file of files) {
  // Process only component info files (not global files)
  if (file.endsWith('-info.txt') && !file.startsWith('global') && !file.startsWith('extraction')) {
    const componentName = file.replace('-info.txt', '');
    
    // Skip components that are not standard ELEVATE components
    const skipComponents = ['repository-metadata', 'components-list', 'mutation-observer', 'resize-observer', 'visually-hidden', 'stack', 'tab-panel', 'table-cell', 'table-column', 'table-row', 'radio-group'];
    if (skipComponents.includes(componentName)) {
      continue;
    }
    
    const filePath = path.join(sourceDir, file);
    const textContent = fs.readFileSync(filePath, 'utf8');
    
    // Check if there are actual changelog entries
    if (textContent.includes('=== CHANGELOG ENTRIES ===')) {
      const jsonData = createChangelogJSON(componentName, textContent);
      
      // Only create JSON if there are actual entries
      if (jsonData.changelog[0].changes.length > 0) {
        const outputFile = path.join(targetDir, `elvt-${componentName}-changes.json`);
        fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
        
        console.log(`✅ Created: elvt-${componentName}-changes.json (${jsonData.changelog[0].changes.length} entries)`);
        processedComponents.push(componentName);
      } else {
        console.log(`⚠️ Skipped: ${componentName} (no changelog entries found)`);
      }
    } else {
      console.log(`⚠️ Skipped: ${componentName} (no changelog section found)`);
    }
  }
}

console.log(`\n🎉 Processing complete! Created ${processedComponents.length} changelog JSON files:`);
processedComponents.forEach(component => {
  console.log(`   - elvt-${component}-changes.json`);
});

console.log(`\n📁 Files saved to: ${targetDir}`);
console.log(`\n✅ ComponentChangelog component should now display changelog data for these components!`);