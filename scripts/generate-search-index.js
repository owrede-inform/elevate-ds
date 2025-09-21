const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Simple file finder function to replace glob
function findFiles(dir, extensions, result = []) {
  if (!fs.existsSync(dir)) return result;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, extensions, result);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        result.push(path.relative(process.cwd(), filePath));
      }
    }
  }

  return result;
}

// Search index generator for ELEVATE Design System docs
function generateSearchIndex() {
  const searchIndex = [];

  // Find all markdown and mdx files
  const docsDir = path.join(__dirname, '../docs');
  const files = findFiles(docsDir, ['.md', '.mdx']);

  files.forEach(filePath => {
      try {
        const fullPath = path.resolve(filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data: frontMatter, content: markdownContent } = matter(content);
        
        // Skip if no title
        if (!frontMatter.title) return;
        
        // Generate URL path (remove foundation.mdx/index.md to get clean URLs)
        let urlPath = '/' + filePath
          .replace(/\\/g, '/')
          .replace('.mdx', '')
          .replace('.md', '')
          .replace('docs/', 'docs/');
        
        // Remove /index from URLs (foundation.mdx files should map to folder URLs)
        urlPath = urlPath.replace(/\/index$/, '');
        
        // Extract first paragraph as description
        const description = frontMatter.description || 
          extractFirstParagraph(markdownContent) ||
          `Documentation for ${frontMatter.title}`;
        
        // Extract searchable content (first few paragraphs)
        const searchContent = extractSearchableContent(markdownContent);
        
        // Create search entry
        const searchEntry = {
          id: urlPath.replace(/[^a-zA-Z0-9]/g, '_'),
          title: frontMatter.title,
          description: description,
          url: urlPath,
          content: searchContent,
          tags: frontMatter.tags || [],
          group: frontMatter.group || '',
          category: getCategoryFromPath(filePath)
        };
        
        searchIndex.push(searchEntry);
        
      } catch (error) {
        console.warn(`Error processing ${filePath}:`, error.message);
      }
    });
  
  // Add component data from existing metadata
  try {
    const componentDataPath = path.join(__dirname, '../component-metadata/component-table-data.json');
    if (fs.existsSync(componentDataPath)) {
      const componentData = JSON.parse(fs.readFileSync(componentDataPath, 'utf8'));
      
      componentData.forEach(component => {
        const searchEntry = {
          id: `component_${component.name}`,
          title: `${component.displayName} Component`,
          description: component.summary || `${component.displayName} - ${component.description}`,
          url: `/docs/components/${component.displayName}`,
          content: `${component.displayName} ${component.description} ${component.summary || ''} ${component.tags.join(' ')}`,
          tags: component.tags || [],
          group: 'Components',
          category: 'component'
        };
        
        // Only add if not already in search index
        if (!searchIndex.find(item => item.url === searchEntry.url)) {
          searchIndex.push(searchEntry);
        }
      });
    }
  } catch (error) {
    console.warn('Error adding component data:', error.message);
  }
  
  // Write search index
  const outputPath = path.join(__dirname, '../static/search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  
  console.log(`✅ Generated search index with ${searchIndex.length} entries`);
  console.log(`📁 Output: ${outputPath}`);
  
  return searchIndex;
}

function extractFirstParagraph(content) {
  // Remove frontmatter, code blocks, and components
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '')  // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
    .replace(/<[^>]*>/g, '')         // Remove HTML/JSX tags
    .replace(/import\s+.*?from.*?;/g, '') // Remove imports
    .trim();
  
  // Find first paragraph
  const paragraphs = cleaned.split('\n\n');
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('import')) {
      return trimmed.substring(0, 200) + (trimmed.length > 200 ? '...' : '');
    }
  }
  
  return '';
}

function extractSearchableContent(content) {
  // Extract searchable content (remove code, keep headings and text)
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '')  // Remove frontmatter
    .replace(/```[\s\S]*?```/g, ' ') // Remove code blocks
    .replace(/<[^>]*>/g, ' ')        // Remove HTML/JSX tags
    .replace(/import\s+.*?from.*?;/g, '') // Remove imports
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .trim();
  
  // Limit content length for search performance
  return cleaned.substring(0, 1000);
}

function getCategoryFromPath(filePath) {
  const parts = filePath.split('/');
  if (parts.includes('components')) return 'component';
  if (parts.includes('design')) return 'design';
  if (parts.includes('patterns')) return 'pattern';
  if (parts.includes('guidelines')) return 'guideline';
  if (parts.includes('home')) return 'getting-started';
  return 'documentation';
}

// Run if called directly
if (require.main === module) {
  generateSearchIndex();
}

module.exports = { generateSearchIndex };