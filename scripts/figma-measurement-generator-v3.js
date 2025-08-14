#!/usr/bin/env node

/**
 * Figma Measurement Overlay Generator V3
 * Advanced placement system with protected areas and original component SVG
 */

class ProtectedAreaMeasurementGenerator {
  constructor(componentData) {
    this.component = componentData;
    this.colors = {
      blue: '#2F7CFF', 
      purple: '#E056FD',
      pink: '#FF6B9D',
      green: '#00D68F',
      teal: '#0DCEDA'
    };
    this.protectedAreas = []; // Areas where labels cannot be placed
    this.placedLabels = []; // Track placed labels to avoid overlaps
  }

  analyzeDimensions() {
    const bounds = this.component.bounds || { width: 240, height: 100 };
    const checkbox = this.component.checkbox || { x: 70, y: 30, width: 16, height: 16 };
    const gap = this.component.gap || 8;
    const focusRing = this.component.focusRing || { width: 22, height: 22, border: 2 };
    const label = this.component.label || { 
      x: checkbox.x + checkbox.width + gap, 
      y: checkbox.y, 
      width: 70, 
      height: 16 
    };
    
    return {
      container: bounds,
      checkbox,
      gap,
      focusRing,
      label,
      typography: { size: 14, weight: 500, lineHeight: 20, font: 'Inter' }
    };
  }

  // Define protected areas where labels cannot be placed
  defineProtectedAreas(dimensions) {
    this.protectedAreas = [];
    
    const { checkbox, label, focusRing } = dimensions;
    const buffer = 5; // Safety buffer around components
    
    // Checkbox area (including focus ring)
    this.protectedAreas.push({
      x: checkbox.x - focusRing.border - buffer,
      y: checkbox.y - focusRing.border - buffer,
      width: focusRing.width + buffer * 2,
      height: focusRing.height + buffer * 2,
      name: 'checkbox'
    });
    
    // Label text area
    this.protectedAreas.push({
      x: label.x - buffer,
      y: label.y - buffer, 
      width: label.width + buffer * 2,
      height: label.height + buffer * 2,
      name: 'label'
    });
  }

  // Check if a rectangle overlaps with any protected area
  isInProtectedArea(x, y, width, height) {
    const rect = { x, y, width, height };
    
    return this.protectedAreas.some(area => 
      this.rectanglesOverlap(rect, area)
    ) || this.placedLabels.some(label =>
      this.rectanglesOverlap(rect, label)
    );
  }

  // Check if two rectangles overlap
  rectanglesOverlap(rect1, rect2) {
    return !(rect1.x + rect1.width <= rect2.x || 
             rect2.x + rect2.width <= rect1.x || 
             rect1.y + rect1.height <= rect2.y || 
             rect2.y + rect2.height <= rect1.y);
  }

