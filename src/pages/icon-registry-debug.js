import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function IconRegistryDebug() {
  useEffect(() => {
    const debugIconRegistry = () => {
      console.log('🔍 IconRegistry Debug Analysis Starting...');
      
      setTimeout(() => {
        const IconRegistry = window.IconRegistry;
        
        if (!IconRegistry) {
          console.log('❌ IconRegistry not available on window');
          return;
        }
        
        console.log('✅ IconRegistry found:', IconRegistry);
        console.log('IconRegistry._libraries:', IconRegistry._libraries);
        console.log('IconRegistry._resolvers:', IconRegistry._resolvers);
        console.log('IconRegistry.DefaultLibrary:', IconRegistry.DefaultLibrary);
        
        // Test specific getIcon calls that elvt-icon would make
        console.log('\n🧪 Testing getIcon calls:');
        
        const testCases = [
          { icon: 'mdi:settings', library: 'mdi', name: 'settings' },
          { icon: 'mdi:cog', library: 'mdi', name: 'cog' },
          { icon: 'elvt:home', library: 'elvt', name: 'home' },
          { icon: 'elvt:check', library: 'elvt', name: 'check' }
        ];
        
        testCases.forEach(({ icon, library, name }) => {
          console.log(`\n--- Testing: ${icon} ---`);
          console.log(`Library: "${library}", Name: "${name}"`);
          
          // Check if library exists
          console.log(`Library "${library}" exists:`, !!IconRegistry._libraries[library]);
          if (IconRegistry._libraries[library]) {
            console.log(`Icons in "${library}":`, Object.keys(IconRegistry._libraries[library]));
            console.log(`Icon "${name}" exists:`, !!IconRegistry._libraries[library][name]);
            if (IconRegistry._libraries[library][name]) {
              console.log(`Icon "${name}" value:`, IconRegistry._libraries[library][name]);
            }
          }
          
          // Check resolvers
          console.log(`Resolver for "${library}" exists:`, !!IconRegistry._resolvers[library]);
          
          // Test actual getIcon call
          try {
            const result = IconRegistry.getIcon(name, library);
            console.log(`getIcon("${name}", "${library}") result:`, result);
            
            if (result instanceof Promise) {
              result.then(resolved => {
                console.log(`getIcon("${name}", "${library}") resolved to:`, resolved);
              }).catch(error => {
                console.log(`getIcon("${name}", "${library}") error:`, error);
              });
            }
          } catch (error) {
            console.log(`getIcon("${name}", "${library}") error:`, error);
          }
        });
        
        // Test manual registration verification
        console.log('\n🔧 Manual verification test:');
        
        // Try registering a test icon directly
        const testIconData = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
        IconRegistry.registerIcon('test-circle', testIconData, 'test');
        
        console.log('Registered test-circle in test library');
        console.log('Libraries after test registration:', Object.keys(IconRegistry._libraries));
        console.log('Test library contents:', IconRegistry._libraries['test']);
        
        const testResult = IconRegistry.getIcon('test-circle', 'test');
        console.log('getIcon("test-circle", "test") result:', testResult);
        
      }, 1500);
    };
    
    debugIconRegistry();
  }, []);

  return (
    <Layout title="IconRegistry Debug" description="Debug IconRegistry registration and retrieval">
      <div style={{ padding: '2rem' }}>
        <h1>IconRegistry Debug Test</h1>
        <p>This page debugs the IconRegistry registration and getIcon() calls.</p>
        <p>Check the browser console for detailed IconRegistry analysis.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Expected Flow</h2>
          <ol>
            <li>Icons should be registered in IconRegistry._libraries["mdi"]</li>
            <li>elvt-icon calls IconRegistry.getIcon("settings", "mdi")</li>
            <li>getIcon should return the registered data URL</li>
            <li>elvt-icon should set --symbol CSS property</li>
            <li>CSS mask should render the icon shape</li>
          </ol>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Icons (should still show colored squares)</h2>
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