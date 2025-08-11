import React, { useEffect, useRef, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import { useFramework } from '../../contexts/FrameworkContext';
import { transformToFramework, getFrameworkImports, extractComponentNames } from '../../utils/frameworkTransformer';
import FrameworkSwitcher from '../FrameworkSwitcher';
import styles from './styles.module.css';

interface ComponentShowcaseProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  showFrameworkSwitcher?: boolean;
}

export default function ComponentShowcase({
  children,
  title,
  description,
  code,
  language = 'html',
  showFrameworkSwitcher = true
}: ComponentShowcaseProps): JSX.Element {
  const previewRef = useRef<HTMLDivElement>(null);
  const { selectedFramework } = useFramework();
  const [transformedCode, setTransformedCode] = useState<string>('');
  const [componentNames, setComponentNames] = useState<string[]>([]);
  
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

  return (
    <div className={`${styles.componentShowcase} componentShowcase`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {showFrameworkSwitcher && (
          <div className={styles.frameworkSwitcher}>
            <FrameworkSwitcher size="small" />
          </div>
        )}
      </div>
      
      <div className={styles.preview}>
        <div className={styles.previewContent} ref={previewRef}>
          {children}
        </div>
      </div>

      <CodeBlock language={getLanguage()} showLineNumbers={true}>
        {displayCode}
      </CodeBlock>
    </div>
  );
}