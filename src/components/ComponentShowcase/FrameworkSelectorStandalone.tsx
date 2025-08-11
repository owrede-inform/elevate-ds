/**
 * Standalone Framework Selector for DOM Injection
 * Does not rely on React Context - gets state/setter as props
 */

import React from 'react';
import { FRAMEWORK_LABELS, AVAILABLE_FRAMEWORKS, Framework } from '../../contexts/FrameworkContext';

interface StandaloneFrameworkSelectorProps {
  selectedFramework: Framework;
  onFrameworkChange: (framework: Framework) => void;
  size?: 'small' | 'medium';
}

export default function FrameworkSelectorStandalone({
  selectedFramework,
  onFrameworkChange,
  size = 'small'
}: StandaloneFrameworkSelectorProps) {
  const handleFrameworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFramework = event.target.value as Framework;
    onFrameworkChange(newFramework);
  };

  return (
    <select
      value={selectedFramework}
      onChange={handleFrameworkChange}
      title="Choose your preferred framework syntax"
      style={{
        background: 'var(--ifm-background-color)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '4px',
        color: 'var(--ifm-font-color-base)',
        fontFamily: 'var(--ifm-font-family-base)',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        padding: '0.375rem 0.5rem',
        cursor: 'pointer',
        minWidth: '110px',
        height: '32px',
        transition: 'border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
        e.currentTarget.style.boxShadow = '0 0 0 2px var(--ifm-color-primary-lightest)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {AVAILABLE_FRAMEWORKS.map((framework) => (
        <option key={framework} value={framework}>
          {FRAMEWORK_LABELS[framework]}
        </option>
      ))}
    </select>
  );
}