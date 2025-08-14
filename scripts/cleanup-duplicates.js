#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Cleanup Script for ComponentShowcase Extraction Issues
 * 
 * This script fixes duplicate content issues in extracted HTML files.
 */

const COMPONENTS_DIR = './docs/components';
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose') || DRY_RUN;

console.log('🧹 ELEVATE ComponentShowcase Cleanup Tool');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no files will be modified)' : 'LIVE (files will be modified)'}`);
console.log('=' .repeat(60));

let stats = {
  filesProcessed: 0,
  filesFixed: 0,
  filesBroken: 0,
  duplicatesRemoved: 0
};

/**
 * Clean up malformed HTML content
 */
function cleanupHTMLContent(content, filename) {
  let cleaned = content;
  let wasModified = false;
  
  // Remove malformed fragments like `</elvt-button-group>`}>`
  const malformedRegex = /[<>}]+`+}?\s*>/g;
  if (malformedRegex.test(cleaned)) {
    cleaned = cleaned.replace(malformedRegex, '');
    wasModified = true;
    if (VERBOSE) {
      console.log(`    - Removed malformed fragments`);
    }
  }
  
  // Look for patterns that suggest content was duplicated during extraction
  const lines = cleaned.split('\n');
  const trimmedLines = lines.map(line => line.trim()).filter(line => line.length > 0);
  
  // Find the main component wrapper (like <elvt-button-group>, <elvt-stack>, etc.)
  let wrapperTag = null;
  let wrapperStartIndex = -1;
  
  for (let i = 0; i < trimmedLines.length; i++) {
    const line = trimmedLines[i];
    const tagMatch = line.match(/^<(elvt-\w+[^>]*?)>/);
    if (tagMatch) {
      wrapperTag = tagMatch[1].split(' ')[0]; // Get just the tag name
      wrapperStartIndex = i;
      break;
    }
  }
  
  if (wrapperTag) {
    // Look for duplicate wrapper tags
    const duplicateWrapperRegex = new RegExp(`<${wrapperTag}[^>]*>`, 'g');
    const wrapperMatches = cleaned.match(duplicateWrapperRegex) || [];
    
    if (wrapperMatches.length > 1) {
      // Find the first complete valid block
      const firstWrapperIndex = cleaned.indexOf(wrapperMatches[0]);
      const firstClosingTag = `</${wrapperTag}>`;
      const firstClosingIndex = cleaned.indexOf(firstClosingTag, firstWrapperIndex);
      
      if (firstClosingIndex !== -1) {
        // Extract just the first complete block
        const validBlock = cleaned.substring(firstWrapperIndex, firstClosingIndex + firstClosingTag.length);
        cleaned = validBlock;
        wasModified = true;
        stats.duplicatesRemoved++;
        
        if (VERBOSE) {
          console.log(`    - Extracted first valid <${wrapperTag}> block`);
        }
      }
    }
  }
  
  // Clean up whitespace
  cleaned = cleaned
    .replace(/^\s+/gm, match => match.replace(/\t/g, '  ')) // Convert tabs to spaces
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
    
  return { content: cleaned, wasModified };
}

/**
 * Process a single HTML file
 */
function processHTMLFile(filePath) {
  const relativePath = path.relative('.', filePath);
  const filename = path.basename(filePath);
  
  if (VERBOSE) {
    console.log(`\n  📄 Processing: ${filename}`);
  }
  
  stats.filesProcessed++;
  
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    if (!originalContent.trim()) {
      console.log(`    ⚠️  Empty file: ${filename}`);
      return;
    }
    
    const { content: cleanedContent, wasModified } = cleanupHTMLContent(originalContent, filename);
    
    // Validate that we have reasonable content
    if (!cleanedContent.trim()) {
      console.log(`    ❌ Cleanup resulted in empty content: ${filename}`);
      stats.filesBroken++;
      return;
    }
    
    // Check if the cleaned content looks valid (should start with a tag)
    if (!cleanedContent.trim().startsWith('<')) {
      console.log(`    ❌ Cleanup resulted in invalid HTML: ${filename}`);
      stats.filesBroken++;
      return;
    }
    
    if (wasModified) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
      }
      stats.filesFixed++;
      
      if (VERBOSE) {
        console.log(`    ✅ Fixed content issues`);
      }
    } else {
      if (VERBOSE) {
        console.log(`    ✅ No issues found`);
      }
    }
    
  } catch (error) {
    console.log(`    ❌ Error processing ${filename}: ${error.message}`);
    stats.filesBroken++;
  }
}

/**
 * Find and process all HTML files in component directories
 */
function findAndProcessHTMLFiles() {
  const pattern = path.join(COMPONENTS_DIR, '**', '*.html');
  const htmlFiles = glob.sync(pattern, { absolute: true });
  
  if (htmlFiles.length === 0) {
    console.log('ℹ️  No HTML files found to process');
    return;
  }
  
  console.log(`📁 Found ${htmlFiles.length} HTML files to process\n`);
  
  // Group files by component directory for better organization
  const filesByComponent = {};
  htmlFiles.forEach(file => {
    const componentDir = path.basename(path.dirname(file));
    if (!filesByComponent[componentDir]) {
      filesByComponent[componentDir] = [];
    }
    filesByComponent[componentDir].push(file);
  });
  
  // Process each component's files
  Object.keys(filesByComponent).sort().forEach(component => {
    console.log(`\n📦 Component: ${component}`);
    filesByComponent[component].forEach(file => {
      processHTMLFile(file);
    });
  });
}

/**
 * Main cleanup function
 */
async function main() {
  try {
    if (!fs.existsSync(COMPONENTS_DIR)) {
      console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
      process.exit(1);
    }
    
    findAndProcessHTMLFiles();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 CLEANUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files fixed: ${stats.filesFixed}`);
    console.log(`Files broken: ${stats.filesBroken}`);
    console.log(`Duplicates removed: ${stats.duplicatesRemoved}`);
    
    if (DRY_RUN) {
      console.log('\n🔍 This was a DRY RUN - no files were actually modified');
      console.log('Run without --dry-run to execute the changes');
    } else if (stats.filesBroken === 0) {
      console.log('\n✅ All cleanup operations completed successfully!');
    } else {
      console.log(`\n⚠️  Completed with ${stats.filesBroken} files that need manual review`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run cleanup
if (require.main === module) {
  main();
}

module.exports = { cleanupHTMLContent, processHTMLFile };