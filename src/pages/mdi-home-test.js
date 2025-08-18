import React from 'react';
import Layout from '@theme/Layout';

export default function MDIHomeTest() {
  return (
    <Layout title="MDI Home Icon Test">
      <div style={{ padding: '2rem' }}>
        <h1>🏠 MDI Home Icon Test</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '2px solid #007acc', borderRadius: '8px' }}>
            <h3>✅ mdi:settings (Working)</h3>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
            </div>
            <pre style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '0.5rem' }}>
{`<elvt-icon icon="mdi:settings" 
  style="font-size: 16px; color: #161616;" />`}
            </pre>
          </div>

          <div style={{ padding: '1.5rem', border: '2px solid #28a745', borderRadius: '8px' }}>
            <h3>🏠 mdi:home (Should Work Now)</h3>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              <elvt-icon icon="mdi:home" style={{ fontSize: '24px', color: '#161616' }}></elvt-icon>
            </div>
            <pre style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '0.5rem' }}>
{`<elvt-icon icon="mdi:home" 
  style="font-size: 24px; color: #161616;" />`}
            </pre>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>🔍 Icon Namespace Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <h4>MDI Namespace Icons</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="mdi:settings" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>mdi:settings</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="mdi:home" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>mdi:home</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="mdi:user" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>mdi:user</small>
                </div>
              </div>
            </div>
            <div>
              <h4>ELEVATE Default Icons</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="home" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>home</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="check" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>check</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <elvt-icon icon="cancel" style={{ fontSize: '20px' }}></elvt-icon>
                  <br />
                  <small>cancel</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>📝 Expected Result</h3>
          <p>After adding <code>mdi:home</code> to the icon registration, both icons should now display properly:</p>
          <ul>
            <li><strong>mdi:settings:</strong> Should show settings cog icon ⚙️</li>
            <li><strong>mdi:home:</strong> Should show house icon 🏠</li>
          </ul>
          <p>If <code>mdi:home</code> still doesn't work, there might be a caching issue or the icon registration didn't take effect.</p>
        </div>
      </div>
    </Layout>
  );
}