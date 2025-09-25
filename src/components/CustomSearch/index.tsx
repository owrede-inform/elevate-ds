import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  tags: string[];
  group: string;
  category: string;
}

interface SearchResult {
  item: SearchItem;
  matches?: any[];
  score?: number;
}

const CustomSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();

  // Initialize Fuse.js with search index
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const searchIndexPath = `${siteConfig.baseUrl}search-index.json`;
        const response = await fetch(searchIndexPath);
        const searchIndex: SearchItem[] = await response.json();
        
        const fuseOptions = {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'description', weight: 1.5 },
            { name: 'content', weight: 1 },
            { name: 'tags', weight: 1.2 },
            { name: 'group', weight: 0.8 }
          ],
          threshold: 0.3,
          includeMatches: true,
          includeScore: true,
          minMatchCharLength: 2
        };
        
        setFuse(new Fuse(searchIndex, fuseOptions));
      } catch (error) {
        console.error('Error loading search index:', error);
      }
    };
    
    loadSearchIndex();
  }, []);

  // Handle search
  useEffect(() => {
    if (!fuse || searchTerm.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(searchTerm);
    setResults(searchResults.slice(0, 8)); // Limit to 8 results
    setIsOpen(true);
  }, [searchTerm, fuse]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    // Handle base URL for GitHub Pages deployment
    let fullUrl = url;
    if (siteConfig.baseUrl !== '/' && !url.startsWith(siteConfig.baseUrl)) {
      // If we have a base URL (like '/elevate-ds/') and the URL doesn't already include it
      fullUrl = siteConfig.baseUrl + url.replace(/^\//, '');
    }
    history.push(fullUrl);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchTerm('');
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'component': return '🧩';
      case 'design': return '🎨';
      case 'pattern': return '📋';
      case 'guideline': return '📖';
      case 'getting-started': return '🚀';
      default: return '📄';
    }
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInputContainer}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search components, patterns, guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className={styles.searchResults}>
          {results.map((result) => (
            <div
              key={result.item.id}
              className={styles.searchResult}
              onClick={() => handleResultClick(result.item.url)}
            >
              <div className={styles.resultHeader}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(result.item.category)}
                </span>
                <span className={styles.resultTitle}>{result.item.title}</span>
                {result.item.group && (
                  <span className={styles.resultGroup}>{result.item.group}</span>
                )}
              </div>
              <p className={styles.resultDescription}>
                {result.item.description}
              </p>
              {result.item.tags.length > 0 && (
                <div className={styles.resultTags}>
                  {result.item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isOpen && searchTerm.length >= 2 && results.length === 0 && (
        <div className={styles.searchResults}>
          <div className={styles.noResults}>
            <span>No results found for "{searchTerm}"</span>
            <p>Try different keywords or browse <a href={`${siteConfig.baseUrl}docs/components`}>components</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSearch;