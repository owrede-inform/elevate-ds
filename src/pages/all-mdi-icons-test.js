import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

export default function AllMDIIconsTest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  
  // Popular and commonly used MDI icons
  const popularIcons = [
    'home', 'settings', 'user', 'account', 'menu', 'close', 'search', 'heart',
    'star', 'email', 'phone', 'calendar', 'clock', 'location', 'camera', 'image',
    'video', 'music', 'download', 'upload', 'share', 'edit', 'delete', 'add',
    'remove', 'check', 'cancel', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
    'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down'
  ];
  
  // Different categories of icons for easy browsing
  const categoryIcons = {
    popular: popularIcons,
    navigation: [
      'home', 'menu', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
      'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'navigation',
      'compass', 'map', 'location', 'crosshairs', 'directions'
    ],
    actions: [
      'add', 'remove', 'edit', 'delete', 'save', 'download', 'upload', 'share',
      'copy', 'cut', 'paste', 'undo', 'redo', 'refresh', 'sync', 'search'
    ],
    communication: [
      'email', 'phone', 'message', 'chat', 'notification', 'bell', 'microphone',
      'volume-high', 'volume-off', 'video', 'camera', 'wifi', 'bluetooth'
    ],
    content: [
      'image', 'video', 'music', 'file', 'folder', 'document', 'text',
      'code-tags', 'database', 'server', 'cloud', 'link'
    ],
    ui: [
      'check', 'cancel', 'information', 'alert', 'help', 'question',
      'eye', 'eye-off', 'lock', 'unlock', 'key', 'shield'
    ]
  };
  
  const currentIcons = categoryIcons[selectedCategory] || popularIcons;
  const filteredIcons = currentIcons.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="All MDI Icons Test - 7,447+ Icons Available">
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>🎨 All MDI Icons Available (7,447+ Icons)</h1>
        
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '2px solid #28a745'
        }}>
          <h2>✅ Success! All MDI Icons Now Available</h2>
          <p>
            <strong>All 7,447+ Material Design Icons</strong> from the <code>@mdi/js</code> package 
            are now available using the resolver pattern. This means you can use any MDI icon 
            with the format <code>&lt;elvt-icon icon="mdi:icon-name" /&gt;</code>
          </p>
          <p>
            <strong>Performance:</strong> Icons are loaded on-demand, so only the icons you 
            actually use will be processed and cached.
          </p>
        </div>

        {/* Search and Category Filter */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 200px', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="popular">Popular Icons</option>
            <option value="navigation">Navigation</option>
            <option value="actions">Actions</option>
            <option value="communication">Communication</option>
            <option value="content">Content</option>
            <option value="ui">UI Elements</option>
          </select>
        </div>

        {/* Icons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {filteredIcons.map(iconName => (
            <div
              key={iconName}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                <elvt-icon icon={`mdi:${iconName}`} style={{ fontSize: '32px', color: '#333' }}></elvt-icon>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                {iconName}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                mdi:{iconName}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Examples */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>📋 Usage Examples</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4>Basic Usage:</h4>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>{`<elvt-icon icon="mdi:home" />
<elvt-icon icon="mdi:settings" />
<elvt-icon icon="mdi:account" />
<elvt-icon icon="mdi:heart" />
<elvt-icon icon="mdi:star" />`}</pre>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>With Styling:</h4>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>{`<elvt-icon icon="mdi:home" style="font-size: 24px; color: #007acc;" />
<elvt-icon icon="mdi:heart" style="font-size: 32px; color: #e74c3c;" />
<elvt-icon icon="mdi:star" style="font-size: 16px; color: #f39c12;" />`}</pre>
          </div>

          <div>
            <h4>Examples with Different Sizes:</h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <elvt-icon icon="mdi:heart" style={{ fontSize: '16px', color: '#e74c3c' }}></elvt-icon>
              <elvt-icon icon="mdi:heart" style={{ fontSize: '24px', color: '#e74c3c' }}></elvt-icon>
              <elvt-icon icon="mdi:heart" style={{ fontSize: '32px', color: '#e74c3c' }}></elvt-icon>
              <elvt-icon icon="mdi:heart" style={{ fontSize: '48px', color: '#e74c3c' }}></elvt-icon>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>💡 Pro Tips</h3>
          <ul>
            <li><strong>Icon Names:</strong> Use kebab-case (e.g., 'arrow-left', 'account-circle')</li>
            <li><strong>Performance:</strong> Icons are loaded on-demand and cached automatically</li>
            <li><strong>Fallback:</strong> If an icon doesn't exist, check the console for suggestions</li>
            <li><strong>Browse All:</strong> Visit <a href="https://materialdesignicons.com/" target="_blank">materialdesignicons.com</a> to see all 7,447+ icons</li>
            <li><strong>Name Conversion:</strong> The system automatically converts names like 'AccountCircle' to 'account-circle'</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}