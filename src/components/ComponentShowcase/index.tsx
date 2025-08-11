import React, { useEffect, useRef } from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

interface ComponentShowcaseProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  code?: string;
  language?: string;
}

export default function ComponentShowcase({
  children,
  title,
  description,
  code,
  language = 'html'
}: ComponentShowcaseProps): JSX.Element {
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Extract HTML code from children after component mounts
  useEffect(() => {
    if (!code && previewRef.current) {
      const htmlContent = previewRef.current.innerHTML;
      // Store the HTML content for the code block
      previewRef.current.setAttribute('data-html', htmlContent);
    }
  }, [children, code]);
  
  // Use provided code or extract from children
  const displayCode = code || (typeof children === 'string' ? children : '');

  return (
    <div className={`${styles.componentShowcase} componentShowcase`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      
      <div className={styles.preview}>
        <div className={styles.previewContent} ref={previewRef}>
          {children}
        </div>
      </div>

      <CodeBlock language={language} showLineNumbers={true}>
        {displayCode}
      </CodeBlock>
    </div>
  );
}