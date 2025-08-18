import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function CssMaskDebug() {
  useEffect(() => {
    const debugCssMask = () => {
      console.log('🔍 CSS Mask Debug Analysis Starting...');
      
      // Wait for elvt-icon components to be rendered
      setTimeout(() => {
        const icons = document.querySelectorAll('elvt-icon');
        console.log(`Found ${icons.length} elvt-icon elements`);
        
        icons.forEach((icon, index) => {
          console.log(`\n--- Icon ${index + 1}: ${icon.getAttribute('icon')} ---`);
          
          // Get the shadow root
          const shadowRoot = icon.shadowRoot;
          if (!shadowRoot) {
            console.log('❌ No shadow root found');
            return;
          }
          
          // Find the icon element within shadow DOM
          const iconElement = shadowRoot.querySelector('.icon') || shadowRoot.querySelector('[part="icon"]') || shadowRoot.querySelector('*');
          if (!iconElement) {
            console.log('❌ No icon element found in shadow DOM');
            return;
          }
          
          // Get computed styles
          const computedStyle = window.getComputedStyle(iconElement);
          
          console.log('CSS Properties:');
          console.log('  mask-image:', computedStyle.maskImage || 'none');
          console.log('  -webkit-mask-image:', computedStyle.webkitMaskImage || 'none');
          console.log('  mask-size:', computedStyle.maskSize || 'auto');
          console.log('  -webkit-mask-size:', computedStyle.webkitMaskSize || 'auto');
          console.log('  mask-repeat:', computedStyle.maskRepeat || 'repeat');
          console.log('  -webkit-mask-repeat:', computedStyle.webkitMaskRepeat || 'repeat');
          console.log('  background-color:', computedStyle.backgroundColor);
          console.log('  color:', computedStyle.color);
          console.log('  width:', computedStyle.width);
          console.log('  height:', computedStyle.height);
          console.log('  display:', computedStyle.display);
          
          // Check if mask URL is accessible
          const maskImage = computedStyle.maskImage || computedStyle.webkitMaskImage;
          if (maskImage && maskImage !== 'none') {
            const urlMatch = maskImage.match(/url\("([^"]+)"\)/);
            if (urlMatch) {
              const maskUrl = urlMatch[1];
              console.log('  mask URL:', maskUrl);
              
              // Test if the URL is accessible
              fetch(maskUrl)
                .then(response => {
                  console.log(`  mask URL status: ${response.status}`);
                  return response.text();
                })
                .then(content => {
                  console.log(`  mask content length: ${content.length}`);
                  console.log(`  mask content preview: ${content.substring(0, 100)}...`);
                })
                .catch(error => {
                  console.log(`  ❌ mask URL error: ${error.message}`);
                });
            }
          }
          
          // Get all CSS rules applied to this element
          console.log('Applied CSS Rules:');
          const sheets = Array.from(document.styleSheets);
          for (const sheet of sheets) {
            try {
              const rules = Array.from(sheet.cssRules || sheet.rules || []);
              for (const rule of rules) {
                if (rule.selectorText && iconElement.matches && iconElement.matches(rule.selectorText)) {
                  console.log(`  ${rule.selectorText}: ${rule.style.cssText}`);
                }
              }
            } catch (e) {
              // Cross-origin CSS, skip
            }
          }
          
          // Check parent element styles that might interfere
          console.log('Host Element Styles:');
          const hostStyle = window.getComputedStyle(icon);
          console.log('  display:', hostStyle.display);
          console.log('  visibility:', hostStyle.visibility);
          console.log('  opacity:', hostStyle.opacity);
          console.log('  overflow:', hostStyle.overflow);
        });
        
        // Test browser mask support
        console.log('\n🧪 Browser Mask Support Test:');
        const testElement = document.createElement('div');
        testElement.style.width = '20px';
        testElement.style.height = '20px';
        testElement.style.backgroundColor = 'red';
        testElement.style.maskImage = 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/></svg>")';
        testElement.style.webkitMaskImage = 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/></svg>")';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
          const testStyle = window.getComputedStyle(testElement);
          console.log('Test element mask-image:', testStyle.maskImage);
          console.log('Test element -webkit-mask-image:', testStyle.webkitMaskImage);
          document.body.removeChild(testElement);
        }, 100);
        
      }, 1000);
    };
    
    debugCssMask();
  }, []);

  return (
    <Layout title="CSS Mask Debug" description="Debug CSS mask rendering for elvt-icon">
      <div style={{ padding: '2rem' }}>
        <h1>CSS Mask Debug Test</h1>
        <p>This page debugs why CSS masks aren't working for elvt-icon components.</p>
        <p>Check the browser console for detailed CSS mask analysis.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Icons</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>MDI Settings:</span>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>MDI Cog:</span>
            <elvt-icon icon="mdi:cog" style={{ fontSize: '24px', color: 'blue' }}></elvt-icon>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>ELEVATE Home:</span>
            <elvt-icon icon="elvt:home" style={{ fontSize: '24px', color: 'green' }}></elvt-icon>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>ELEVATE Check:</span>
            <elvt-icon icon="elvt:check" style={{ fontSize: '24px', color: 'purple' }}></elvt-icon>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Manual CSS Mask Test</h2>
          <div 
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'red',
              maskImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/></svg>")',
              WebkitMaskImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/></svg>")',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat'
            }}
            title="Manual CSS mask test - should show a red circle"
          ></div>
          <p>↑ This should show a red circle if CSS masking works in your browser</p>
        </div>
      </div>
    </Layout>
  );
}