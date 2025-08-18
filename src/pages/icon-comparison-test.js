import React from 'react';
import Layout from '@theme/Layout';

export default function IconComparisonTest() {
  const settingsPath = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";

  // Test different approaches
  const maskUrl = `data:image/svg+xml,${encodeURIComponent(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${settingsPath}" fill="white"/></svg>`)}`;

  return (
    <Layout title="Icon Comparison Test">
      <div style={{ padding: '2rem' }}>
        <h1>Icon Implementation Comparison</h1>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3>1. ELEVATE elvt-icon (Current)</h3>
            <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: '#161616' }}></elvt-icon>
          </div>
          
          <div>
            <h3>2. Direct React SVG (Docusaurus Style)</h3>
            <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#161616' }}>
              <path d={settingsPath} fill="currentColor" />
            </svg>
          </div>
          
          <div>
            <h3>3. CSS Mask Test (Manual)</h3>
            <div 
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#161616',
                mask: `url("${maskUrl}") center/contain no-repeat`,
                WebkitMask: `url("${maskUrl}") center/contain no-repeat`
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h3>Expected vs Actual:</h3>
          <ul>
            <li><strong>Expected:</strong> All three should show the same settings cog icon</li>
            <li><strong>Actual:</strong> Only method #2 (Direct SVG) works correctly</li>
            <li><strong>Issue:</strong> CSS masking (#1 and #3) shows colored squares instead of icon shapes</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd' }}>
          <h3>Debugging Info:</h3>
          <p><strong>Mask URL:</strong> {maskUrl.substring(0, 100)}...</p>
          <p><strong>Browser:</strong> Check dev tools to see if CSS mask properties are applied correctly</p>
        </div>
      </div>
    </Layout>
  );
}