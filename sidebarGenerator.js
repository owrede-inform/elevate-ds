/**
 * Custom Sidebar Generator for ELEVATE Design System
 * 
 * Provides intelligent sorting:
 * 1. Index files first (index.mdx, index.md, index.tsx, index.ts, index.js)
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
    '/index.mdx',
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
  if (id.endsWith('/index.mdx') || id.endsWith('index.mdx')) return 1;
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
 * @returns {Array} - Sorted items
 */
function sortSidebarItems(items) {
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
    
    // Both are docs - apply index-first then alphabetical sorting
    if (a.type === 'doc' && b.type === 'doc') {
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
 * @returns {Array} - Sorted sidebar items
 */
function recursiveSortItems(items) {
  if (!Array.isArray(items)) return items;
  
  const sorted = sortSidebarItems(items);
  
  // Recursively sort children in categories
  return sorted.map(item => {
    if (item.type === 'category' && item.items) {
      return {
        ...item,
        items: recursiveSortItems(item.items)
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
  const sortedItems = recursiveSortItems(sidebarItems);
  
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