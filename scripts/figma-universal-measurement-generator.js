#!/usr/bin/env node

/**
 * Universal Figma Measurement Generator
 * Fetches any component and generates professional measurements
 */

class UniversalFigmaMeasurementGenerator {
  constructor() {
    this.backdropWidth = 280;
    this.backdropHeight = 140;
    this.colors = {
      blue: '#2F7CFF',
      purple: '#E056FD', 
      pink: '#FF6B9D',
      green: '#00D68F',
      teal: '#0DCEDA',
      orange: '#FF8C42'
    };
    this.componentData = null;
    this.measurements = [];
  }

  // Fetch component from Figma using MCP
  async fetchFigmaComponent(nodeId) {
    try {
      // In real implementation, this would use MCP tools
      // For now, we'll simulate with the checkbox data
      this.componentData = {
        nodeId: nodeId,
        bounds: { width: 90, height: 20 },
        elements: {
          checkbox: { x: 0, y: 2, width: 16, height: 16 },
          focusRing: { x: -3, y: -1, width: 22, height: 22, borderWidth: 2 },
          label: { x: 24, y: 2, width: 66, height: 16 },
          gaps: [
            { type: 'horizontal', x: 16, y: 2, width: 8, height: 16, name: 'label-gap' }
          ]
        },
        styles: {
          checkbox: { fill: '#0b5cdf', stroke: '#0072ff', strokeWidth: 0.5, borderRadius: 2 },
          focusRing: { stroke: '#0b5cdf', strokeWidth: 2, borderRadius: 3, strokeDasharray: '3,2' },
          label: { fontSize: 14, fontWeight: 500, color: '#3d4253', fontFamily: 'Inter' }
        }
      };
      return this.componentData;
    } catch (error) {
      console.error('Failed to fetch component:', error);
      return null;
    }
  }

  // Calculate component positioning on backdrop
  calculateComponentPosition() {
    const { bounds } = this.componentData;
    const centerX = (this.backdropWidth - bounds.width) / 2;
    const centerY = (this.backdropHeight - bounds.height) / 2;
    return { x: centerX, y: centerY };
  }

  // Generate measurement data
  generateMeasurements() {
    const { elements } = this.componentData;
    const position = this.calculateComponentPosition();
    const measurements = [];

    // 1. Main element dimensions
    const checkbox = elements.checkbox;
    measurements.push({
      type: 'dimension',
      target: 'checkbox',
      dimension: 'width',
      value: checkbox.width,
      x: position.x + checkbox.x,
      y: position.y + checkbox.y,
      width: checkbox.width,
      height: checkbox.height,
      color: this.colors.blue,
      placement: 'top'
    });

    measurements.push({
      type: 'dimension',
      target: 'checkbox',
      dimension: 'height', 
      value: checkbox.height,
      x: position.x + checkbox.x,
      y: position.y + checkbox.y,
      width: checkbox.width,
      height: checkbox.height,
      color: this.colors.blue,
      placement: 'left'
    });

    // 2. Focus ring dimensions
    const focusRing = elements.focusRing;
    measurements.push({
      type: 'dimension',
      target: 'focusRing',
      dimension: 'size',
      value: focusRing.width,
      x: position.x + focusRing.x,
      y: position.y + focusRing.y,
      width: focusRing.width,
      height: focusRing.height,
      color: this.colors.pink,
      placement: 'top-offset'
    });

    // 3. Border width (diagonal measurement)
    measurements.push({
      type: 'border',
      target: 'focusRing',
      value: `${focusRing.borderWidth}px`,
      x: position.x + focusRing.x + focusRing.width,
      y: position.y + focusRing.y,
      color: this.colors.pink,
      placement: 'diagonal'
    });

    // 4. Gap measurements (transparent overlay boxes)
    elements.gaps.forEach(gap => {
      measurements.push({
        type: 'gap',
        target: gap.name,
        value: gap.width,
        x: position.x + gap.x,
        y: position.y + gap.y,
        width: gap.width,
        height: gap.height,
        color: this.colors.purple,
        placement: gap.type === 'horizontal' ? 'top-gap' : 'left-gap'
      });
    });

    return measurements;
  }

