import React, { useMemo } from 'react';
import { useAllDocsData, useDocById } from '@docusaurus/plugin-content-docs/client';

// Error boundary for the component
class PageCardGridErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PageCardGrid Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: 'var(--elvt-alias-layout-layer-elevated)', borderRadius: '4px', border: '1px solid var(--elvt-alias-layout-border-default)' }}>
          <h2 style={{ color: 'var(--elvt-alias-content-text-danger)' }}>PageCardGrid Error</h2>
          <p>Something went wrong while rendering the page cards.</p>
          <details>
            <summary>Error Details</summary>
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

interface PageMetadata {
  id: string;
  title: string;
  description?: string;
  sidebar?: string;
  path?: string;
}

interface GroupConfig {
  description?: string;
}

interface PageCardGridProps {
  /** Base path to scan for pages (e.g., '/components/', '/patterns/') */
  basePath: string;
  /** Manual group mapping for components */
  groupMapping?: Record<string, string>;
  /** Component icons mapping */
  icons?: Record<string, string>;
  /** Show group headers */
  showGroups?: boolean;
  /** Custom group descriptions */
  groupDescriptions?: Record<string, GroupConfig>;
}

// Default component grouping based on component names
const DEFAULT_GROUP_MAPPING: Record<string, string> = {
  // Form Elements
  'button': 'Form Elements',
  'input': 'Form Elements', 
  'checkbox': 'Form Elements',
  'radio': 'Form Elements',
  'select': 'Form Elements',
  'switch': 'Form Elements',
  'textarea': 'Form Elements',
  'field': 'Form Elements',
  'file-dropzone': 'Form Elements',
  
  // Layout Elements
  'card': 'Layout Elements',
  'divider': 'Layout Elements',
  'drawer': 'Layout Elements',
  'application': 'Layout Elements',
  
  // Navigation Elements
  'breadcrumb': 'Navigation Elements',
  'breadcrumb-item': 'Navigation Elements', 
  'menu': 'Navigation Elements',
  'menu-item': 'Navigation Elements',
  'tab': 'Navigation Elements',
  'tab-group': 'Navigation Elements',
  'link': 'Navigation Elements',
  'paginator': 'Navigation Elements',
  
  // Feedback Elements
  'notification': 'Feedback Elements',
  'toast': 'Feedback Elements',
  'tooltip': 'Feedback Elements',
  'progress': 'Feedback Elements',
  'skeleton': 'Feedback Elements',
  'empty-state': 'Feedback Elements',
  'lightbox': 'Feedback Elements',
  
  // Data Display Elements
  'table': 'Data Display Elements',
  'charts': 'Data Display Elements',
  'badge': 'Data Display Elements',
  'chip': 'Data Display Elements',
  'avatar': 'Data Display Elements',
  'indicator': 'Data Display Elements',
  
  // Interactive Elements
  'button-group': 'Interactive Elements',
  'icon-button': 'Interactive Elements',
  'expansion-panel': 'Interactive Elements',
  'expansion-panel-group': 'Interactive Elements',
  'slider': 'Interactive Elements',
  'dialog': 'Interactive Elements',
  'dropdown': 'Interactive Elements',
  
  // Content Elements
  'icon': 'Content Elements',
  'toolbar': 'Content Elements'
};

// Default icon set for common component types
const DEFAULT_ICONS: Record<string, string> = {
  // Form Elements
  button: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  input: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  checkbox: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  radio: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  select: "M7 10l5 5 5-5z",
  switch: "M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
  textarea: "M21 11.5l-1.5 1.5L17 10.5 18.5 9L21 11.5zM4 2v20l4-4h12c1.1 0 2-.9 2-2V2H4z",
  field: "M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM4 5v2h16V5H4zm0 16h16v-2H4v2z",
  "file-dropzone": "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",
  
  // Layout Elements
  card: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
  divider: "M3 11h18v2H3z",
  drawer: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  application: "M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z",
  
  // Navigation Elements  
  breadcrumb: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  "breadcrumb-item": "M10 17l5-5-5-5v10z",
  menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  "menu-item": "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  tab: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z",
  "tab-group": "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  paginator: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  
  // Feedback Elements
  notification: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  toast: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  tooltip: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  progress: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
  skeleton: "M7 6h10v2H7zm0 4h10v2H7zm0 4h7v2H7z",
  "empty-state": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  lightbox: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  
  // Data Display
  table: "M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z",
  charts: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  badge: "M20 7h-5L12 2 9 7H4l4 6-4 6h5l3 5 3-5h5l-4-6 4-6z",
  chip: "M16 4c4.42 0 8 3.58 8 8s-3.58 8-8 8H8c-4.42 0-8-3.58-8-8s3.58-8 8-8h8m-2.5 2A1.5 1.5 0 1 0 15 7.5 1.5 1.5 0 0 0 13.5 6z",
  avatar: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  indicator: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  
  // Interactive Elements
  "button-group": "M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h13v-4H8v4zm0 5h13v-4H8v4zM8 5v4h13V5H8z",
  "icon-button": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  "expansion-panel": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "expansion-panel-group": "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  slider: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
  dialog: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
  dropdown: "M7 10l5 5 5-5z",
  
  // Content Elements
  icon: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
  toolbar: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  
  // Generic
  default: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
};

