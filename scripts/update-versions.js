#!/usr/bin/env node

/**
 * Version Management Script for ELEVATE Components
 * 
 * This script helps manage the versions.json file by adding new versions,
 * updating existing ones, or regenerating from GitHub API data.
 * 
 * Usage:
 *   node scripts/update-versions.js --add-version 0.0.29-alpha --date 2025-08-15
 *   node scripts/update-versions.js --sync-github
 *   node scripts/update-versions.js --list
 */

const fs = require('fs').promises;
const path = require('path');

class VersionManager {
  constructor() {
    this.versionsFile = './component-versions.json';
  }

  /**
   * Load existing versions from file
   */
  async loadVersions() {
    try {
      const data = await fs.readFile(this.versionsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.warn(`⚠️ Could not load ${this.versionsFile}: ${error.message}`);
      return { versions: [] };
    }
  }

  /**
   * Save versions back to file
   */
  async saveVersions(versionsData) {
    const formatted = JSON.stringify(versionsData, null, 2);
    await fs.writeFile(this.versionsFile, formatted, 'utf8');
    console.log(`✅ Updated ${this.versionsFile}`);
  }

  /**
   * Add a new version to the timeline
   */
  async addVersion(version, date, cutoffDate = null) {
    const versionsData = await this.loadVersions();
    
    // Calculate cutoff date if not provided
    if (!cutoffDate) {
      const releaseDate = new Date(date);
      cutoffDate = new Date(releaseDate);
      cutoffDate.setDate(cutoffDate.getDate() - 20); // 20 days before release
    }
    
    const newVersion = {
      version,
      date,
      cutoff: cutoffDate instanceof Date ? cutoffDate.toISOString().split('T')[0] : cutoffDate
    };
    
    // Check if version already exists
    const existingIndex = versionsData.versions.findIndex(v => v.version === version);
    if (existingIndex >= 0) {
      versionsData.versions[existingIndex] = newVersion;
      console.log(`📝 Updated existing version ${version}`);
    } else {
      versionsData.versions.unshift(newVersion); // Add to beginning (newest first)
      console.log(`➕ Added new version ${version}`);
    }
    
    // Sort versions (newest first)
    versionsData.versions.sort((a, b) => 
      b.version.localeCompare(a.version, undefined, { numeric: true })
    );
    
    await this.saveVersions(versionsData);
    return newVersion;
  }

  /**
   * List all current versions
   */
  async listVersions() {
    const versionsData = await this.loadVersions();
    
    console.log(`\n📋 Current versions in ${this.versionsFile}:\n`);
    console.log('Version'.padEnd(20) + 'Date'.padEnd(12) + 'Cutoff Date');
    console.log('-'.repeat(50));
    
    versionsData.versions.forEach(v => {
      console.log(
        v.version.padEnd(20) + 
        v.date.padEnd(12) + 
        v.cutoff
      );
    });
    
    console.log(`\n📊 Total versions: ${versionsData.versions.length}`);
    return versionsData.versions;
  }

  /**
   * Generate automatic cutoff dates based on release intervals
   */
  async regenerateCutoffs() {
    const versionsData = await this.loadVersions();
    
    console.log('🔄 Regenerating cutoff dates based on release intervals...');
    
    for (let i = 0; i < versionsData.versions.length; i++) {
      const current = versionsData.versions[i];
      const next = versionsData.versions[i + 1]; // Next older version
      
      if (next) {
        // Set cutoff to midpoint between this version and next older version
        const currentDate = new Date(current.date);
        const nextDate = new Date(next.date);
        const midpoint = new Date((currentDate.getTime() + nextDate.getTime()) / 2);
        current.cutoff = midpoint.toISOString().split('T')[0];
      } else {
        // For oldest version, use 30 days before release
        const releaseDate = new Date(current.date);
        releaseDate.setDate(releaseDate.getDate() - 30);
        current.cutoff = releaseDate.toISOString().split('T')[0];
      }
    }
    
    await this.saveVersions(versionsData);
    console.log('✅ Regenerated all cutoff dates');
  }

  /**
   * Remove a version from the timeline
   */
  async removeVersion(version) {
    const versionsData = await this.loadVersions();
    const initialCount = versionsData.versions.length;
    
    versionsData.versions = versionsData.versions.filter(v => v.version !== version);
    
    if (versionsData.versions.length < initialCount) {
      await this.saveVersions(versionsData);
      console.log(`🗑️ Removed version ${version}`);
    } else {
      console.log(`⚠️ Version ${version} not found`);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const manager = new VersionManager();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📦 ELEVATE Version Management Tool

Usage:
  node scripts/update-versions.js [command] [options]

Commands:
  --add-version <version>    Add a new version (use with --date)
  --remove-version <version> Remove a version from timeline
  --list                     List all current versions
  --regen-cutoffs           Regenerate cutoff dates based on intervals

Options:
  --date <YYYY-MM-DD>       Release date for new version
  --cutoff <YYYY-MM-DD>     Custom cutoff date (optional)
  --help, -h                Show this help

Examples:
  node scripts/update-versions.js --add-version 0.0.29-alpha --date 2025-08-15
  node scripts/update-versions.js --list
  node scripts/update-versions.js --regen-cutoffs
  node scripts/update-versions.js --remove-version 0.0.28-alpha
`);
    return;
  }

  try {
    if (args.includes('--add-version')) {
      const version = getArgValue(args, '--add-version');
      const date = getArgValue(args, '--date');
      const cutoff = getArgValue(args, '--cutoff');
      
      if (!version || !date) {
        console.error('❌ Please provide both --add-version and --date');
        console.error('   Example: --add-version 0.0.29-alpha --date 2025-08-15');
        process.exit(1);
      }
      
      await manager.addVersion(version, date, cutoff);
      
    } else if (args.includes('--remove-version')) {
      const version = getArgValue(args, '--remove-version');
      if (!version) {
        console.error('❌ Please provide version to remove');
        process.exit(1);
      }
      await manager.removeVersion(version);
      
    } else if (args.includes('--list')) {
      await manager.listVersions();
      
    } else if (args.includes('--regen-cutoffs')) {
      await manager.regenerateCutoffs();
      
    } else {
      console.error('❌ Please specify a command. Use --help for usage information.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = VersionManager;