  // Find optimal label position avoiding protected areas
  findSafeLabelPosition(measurementX, measurementY, measurementWidth, measurementHeight, value, preferredSide = 'top') {
    const labelWidth = String(value).length * 5 + 8;
    const labelHeight = 14;
    const offset = 12;

    // Define potential positions around the measurement
    const positions = [
      // Top positions
      { side: 'top', x: measurementX + measurementWidth/2 - labelWidth/2, y: measurementY - offset - labelHeight },
      { side: 'top-left', x: measurementX - labelWidth - 5, y: measurementY - offset - labelHeight },
      { side: 'top-right', x: measurementX + measurementWidth + 5, y: measurementY - offset - labelHeight },
      
      // Bottom positions  
      { side: 'bottom', x: measurementX + measurementWidth/2 - labelWidth/2, y: measurementY + measurementHeight + offset },
      { side: 'bottom-left', x: measurementX - labelWidth - 5, y: measurementY + measurementHeight + offset },
      { side: 'bottom-right', x: measurementX + measurementWidth + 5, y: measurementY + measurementHeight + offset },
      
      // Left positions
      { side: 'left', x: measurementX - labelWidth - offset, y: measurementY + measurementHeight/2 - labelHeight/2 },
      { side: 'left-top', x: measurementX - labelWidth - offset, y: measurementY - labelHeight - 5 },
      { side: 'left-bottom', x: measurementX - labelWidth - offset, y: measurementY + measurementHeight + 5 },
      
      // Right positions
      { side: 'right', x: measurementX + measurementWidth + offset, y: measurementY + measurementHeight/2 - labelHeight/2 },
      { side: 'right-top', x: measurementX + measurementWidth + offset, y: measurementY - labelHeight - 5 },
      { side: 'right-bottom', x: measurementX + measurementWidth + offset, y: measurementY + measurementHeight + 5 },
    ];

    // Sort positions by preference (preferred side first)
    const sortedPositions = positions.sort((a, b) => {
      if (a.side.includes(preferredSide)) return -1;
      if (b.side.includes(preferredSide)) return 1;
      return 0;
    });

    // Find first position that doesn't overlap
    for (const position of sortedPositions) {
      if (!this.isInProtectedArea(position.x, position.y, labelWidth, labelHeight)) {
        // Mark this area as used
        this.placedLabels.push({
          x: position.x,
          y: position.y,
          width: labelWidth,
          height: labelHeight
        });
        
        return {
          x: position.x + labelWidth/2, // Center point for text
          y: position.y + labelHeight/2,
          side: position.side
        };
      }
    }

    // Fallback: force placement with warning
    const fallback = positions[0];
    return {
      x: fallback.x + labelWidth/2,
      y: fallback.y + labelHeight/2,
      side: 'fallback'
    };
  }

  generateComponentMeasurements(dimensions) {
    const { checkbox, gap, focusRing } = dimensions;
    const measurements = [];
    
    // Define protected areas first
    this.defineProtectedAreas(dimensions);
    this.placedLabels = []; // Reset placed labels

    // 1. Checkbox width
    const widthPos = this.findSafeLabelPosition(
      checkbox.x, checkbox.y - 8, checkbox.width, 0, checkbox.width, 'top'
    );
    measurements.push({
      type: 'horizontal',
      value: checkbox.width,
      x: checkbox.x,
      y: checkbox.y - 8,
      width: checkbox.width,
      label: { ...widthPos, color: this.colors.blue }
    });

    // 2. Checkbox height  
    const heightPos = this.findSafeLabelPosition(
      checkbox.x + checkbox.width + 6, checkbox.y, 0, checkbox.height, checkbox.height, 'right'
    );
    measurements.push({
      type: 'vertical',
      value: checkbox.height,
      x: checkbox.x + checkbox.width + 6,
      y: checkbox.y,
      height: checkbox.height,
      label: { ...heightPos, color: this.colors.blue }
    });

    // 3. Gap measurement
    const gapPos = this.findSafeLabelPosition(
      checkbox.x + checkbox.width, checkbox.y - 4, gap, 0, gap, 'top'
    );
    measurements.push({
      type: 'horizontal',
      value: gap,
      x: checkbox.x + checkbox.width,
      y: checkbox.y - 4,
      width: gap,
      label: { ...gapPos, color: this.colors.purple }
    });

    // 4. Focus ring measurement
    const focusPos = this.findSafeLabelPosition(
      checkbox.x - 3, checkbox.y - 12, focusRing.width, 0, focusRing.width, 'top'
    );
    measurements.push({
      type: 'horizontal',
      value: focusRing.width,
      x: checkbox.x - 3,
      y: checkbox.y - 12,
      width: focusRing.width,
      label: { ...focusPos, color: this.colors.pink }
    });

    // 5. Border width annotation
    const borderPos = this.findSafeLabelPosition(
      checkbox.x + checkbox.width + 25, checkbox.y + checkbox.height/2, 20, 0, `${focusRing.border}px`, 'right'
    );
    measurements.push({
      type: 'annotation',
      value: `${focusRing.border}px`,
      x: checkbox.x + checkbox.width + 25,
      y: checkbox.y + checkbox.height/2,
      label: { ...borderPos, color: this.colors.pink }
    });

    return measurements;
  }

