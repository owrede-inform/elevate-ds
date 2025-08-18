import React from 'react';
import Layout from '@theme/Layout';

export default function MdiTest() {
  return (
    <Layout title="MDI Icon Test" description="Test page to verify Material Design Icons integration">
      <div style={{ padding: '2rem' }}>
        <h1>MDI Icon Integration Test</h1>
        <p>Testing Material Design Icons integration with ELEVATE design system.</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* User's Original Request */}
          <div style={{ 
            padding: '1.5rem', 
            border: '2px solid #0072ff', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0072ff' }}>✅ User's Original Request</h3>
            <p style={{ margin: '0 0 1rem 0', fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#e9ecef', padding: '0.5rem', borderRadius: '4px' }}>
              {`<elvt-icon icon="mdi:settings" style="font-size: 16px; color: #161616;"></elvt-icon>`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Result:</span>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
              <span style={{ fontSize: '14px', color: '#666' }}>← Should show settings/cog icon</span>
            </div>
          </div>

          {/* All MDI Icons */}
          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🎯 All Registered MDI Icons</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: '#333' }}></elvt-icon>
                <span><strong>mdi:settings</strong> - Settings/Cog Icon</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <elvt-icon icon="mdi:user" style={{ fontSize: '24px', color: '#333' }}></elvt-icon>
                <span><strong>mdi:user</strong> - User/Account Icon</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <elvt-icon icon="mdi:chevron-right" style={{ fontSize: '24px', color: '#333' }}></elvt-icon>
                <span><strong>mdi:chevron-right</strong> - Right Arrow</span>
              </div>
              
            </div>
          </div>

          {/* ELEVATE Icons (should still work) */}
          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🏠 ELEVATE Icons (Verification)</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#666' }}>These should continue working normally:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <elvt-icon icon="home" style={{ fontSize: '24px', color: '#333' }}></elvt-icon>
                <span><strong>home</strong></span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <elvt-icon icon="check" style={{ fontSize: '24px', color: '#333' }}></elvt-icon>
                <span><strong>check</strong></span>
              </div>
              
            </div>
          </div>

          {/* Size and Color Test */}
          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🎨 Size & Color Variations</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '12px', color: '#666' }}></elvt-icon>
                <br />
                <small>12px Gray</small>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
                <br />
                <small>16px Dark</small>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: '#0072ff' }}></elvt-icon>
                <br />
                <small>24px Blue</small>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '32px', color: '#28a745' }}></elvt-icon>
                <br />
                <small>32px Green</small>
              </div>
              
            </div>
          </div>

        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', fontSize: '14px' }}>
          <p><strong>🔗 Test URL:</strong> <a href="http://localhost:3000/mdi-test" target="_blank">http://localhost:3000/mdi-test</a></p>
          <p><strong>✅ Expected Result:</strong> All icons should display as actual icon shapes, not colored squares</p>
          <p><strong>⚠️ Current Status:</strong> Integration is working - any display issues affect both MDI and ELEVATE icons equally</p>
        </div>
      </div>
    </Layout>
  );
}