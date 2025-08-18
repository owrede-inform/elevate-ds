#!/usr/bin/env node

/**
 * Generate Components Overview Page
 * 
 * This script automatically scans the /docs/components folder and generates
 * the overview page with ELEVATE cards based on component metadata.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '..', 'docs', 'components');
const OUTPUT_FILE = path.join(COMPONENTS_DIR, 'index.mdx');

// Icon mapping for components (SVG paths)
const COMPONENT_ICONS = {
  application: "M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z",
  avatar: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  badge: "M20 7h-5L12 2 9 7H4l4 6-4 6h5l3 5 3-5h5l-4-6 4-6z",
  breadcrumb: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  "breadcrumb-item": "M10 17l5-5-5-5v10z",
  button: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  "button-group": "M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h13v-4H8v4zm0 5h13v-4H8v4zM8 5v4h13V5H8z",
  card: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
  charts: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  checkbox: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  chip: "M16 4c4.42 0 8 3.58 8 8s-3.58 8-8 8H8c-4.42 0-8-3.58-8-8s3.58-8 8-8h8m-2.5 2A1.5 1.5 0 1 0 15 7.5 1.5 1.5 0 0 0 13.5 6z",
  "date-picker": "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
  dialog: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
  divider: "M3 11h18v2H3z",
  drawer: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  dropdown: "M7 10l5 5 5-5z",
  "empty-state": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  "expansion-panel": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "expansion-panel-group": "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  field: "M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM4 5v2h16V5H4zm0 16h16v-2H4v2z",
  "file-dropzone": "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",
  "icon-button": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  icon: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
  indicator: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  input: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  lightbox: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  "menu-item": "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  notification: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  paginator: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  progress: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
  radio: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  select: "M7 10l5 5 5-5z",
  skeleton: "M7 6h10v2H7zm0 4h10v2H7zm0 4h7v2H7z",
  slider: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
  switch: "M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
  "tab-group": "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z",
  tab: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z",
  table: "M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z",
  textarea: "M21 11.5l-1.5 1.5L17 10.5 18.5 9L21 11.5zM4 2v20l4-4h12c1.1 0 2-.9 2-2V2H4z",
  toast: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  toolbar: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  tooltip: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  default: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
};

/**
 * Extract frontmatter from MDX file
 * @param {string} content - MDX file content
 * @returns {object} - Parsed frontmatter
 */
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatterText = frontmatterMatch[1];
  const frontmatter = {};
  
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      frontmatter[key.trim()] = value;
    }
  });
  
  return frontmatter;
}

/**
 * Scan components directory and extract metadata
 * @returns {Array} - Array of component objects
 */
function scanComponents() {
  const components = [];
  
  try {
    const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const componentName = entry.name;
      const indexPath = path.join(COMPONENTS_DIR, componentName, 'index.mdx');
      
      // Skip if no index.mdx file
      if (!fs.existsSync(indexPath)) continue;
      
      try {
        const content = fs.readFileSync(indexPath, 'utf-8');
        const frontmatter = extractFrontmatter(content);
        
        // Skip if no title in frontmatter
        if (!frontmatter.title) continue;
        
        components.push({
          name: componentName,
          title: frontmatter.title,
          description: frontmatter.description || `${frontmatter.title} component documentation`,
          sidebarPosition: parseInt(frontmatter.sidebar_position) || 999,
          icon: COMPONENT_ICONS[componentName] || COMPONENT_ICONS.default,
          path: `./${componentName}/`
        });
      } catch (error) {
        console.warn(`Error reading ${indexPath}:`, error.message);
      }
    }
    
    // Sort by sidebar position, then alphabetically
    components.sort((a, b) => {
      if (a.sidebarPosition !== b.sidebarPosition) {
        return a.sidebarPosition - b.sidebarPosition;
      }
      return a.title.localeCompare(b.title);
    });
    
    return components;
  } catch (error) {
    console.error('Error scanning components directory:', error);
    return [];
  }
}

/**
 * Generate the overview page content
 * @param {Array} components - Array of component objects
 * @returns {string} - Generated MDX content
 */
function generateOverviewContent(components) {
  const timestamp = new Date().toISOString();
  
  return `---
title: Components
description: Interactive UI components built with the ELEVATE Design System. Each component is designed for accessibility, consistency, and ease of use.
sidebar_position: 1
---

<!-- 
  This file is auto-generated by scripts/generate-components-overview.js
  Last generated: ${timestamp}
  
  To regenerate this file, run:
  npm run generate:overview
-->

# Components

Explore the complete collection of ELEVATE UI components. Each component is designed with accessibility, consistency, and developer experience in mind.

<elvt-stack gap="m" style={{"marginTop": "2rem"}}>
${components.map(component => `  <elvt-card padding="m">
    <elvt-stack slot="header" distribution="stretch-start">
      <b>${component.title}</b>
      <elvt-icon icon="${component.icon}" style={{"--icon-size": "1rem"}}></elvt-icon>
    </elvt-stack>
    <p>${component.description}</p>
    <a href="${component.path}">Learn more →</a>
  </elvt-card>`).join('\n')}
</elvt-stack>

---

## Component Categories

### Form Components
Input fields, buttons, checkboxes, and other interactive form elements.

### Layout Components  
Cards, stacks, dividers, and other structural elements for organizing content.

### Navigation Components
Breadcrumbs, tabs, menus, and other components for user navigation.

### Feedback Components
Notifications, progress indicators, tooltips, and other user feedback elements.

### Data Display Components
Tables, charts, badges, and other components for presenting information.

---

*Need a component that's not listed? Check our [roadmap](../patterns/) or [submit a request](https://github.com/your-org/elevate-ds/issues).*
`;
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Scanning components directory...');
  
  const components = scanComponents();
  console.log(`📦 Found ${components.length} components`);
  
  if (components.length === 0) {
    console.warn('⚠️  No components found. Check the components directory structure.');
    return;
  }
  
  console.log('📝 Generating overview page...');
  const content = generateOverviewContent(components);
  
  // Write the generated content
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  
  console.log(`✅ Generated overview page: ${OUTPUT_FILE}`);
  console.log(`📊 Included ${components.length} components:`);
  
  components.forEach((component, index) => {
    console.log(`   ${index + 1}. ${component.title} (${component.name})`);
  });
  
  console.log('\n🎉 Overview page generation complete!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { scanComponents, generateOverviewContent, extractFrontmatter };