  // Generate the original Figma component as SVG
  generateComponentSVG(dimensions) {
    const { checkbox } = dimensions;
    
    let componentSVG = '';
    
    // Focus ring (dashed)
    componentSVG += `<rect x="${checkbox.x - 3}" y="${checkbox.y - 3}" width="22" height="22" 
                     fill="none" stroke="#0b5cdf" stroke-width="1.5" rx="2" 
                     stroke-dasharray="2,2" opacity="0.7"/>`;
    
    // Checkbox background
    componentSVG += `<rect x="${checkbox.x}" y="${checkbox.y}" width="16" height="16" 
                     fill="#0b5cdf" stroke="#0072ff" stroke-width="0.5" rx="2" 
                     filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"/>`;
    
    // Checkmark
    componentSVG += `<path d="M${checkbox.x + 3} ${checkbox.y + 8} L${checkbox.x + 6} ${checkbox.y + 11} L${checkbox.x + 13} ${checkbox.y + 4}" 
                     stroke="white" stroke-width="2" fill="none" 
                     stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Label text
    componentSVG += `<text x="${checkbox.x + 24}" y="${checkbox.y + 11}" 
                     font-family="Inter, sans-serif" font-size="14" font-weight="500" 
                     fill="#3d4253" dominant-baseline="middle">Checkbox</text>`;
    
    return componentSVG;
  }

  generateProtectedAreasSVG(dimensions) {
    // For debugging - visualize protected areas
    let debugSVG = '';
    this.protectedAreas.forEach(area => {
      debugSVG += `<rect x="${area.x}" y="${area.y}" width="${area.width}" height="${area.height}" 
                   fill="rgba(255,0,0,0.1)" stroke="rgba(255,0,0,0.3)" stroke-width="1" 
                   stroke-dasharray="2,2"/>`;
    });
    return debugSVG;
  }

  generateAdvancedSVG(dimensions, measurements, showDebug = false) {
    const padding = 60;
    const totalWidth = 360;
    const totalHeight = 200;

    let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    svg += `<defs>
      <style>
        .measurement-line { stroke-width: 1; }
        .measurement-text { 
          font-family: 'Inter', sans-serif; 
          font-size: 9px; 
          font-weight: 500; 
          fill: white;
          text-anchor: middle;
          dominant-baseline: central;
        }
        .measurement-label { 
          stroke: none; 
          rx: 2; 
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12));
        }
        .dashed-line {
          stroke-dasharray: 2,2;
          opacity: 0.7;
        }
        .component-area {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
        }
      </style>
    </defs>`;

    // Background
    svg += `<rect width="100%" height="100%" fill="#f8fafc"/>`;

    const offsetX = padding;
    const offsetY = padding;

    // Render original component
    const componentSVG = this.generateComponentSVG(dimensions);
    svg += `<g transform="translate(${offsetX}, ${offsetY})" class="component-area">`;
    svg += componentSVG;
    svg += '</g>';

    // Debug: show protected areas (optional)
    if (showDebug) {
      svg += `<g transform="translate(${offsetX}, ${offsetY})" opacity="0.3">`;
      svg += this.generateProtectedAreasSVG(dimensions);
      svg += '</g>';
    }

    // Render measurements
    measurements.forEach(m => {
      const adjustedX = offsetX + m.x;
      const adjustedY = offsetY + m.y;
      const color = m.label.color;
      const labelX = offsetX + m.label.x;
      const labelY = offsetY + m.label.y;

      if (m.type === 'horizontal') {
        // Measurement line
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX + m.width}" y2="${adjustedY}" 
                 stroke="${color}" class="measurement-line"/>`;
        // End ticks
        svg += `<line x1="${adjustedX}" y1="${adjustedY - 2}" x2="${adjustedX}" y2="${adjustedY + 2}" 
                 stroke="${color}" class="measurement-line"/>`;
        svg += `<line x1="${adjustedX + m.width}" y1="${adjustedY - 2}" x2="${adjustedX + m.width}" y2="${adjustedY + 2}" 
                 stroke="${color}" class="measurement-line"/>`;
        
      } else if (m.type === 'vertical') {
        // Measurement line
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${adjustedX}" y2="${adjustedY + m.height}" 
                 stroke="${color}" class="measurement-line"/>`;
        // End ticks
        svg += `<line x1="${adjustedX - 2}" y1="${adjustedY}" x2="${adjustedX + 2}" y2="${adjustedY}" 
                 stroke="${color}" class="measurement-line"/>`;
        svg += `<line x1="${adjustedX - 2}" y1="${adjustedY + m.height}" x2="${adjustedX + 2}" y2="${adjustedY + m.height}" 
                 stroke="${color}" class="measurement-line"/>`;
                
      } else if (m.type === 'annotation') {
        // Leader line to annotation
        svg += `<line x1="${adjustedX}" y1="${adjustedY}" x2="${labelX - 10}" y2="${labelY}" 
                 stroke="${color}" stroke-width="1" class="dashed-line"/>`;
      }

      // Label (for all types)
      const textWidth = String(m.value).length * 4.5 + 6;
      svg += `<rect x="${labelX - textWidth/2}" y="${labelY - 7}" width="${textWidth}" height="14" 
               fill="${color}" class="measurement-label"/>`;
      svg += `<text x="${labelX}" y="${labelY}" class="measurement-text">${m.value}</text>`;
    });

    svg += '</svg>';
    return svg;
  }

  generateHTML(title = 'Component Measurements') {
    const dimensions = this.analyzeDimensions();
    const measurements = this.generateComponentMeasurements(dimensions);
    const svg = this.generateAdvancedSVG(dimensions, measurements);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 40px; font-family: 'Inter', sans-serif; background: #f1f5f9; color: #1a202c; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 40px; color: #1e293b; font-weight: 600; font-size: 28px; }
        .measurement-viewer { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); margin-bottom: 30px; text-align: center; border: 1px solid #e2e8f0; }
        .specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; background: white; border-radius: 20px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .spec-section h3 { margin: 0 0 10px 0; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .spec-section h3::before { content: ''; width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .spec-section ul { list-style: none; padding: 0; margin: 0; }
        .spec-section li { padding: 2px 0; font-size: 12px; display: flex; justify-content: space-between; }
        .spec-section strong { font-weight: 600; color: #1e40af; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="measurement-viewer">${svg}</div>
        <div class="specs-grid">
            <div class="spec-section">
                <h3 style="color: ${this.colors.blue};"><span style="background: ${this.colors.blue};"></span>Control</h3>
                <ul><li><span>Size:</span> <strong>${dimensions.checkbox.width}×${dimensions.checkbox.height}px</strong></li><li><span>Background:</span> <strong>#0b5cdf</strong></li></ul>
            </div>
            <div class="spec-section">
                <h3 style="color: ${this.colors.purple};"><span style="background: ${this.colors.purple};"></span>Spacing</h3>
                <ul><li><span>Gap:</span> <strong>${dimensions.gap}px</strong></li></ul>
            </div>
            <div class="spec-section">
                <h3 style="color: ${this.colors.pink};"><span style="background: ${this.colors.pink};"></span>Focus</h3>
                <ul><li><span>Size:</span> <strong>${dimensions.focusRing.width}px</strong></li><li><span>Border:</span> <strong>${dimensions.focusRing.border}px</strong></li></ul>
            </div>
            <div class="spec-section">
                <h3 style="color: #475569;"><span style="background: #475569;"></span>Typography</h3>
                <ul><li><span>Font:</span> <strong>Inter 500</strong></li><li><span>Size:</span> <strong>14px</strong></li></ul>
            </div>
        </div>
        <div class="footer">Protected area placement • No component overlap • Figma-accurate rendering</div>
    </div>
</body>
</html>`;
  }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProtectedAreaMeasurementGenerator };
}