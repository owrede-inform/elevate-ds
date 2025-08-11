import React, { useEffect, useRef, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import { useFramework } from '../../contexts/FrameworkContext';
import { transformToFramework, getFrameworkImports, extractComponentNames } from '../../utils/frameworkTransformer';
import FrameworkSwitcher from '../FrameworkSwitcher';
import FrameworkSelectorStandalone from './FrameworkSelectorStandalone';
import styles from './styles.module.css';

interface ComponentShowcaseProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  showFrameworkSwitcher?: boolean;
  wrapLines?: boolean;
  showCodeByDefault?: boolean;
}

export default function ComponentShowcase({
  children,
  title,
  description,
  code,
  language = 'html',
  showFrameworkSwitcher = true,
  wrapLines = true,
  showCodeByDefault = false
}: ComponentShowcaseProps): JSX.Element {
  const previewRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const { selectedFramework, setSelectedFramework } = useFramework();
  const [transformedCode, setTransformedCode] = useState<string>('');
  const [componentNames, setComponentNames] = useState<string[]>([]);
  const [showCode, setShowCode] = useState<boolean>(showCodeByDefault);
  
  // Transform code when framework or children change
  useEffect(() => {
    if (code) {
      // Use provided code as-is
      setTransformedCode(code);
      return;
    }
    
    try {
      // Extract component names for imports
      const names = extractComponentNames(children);
      setComponentNames(names);
      
      // Transform children to selected framework
      const transformed = transformToFramework(children, selectedFramework);
      setTransformedCode(transformed);
    } catch (error) {
      console.error('Error transforming code:', error);
      setTransformedCode('// Error generating code');
    }
  }, [children, selectedFramework, code]);
  
  // Get the appropriate language for syntax highlighting
  const getLanguage = () => {
    if (language !== 'html') return language;
    
    switch (selectedFramework) {
      case 'react':
      case 'angular':
      case 'vue':
      case 'svelte':
        return 'tsx';
      case 'html':
      case 'webcomponent':
      default:
        return 'html';
    }
  };
  
  // Get framework imports if needed
  const imports = componentNames.length > 0 
    ? getFrameworkImports(selectedFramework, componentNames) 
    : '';
    
  const displayCode = imports 
    ? `${imports}\n\n${transformedCode}` 
    : transformedCode;

  // Inject framework selector into CodeBlock button group
  useEffect(() => {
    if (!showCode || !showFrameworkSwitcher || !codeBlockRef.current) {
      return;
    }

    const codeBlockElement = codeBlockRef.current;
    const buttonGroup = codeBlockElement.querySelector('.buttonGroup__atx, [class*="buttonGroup"]');
    
    if (buttonGroup && !buttonGroup.querySelector('.framework-selector-injected')) {
      // Create framework selector container
      const frameworkContainer = document.createElement('div');
      frameworkContainer.className = 'framework-selector-injected';
      frameworkContainer.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
      
      // Create a temporary React root to render the standalone framework selector
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(frameworkContainer);
        root.render(
          React.createElement(FrameworkSelectorStandalone, {
            selectedFramework: selectedFramework,
            onFrameworkChange: setSelectedFramework,
            size: 'small'
          })
        );
        
        // Insert before copy button or at the beginning
        const firstButton = buttonGroup.querySelector('button');
        if (firstButton) {
          buttonGroup.insertBefore(frameworkContainer, firstButton);
        } else {
          buttonGroup.appendChild(frameworkContainer);
        }
      });
    }

    // Cleanup function
    return () => {
      const injectedElement = buttonGroup?.querySelector('.framework-selector-injected');
      if (injectedElement) {
        injectedElement.remove();
      }
    };
  }, [showCode, showFrameworkSwitcher, selectedFramework, displayCode]);

  return (
    <div className={`${styles.componentShowcase} componentShowcase`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.headerControls}>
          <button
            className={styles.codeToggle}
            onClick={() => setShowCode(!showCode)}
            title={showCode ? 'Hide code' : 'Show code'}
            aria-label={showCode ? 'Hide code' : 'Show code'}
          >
            {showCode ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8 10.793 5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.preview}>
        <div className={styles.previewContent} ref={previewRef}>
          {children}
        </div>
      </div>

      {showCode && (
        <div className={styles.codeSection}>
          <div className={styles.codeWrapper} ref={codeBlockRef}>
            <CodeBlock 
              language={getLanguage()} 
              showLineNumbers={true}
              className={wrapLines ? styles.wrapLines : styles.noWrapLines}
            >
              {displayCode}
            </CodeBlock>
          </div>
        </div>
      )}
    </div>
  );
}