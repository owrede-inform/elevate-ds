import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import { Icon } from '@iconify/react';

interface DocHeaderProps {
  title: string;
}

const DocHeader: React.FC<DocHeaderProps> = ({ title }) => {
  const location = useLocation();

  // CSS handles hiding default elements immediately to prevent flash

  // Simple breadcrumb generation from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? null : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Create portal element inside main element
  useEffect(() => {
    const createHeaderPortal = () => {
      // Find the main element using the XPath you provided
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      // Remove existing header if it exists
      const existingHeader = document.getElementById('doc-header-portal');
      if (existingHeader) {
        existingHeader.remove();
      }

      // Create header element
      const headerElement = document.createElement('div');
      headerElement.id = 'doc-header-portal';
      headerElement.className = 'doc-header-section';
      
      // Insert as the FIRST child inside the main element
      mainElement.insertBefore(headerElement, mainElement.firstChild);
      
      // Simple content structure - no nested divs
      headerElement.innerHTML = `
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          ${breadcrumbs.map((item, idx) => `
            <span class="breadcrumbs__item">
              ${item.href ? `
                <a href="${item.href}" class="breadcrumbs__link">
                  ${idx === 0 ? '<span class="home-icon">🏠</span>' : ''}
                  ${item.label}
                </a>
              ` : `
                <span class="breadcrumbs__link breadcrumbs__link--active">
                  ${item.label}
                </span>
              `}
              ${idx < breadcrumbs.length - 1 ? '<span class="breadcrumbs__separator">›</span>' : ''}
            </span>
          `).join('')}
        </nav>
        <h1>${title}</h1>
      `;
    };

    createHeaderPortal();
    
    // Remove the initial margin from row now that header is present
    const rowElement = document.querySelector('.row');
    if (rowElement) {
      (rowElement as HTMLElement).style.marginTop = '0';
    }
    
    // Cleanup function
    return () => {
      const existingHeader = document.getElementById('doc-header-portal');
      if (existingHeader) {
        existingHeader.remove();
      }
      
      // Restore margin if header is removed
      const rowElement = document.querySelector('.row');
      if (rowElement) {
        (rowElement as HTMLElement).style.marginTop = '';
      }
    };
  }, [title, location.pathname]);

  // Return null since we're rendering via portal
  return null;
};

export default DocHeader;