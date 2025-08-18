import React from 'react';
import Layout from '@theme/Layout';

export default function MDIIntegrationTest() {
  // MDI icon paths for testing
  const iconPaths = {
    settings: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
    user: "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
    home: "M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
  };

  // Create working CSS mask URLs
  const createMaskUrl = (path) => {
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="white"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  return (
    <Layout title="MDI Integration Test" description="Test page for Material Design Icons integration">
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>🔧 MDI Integration Test Page</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
            Testing Material Design Icons integration with ELEVATE design system components.
            This page demonstrates the current status and provides working alternatives.
          </p>
        </header>

        {/* Status Overview */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{ marginTop: 0 }}>📊 Integration Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h4 style={{ color: '#28a745', marginBottom: '0.5rem' }}>✅ Working</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>Icon registration system</li>
                <li>SVG path data with fill="white"</li>
                <li>Manual CSS masking</li>
                <li>Direct React SVG approach</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>❌ Issues</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>ELEVATE elvt-icon component</li>
                <li>Shadow DOM CSS masking</li>
                <li>Component internal implementation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User's Original Request */}
        <section style={{ marginBottom: '3rem' }}>
          <h2>🎯 User's Original Request</h2>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '2px solid #2196f3'
          }}>
            <h3>Request: Make this work</h3>
            <pre style={{ 
              backgroundColor: '#263238', 
              color: '#fff', 
              padding: '1rem', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              overflow: 'auto'
            }}>
{`<elvt-icon icon="mdi:settings" style="font-size: 16px; color: #161616;"></elvt-icon>`}
            </pre>
            
            <h4>Current Result:</h4>
            <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '4px', marginBottom: '1rem' }}>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
              <span style={{ marginLeft: '1rem', color: '#666' }}>← Shows colored square instead of icon</span>
            </div>

            <h4>Expected Result (Working Alternative):</h4>
            <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '4px' }}>
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', color: '#161616' }}>
                <path d={iconPaths.settings} fill="currentColor" />
              </svg>
              <span style={{ marginLeft: '1rem', color: '#28a745' }}>← This is what it should look like</span>
            </div>
          </div>
        </section>

        {/* Comparison Tests */}
        <section style={{ marginBottom: '3rem' }}>
          <h2>🔍 Implementation Comparison</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* ELEVATE Component */}
            <div style={{ 
              padding: '1.5rem', 
              border: '2px solid #dc3545', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ color: '#dc3545', marginTop: 0 }}>❌ ELEVATE Component</h3>
              <p>Using elvt-icon web component</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0', textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings"></elvt-icon>
                <br />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>Shows colored square</small>
              </div>
              <pre style={{ fontSize: '0.7rem', backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
{`<elvt-icon icon="mdi:settings" />`}
              </pre>
            </div>

            {/* Manual CSS Mask */}
            <div style={{ 
              padding: '1.5rem', 
              border: '2px solid #28a745', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ color: '#28a745', marginTop: 0 }}>✅ Manual CSS Mask</h3>
              <p>Direct CSS masking approach</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0', textAlign: 'center' }}>
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#333',
                    mask: `url("${createMaskUrl(iconPaths.settings)}") center/contain no-repeat`,
                    WebkitMask: `url("${createMaskUrl(iconPaths.settings)}") center/contain no-repeat`,
                    display: 'inline-block'
                  }}
                />
                <br />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>Shows correct icon</small>
              </div>
              <pre style={{ fontSize: '0.7rem', backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
{`<div style={{
  mask: "url(...svg)",
  backgroundColor: "#333"
}} />`}
              </pre>
            </div>

            {/* Direct React SVG */}
            <div style={{ 
              padding: '1.5rem', 
              border: '2px solid #28a745', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ color: '#28a745', marginTop: 0 }}>✅ Direct React SVG</h3>
              <p>Docusaurus-style implementation</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0', textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#333' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
                <br />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>Shows correct icon</small>
              </div>
              <pre style={{ fontSize: '0.7rem', backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
{`<svg viewBox="0 0 24 24">
  <path d="..." fill="currentColor" />
</svg>`}
              </pre>
            </div>
          </div>
        </section>

        {/* All Available Icons */}
        <section style={{ marginBottom: '3rem' }}>
          <h2>🎨 Available MDI Icons</h2>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3>ELEVATE Components (Currently Broken)</h3>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '24px' }}></elvt-icon>
                <br />
                <small>mdi:settings</small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:user" style={{ fontSize: '24px' }}></elvt-icon>
                <br />
                <small>mdi:user</small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="mdi:chevron-right" style={{ fontSize: '24px' }}></elvt-icon>
                <br />
                <small>mdi:chevron-right</small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <elvt-icon icon="home" style={{ fontSize: '24px' }}></elvt-icon>
                <br />
                <small>home (ELEVATE)</small>
              </div>
            </div>

            <h3>Working SVG Alternatives</h3>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#333' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
                <br />
                <small>Settings</small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#333' }}>
                  <path d={iconPaths.user} fill="currentColor" />
                </svg>
                <br />
                <small>User</small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#333' }}>
                  <path d={iconPaths.home} fill="currentColor" />
                </svg>
                <br />
                <small>Home</small>
              </div>
            </div>
          </div>
        </section>

        {/* Size and Color Testing */}
        <section style={{ marginBottom: '3rem' }}>
          <h2>📐 Size & Color Testing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#fff3cd', 
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <h3>ELEVATE Components (Broken)</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '12px', color: '#666' }}></elvt-icon>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#007acc' }}></elvt-icon>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '20px', color: '#28a745' }}></elvt-icon>
                <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: '#dc3545' }}></elvt-icon>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#856404' }}>
                Colors and sizes work, but shows squares instead of icons
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#d4edda', 
              borderRadius: '8px',
              border: '1px solid #c3e6cb'
            }}>
              <h3>Working SVG Alternative</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px', color: '#666' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
                <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', color: '#007acc' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: '#28a745' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#dc3545' }}>
                  <path d={iconPaths.settings} fill="currentColor" />
                </svg>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#155724' }}>
                Perfect sizing and coloring with actual icon shapes
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section style={{ marginBottom: '3rem' }}>
          <h2>🔬 Technical Analysis</h2>
          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '1px solid #b3d7ff'
          }}>
            <h3>What We Fixed ✅</h3>
            <ul>
              <li><strong>Icon Registration:</strong> MDI icons properly registered with corrected SVG data</li>
              <li><strong>CSS Masking Data:</strong> SVG paths now use <code>fill="white"</code> instead of <code>fill="black"</code></li>
              <li><strong>ELEVATE Icons:</strong> Built-in ELEVATE icons also fixed with proper fill colors</li>
              <li><strong>Icon Registry:</strong> Both MDI and ELEVATE icons accessible through IconRegistry</li>
            </ul>

            <h3>Remaining Issue ❌</h3>
            <p>
              The <strong>ELEVATE elvt-icon web component</strong> has an internal CSS masking bug in its shadow DOM implementation. 
              Despite having identical CSS properties to working manual masks, the component fails to render icon shapes correctly.
            </p>

            <h3>Recommended Solutions 💡</h3>
            <ol>
              <li><strong>Use Direct SVG approach</strong> - Proven to work perfectly (Docusaurus pattern)</li>
              <li><strong>Report bug to ELEVATE team</strong> - Component needs shadow DOM masking fix</li>
              <li><strong>Create wrapper component</strong> - Detect MDI icons and render as SVG instead of elvt-icon</li>
            </ol>
          </div>
        </section>

        {/* Test URL */}
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          color: '#666'
        }}>
          <p><strong>Test URL:</strong> <a href="/mdi-integration-test">localhost:3000/mdi-integration-test</a></p>
          <p>Use this page to verify MDI integration status and component behavior</p>
        </div>
      </div>
    </Layout>
  );
}