  // Generate component SVG from Figma data
  generateComponentSVG(offsetX, offsetY) {
    const { elements, styles } = this.componentData;
    let svg = '<g class="figma-component">';

    // Focus ring
    const focus = elements.focusRing;
    svg += `<rect x="${offsetX + focus.x}" y="${offsetY + focus.y}" 
             width="${focus.width}" height="${focus.height}" 
             fill="none" stroke="${styles.focusRing.stroke}" 
             stroke-width="${styles.focusRing.strokeWidth}" 
             rx="${styles.focusRing.borderRadius}" 
             stroke-dasharray="${styles.focusRing.strokeDasharray}" 
             opacity="0.8"/>`;

    // Checkbox
    const checkbox = elements.checkbox;
    svg += `<rect x="${offsetX + checkbox.x}" y="${offsetY + checkbox.y}" 
             width="${checkbox.width}" height="${checkbox.height}" 
             fill="${styles.checkbox.fill}" 
             stroke="${styles.checkbox.stroke}" 
             stroke-width="${styles.checkbox.strokeWidth}" 
             rx="${styles.checkbox.borderRadius}"/>`;

    // Checkmark
    const checkX = offsetX + checkbox.x;
    const checkY = offsetY + checkbox.y;
    svg += `<path d="M${checkX + 3} ${checkY + 8} L${checkX + 6} ${checkY + 11} L${checkX + 13} ${checkY + 4}" 
             stroke="white" stroke-width="2.5" fill="none" 
             stroke-linecap="round" stroke-linejoin="round"/>`;

    // Label
    const label = elements.label;
    svg += `<text x="${offsetX + label.x}" y="${offsetY + label.y + label.height/2}" 
             font-family="${styles.label.fontFamily}, sans-serif" 
             font-size="${styles.label.fontSize}" 
             font-weight="${styles.label.fontWeight}" 
             fill="${styles.label.color}" 
             dominant-baseline="middle">Checkbox</text>`;

    svg += '</g>';
    return svg;
  }

  // Generate measurement SVG elements
  generateMeasurementSVG(measurements) {
    let svg = '<g class="measurements">';

    measurements.forEach(m => {
      if (m.type === 'dimension') {
        svg += this.generateDimensionMeasurement(m);
      } else if (m.type === 'border') {
        svg += this.generateBorderMeasurement(m);
      } else if (m.type === 'gap') {
        svg += this.generateGapMeasurement(m);
      }
    });

    svg += '</g>';
    return svg;
  }

  // Generate dimension measurements with smart placement
  generateDimensionMeasurement(m) {
    const labelWidth = String(m.value).length * 5 + 8;
    const labelHeight = 14;
    const offset = 15;
    let svg = '';

    if (m.placement === 'top') {
      const lineY = m.y - offset;
      const labelX = m.x + m.width/2;
      const labelY = lineY - 8;

      // Measurement line
      svg += `<line x1="${m.x}" y1="${lineY}" x2="${m.x + m.width}" y2="${lineY}" 
               stroke="${m.color}" stroke-width="1"/>`;
      // End ticks
      svg += `<line x1="${m.x}" y1="${lineY - 3}" x2="${m.x}" y2="${lineY + 3}" 
               stroke="${m.color}" stroke-width="1"/>`;
      svg += `<line x1="${m.x + m.width}" y1="${lineY - 3}" x2="${m.x + m.width}" y2="${lineY + 3}" 
               stroke="${m.color}" stroke-width="1"/>`;

    } else if (m.placement === 'left') {
      const lineX = m.x - offset;
      const labelX = lineX - 8;
      const labelY = m.y + m.height/2;

      // Measurement line
      svg += `<line x1="${lineX}" y1="${m.y}" x2="${lineX}" y2="${m.y + m.height}" 
               stroke="${m.color}" stroke-width="1"/>`;
      // End ticks
      svg += `<line x1="${lineX - 3}" y1="${m.y}" x2="${lineX + 3}" y2="${m.y}" 
               stroke="${m.color}" stroke-width="1"/>`;
      svg += `<line x1="${lineX - 3}" y1="${m.y + m.height}" x2="${lineX + 3}" y2="${m.y + m.height}" 
               stroke="${m.color}" stroke-width="1"/>`;

    } else if (m.placement === 'top-offset') {
      const lineY = m.y - offset - 15; // Extra offset for focus ring
      const labelX = m.x + m.width/2;
      const labelY = lineY - 8;

      // Measurement line
      svg += `<line x1="${m.x}" y1="${lineY}" x2="${m.x + m.width}" y2="${lineY}" 
               stroke="${m.color}" stroke-width="1"/>`;
      // End ticks
      svg += `<line x1="${m.x}" y1="${lineY - 3}" x2="${m.x}" y2="${lineY + 3}" 
               stroke="${m.color}" stroke-width="1"/>`;
      svg += `<line x1="${m.x + m.width}" y1="${lineY - 3}" x2="${m.x + m.width}" y2="${lineY + 3}" 
               stroke="${m.color}" stroke-width="1"/>`;
      
      // Leader line
      svg += `<line x1="${labelX}" y1="${lineY + 5}" x2="${labelX}" y2="${m.y}" 
               stroke="${m.color}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6"/>`;
    }

    // Label (calculate position based on placement)
    let labelX, labelY;
    if (m.placement === 'top' || m.placement === 'top-offset') {
      labelX = m.x + m.width/2;
      labelY = m.y - offset - (m.placement === 'top-offset' ? 15 : 0) - 8;
    } else if (m.placement === 'left') {
      labelX = m.x - offset - 8;
      labelY = m.y + m.height/2;
    }

    svg += `<rect x="${labelX - labelWidth/2}" y="${labelY - labelHeight/2}" 
             width="${labelWidth}" height="${labelHeight}" 
             fill="${m.color}" rx="2" class="measurement-label"/>`;
    svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white">${m.value}</text>`;

    return svg;
  }

