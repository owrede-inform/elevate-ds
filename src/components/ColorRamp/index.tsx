import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface ColorRampProps {
  title?: string;
  selector?: string;
  exclude?: string;
  template?: 'default' | 'simple' | 'table' | 'card';
  sortBy?: 'semantic' | 'brightness' | 'alphabetic';
  includeShades?: number[];
  showHexValue?: boolean;
}

interface ColorToken {
  name: string;
  value: string;
  cssVar: string;
  hex: string;
  brightness: number;
  shade: string;
}

// Template imports
const templates = {
  default: () => import('./templates/default'),
  simple: () => import('./templates/simple'),
  table: () => import('./templates/table'),
  card: () => import('./templates/card'),
};

const ColorRamp: React.FC<ColorRampProps> = ({
  title,
  selector,
  exclude,
  template = 'default',
  sortBy = 'semantic',
  includeShades,
  showHexValue = false
}) => {
  const [colors, setColors] = useState<ColorToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateHTML, setTemplateHTML] = useState<string>('');

  // Helper function to convert RGB to hex
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match;
      return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
    }
    return rgb;
  };

  // Helper function to calculate brightness
  const calculateBrightness = (hex: string): number => {
    const rgb = hex.substring(1);
    const r = parseInt(rgb.substr(0, 2), 16);
    const g = parseInt(rgb.substr(2, 2), 16);
    const b = parseInt(rgb.substr(4, 2), 16);
    return Math.round((r * 299 + g * 587 + b * 114) / 1000);
  };

  // Helper function to extract shade from color name
  const extractShade = (colorName: string): string => {
    const match = colorName.match(/(\d+)$/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    if (!selector) return;

    const discoverColors = () => {
      console.log(`🎨 ColorRamp: Starting fresh discovery for "${selector}"`);

      const computedStyles = getComputedStyle(document.documentElement);
      const foundColors: ColorToken[] = [];

      // Convert selector pattern to regex - remove 'primitives-color-' prefix for matching
      const cleanSelector = selector.replace('primitives-color-', '');
      const selectorRegex = new RegExp(`^${cleanSelector.replace(/\*/g, '.*')}$`);

      // Get all ELEVATE color variables
      const styleSheets = Array.from(document.styleSheets);
      const allCSSVars = new Set<string>();

      // Extract variables from stylesheets
      try {
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            rules.forEach(rule => {
              if (rule.type === CSSRule.STYLE_RULE) {
                const styleRule = rule as CSSStyleRule;
                const cssText = styleRule.style.cssText;

                const matches = cssText.match(/--elvt-primitives-color-[\w-]+/g);
                if (matches) {
                  matches.forEach(match => allCSSVars.add(match));
                }
              }
            });
          } catch (e) {
            // Cross-origin stylesheet, skip
          }
        });
      } catch (e) {
        console.warn('Could not read stylesheets, using fallback method');
      }

      // Fallback color list
      if (allCSSVars.size === 0) {
        console.log('🎨 Using fallback color list');
        const fallbackColors = [
          '--elvt-primitives-color-blue-50', '--elvt-primitives-color-blue-100', '--elvt-primitives-color-blue-200',
          '--elvt-primitives-color-blue-300', '--elvt-primitives-color-blue-400', '--elvt-primitives-color-blue-500',
          '--elvt-primitives-color-blue-600', '--elvt-primitives-color-blue-700', '--elvt-primitives-color-blue-800',
          '--elvt-primitives-color-blue-900', '--elvt-primitives-color-blue-950',
          '--elvt-primitives-color-gray-50', '--elvt-primitives-color-gray-100', '--elvt-primitives-color-gray-200',
          '--elvt-primitives-color-gray-300', '--elvt-primitives-color-gray-400', '--elvt-primitives-color-gray-500',
          '--elvt-primitives-color-gray-600', '--elvt-primitives-color-gray-700', '--elvt-primitives-color-gray-800',
          '--elvt-primitives-color-gray-900', '--elvt-primitives-color-gray-950',
          '--elvt-primitives-color-green-50', '--elvt-primitives-color-green-100', '--elvt-primitives-color-green-200',
          '--elvt-primitives-color-green-300', '--elvt-primitives-color-green-400', '--elvt-primitives-color-green-500',
          '--elvt-primitives-color-green-600', '--elvt-primitives-color-green-700', '--elvt-primitives-color-green-800',
          '--elvt-primitives-color-green-900', '--elvt-primitives-color-green-950',
          '--elvt-primitives-color-red-50', '--elvt-primitives-color-red-100', '--elvt-primitives-color-red-200',
          '--elvt-primitives-color-red-300', '--elvt-primitives-color-red-400', '--elvt-primitives-color-red-500',
          '--elvt-primitives-color-red-600', '--elvt-primitives-color-red-700', '--elvt-primitives-color-red-800',
          '--elvt-primitives-color-red-900', '--elvt-primitives-color-red-950',
          '--elvt-primitives-color-orange-50', '--elvt-primitives-color-orange-100', '--elvt-primitives-color-orange-200',
          '--elvt-primitives-color-orange-300', '--elvt-primitives-color-orange-400', '--elvt-primitives-color-orange-500',
          '--elvt-primitives-color-orange-600', '--elvt-primitives-color-orange-700', '--elvt-primitives-color-orange-800',
          '--elvt-primitives-color-orange-900', '--elvt-primitives-color-orange-950',
        ];
        fallbackColors.forEach(color => allCSSVars.add(color));
      }

      console.log(`🎨 Found ${allCSSVars.size} ELEVATE color variables`);

      // Process each variable
      Array.from(allCSSVars).forEach(cssVar => {
        const colorName = cssVar.replace('--elvt-primitives-color-', '');

        if (selectorRegex.test(colorName)) {
          // Check exclude pattern
          if (exclude) {
            const cleanExclude = exclude.replace('primitives-color-', '');
            const excludeRegex = new RegExp(`^${cleanExclude.replace(/\*/g, '.*')}$`);
            if (excludeRegex.test(colorName)) return;
          }

          // Check shade inclusion
          if (includeShades && includeShades.length > 0) {
            const shadeMatch = colorName.match(/-(\\d+)$/);
            if (!shadeMatch || !includeShades.includes(parseInt(shadeMatch[1]))) {
              return;
            }
          }

          const value = computedStyles.getPropertyValue(cssVar).trim();

          if (value && value !== 'initial' && value !== '') {
            const displayName = colorName
              .split('-')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');

            const hex = rgbToHex(value);
            const brightness = calculateBrightness(hex);
            const shade = extractShade(colorName);

            foundColors.push({
              name: displayName,
              value,
              cssVar,
              hex,
              brightness,
              shade
            });

            console.log(`🎨 Found color: ${displayName} = ${value} (${hex})`);
          }
        }
      });

      // Sort colors
      if (sortBy === 'alphabetic') {
        foundColors.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'brightness') {
        foundColors.sort((a, b) => b.brightness - a.brightness);
      } else if (sortBy === 'semantic') {
        foundColors.sort((a, b) => {
          const getColorFamily = (name: string) => name.split(' ')[0];
          const getShade = (name: string) => {
            const match = name.match(/(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          };

          const familyA = getColorFamily(a.name);
          const familyB = getColorFamily(b.name);

          if (familyA !== familyB) {
            return familyA.localeCompare(familyB);
          }

          return getShade(a.name) - getShade(b.name);
        });
      }

      console.log(`🎨 Final result: ${foundColors.length} colors found`);
      setColors(foundColors);
      setIsLoading(false);
    };

    const timer = setTimeout(discoverColors, 100);
    return () => clearTimeout(timer);
  }, [selector, exclude, includeShades, sortBy]);

  // Load template and generate HTML
  useEffect(() => {
    if (colors.length === 0) return;

    const loadTemplate = async () => {
      try {
        const templateModule = await templates[template]();
        const { container, item } = templateModule;

        // Generate items HTML with direct background-color
        const itemsHTML = colors.map((color, index) => {
          return item
            .replace(/background-color: var\(--token-color\)/g, `background-color: var(${color.cssVar})`)
            .replace(/{{name}}/g, color.name)
            .replace(/{{variable}}/g, color.cssVar)
            .replace(/{{value}}/g, color.value)
            .replace(/{{hex}}/g, color.hex)
            .replace(/{{brightness}}/g, color.brightness.toString())
            .replace(/{{shade}}/g, color.shade)
            .replace(/{{contrast}}/g, (color.brightness > 128 ? 'Light' : 'Dark'));
        }).join('');

        // Generate final HTML
        const finalHTML = container.replace('{{items}}', itemsHTML);
        setTemplateHTML(finalHTML);
      } catch (error) {
        console.error('Failed to load template:', error);
        setTemplateHTML('<div>Error loading template</div>');
      }
    };

    loadTemplate();
  }, [colors, template]);

  if (!selector) {
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        color: '#666'
      }}>
        <strong>ColorRamp:</strong> selector prop is required
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        color: '#666',
        textAlign: 'center'
      }}>
        <strong>{title || 'ColorRamp'}:</strong> Loading colors...
      </div>
    );
  }

  if (colors.length === 0) {
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        color: '#666'
      }}>
        <strong>{title || 'ColorRamp'}:</strong> No colors found matching "{selector}"
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {title && <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>}
      <div dangerouslySetInnerHTML={{ __html: templateHTML }} />
    </div>
  );
};

// Wrap with BrowserOnly to ensure client-side only execution
const ColorRampWrapper: React.FC<ColorRampProps> = (props) => {
  return (
    <BrowserOnly fallback={
      <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
        Loading colors...
      </div>
    }>
      {() => <ColorRamp {...props} />}
    </BrowserOnly>
  );
};

export default ColorRampWrapper;