#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Automated ComponentShowcase Code Extraction Script
 * 
 * This script processes all MDX files in the docs/components directory,
 * extracts ComponentShowcase blocks, creates semantic external files,
 * and updates the MDX files to reference them.
 */

// Configuration
const DOCS_ROOT = './docs';
const COMPONENTS_DIR = path.join(DOCS_ROOT, 'components');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose') || DRY_RUN;

console.log('🚀 ELEVATE ComponentShowcase Code Extractor');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no files will be modified)' : 'LIVE (files will be modified)'}`);
console.log('=' .repeat(60));

// Statistics
let stats = {
  filesProcessed: 0,
  showcasesFound: 0,
  showcasesExtracted: 0,
  filesGenerated: 0,
  errors: 0
};

/**
 * Generate semantic filename based on ComponentShowcase title and content
 */
function generateSemanticFilename(title, content, existingFiles) {
  // Clean and normalize the title
  let filename = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Fallback semantic names based on content analysis
  const contentAnalysis = analyzeContent(content);
  if (!filename || filename.length < 2) {
    filename = contentAnalysis.suggestedName || 'example';
  }

  // Ensure uniqueness
  let counter = 1;
  let finalFilename = `${filename}.html`;
  while (existingFiles.has(finalFilename)) {
    finalFilename = `${filename}-${counter}.html`;
    counter++;
  }
  
  existingFiles.add(finalFilename);
  return finalFilename;
}

/**
 * Analyze ComponentShowcase content to suggest semantic names
 */
function analyzeContent(content) {
  const analysis = {
    hasIcons: false,
    hasStates: false,
    hasSizes: false,
    hasVariants: false,
    hasValidation: false,
    hasForm: false,
    hasAccessibility: false,
    suggestedName: 'example'
  };

  const contentLower = content.toLowerCase();
  
  // Icon detection
  if (contentLower.includes('<elvt-icon') || contentLower.includes('icon=') || contentLower.includes('mdi:')) {
    analysis.hasIcons = true;
    if (contentLower.includes('slot="prefix"')) {
      analysis.suggestedName = 'icons-prefix';
    } else if (contentLower.includes('slot="suffix"')) {
      analysis.suggestedName = 'icons-suffix';
    } else {
      analysis.suggestedName = 'icons';
    }
  }
  
  // State detection
  if (contentLower.includes('disabled') || contentLower.includes('selected') || contentLower.includes('readonly')) {
    analysis.hasStates = true;
    analysis.suggestedName = 'states';
  }
  
  // Size detection
  if (contentLower.includes('size="small"') || contentLower.includes('size="large"') || contentLower.includes('size="medium"')) {
    analysis.hasSizes = true;
    analysis.suggestedName = 'sizes';
  }
  
  // Variant/tone detection
  if (contentLower.includes('tone=') || contentLower.includes('variant=')) {
    analysis.hasVariants = true;
    analysis.suggestedName = 'variants';
  }
  
  // Validation detection
  if (contentLower.includes('invalid') || contentLower.includes('valid') || contentLower.includes('warning') || contentLower.includes('help-text')) {
    analysis.hasValidation = true;
    analysis.suggestedName = 'validation';
  }
  
  // Form detection
  if (contentLower.includes('<form') || contentLower.includes('type="submit"') || contentLower.includes('required')) {
    analysis.hasForm = true;
    analysis.suggestedName = 'form-example';
  }
  
  // Accessibility detection
  if (contentLower.includes('aria-label') || contentLower.includes('title=') || contentLower.includes('screen reader')) {
    analysis.hasAccessibility = true;
    analysis.suggestedName = 'accessibility';
  }
  
  return analysis;
}

/**
 * Clean and format the extracted JSX content
 */
function cleanJSXContent(content) {
  // Remove leading/trailing whitespace while preserving internal structure
  const lines = content.split('\n');
  
  // Find the minimum indentation (excluding empty lines)
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return '';
  
  const minIndent = Math.min(
    ...nonEmptyLines.map(line => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    })
  );
  
  // Remove minimum indentation from all lines
  const cleanedLines = lines.map(line => {
    if (line.trim().length === 0) return '';
    return line.slice(minIndent);
  });
  
  // Remove empty lines from start and end
  while (cleanedLines.length > 0 && cleanedLines[0].trim() === '') {
    cleanedLines.shift();
  }
  while (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1].trim() === '') {
    cleanedLines.pop();
  }
  
  return cleanedLines.join('\n');
}

/**
 * Extract ComponentShowcase blocks from MDX content
 */
