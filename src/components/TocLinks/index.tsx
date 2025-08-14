import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './styles.module.css';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

const TocLinks: React.FC = () => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // Find all H2 headings in the document that already have IDs (Docusaurus generates these)
    const headings = document.querySelectorAll('.markdown h2[id], .theme-doc-markdown h2[id]');
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const id = heading.id;
      
      if (id && text) {
        items.push({
          id: id,
          title: text,
          level: 2
        });
      }
    });

    setTocItems(items);
  }, []);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.tocColumns}>
      {tocItems.map((item, index) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={styles.tocLink}
          onClick={(e) => {
            e.preventDefault();
            const targetElement = document.getElementById(item.id);
            if (targetElement) {
              targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
              // Update URL without triggering page reload
              window.history.pushState(null, '', `#${item.id}`);
            }
          }}
        >
          <Icon 
            icon="mdi:subdirectory-arrow-right" 
            className={styles.tocIcon} 
          />
          <span className={styles.tocText}>{item.title}</span>
        </a>
      ))}
    </div>
  );
};

export default TocLinks;