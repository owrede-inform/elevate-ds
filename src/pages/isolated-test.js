import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function IsolatedTest() {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  useEffect(() => {
    // Wait for registration to complete, then test
    const checkRegistration = () => {
      const IconRegistry = window.IconRegistry;
      
      if (IconRegistry && IconRegistry._libraries && IconRegistry._libraries['mdi']) {
        console.log('✅ MDI library registered, icons available:', Object.keys(IconRegistry._libraries['mdi']));
        setRegistrationComplete(true);
        
        // Test IconRegistry.getIcon directly
        IconRegistry.getIcon('settings', 'mdi').then(result => {
          console.log('✅ IconRegistry.getIcon("settings", "mdi") result:', typeof result);
          console.log('   Preview:', String(result).substring(0, 100) + '...');
        }).catch(error => {
          console.log('❌ IconRegistry.getIcon error:', error);
        });
      } else {
        console.log('⏳ Waiting for MDI library registration...');
        setTimeout(checkRegistration, 500);
      }
    };
    
    checkRegistration();
  }, []);

  return (
    <Layout title="Isolated Test" description="Isolated test of user's exact request">
      <div style={{ padding: '2rem' }}>
        <h1>Isolated Test</h1>
        <p>Testing the user's exact request in isolation.</p>
        
        {!registrationComplete && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            ⏳ Waiting for icon registration to complete...
          </div>
        )}
        
        {registrationComplete && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            ✅ Icon registration complete! Testing icons...
          </div>
        )}
        
        <h2>User's Original Request</h2>
        <p>This should work:</p>
        
        <div style={{ 
          padding: '2rem', 
          border: '2px dashed #007bff', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
          textAlign: 'center',
          fontSize: '2rem'
        }}>
          <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
        </div>
        
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Expected: Settings/gear icon in dark gray at 16px<br/>
          Actual: {registrationComplete ? 'Check above' : 'Waiting for registration...'}
        </p>
        
        <h2>Debug Info</h2>
        <p>Check browser console for detailed registration and lookup information.</p>
      </div>
    </Layout>
  );
}