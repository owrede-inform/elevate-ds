import React, { useEffect, useState } from 'react';

export default function DirectTest() {
  const [debugInfo, setDebugInfo] = useState('Loading...');

  useEffect(() => {
    setTimeout(() => {
      const info = {
        elvtIconDefined: !!window.customElements.get('elvt-icon'),
        iconRegistry: typeof window.IconRegistry !== 'undefined',
        iconRegistryMethods: window.IconRegistry ? Object.getOwnPropertyNames(window.IconRegistry) : 'N/A',
        elevateUI: typeof window.ElevateUI !== 'undefined',
        mdiAvailable: typeof window.mdiIcons !== 'undefined'
      };
      setDebugInfo(JSON.stringify(info, null, 2));
    }, 2000);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Direct elvt-icon Test</h1>
      
      <h2>Test 1: Basic elvt-icon</h2>
      <div style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}>
        <elvt-icon icon="mdi:cog" style={{ width: '24px', height: '24px', color: 'red' }}></elvt-icon>
      </div>
      
      <h2>Test 2: Your original request</h2>
      <div style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
        <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616', width: '24px', height: '24px' }}></elvt-icon>
      </div>
      
      <h2>Test 3: Force size and color</h2>
      <div style={{ border: '2px solid green', padding: '10px', margin: '10px 0' }}>
        <elvt-icon icon="mdi:home" style={{ '--icon-size': '32px', color: 'blue', display: 'inline-block' }}></elvt-icon>
      </div>
      
      <h2>Test 4: ELEVATE icon test</h2>
      <div style={{ border: '2px solid purple', padding: '10px', margin: '10px 0' }}>
        <elvt-icon icon="elvt:home" style={{ '--icon-size': '32px', color: 'purple', display: 'inline-block' }}></elvt-icon>
      </div>
      
      <h2>Debug Info:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>{debugInfo}</pre>
      
      <h2>Manual Console Test:</h2>
      <button onClick={() => {
        console.log('=== DIRECT TEST ===');
        console.log('Custom elements defined:', !!window.customElements.get('elvt-icon'));
        console.log('IconRegistry available:', typeof window.IconRegistry);
        console.log('IconRegistry object:', window.IconRegistry);
        
        // Test the resolver directly
        if (window.IconRegistry) {
          console.log('Testing resolver for mdi:cog...');
          const result = window.IconRegistry.getIcon('cog', 'mdi');
          console.log('Resolver result:', result);
        }
        
        const icons = document.querySelectorAll('elvt-icon');
        console.log('Found elvt-icon elements:', icons.length);
        
        icons.forEach((icon, i) => {
          console.log(`Icon ${i}:`, {
            tagName: icon.tagName,
            iconAttr: icon.getAttribute('icon'),
            hasShadowRoot: !!icon.shadowRoot,
            innerHTML: icon.innerHTML,
            outerHTML: icon.outerHTML.substring(0, 200)
          });
          
          if (icon.shadowRoot) {
            console.log(`Icon ${i} shadow DOM:`, icon.shadowRoot.innerHTML);
            
            const maskElement = icon.shadowRoot.querySelector('.mask');
            if (maskElement) {
              const styles = window.getComputedStyle(maskElement);
              console.log(`Icon ${i} mask styles:`, {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                maskImage: styles.maskImage,
                WebkitMaskImage: styles.WebkitMaskImage,
                width: styles.width,
                height: styles.height,
                display: styles.display
              });
            }
          }
        });
      }}>
        Log Debug Info to Console
      </button>
    </div>
  );
}