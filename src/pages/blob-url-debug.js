import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function BlobUrlDebug() {
  useEffect(() => {
    const debugBlobUrls = () => {
      console.log('🔗 Blob URL Debug Analysis Starting...');
      
      setTimeout(() => {
        const icons = document.querySelectorAll('elvt-icon');
        console.log(`Found ${icons.length} elvt-icon elements`);
        
        icons.forEach((icon, index) => {
          const iconName = icon.getAttribute('icon');
          console.log(`\n--- Icon ${index + 1}: ${iconName} ---`);
          
          const shadowRoot = icon.shadowRoot;
          if (shadowRoot) {
            const maskElement = shadowRoot.querySelector('.mask');
            if (maskElement && icon._iconValue) {
              const blobUrl = icon._iconValue.url;
              console.log('Blob URL:', blobUrl);
              
              // Test blob URL accessibility
              fetch(blobUrl)
                .then(response => {
                  console.log(`✅ Blob URL accessible - Status: ${response.status}`);
                  console.log('Content-Type:', response.headers.get('content-type'));
                  return response.text();
                })
                .then(content => {
                  console.log(`📄 Blob content length: ${content.length}`);
                  console.log('📄 Blob content preview:');
                  console.log(content.substring(0, 500));
                  
                  // Check if it's valid SVG
                  if (content.includes('<svg') && content.includes('</svg>')) {
                    console.log('✅ Content appears to be valid SVG');
                    
                    // Check for path data
                    if (content.includes('<path')) {
                      console.log('✅ SVG contains path elements');
                    } else {
                      console.log('⚠️ SVG does not contain path elements');
                    }
                  } else {
                    console.log('❌ Content is NOT valid SVG format');
                  }
                  
                  // Test manual mask application
                  console.log('🧪 Testing manual mask application...');
                  const testDiv = document.createElement('div');
                  testDiv.style.width = '24px';
                  testDiv.style.height = '24px';
                  testDiv.style.backgroundColor = 'red';
                  testDiv.style.maskImage = `url(${blobUrl})`;
                  testDiv.style.webkitMaskImage = `url(${blobUrl})`;
                  testDiv.style.maskSize = 'contain';
                  testDiv.style.webkitMaskSize = 'contain';
                  testDiv.style.maskRepeat = 'no-repeat';
                  testDiv.style.webkitMaskRepeat = 'no-repeat';
                  testDiv.style.position = 'absolute';
                  testDiv.style.top = '100px';
                  testDiv.style.left = `${100 + (index * 50)}px`;
                  testDiv.title = `Manual mask test for ${iconName}`;
                  document.body.appendChild(testDiv);
                  
                  console.log(`✅ Added manual mask test element for ${iconName}`);
                })
                .catch(error => {
                  console.log(`❌ Failed to fetch blob URL: ${error.message}`);
                });
              
              // Also test with the original data URL if available
              console.log('🔍 Checking original icon data...');
              
              // Get the original data URL from IconRegistry
              const IconRegistry = window.IconRegistry;
              if (IconRegistry) {
                const [library, name] = iconName.split(':');
                if (IconRegistry._libraries[library] && IconRegistry._libraries[library][name]) {
                  const originalData = IconRegistry._libraries[library][name];
                  console.log('📋 Original registered data:');
                  console.log(originalData.substring(0, 200));
                  
                  // Test direct data URL mask
                  const testDiv2 = document.createElement('div');
                  testDiv2.style.width = '24px';
                  testDiv2.style.height = '24px';
                  testDiv2.style.backgroundColor = 'blue';
                  testDiv2.style.maskImage = `url(${originalData})`;
                  testDiv2.style.webkitMaskImage = `url(${originalData})`;
                  testDiv2.style.maskSize = 'contain';
                  testDiv2.style.webkitMaskSize = 'contain';
                  testDiv2.style.maskRepeat = 'no-repeat';
                  testDiv2.style.webkitMaskRepeat = 'no-repeat';
                  testDiv2.style.position = 'absolute';
                  testDiv2.style.top = '150px';
                  testDiv2.style.left = `${100 + (index * 50)}px`;
                  testDiv2.title = `Direct data URL test for ${iconName}`;
                  document.body.appendChild(testDiv2);
                  
                  console.log(`✅ Added direct data URL test element for ${iconName}`);
                }
              }
            }
          }
        });
      }, 1500);
    };
    
    debugBlobUrls();
  }, []);

  return (
    <Layout title="Blob URL Debug" description="Debug blob URL content and accessibility">
      <div style={{ padding: '2rem' }}>
        <h1>Blob URL Debug Test</h1>
        <p>This page tests blob URL accessibility and content validity.</p>
        <p>Check the browser console for detailed blob URL analysis.</p>
        <p>Manual mask test elements will appear below the icons.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Original Icons (still showing colored squares)</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>MDI Settings:</span>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>ELEVATE Home:</span>
            <elvt-icon icon="elvt:home" style={{ fontSize: '24px', color: 'green' }}></elvt-icon>
          </div>
        </div>
        
        <div style={{ marginTop: '6rem', position: 'relative', minHeight: '200px' }}>
          <h2>Manual Mask Tests</h2>
          <p>Red elements = blob URL tests, Blue elements = direct data URL tests</p>
          <p>If manual tests work but elvt-icon doesn't, there's a CSS specificity issue.</p>
        </div>
      </div>
    </Layout>
  );
}