import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function ParseDebug() {
  useEffect(() => {
    const debugParse = () => {
      console.log('🔍 Parse Debug Analysis Starting...');
      
      setTimeout(() => {
        const icons = document.querySelectorAll('elvt-icon');
        console.log(`Found ${icons.length} elvt-icon elements`);
        
        icons.forEach((icon, index) => {
          const iconName = icon.getAttribute('icon');
          console.log(`\n--- Icon ${index + 1}: ${iconName} ---`);
          
          // Manually call parseIconString to see what happens
          console.log('🧪 Manually calling parseIconString...');
          
          icon.parseIconString(iconName).then(result => {
            console.log('parseIconString result type:', typeof result);
            console.log('parseIconString result instanceof Icon:', result && result.constructor && result.constructor.name);
            
            if (typeof result === 'string') {
              console.log('✅ parseIconString returned string (data URL)');
              console.log('String preview:', result.substring(0, 100) + '...');
            } else if (result && result.url) {
              console.log('✅ parseIconString returned Icon object');
              console.log('Icon.url:', result.url);
              console.log('Icon.svg preview:', result.svg ? result.svg.substring(0, 100) + '...' : 'no svg property');
            } else {
              console.log('❌ parseIconString returned unexpected type');
              console.log('Result:', result);
            }
            
            // Check what the component actually has
            console.log('\n📊 Component state:');
            console.log('_icon:', icon._icon);
            console.log('_iconValue type:', typeof icon._iconValue);
            console.log('_iconValue instanceof Icon:', icon._iconValue && icon._iconValue.constructor && icon._iconValue.constructor.name);
            
            if (icon._iconValue && icon._iconValue.url) {
              console.log('_iconValue.url:', icon._iconValue.url);
            }
            
            // Check the CSS property
            const shadowRoot = icon.shadowRoot;
            if (shadowRoot) {
              const maskElement = shadowRoot.querySelector('.mask');
              if (maskElement) {
                const symbolProperty = maskElement.style.getPropertyValue('--symbol');
                console.log('Current --symbol CSS property:', symbolProperty || 'NOT SET');
              }
            }
            
          }).catch(error => {
            console.log('parseIconString error:', error);
          });
        });
        
        // Also test IconRegistry directly
        console.log('\n🔧 Direct IconRegistry test:');
        const IconRegistry = window.IconRegistry;
        if (IconRegistry) {
          IconRegistry.getIcon('settings', 'mdi').then(registryResult => {
            console.log('Direct getIcon result type:', typeof registryResult);
            console.log('Direct getIcon result preview:', String(registryResult).substring(0, 100) + '...');
          });
        }
        
      }, 1500);
    };
    
    debugParse();
  }, []);

  return (
    <Layout title="Parse Debug" description="Debug parseIconString method">
      <div style={{ padding: '2rem' }}>
        <h1>Parse Debug Test</h1>
        <p>Testing parseIconString method flow - check console.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>MDI Settings:</span>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
        </div>
      </div>
    </Layout>
  );
}