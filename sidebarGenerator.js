/**
 * Custom Sidebar Generator for ELEVATE Design System
 * 
 * Provides intelligent sorting:
 * 1. Index files first (foundation.mdx, index.md, index.tsx, index.ts, index.js)
 * 2. All other files sorted alphabetically
 * 3. Categories/folders sorted by their position or alphabetically
 */

/**
 * Checks if an item is an index file
 * @param {string} id - The doc ID
 * @returns {boolean} - True if it's an index file
 */
function isIndexFile(id) {
  const indexPatterns = [
    '/foundation.mdx',
    '/index.md', 
    '/index.tsx',
    '/index.ts',
    '/index.js'
  ];
  
  return indexPatterns.some(pattern => id.endsWith(pattern)) || 
         id.endsWith('/index') ||
         id === 'index';
}

/**
 * Gets the priority order for index files
 * @param {string} id - The doc ID
 * @returns {number} - Priority (lower = higher priority)
 */
function getIndexPriority(id) {
  if (id.endsWith('/foundation.mdx') || id.endsWith('foundation.mdx')) return 1;
  if (id.endsWith('/index.md') || id.endsWith('index.md')) return 2;
  if (id.endsWith('/index.tsx') || id.endsWith('index.tsx')) return 3;
  if (id.endsWith('/index.ts') || id.endsWith('index.ts')) return 4;
  if (id.endsWith('/index.js') || id.endsWith('index.js')) return 5;
  if (id.endsWith('/index') || id === 'index') return 6;
  return 100; // Not an index file
}

/**
 * Sorts sidebar items with custom logic
 * @param {Array} items - Array of sidebar items
 * @param {Object} docs - Docs collection for metadata lookup
 * @returns {Array} - Sorted items
 */
function sortSidebarItems(items, docs = null) {
  return items.sort((a, b) => {
    // Handle categories first - sort by position or label
    if (a.type === 'category' && b.type === 'category') {
      const aPos = a.customProps?.position || 999;
      const bPos = b.customProps?.position || 999;
      if (aPos !== bPos) return aPos - bPos;
      return (a.label || '').localeCompare(b.label || '');
    }
    
    // Categories always come before docs (unless they're index files)
    if (a.type === 'category' && b.type === 'doc') {
      return isIndexFile(b.id) ? 1 : -1;
    }
    if (a.type === 'doc' && b.type === 'category') {
      return isIndexFile(a.id) ? -1 : 1;
    }
    
    // Both are docs - check for manual sidebar_position first
    if (a.type === 'doc' && b.type === 'doc') {
      // Try to get sidebar_position from various sources
      let aPos, bPos;
      
      // Find the doc metadata from the docs collection
      const aDoc = (docs && Array.isArray(docs)) ? docs.find(doc => doc.id === a.id) : 
                   (docs && docs[a.id]) || null;
      const bDoc = (docs && Array.isArray(docs)) ? docs.find(doc => doc.id === b.id) : 
                   (docs && docs[b.id]) || null;
      
      // Get sidebar_position from frontmatter
      aPos = aDoc?.frontMatter?.sidebar_position || aDoc?.sidebar_position || 
             a.customProps?.sidebar_position || a.sidebar_position;
      bPos = bDoc?.frontMatter?.sidebar_position || bDoc?.sidebar_position || 
             b.customProps?.sidebar_position || b.sidebar_position;
      
      // Debug logging for design folder
      if (process.env.NODE_ENV === 'development' && (a.id.includes('design/') || b.id.includes('design/'))) {
        console.log(`[Sidebar] Comparing ${a.id} (pos: ${aPos}) vs ${b.id} (pos: ${bPos})`);
      }
      
      // If both have manual positions, sort by position
      if (aPos !== undefined && bPos !== undefined) {
        return aPos - bPos;
      }
      
      // If only one has manual position, it takes precedence
      if (aPos !== undefined && bPos === undefined) return -1;
      if (aPos === undefined && bPos !== undefined) return 1;
      
      // Neither have manual positions - apply automatic sorting
      const aIsIndex = isIndexFile(a.id);
      const bIsIndex = isIndexFile(b.id);
      
      // If one is index and other isn't, index comes first
      if (aIsIndex && !bIsIndex) return -1;
      if (!aIsIndex && bIsIndex) return 1;
      
      // If both are index files, sort by priority
      if (aIsIndex && bIsIndex) {
        const aPriority = getIndexPriority(a.id);
        const bPriority = getIndexPriority(b.id);
        return aPriority - bPriority;
      }
      
      // Neither are index files - sort alphabetically by label
      const aLabel = a.label || a.id || '';
      const bLabel = b.label || b.id || '';
      return aLabel.localeCompare(bLabel);
    }
    
    // Default: preserve original order
    return 0;
  });
}

/**
 * Recursively sorts all sidebar items and their children
 * @param {Array} items - Sidebar items
 * @param {Object} docs - Docs collection for metadata lookup
 * @returns {Array} - Sorted sidebar items
 */
function recursiveSortItems(items, docs = null) {
  if (!Array.isArray(items)) return items;
  
  const sorted = sortSidebarItems(items, docs);
  
  // Recursively sort children in categories
  return sorted.map(item => {
    if (item.type === 'category' && item.items) {
      return {
        ...item,
        items: recursiveSortItems(item.items, docs)
      };
    }
    return item;
  });
}

/**
 * Custom sidebar items generator
 * @param {Object} params - Generator parameters
 * @returns {Array} - Generated sidebar items
 */
async function customSidebarItemsGenerator({
  defaultSidebarItemsGenerator,
  numberPrefixParser,
  item,
  version,
  docs,
  categoriesMetadata,
  isCategoryIndex,
  categoryLabelSlugger,
  ...args
}) {
  // Start with the default generator
  const sidebarItems = await defaultSidebarItemsGenerator({
    defaultSidebarItemsGenerator,
    numberPrefixParser,
    item,
    version,
    docs,
    categoriesMetadata,
    isCategoryIndex,
    categoryLabelSlugger,
    ...args
  });
  
  // Apply our custom sorting
  const sortedItems = recursiveSortItems(sidebarItems, docs);
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[CustomSidebarGenerator] Sorted ${sortedItems.length} items for ${item.dirName || 'root'}`);
  }
  
  return sortedItems;
}

module.exports = {
  customSidebarItemsGenerator,
  sortSidebarItems,
  isIndexFile,
  getIndexPriority
};