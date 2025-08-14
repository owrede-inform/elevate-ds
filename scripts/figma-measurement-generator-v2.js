#!/usr/bin/env node

/**
 * Figma Measurement Overlay Generator V2
 * Focused on component-specific measurements with smart label positioning
 */

class SmartMeasurementGenerator {
  constructor(componentData) {
    this.component = componentData;
    this.colors = {
      blue: '#2F7CFF', 
      purple: '#E056FD',
      pink: '#FF6B9D',
      green: '#00D68F',
      teal: '#0DCEDA'
    };
    this.usedPositions = new Set(); // Track used label positions to avoid overlap
  }

  analyzeDimensions() {
    const bounds = this.component.bounds || { width: 200, height: 150 };
    const checkbox = this.component.checkbox || { x: 83, y: 54, width: 16, height: 16 };
    const gap = this.component.gap || 8;
    const focusRing = this.component.focusRing || { width: 22, height: 22, border: 2 };
    const label = this.component.label || { x: checkbox.x + checkbox.width + gap, y: checkbox.y, width: 60, height: 16 };
    
    return {
      container: bounds,
      checkbox,
      gap,
      focusRing,
      label,
      typography: { size: 14, weight: 500, lineHeight: 20, font: 'Inter' }
    };
  }

  // Smart label positioning to avoid overlaps
  findOptimalLabelPosition(x, y, width, height, preferredSide = 'top') {
    const positions = {
      top: { x: x, y: y - 20, anchor: 'middle' },
      bottom: { x: x, y: y + height + 20, anchor: 'middle' },
      left: { x: x - width - 15, y: y + height/2, anchor: 'end' },
      right: { x: x + width + 15, y: y + height/2, anchor: 'start' }
    };

    // Try preferred position first
    let position = positions[preferredSide];
    let key = `${Math.round(position.x)},${Math.round(position.y)}`;
    
    if (!this.usedPositions.has(key)) {
      this.usedPositions.add(key);
      return { ...position, side: preferredSide };
    }

    // Try other positions if preferred is taken
    const sides = ['top', 'bottom', 'left', 'right'];
    for (const side of sides) {
      if (side === preferredSide) continue;
      position = positions[side];
      key = `${Math.round(position.x)},${Math.round(position.y)}`;
      
      if (!this.usedPositions.has(key)) {
        this.usedPositions.add(key);
        return { ...position, side };
      }
    }

    // Fallback to offset position
    position = positions[preferredSide];
    position.y += preferredSide === 'top' ? -10 : 10;
    return { ...position, side: preferredSide };
  }

  generateComponentMeasurements(dimensions) {
    const { checkbox, gap, focusRing, label } = dimensions;
    const measurements = [];

    // Reset used positions for each generation
    this.usedPositions.clear();

    // 1. Checkbox dimensions
    const cbPos1 = this.findOptimalLabelPosition(checkbox.x, checkbox.y, checkbox.width, checkbox.height, 'top');
    measurements.push({
      type: 'horizontal',
      value: checkbox.width,
      x: checkbox.x,
      y: checkbox.y - 15,
      width: checkbox.width,
      label: { ...cbPos1, color: this.colors.blue }
    });

    const cbPos2 = this.findOptimalLabelPosition(checkbox.x, checkbox.y, checkbox.width, checkbox.height, 'right');
    measurements.push({
      type: 'vertical',
      value: checkbox.height,
      x: checkbox.x + checkbox.width + 8,
      y: checkbox.y,
      height: checkbox.height,
      label: { ...cbPos2, color: this.colors.blue }
    });

    // 2. Gap between checkbox and label
    const gapPos = this.findOptimalLabelPosition(
      checkbox.x + checkbox.width, 
      checkbox.y, 
      gap, 
      checkbox.height, 
      'top'
    );
    measurements.push({
      type: 'horizontal',
      value: gap,
      x: checkbox.x + checkbox.width,
      y: checkbox.y - 8,
      width: gap,
      label: { ...gapPos, color: this.colors.purple }
    });

    // 3. Focus ring dimensions (only if different from checkbox)
    if (focusRing.width > checkbox.width) {
      const focusPos = this.findOptimalLabelPosition(
        checkbox.x - 3, 
        checkbox.y - 3, 
        focusRing.width, 
        focusRing.height, 
        'left'
      );
      measurements.push({
        type: 'horizontal',
        value: focusRing.width,
        x: checkbox.x - 3,
        y: checkbox.y - 25,
        width: focusRing.width,
        label: { ...focusPos, color: this.colors.pink }
      });
    }

    // 4. Focus ring border width (annotation)
    measurements.push({
      type: 'annotation',
      value: `${focusRing.border}px`,
      x: checkbox.x + checkbox.width + 35,
      y: checkbox.y + checkbox.height/2,
      label: { x: checkbox.x + checkbox.width + 35, y: checkbox.y + checkbox.height/2, color: this.colors.pink, anchor: 'start' }
    });

    // 5. Label width (if significant)
    if (label.width > 40) {
      const labelPos = this.findOptimalLabelPosition(label.x, label.y, label.width, label.height, 'bottom');
      measurements.push({
        type: 'horizontal',
        value: label.width,
        x: label.x,
        y: label.y + label.height + 12,
        width: label.width,
        label: { ...labelPos, color: this.colors.teal }
      });
    }

    return measurements;
  }

