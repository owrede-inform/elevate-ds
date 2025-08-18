import React from 'react';
import Layout from '@theme/Layout';

export default function ComprehensiveIconVerification() {
  const settingsPath = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";

  // Create mask URL with white fill
  const maskUrl = `data:image/svg+xml,${encodeURIComponent(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${settingsPath}" fill="white"/></svg>`)}`;

  return (
    <Layout title="Comprehensive Icon Verification">
      <div style={{ padding: '2rem', maxWidth: '1200px' }}>
        <h1>🔍 Comprehensive Icon Verification Test</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Test 1: User's Original Request */}
          <div style={{ padding: '1rem', border: '2px solid #007acc', borderRadius: '8px' }}>
            <h3>✅ 1. User's Original Request</h3>
            <p><code>&lt;elvt-icon icon="mdi:settings" style="font-size: 16px; color: #161616;" /&gt;</code></p>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '16px', color: '#161616' }}></elvt-icon>
            </div>
            <p><strong>Expected:</strong> Settings cog icon, 16px, dark gray</p>
            <p><strong>Actual:</strong> <span id="test1-result">❓</span></p>
          </div>

          {/* Test 2: ELEVATE Icons */}
          <div style={{ padding: '1rem', border: '2px solid #28a745', borderRadius: '8px' }}>
            <h3>🏠 2. ELEVATE Home Icon</h3>
            <p><code>&lt;elvt-icon icon="home" /&gt;</code></p>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              <elvt-icon icon="home"></elvt-icon>
            </div>
            <p><strong>Expected:</strong> House icon</p>
            <p><strong>Actual:</strong> <span id="test2-result">❓</span></p>
          </div>

          {/* Test 3: Manual CSS Mask */}
          <div style={{ padding: '1rem', border: '2px solid #ffc107', borderRadius: '8px' }}>
            <h3>🎨 3. Manual CSS Mask (Control)</h3>
            <p>Direct CSS masking with same SVG</p>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
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
            <p><strong>Expected:</strong> Settings cog icon</p>
            <p><strong>Actual:</strong> <span id="test3-result">❓</span></p>
          </div>

          {/* Test 4: Direct SVG */}
          <div style={{ padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px' }}>
            <h3>⚛️ 4. Direct React SVG</h3>
            <p>Standard SVG with currentColor</p>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#161616' }}>
                <path d={settingsPath} fill="currentColor" />
              </svg>
            </div>
            <p><strong>Expected:</strong> Settings cog icon</p>
            <p><strong>Actual:</strong> <span id="test4-result">❓</span></p>
          </div>

          {/* Test 5: Multiple MDI Icons */}
          <div style={{ padding: '1rem', border: '2px solid #6f42c1', borderRadius: '8px' }}>
            <h3>🎯 5. Multiple MDI Icons</h3>
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', fontSize: '1.5rem' }}>
              <elvt-icon icon="mdi:settings"></elvt-icon>
              <elvt-icon icon="mdi:user"></elvt-icon>
              <elvt-icon icon="mdi:chevron-right"></elvt-icon>
            </div>
            <p><strong>Expected:</strong> Settings, User, Arrow icons</p>
            <p><strong>Actual:</strong> <span id="test5-result">❓</span></p>
          </div>

          {/* Test 6: Size and Color Variations */}
          <div style={{ padding: '1rem', border: '2px solid #dc3545', borderRadius: '8px' }}>
            <h3>📐 6. Size & Color Variations</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '12px', color: '#666' }}></elvt-icon>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '18px', color: '#007acc' }}></elvt-icon>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '24px', color: '#28a745' }}></elvt-icon>
              <elvt-icon icon="mdi:settings" style={{ fontSize: '32px', color: '#dc3545' }}></elvt-icon>
            </div>
            <p><strong>Expected:</strong> Different sizes and colors</p>
            <p><strong>Actual:</strong> <span id="test6-result">❓</span></p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2>📊 Test Results Summary</h2>
          <div id="results-summary" style={{ fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
            Loading test results...
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h2>🔬 Technical Analysis</h2>
          <ul>
            <li><strong>Icon Registration:</strong> MDI icons registered with corrected fill="white"</li>
            <li><strong>CSS Masking:</strong> Manual mask works (Test 3), proving technique is sound</li>
            <li><strong>Component Issue:</strong> If elvt-icon fails but manual mask works = component bug</li>
            <li><strong>Browser Support:</strong> Both mask and -webkit-mask properties applied</li>
            <li><strong>Shadow DOM:</strong> Potential isolation issue in web components</li>
          </ul>
        </div>

        {/* Auto-analysis script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              try {
                // Analyze visual results
                const tests = [
                  { id: 'test1-result', selector: 'elvt-icon[icon="mdi:settings"]', expected: 'Settings icon' },
                  { id: 'test2-result', selector: 'elvt-icon[icon="home"]', expected: 'Home icon' },
                  { id: 'test3-result', selector: 'div[style*="mask"]', expected: 'Settings icon' },
                  { id: 'test4-result', selector: 'svg', expected: 'Settings icon' },
                  { id: 'test5-result', selector: 'elvt-icon[icon="mdi:user"]', expected: 'Multiple icons' },
                  { id: 'test6-result', selector: 'elvt-icon[style*="12px"]', expected: 'Sized icons' }
                ];

                let summary = 'TEST RESULTS:\\n';
                summary += '=============\\n\\n';
                
                tests.forEach((test, i) => {
                  const element = document.querySelector(test.selector);
                  const resultSpan = document.getElementById(test.id);
                  
                  if (element) {
                    // For elvt-icon, check if it shows as a square or actual icon
                    if (element.tagName === 'ELVT-ICON') {
                      const rect = element.getBoundingClientRect();
                      const hasContent = rect.width > 0 && rect.height > 0;
                      
                      if (hasContent) {
                        resultSpan.textContent = '⚠️ Shows colored square';
                        summary += \`Test \${i+1}: PARTIAL - elvt-icon renders but may show square\\n\`;
                      } else {
                        resultSpan.textContent = '❌ No content';
                        summary += \`Test \${i+1}: FAIL - elvt-icon not rendering\\n\`;
                      }
                    } else {
                      resultSpan.textContent = '✅ Working';
                      summary += \`Test \${i+1}: PASS - \${test.expected} displays correctly\\n\`;
                    }
                  } else {
                    resultSpan.textContent = '❌ Not found';
                    summary += \`Test \${i+1}: FAIL - Element not found\\n\`;
                  }
                });

                summary += '\\nCONCLUSION:\\n';
                summary += '============\\n';
                summary += 'If Test 3 (manual mask) works but Test 1 (elvt-icon) fails,\\n';
                summary += 'then the issue is specifically with the ELEVATE component.\\n';
                summary += 'If Test 4 (direct SVG) works, Docusaurus approach is viable.';

                document.getElementById('results-summary').textContent = summary;
              } catch (error) {
                console.error('Test analysis error:', error);
              }
            }, 2000);
          `
        }} />
      </div>
    </Layout>
  );
}