function extractComponentShowcases(content, filePath) {
  const showcases = [];
  const regex = /<ComponentShowcase[^>]*>([\s\S]*?)<\/ComponentShowcase>/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const innerContent = match[1];
    
    // Extract title and description from attributes
    const titleMatch = fullMatch.match(/title=["']([^"']+)["']/);
    const descriptionMatch = fullMatch.match(/description=["']([^"']+)["']/);
    const codeMatch = fullMatch.match(/code=["']([^"']+)["']/);
    
    // Skip if it already has a code attribute pointing to a file
    if (codeMatch && codeMatch[1].endsWith('.html')) {
      if (VERBOSE) {
        console.log(`  ⏭️  Skipping showcase with existing code file: ${codeMatch[1]}`);
      }
      continue;
    }
    
    showcases.push({
      fullMatch,
      innerContent: cleanJSXContent(innerContent),
      title: titleMatch ? titleMatch[1] : '',
      description: descriptionMatch ? descriptionMatch[1] : '',
      existingCode: codeMatch ? codeMatch[1] : null,
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  return showcases;
}

/**
 * Process a single MDX file
 */
async function processMDXFile(filePath) {
  if (VERBOSE) {
    console.log(`\n📄 Processing: ${path.relative('.', filePath)}`);
  }
  
  stats.filesProcessed++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const showcases = extractComponentShowcases(content, filePath);
    
    if (showcases.length === 0) {
      if (VERBOSE) {
        console.log('  ℹ️  No ComponentShowcase blocks found');
      }
      return;
    }
    
    stats.showcasesFound += showcases.length;
    if (VERBOSE) {
      console.log(`  🔍 Found ${showcases.length} ComponentShowcase block(s)`);
    }
    
    const componentDir = path.dirname(filePath);
    const existingFiles = new Set();
    
    // Check existing files in the directory
    try {
      const existingFilesList = fs.readdirSync(componentDir);
      existingFilesList.forEach(file => {
        if (file.endsWith('.html')) {
          existingFiles.add(file);
        }
      });
    } catch (e) {
      // Directory might not exist, ignore
    }
    
    let modifiedContent = content;
    const modifications = [];
    
    // Process showcases in reverse order to maintain correct indices
    for (let i = showcases.length - 1; i >= 0; i--) {
      const showcase = showcases[i];
      
      if (!showcase.innerContent.trim()) {
        if (VERBOSE) {
          console.log(`  ⚠️  Skipping empty showcase: "${showcase.title}"`);
        }
        continue;
      }
      
      // Generate filename
      const filename = generateSemanticFilename(
        showcase.title, 
        showcase.innerContent, 
        existingFiles
      );
      
      const htmlFilePath = path.join(componentDir, filename);
      
      if (VERBOSE) {
        console.log(`  📝 Creating: ${filename} for "${showcase.title}"`);
      }
      
      // Create HTML file
      if (!DRY_RUN) {
        fs.writeFileSync(htmlFilePath, showcase.innerContent, 'utf8');
      }
      stats.filesGenerated++;
      
      // Prepare MDX modification
      let newShowcaseBlock = showcase.fullMatch;
      
      // Add or update code attribute
      if (showcase.existingCode) {
        // Replace existing code attribute
        newShowcaseBlock = newShowcaseBlock.replace(
          /code=["'][^"']*["']/,
          `code="${filename}"`
        );
      } else {
        // Add code attribute
        const insertPos = newShowcaseBlock.indexOf('>');
        newShowcaseBlock = 
          newShowcaseBlock.slice(0, insertPos) +
          `\n  code="${filename}"` +
          newShowcaseBlock.slice(insertPos);
      }
      
      modifications.push({
        start: showcase.startIndex,
        end: showcase.endIndex,
        replacement: newShowcaseBlock
      });
      
      stats.showcasesExtracted++;
    }
    
    // Apply modifications to MDX content
    if (modifications.length > 0) {
      for (const mod of modifications) {
        modifiedContent = 
          modifiedContent.slice(0, mod.start) +
          mod.replacement +
          modifiedContent.slice(mod.end);
        
        // Adjust indices for subsequent modifications
        const lengthDiff = mod.replacement.length - (mod.end - mod.start);
        modifications.forEach(otherMod => {
          if (otherMod.start > mod.start) {
            otherMod.start += lengthDiff;
            otherMod.end += lengthDiff;
          }
        });
      }
      
      // Write modified MDX file
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      if (VERBOSE) {
        console.log(`  ✅ Updated MDX with ${modifications.length} code references`);
      }
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Find all MDX files to process
 */
function findMDXFiles() {
  const pattern = path.join(COMPONENTS_DIR, '**', 'index.mdx');
  return glob.sync(pattern, { absolute: true });
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check if required dependencies are available
    try {
      require('glob');
    } catch (e) {
      console.error('❌ Missing required dependency: glob');
      console.log('Please install it with: npm install glob');
      process.exit(1);
    }
    
    if (!fs.existsSync(COMPONENTS_DIR)) {
      console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
      process.exit(1);
    }
    
    const mdxFiles = findMDXFiles();
    
    if (mdxFiles.length === 0) {
      console.log('ℹ️  No MDX files found in components directory');
      return;
    }
    
    console.log(`📁 Found ${mdxFiles.length} component files to process\n`);
    
    // Process each file
    for (const filePath of mdxFiles) {
      await processMDXFile(filePath);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXTRACTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`ComponentShowcase blocks found: ${stats.showcasesFound}`);
    console.log(`Code blocks extracted: ${stats.showcasesExtracted}`);
    console.log(`HTML files generated: ${stats.filesGenerated}`);
    console.log(`Errors encountered: ${stats.errors}`);
    
    if (DRY_RUN) {
      console.log('\n🔍 This was a DRY RUN - no files were actually modified');
      console.log('Run without --dry-run to execute the changes');
    } else if (stats.errors === 0) {
      console.log('\n✅ All operations completed successfully!');
    } else {
      console.log(`\n⚠️  Completed with ${stats.errors} errors`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Check if script is being run directly
if (require.main === module) {
  main();
}

module.exports = {
  extractComponentShowcases,
  generateSemanticFilename,
  analyzeContent,
  cleanJSXContent
};