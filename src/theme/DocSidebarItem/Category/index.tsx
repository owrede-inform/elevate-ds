import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import {
  isSamePath,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import type {Props} from '@theme/DocSidebarItem/Category';

// Global state for accordion behavior - only allow one section expanded at a time
class AccordionState {
  private expandedSection: string | null = null;
  private listeners = new Set<(expandedSection: string | null) => void>();
  private routeChangeInitialized = false;
  
  getExpandedSection(): string | null {
    return this.expandedSection;
  }
  
  setExpandedSection(sectionId: string | null) {
    if (this.expandedSection !== sectionId) {
      this.expandedSection = sectionId;
      this.listeners.forEach(listener => listener(sectionId));
    }
  }
  
  subscribe(listener: (expandedSection: string | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  isExpanded(sectionId: string): boolean {
    return this.expandedSection === sectionId;
  }
  
  // Helper to ensure only active sections remain expanded
  ensureActiveSection(activeSectionId: string | null) {
    if (activeSectionId && this.expandedSection !== activeSectionId) {
      this.setExpandedSection(activeSectionId);
    }
  }
  
  // Initialize route change listening (only once globally)
  initializeRouteListener() {
    if (this.routeChangeInitialized || typeof window === 'undefined') return;
    
    this.routeChangeInitialized = true;
    
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      // Allow components to detect their active state and manage expansion
      // Don't clear expanded state - let the active detection handle it
    });
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      // Don't clear expanded state - let the active detection handle it
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      // Don't clear expanded state - let the active detection handle it
    };
  }
}

const accordionState = new AccordionState();

function DocSidebarItemCategory({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): JSX.Element {
  const {items, label, collapsible, className, href} = item;
  const {
    docs: {
      sidebar: {autoCollapseCategories},
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useIsBrowser() ? href : undefined;
  
  // Enhanced active check - recursively check if any child item matches the current path
  const isActive = useMemo(() => {
    const checkActiveRecursively = (itemList: any[]): boolean => {
      return itemList.some((childItem) => {
        if (childItem.type === 'link') {
          return isSamePath(childItem.href, activePath);
        } else if (childItem.type === 'category' && childItem.items) {
          return checkActiveRecursively(childItem.items);
        }
        return false;
      });
    };
    
    // Check if we're on this section's main page (href match)
    const isMainPage = href && isSamePath(href, activePath);
    
    // Also check if the current path starts with this section's base path
    const sectionBasePaths = [
      href,
      `/docs/${item.label.toLowerCase()}`,
      `/${item.label.toLowerCase()}`,
      `/docs/${item.label.toLowerCase().replace(/\s+/g, '-')}` // Handle spaces in labels
    ].filter(Boolean);
    
    const pathMatches = sectionBasePaths.some(basePath => {
      const cleanBasePath = basePath.replace('/index', '');
      return activePath.startsWith(cleanBasePath) || activePath === cleanBasePath;
    });
    
    return isMainPage || checkActiveRecursively(items) || pathMatches;
  }, [items, activePath, href, item.label]);
  
  const isCurrentPage = href ? isSamePath(href, activePath) : false;

  const {collapsed, setCollapsed} = useCollapsible({
    // Active categories are always initialized as expanded. The default
    // (`item.collapsed`) is only used for non-active categories.
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      
      // Check if this is an accordion section
      const isAccordionSection = item.customProps?.accordion === true;
      
      if (isAccordionSection) {
        // For accordion sections, only expand if this is the active section or no section is expanded yet
        const currentExpanded = accordionState.getExpandedSection();
        if (currentExpanded === null) {
          // First load - expand the active section or the first one (Home)
          if (isActive || item.label === 'Home') {
            accordionState.setExpandedSection(item.label);
            return false; // expanded
          }
          return true; // collapsed
        }
        return !accordionState.isExpanded(item.label);
      }
      
      return isActive ? false : item.collapsed;
    },
  });

  // Use this instead of `setCollapsed`, because it is also reactive
  const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
    const isAccordionSection = item.customProps?.accordion === true;
    
    if (isAccordionSection) {
      if (!toCollapsed) {
        // Expanding this section - close all others
        accordionState.setExpandedSection(item.label);
      } else if (accordionState.isExpanded(item.label)) {
        // Collapsing the currently expanded section
        accordionState.setExpandedSection(null);
      }
    }
    
    setCollapsed(toCollapsed);
  };

  const prevCollapsed = usePrevious(collapsed);

  // If we just expanded the category, scroll it into view
  useEffect(() => {
    if (collapsible && prevCollapsed && !collapsed) {
      scrollIntoView();
    }
  }, [collapsible, prevCollapsed, collapsed]);

  // Initialize global route listener (only once)
  useEffect(() => {
    accordionState.initializeRouteListener();
  }, []);

  // Handle deep link navigation and route changes - expand correct section when page is active
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    // If this section is active (contains the current page), expand it
    if (isActive && accordionState.getExpandedSection() !== item.label) {
      accordionState.setExpandedSection(item.label);
    }
    // If this section was expanded but is no longer active, and another section should be active, 
    // the other active section will handle the expansion
  }, [isActive, item.customProps?.accordion, item.label, activePath]);

  // Additional effect to handle initial page load and navigation from homepage
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    // Small delay to ensure all components have updated their active state
    const timer = setTimeout(() => {
      if (isActive && accordionState.getExpandedSection() !== item.label) {
        accordionState.setExpandedSection(item.label);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [activePath, isActive, item.customProps?.accordion, item.label]);

  // Subscribe to accordion state changes
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    return accordionState.subscribe((expandedSection) => {
      const shouldBeExpanded = expandedSection === item.label;
      const shouldBeCollapsed = !shouldBeExpanded;
      
      if (shouldBeCollapsed !== collapsed) {
        setCollapsed(shouldBeCollapsed);
      }
    });
  }, [item.customProps?.accordion, item.label, collapsed, setCollapsed]);

  // Auto-collapse categories when a page is opened that is not under current category
  useEffect(() => {
    if (
      collapsible &&
      prevCollapsed === false &&
      !isActive &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, prevCollapsed, isActive, autoCollapseCategories, setCollapsed]);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}>
        <Link
          className={clsx('menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--sublist-caret': !href && collapsible,
            'menu__link--active': isActive,
          })}
          onClick={
            collapsible
              ? (e) => {
                  onItemClick?.(item);
                  if (href) {
                    updateCollapsed(false);
                  } else {
                    e.preventDefault();
                    updateCollapsed();
                  }
                }
              : () => {
                  onItemClick?.(item);
                }
          }
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && !href ? 'button' : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={clsx(hrefWithSSRFallback)}
          {...props}>
          {label}
        </Link>
        {href && collapsible && (
          <button
            aria-label={translate(
              {
                id: 'theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel',
                message: "Toggle the collapsible sidebar category '{label}'",
                description:
                  'The ARIA label to toggle the collapsible sidebar category',
              },
              {label},
            )}
            type="button"
            className="clean-btn menu__caret"
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}

export default React.memo(DocSidebarItemCategory);

// Helper function to scroll element into view
function scrollIntoView() {
  // Implementation would depend on specific requirements
  // This is a placeholder for the scroll behavior
}