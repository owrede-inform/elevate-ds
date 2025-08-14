import React, { useMemo } from 'react';

// Import template modules with proper container + item pairing
import * as defaultTemplate from './templates/default';
import * as defaultWithTitleTemplate from './templates/default-with-title';
import * as tableTemplate from './templates/table';
import * as cardTemplate from './templates/card';
import * as simpleTemplate from './templates/simple';
import * as badgeTemplate from './templates/badge';
import * as accessibilityTemplate from './templates/accessibility';
import * as swatchGridTemplate from './templates/swatch-grid';
import * as tableRowTemplate from './templates/table-row';

interface ColorToken {
  name: string;
  variable: string;
  value: string;
  description?: string;
}

interface ColorRampProps {
  selector: string; // Single selector or comma-separated list
  exclude?: string; // Single exclude pattern or comma-separated list  
  title?: string;
  template?: string; // Now accepts any template name with fallback to default
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

// Parse comma-separated selectors into array
const parseSelectors = (selectorString: string): string[] => {
  return selectorString
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

// Check if a token matches any exclude pattern
const matchesExcludePattern = (variable: string, excludePatterns: string[]): boolean => {
  return excludePatterns.some(pattern => {
    const regexPattern = pattern
      .replace(/\*/g, '([^-]+)')
      .replace(/\//g, '-')
      .replace(/-{2,}/g, '-');
    const regex = new RegExp(`^--elvt-${regexPattern}$`, 'i');
    return regex.test(variable);
  });
};

// Extract design tokens from CSS by dynamically reading computed styles
const extractColorTokens = (selectorString: string, excludeString?: string): ColorToken[] => {
  const tokens: ColorToken[] = [];
  const selectors = parseSelectors(selectorString);
  const excludePatterns = excludeString ? parseSelectors(excludeString) : [];
  
  // Get computed styles from document root
  const computedStyle = getComputedStyle(document.documentElement);
  
  // Get all available CSS custom properties from computed styles
  // This is more reliable than parsing stylesheets which might not be accessible
  const allCssVars = new Set<string>();
  
  // Method 1: Read from computed styles of document element
  for (let i = 0; i < computedStyle.length; i++) {
    const prop = computedStyle.item(i);
    if (prop.startsWith('--elvt-')) {
      allCssVars.add(prop);
    }
  }
  
  // Method 2: Check for commonly expected ELEVATE token patterns
  // This helps when computed styles don't expose all properties
  const commonPatterns = [
    'primitives-color-blue-', 'primitives-color-red-', 'primitives-color-green-', 
    'primitives-color-yellow-', 'primitives-color-purple-', 'primitives-color-gray-',
    'primitives-color-orange-', 'primitives-color-black', 'primitives-color-white',
    'alias-color-', 'component-'
  ];
  
  const commonShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '1000'];
  
  commonPatterns.forEach(pattern => {
    if (pattern.endsWith('-')) {
      // Pattern with shades
      commonShades.forEach(shade => {
        const variable = `--elvt-${pattern}${shade}`;
        const value = computedStyle.getPropertyValue(variable);
        if (value && value.trim()) {
          allCssVars.add(variable);
        }
      });
    } else {
      // Single color pattern (like black, white)
      const variable = `--elvt-${pattern}`;
      const value = computedStyle.getPropertyValue(variable);
      if (value && value.trim()) {
        allCssVars.add(variable);
      }
    }
  });
  
  // Method 3: Try to parse from stylesheets (if accessible)
  try {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            Array.from(rule.style).forEach(prop => {
              if (prop.startsWith('--elvt-')) {
                allCssVars.add(prop);
              }
            });
          }
        });
      } catch (e) {
        // Ignore CORS errors or other stylesheet access issues
        console.debug('Could not access stylesheet:', e);
      }
    });
  } catch (e) {
    console.debug('Could not access stylesheets:', e);
  }

  // Match tokens against all selectors
  const matchedVars = new Set<string>();
  
  selectors.forEach(selector => {
    // Convert selector pattern to regex
    const pattern = selector
      .replace(/\*/g, '([^-]+)')
      .replace(/\//g, '-')
      .replace(/-{2,}/g, '-');
    
    const regex = new RegExp(`^--elvt-${pattern}$`, 'i');
    
    // Add matching properties to set
    Array.from(allCssVars)
      .filter(prop => regex.test(prop))
      .forEach(prop => matchedVars.add(prop));
  });

  // Extract unique properties and their values, filtering out excludes
  const uniqueVars = [...matchedVars].filter(variable => 
    !matchesExcludePattern(variable, excludePatterns)
  );
  
  uniqueVars.forEach(variable => {
    const value = computedStyle.getPropertyValue(variable).trim();
    
    // Debug log to see what values we're getting
    if (process.env.NODE_ENV === 'development') {
      console.log(`ColorRamp token: ${variable} = "${value}"`);
    }
    
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
    } else if (!value) {
      // Log missing values for debugging
      if (process.env.NODE_ENV === 'development') {
        console.warn(`ColorRamp: No value found for ${variable}`);
      }
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

// Convert color value to RGB array [r, g, b]
const parseColorToRGB = (colorValue: string): [number, number, number] => {
  // Handle rgb() values
  const rgbMatch = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    return [r, g, b];
  }
  
  // Handle hex values (if any)
  const hexMatch = colorValue.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
  }
  
  // Handle hsl() values - convert to RGB
  const hslMatch = colorValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs((hNorm * 6) % 2 - 1));
    const m = lNorm - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (hNorm >= 0 && hNorm < 1/6) { r = c; g = x; b = 0; }
    else if (hNorm >= 1/6 && hNorm < 2/6) { r = x; g = c; b = 0; }
    else if (hNorm >= 2/6 && hNorm < 3/6) { r = 0; g = c; b = x; }
    else if (hNorm >= 3/6 && hNorm < 4/6) { r = 0; g = x; b = c; }
    else if (hNorm >= 4/6 && hNorm < 5/6) { r = x; g = 0; b = c; }
    else if (hNorm >= 5/6 && hNorm < 1) { r = c; g = 0; b = x; }
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }
  
  // Default fallback
  return [128, 128, 128];
};

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Convert RGB/HSL to brightness value (0-255)
const calculateBrightness = (colorValue: string): number => {
  const [r, g, b] = parseColorToRGB(colorValue);
  // Use perceived brightness formula
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
};

