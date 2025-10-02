import React, { useEffect, useRef, useState } from 'react';
import { useFramework } from '../../contexts/FrameworkContext';
import { transformWebComponentCode, extractComponentNamesFromCode } from '../../utils/frameworkTransformer';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface DoExample {
  type: 'do';
  code?: string; // Can be inline code, file path, or SVG content
  image?: string; // Path to image file
  title?: string;
  description?: string;
}

interface DontExample {
  type: 'dont';
  code?: string; // Can be inline code, file path, or SVG content
  image?: string; // Path to image file
  title?: string;
  description?: string;
}

type Example = DoExample | DontExample;

interface ComponentDoDontProps {
  examples: [Example] | [Example, Example]; // 1 or 2 examples
  language?: string;
  wrapLines?: boolean;
}

export default function ComponentDoDont({
  examples,
  language = 'html',
  wrapLines = true
}: ComponentDoDontProps): React.ReactElement {
  const { selectedFramework } = useFramework();
  const baseUrl = useBaseUrl('/');
  const [exampleContents, setExampleContents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper function to check if code parameter is a file path
  const isFilePath = (codeParam: string): boolean => {
    return /\.(ts|tsx|js|jsx|html|css|scss|md|mdx)$/i.test(codeParam) && !codeParam.includes('\n');
  };

  // Sanitize HTML content for preview
  const sanitizeHTMLForPreview = (html: string): string => {
    // Remove HTML comments
    let sanitized = html.replace(/<!--[\s\S]*?-->/g, '');

    // Remove DOCTYPE and html/head/body tags if present
    sanitized = sanitized.replace(/<!DOCTYPE[^>]*>/gi, '');
    sanitized = sanitized.replace(/<\/?(?:html|head|body)[^>]*>/gi, '');

    // Remove extra whitespace, newlines, and tabs for preview
    sanitized = sanitized.replace(/\s+/g, ' ');
    sanitized = sanitized.replace(/>\s+</g, '><');
    sanitized = sanitized.trim();

    return sanitized;
  };

  // Load file content for examples
  useEffect(() => {
    const loadExampleContents = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const contents: string[] = [];

        for (const example of examples) {
          if (!example.code) {
            contents.push('');
            continue;
          }

          if (isFilePath(example.code)) {
            // Load from file
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(part => part);
            const docsIndex = pathParts.indexOf('docs');
            const relativePath = docsIndex >= 0 ? pathParts.slice(docsIndex + 1) : [];

            let filePaths = [];

            if (example.code.includes('/') || example.code.includes('\\')) {
              // If code contains path separators, use it as-is with baseUrl
              filePaths.push(`${baseUrl}${example.code}`);
            } else {
              // Primary path: static folder with full docs path structure
              const staticPath = relativePath.length > 0
                ? `${baseUrl}docs/${relativePath.join('/')}/code-examples/${example.code}`
                : `${baseUrl}docs/components/code-examples/${example.code}`;
              filePaths.push(staticPath);

              // Secondary paths for legacy support
              const componentName = relativePath.length > 0 ? relativePath[relativePath.length - 1] : '';
              filePaths.push(`${baseUrl}code-examples/${componentName}/${example.code}`);
              filePaths.push(`${baseUrl}code-examples/${example.code}`);
            }

            let content = '';

            // Try each path until one succeeds
            for (const filePath of filePaths) {
              try {
                const response = await fetch(filePath);
                if (response.ok) {
                  content = await response.text();
                  break;
                }
              } catch (fetchError) {
                continue;
              }
            }

            if (!content) {
              throw new Error(`Failed to load file: ${example.code}`);
            }

            contents.push(sanitizeHTMLForPreview(content));
          } else {
            // Use inline code
            contents.push(sanitizeHTMLForPreview(example.code));
          }
        }

        setExampleContents(contents);
      } catch (error) {
        console.error('Error loading example contents:', error);
        setLoadError(`Failed to load examples: ${(error as Error).message}`);
        setExampleContents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExampleContents();
  }, [examples, baseUrl]);

  // Handle icon resolution after content is injected
  useEffect(() => {
    if (exampleContents.length > 0) {
      setTimeout(() => {
        previewRefs.current.forEach((ref) => {
          if (ref) {
            const iconElements = ref.querySelectorAll('elvt-icon[icon^="mdi:"]');
            iconElements.forEach((iconEl: Element) => {
              const icon = iconEl.getAttribute('icon');
              if (icon) {
                (iconEl as any).icon = icon;
              }
            });
          }
        });
      }, 100);
    }
  }, [exampleContents]);

  const renderExample = (example: Example, content: string, index: number) => {
    const isDo = example.type === 'do';
    const isSingle = examples.length === 1;

    // Render image content if image property is provided
    const renderContent = () => {
      if (example.image) {
        // Manually construct image URL using baseUrl (no hook calls here)
        const imageUrl = baseUrl + example.image.replace(/^\//, '');
        return (
          <div className={styles.previewContent}>
            <img
              src={imageUrl}
              alt={example.title || (isDo ? 'Do example' : "Don't example")}
              className={styles.exampleImage}
            />
          </div>
        );
      }

      // Render code content (existing behavior)
      return (
        <div
          className={styles.previewContent}
          ref={(el) => { previewRefs.current[index] = el; }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    };

    return (
      <div
        key={index}
        className={`${styles.example} ${isDo ? styles.doExample : styles.dontExample} ${isSingle ? styles.singleExample : styles.pairExample}`}
      >
        <div className={styles.examplePreview}>
          <div className={styles.exampleHeader}>
            <div className={`${styles.indicator} ${isDo ? styles.doIndicator : styles.dontIndicator}`}>
              {isDo ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              )}
            </div>
            <span className={styles.exampleLabel}>
              {isDo ? 'Do' : "Don't"}
            </span>
          </div>

          {renderContent()}
        </div>

        {example.title && (
          <div className={styles.exampleTitle}>{example.title}</div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.componentDoDont}>
        <div className={styles.loadingState}>
          <p>Loading examples...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.componentDoDont}>
        <div className={styles.errorState}>
          <p style={{ color: 'var(--ifm-color-danger)' }}>{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.componentDoDont}>
      <div className={`${styles.examplesContainer} ${examples.length === 1 ? styles.singleContainer : ''}`}>
        {examples.map((example, index) =>
          renderExample(example, exampleContents[index] || '', index)
        )}
      </div>
    </div>
  );
}