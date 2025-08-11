/**
 * Framework Transformer Utilities
 * Converts React children with ELEVATE web components to various framework syntaxes
 */

import React from 'react';

export interface FrameworkSyntax {
  componentPrefix: string;
  attributeStyle: 'camelCase' | 'kebab-case';
  eventHandling: string;
  slotSyntax: string;
  closingTagStyle: 'self-closing' | 'explicit';
}

export const FRAMEWORK_CONFIGS: Record<string, FrameworkSyntax> = {
  webcomponent: {
    componentPrefix: 'elvt-',
    attributeStyle: 'kebab-case',
    eventHandling: '@event="handler"',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'explicit'
  },
  react: {
    componentPrefix: 'Elvt',
    attributeStyle: 'camelCase',
    eventHandling: 'onEvent={handler}',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'self-closing'
  },
  angular: {
    componentPrefix: 'elvt-',
    attributeStyle: 'kebab-case',
    eventHandling: '(event)="handler($event)"',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'explicit'
  },
  vue: {
    componentPrefix: 'elvt-',
    attributeStyle: 'kebab-case',
    eventHandling: '@event="handler"',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'explicit'
  },
  svelte: {
    componentPrefix: 'elvt-',
    attributeStyle: 'kebab-case',
    eventHandling: 'on:event={handler}',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'explicit'
  },
  html: {
    componentPrefix: 'elvt-',
    attributeStyle: 'kebab-case',
    eventHandling: 'addEventListener("event", handler)',
    slotSyntax: 'slot="name"',
    closingTagStyle: 'explicit'
  }
};

/**
 * Convert attribute name between camelCase and kebab-case
 */
function convertAttributeName(attr: string, style: 'camelCase' | 'kebab-case'): string {
  if (style === 'kebab-case') {
    return attr.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  } else {
    return attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

/**
 * Transform component name based on framework
 */
function transformComponentName(name: string, framework: string): string {
  const config = FRAMEWORK_CONFIGS[framework];
  
  // Remove elvt- prefix if present
  const baseName = name.replace(/^elvt-/, '');
  
  if (framework === 'react') {
    // Convert to PascalCase for React
    return config.componentPrefix + baseName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
  
  return config.componentPrefix + baseName;
}

/**
 * Parse React element tree and extract component information
 */
function parseReactElement(element: unknown): any {
  if (typeof element === 'string' || typeof element === 'number') {
    return { type: 'text', content: String(element) };
  }
  
  if (!element || typeof element !== 'object') {
    return null;
  }
  
  // Check if it's a React element
  if (!React.isValidElement(element)) {
    return null;
  }
  
  const { type, props } = element;
  
  // Handle React elements
  if (typeof type === 'string') {
    const children = props?.children;
    const parsedChildren = Array.isArray(children) 
      ? children.map(parseReactElement).filter(Boolean)
      : children ? [parseReactElement(children)].filter(Boolean) : [];
    
    return {
      type: 'element',
      tagName: type,
      attributes: Object.entries(props || {})
        .filter(([key]) => key !== 'children')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      children: parsedChildren
    };
  }
  
  return null;
}

/**
 * Generate framework-specific code from parsed element structure
 */
function generateFrameworkCode(element: any, framework: string, indent = 0): string {
  if (!element) return '';
  
  const config = FRAMEWORK_CONFIGS[framework];
  const spacing = '  '.repeat(indent);
  
  if (element.type === 'text') {
    return element.content.trim();
  }
  
  if (element.type === 'element') {
    const tagName = element.tagName.startsWith('elvt-') || element.tagName.startsWith('Elvt')
      ? transformComponentName(element.tagName, framework)
      : element.tagName;
    
    // Generate attributes
    const attributes = Object.entries(element.attributes || {})
      .map(([key, value]) => {
        const attrName = convertAttributeName(key, config.attributeStyle);
        
        // Handle different value types
        if (typeof value === 'boolean') {
          return framework === 'react' ? `${attrName}={${value}}` : 
                 value ? attrName : '';
        }
        
        if (typeof value === 'string') {
          return framework === 'react' ? `${attrName}="${value}"` : `${attrName}="${value}"`;
        }
        
        return `${attrName}="${value}"`;
      })
      .filter(Boolean)
      .join(' ');
    
    // Generate children
    const children = element.children || [];
    const hasChildren = children.length > 0;
    
    if (!hasChildren && config.closingTagStyle === 'self-closing' && framework === 'react') {
      return `${spacing}<${tagName}${attributes ? ' ' + attributes : ''} />`;
    }
    
    const openTag = `${spacing}<${tagName}${attributes ? ' ' + attributes : ''}>`;
    
    if (!hasChildren) {
      return `${openTag}</${tagName}>`;
    }
    
    // Handle children
    const childrenCode = children
      .map((child: any) => {
        if (child.type === 'text') {
          const text = child.content.trim();
          return text ? `${spacing}  ${text}` : '';
        }
        return generateFrameworkCode(child, framework, indent + 1);
      })
      .filter(Boolean)
      .join('\n');
    
    const closeTag = `${spacing}</${tagName}>`;
    
    return [openTag, childrenCode, closeTag].join('\n');
  }
  
  return '';
}

/**
 * Main transformer function - converts React children to framework-specific code
 */
export function transformToFramework(children: React.ReactNode, framework: string): string {
  try {
    // Parse the React children structure
    const parsedElements = React.Children.toArray(children)
      .map(parseReactElement)
      .filter(Boolean);
    
    // Generate code for the target framework
    const code = parsedElements
      .map(element => generateFrameworkCode(element, framework))
      .join('\n\n');
    
    return code.trim();
  } catch (error) {
    console.error('Error transforming to framework:', error);
    return '// Error generating code for this framework';
  }
}

/**
 * Get import statements for each framework
 */
export function getFrameworkImports(framework: string, components: string[]): string {
  const uniqueComponents = [...new Set(components)];
  
  switch (framework) {
    case 'webcomponent':
      return `// Web Components are auto-registered
import '@inform-elevate/elevate-core-ui';`;
    
    case 'react':
      return `// React wrappers
import { ${uniqueComponents.join(', ')} } from '@inform-elevate/elevate-core-ui/react';`;
    
    case 'angular':
      return `// Import Angular module
import { ElevateModule } from '@inform-elevate/elevate-core-ui/angular';

// Add to your module imports:
// imports: [ElevateModule]`;
    
    case 'vue':
      return `// Vue plugin
import { ElevatePlugin } from '@inform-elevate/elevate-core-ui/vue';

// Use plugin in your app:
// app.use(ElevatePlugin);`;
    
    case 'svelte':
      return `// Svelte components
import { ${uniqueComponents.join(', ')} } from '@inform-elevate/elevate-core-ui/svelte';`;
    
    case 'html':
      return `<!-- Include via CDN -->
<script type="module" src="https://unpkg.com/@inform-elevate/elevate-core-ui@latest/dist/elevate-core-ui/elevate-core-ui.esm.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@inform-elevate/elevate-core-ui@latest/dist/elevate-core-ui/elevate-core-ui.css">`;
    
    default:
      return '// Framework not supported';
  }
}

/**
 * Extract component names from React children
 */
export function extractComponentNames(children: React.ReactNode): string[] {
  const components: string[] = [];
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const tagName = child.type as string;
      if (tagName?.startsWith('elvt-') || tagName?.startsWith('Elvt')) {
        components.push(tagName);
      }
      
      // Recursively check children
      if (child.props && 'children' in child.props) {
        components.push(...extractComponentNames(child.props.children));
      }
    }
  });
  
  return [...new Set(components)]; // Remove duplicates
}