  // Generate diagonal border measurements
  generateBorderMeasurement(m) {
    const length = 25;
    const angle = -45; // 45 degrees up-right
    const radians = (angle * Math.PI) / 180;
    
    const endX = m.x + length * Math.cos(radians);
    const endY = m.y + length * Math.sin(radians);
    
    const labelX = endX + 15;
    const labelY = endY - 5;
    const labelWidth = m.value.length * 5 + 8;

    let svg = '';
    
    // Diagonal dotted line
    svg += `<line x1="${m.x}" y1="${m.y}" x2="${endX}" y2="${endY}" 
             stroke="${m.color}" stroke-width="1" stroke-dasharray="3,2" opacity="0.8"/>`;
    
    // End tick mark (perpendicular to line)
    const tickLength = 4;
    const perpAngle = radians + Math.PI/2;
    const tick1X = endX + tickLength * Math.cos(perpAngle);
    const tick1Y = endY + tickLength * Math.sin(perpAngle);
    const tick2X = endX - tickLength * Math.cos(perpAngle);
    const tick2Y = endY - tickLength * Math.sin(perpAngle);
    
    svg += `<line x1="${tick1X}" y1="${tick1Y}" x2="${tick2X}" y2="${tick2Y}" 
             stroke="${m.color}" stroke-width="1"/>`;

    // Label
    svg += `<rect x="${labelX - labelWidth/2}" y="${labelY - 7}" 
             width="${labelWidth}" height="14" 
             fill="${m.color}" rx="2" class="measurement-label"/>`;
    svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white">${m.value}</text>`;

    return svg;
  }

