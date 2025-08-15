import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

interface NavigationItem {
  label: string;
  to: string;
}

// Navigation items matching the sidebar structure (moved outside component to prevent re-creation)
const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Home', to: '/docs/home/' },
  { label: 'Guidelines', to: '/docs/guidelines/' },
  { label: 'Components', to: '/docs/components/' },
  { label: 'Patterns', to: '/docs/patterns/' },
  { label: 'Design', to: '/docs/design/' },
  { label: 'DS', to: '/docs/ds/' },
];

/**
 * Responsive Navigation Dropdown
 * 
 * Shows main navigation items in a dropdown when screen width
 * is between 997px and 1190px (before burger menu appears)
 */
const ResponsiveNavigation: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if we're in the responsive breakpoint
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Show in tablet range: above small mobile (768px) and below desktop navigation (1180px)
      const shouldShow = width >= 768 && width <= 1180;
      setIsVisible(shouldShow);
      
      if (!shouldShow) {
        setIsDropdownOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Update selected item based on current path whenever location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find the best matching navigation item
    const currentItem = NAVIGATION_ITEMS.find(item => {
      // Handle exact matches and path prefixes
      return currentPath === item.to || currentPath.startsWith(item.to);
    });
    
    // Fallback: if no exact match, try to match the first segment after /docs/
    if (!currentItem) {
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length >= 2 && pathSegments[0] === 'docs') {
        const firstSegment = pathSegments[1];
        const fallbackItem = NAVIGATION_ITEMS.find(item => 
          item.to.includes(`/docs/${firstSegment}/`)
        );
        setSelectedItem(fallbackItem || NAVIGATION_ITEMS[0]);
      } else {
        setSelectedItem(NAVIGATION_ITEMS[0]);
      }
    } else {
      setSelectedItem(currentItem);
    }
  }, [location.pathname]);

  const handleItemClick = (item: NavigationItem) => {
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.dropdown}`)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.responsiveNav}>
      <div className={styles.dropdown}>
        <button 
          className={styles.dropdownToggle}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <span className={styles.dropdownLabel}>
            {selectedItem?.label || 'Navigation'}
          </span>
          <svg 
            className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
          >
            <path 
              d="M2 4l4 4 4-4" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.dropdownItem} ${
                  selectedItem?.to === item.to ? styles.active : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveNavigation;