const fs = require('fs');
const path = require('path');

// Define paths
const sourceDir = path.join(__dirname, '..', 'sample-data', 'component-changelogs');
const targetDir = path.join(__dirname, '..', 'static', 'component-changelogs');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Enhanced detection methods
function detectChangeType(title, fullLine) {
  const text = (title + ' ' + fullLine).toLowerCase();
  
  // Breaking change patterns
  if (/breaking[\s:]|break[\s:]|major[\s:]|remove[ds]?\s+(?:property|prop|attribute|method|function|api)/i.test(text)) {
    return 'breaking-change';
  }
  
  // Feature patterns  
  if (/^(?:add[s]?|new|implement[s]?|introduc[ed]?|creat[ed]?)\s/i.test(text)) {
    return 'feature';
  }
  
  // Bug fix patterns
  if (/^(?:fix[ed]?|resolv[ed]?|correct[ed]?|patch[ed]?)\s/i.test(text)) {
    return 'bug-fix';
  }
  
  // Performance patterns
  if (/optim[iz]?[ed]?|improv[ed]?\s+performance|faster|efficient/i.test(text)) {
    return 'improvement';
  }
  
  return 'improvement';
}

function detectBreakingChanges(title, fullLine) {
  const text = (title + ' ' + fullLine).toLowerCase();
  
  const breakingPatterns = [
    {
      pattern: /breaking[\s:]|break[\s:]|major[\s:]/i,
      reason: 'Explicitly marked as breaking change'
    },
    {
      pattern: /remove[ds]?\s+(?:property|prop|attribute|method|function|api)/i,
      reason: 'Removed API property or method'
    },
    {
      pattern: /chang[ed]?\s+(?:api|interface|signature|default\s+value)/i,
      reason: 'Changed API interface or method signature'
    },
    {
      pattern: /replac[ed]?\s+(?:with|by)(?!\s+(?:fix|bug|patch))/i,
      reason: 'Replaced existing functionality'
    },
    {
      pattern: /no\s+longer\s+support[s]?/i,
      reason: 'Removed support for feature'
    },
    {
      pattern: /deprecat[ed]?\s+(?:and\s+)?remove[ds]?/i,
      reason: 'Deprecated and removed feature'
    }
  ];
  
  for (const {pattern, reason} of breakingPatterns) {
    if (pattern.test(text)) {
      return { isBreaking: true, reason };
    }
  }
  
  return { isBreaking: false, reason: null };
}

function detectImpactType(title, fullLine) {
  const text = (title + ' ' + fullLine).toLowerCase();
  
  // API change patterns
  const apiChangePatterns = [
    {
      pattern: /(?:add[s]?|new)\s+(?:property|prop|attribute|method|function|api|parameter|param)/i,
      type: 'addition',
      impact: 'api'
    },
    {
      pattern: /(?:remove[ds]?|delet[ed]?)\s+(?:property|prop|attribute|method|function|api|parameter|param)/i,
      type: 'removal',
      impact: 'api'
    },
    {
      pattern: /(?:chang[ed]?|modif[iy][ed]?|updat[ed]?)\s+(?:property|prop|attribute|method|function|api|parameter|param|signature)/i,
      type: 'modification',
      impact: 'api'
    },
    {
      pattern: /(?:renam[ed]?)\s+(?:property|prop|attribute|method|function|parameter|param)/i,
      type: 'rename',
      impact: 'api'
    },
    {
      pattern: /(?:deprecat[ed]?)\s+(?:property|prop|attribute|method|function|api)/i,
      type: 'deprecation',
      impact: 'api'
    }
  ];
  
  // Check for API changes first
  for (const {pattern, type, impact} of apiChangePatterns) {
    if (pattern.test(text)) {
      return {
        impact,
        isApiChange: true,
        apiChangeType: type
      };
    }
  }
  
  // Visual/design patterns
  if (/(?:design|style|styling|theme|color|font|layout|spacing|visual|appearance|ui)/i.test(text)) {
    return { impact: 'visual', isApiChange: false, apiChangeType: null };
  }
  
  // Performance patterns
  if (/(?:performance|perf|optim[iz][ed]?|faster|slower|speed|cache|memory|efficient)/i.test(text)) {
    return { impact: 'performance', isApiChange: false, apiChangeType: null };
  }
  
  // Accessibility patterns
  if (/(?:accessibility|a11y|screen\s+reader|keyboard|focus|aria|wcag)/i.test(text)) {
    return { impact: 'functionality', isApiChange: false, apiChangeType: 'accessibility' };
  }
  
  // Developer experience patterns
  if (/(?:dx|developer\s+experience|typescript|types|documentation|docs)/i.test(text)) {
    return { impact: 'developer-experience', isApiChange: false, apiChangeType: null };
  }
  
  return { impact: 'functionality', isApiChange: false, apiChangeType: null };
}

