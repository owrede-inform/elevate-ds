import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function MdiDataDebug() {
  useEffect(() => {
    const debugMdiData = async () => {
      console.log('📦 MDI Data Debug Starting...');
      
      try {
        // Import MDI icons to check what they actually contain
        const mdiModule = await import('@mdi/js');
        console.log('✅ MDI module imported');
        console.log('MDI module keys sample:', Object.keys(mdiModule).slice(0, 10));
        
        // Check specific icons we're using
        const testIcons = ['mdiCog', 'mdiHome', 'mdiAccount', 'mdiMagnify'];
        
        testIcons.forEach(iconName => {
          const iconData = mdiModule[iconName];
          console.log(`\n🔍 ${iconName}:`);
          console.log('   Type:', typeof iconData);
          console.log('   Length:', iconData ? iconData.length : 'undefined');
          console.log('   Preview:', iconData ? iconData.substring(0, 100) + '...' : 'undefined');
          
          if (iconData && iconData.startsWith('M')) {
            console.log('   ✅ Starts with M (valid SVG path)');
          } else {
            console.log('   ❌ Does not start with M (invalid SVG path)');
          }
        });
        
        // Test creating SVG with actual path data
        const cogPath = mdiModule.mdiCog;
        if (cogPath) {
          const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${cogPath}" fill="currentColor"/></svg>`;
          console.log('\n🧪 Test SVG created:');
          console.log(testSvg.substring(0, 200) + '...');
          
          // Encode as base64
          const base64 = btoa(testSvg);
          const dataUrl = `data:image/svg+xml;base64,${base64}`;
          console.log('📋 Test base64 data URL:');
          console.log(dataUrl.substring(0, 100) + '...');
          
          // Test creating Icon with this data URL
          console.log('\n🏗️ Testing Icon creation with real path data...');
          
          // Get IconRegistry to test registration
          const IconRegistry = window.IconRegistry;
          if (IconRegistry) {
            // Register a test icon with the real path data
            IconRegistry.registerIcon('test-real-cog', dataUrl, 'test');
            console.log('✅ Registered test-real-cog with actual path data');
            
            // Test retrieval
            IconRegistry.getIcon('test-real-cog', 'test').then(result => {
              console.log('✅ Retrieved test icon:', typeof result);
              console.log('   Preview:', String(result).substring(0, 100) + '...');
            });
          }
        }
        
      } catch (error) {
        console.log('❌ MDI import error:', error);
      }
    };
    
    debugMdiData();
  }, []);

  return (
    <Layout title="MDI Data Debug" description="Debug what @mdi/js actually contains">
      <div style={{ padding: '2rem' }}>
        <h1>MDI Data Debug</h1>
        <p>Checking what @mdi/js actually contains and testing real path data - check console.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Current Icon (still broken)</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>MDI Settings:</span>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: 'red' }}></elvt-icon>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Icon (if registered)</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Test Real Cog:</span>
            <elvt-icon icon="test:test-real-cog" style={{ fontSize: '24px', color: 'blue' }}></elvt-icon>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Expected Result</h2>
          <p>If the path data is the issue, the test icon with real path data should work while the original doesn't.</p>
        </div>
      </div>
    </Layout>
  );
}