import React, { useMemo } from 'react';
import styles from './styles.module.css';

interface ColorToken {
  name: string;
  variable: string;
  value: string;
  description?: string;
}

interface ColorRampProps {
  selector: string;
  title?: string;
  template?: 'default' | 'compact' | 'detailed' | 'custom' | 'simple' | 'badge' | 'card' | 'table-row' | 'accessibility' | 'swatch-grid';
  customTemplate?: string;
  showVariableName?: boolean;
  showHexValue?: boolean;
  showDescription?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  columns?: number;
  sortBy?: 'semantic' | 'brightness' | 'alphabetic' | 'hue';
  groupBy?: 'color' | 'scale' | 'none';
  includeShades?: number[];
  excludeShades?: number[];
}

// Extract design tokens from CSS by dynamically reading computed styles
const extractColorTokens = (selector: string): ColorToken[] => {
  const tokens: ColorToken[] = [];
  
  // Get all CSS custom properties from root
  const computedStyle = getComputedStyle(document.documentElement);
  
  // Convert selector pattern to regex
  const pattern = selector
    .replace(/\*/g, '([^-]+)')
    .replace(/\//g, '-')
    .replace(/-{2,}/g, '-');
  
  const regex = new RegExp(`^--elvt-${pattern}$`, 'i');
  
  // Get all CSS custom properties
  const cssVars = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules);
      } catch {
        return [];
      }
    })
    .flatMap(rule => {
      if (rule instanceof CSSStyleRule) {
        return Array.from(rule.style);
      }
      return [];
    })
    .filter(prop => prop.startsWith('--elvt-'))
    .filter(prop => regex.test(prop));

  // Extract unique properties and their values
  const uniqueVars = [...new Set(cssVars)];
  
  uniqueVars.forEach(variable => {
    const value = computedStyle.getPropertyValue(variable).trim();
    
    // Only include color values (rgb, hsl, hex, or color names)
    if (value && (
      value.startsWith('rgb') || 
      value.startsWith('hsl') || 
      value.startsWith('#') ||
      /^[a-z]+$/i.test(value) // color names like "red", "blue"
    )) {
      const name = variable
        .replace('--elvt-', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      tokens.push({
        name,
        variable,
        value,
        description: generateDescription(variable, value)
      });
    }
  });

  return tokens.sort((a, b) => a.name.localeCompare(b.name));
};

const generateDescription = (variable: string, value: string): string => {
  const parts = variable.split('-');
  if (parts.includes('primitives')) {
    const color = parts.find(p => ['blue', 'red', 'green', 'yellow', 'purple', 'gray', 'orange'].includes(p));
    const shade = parts.find(p => /^\d+$/.test(p));
    if (color && shade) {
      const lightness = parseInt(shade) < 500 ? 'light' : parseInt(shade) > 500 ? 'dark' : 'medium';
      return `${color} primitive color - ${lightness} shade (${shade})`;
    }
  }
  
  if (parts.includes('component')) {
    return `Component-specific color token`;
  }
  
  return 'ELEVATE design system color token';
};

// Extract numeric shade from token variable name
const extractShade = (variable: string): number => {
  const match = variable.match(/(\d+)(?!.*\d)/); // Last number in the string
  return match ? parseInt(match[1]) : 999999; // Default high number for non-numeric tokens
};

// Extract color name from token variable
const extractColorName = (variable: string): string => {
  const colorMatch = variable.match(/--elvt-(?:primitives-)?color-([a-z]+)-/);
  return colorMatch ? colorMatch[1] : variable;
};

// Convert RGB/HSL to brightness value (0-255)
const calculateBrightness = (colorValue: string): number => {
  // Handle rgb() values
  const rgbMatch = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Use perceived brightness formula
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  // Handle hex values (if any)
  const hexMatch = colorValue.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  // Handle hsl() values
  const hslMatch = colorValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    // Approximate brightness from lightness
    return Math.round((l / 100) * 255);
  }
  
  // Default fallback
  return 128;
};

