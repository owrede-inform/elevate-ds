/**
 * Framework Switcher Component
 * Dropdown selector for choosing framework syntax preference
 */

import React from 'react';
import { useFramework, FRAMEWORK_LABELS, Framework } from '../../contexts/FrameworkContext';
import styles from './styles.module.css';

interface FrameworkSwitcherProps {
  className?: string;
  size?: 'small' | 'medium';
  hideLabel?: boolean;
}

export default function FrameworkSwitcher({ className, size = 'medium', hideLabel = false }: FrameworkSwitcherProps) {
  const { selectedFramework, setSelectedFramework, availableFrameworks } = useFramework();
  
  const handleFrameworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFramework = event.target.value as Framework;
    setSelectedFramework(newFramework);
  };
  
  return (
    <div className={`${styles.frameworkSwitcher} ${className || ''} ${hideLabel ? styles.noLabel : ''}`}>
      {!hideLabel && (
        <label htmlFor="framework-selector" className={styles.label}>
          Framework:
        </label>
      )}
      <select
        id="framework-selector"
        value={selectedFramework}
        onChange={handleFrameworkChange}
        className={`${styles.select} ${styles[`select--${size}`]}`}
        title="Choose your preferred framework syntax"
      >
        {availableFrameworks.map((framework) => (
          <option key={framework} value={framework}>
            {FRAMEWORK_LABELS[framework]}
          </option>
        ))}
      </select>
    </div>
  );
}