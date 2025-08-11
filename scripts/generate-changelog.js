#!/usr/bin/env node

/**
 * ELEVATE Component Changelog Generator
 * 
 * Generates changelog JSON files for ELEVATE components by analyzing:
 * - Package.json versions and dependencies
 * - Git commit history and tags
 * - Component source files and metadata
 * - Existing changelog data for updates
 * 
 * Usage:
 *   node scripts/generate-changelog.js --component elvt-button
 *   node scripts/generate-changelog.js --all
 *   node scripts/generate-changelog.js --update elvt-input --version 0.0.29-alpha
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Configuration
const CONFIG = {
  // Paths
  changelogDir: './static/component-changelogs',
  packagePath: './package.json',
  
  // Git repository info
  repoUrl: 'https://github.com/inform-elevate/elevate-core-ui',
  
  // Component prefixes to search for
  componentPrefixes: ['elvt-', 'elevate-'],
  
  // Change type mappings from commit messages
  changeTypes: {
    'feat': 'feature',
    'fix': 'bug-fix', 
    'break': 'breaking-change',
    'perf': 'improvement',
    'refactor': 'improvement',
    'docs': 'improvement',
    'style': 'improvement',
    'test': 'improvement',
    'chore': 'improvement'
  },
  
  // Impact type mappings
  impactTypes: {
    'api': 'api',
    'visual': 'visual', 
    'ui': 'visual',
    'design': 'design',
    'perf': 'performance',
    'performance': 'performance',
    'a11y': 'functionality',
    'accessibility': 'functionality',
    'dx': 'developer-experience',
    'dev': 'developer-experience'
  }
};

// Known ELEVATE components (can be auto-discovered too)
const KNOWN_COMPONENTS = [
  'elvt-button',
  'elvt-input', 
  'elvt-card',
  'elvt-modal',
  'elvt-dialog',
  'elvt-avatar',
  'elvt-badge',
  'elvt-breadcrumb',
  'elvt-checkbox',
  'elvt-dropdown',
  'elvt-icon',
  'elvt-menu',
  'elvt-progress',
  'elvt-radio',
  'elvt-select',
  'elvt-switch',
  'elvt-table',
  'elvt-tabs',
  'elvt-textarea',
  'elvt-tooltip',
  'elvt-alert',
  'elvt-banner',
  'elvt-chip',
  'elvt-divider',
  'elvt-drawer',
  'elvt-loading',
  'elvt-pagination',
  'elvt-skeleton',
  'elvt-stepper',
  'elvt-tag',
  'elvt-toast'
];

class ChangelogGenerator {
  constructor() {
    this.packageInfo = null;
    this.gitInfo = null;
  }

  /**
   * Initialize the generator with package and git information
   */
  async initialize() {
    try {
      // Load package.json
      const packageData = await fs.readFile(CONFIG.packagePath, 'utf8');
      this.packageInfo = JSON.parse(packageData);
      
      // Get git information
      this.gitInfo = await this.getGitInfo();
      
      console.log(`📦 Loaded package: ${this.packageInfo.name} v${this.packageInfo.version}`);
      console.log(`📂 Repository: ${this.gitInfo.remoteUrl || 'local'}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      throw error;
    }
  }

  /**
   * Get git repository information
   */
  async getGitInfo() {
    try {
      const { stdout: remoteUrl } = await exec('git remote get-url origin').catch(() => ({ stdout: '' }));
      const { stdout: branch } = await exec('git branch --show-current').catch(() => ({ stdout: 'main' }));
      const { stdout: lastCommit } = await exec('git rev-parse HEAD').catch(() => ({ stdout: '' }));
      
      return {
        remoteUrl: remoteUrl.trim(),
        branch: branch.trim(),
        lastCommit: lastCommit.trim()
      };
    } catch (error) {
      console.warn('⚠️ Could not get git info:', error.message);
      return {
        remoteUrl: CONFIG.repoUrl,
        branch: 'main', 
        lastCommit: ''
      };
    }
  }

  /**
   * Discover available components from various sources
   */
  async discoverComponents() {
    const components = new Set(KNOWN_COMPONENTS);
    
    try {
      // Look for component info files
      const sampleDataPath = './sample-data/component-infos';
      try {
        const infoFiles = await fs.readdir(sampleDataPath);
        infoFiles
          .filter(file => file.endsWith('.md'))
          .forEach(file => {
            const componentName = file.replace('.md', '');
            if (componentName.startsWith('elvt-')) {
              components.add(componentName);
            }
          });
      } catch (e) {
        // sample-data directory might not exist
      }
      
      // Look for existing changelog files
      try {
        const changelogFiles = await fs.readdir(CONFIG.changelogDir);
        changelogFiles
          .filter(file => file.endsWith('-changes.json'))
          .forEach(file => {
            const componentName = file.replace('-changes.json', '');
            components.add(componentName);
          });
      } catch (e) {
        // changelog directory might not exist
      }
      
      console.log(`🔍 Discovered ${components.size} components`);
      return Array.from(components).sort();
      
    } catch (error) {
      console.warn('⚠️ Error discovering components:', error.message);
      return KNOWN_COMPONENTS;
    }
  }

  /**
   * Generate commit history for a component
   */
  async getComponentCommits(componentName, sinceVersion = null) {
    try {
      let gitCommand = `git log --oneline --grep="${componentName}" --grep="button" --grep="input" --grep="modal" -i`;
      
      if (sinceVersion) {
        gitCommand += ` ${sinceVersion}..HEAD`;
      } else {
        gitCommand += ' --max-count=20'; // Limit to recent commits
      }
      
      const { stdout } = await exec(gitCommand).catch(() => ({ stdout: '' }));
      const commits = stdout.trim().split('\n').filter(line => line.trim());
      
      return commits.map(line => {
        const [hash, ...messageParts] = line.split(' ');
        const message = messageParts.join(' ');
        return {
          hash: hash,
          message: message,
          shortHash: hash.substring(0, 7)
        };
      });
      
    } catch (error) {
      console.warn(`⚠️ Could not get commits for ${componentName}:`, error.message);
      return [];
    }
  }

  /**
   * Parse commit message to extract change information
   */
  parseCommitMessage(commit, componentName) {
    const message = commit.message.toLowerCase();
    const originalMessage = commit.message;
    
    // Extract change type
    let changeType = 'improvement';
    for (const [pattern, type] of Object.entries(CONFIG.changeTypes)) {
      if (message.includes(pattern) || message.startsWith(pattern + ':') || message.startsWith(pattern + '(')) {
        changeType = type;
        break;
      }
    }
    
    // Check for breaking changes
    const isBreaking = message.includes('breaking') || 
                      message.includes('break:') || 
                      message.includes('!:') ||
                      message.includes('major:');
    
    if (isBreaking) {
      changeType = 'breaking-change';
    }
    
    // Extract impact type
    let impact = 'functionality';
    for (const [pattern, impactType] of Object.entries(CONFIG.impactTypes)) {
      if (message.includes(pattern)) {
        impact = impactType;
        break;
      }
    }
    
    // Extract issue number
    const issueMatch = originalMessage.match(/#(\d+)/);
    const issueNumber = issueMatch ? parseInt(issueMatch[1]) : undefined;
    
    // Generate title and description
    const title = this.generateTitle(originalMessage, componentName);
    const description = this.generateDescription(originalMessage, changeType);
    
    return {
      type: changeType,
      title,
      description,
      commit: commit.hash,
      issueNumber,
      impact,
      breakingChange: isBreaking
    };
  }

  /**
   * Generate a clean title from commit message
   */
  generateTitle(message, componentName) {
    // Clean up common prefixes
    let title = message
      .replace(/^(feat|fix|perf|refactor|docs|style|test|chore)(\([^)]+\))?:\s*/i, '')
      .replace(/^(break|breaking):\s*/i, '')
      .replace(/^\w+\s*\(\w+\):\s*/, ''); // Remove scoped prefixes
    
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    // Ensure component name is properly capitalized
    const componentDisplay = componentName.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
    
    title = title.replace(new RegExp(componentName, 'gi'), componentDisplay);
    
    return title;
  }

  /**
   * Generate description from commit message
   */
  generateDescription(message, changeType) {
    const actionWords = {
      'feature': ['Added', 'Implemented', 'Introduced'],
      'bug-fix': ['Fixed', 'Resolved', 'Corrected'],
      'breaking-change': ['Updated', 'Changed', 'Refactored'],
      'improvement': ['Improved', 'Enhanced', 'Optimized'],
      'deprecation': ['Deprecated', 'Marked for removal']
    };
    
    const actions = actionWords[changeType] || actionWords.improvement;
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // Create a more descriptive description
    let description = message
      .replace(/^(feat|fix|perf|refactor|docs|style|test|chore)(\([^)]+\))?:\s*/i, '')
      .replace(/^(break|breaking):\s*/i, '');
    
    if (!description.toLowerCase().startsWith(action.toLowerCase())) {
      description = `${action} ${description.toLowerCase()}`;
    }
    
    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  /**
   * Load existing changelog data
   */
  async loadExistingChangelog(componentName) {
    const changelogPath = path.join(CONFIG.changelogDir, `${componentName}-changes.json`);
    
    try {
      const data = await fs.readFile(changelogPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null; // No existing changelog
    }
  }

  /**
   * Generate changelog structure for a component
   */
  async generateComponentChangelog(componentName, options = {}) {
    console.log(`\n📝 Generating changelog for ${componentName}...`);
    
    const existing = await this.loadExistingChangelog(componentName);
    const commits = await this.getComponentCommits(componentName, options.sinceVersion);
    
    // Parse commits into changes
    const changes = commits
      .map(commit => this.parseCommitMessage(commit, componentName))
      .filter(change => change.title && change.title.length > 10); // Filter out trivial commits
    
    console.log(`   📋 Found ${changes.length} changes from ${commits.length} commits`);
    
    const currentVersion = options.version || this.packageInfo.version;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Determine version type
    const versionType = this.determineVersionType(changes);
    
    // Create new version entry
    const newVersionEntry = {
      version: currentVersion,
      date: currentDate,
      type: versionType,
      changes: changes
    };
    
    // Create or update changelog data
    const changelogData = existing || {
      component: componentName,
      version: currentVersion,
      lastUpdated: new Date().toISOString(),
      changelog: [],
      deprecations: [],
      upcomingChanges: [],
      metadata: {
        totalVersions: 0,
        firstVersion: currentVersion,
        storyCount: 0,
        testCount: 0,
        fileCount: 0,
        lastCommit: this.gitInfo.lastCommit
      }
    };
    
    // Update with new data
    if (options.update && existing) {
      // Update existing entry or add new one
      const existingEntryIndex = changelogData.changelog.findIndex(entry => entry.version === currentVersion);
      if (existingEntryIndex >= 0) {
        changelogData.changelog[existingEntryIndex] = newVersionEntry;
        console.log(`   ✏️ Updated existing version ${currentVersion}`);
      } else {
        changelogData.changelog.unshift(newVersionEntry);
        console.log(`   ➕ Added new version ${currentVersion}`);
      }
    } else {
      // Fresh changelog
      changelogData.changelog = [newVersionEntry];
    }
    
    // Update metadata
    changelogData.version = currentVersion;
    changelogData.lastUpdated = new Date().toISOString();
    changelogData.metadata.totalVersions = changelogData.changelog.length;
    changelogData.metadata.lastCommit = this.gitInfo.lastCommit;
    
    return changelogData;
  }

  /**
   * Determine version type based on changes
   */
  determineVersionType(changes) {
    const hasBreaking = changes.some(change => change.breakingChange);
    const hasFeatures = changes.some(change => change.type === 'feature');
    
    if (hasBreaking) return 'major';
    if (hasFeatures) return 'minor';
    return 'patch';
  }

  /**
   * Save changelog to file
   */
  async saveChangelog(componentName, changelogData) {
    // Ensure directory exists
    await fs.mkdir(CONFIG.changelogDir, { recursive: true });
    
    const changelogPath = path.join(CONFIG.changelogDir, `${componentName}-changes.json`);
    const jsonData = JSON.stringify(changelogData, null, 2);
    
    await fs.writeFile(changelogPath, jsonData, 'utf8');
    console.log(`   ✅ Saved to ${changelogPath}`);
  }

  /**
   * Generate changelogs for all components
   */
  async generateAll(options = {}) {
    const components = await this.discoverComponents();
    console.log(`\n🚀 Generating changelogs for ${components.length} components...\n`);
    
    const results = [];
    
    for (const componentName of components) {
      try {
        const changelogData = await this.generateComponentChangelog(componentName, options);
        await this.saveChangelog(componentName, changelogData);
        
        results.push({
          component: componentName,
          status: 'success',
          versions: changelogData.changelog.length,
          changes: changelogData.changelog[0]?.changes.length || 0
        });
        
      } catch (error) {
        console.error(`❌ Failed to generate changelog for ${componentName}:`, error.message);
        results.push({
          component: componentName,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Summary report
    console.log('\n📊 Generation Summary:');
    console.log('─'.repeat(50));
    
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\nGenerated changelogs:');
      successful.forEach(result => {
        console.log(`   ${result.component}: ${result.versions} versions, ${result.changes} changes`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\nFailed components:');
      failed.forEach(result => {
        console.log(`   ${result.component}: ${result.error}`);
      });
    }
    
    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const generator = new ChangelogGenerator();
  
  try {
    await generator.initialize();
    
    if (args.includes('--help') || args.includes('-h')) {
      showHelp();
      return;
    }
    
    if (args.includes('--all')) {
      await generator.generateAll({
        version: getArgValue(args, '--version'),
        update: args.includes('--update')
      });
    } else {
      const component = getArgValue(args, '--component') || getArgValue(args, '-c');
      if (!component) {
        console.error('❌ Please specify a component with --component or use --all');
        showHelp();
        process.exit(1);
      }
      
      const options = {
        version: getArgValue(args, '--version'),
        update: args.includes('--update'),
        sinceVersion: getArgValue(args, '--since')
      };
      
      const changelogData = await generator.generateComponentChangelog(component, options);
      await generator.saveChangelog(component, changelogData);
    }
    
    console.log('\n🎉 Changelog generation completed!');
    
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  }
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
}

function showHelp() {
  console.log(`
📝 ELEVATE Component Changelog Generator

Usage:
  node scripts/generate-changelog.js [options]

Options:
  --component, -c <name>    Generate changelog for specific component
  --all                     Generate changelogs for all components
  --version <version>       Override version number
  --update                  Update existing changelog
  --since <version>         Only include commits since version
  --help, -h               Show this help message

Examples:
  # Generate changelog for elvt-button
  node scripts/generate-changelog.js --component elvt-button

  # Generate for all components
  node scripts/generate-changelog.js --all

  # Update elvt-input with specific version
  node scripts/generate-changelog.js --component elvt-input --version 0.0.29-alpha --update

  # Generate since last version
  node scripts/generate-changelog.js --component elvt-button --since v0.0.27-alpha

Generated files are saved to: ${CONFIG.changelogDir}/
`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ChangelogGenerator;