// Sorting functions
const sortTokens = (tokens: ColorToken[], sortBy: string): ColorToken[] => {
  const sorted = [...tokens];
  
  switch (sortBy) {
    case 'semantic':
      return sorted.sort((a, b) => {
        // First sort by color name
        const colorA = extractColorName(a.variable);
        const colorB = extractColorName(b.variable);
        
        if (colorA !== colorB) {
          return colorA.localeCompare(colorB);
        }
        
        // Then by shade number (50 -> 1000)
        const shadeA = extractShade(a.variable);
        const shadeB = extractShade(b.variable);
        return shadeA - shadeB;
      });
      
    case 'brightness':
      return sorted.sort((a, b) => {
        const brightnessA = calculateBrightness(a.value);
        const brightnessB = calculateBrightness(b.value);
        return brightnessB - brightnessA; // Light to dark
      });
      
    case 'alphabetic':
      return sorted.sort((a, b) => a.variable.localeCompare(b.variable));
      
    case 'hue':
      return sorted.sort((a, b) => {
        // Extract hue from HSL values or approximate from color names
        const getHue = (token: ColorToken): number => {
          const hslMatch = token.value.match(/hsl\((\d+),/);
          if (hslMatch) {
            return parseInt(hslMatch[1]);
          }
          
          // Fallback to color name mapping
          const colorName = extractColorName(token.variable);
          const hueOrder = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'purple', 'pink', 'gray'];
          return hueOrder.indexOf(colorName) !== -1 ? hueOrder.indexOf(colorName) : 999;
        };
        
        const hueA = getHue(a);
        const hueB = getHue(b);
        
        if (hueA !== hueB) {
          return hueA - hueB;
        }
        
        // If same hue, sort by shade
        return extractShade(a.variable) - extractShade(b.variable);
      });
      
    default:
      return sorted;
  }
};

// Template registry - predefined templates from HTML files
const templateRegistry: Record<string, string> = {
  'simple': `<div class="color-swatch" title="{{name}}"></div>
<div class="token-info">
  <strong>{{shade}}</strong>
</div>`,

  'badge': `<div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 6px; border: 1px solid #ddd;">
  <div class="color-swatch" style="width: 20px; height: 20px; border-radius: 50%;"></div>
  <span>{{colorName}}-{{shade}}</span>
</div>`,

  'card': `<div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div class="color-swatch" style="height: 60px;"></div>
  <div style="padding: 12px;">
    <h4 style="margin: 0 0 8px 0;">{{name}}</h4>
    <code class="token-variable">{{variable}}</code>
    <br>
    <code class="token-value">{{value}}</code>
    <p style="font-size: 0.8em; color: #666; margin: 8px 0 0 0;">
      Brightness: {{brightness}} | Index: {{index}}
    </p>
  </div>
</div>`,

  'table-row': `<tr style="border-bottom: 1px solid #eee;">
  <td><div class="color-swatch" style="width: 30px; height: 30px; border-radius: 4px;"></div></td>
  <td>{{name}}</td>
  <td><code>{{variable}}</code></td>
  <td><code>{{value}}</code></td>
  <td>{{brightness}}/255</td>
</tr>`,

  'accessibility': `<div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 0.5rem;">
  <div class="color-swatch" style="width: 50px; height: 50px; border-radius: 6px;"></div>
  <div style="flex: 1;">
    <h4 style="margin: 0;">{{name}}</h4>
    <p style="margin: 0.25rem 0; font-family: monospace;">{{value}}</p>
    <p style="margin: 0; font-size: 0.9em; color: #666;">
      Contrast: \${parseInt('{{brightness}}') > 127 ? 'Use dark text' : 'Use light text'}
      (Brightness: {{brightness}})
    </p>
  </div>
</div>`,

  'swatch-grid': `<div style="text-align: center;">
  <div class="color-swatch" style="width: 60px; height: 60px; border-radius: 8px; margin: 0 auto 8px;"></div>
  <div style="font-size: 0.8em;">{{shade}}</div>
</div>`,
};

// Micro-template engine with variable substitution
const parseTemplate = (template: string, variables: Record<string, any>): string => {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
    const keys = path.split('.');
    let value = variables;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return match;
    }
    
    return String(value);
  });
};

const renderCustomTemplate = (tokens: ColorToken[], customTemplate: string, props: ColorRampProps): JSX.Element => {
  const tokenElements = tokens.map((token, index) => {
    const variables = {
      name: token.name,
      variable: token.variable,
      value: token.value,
      description: token.description || '',
      index: index,
      brightness: calculateBrightness(token.value),
      shade: extractShade(token.variable),
      colorName: extractColorName(token.variable)
    };
    
    const htmlString = parseTemplate(customTemplate, variables);
    
    return (
      <div
        key={token.variable}
        className={styles.customTemplateItem}
        dangerouslySetInnerHTML={{ __html: htmlString }}
        style={{ '--token-color': token.value } as React.CSSProperties}
      />
    );
  });
  
  return <div className={styles.customTemplate}>{tokenElements}</div>;
};

const renderTemplate = (
  tokens: ColorToken[], 
  template: string, 
  props: ColorRampProps
): JSX.Element => {
  // Check if it's a predefined template from the registry
  if (templateRegistry[template]) {
    return renderCustomTemplate(tokens, templateRegistry[template], props);
  }
  
  // Handle custom template
  if (template === 'custom' && props.customTemplate) {
    return renderCustomTemplate(tokens, props.customTemplate, props);
  }

  // Fall back to built-in templates
  return <div className={styles.defaultTemplate}>{renderDefaultTemplate(tokens, props)}</div>;
};

