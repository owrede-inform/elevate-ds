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
  private lastPath: string | null = null;
  
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
  
  // Reset state when coming from non-docs page (like homepage)
  checkForCrossPageNavigation(currentPath: string) {
    const wasOnDocsPage = this.lastPath && this.lastPath.startsWith('/docs');
    const isOnDocsPage = currentPath.startsWith('/docs');
    
    // If coming from non-docs page to docs page, reset accordion state
    if (!wasOnDocsPage && isOnDocsPage) {
      const previousSection = this.expandedSection;
      this.expandedSection = null;
      if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
        console.log('[Accordion] Reset state - coming from non-docs page to docs page, was:', previousSection);
      }
      // Notify all listeners that no section should be expanded
      this.listeners.forEach(listener => listener(null));
    }
    
    this.lastPath = currentPath;
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
  
  // Check for cross-page navigation and reset state if needed
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      accordionState.checkForCrossPageNavigation(window.location.pathname);
    }
  }, [activePath]);

  // Force re-synchronization of accordion state after navigation
  React.useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    // Additional synchronization delay to ensure all components are properly initialized
    const timer = setTimeout(() => {
      const currentExpanded = accordionState.getExpandedSection();
      const shouldBeExpanded = currentExpanded === item.label;
      const shouldBeCollapsed = !shouldBeExpanded;
      
      if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
        console.log(`[Sync] ${item.label} - currentExpanded: ${currentExpanded}, shouldBeCollapsed: ${shouldBeCollapsed}, collapsed: ${collapsed}`);
      }
      
      // Force synchronization if states are out of sync
      if (shouldBeCollapsed !== collapsed) {
        if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
          console.log(`[Sync] Force sync ${item.label} - setting collapsed to ${shouldBeCollapsed}`);
        }
        setCollapsed(shouldBeCollapsed);
      }
    }, 200); // Longer delay for full navigation settlement
    
    return () => clearTimeout(timer);
  }, [activePath, item.customProps?.accordion, item.label]);
  
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
    
    // Enhanced section base path matching with better logic
    const sectionBasePaths = [
      href, // Direct href match from sidebar config
      `/docs/${item.label.toLowerCase()}`, // Standard section path
      `/docs/${item.label.toLowerCase()}/`, // With trailing slash
      `/${item.label.toLowerCase()}`,
      `/docs/${item.label.toLowerCase().replace(/\s+/g, '-')}`, // Handle spaces in labels
      `/docs/${item.label.toLowerCase().replace(/\s+/g, '-')}/` // With trailing slash
    ].filter(Boolean);
    
    // More precise path matching
    const pathMatches = sectionBasePaths.some(basePath => {
      const cleanBasePath = basePath.replace('/index', '').replace(/\/$/, ''); // Remove trailing slash for comparison
      const cleanActivePath = activePath.replace(/\/$/, ''); // Remove trailing slash for comparison
      
      // Exact match or starts with the base path followed by a slash (to avoid partial matches)
      return cleanActivePath === cleanBasePath || 
             cleanActivePath.startsWith(cleanBasePath + '/');
    });
    
    const recursiveMatch = checkActiveRecursively(items);
    const result = isMainPage || recursiveMatch || pathMatches;
    
    // Debug logging to help troubleshoot
    if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
      console.log(`[Sidebar] ${item.label}:`, {
        activePath,
        href,
        sectionBasePaths,
        isMainPage,
        pathMatches,
        recursiveMatch,
        result
      });
    }
    
    return result;
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
        // For accordion sections, prioritize current active path over stale state
        const currentExpanded = accordionState.getExpandedSection();
        const itemCount = items?.length || 0;
        const isLargeSection = itemCount > 20; // Components has 55 items
        
        // Debug logging for initialization
        if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
          console.log(`[Init] ${item.label} - isActive: ${isActive}, currentExpanded: ${currentExpanded}, itemCount: ${itemCount}, isLargeSection: ${isLargeSection}`);
        }
        
        // For large sections (like Components), be more conservative with initial state
        // to avoid flash of wrong content while DOM is still rendering
        if (isLargeSection) {
          // Start collapsed for large sections and let the effects handle expansion
          // This prevents the flash of wrong state during initial render
          if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
            console.log(`[Init] ${item.label} - starting collapsed (large section), will expand via effects`);
          }
          return true; // collapsed initially
        }
        
        // For smaller sections, use the previous logic
        if (isActive) {
          accordionState.setExpandedSection(item.label);
          if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
            console.log(`[Init] Expanding ${item.label} because it's active (small section)`);
          }
          return false; // expanded
        }
        
        // If no section is expanded yet, expand Home as default (only if we're actually on Home)
        if (currentExpanded === null && item.label === 'Home' && 
            (activePath.startsWith('/docs/home') || activePath === '/docs/home')) {
          accordionState.setExpandedSection(item.label);
          return false; // expanded
        }
        
        // Use accordion state for non-active sections
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

  // Force accordion state evaluation on path change - this ensures proper coordination
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    // On any path change, re-evaluate which section should be expanded
    // This helps coordinate between all sections when navigation occurs
    const timer = setTimeout(() => {
      // Find all accordion sections and let the active one claim expansion
      const allSections = document.querySelectorAll('.sidebar-accordion-section');
      let foundActiveSection = false;
      
      allSections.forEach((sectionElement) => {
        const sectionLabel = sectionElement.textContent?.split('\n')[0]?.trim();
        if (sectionLabel) {
          // Check if this section contains the active path
          const sectionActive = sectionLabel === item.label && isActive;
          if (sectionActive && !foundActiveSection) {
            foundActiveSection = true;
            if (accordionState.getExpandedSection() !== item.label) {
              if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
                console.log(`[Accordion Coordination] Setting ${item.label} as active section`);
              }
              accordionState.setExpandedSection(item.label);
            }
          }
        }
      });
    }, 150); // Slightly longer delay to ensure DOM is updated
    
    return () => clearTimeout(timer);
  }, [activePath]); // Only trigger on path changes

  // Handle deep link navigation and route changes - expand correct section when page is active
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    const itemCount = items?.length || 0;
    const isLargeSection = itemCount > 20;
    
    // Debug logging
    if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
      console.log(`[Accordion] ${item.label} - isActive: ${isActive}, currentExpanded: ${accordionState.getExpandedSection()}, isLargeSection: ${isLargeSection}`);
    }
    
    // If this section is active (contains the current page), expand it
    if (isActive && accordionState.getExpandedSection() !== item.label) {
      if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
        console.log(`[Accordion] Expanding ${item.label} because it's active`);
      }
      accordionState.setExpandedSection(item.label);
      
      // For large sections that started collapsed, also update the local state immediately
      if (isLargeSection && collapsed) {
        if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
          console.log(`[Accordion] Immediately expanding ${item.label} (large section)`);
        }
        setCollapsed(false);
      }
    }
    // If this section is not active but is currently expanded, we need to let another active section take over
    else if (!isActive && accordionState.getExpandedSection() === item.label) {
      // Don't immediately collapse - let the active section expand first
      // This prevents flashing and ensures smooth transitions
    }
  }, [isActive, item.customProps?.accordion, item.label, activePath, items, collapsed, setCollapsed]);

  // Additional effect to handle initial page load and navigation from homepage
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    const itemCount = items?.length || 0;
    const isLargeSection = itemCount > 20;
    // Use longer delay for large sections to ensure DOM is fully rendered
    const delay = isLargeSection ? 300 : 100;
    
    // Longer delay to ensure all components have updated their active state and DOM is settled
    const timer = setTimeout(() => {
      if (isActive && accordionState.getExpandedSection() !== item.label) {
        if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
          console.log(`[Accordion Delayed] Expanding ${item.label} after navigation (delay: ${delay}ms)`);
        }
        accordionState.setExpandedSection(item.label);
        
        // For large sections, also ensure local state is updated
        if (isLargeSection && collapsed) {
          setCollapsed(false);
        }
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [activePath, isActive, item.customProps?.accordion, item.label, items, collapsed, setCollapsed]);

  // Subscribe to accordion state changes
  useEffect(() => {
    const isAccordionSection = item.customProps?.accordion === true;
    if (!isAccordionSection) return;
    
    return accordionState.subscribe((expandedSection) => {
      const shouldBeExpanded = expandedSection === item.label;
      const shouldBeCollapsed = !shouldBeExpanded;
      
      // Debug logging for subscription changes
      if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
        console.log(`[Subscription] ${item.label} - expandedSection: ${expandedSection}, shouldBeExpanded: ${shouldBeExpanded}, currentCollapsed: ${collapsed}`);
      }
      
      if (shouldBeCollapsed !== collapsed) {
        if (typeof window !== 'undefined' && window.location.search.includes('debug=sidebar')) {
          console.log(`[Subscription] ${item.label} - changing collapsed from ${collapsed} to ${shouldBeCollapsed}`);
        }
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