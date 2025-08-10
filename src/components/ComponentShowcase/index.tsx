import React from 'react';
import CodePreview from 'docusaurus-plugin-code-preview';
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
  language = 'tsx'
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

      <CodePreview
        language={language}
        code={code}
        showLineNumbers={true}
      />
    </div>
  );
}