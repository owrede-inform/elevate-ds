import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function ConstructorDebug() {
  useEffect(() => {
    const debugConstructor = () => {
      console.log('🏗️ Constructor Debug Starting...');
      
      setTimeout(() => {
        // Try to intercept Icon constructor calls
        console.log('🧪 Attempting to intercept Icon constructor...');
        
        // Get a reference to the Icon class through the component
        const icons = document.querySelectorAll('elvt-icon');
        if (icons.length > 0) {
          const icon = icons[0];
          
          // Test what happens when we manually create Icon objects
          console.log('🔧 Testing manual Icon creation...');
          
          const IconRegistry = window.IconRegistry;
          if (IconRegistry) {
            const testData = IconRegistry._libraries['mdi']['settings'];
            console.log('📋 Test data (base64 URL):', testData.substring(0, 100) + '...');
            
            // Try to get the Icon class from the ELEVATE bundle
            try {
              // The Icon class is available as a global or through the component
              console.log('🔍 Searching for Icon class...');
              
              // Try accessing through the component's parseIconString result
              icon.parseIconString('mdi:settings').then(result => {
                if (result && result.constructor) {
                  const IconClass = result.constructor;
                  console.log('✅ Found Icon class:', IconClass.name);
                  
                  // Test creating an Icon with our base64 data URL
                  console.log('🧪 Testing Icon constructor with base64 data URL...');
                  try {
                    const testIcon = new IconClass(testData);
                    console.log('✅ Icon created successfully');
                    console.log('Icon.url:', testIcon.url);
                    console.log('Icon.svg preview:', testIcon.svg ? testIcon.svg.substring(0, 100) + '...' : 'no svg');
                    
                    // Check if the SVG contains the actual path
                    if (testIcon.svg && testIcon.svg.includes('<path d="M')) {
                      console.log('✅ Icon.svg contains valid path data starting with M');
                    } else if (testIcon.svg && testIcon.svg.includes('<path d="mdi:')) {
                      console.log('❌ Icon.svg contains invalid path data (icon name instead of path)');
                    } else {
                      console.log('⚠️ Icon.svg has unexpected path format');
                      console.log('Path match:', testIcon.svg.match(/<path[^>]*>/));
                    }
                    
                  } catch (iconError) {
                    console.log('❌ Icon constructor failed:', iconError);
                  }
                  
                  // Also test with the original parseIconString result
                  console.log('\n🔍 Checking parseIconString result type...');
                  if (typeof result === 'string') {
                    console.log('✅ parseIconString returned string, creating Icon...');
                    try {
                      const stringIcon = new IconClass(result);
                      console.log('String Icon.svg:', stringIcon.svg ? stringIcon.svg.substring(0, 100) + '...' : 'no svg');
                    } catch (stringError) {
                      console.log('❌ String Icon constructor failed:', stringError);
                    }
                  } else {
                    console.log('Icon result is already an Icon object');
                    console.log('Existing Icon.svg:', result.svg ? result.svg.substring(0, 100) + '...' : 'no svg');
                  }
                }
              });
              
            } catch (error) {
              console.log('❌ Could not access Icon class:', error);
            }
          }
        }
        
      }, 1500);
    };
    
    debugConstructor();
  }, []);

  return (
    <Layout title="Constructor Debug" description="Debug Icon constructor processing">
      <div style={{ padding: '2rem' }}>
        <h1>Constructor Debug Test</h1>
        <p>Testing what the Icon constructor actually receives and processes - check console.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>MDI Settings (still broken):</span>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
        </div>
      </div>
    </Layout>
  );
}