  generateCleanSVG(dimensions, measurements) {
    const { container, checkbox, focusRing, label } = dimensions;
    
    // Calculate optimal SVG size based on content + measurements
    const padding = 60;
    const measurementBuffer = 50;
    const totalWidth = Math.max(container.width, label.x + label.width) + padding * 2 + measurementBuffer;
    const totalHeight = container.height + padding * 2 + measurementBuffer;

    let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    svg += `<defs>
      <style>
        .measurement-line { stroke-width: 1.2; }
        .measurement-text { 
          font-family: 'Inter', sans-serif; 
          font-size: 10px; 
          font-weight: 500; 
          fill: white;
          text-anchor: middle;
          dominant-baseline: middle;
        }
        .measurement-label { 
          stroke: none; 
          rx: 2; 
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .component-shadow {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
        }
        .dashed-line {
          stroke-dasharray: 2,2;
          opacity: 0.6;
        }
      </style>
    </defs>`;

    // Component elements (centered in SVG)
    const componentX = padding;
    const componentY = padding;
    const checkboxX = componentX + checkbox.x;
    const checkboxY = componentY + checkbox.y;
    
    // Focus ring (dashed, subtle)
    svg += `<rect x="${checkboxX - 3}" y="${checkboxY - 3}" width="22" height="22" 
             fill="none" stroke="#0b5cdf" stroke-width="1.5" rx="2" class="dashed-line"/>`;
    
    // Checkbox with shadow
    svg += `<rect x="${checkboxX}" y="${checkboxY}" width="16" height="16" 
             fill="#0b5cdf" stroke="#0072ff" stroke-width="0.5" rx="2" class="component-shadow"/>`;
    
    // Checkmark
    svg += `<path d="M${checkboxX + 3} ${checkboxY + 8} L${checkboxX + 6} ${checkboxY + 11} L${checkboxX + 13} ${checkboxY + 4}" 
             stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Label
    svg += `<text x="${checkboxX + 24}" y="${checkboxY + 11}" font-family="Inter, sans-serif" 
             font-size="14" font-weight="500" fill="#3d4253" class="component-shadow">Checkbox</text>`;

    // Generate measurement lines and labels
    measurements.forEach(m => {
      const adjustedX = componentX + m.x;
      const adjustedY = componentY + m.y;
      const color = m.label.color;

      if (m.type === 'horizontal') {
        // Clean horizontal measurement line
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX + m.width}" y2="${adjustedY}" 
                 stroke="${color}" class="measurement-line"/>`;
        
        // End tick marks
        svg += `<line x1="${adjustedX}" y1="${adjustedY - 3}" x2="${adjustedX}" y2="${adjustedY + 3}" 
                 stroke="${color}" class="measurement-line"/>`;
        svg += `<line x1="${adjustedX + m.width}" y1="${adjustedY - 3}" x2="${adjustedX + m.width}" y2="${adjustedY + 3}" 
                 stroke="${color}" class="measurement-line"/>`;
        
        // Smart positioned label
        const labelX = componentX + m.label.x;
        const labelY = componentY + m.label.y;
        const textWidth = String(m.value).length * 5 + 6;
        
        svg += `<rect x="${labelX - textWidth/2}" y="${labelY - 7}" width="${textWidth}" height="14" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${labelX}" y="${labelY}" class="measurement-text">${m.value}</text>`;
        
      } else if (m.type === 'vertical') {
        // Clean vertical measurement line
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX}" y2="${adjustedY + m.height}" 
                 stroke="${color}" class="measurement-line"/>`;
        
        // End tick marks
        svg += `<line x1="${adjustedX - 3}" y1="${adjustedY}" x2="${adjustedX + 3}" y2="${adjustedY}" 
                 stroke="${color}" class="measurement-line"/>`;
        svg += `<line x1="${adjustedX - 3}" y1="${adjustedY + m.height}" x2="${adjustedX + 3}" y2="${adjustedY + m.height}" 
                 stroke="${color}" class="measurement-line"/>`;
        
        // Smart positioned label
        const labelX = componentX + m.label.x;
        const labelY = componentY + m.label.y;
        const textWidth = String(m.value).length * 5 + 6;
        
        svg += `<rect x="${labelX - textWidth/2}" y="${labelY - 7}" width="${textWidth}" height="14" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${labelX}" y="${labelY}" class="measurement-text">${m.value}</text>`;
                 
      } else if (m.type === 'annotation') {
        // Simple annotation with leader line
        const labelX = componentX + m.label.x;
        const labelY = componentY + m.label.y;
        const textWidth = String(m.value).length * 5 + 6;
        
        // Leader line
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${labelX - textWidth/2 - 5}" y2="${labelY}" 
                 stroke="${color}" stroke-width="1" class="dashed-line"/>`;
        
        svg += `<rect x="${labelX - textWidth/2}" y="${labelY - 7}" width="${textWidth}" height="14" 
                 fill="${color}" class="measurement-label"/>`;
        svg += `<text x="${labelX}" y="${labelY}" class="measurement-text">${m.value}</text>`;
      }
    });

    svg += '</svg>';
    return svg;
  }

  generateHTML(title = 'Component Measurements') {
    const dimensions = this.analyzeDimensions();
    const measurements = this.generateComponentMeasurements(dimensions);
    const svg = this.generateCleanSVG(dimensions, measurements);
    
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
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
            color: #1a202c; 
            line-height: 1.6;
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
        }
        h1 { 
            text-align: center; 
            margin-bottom: 40px; 
            color: #1a202c; 
            font-weight: 600; 
            font-size: 28px;
        }
        .measurement-viewer { 
            background: white; 
            border-radius: 16px; 
            padding: 40px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.08); 
            margin-bottom: 40px; 
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .specs-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            background: white; 
            border-radius: 16px; 
            padding: 32px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
        }
        .spec-section h3 { 
            margin: 0 0 12px 0; 
            font-size: 16px; 
            font-weight: 600; 
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .spec-section h3::before {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        .spec-section ul { 
            list-style: none; 
            padding: 0; 
            margin: 0; 
        }
        .spec-section li { 
            padding: 3px 0; 
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }
        .spec-section strong { 
            font-weight: 600; 
            color: #2563eb;
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #64748b; 
            font-size: 14px; 
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
                <h3 style="color: ${this.colors.blue};"><span style="background: ${this.colors.blue};"></span>Control</h3>
                <ul>
                    <li><span>Size:</span> <strong>${dimensions.checkbox.width}×${dimensions.checkbox.height}px</strong></li>
                    <li><span>Background:</span> <strong>#0b5cdf</strong></li>
                    <li><span>Border:</span> <strong>1px #0072ff</strong></li>
                    <li><span>Radius:</span> <strong>2px</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: ${this.colors.purple};"><span style="background: ${this.colors.purple};"></span>Spacing</h3>
                <ul>
                    <li><span>Label gap:</span> <strong>${dimensions.gap}px</strong></li>
                    <li><span>Focus offset:</span> <strong>3px</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: ${this.colors.pink};"><span style="background: ${this.colors.pink};"></span>Focus Ring</h3>
                <ul>
                    <li><span>Size:</span> <strong>${dimensions.focusRing.width}×${dimensions.focusRing.height}px</strong></li>
                    <li><span>Border:</span> <strong>${dimensions.focusRing.border}px #0b5cdf</strong></li>
                    <li><span>Style:</span> <strong>dashed</strong></li>
                </ul>
            </div>
            
            <div class="spec-section">
                <h3 style="color: #475569;"><span style="background: #475569;"></span>Typography</h3>
                <ul>
                    <li><span>Font:</span> <strong>Inter Medium</strong></li>
                    <li><span>Size:</span> <strong>${dimensions.typography.size}px</strong></li>
                    <li><span>Weight:</span> <strong>${dimensions.typography.weight}</strong></li>
                    <li><span>Color:</span> <strong>#3d4253</strong></li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            Component-focused measurements • Generated from Figma MCP
        </div>
    </div>
</body>
</html>`;
  }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SmartMeasurementGenerator };
}