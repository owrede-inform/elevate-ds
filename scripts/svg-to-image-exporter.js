#!/usr/bin/env node

/**
 * SVG to High-Quality Image Exporter
 * Converts the measurement SVG to PNG/JPEG with perfect rendering
 */

const fs = require('fs');
const path = require('path');

class SVGImageExporter {
  constructor() {
    this.width = 360;
    this.height = 220;
    this.scale = 3; // 3x for high DPI displays
  }

  // Generate the measurement SVG with embedded fonts and proper styling
  generateHighQualitySVG() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" 
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Embed Inter font for consistent rendering -->
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;display=swap');
      
      .measurement-text { 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
        font-size: 10px; 
        font-weight: 600; 
        text-anchor: middle;
        dominant-baseline: central;
        fill: white;
      }
      .measurement-label { 
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        rx: 3;
      }
      .figma-component {
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
      }
      .gap-overlay {
        opacity: 0.15;
      }
    </style>
    
    <!-- Define gradients for better rendering -->
    <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
    </linearGradient>
    
    <!-- Define filters for consistent shadows -->
    <filter id="componentShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offset"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge> 
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="labelShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
      <feOffset dx="0" dy="1" result="offset"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15"/>
      </feComponentTransfer>
      <feMerge> 
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background with subtle gradient -->
  <rect width="100%" height="100%" fill="url(#backgroundGradient)"/>

  <!-- Clean white backdrop -->
  <rect x="40" y="40" width="280" height="140" fill="white"/>

  <!-- Component centered in backdrop -->
  <g transform="translate(135, 100)" filter="url(#componentShadow)">
    <!-- Focus ring (blue dashed border) -->
    <rect x="-3" y="-1" width="22" height="22" 
          fill="none" stroke="#0b5cdf" stroke-width="2" rx="3" 
          stroke-dasharray="3,2" opacity="0.8"/>
    
    <!-- Checkbox control -->
    <rect x="0" y="2" width="16" height="16" 
          fill="#0b5cdf" stroke="#0072ff" stroke-width="0.5" rx="2"/>
    
    <!-- Checkmark with perfect curves -->
    <path d="M3 10 L6 13 L13 6" 
          stroke="white" stroke-width="2.5" fill="none" 
          stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Label text with fallback fonts -->
    <text x="24" y="13" 
          font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="14" font-weight="500" 
          fill="#3d4253" dominant-baseline="middle">Checkbox</text>
  </g>

  <!-- MEASUREMENTS -->

  <!-- 1. Checkbox width (16) -->
  <g>
    <line x1="120" y1="102" x2="120" y2="118" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <line x1="117" y1="102" x2="123" y2="102" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <line x1="117" y1="118" x2="123" y2="118" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <rect x="95" y="103" width="18" height="14" fill="#2F7CFF" rx="3" filter="url(#labelShadow)"/>
    <text x="104" y="110" class="measurement-text">16</text>
  </g>

  <!-- 2. Checkbox height (16) -->
  <g>
    <line x1="135" y1="135" x2="151" y2="135" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <line x1="135" y1="132" x2="135" y2="138" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <line x1="151" y1="132" x2="151" y2="138" stroke="#2F7CFF" stroke-width="1" stroke-linecap="round"/>
    <rect x="135" y="142" width="18" height="14" fill="#2F7CFF" rx="3" filter="url(#labelShadow)"/>
    <text x="143" y="149" class="measurement-text">16</text>
  </g>

  <!-- 3. Focus ring size (22) -->
  <g>
    <line x1="132" y1="75" x2="154" y2="75" stroke="#FF6B9D" stroke-width="1" stroke-linecap="round"/>
    <line x1="132" y1="72" x2="132" y2="78" stroke="#FF6B9D" stroke-width="1" stroke-linecap="round"/>
    <line x1="154" y1="72" x2="154" y2="78" stroke="#FF6B9D" stroke-width="1" stroke-linecap="round"/>
    <rect x="135" y="61" width="18" height="14" fill="#FF6B9D" rx="3" filter="url(#labelShadow)"/>
    <text x="143" y="68" class="measurement-text">22</text>
  </g>

