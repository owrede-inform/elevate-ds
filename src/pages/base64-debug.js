import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function Base64Debug() {
  useEffect(() => {
    const debugBase64 = () => {
      console.log('🧪 Base64 Debug Analysis Starting...');
      
      setTimeout(() => {
        const IconRegistry = window.IconRegistry;
        
        if (!IconRegistry) {
          console.log('❌ IconRegistry not available');
          return;
        }
        
        console.log('✅ IconRegistry found');
        
        // Test our base64 data URL creation
        console.log('\n🔧 Testing base64 data URL creation...');
        
        // Simulate what our code does
        const testPath = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";
        
        const completeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${testPath}" fill="currentColor"/></svg>`;
        console.log('Complete SVG:', completeSvg);
        
        const base64Data = btoa(completeSvg);
        console.log('Base64 data:', base64Data.substring(0, 50) + '...');
        
        const dataUrl = `data:image/svg+xml;base64,${base64Data}`;
        console.log('Data URL:', dataUrl.substring(0, 100) + '...');
        
        // Test the regex that Icon class uses
        const iconRegex = /^data:image\/svg\+xml(?:;([^,]+))?,(.*)$/;
        const match = iconRegex.exec(dataUrl);
        console.log('Regex match:', !!match);
        if (match) {
          const [, encoding, data] = match;
          console.log('Encoding:', encoding);
          console.log('Data length:', data.length);
          console.log('Data preview:', data.substring(0, 50) + '...');
          
          if (encoding === "base64") {
            console.log('✅ Encoding is base64');
            
            try {
              const decodedData = atob(data);
              console.log('✅ atob() succeeded');
              console.log('Decoded length:', decodedData.length);
              console.log('Decoded preview:', decodedData.substring(0, 100) + '...');
              
              try {
                const svg = new DOMParser().parseFromString(decodedData, "text/xml");
                console.log('✅ DOMParser succeeded');
                console.log('SVG element:', svg.documentElement);
                console.log('SVG tagName:', svg.documentElement.tagName);
                
                const viewBox = svg.documentElement.getAttribute("viewBox") || svg.documentElement.getAttribute("viewbox") || "";
                console.log('viewBox attribute:', viewBox);
                
                const width = +(svg.documentElement.getAttribute("width") || "24");
                const height = +(svg.documentElement.getAttribute("height") || "24");
                console.log('Extracted width:', width);
                console.log('Extracted height:', height);
                
                console.log('✅ loadDataUrl would succeed and return:', {
                  width,
                  height,
                  svg: decodedData
                });
                
              } catch (xmlError) {
                console.log('❌ DOMParser failed:', xmlError);
              }
              
            } catch (atobError) {
              console.log('❌ atob() failed:', atobError);
            }
          } else {
            console.log('❌ Encoding is not base64:', encoding);
          }
        } else {
          console.log('❌ Regex did not match data URL format');
        }
        
        // Test what happens when we create an Icon with our data URL
        console.log('\n🏗️ Testing Icon constructor...');
        
        try {
          // Import the Icon class (we need to get it from the ELEVATE bundle)
          console.log('Icon class test - checking what we get from IconRegistry...');
          
          const mdiSettings = IconRegistry._libraries['mdi']['settings'];
          console.log('Registered mdi:settings data:', mdiSettings.substring(0, 100) + '...');
          
          // Get the Icon class by testing what IconRegistry.getIcon returns
          IconRegistry.getIcon('settings', 'mdi').then(iconData => {
            console.log('getIcon returned:', typeof iconData);
            console.log('iconData preview:', String(iconData).substring(0, 100) + '...');
            
            if (typeof iconData === 'string' && iconData.startsWith('data:')) {
              console.log('✅ IconRegistry returned data URL as expected');
            } else {
              console.log('❌ IconRegistry returned unexpected data type or format');
            }
          });
          
        } catch (error) {
          console.log('❌ Icon constructor test failed:', error);
        }
        
      }, 1500);
    };
    
    debugBase64();
  }, []);

  return (
    <Layout title="Base64 Debug" description="Debug base64 data URL processing">
      <div style={{ padding: '2rem' }}>
        <h1>Base64 Debug Test</h1>
        <p>This page debugs base64 data URL creation and processing.</p>
        <p>Check the browser console for detailed base64 analysis.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Process Flow</h2>
          <ol>
            <li>Create complete SVG with actual path data</li>
            <li>Encode as base64: btoa(svg)</li>
            <li>Create data URL: data:image/svg+xml;base64,{base64}</li>
            <li>Test Icon class regex and parsing</li>
            <li>Verify loadDataUrl method succeeds</li>
          </ol>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Icons</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span>MDI Settings:</span>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
          </div>
        </div>
      </div>
    </Layout>
  );
}