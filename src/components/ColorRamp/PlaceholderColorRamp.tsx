import React from 'react';

interface ColorRampProps {
  title?: string;
  selector?: string;
  exclude?: string;
  template?: string;
  sortBy?: string;
  includeShades?: number[];
  showHexValue?: boolean;
}

const PlaceholderColorRamp: React.FC<ColorRampProps> = ({ title }) => {
  return (
    <div style={{
      padding: '16px',
      border: '1px dashed #ccc',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      textAlign: 'center'
    }}>
      <p style={{ margin: 0 }}>
        <strong>ColorRamp: {title || 'Color Display'}</strong>
      </p>
      <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
        Temporarily disabled for deployment compatibility
      </p>
    </div>
  );
};

export default PlaceholderColorRamp;