  <!-- 4. Border width (2) -->
  <g>
    <line x1="154" y1="99" x2="172" y2="81" stroke="#FF6B9D" stroke-width="1" 
          stroke-dasharray="3,2" opacity="0.8" stroke-linecap="round"/>
    <circle cx="154" cy="99" r="2" fill="#FF6B9D" opacity="0.8"/>
    <rect x="175" y="71" width="14" height="14" fill="#FF6B9D" rx="3" filter="url(#labelShadow)"/>
    <text x="182" y="78" class="measurement-text">2</text>
  </g>

  <!-- 5. Gap measurement (8) -->
  <g>
    <rect x="151" y="78" width="8" height="40" 
          fill="#E056FD" opacity="0.15"/>
    <rect x="151" y="51" width="14" height="14" fill="#E056FD" rx="3" filter="url(#labelShadow)"/>
    <text x="155" y="58" class="measurement-text">8</text>
  </g>

</svg>`;
  }

  // Generate HTML with canvas conversion functionality
  generateImageExportHTML() {
    const svg = this.generateHighQualitySVG();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG to Image Exporter</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { 
            margin: 0; 
            padding: 40px; 
            font-family: 'Inter', sans-serif; 
            background: #f1f5f9; 
            color: #1e293b; 
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
            text-align: center;
        }
        .preview {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin: 20px 0;
            display: inline-block;
        }
        .controls {
            margin: 20px 0;
        }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin: 0 5px;
            transition: background 0.2s;
        }
        button:hover {
            background: #2563eb;
        }
        button.secondary {
            background: #6b7280;
        }
        button.secondary:hover {
            background: #4b5563;
        }
        #canvas {
            display: none;
        }
        .info {
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Universal Figma Measurement System - Image Export</h1>
        
        <div class="preview">
            <div id="svg-container">
                ${svg}
            </div>
        </div>

        <div class="controls">
            <button onclick="exportAsPNG()">Export as PNG</button>
            <button onclick="exportAsJPEG()" class="secondary">Export as JPEG</button>
            <button onclick="exportHighDPI()" class="secondary">Export High-DPI PNG</button>
        </div>

        <div class="info">
            <p><strong>Export Options:</strong></p>
            <p>• <strong>PNG:</strong> Best for web use with transparency support</p>
            <p>• <strong>JPEG:</strong> Smaller file size, good for documentation</p>
            <p>• <strong>High-DPI PNG:</strong> 3x resolution for crisp display on retina screens</p>
        </div>

        <canvas id="canvas"></canvas>
    </div>

    <script>
        function svgToCanvas(scale = 1) {
            return new Promise((resolve) => {
                const svgElement = document.querySelector('svg');
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                const width = ${this.width};
                const height = ${this.height};
                canvas.width = width * scale;
                canvas.height = height * scale;
                
                // Scale context for high DPI
                ctx.scale(scale, scale);
                
                // Convert SVG to data URL
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                const svgUrl = URL.createObjectURL(svgBlob);
                
                // Create image and draw to canvas
                const img = new Image();
                img.onload = function() {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    URL.revokeObjectURL(svgUrl);
                    resolve(canvas);
                };
                img.src = svgUrl;
            });
        }
        
        async function exportAsPNG() {
            const canvas = await svgToCanvas(1);
            const link = document.createElement('a');
            link.download = 'figma-measurements.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        async function exportAsJPEG() {
            const canvas = await svgToCanvas(1);
            const link = document.createElement('a');
            link.download = 'figma-measurements.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }
        
        async function exportHighDPI() {
            const canvas = await svgToCanvas(${this.scale});
            const link = document.createElement('a');
            link.download = 'figma-measurements-hidpi.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }

        // Auto-load fonts for better rendering
        document.fonts.ready.then(() => {
            console.log('Fonts loaded - ready for export');
        });
    </script>
</body>
</html>`;
  }

  // Generate standalone SVG file
  generateStandaloneSVG() {
    return this.generateHighQualitySVG();
  }
}

// Create the exporter
const exporter = new SVGImageExporter();

// Generate files
const htmlContent = exporter.generateImageExportHTML();
const svgContent = exporter.generateStandaloneSVG();

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SVGImageExporter };
}

// Write files if running in Node.js
if (typeof window === 'undefined') {
  fs.writeFileSync(path.join(__dirname, '..', 'measurement-export.html'), htmlContent);
  fs.writeFileSync(path.join(__dirname, '..', 'measurement-standalone.svg'), svgContent);
  console.log('Generated:');
  console.log('- measurement-export.html (with PNG/JPEG export functionality)');  
  console.log('- measurement-standalone.svg (high-quality standalone SVG)');
}