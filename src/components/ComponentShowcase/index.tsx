import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

interface ComponentShowcaseProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  code: string;
  language?: string;
}

export default function ComponentShowcase({
  children,
  title,
  description,
  code,
  language = 'html'
}: ComponentShowcaseProps): JSX.Element {
  return (
    <div className={styles.componentShowcase}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      
      <div className={styles.preview}>
        <div className={styles.previewContent}>
          {children}
        </div>
      </div>

      <CodeBlock language={language} showLineNumbers={true}>
        {code}
      </CodeBlock>
    </div>
  );
}