// Function to parse changelog entries from text with enhanced detection
function parseChangelogEntriesEnhanced(text) {
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
    
    // Enhanced detection
    const changeType = detectChangeType(title, cleanLine);
    const breakingInfo = detectBreakingChanges(title, cleanLine);
    const impactInfo = detectImpactType(title, cleanLine);
    
    if (title && commit) {
      const entry = {
        type: breakingInfo.isBreaking ? 'breaking-change' : changeType,
        title: title,
        description: title,
        commit: commit,
        issueNumber: issueNumber,
        impact: impactInfo.impact,
        breakingChange: breakingInfo.isBreaking,
        apiChange: impactInfo.isApiChange,
        breakingReason: breakingInfo.reason,
        apiChangeType: impactInfo.apiChangeType
      };
      
      entries.push(entry);
      
      // Log detected changes for debugging
      if (breakingInfo.isBreaking) {
        console.log(`   🚨 Breaking change detected: "${title}" - ${breakingInfo.reason}`);
      }
      if (impactInfo.isApiChange) {
        console.log(`   🔧 API change detected: "${title}" - ${impactInfo.apiChangeType}`);
      }
    }
  }
  
  return entries;
}

// Function to create JSON structure for a component
function createChangelogJSONEnhanced(componentName, textContent) {
  const entries = parseChangelogEntriesEnhanced(textContent);
  
  // Group entries by version (we'll use a single version for now)
  const currentVersion = '0.0.28-alpha';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Count breaking changes and API changes for metadata
  const breakingChanges = entries.filter(e => e.breakingChange).length;
  const apiChanges = entries.filter(e => e.apiChange).length;
  const changeTypes = [...new Set(entries.map(e => e.type))];
  const impactTypes = [...new Set(entries.map(e => e.impact))];
  
  return {
    component: `elvt-${componentName}`,
    version: currentVersion,
    lastUpdated: new Date().toISOString(),
    changelog: [
      {
        version: currentVersion,
        date: currentDate,
        type: breakingChanges > 0 ? 'major' : entries.some(e => e.type === 'feature') ? 'minor' : 'patch',
        changes: entries,
        summary: {
          totalChanges: entries.length,
          breakingChanges: breakingChanges,
          apiChanges: apiChanges,
          changeTypes: changeTypes,
          impactTypes: impactTypes
        }
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
      lastCommit: entries.length > 0 ? entries[0].commit : '',
      enhancedDetection: true,
      detectionVersion: '2.0.0',
      totalBreakingChanges: breakingChanges,
      totalApiChanges: apiChanges,
      detectedChangeTypes: changeTypes,
      detectedImpactTypes: impactTypes
    }
  };
}

// Process all component info files
console.log('🔄 Converting changelog data with enhanced breaking changes and API detection...\n');

const processedComponents = [];
const detectionStats = {
  totalComponents: 0,
  totalChanges: 0,
  breakingChanges: 0,
  apiChanges: 0
};

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
      console.log(`\n📦 Processing: elvt-${componentName}`);
      const jsonData = createChangelogJSONEnhanced(componentName, textContent);
      
      // Only create JSON if there are actual entries
      if (jsonData.changelog[0].changes.length > 0) {
        const outputFile = path.join(targetDir, `elvt-${componentName}-changes.json`);
        fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
        
        const stats = jsonData.changelog[0].summary;
        console.log(`   ✅ Created: elvt-${componentName}-changes.json`);
        console.log(`   📊 ${stats.totalChanges} total changes, ${stats.breakingChanges} breaking, ${stats.apiChanges} API changes`);
        
        processedComponents.push(componentName);
        detectionStats.totalComponents++;
        detectionStats.totalChanges += stats.totalChanges;
        detectionStats.breakingChanges += stats.breakingChanges;
        detectionStats.apiChanges += stats.apiChanges;
      } else {
        console.log(`   ⚠️ Skipped: ${componentName} (no changelog entries found)`);
      }
    } else {
      console.log(`   ⚠️ Skipped: ${componentName} (no changelog section found)`);
    }
  }
}

console.log(`\n🎉 Enhanced processing complete! Results:`);
console.log(`📋 Components processed: ${detectionStats.totalComponents}`);
console.log(`📝 Total changes: ${detectionStats.totalChanges}`);
console.log(`🚨 Breaking changes detected: ${detectionStats.breakingChanges}`);
console.log(`🔧 API changes detected: ${detectionStats.apiChanges}`);

console.log(`\n📁 Enhanced changelog files saved to: ${targetDir}`);
console.log(`✅ ComponentChangelog component will now show detailed breaking changes and API metadata!`);

// Export functions for testing
module.exports = {
  detectChangeType,
  detectBreakingChanges, 
  detectImpactType,
  parseChangelogEntriesEnhanced,
  createChangelogJSONEnhanced
};