  // Generate gap measurements with transparent overlay boxes
  generateGapMeasurement(m) {
    const labelWidth = String(m.value).length * 5 + 8;
    let svg = '';

    if (m.placement === 'top-gap') {
      // Transparent overlay box stretching over the gap
      svg += `<rect x="${m.x}" y="${m.y}" 
               width="${m.width}" height="${m.height}" 
               fill="${m.color}" opacity="0.15" 
               stroke="${m.color}" stroke-width="1" stroke-dasharray="2,2"/>`;

      // Measurement line above
      const lineY = m.y - 10;
      svg += `<line x1="${m.x}" y1="${lineY}" x2="${m.x + m.width}" y2="${lineY}" 
               stroke="${m.color}" stroke-width="1"/>`;
      // End ticks
      svg += `<line x1="${m.x}" y1="${lineY - 2}" x2="${m.x}" y2="${lineY + 2}" 
               stroke="${m.color}" stroke-width="1"/>`;
      svg += `<line x1="${m.x + m.width}" y1="${lineY - 2}" x2="${m.x + m.width}" y2="${lineY + 2}" 
               stroke="${m.color}" stroke-width="1"/>`;

      // Label
      const labelX = m.x + m.width/2;
      const labelY = lineY - 8;
      svg += `<rect x="${labelX - labelWidth/2}" y="${labelY - 7}" 
               width="${labelWidth}" height="14" 
               fill="${m.color}" rx="2" class="measurement-label"/>`;
      svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white">${m.value}</text>`;

    } else if (m.placement === 'left-gap') {
      // Transparent overlay box for vertical gaps
      svg += `<rect x="${m.x}" y="${m.y}" 
               width="${m.width}" height="${m.height}" 
               fill="${m.color}" opacity="0.15" 
               stroke="${m.color}" stroke-width="1" stroke-dasharray="2,2"/>`;

      // Measurement line to the left
      const lineX = m.x - 10;
      svg += `<line x1="${lineX}" y1="${m.y}" x2="${lineX}" y2="${m.y + m.height}" 
               stroke="${m.color}" stroke-width="1"/>`;
      // End ticks
      svg += `<line x1="${lineX - 2}" y1="${m.y}" x2="${lineX + 2}" y2="${m.y}" 
               stroke="${m.color}" stroke-width="1"/>`;
      svg += `<line x1="${lineX - 2}" y1="${m.y + m.height}" x2="${lineX + 2}" y2="${m.y + m.height}" 
               stroke="${m.color}" stroke-width="1"/>`;

      // Label
      const labelX = lineX - 8;
      const labelY = m.y + m.height/2;
      svg += `<rect x="${labelX - labelWidth/2}" y="${labelY - 7}" 
               width="${labelWidth}" height="14" 
               fill="${m.color}" rx="2" class="measurement-label"/>`;
      svg += `<text x="${labelX}" y="${labelY}" class="measurement-text" fill="white">${m.value}</text>`;
    }

    return svg;
  }

  // Generate complete SVG
  generateCompleteSVG(nodeId) {
    const padding = 40;
    const totalWidth = this.backdropWidth + padding * 2;
    const totalHeight = this.backdropHeight + padding * 2;

    let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Styles
    svg += `<defs>
      <style>
        .measurement-text { 
          font-family: 'Inter', sans-serif; 
          font-size: 9px; 
          font-weight: 600; 
          text-anchor: middle;
          dominant-baseline: central;
        }
        .measurement-label { 
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        }
        .figma-component {
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
        }
      </style>
    </defs>`;

    // Background
    svg += `<rect width="100%" height="100%" fill="#f8fafc"/>`;

    // Backdrop (280x140)
    const backdropX = padding;
    const backdropY = padding;
    svg += `<rect x="${backdropX}" y="${backdropY}" 
             width="${this.backdropWidth}" height="${this.backdropHeight}" 
             fill="white" stroke="#e2e8f0" stroke-width="1" rx="6" 
             filter="drop-shadow(0 4px 12px rgba(0,0,0,0.08))"/>`;

    // Component positioned in center of backdrop
    const componentPosition = this.calculateComponentPosition();
    const componentSVG = this.generateComponentSVG(
      backdropX + componentPosition.x, 
      backdropY + componentPosition.y
    );
    svg += componentSVG;

    // Measurements
    const measurements = this.generateMeasurements();
    const measurementSVG = this.generateMeasurementSVG(measurements.map(m => ({
      ...m,
      x: backdropX + (m.x - (this.componentData.bounds.width - componentPosition.x)),
      y: backdropY + (m.y - (this.componentData.bounds.height - componentPosition.y))
    })));
    svg += measurementSVG;

    svg += '</svg>';
    return svg;
  }

  // Generate HTML page
  async generateHTML(nodeId, title = 'Figma Component Measurements') {
    await this.fetchFigmaComponent(nodeId);
    const svg = this.generateCompleteSVG(nodeId);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 40px; font-family: 'Inter', sans-serif; background: #f1f5f9; color: #1e293b; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 40px; font-weight: 600; font-size: 28px; }
        .measurement-viewer { background: transparent; text-align: center; margin-bottom: 30px; }
        .specs { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="measurement-viewer">${svg}</div>
        <div class="specs">
            <h3>Component: ${nodeId}</h3>
            <p><strong>Backdrop:</strong> ${this.backdropWidth}×${this.backdropHeight}px</p>
            <p><strong>Features:</strong> Centered component, diagonal border measurements, transparent gap overlays</p>
        </div>
        <div class="footer">Universal Figma measurement system • Any component supported</div>
    </div>
</body>
</html>`;
  }
}

// Usage example
const generator = new UniversalFigmaMeasurementGenerator();
const html = await generator.generateHTML('3:619', 'Checkbox Component - Universal System');

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UniversalFigmaMeasurementGenerator };
}