// Calculate WCAG contrast ratio
const calculateContrastRatio = (color1: [number, number, number], color2: [number, number, number]): number => {
  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Calculate contrast to white (for light mode) and format it
const calculateContrastToWhite = (colorValue: string): string => {
  const colorRGB = parseColorToRGB(colorValue);
  const whiteRGB: [number, number, number] = [255, 255, 255];
  const ratio = calculateContrastRatio(colorRGB, whiteRGB);
  return ratio.toFixed(2);
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

// Template registry using imported modules with proper container + item pairing
interface TemplateModule {
  container: string;
  item: string;
}

const templateRegistry: Record<string, TemplateModule> = {
  'default': defaultTemplate,
  'default-with-title': defaultWithTitleTemplate,
  'table': tableTemplate,
  'card': cardTemplate,
  'simple': simpleTemplate,
  'badge': badgeTemplate,
  'accessibility': accessibilityTemplate,
  'swatch-grid': swatchGridTemplate,
  'table-row': tableRowTemplate,
};

// Template lookup function with fallback
const getTemplate = (templateName: string): TemplateModule => {
  return templateRegistry[templateName] || templateRegistry['default'];
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

// Get template module (already has container and item separated)
const getTemplateModule = (templateName: string): TemplateModule => {
  return getTemplate(templateName);
};

const renderCustomTemplate = (tokens: ColorToken[], template: TemplateModule, props: ColorRampProps): JSX.Element => {
  const { container, item } = template;
  
  // Render all token items with individual styling
  const tokenItemsHtml = tokens.map((token, index) => {
    const [r, g, b] = parseColorToRGB(token.value);
    const variables = {
      name: token.name,
      variable: token.variable,
      value: token.value,
      description: token.description || '',
      index: index,
      brightness: calculateBrightness(token.value),
      shade: extractShade(token.variable),
      colorName: extractColorName(token.variable),
      hex: rgbToHex(r, g, b),
      contrast: calculateContrastToWhite(token.value)
    };
    
    // Replace {{color}} and {{token-color}} placeholders directly in the template
    let itemHtml = parseTemplate(item, variables);
    
    // Replace color placeholders with actual values
    itemHtml = itemHtml.replace(/var\(--token-color\)/g, token.value);
    itemHtml = itemHtml.replace(/\{\{color\}\}/g, token.value);
    
    // Return the processed template directly without wrapper
    return itemHtml;
  }).join('\n');
  
  // Template variables for container (title, selector, count, etc.)
  const containerVariables = {
    items: tokenItemsHtml,
    title: props.title || '',
    selector: props.selector || '',
    tokenCount: tokens.length,
    tokenCountText: `${tokens.length} token${tokens.length !== 1 ? 's' : ''}`,
  };
  
  // Insert template variables into container
  const finalHtml = parseTemplate(container, containerVariables);
  
  
  return (
    <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
  );
};

const renderTemplate = (
  tokens: ColorToken[], 
  templateName: string, 
  props: ColorRampProps
): JSX.Element => {
  // Handle custom template first
  if (templateName === 'custom' && props.customTemplate) {
    // Parse custom template in old format for backwards compatibility
    const customTemplate = parseCustomTemplate(props.customTemplate);
    return renderCustomTemplate(tokens, customTemplate, props);
  }
  
  // Get template module (with automatic fallback to default)
  const template = getTemplateModule(templateName);
  return renderCustomTemplate(tokens, template, props);
};

// Parse old-style custom templates for backwards compatibility
const parseCustomTemplate = (customTemplate: string): TemplateModule => {
  const parts = customTemplate.split('<!-- ITEM -->');
  
  if (parts.length === 2) {
    const container = parts[0].replace('<!-- CONTAINER -->', '').trim();
    const item = parts[1].trim();
    return { container, item };
  } else {
    // Legacy format: item only (wrap in simple container)
    return {
      container: '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">{{items}}</div>',
      item: customTemplate.trim()
    };
  }
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
    // Small delay to ensure ELEVATE CSS is fully loaded
    const ensureElevateLoaded = () => {
      const testTokens = [
        '--elvt-primitives-color-blue-500',
        '--elvt-primitives-color-gray-500',
        '--elvt-primitives-color-green-500'
      ];
      
      const computedStyle = getComputedStyle(document.documentElement);
      const loadedCount = testTokens.filter(token => 
        computedStyle.getPropertyValue(token).trim()
      ).length;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`ColorRamp: ELEVATE tokens loaded: ${loadedCount}/${testTokens.length}`);
      }
      
      return loadedCount > 0;
    };
    
    // Check if ELEVATE is loaded, if not, try again after a short delay
    if (!ensureElevateLoaded()) {
      setTimeout(() => {
        // Force re-render by updating a dummy state if needed
        if (process.env.NODE_ENV === 'development') {
          console.warn('ColorRamp: ELEVATE tokens not found, retrying...');
        }
      }, 100);
    }
    
    let extractedTokens = extractColorTokens(selector, props.exclude);
    
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`ColorRamp: Found ${extractedTokens.length} tokens for selector "${selector}"`);
    }
    
    return extractedTokens;
  }, [selector, props.exclude, includeShades, excludeShades, sortBy]);

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

  // If no tokens found, return empty div (templates could handle this case if needed)
  if (tokens.length === 0) {
    return <div className="colorramp-wrapper"></div>;
  }

  // Simple wrapper - let templates control everything else
  return (
    <div className="colorramp-wrapper">
      {renderTemplate(tokens, template, { 
        customTemplate,
        showVariableName, 
        showHexValue, 
        showDescription, 
        size,
        template,
        title,
        selector
      } as ColorRampProps)}
    </div>
  );
};

export default ColorRamp;