import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function SimpleBase64Debug() {
  useEffect(() => {
    const debugBase64 = () => {
      console.log('🧪 Simple Base64 Debug Starting...');
      
      setTimeout(() => {
        // Test our actual registered data
        const IconRegistry = window.IconRegistry;
        
        if (!IconRegistry || !IconRegistry._libraries['mdi']) {
          console.log('❌ MDI library not found');
          return;
        }
        
        const mdiSettings = IconRegistry._libraries['mdi']['settings'];
        console.log('📋 Registered mdi:settings data URL:');
        console.log(mdiSettings);
        
        // Test the Icon class regex
        const iconRegex = /^data:image\/svg\+xml(?:;([^,]+))?,(.*)$/;
        const match = iconRegex.exec(mdiSettings);
        
        if (match) {
          const [, encoding, data] = match;
          console.log('✅ Regex matched');
          console.log('Encoding:', encoding);
          console.log('Data length:', data.length);
          
          if (encoding === "base64") {
            console.log('✅ Encoding is base64');
            
            try {
              const decodedData = atob(data);
              console.log('✅ Base64 decode succeeded');
              console.log('Decoded SVG:');
              console.log(decodedData);
              
              // Check if it's valid SVG
              if (decodedData.includes('<svg') && decodedData.includes('</svg>')) {
                console.log('✅ Decoded data contains valid SVG structure');
                
                if (decodedData.includes('<path d="M') || decodedData.includes('<path d="m')) {
                  console.log('✅ SVG contains valid path data starting with M or m');
                } else {
                  console.log('❌ SVG does not contain valid path data');
                  console.log('Path content:', decodedData.match(/<path[^>]*>/g));
                }
              } else {
                console.log('❌ Decoded data is not valid SVG');
              }
              
            } catch (error) {
              console.log('❌ Base64 decode failed:', error);
            }
          } else {
            console.log('❌ Encoding is not base64:', encoding);
          }
        } else {
          console.log('❌ Regex did not match');
        }
        
        // Test what IconRegistry.getIcon actually returns
        console.log('\n🔍 Testing IconRegistry.getIcon...');
        IconRegistry.getIcon('settings', 'mdi').then(result => {
          console.log('getIcon result type:', typeof result);
          console.log('getIcon result:', String(result).substring(0, 200));
        }).catch(error => {
          console.log('getIcon error:', error);
        });
        
      }, 1500);
    };
    
    debugBase64();
  }, []);

  return (
    <Layout title="Simple Base64 Debug" description="Debug base64 issues">
      <div style={{ padding: '2rem' }}>
        <h1>Simple Base64 Debug</h1>
        <p>Testing base64 data URL processing - check console.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>MDI Settings:</span>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
        </div>
      </div>
    </Layout>
  );
}