// Default group descriptions
const DEFAULT_GROUP_DESCRIPTIONS: Record<string, GroupConfig> = {
  "Form Elements": {
    description: "Interactive components for user input and data collection. These components provide clear affordances, validation feedback, and accessibility features."
  },
  "Layout Elements": {
    description: "Structural components for organizing content and creating visual hierarchy. These components help establish consistent spacing, grouping, and information architecture."
  },
  "Navigation Elements": {
    description: "Components that help users understand their location and move through your application. These components improve wayfinding and reduce cognitive load."
  },
  "Feedback Elements": {
    description: "Components that communicate system status, user actions, and important information. These components help users understand what's happening and what they should do next."
  },
  "Data Display Elements": {
    description: "Components for presenting information clearly and efficiently. These components help users scan, understand, and act on data."
  },
  "Interactive Elements": {
    description: "Advanced interactive components for complex user interactions. These components provide rich functionality while maintaining usability and accessibility."
  },
  "Content Elements": {
    description: "Components for displaying and organizing textual and visual content. These components ensure consistent presentation and readability."
  }
};

function PageCardGridInner({
  basePath,
  groupMapping = {},
  icons = {},
  showGroups = true,
  groupDescriptions = {}
}: PageCardGridProps) {
  const allDocsData = useAllDocsData();
  
  const processedPages = useMemo(() => {
    if (!allDocsData?.default?.versions?.[0]?.docs) {
      console.warn('PageCardGrid: No docs data available');
      return { pages: [], groups: {} };
    }
    
    const version = allDocsData.default.versions[0];
    const allGroupMapping = { ...DEFAULT_GROUP_MAPPING, ...groupMapping };
    
    // Get all document IDs that match our base path
    const matchingDocEntries = Object.entries(version.docs).filter(([key, docRef]) => {
      if (!docRef?.id) return false;
      
      // Convert ID to path for matching
      const docPath = `/${docRef.id.replace(/\/index$/, '/')}/`;
      return docPath.startsWith(basePath) && docPath !== basePath;
    });
    
    // Fetch full document data for each matching doc
    const pages: (PageMetadata & { group: string; slug: string })[] = [];
    
    matchingDocEntries.forEach(([key, docRef]) => {
      try {
        const doc = useDocById(docRef.id);
        if (doc) {
          // Extract component name from ID for grouping
          const pathParts = doc.id.split('/');
          const componentName = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
          const group = allGroupMapping[componentName] || 'Other Components';
          
          pages.push({
            ...doc,
            group,
            slug: componentName,
            // Use the doc's actual route path which includes the docs prefix
            path: doc.path
          });
        }
      } catch (error) {
        console.warn('Could not fetch doc:', docRef.id, error);
      }
    });
    
    // Sort pages by title
    pages.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    
    // Group pages
    const groups: Record<string, typeof pages> = {};
    
    if (showGroups) {
      pages.forEach(page => {
        const groupName = page.group;
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(page);
      });
    } else {
      groups['All'] = pages;
    }
    
    return { pages, groups };
  }, [allDocsData, basePath, groupMapping, showGroups]);
  
  const allIcons = { ...DEFAULT_ICONS, ...icons };
  const allGroupDescriptions = { ...DEFAULT_GROUP_DESCRIPTIONS, ...groupDescriptions };
  
  const getIconForPage = (page: { slug: string }) => {
    return allIcons[page.slug] || allIcons.default;
  };
  
  if (processedPages.pages.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--elvt-alias-content-text-muted)' }}>
        <p>No pages found in {basePath}</p>
        <p style={{ fontSize: '0.9rem' }}>Looking for documents with IDs starting with: {basePath.replace(/^\//, '').replace(/\/$/, '')}</p>
      </div>
    );
  }
  
  return (
    <div>
      {Object.entries(processedPages.groups).map(([groupName, pages]) => (
        <div key={groupName} style={{ marginBottom: showGroups && Object.keys(processedPages.groups).length > 1 ? '3rem' : '0' }}>
          {showGroups && Object.keys(processedPages.groups).length > 1 && (
            <>
              <h2>
                {groupName}
              </h2>
              {allGroupDescriptions[groupName]?.description && (
                <p style={{ 
                  marginBottom: '1.5rem',
                  color: 'var(--elvt-alias-content-text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {allGroupDescriptions[groupName].description}
                </p>
              )}
            </>
          )}
          
          <elvt-stack direction="row" wrap gap="m" alignment="start">
            {pages.map((page) => {
              const icon = getIconForPage(page);
              
              return (
                <elvt-card key={page.id} padding="m" style={{ 
                  minWidth: '300px', 
                  flex: '1 1 300px',
                  height: '224px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <elvt-stack slot="header" distribution="stretch-start">
                    <b>{page.title}</b>
                    <elvt-icon icon={icon} style={{"--icon-size": "1rem"}}></elvt-icon>
                  </elvt-stack>
                  <p style={{ 
                    margin: '0 0 1rem 0', 
                    lineHeight: '1.5',
                    flex: '1',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {page.description || `${page.title} documentation`}
                  </p>
                  <a href={page.path} style={{ color: 'var(--elvt-alias-content-link-default)', textDecoration: 'none' }}>
                    Learn more →
                  </a>
                </elvt-card>
              );
            })}
          </elvt-stack>
        </div>
      ))}
    </div>
  );
}

export default function PageCardGrid(props: PageCardGridProps) {
  return (
    <PageCardGridErrorBoundary>
      <PageCardGridInner {...props} />
    </PageCardGridErrorBoundary>
  );
}