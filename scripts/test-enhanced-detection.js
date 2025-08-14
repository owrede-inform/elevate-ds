const { detectChangeType, detectBreakingChanges, detectImpactType } = require('./enhanced-changelog-converter');

console.log('🧪 Testing Enhanced Changelog Detection\n');

// Test cases for breaking changes
const breakingChangeTests = [
  'Remove deprecated Button.variant property',
  'Change Button API interface for v2.0',
  'Breaking: Update Input validation behavior',
  'Replace old Modal component with new Dialog',
  'No longer support IE11 compatibility',
  'Deprecated Button.size property and removed it',
  'Button: Major refactor with breaking changes',
  'Fix Button styling issues' // Should NOT be breaking
];

// Test cases for API changes
const apiChangeTests = [
  'Add new "size" property to Button component',
  'Remove deprecated "variant" attribute from Input',
  'Change method signature for validate() function',
  'Rename "color" property to "theme" in Card',
  'Deprecated old "onClick" method in favor of "onActivate"',
  'Update Button design without API changes', // Should NOT be API change
  'Fix styling bug in Modal component' // Should NOT be API change
];

// Test cases for impact types
const impactTests = [
  'Update Button design and color scheme',
  'Optimize performance of Table rendering',
  'Add accessibility support for screen readers',
  'Improve TypeScript types and documentation',
  'Fix visual alignment in Card component',
  'Enhance developer experience with better docs'
];

console.log('🚨 Testing Breaking Changes Detection:');
console.log('━'.repeat(60));
breakingChangeTests.forEach((test, i) => {
  const result = detectBreakingChanges(test, test);
  const icon = result.isBreaking ? '🚨' : '✅';
  console.log(`${icon} "${test}"`);
  if (result.isBreaking) {
    console.log(`   Reason: ${result.reason}`);
  }
  console.log();
});

console.log('\n🔧 Testing API Changes Detection:');
console.log('━'.repeat(60));
apiChangeTests.forEach((test, i) => {
  const result = detectImpactType(test, test);
  const icon = result.isApiChange ? '🔧' : '📝';
  console.log(`${icon} "${test}"`);
  console.log(`   Impact: ${result.impact}`);
  if (result.isApiChange) {
    console.log(`   API Change Type: ${result.apiChangeType}`);
  }
  console.log();
});

console.log('\n📊 Testing Impact Type Detection:');
console.log('━'.repeat(60));
impactTests.forEach((test, i) => {
  const result = detectImpactType(test, test);
  const icons = {
    'visual': '🎨',
    'performance': '⚡',
    'functionality': '🔧',
    'developer-experience': '👨‍💻',
    'api': '🔗'
  };
  const icon = icons[result.impact] || '📝';
  console.log(`${icon} "${test}"`);
  console.log(`   Impact: ${result.impact}`);
  console.log();
});

console.log('\n🎯 Testing Change Type Detection:');
console.log('━'.repeat(60));
const changeTypeTests = [
  'Add new Button component',
  'Fix Input validation issue', 
  'Remove deprecated Modal props',
  'Optimize Table performance',
  'Refactor Card component structure'
];

changeTypeTests.forEach((test, i) => {
  const changeType = detectChangeType(test, test);
  const icons = {
    'feature': '🆕',
    'bug-fix': '🐛',
    'breaking-change': '🚨',
    'improvement': '⚡'
  };
  const icon = icons[changeType] || '📝';
  console.log(`${icon} "${test}" → ${changeType}`);
});

console.log('\n✅ Enhanced detection testing complete!');