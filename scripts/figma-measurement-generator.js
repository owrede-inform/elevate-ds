#!/usr/bin/env node

/**
 * Figma Measurement Overlay Generator
 * Creates precise measurement annotations like Figma's inspect mode
 */

class MeasurementGenerator {
  constructor(componentData) {
    this.component = componentData;
    this.measurements = [];
    this.colors = {
      red: '#FF4757',
      blue: '#2F7CFF', 
      purple: '#E056FD',
      pink: '#FF6B9D',
      orange: '#FF8C42'
    };
  }

  // Extract measurements from Figma component data
  analyzeDimensions() {
    const bounds = this.component.bounds || { width: 200, height: 150 };
    const checkbox = this.component.checkbox || { x: 83, y: 54, width: 16, height: 16 };
    const gap = this.component.gap || 8;
    const focusRing = this.component.focusRing || { width: 22, height: 22, border: 2 };
    
    return {
      container: bounds,
      checkbox,
      gap,
      focusRing,
      typography: {
        size: 14,
        weight: 500,
        lineHeight: 20,
        font: 'Inter'
      }
    };
  }

  // Generate measurement annotations with smart positioning
  generateMeasurements(dimensions) {
    const { container, checkbox, gap, focusRing } = dimensions;
    const measurements = [];

    // Container dimensions (top and right)
    measurements.push({
      type: 'horizontal',
      value: container.width,
      x: 0,
      y: -40,
      width: container.width,
      label: { position: 'top', color: this.colors.red }
    });

    measurements.push({
      type: 'vertical', 
      value: container.height,
      x: container.width + 15,
      y: 0,
      height: container.height,
      label: { position: 'right', color: this.colors.red }
    });

    // Checkbox position from edges
    measurements.push({
      type: 'horizontal',
      value: checkbox.x,
      x: 0,
      y: checkbox.y + checkbox.height + 20,
      width: checkbox.x,
      label: { position: 'bottom', color: this.colors.orange }
    });

    measurements.push({
      type: 'vertical',
      value: checkbox.y, 
      x: checkbox.x - 25,
      y: 0,
      height: checkbox.y,
      label: { position: 'left', color: this.colors.orange }
    });

    // Checkbox dimensions
    measurements.push({
      type: 'horizontal',
      value: checkbox.width,
      x: checkbox.x,
      y: checkbox.y - 25,
      width: checkbox.width,
      label: { position: 'top', color: this.colors.blue }
    });

    measurements.push({
      type: 'vertical',
      value: checkbox.height,
      x: checkbox.x + checkbox.width + 10,
      y: checkbox.y,
      height: checkbox.height,
      label: { position: 'right', color: this.colors.blue }
    });

    // Gap measurement
    measurements.push({
      type: 'horizontal',
      value: gap,
      x: checkbox.x + checkbox.width,
      y: checkbox.y - 15,
      width: gap,
      label: { position: 'top', color: this.colors.purple }
    });

    // Focus ring measurements
    measurements.push({
      type: 'horizontal',
      value: focusRing.width,
      x: checkbox.x - 3,
      y: checkbox.y - 35,
      width: focusRing.width,
      label: { position: 'top', color: this.colors.pink }
    });

    measurements.push({
      type: 'annotation',
      value: `${focusRing.border}px border`,
      x: checkbox.x + checkbox.width + 25,
      y: checkbox.y + checkbox.height/2,
      label: { position: 'right', color: this.colors.pink }
    });

    return measurements;
  }