const renderDefaultTemplate = (tokens: ColorToken[], props: ColorRampProps): JSX.Element[] => {
  return tokens.map((token, index) => (
    <div 
      key={token.variable} 
      className={`${styles.colorToken} ${styles[`size-${props.size || 'medium'}`]}`}
    >
      <div 
        className={styles.colorSwatch}
        style={{ backgroundColor: token.value }}
        title={`${token.name}: ${token.value}`}
      />
      <div className={styles.tokenInfo}>
        {props.showVariableName !== false && (
          <code className={styles.variableName}>{token.variable}</code>
        )}
        <div className={styles.tokenName}>{token.name}</div>
        {props.showHexValue && (
          <code className={styles.hexValue}>{token.value}</code>
        )}
        {props.showDescription && token.description && (
          <div className={styles.description}>{token.description}</div>
        )}
      </div>
    </div>
  ));
};

const ColorRamp: React.FC<ColorRampProps> = ({
  selector,
  title,
  template = 'default',
  customTemplate,
  showVariableName = true,
  showHexValue = false,
  showDescription = false,
  orientation = 'vertical',
  size = 'medium',
  columns,
  sortBy = 'semantic',
  groupBy = 'none',
  includeShades,
  excludeShades,
  ...props
}) => {
  const tokens = useMemo(() => {
    let extractedTokens = extractColorTokens(selector);
    
    // Filter by include/exclude shades
    if (includeShades) {
      extractedTokens = extractedTokens.filter(token =>
        includeShades.some(shade => token.variable.includes(`-${shade}`))
      );
    }
    
    if (excludeShades) {
      extractedTokens = extractedTokens.filter(token =>
        !excludeShades.some(shade => token.variable.includes(`-${shade}`))
      );
    }
    
    // Sort tokens using the new sorting system
    extractedTokens = sortTokens(extractedTokens, sortBy);
    
    return extractedTokens;
  }, [selector, includeShades, excludeShades, sortBy]);

  const groupedTokens = useMemo(() => {
    if (groupBy === 'none') return { 'All Colors': tokens };
    
    if (groupBy === 'color') {
      return tokens.reduce((groups, token) => {
        const colorMatch = token.variable.match(/--elvt-primitives-color-([a-z]+)-/);
        const color = colorMatch ? colorMatch[1] : 'Other';
        const key = color.charAt(0).toUpperCase() + color.slice(1);
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(token);
        
        return groups;
      }, {} as Record<string, ColorToken[]>);
    }
    
    if (groupBy === 'scale') {
      return tokens.reduce((groups, token) => {
        const scaleMatch = token.variable.match(/--elvt-primitives-color-[a-z]+-(\d+)/);
        const scale = scaleMatch ? parseInt(scaleMatch[1]) : 0;
        const key = scale < 500 ? 'Light Shades' : scale === 500 ? 'Base Colors' : 'Dark Shades';
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(token);
        
        return groups;
      }, {} as Record<string, ColorToken[]>);
    }
    
    return { 'All Colors': tokens };
  }, [tokens, groupBy]);

  if (tokens.length === 0) {
    return (
      <div className={styles.noTokens}>
        <p>No color tokens found matching selector: <code>{selector}</code></p>
        <p>Try patterns like:</p>
        <ul>
          <li><code>primitives-color-blue-*</code></li>
          <li><code>primitives-color-*-500</code></li>
          <li><code>*-color-*</code></li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.colorRamp}>
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.metadata}>
        <span className={styles.tokenCount}>
          {tokens.length} token{tokens.length !== 1 ? 's' : ''} found
        </span>
        <code className={styles.selectorPattern}>{selector}</code>
      </div>

      <div 
        className={`
          ${styles.tokenGrid} 
          ${styles[`orientation-${orientation}`]}
          ${styles[`template-${template}`]}
        `}
        style={{ 
          gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : undefined 
        }}
      >
        {Object.entries(groupedTokens).map(([groupName, groupTokens]) => (
          <div key={groupName} className={styles.tokenGroup}>
            {Object.keys(groupedTokens).length > 1 && (
              <h4 className={styles.groupTitle}>{groupName}</h4>
            )}
            <div className={styles.groupTokens}>
              {template === 'custom' ? 
                renderTemplate(groupTokens, customTemplate || '', props as ColorRampProps) :
                renderDefaultTemplate(groupTokens, { 
                  showVariableName, 
                  showHexValue, 
                  showDescription, 
                  size 
                } as ColorRampProps)
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorRamp;