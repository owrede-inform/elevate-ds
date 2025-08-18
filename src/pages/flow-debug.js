import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function FlowDebug() {
  useEffect(() => {
    const debugFlow = () => {
      console.log('🌊 Flow Debug Starting...');
      
      setTimeout(() => {
        const IconRegistry = window.IconRegistry;
        
        if (!IconRegistry) {
          console.log('❌ IconRegistry not available');
          return;
        }
        
        // Test the exact parseIconString flow manually
        console.log('🧪 Testing parseIconString flow manually...');
        
        const testValue = "mdi:settings";
        console.log('1. Input value:', testValue);
        
        // Step 1: Split the value
        const [library, name] = testValue.match(/^\w+:.+/) ? testValue.split(":", 2).map((s) => s.trim()) : [undefined, testValue];
        console.log('2. Parsed library:', library);
        console.log('3. Parsed name:', name);
        
        // Step 2: Call IconRegistry.getIcon
        const detailPromise = IconRegistry.getIcon(name, library || IconRegistry.DefaultLibrary);
        console.log('4. detailPromise exists:', !!detailPromise);
        
        if (detailPromise) {
          detailPromise.then(detail => {
            console.log('5. detail exists:', !!detail);
            console.log('6. typeof detail:', typeof detail);
            
            if (detail) {
              if (typeof detail === "string") {
                console.log('7. detail is string, checking prefixes...');
                console.log('   detail.startsWith("blob:"):', detail.startsWith("blob:"));
                console.log('   detail.startsWith("http"):', detail.startsWith("http"));
                console.log('   detail.startsWith("data:"):', detail.startsWith("data:"));
                console.log('   detail.startsWith("url:"):', detail.startsWith("url:"));
                console.log('   detail.startsWith("mask:"):', detail.startsWith("mask:"));
                
                if (detail.startsWith("blob:") || detail.startsWith("http")) {
                  console.log('8. → Would call fetchIconFromUrl');
                } else if (detail.startsWith("data:")) {
                  console.log('8. ✅ Would return detail string directly');
                  console.log('   Detail preview:', detail.substring(0, 100) + '...');
                } else if (detail.startsWith("url:")) {
                  console.log('8. → Would return detail.substring(4)');
                } else if (detail.startsWith("mask:")) {
                  console.log('8. → Would return detail.substring(5)');
                } else {
                  console.log('8. → No prefix matched, would fall through');
                }
              } else {
                console.log('7. ❌ detail is not string, would call new Icon(detail)');
              }
            } else {
              console.log('5. ❌ detail is falsy');
            }
          }).catch(error => {
            console.log('5. ❌ Promise rejected:', error);
          });
        } else {
          console.log('4. ❌ detailPromise is falsy, would call new Icon(value)');
        }
        
        // Also test what the actual component does
        console.log('\n🔍 Testing actual component parseIconString...');
        const icons = document.querySelectorAll('elvt-icon');
        if (icons.length > 0) {
          const icon = icons[0];
          
          icon.parseIconString("mdi:settings").then(result => {
            console.log('Component parseIconString result type:', typeof result);
            console.log('Component parseIconString result instanceof Icon:', result && result.constructor && result.constructor.name);
            
            if (typeof result === 'string') {
              console.log('✅ Component returned string:', result.substring(0, 100) + '...');
            } else if (result && result.url) {
              console.log('❌ Component returned Icon with url:', result.url);
              console.log('Icon.svg preview:', result.svg ? result.svg.substring(0, 100) + '...' : 'no svg');
            }
          });
        }
        
      }, 1500);
    };
    
    debugFlow();
  }, []);

  return (
    <Layout title="Flow Debug" description="Debug parseIconString flow step by step">
      <div style={{ padding: '2rem' }}>
        <h1>Flow Debug Test</h1>
        <p>Testing parseIconString flow step by step - check console.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>MDI Settings:</span>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
        </div>
      </div>
    </Layout>
  );
}