  // Generate clean SVG measurement overlay
  generateSVG(dimensions, measurements) {
    const { container } = dimensions;
    const padding = 80;
    const totalWidth = container.width + padding * 2;
    const totalHeight = container.height + padding * 2;

    let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Styles
    svg += `
    <defs>
      <style>
        .measurement-line { stroke-width: 1; }
        .measurement-text { 
          font-family: 'Inter', system-ui, sans-serif; 
          font-size: 11px; 
          font-weight: 600; 
          text-anchor: middle;
          dominant-baseline: middle;
        }
        .measurement-label {
          fill: white;
          stroke: none;
          rx: 2;
        }
      </style>
      
      <!-- Arrow markers -->
      <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 6,3" fill="${this.colors.red}"/>
      </marker>
      <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 6,3" fill="${this.colors.blue}"/>
      </marker>
      <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 6,3" fill="${this.colors.purple}"/>
      </marker>
      <marker id="arrowPink" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 6,3" fill="${this.colors.pink}"/>
      </marker>
      <marker id="arrowOrange" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 6,3" fill="${this.colors.orange}"/>
      </marker>
    </defs>`;

    // Component background
    svg += `<rect x="${padding}" y="${padding}" width="${container.width}" height="${container.height}" 
             fill="#f3f4f7" stroke="#e0e0e0" stroke-width="1" rx="4"/>`;

    // Component elements (checkbox and label)
    const checkboxX = padding + dimensions.checkbox.x;
    const checkboxY = padding + dimensions.checkbox.y;
    
    // Focus ring
    svg += `<rect x="${checkboxX - 3}" y="${checkboxY - 3}" width="22" height="22" 
             fill="none" stroke="#0b5cdf" stroke-width="2" rx="2"/>`;
    
    // Checkbox
    svg += `<rect x="${checkboxX}" y="${checkboxY}" width="16" height="16" 
             fill="#0b5cdf" stroke="#0072ff" stroke-width="1" rx="2"/>`;
    
    // Checkmark
    svg += `<path d="M${checkboxX + 3} ${checkboxY + 8} L${checkboxX + 6} ${checkboxY + 11} L${checkboxX + 13} ${checkboxY + 4}" 
             stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Label
    svg += `<text x="${checkboxX + 24}" y="${checkboxY + 11}" font-family="Inter, sans-serif" 
             font-size="14" font-weight="500" fill="#3d4253">Checkbox</text>`;

    // Generate measurement lines and labels
    measurements.forEach(m => {
      const adjustedX = padding + m.x;
      const adjustedY = padding + m.y;
      const color = m.label.color;
      const colorName = Object.keys(this.colors).find(key => this.colors[key] === color) || 'red';

      if (m.type === 'horizontal') {
        // Horizontal measurement line with arrows
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX + m.width}" y2="${adjustedY}" 
                 stroke="${color}" class="measurement-line" marker-start="url(#arrow${colorName.charAt(0).toUpperCase() + colorName.slice(1)})" marker-end="url(#arrow${colorName.charAt(0).toUpperCase() + colorName.slice(1)})"/>`;
        
        // Label background and text
        const labelX = adjustedX + m.width/2;
        const labelY = adjustedY - (m.label.position === 'top' ? 6 : -18);
        
        svg += `<rect x="${labelX - 12}" y="${labelY - 8}" width="24" height="16" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white">${m.value}</text>`;
        
      } else if (m.type === 'vertical') {
        // Vertical measurement line with arrows  
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX}" y2="${adjustedY + m.height}" 
                 stroke="${color}" class="measurement-line" marker-start="url(#arrow${colorName.charAt(0).toUpperCase() + colorName.slice(1)})" marker-end="url(#arrow${colorName.charAt(0).toUpperCase() + colorName.slice(1)})"/>`;
        
        // Label background and text
        const labelX = adjustedX + (m.label.position === 'right' ? 12 : -12);
        const labelY = adjustedY + m.height/2;
        
        svg += `<rect x="${labelX - 8}" y="${labelY - 8}" width="16" height="16" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white" 
                 transform="rotate(90, ${labelX}, ${labelY})">${m.value}</text>`;
                 
      } else if (m.type === 'annotation') {
        // Simple annotation label
        svg += `<rect x="${adjustedX - 20}" y="${adjustedY - 8}" width="40" height="16" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${adjustedX}" y="${adjustedY}" class="measurement-text" fill="white">${m.value}</text>`;
      }
    });

    svg += '</svg>';
    return svg;
  }

  // Generate complete HTML with embedded SVG
  generateHTML(title = 'Component Measurements') {
    const dimensions = this.analyzeDimensions();
    const measurements = this.generateMeasurements(dimensions);
    const svg = this.generateSVG(dimensions, measurements);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 40px;
            font-family: 'Inter', system-ui, sans-serif;
            background: #fafbfc;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 40px;
            color: #1a1a1a;
            font-weight: 600;
        }
        
        .measurement-viewer {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
            text-align: center;
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .spec-section h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .spec-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .spec-section li {
            padding: 4px 0;
            font-size: 14px;
        }
        
        .spec-section strong {
            font-weight: 600;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        
        <div class="measurement-viewer">
            ${svg}
        </div>
        
        <div class="specs-grid">
            <div class="spec-section">
                <h3 style="color: ${this.colors.red};">Container</h3>
                <ul>
                    <li>Width: <strong>${dimensions.container.width}px</strong></li>
                    <li>Height: <strong>${dimensions.container.height}px</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: ${this.colors.blue};">Checkbox Control</h3>
                <ul>
                    <li>Size: <strong>${dimensions.checkbox.width}px × ${dimensions.checkbox.height}px</strong></li>
                    <li>Position: <strong>${dimensions.checkbox.x}px, ${dimensions.checkbox.y}px</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: ${this.colors.purple};">Spacing</h3>
                <ul>
                    <li>Label gap: <strong>${dimensions.gap}px</strong></li>
                    <li>Focus ring: <strong>${dimensions.focusRing.width}px × ${dimensions.focusRing.height}px</strong></li>
                    <li>Border: <strong>${dimensions.focusRing.border}px</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: #333;">Typography</h3>
                <ul>
                    <li>Font: <strong>${dimensions.typography.font}</strong></li>
                    <li>Size: <strong>${dimensions.typography.size}px</strong></li>
                    <li>Weight: <strong>${dimensions.typography.weight}</strong></li>
                    <li>Line height: <strong>${dimensions.typography.lineHeight}px</strong></li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            Generated from Figma using MCP Server • All measurements in pixels
        </div>
    </div>
</body>
</html>`;
  }
}

// Usage example
const checkboxData = {
  bounds: { width: 200, height: 150 },
  checkbox: { x: 83, y: 54, width: 16, height: 16 },
  gap: 8,
  focusRing: { width: 22, height: 22, border: 2 }
};

const generator = new MeasurementGenerator(checkboxData);
const html = generator.generateHTML('Figma Checkbox Component - Professional Measurements');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MeasurementGenerator };
} else {
  // Browser environment - output HTML
  document.write(html);
}