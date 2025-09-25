import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface ColorRampProps {
  title?: string;
  selector?: string;
  exclude?: string;
  template?: 'default' | 'compact' | 'table' | 'card';
  sortBy?: 'semantic' | 'brightness' | 'alphabetic';
  includeShades?: number[];
  showHexValue?: boolean;
}

interface ColorToken {
  name: string;
  value: string;
  cssVar: string;
}

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

  useEffect(() => {
    if (!selector) return;

    const discoverColors = () => {
      const foundColors: ColorToken[] = [];

      // Get all CSS custom properties from document
      const allStyles = getComputedStyle(document.documentElement);
      const cssVars: string[] = [];

      // Collect all CSS variables
      for (let i = 0; i < allStyles.length; i++) {
        const prop = allStyles[i];
        if (prop.startsWith('--')) {
          cssVars.push(prop);
        }
      }

      // Filter based on selector pattern
      cssVars.forEach(cssVar => {
        const varName = cssVar.replace('--elvt-primitives-color-', '').replace('--', '');

        // Convert selector pattern to regex
        const selectorRegex = new RegExp(
          selector
            .replace(/\*/g, '[^-]*')
            .replace('primitives-color-', '')
            .replace('primitives-', '')
        );

        if (selectorRegex.test(varName)) {
          // Check exclude pattern
          if (exclude) {
            const excludeRegex = new RegExp(
              exclude
                .replace(/\*/g, '[^-]*')
                .replace('primitives-color-', '')
                .replace('primitives-', '')
            );
            if (excludeRegex.test(varName)) return;
          }

          // Check shade inclusion
          if (includeShades && includeShades.length > 0) {
            const shadeMatch = varName.match(/-(\d+)$/);
            if (!shadeMatch || !includeShades.includes(parseInt(shadeMatch[1]))) {
              return;
            }
          }

          const value = allStyles.getPropertyValue(cssVar).trim();
          if (value && value !== 'initial' && value.match(/#[0-9a-f]{3,6}|rgb\(|hsl\(/i)) {
            foundColors.push({
              name: varName.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
              value,
              cssVar
            });
          }
        }
      });

      // Sort colors
      if (sortBy === 'alphabetic') {
        foundColors.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'semantic') {
        // Group by color family, then by shade
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

      setColors(foundColors);
    };

    // Delay to ensure styles are loaded
    const timer = setTimeout(discoverColors, 100);
    return () => clearTimeout(timer);
  }, [selector, exclude, includeShades, sortBy]);

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

  const renderDefault = () => (
    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {title && <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        {colors.map((color, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '120px'
          }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: `var(${color.cssVar})`,
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                marginBottom: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              title={`${color.name}: ${color.value}`}
            />
            <div style={{
              fontSize: '12px',
              textAlign: 'center',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                {color.name}
              </div>
              {showHexValue && (
                <div style={{ fontFamily: 'monospace', opacity: 0.7 }}>
                  {color.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompact = () => (
    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {title && <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: `var(${color.cssVar})`,
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
            title={`${color.name}: ${color.value}`}
          />
        ))}
      </div>
    </div>
  );

  const renderTable = () => (
    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {title && <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--ifm-table-border-color)' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Color</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
            {showHexValue && <th style={{ padding: '8px', textAlign: 'left' }}>Value</th>}
          </tr>
        </thead>
        <tbody>
          {colors.map((color, index) => (
            <tr key={index} style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
              <td style={{ padding: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: `var(${color.cssVar})`,
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                />
              </td>
              <td style={{ padding: '8px', fontWeight: 500 }}>{color.name}</td>
              {showHexValue && (
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{color.value}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  switch (template) {
    case 'compact':
      return renderCompact();
    case 'table':
      return renderTable();
    case 'card':
    case 'default':
    default:
      return renderDefault();
  }
};

// Wrap with BrowserOnly to ensure client-side only execution
const ColorRampWrapper: React.FC<ColorRampProps> = (props) => {
  return (
    <BrowserOnly fallback={
      <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
        Loading color tokens...
      </div>
    }>
      {() => <ColorRamp {...props} />}
    </BrowserOnly>
  );
};

export default ColorRampWrapper;