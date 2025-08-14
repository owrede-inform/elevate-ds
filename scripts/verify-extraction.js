#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Verification Script for ComponentShowcase Extraction
 * 
 * This script verifies that all ComponentShowcase blocks have been properly
 * extracted and references updated.
 */

const DOCS_ROOT = './docs';
const COMPONENTS_DIR = path.join(DOCS_ROOT, 'components');

console.log('🔍 ELEVATE ComponentShowcase Extraction Verification');
console.log('=' .repeat(60));

let stats = {
  filesChecked: 0,
  showcasesWithCode: 0,
  showcasesWithoutCode: 0,
  brokenReferences: 0,
  duplicateContent: 0,
  warnings: 0
};

/**
 * Check if an HTML file exists and is readable
 */
function checkHTMLFile(htmlPath, componentDir, filename) {
  const fullPath = path.join(componentDir, filename);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ Missing HTML file: ${filename}`);
    stats.brokenReferences++;
    return false;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for empty files
    if (!content.trim()) {
      console.log(`  ⚠️  Empty HTML file: ${filename}`);
      stats.warnings++;
      return false;
    }
    
    // Check for potential duplication issues (content that looks like it has duplicated code)
    const lines = content.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim());
    const uniqueLines = [...new Set(nonEmptyLines.map(line => line.trim()))];
    
    if (nonEmptyLines.length > uniqueLines.length * 1.5) {
      console.log(`  ⚠️  Potential duplicate content in: ${filename}`);
      stats.duplicateContent++;
    }
    
    return true;
  } catch (error) {
    console.log(`  ❌ Error reading HTML file ${filename}: ${error.message}`);
    stats.brokenReferences++;
    return false;
  }
}

/**
 * Verify ComponentShowcase blocks in an MDX file
 */
function verifyMDXFile(filePath) {
  const relativePath = path.relative('.', filePath);
  console.log(`\n📄 Checking: ${relativePath}`);
  
  stats.filesChecked++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const componentDir = path.dirname(filePath);
    
    // Find all ComponentShowcase blocks
    const showcaseRegex = /<ComponentShowcase[^>]*>/g;
    let match;
    let showcaseCount = 0;
    
    while ((match = showcaseRegex.exec(content)) !== null) {
      showcaseCount++;
      const showcaseBlock = match[0];
      
      // Extract code attribute
      const codeMatch = showcaseBlock.match(/code=["']([^"']+)["']/);
      const titleMatch = showcaseBlock.match(/title=["']([^"']+)["']/);
      
      const title = titleMatch ? titleMatch[1] : `Showcase ${showcaseCount}`;
      
      if (codeMatch) {
        const filename = codeMatch[1];
        console.log(`  ✅ "${title}" → ${filename}`);
        
        if (filename.endsWith('.html')) {
          checkHTMLFile(filePath, componentDir, filename);
          stats.showcasesWithCode++;
        } else {
          console.log(`  ℹ️  Non-HTML code reference: ${filename}`);
          stats.showcasesWithCode++;
        }
      } else {
        console.log(`  ⚠️  "${title}" missing code attribute`);
        stats.showcasesWithoutCode++;
        stats.warnings++;
      }
    }
    
    if (showcaseCount === 0) {
      console.log('  ℹ️  No ComponentShowcase blocks found');
    }
    
  } catch (error) {
    console.log(`  ❌ Error processing ${relativePath}: ${error.message}`);
    stats.brokenReferences++;
  }
}

/**
 * Find all generated HTML files and verify they have corresponding references
 */
function findOrphanedHTMLFiles() {
  console.log('\n🔍 Checking for orphaned HTML files...');
  
  const mdxFiles = glob.sync(path.join(COMPONENTS_DIR, '**', 'index.mdx'));
  const orphanedFiles = [];
  
  for (const mdxFile of mdxFiles) {
    const componentDir = path.dirname(mdxFile);
    
    try {
      const files = fs.readdirSync(componentDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      const mdxContent = fs.readFileSync(mdxFile, 'utf8');
      
      for (const htmlFile of htmlFiles) {
        // Check if this HTML file is referenced in the MDX
        if (!mdxContent.includes(`code="${htmlFile}"`)) {
          orphanedFiles.push({
            file: htmlFile,
            dir: path.relative('.', componentDir)
          });
        }
      }
    } catch (error) {
      console.log(`  ⚠️  Error checking directory: ${componentDir}`);
    }
  }
  
  if (orphanedFiles.length > 0) {
    console.log(`  ⚠️  Found ${orphanedFiles.length} potentially orphaned HTML files:`);
    orphanedFiles.forEach(orphan => {
      console.log(`    - ${orphan.dir}/${orphan.file}`);
    });
  } else {
    console.log('  ✅ No orphaned HTML files found');
  }
}

/**
 * Main verification function
 */
async function main() {
  try {
    if (!fs.existsSync(COMPONENTS_DIR)) {
      console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
      process.exit(1);
    }
    
    // Find all MDX files
    const mdxFiles = glob.sync(path.join(COMPONENTS_DIR, '**', 'index.mdx'), { absolute: true });
    
    if (mdxFiles.length === 0) {
      console.log('ℹ️  No MDX files found in components directory');
      return;
    }
    
    console.log(`📁 Found ${mdxFiles.length} component files to verify\n`);
    
    // Verify each MDX file
    for (const filePath of mdxFiles) {
      verifyMDXFile(filePath);
    }
    
    // Check for orphaned HTML files
    findOrphanedHTMLFiles();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Files checked: ${stats.filesChecked}`);
    console.log(`ComponentShowcase blocks with code attributes: ${stats.showcasesWithCode}`);
    console.log(`ComponentShowcase blocks without code attributes: ${stats.showcasesWithoutCode}`);
    console.log(`Broken references: ${stats.brokenReferences}`);
    console.log(`Files with potential duplicate content: ${stats.duplicateContent}`);
    console.log(`Total warnings: ${stats.warnings}`);
    
    if (stats.brokenReferences === 0 && stats.duplicateContent === 0 && stats.showcasesWithoutCode === 0) {
      console.log('\n✅ All verifications passed successfully!');
    } else if (stats.brokenReferences > 0) {
      console.log(`\n❌ Found ${stats.brokenReferences} critical issues that need attention`);
      process.exit(1);
    } else {
      console.log(`\n⚠️  Found ${stats.warnings} warnings that may need review`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  main();
}

module.exports = { verifyMDXFile, checkHTMLFile };