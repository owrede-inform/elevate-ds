import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function TimingDebug() {
  useEffect(() => {
    const debugTiming = () => {
      console.log('🕒 Timing Debug Analysis Starting...');
      
      // Monitor icon elements over time
      const checkIconsOverTime = () => {
        const icons = document.querySelectorAll('elvt-icon');
        console.log(`\n⏰ Time check - Found ${icons.length} elvt-icon elements`);
        
        icons.forEach((icon, index) => {
          const iconName = icon.getAttribute('icon');
          console.log(`\n--- Icon ${index + 1}: ${iconName} ---`);
          
          // Check component state
          console.log('Component _icon:', icon._icon);
          console.log('Component _iconValue:', icon._iconValue);
          
          const shadowRoot = icon.shadowRoot;
          if (shadowRoot) {
            const maskElement = shadowRoot.querySelector('.mask');
            if (maskElement) {
              const computedStyle = window.getComputedStyle(maskElement);
              const symbolProperty = maskElement.style.getPropertyValue('--symbol');
              
              console.log('--symbol CSS property:', symbolProperty || 'NOT SET');
              console.log('computed mask:', computedStyle.mask);
              console.log('computed mask-image:', computedStyle.maskImage);
              console.log('computed -webkit-mask-image:', computedStyle.webkitMaskImage);
              
              // Check if _iconValue is set
              if (icon._iconValue) {
                console.log('✅ _iconValue is set:', typeof icon._iconValue);
                console.log('_iconValue.url:', icon._iconValue.url || icon._iconValue);
              } else {
                console.log('❌ _iconValue is NOT set');
                
                // Manually test parseIconString
                console.log('🧪 Testing parseIconString manually...');
                icon.parseIconString(iconName).then(result => {
                  console.log('parseIconString result:', result);
                  console.log('Should trigger re-render...');
                }).catch(error => {
                  console.log('parseIconString error:', error);
                });
              }
            } else {
              console.log('❌ No .mask element found in shadow DOM');
            }
          } else {
            console.log('❌ No shadow root');
          }
        });
      };
      
      // Check immediately
      setTimeout(checkIconsOverTime, 1000);
      
      // Check again after more time for async resolution
      setTimeout(() => {
        console.log('\n🔄 Second timing check after async resolution...');
        checkIconsOverTime();
      }, 3000);
      
      // Check one more time
      setTimeout(() => {
        console.log('\n🔄 Final timing check...');
        checkIconsOverTime();
      }, 5000);
    };
    
    debugTiming();
  }, []);

  return (
    <Layout title="Timing Debug" description="Debug async timing issues with elvt-icon">
      <div style={{ padding: '2rem' }}>
        <h1>Timing Debug Test</h1>
        <p>This page debugs the async timing between icon registration and CSS property setting.</p>
        <p>Check the browser console for detailed timing analysis.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Flow</h2>
          <ol>
            <li>elvt-icon parseIconString() calls IconRegistry.getIcon()</li>
            <li>IconRegistry.getIcon() returns Promise with data URL</li>
            <li>parseIconString() resolves and sets _iconValue</li>
            <li>Component should re-render and call createElement()</li>
            <li>createElement() should set --symbol CSS property</li>
            <li>CSS mask should use --symbol for mask-image</li>
          </ol>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Icons</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>MDI Settings:</span>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>ELEVATE Home:</span>
            <elvt-icon icon="elvt:home" style={{ fontSize: '24px', color: 'green' }}></elvt-icon>
          </div>
        </div>
      </div>
    </Layout>
  );
}