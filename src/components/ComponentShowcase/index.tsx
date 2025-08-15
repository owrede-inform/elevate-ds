import React, { useEffect, useRef, useState } from 'react';
import { useFramework } from '../../contexts/FrameworkContext';
import { transformToFramework, getFrameworkImports, extractComponentNames, transformWebComponentCode, extractComponentNamesFromCode } from '../../utils/frameworkTransformer';
import CodeDisplay from '../CodeDisplay';
import styles from './styles.module.css';

interface ComponentShowcaseProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  code?: string; // Can be inline code or file path
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
  const { selectedFramework } = useFramework();
  const [transformedCode, setTransformedCode] = useState<string>('');
  const [componentNames, setComponentNames] = useState<string[]>([]);
  const [showCode, setShowCode] = useState<boolean>(showCodeByDefault);
  const [loadedFileContent, setLoadedFileContent] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [fileLoadError, setFileLoadError] = useState<string>('');
  
  // Helper function to check if code parameter is a file path
  const isFilePath = (codeParam: string): boolean => {
    return /\.(ts|tsx|js|jsx|html|css|scss|md|mdx)$/i.test(codeParam) && !codeParam.includes('\n');
  };

  // Load file content if code parameter is a file path
  useEffect(() => {
    if (!code || !isFilePath(code)) {
      setLoadedFileContent('');
      setIsLoadingFile(false);
      setFileLoadError('');
      return;
    }

    const loadFileContent = async () => {
      setIsLoadingFile(true);
      setFileLoadError('');
      
      try {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part);
        const docsIndex = pathParts.indexOf('docs');
        const relativePath = docsIndex >= 0 ? pathParts.slice(docsIndex + 1) : [];
        
        let filePath;
        if (code.includes('/') || code.includes('\\')) {
          filePath = `/docs/${code}`;
        } else {
          filePath = `/docs/${relativePath.join('/')}/${code}`;
        }
        
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${filePath} (${response.status} ${response.statusText})`);
        }
        
        const content = await response.text();
        setLoadedFileContent(content);
      } catch (error) {
        console.error('Error loading file:', error);
        setFileLoadError(`Failed to load file: ${code}. ${(error as Error).message}`);
        setLoadedFileContent('');
      } finally {
        setIsLoadingFile(false);
      }
    };

    loadFileContent();
  }, [code]);

  // Transform code when framework changes
  useEffect(() => {
    if (code && isFilePath(code)) {
      // Use loaded file content as-is
      setTransformedCode(loadedFileContent);
      setComponentNames([]);
      return;
    }
    
    if (code) {
      // Transform provided inline code
      try {
        const transformed = transformWebComponentCode(code, selectedFramework);
        setTransformedCode(transformed);
        const names = extractComponentNamesFromCode(code);
        setComponentNames(names);
      } catch (error) {
        console.error('Error transforming provided code:', error);
        setTransformedCode(code);
        setComponentNames([]);
      }
      return;
    }
    
    // Transform children to selected framework - only when framework changes
    try {
      const names = extractComponentNames(children);
      setComponentNames(names);
      const transformed = transformToFramework(children, selectedFramework);
      setTransformedCode(transformed);
    } catch (error) {
      console.error('Error transforming code:', error);
      setTransformedCode('// Error generating code');
      setComponentNames([]);
    }
  }, [selectedFramework, code, loadedFileContent]);
  
  // Get the appropriate language for syntax highlighting
  const getLanguage = () => {
    if (code && isFilePath(code)) {
      const extension = code.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'ts':
        case 'tsx':
          return 'tsx';
        case 'js':
        case 'jsx':
          return 'jsx';
        case 'html':
          return 'html';
        case 'css':
          return 'css';
        case 'scss':
          return 'scss';
        case 'md':
        case 'mdx':
          return 'markdown';
        default:
          return 'text';
      }
    }
    
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
      {/* Header with title, description and toggle button */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.headerControls}>
          <button
            className={styles.codeToggle}
            onClick={() => setShowCode(!showCode)}
            title={showCode ? 'Hide source code' : 'Show source code'}
            aria-label={showCode ? 'Hide source code' : 'Show source code'}
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
      
      {/* Preview area */}
      <div className={styles.preview}>
        <div className={styles.previewContent} ref={previewRef}>
          {children}
        </div>
      </div>

      {/* Source code block - only shown when toggled */}
      {showCode && (
        <div className={styles.codeSection}>
          {isLoadingFile && (
            <div className={styles.loadingState}>
              <p>Loading code file...</p>
            </div>
          )}
          {fileLoadError && (
            <div className={styles.errorState}>
              <p style={{ color: 'var(--ifm-color-danger)' }}>
                {fileLoadError}
              </p>
            </div>
          )}
          {!isLoadingFile && !fileLoadError && (
            <CodeDisplay
              code={displayCode}
              language={getLanguage()}
              showLineNumbers={true}
              showFrameworkSwitcher={showFrameworkSwitcher}
              wrapLines={wrapLines}
            />
          )}
        </div>
      )}
    </div>
  );
}