import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface NavigationItem {
  label: string;
  to: string;
}

/**
 * Responsive Navigation Dropdown
 * 
 * Shows main navigation items in a dropdown when screen width
 * is between 997px and 1190px (before burger menu appears)
 */
const ResponsiveNavigation: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navigation items matching the sidebar structure
  const navigationItems: NavigationItem[] = [
    { label: 'Home', to: '/docs/home/' },
    { label: 'Guidelines', to: '/docs/guidelines/' },
    { label: 'Components', to: '/docs/components/' },
    { label: 'Patterns', to: '/docs/patterns/' },
    { label: 'Design', to: '/docs/design/' },
  ];

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

  // Set default selected item based on current path
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentItem = navigationItems.find(item => 
      currentPath.startsWith(item.to)
    );
    setSelectedItem(currentItem || navigationItems[0]);
  }, []);

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
            {navigationItems.map((item) => (
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