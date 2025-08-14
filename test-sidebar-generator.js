/**
 * Test script for the custom sidebar generator
 * Run with: node test-sidebar-generator.js
 */

const { sortSidebarItems, isIndexFile, getIndexPriority } = require('./sidebarGenerator');

// Test data that mimics Docusaurus sidebar items
const testItems = [
  { type: 'doc', id: 'patterns/card-layouts', label: 'Card Layouts' },
  { type: 'doc', id: 'patterns/index', label: 'Overview' },
  { type: 'doc', id: 'patterns/appshell', label: 'Application Shell' },
  { type: 'doc', id: 'patterns/data-tables', label: 'Data Tables' },
  { type: 'doc', id: 'patterns/primary-navigation', label: 'Primary Navigation' },
  { type: 'doc', id: 'components/button/index.mdx', label: 'Button' },
  { type: 'doc', id: 'components/avatar/index.md', label: 'Avatar' },
  { type: 'doc', id: 'components/index.tsx', label: 'Components Overview' },
  { type: 'doc', id: 'components/card/index', label: 'Card' },
];

console.log('=== Testing Index File Detection ===');
testItems.forEach(item => {
  const isIndex = isIndexFile(item.id);
  const priority = getIndexPriority(item.id);
  console.log(`${item.id}: isIndex=${isIndex}, priority=${priority}`);
});

console.log('\n=== Original Order ===');
testItems.forEach((item, i) => {
  console.log(`${i + 1}. ${item.label} (${item.id})`);
});

console.log('\n=== After Custom Sorting ===');
const sorted = sortSidebarItems([...testItems]);
sorted.forEach((item, i) => {
  const isIndex = isIndexFile(item.id) ? ' [INDEX]' : '';
  console.log(`${i + 1}. ${item.label} (${item.id})${isIndex}`);
});

console.log('\n=== Expected Behavior ===');
console.log('✓ Index files should appear first');
console.log('✓ Non-index files should be alphabetically sorted');
console.log('✓ Within index files, .mdx > .md > .tsx > .ts > .js > plain index');