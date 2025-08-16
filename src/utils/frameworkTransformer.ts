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
 * Convert CSS style object to CSS string
 */
function convertStyleToString(styleObj: any): string {
  if (typeof styleObj === 'string') {
    return styleObj;
  }
  
  if (typeof styleObj === 'object' && styleObj !== null) {
    return Object.entries(styleObj)
      .map(([property, value]) => {
        const cssProperty = property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        return `${cssProperty}: ${value}`;
      })
      .join('; ');
  }
  
  return '';
}

/**
 * Convert CSS style string to JSX style object
 */
function convertStyleToObject(styleStr: string): Record<string, string> {
  if (!styleStr || typeof styleStr !== 'string') {
    return {};
  }
  
  return styleStr
    .split(';')
    .reduce((acc, declaration) => {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        const jsProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[jsProperty] = value;
      }
      return acc;
    }, {} as Record<string, string>);
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
    const content = String(element);
    // Skip whitespace-only text nodes during parsing
    if (!content.trim()) {
      return null;
    }
    return { type: 'text', content };
  }
  
  if (!element || typeof element !== 'object') {
    return null;
  }
  
  // Check if it's a React element
  if (!React.isValidElement(element)) {
    return null;
  }
  
  const { type, props } = element;
  
  // Debug log for troubleshooting (removed to prevent infinite loops)
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('Parsing React element:', {
  //     typeOf: typeof type,
  //     typeName: typeof type === 'function' ? type.name : type,
  //     hasProps: !!props,
  //     hasChildren: !!(props as any)?.children,
  //     childrenContent: (props as any)?.children
  //   });
  // }
  
  // Handle React elements
  if (typeof type === 'string') {
    const children = (props as any)?.children;
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
  } else if (typeof type === 'function') {
    // Handle React component functions (like ElvtButton)
    const componentName = type.name || type.displayName || 'UnknownComponent';
    const children = (props as any)?.children;
    const parsedChildren = Array.isArray(children) 
      ? children.map(parseReactElement).filter(Boolean)
      : children ? [parseReactElement(children)].filter(Boolean) : [];
    
    return {
      type: 'element',
      tagName: componentName,
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
    const trimmedContent = element.content.trim();
    // Skip whitespace-only text nodes (common between JSX elements)
    if (!trimmedContent) {
      return '';
    }
    return trimmedContent;
  }
  
  if (element.type === 'element') {
    // Special handling for paragraph tags that only contain text (common in MDX)
    if (element.tagName === 'p' && element.children?.length === 1 && element.children[0]?.type === 'text') {
      // Extract text content from unwrapped paragraphs
      return element.children[0].content.trim();
    }
    
    const tagName = element.tagName.startsWith('elvt-') || element.tagName.startsWith('Elvt')
      ? transformComponentName(element.tagName, framework)
      : element.tagName;
    
    // Generate attributes
    const attributes = Object.entries(element.attributes || {})
      .map(([key, value]) => {
        // Special handling for style attribute
        if (key === 'style') {
          if (framework === 'react') {
            // For React, keep style as object notation
            if (typeof value === 'object' && value !== null) {
              const styleEntries = Object.entries(value)
                .map(([prop, val]) => `${prop}: '${val}'`)
                .join(', ');
              return `style={{ ${styleEntries} }}`;
            } else if (typeof value === 'string') {
              // Convert CSS string to object notation
              const styleObj = convertStyleToObject(value);
              const styleEntries = Object.entries(styleObj)
                .map(([prop, val]) => `${prop}: '${val}'`)
                .join(', ');
              return `style={{ ${styleEntries} }}`;
            }
          } else {
            // Convert object style to string for other frameworks
            const styleStr = convertStyleToString(value);
            return `style="${styleStr}"`;
          }
        }
        
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
          // Only include non-empty text content, and don't add extra spacing
          return text ? `${spacing}  ${text}` : '';
        }
        return generateFrameworkCode(child, framework, indent + 1);
      })
      .filter(Boolean) // Remove empty strings
      .join('\n');
    
    // Debug log for troubleshooting (removed to prevent infinite loops)
    // if (process.env.NODE_ENV === 'development') {
    //   console.log(`Generating code for ${tagName}:`, {
    //     hasChildren,
    //     childrenCount: children.length,
    //     childrenCode: childrenCode.substring(0, 100) + (childrenCode.length > 100 ? '...' : '')
    //   });
    // }
    
    const closeTag = `${spacing}</${tagName}>`;
    
    return [openTag, childrenCode, closeTag].join('\n');
  }
  
  return '';
}

// Cache for parsed elements to prevent unnecessary re-parsing
const parseCache = new WeakMap<React.ReactElement, any>();

/**
 * Main transformer function - converts React children to framework-specific code
 */
export function transformToFramework(children: React.ReactNode, framework: string): string {
  try {
    // Parse the React children structure
    const childrenArray = React.Children.toArray(children);
    
    // Use cached parsing when possible to reduce computation
    const parsedElements = childrenArray
      .map(child => {
        if (React.isValidElement(child) && parseCache.has(child)) {
          return parseCache.get(child);
        }
        const parsed = parseReactElement(child);
        if (React.isValidElement(child) && parsed) {
          parseCache.set(child, parsed);
        }
        return parsed;
      })
      .filter(Boolean);
    
    // Generate code for the target framework
    const code = parsedElements
      .map(element => generateFrameworkCode(element, framework))
      .filter(Boolean) // Remove empty results
      .join('\n');
    
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
      return `<!-- Include in your build process -->
<script type="module" src="./dist/elevate-core-ui.js"></script>
<link rel="stylesheet" href="./dist/elevate.css">`;
    
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
      let tagName: string = '';
      
      // Handle different component types
      if (typeof child.type === 'string') {
        // DOM element or string-based component
        tagName = child.type;
      } else if (typeof child.type === 'function') {
        // React component function - get the name from the function
        tagName = child.type.name || child.type.displayName || '';
      }
      
      if (tagName && (tagName.startsWith('elvt-') || tagName.startsWith('Elvt'))) {
        components.push(tagName);
      }
      
      // Recursively check children
      if (child.props && 'children' in (child.props as object)) {
        components.push(...extractComponentNames((child.props as any).children));
      }
    }
  });
  
  return [...new Set(components)]; // Remove duplicates
}

