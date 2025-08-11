/**
 * Custom CodeDisplay component for ComponentShowcase
 * Replaces Docusaurus CodeBlock with our own clean implementation
 */

import React, { useState, useEffect } from 'react';
import { Highlight, themes, Prism } from 'prism-react-renderer';
import { useFramework } from '../../contexts/FrameworkContext';
import FrameworkSwitcher from '../FrameworkSwitcher';
import styles from './styles.module.css';

// Set up Prism globally before importing language components
(typeof global !== "undefined" ? global : window).Prism = Prism;

// Load additional language support dynamically
let languagesLoaded = false;
const loadLanguages = () => {
  if (typeof window !== "undefined" && !languagesLoaded) {
    // Load TypeScript support (for Angular)
    import('prismjs/components/prism-typescript').catch(() => {
      console.warn('Could not load TypeScript syntax highlighting');
    });
    
    // Load JSX support (for React)
    import('prismjs/components/prism-jsx').catch(() => {
      console.warn('Could not load JSX syntax highlighting');
    });

    // Load CSS support
    import('prismjs/components/prism-css').catch(() => {
      console.warn('Could not load CSS syntax highlighting');
    });

    languagesLoaded = true;
  }
};

// Load languages immediately
loadLanguages();

interface CodeDisplayProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  showFrameworkSwitcher?: boolean;
  wrapLines?: boolean;
}

export default function CodeDisplay({
  code,
  language,
  showLineNumbers = true,
  showFrameworkSwitcher = true,
  wrapLines = true
}: CodeDisplayProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { selectedFramework } = useFramework();

  // Ensure languages are loaded when component mounts
  useEffect(() => {
    loadLanguages();
  }, []);

  // Watch for theme changes
  useEffect(() => {
    const updateTheme = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setIsDarkMode(isDark);
      }
    };

    // Set initial theme
    updateTheme();

    // Watch for theme changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateTheme();
        }
      });
    });

    // Start observing
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    // Cleanup observer
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Get the appropriate theme based on current theme state
  // Using the same themes as Docusaurus for consistency
  const getTheme = () => {
    return isDarkMode ? themes.dracula : themes.github;
  };

  // Map framework to appropriate syntax highlighting language
  const getLanguageForFramework = (framework: string, defaultLanguage: string) => {
    const frameworkLanguageMap: Record<string, string> = {
      'webcomponent': 'markup', // HTML tags, available by default
      'html': 'markup', // HTML tags, available by default
      'react': 'jsx', // JSX syntax (imported dynamically)
      'angular': 'typescript', // TypeScript syntax (imported dynamically)
      'vue': 'markup', // Vue templates are HTML-like (fallback to markup)
      'svelte': 'markup' // Svelte templates are HTML-like (fallback to markup)
    };
    
    // Check if the language is available, fallback to safer options
    const targetLanguage = frameworkLanguageMap[framework] || defaultLanguage;
    
    // Languages are imported directly, so they should be available
    // Keep fallback just in case
    if (targetLanguage === 'jsx' && typeof Prism?.languages?.jsx === 'undefined') {
      return 'javascript';
    }
    if (targetLanguage === 'typescript' && typeof Prism?.languages?.typescript === 'undefined') {
      return 'javascript';
    }
    
    return targetLanguage;
  };

  // Get the final language to use for syntax highlighting
  const syntaxLanguage = getLanguageForFramework(selectedFramework, language);

  return (
    <div className={styles.codeDisplay}>
      {/* Floating controls - shown on hover */}
      <div className={styles.floatingControls}>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
          )}
        </button>
        
        {showFrameworkSwitcher && (
          <FrameworkSwitcher hideLabel size="small" />
        )}
      </div>
      
      {/* Code content using prism-react-renderer */}
      <div className={`${styles.codeContent} ${wrapLines ? styles.wrapLines : styles.noWrapLines}`}>
        <Highlight
          theme={getTheme()}
          code={code}
          language={syntaxLanguage as any}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${styles.code} ${className}`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })} className={styles.line}>
                  {showLineNumbers && (
                    <span className={styles.lineNumber}>{i + 1}</span>
                  )}
                  <span className={styles.lineContent}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}