const fs = require('fs');
const path = require('path');

// Function to convert CSS string to JSX style object
function convertCssStringToJsxStyle(cssString) {
  // Remove outer quotes
  const cleanCss = cssString.replace(/^['"]|['"]$/g, '');
  
  // Split by semicolon and filter empty strings
  const properties = cleanCss.split(';').filter(prop => prop.trim());
  
  const styleObject = {};
  
  properties.forEach(prop => {
    const [key, value] = prop.split(':').map(part => part.trim());
    if (key && value) {
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      styleObject[camelKey] = value;
    }
  });
  
  return styleObject;
}

// Function to convert style object to JSX string
function styleObjectToJsxString(styleObj) {
  const entries = Object.entries(styleObj);
  if (entries.length === 0) return '{{}}';
  
  const formattedEntries = entries.map(([key, value]) => {
    // Ensure value is properly quoted if it's a string
    const formattedValue = typeof value === 'string' && !value.match(/^\d+$/) 
      ? `'${value}'` 
      : value;
    return `${key}: ${formattedValue}`;
  });
  
  return `{{${formattedEntries.join(', ')}}}`;
}

// Function to fix JSX style attributes in a file
function fixJsxStylesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to find JSX elements with string style attributes
  // Matches: style="css-here" but not style={{...}} or style={`...`}
  const styleRegex = /\sstyle=["']([^"']*?)["']/g;
  
  let updatedContent = content;
  let hasChanges = false;
  let matchCount = 0;
  
  updatedContent = updatedContent.replace(styleRegex, (match, cssString) => {
    // Skip if this appears to be inside a code block (between backticks)
    const beforeMatch = content.substring(0, content.indexOf(match));
    const codeBlocksBeforeMatch = (beforeMatch.match(/```/g) || []).length;
    const inCodeBlock = codeBlocksBeforeMatch % 2 === 1;
    
    // Skip if this appears to be in a code={`...`} block
    const isInCodeBlock = beforeMatch.match(/code=\{`[^}]*$/);
    
    if (inCodeBlock || isInCodeBlock) {
      return match; // Don't modify code examples
    }
    
    try {
      const styleObj = convertCssStringToJsxStyle(cssString);
      const jsxStyleString = styleObjectToJsxString(styleObj);
      hasChanges = true;
      matchCount++;
      console.log(`    Converting: style="${cssString}" → style=${jsxStyleString}`);
      return ` style=${jsxStyleString}`;
    } catch (error) {
      console.warn(`    Warning: Could not convert style="${cssString}": ${error.message}`);
      return match;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Fixed ${matchCount} style attributes in ${path.basename(filePath)}`);
    return matchCount;
  } else {
    console.log(`📝 No JSX style fixes needed in ${path.basename(filePath)}`);
    return 0;
  }
}

// Main execution
console.log('🔧 Fixing JSX string style attributes...\n');

const docsDir = path.join(__dirname, '..', 'docs', 'components');
const files = fs.readdirSync(docsDir, { withFileTypes: true });

let totalFiles = 0;
let totalFixes = 0;

for (const file of files) {
  if (file.isDirectory()) {
    const indexPath = path.join(docsDir, file.name, 'index.mdx');
    if (fs.existsSync(indexPath)) {
      console.log(`\n🔍 Checking ${file.name}/index.mdx...`);
      const fixCount = fixJsxStylesInFile(indexPath);
      totalFiles++;
      totalFixes += fixCount;
    }
  }
}

console.log(`\n🎉 Processing complete!`);
console.log(`📁 Files processed: ${totalFiles}`);
console.log(`🔧 Total style attributes fixed: ${totalFixes}`);
console.log(`\n✅ All JSX string style attributes have been converted to proper JSX style objects!`);