/**
 * Transform web component code to different frameworks
 */
export function transformWebComponentCode(code: string, framework: string): string {
  if (framework === 'webcomponent' || framework === 'html') {
    return code; // Return as-is for web components and HTML
  }
  
  try {
    const config = FRAMEWORK_CONFIGS[framework];
    if (!config) return code;
    
    let transformedCode = code;
    
    // Transform component names
    transformedCode = transformedCode.replace(/<elvt-([a-zA-Z0-9-]+)/g, (match, componentName) => {
      const newName = transformComponentName(`elvt-${componentName}`, framework);
      return `<${newName}`;
    });
    
    transformedCode = transformedCode.replace(/<\/elvt-([a-zA-Z0-9-]+)>/g, (match, componentName) => {
      const newName = transformComponentName(`elvt-${componentName}`, framework);
      return `</${newName}>`;
    });
    
    // Transform attributes for React (kebab-case to camelCase)
    if (framework === 'react') {
      // Transform style attributes from CSS string to object notation
      transformedCode = transformedCode.replace(/style="([^"]+)"/g, (match, styleValue) => {
        const styleObj = convertStyleToObject(styleValue);
        const styleEntries = Object.entries(styleObj)
          .map(([prop, val]) => `${prop}: '${val}'`)
          .join(', ');
        return `style={{ ${styleEntries} }}`;
      });
      
      // Transform kebab-case attributes to camelCase
      transformedCode = transformedCode.replace(/([a-z]+)-([a-z])/g, (match, first, second) => {
        return first + second.charAt(0).toUpperCase() + second.slice(1);
      });
    }
    
    return transformedCode;
  } catch (error) {
    console.error('Error transforming web component code:', error);
    return code; // Return original on error
  }
}

/**
 * Extract component names from web component code string
 */
export function extractComponentNamesFromCode(code: string): string[] {
  const components: string[] = [];
  const regex = /<(elvt-[a-zA-Z0-9-]+)/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    const componentName = match[1];
    if (componentName.startsWith('elvt-')) {
      // Convert to React component name format
      const reactName = transformComponentName(componentName, 'react');
      components.push(reactName);
    }
  }
  
  return [...new Set(components)]; // Remove duplicates
}