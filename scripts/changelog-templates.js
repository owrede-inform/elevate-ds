/**
 * ELEVATE Component Changelog Templates
 * 
 * Pre-defined templates for different types of changelog entries
 */

const CHANGELOG_TEMPLATES = {
  // Basic component template
  basic: {
    component: "elvt-example",
    version: "0.0.28-alpha",
    lastUpdated: new Date().toISOString(),
    changelog: [
      {
        version: "0.0.28-alpha",
        date: new Date().toISOString().split('T')[0],
        type: "patch",
        changes: [
          {
            type: "bug-fix",
            title: "Fix Component Styling Issue",
            description: "Resolved styling conflicts with component appearance",
            commit: "abc123def456789",
            impact: "visual",
            breakingChange: false
          }
        ]
      }
    ],
    deprecations: [],
    upcomingChanges: [],
    metadata: {
      totalVersions: 1,
      firstVersion: "0.0.28-alpha",
      storyCount: 0,
      testCount: 0,
      fileCount: 0,
      lastCommit: ""
    }
  },

  // Feature release template
  feature: {
    type: "feature",
    title: "Add New Component Feature",
    description: "Implemented new functionality to enhance component capabilities",
    commit: "def456abc789123",
    impact: "api",
    breakingChange: false,
    apiAdditions: [
      {
        property: "newProperty?: string",
        description: "Optional property for enhanced functionality"
      }
    ]
  },

  // Breaking change template
  breaking: {
    type: "breaking-change", 
    title: "Update Component API Structure",
    description: "Refactored component API for improved consistency and performance",
    commit: "ghi789jkl012345",
    impact: "api",
    breakingChange: true,
    migration: {
      description: "Update component usage to use new API structure",
      before: "// Old usage\n<elvt-component oldProp=\"value\" />",
      after: "// New usage\n<elvt-component newProp=\"value\" />"
    }
  },

  // Bug fix template
  bugfix: {
    type: "bug-fix",
    title: "Fix Component Accessibility Issue",
    description: "Resolved screen reader compatibility and keyboard navigation issues",
    commit: "mno345pqr678901", 
    issueNumber: 123,
    impact: "functionality",
    breakingChange: false
  },

  // Improvement template
  improvement: {
    type: "improvement",
    title: "Enhance Component Performance",
    description: "Optimized rendering performance and reduced bundle size",
    commit: "stu012vwx345678",
    impact: "performance", 
    breakingChange: false
  },

  // Deprecation template
  deprecation: {
    type: "deprecation",
    title: "Deprecate Legacy Component Method",
    description: "Marked legacy method as deprecated in favor of new API",
    commit: "yz901abc234567",
    impact: "developer-experience",
    breakingChange: false,
    migration: {
      description: "Replace deprecated method with new alternative",
      before: "component.legacyMethod()",
      after: "component.newMethod()"
    }
  }
};

// Generate a complete changelog from template
function generateFromTemplate(componentName, templateType = 'basic', options = {}) {
  const template = JSON.parse(JSON.stringify(CHANGELOG_TEMPLATES[templateType] || CHANGELOG_TEMPLATES.basic));
  
  // Customize for component
  if (template.component) {
    template.component = componentName;
  }
  
  // Apply options
  if (options.version) {
    template.version = options.version;
    if (template.changelog?.[0]) {
      template.changelog[0].version = options.version;
    }
  }
  
  if (options.date) {
    if (template.changelog?.[0]) {
      template.changelog[0].date = options.date;
    }
  }
  
  return template;
}

// Generate individual change entry
function generateChangeEntry(type, options = {}) {
  const template = JSON.parse(JSON.stringify(CHANGELOG_TEMPLATES[type] || CHANGELOG_TEMPLATES.bugfix));
  
  // Apply customizations
  Object.assign(template, options);
  
  return template;
}

// Create empty changelog structure
function createEmptyChangelog(componentName, version = "0.0.28-alpha") {
  return {
    component: componentName,
    version: version,
    lastUpdated: new Date().toISOString(),
    changelog: [],
    deprecations: [],
    upcomingChanges: [
      {
        version: "0.1.0",
        plannedDate: "2025-09-01",
        description: "Stable release with finalized API",
        changes: [
          "API stabilization",
          "Performance optimizations",
          "Enhanced accessibility features"
        ]
      }
    ],
    metadata: {
      totalVersions: 0,
      firstVersion: version,
      storyCount: 0,
      testCount: 0,
      fileCount: 0,
      lastCommit: ""
    }
  };
}

// Sample data for common components
const COMPONENT_SAMPLES = {
  'elvt-button': {
    storyCount: 11,
    testCount: 3,
    fileCount: 4,
    commonChanges: [
      'Button group styling improvements',
      'Focus state enhancements', 
      'Accessibility improvements',
      'Loading state optimizations'
    ]
  },
  'elvt-input': {
    storyCount: 8,
    testCount: 2,
    fileCount: 3,
    commonChanges: [
      'Validation message styling',
      'Placeholder text improvements',
      'Form integration enhancements',
      'Accessibility compliance'
    ]
  },
  'elvt-modal': {
    storyCount: 6,
    testCount: 2,
    fileCount: 2,
    commonChanges: [
      'Backdrop click handling',
      'ESC key support',
      'Focus trap improvements',
      'Animation optimizations'
    ]
  }
};

function getComponentSample(componentName) {
  return COMPONENT_SAMPLES[componentName] || {
    storyCount: 0,
    testCount: 0,
    fileCount: 0,
    commonChanges: []
  };
}

module.exports = {
  CHANGELOG_TEMPLATES,
  generateFromTemplate,
  generateChangeEntry,
  createEmptyChangelog,
  getComponentSample
};