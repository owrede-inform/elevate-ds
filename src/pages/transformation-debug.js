import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function TransformationDebug() {
  useEffect(() => {
    const debugTransformation = () => {
      console.log('🔄 Transformation Debug Starting...');
      
      setTimeout(() => {
        const icons = document.querySelectorAll('elvt-icon');
        const icon = icons[0]; // Focus on first icon
        
        if (!icon) {
          console.log('❌ No icon found');
          return;
        }
        
        console.log('🎯 Monitoring icon:', icon.getAttribute('icon'));
        
        // Store original methods to intercept calls
        const originalParseIconString = icon.parseIconString.bind(icon);
        const originalCreateElement = icon.createElement.bind(icon);
        
        // Intercept parseIconString
        icon.parseIconString = function(value) {
          console.log('\n📞 parseIconString called with:', value);
          
          const promise = originalParseIconString(value);
          
          promise.then(result => {
            console.log('📤 parseIconString returned type:', typeof result);
            console.log('📤 parseIconString returned instanceof Icon:', result && result.constructor && result.constructor.name);
            
            if (typeof result === 'string') {
              console.log('📤 parseIconString returned string preview:', result.substring(0, 80) + '...');
            } else if (result && result.url) {
              console.log('📤 parseIconString returned Icon.url:', result.url);
            }
          }).catch(error => {
            console.log('📤 parseIconString error:', error);
          });
          
          return promise;
        };
        
        // Intercept createElement
        icon.createElement = function(part, iconValue) {
          console.log('\n🏗️ createElement called:');
          console.log('   part:', part);
          console.log('   iconValue type:', typeof iconValue);
          console.log('   iconValue instanceof Icon:', iconValue && iconValue.constructor && iconValue.constructor.name);
          
          if (typeof iconValue === 'string') {
            console.log('   iconValue string preview:', iconValue.substring(0, 80) + '...');
          } else if (iconValue && iconValue.url) {
            console.log('   iconValue Icon.url:', iconValue.url);
          }
          
          const result = originalCreateElement(part, iconValue);
          console.log('🏗️ createElement completed');
          
          return result;
        };
        
        // Monitor _iconValue changes
        let currentIconValue = icon._iconValue;
        console.log('📊 Initial _iconValue type:', typeof currentIconValue);
        
        const checkIconValue = () => {
          if (icon._iconValue !== currentIconValue) {
            console.log('\n🔄 _iconValue changed!');
            console.log('   Previous type:', typeof currentIconValue);
            console.log('   New type:', typeof icon._iconValue);
            console.log('   New instanceof Icon:', icon._iconValue && icon._iconValue.constructor && icon._iconValue.constructor.name);
            
            if (typeof icon._iconValue === 'string') {
              console.log('   New string preview:', icon._iconValue.substring(0, 80) + '...');
            } else if (icon._iconValue && icon._iconValue.url) {
              console.log('   New Icon.url:', icon._iconValue.url);
            }
            
            currentIconValue = icon._iconValue;
          }
        };
        
        // Check every 100ms for changes
        const intervalId = setInterval(checkIconValue, 100);
        
        // Stop monitoring after 5 seconds
        setTimeout(() => {
          clearInterval(intervalId);
          console.log('\n✋ Stopped monitoring');
        }, 5000);
        
        // Trigger a re-render by changing a property
        console.log('\n🔄 Triggering icon re-parsing...');
        const currentIcon = icon.getAttribute('icon');
        icon.setAttribute('icon', currentIcon); // This should trigger the setter
        
      }, 1500);
    };
    
    debugTransformation();
  }, []);

  return (
    <Layout title="Transformation Debug" description="Debug string to Icon transformation">
      <div style={{ padding: '2rem' }}>
        <h1>Transformation Debug</h1>
        <p>Monitoring exact moment when string becomes Icon object - check console.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>MDI Settings:</span>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
        </div>
      </div>
    </Layout>
  );
}