---
title: Application Shell
description: Enterprise application shell pattern with module switcher and navigation for ELEVATE applications
sidebar_position: 2
---

# Application Shell Pattern

The Application Shell pattern provides a consistent layout structure for enterprise applications, featuring integrated module switching and hierarchical navigation. This pattern is essential for multi-module applications where users need to switch between different functional areas while maintaining context and navigation state.

## Pattern Overview

The application shell serves as the foundational layout that wraps all application content, providing:

- **Global Navigation Header** - Top-level branding, user controls, and system-wide actions
- **Module Switcher** - Switch between different application modules or products
- **Module Menu** - Context-sensitive navigation within the current module
- **Main Content Area** - Dynamic content based on current route and module
- **Footer** (optional) - Additional links, legal information, or system status

## When to Use

Use the application shell pattern when:

- Building multi-module enterprise applications
- Users need to switch between different functional areas (e.g., CRM, Analytics, Settings)
- Consistent navigation and branding across modules is required
- Applications have complex hierarchical navigation structures
- Multiple teams are building different modules that need unified UX

## ELEVATE Implementation

### Core Structure

```tsx
import { ElvtApplication } from '@inform-elevate/elevate-core-ui';

<ElvtApplication>
  <div className="appshell">
    <header className="appshell-header">
      {/* Global header with branding */}
    </header>
    
    <nav className="appshell-navigation">
      {/* Module switcher and module menu */}
    </nav>
    
    <main className="appshell-content">
      {/* Dynamic content area */}
    </main>
    
    <footer className="appshell-footer">
      {/* Optional footer */}
    </footer>
  </div>
</ElvtApplication>
```

### Module Switcher Component

The module switcher allows users to navigate between different application modules or products.

```tsx
interface ModuleSwitcherProps {
  modules: Array<{
    id: string;
    label: string;
    icon?: string;
    href: string;
    active?: boolean;
  }>;
  currentModule?: string;
  onModuleChange?: (moduleId: string) => void;
}

const ModuleSwitcher: React.FC<ModuleSwitcherProps> = ({
  modules,
  currentModule,
  onModuleChange
}) => (
  <div className="module-switcher">
    <ElvtSelect 
      value={currentModule}
      onChange={onModuleChange}
      placeholder="Select Module"
    >
      {modules.map(module => (
        <ElvtOption key={module.id} value={module.id}>
          {module.icon && <ElvtIcon name={module.icon} />}
          {module.label}
        </ElvtOption>
      ))}
    </ElvtSelect>
  </div>
);
```

### Module Menu Component

The module menu provides navigation within the current module, supporting hierarchical menu structures.

```tsx
interface ModuleMenuProps {
  menuItems: Array<{
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: ModuleMenuProps['menuItems'];
    active?: boolean;
    expanded?: boolean;
  }>;
  level?: number;
  onNavigate?: (href: string) => void;
}

const ModuleMenu: React.FC<ModuleMenuProps> = ({
  menuItems,
  level = 0,
  onNavigate
}) => (
  <nav className={`module-menu level-${level}`}>
    {menuItems.map(item => (
      <div key={item.id} className="menu-item">
        <ElvtButton
          variant={item.active ? "primary" : "ghost"}
          tone={item.active ? "default" : "neutral"}
          size="medium"
          onClick={() => item.href && onNavigate?.(item.href)}
        >
          {item.icon && <ElvtIcon name={item.icon} />}
          {item.label}
        </ElvtButton>
        
        {item.children && item.expanded && (
          <ModuleMenu
            menuItems={item.children}
            level={level + 1}
            onNavigate={onNavigate}
          />
        )}
      </div>
    ))}
  </nav>
);
```

## Layout Specifications

### Grid Structure

```css
.appshell {
  display: grid;
  grid-template-areas:
    "header header"
    "navigation content"
    "navigation footer";
  grid-template-columns: var(--appshell-sidebar-width, 280px) 1fr;
  grid-template-rows: var(--appshell-header-height, 64px) 1fr auto;
  min-height: 100vh;
}

.appshell-header {
  grid-area: header;
  background: var(--elvt-alias-layout-surface-elevated);
  border-bottom: 1px solid var(--elvt-alias-layout-border-default);
  z-index: 100;
}

.appshell-navigation {
  grid-area: navigation;
  background: var(--elvt-alias-layout-surface-secondary);
  border-right: 1px solid var(--elvt-alias-layout-border-default);
  overflow-y: auto;
}

.appshell-content {
  grid-area: content;
  background: var(--elvt-alias-layout-surface-primary);
  overflow-y: auto;
  padding: var(--elvt-spacing-large);
}

.appshell-footer {
  grid-area: footer;
  background: var(--elvt-alias-layout-surface-secondary);
  border-top: 1px solid var(--elvt-alias-layout-border-muted);
  padding: var(--elvt-spacing-medium);
}
```

### Responsive Behavior

```css
/* Tablet breakpoint */
@media (max-width: 1024px) {
  .appshell {
    grid-template-areas:
      "header"
      "content"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .appshell-navigation {
    position: fixed;
    top: var(--appshell-header-height);
    left: -280px;
    width: 280px;
    height: calc(100vh - var(--appshell-header-height));
    transition: left 0.3s ease;
    z-index: 90;
  }
  
  .appshell-navigation.open {
    left: 0;
  }
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .appshell-navigation {
    width: 100vw;
    left: -100vw;
  }
  
  .appshell-content {
    padding: var(--elvt-spacing-medium);
  }
}
```

## Usage Examples

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { ElvtApplication, ElvtButton, ElvtIcon } from '@inform-elevate/elevate-core-ui';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics', href: '/analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', href: '/dashboard', active: true },
    { id: 'reports', label: 'Reports', href: '/dashboard/reports' },
    { 
      id: 'data', 
      label: 'Data Management', 
      expanded: true,
      children: [
        { id: 'import', label: 'Import Data', href: '/dashboard/data/import' },
        { id: 'export', label: 'Export Data', href: '/dashboard/data/export' }
      ]
    }
  ];

  return (
    <ElvtApplication>
      <div className="appshell">
        <header className="appshell-header">
          <div className="header-content">
            <ElvtButton
              variant="ghost"
              size="medium"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-toggle"
            >
              <ElvtIcon name="menu" />
            </ElvtButton>
            
            <div className="brand">
              <ElvtIcon name="inform-logo" size="large" />
              <span>INFORM Platform</span>
            </div>
            
            <div className="header-actions">
              <ElvtButton variant="ghost" size="medium">
                <ElvtIcon name="notifications" />
              </ElvtButton>
              <ElvtButton variant="ghost" size="medium">
                <ElvtIcon name="profile" />
              </ElvtButton>
            </div>
          </div>
        </header>

        <nav className={`appshell-navigation ${sidebarOpen ? 'open' : ''}`}>
          <ModuleSwitcher
            modules={modules}
            currentModule={currentModule}
            onModuleChange={setCurrentModule}
          />
          
          <ModuleMenu
            menuItems={menuItems}
            onNavigate={(href) => {
              // Handle navigation
              console.log('Navigate to:', href);
              setSidebarOpen(false);
            }}
          />
        </nav>

        <main className="appshell-content">
          {children}
        </main>

        <footer className="appshell-footer">
          <div className="footer-content">
            <span>© 2024 INFORM Software. All rights reserved.</span>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/support">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </ElvtApplication>
  );
};

export default AppShell;
```

### Advanced Module Configuration

```tsx
interface ModuleConfig {
  id: string;
  label: string;
  icon: string;
  route: string;
  permissions?: string[];
  menuItems: MenuItemConfig[];
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

const moduleConfigs: ModuleConfig[] = [
  {
    id: 'crm',
    label: 'Customer Relations',
    icon: 'people',
    route: '/crm',
    permissions: ['crm.read'],
    menuItems: [
      { id: 'contacts', label: 'Contacts', href: '/crm/contacts', icon: 'person' },
      { id: 'companies', label: 'Companies', href: '/crm/companies', icon: 'business' },
      { 
        id: 'sales', 
        label: 'Sales', 
        icon: 'trending-up',
        children: [
          { id: 'opportunities', label: 'Opportunities', href: '/crm/sales/opportunities' },
          { id: 'pipeline', label: 'Pipeline', href: '/crm/sales/pipeline' }
        ]
      }
    ],
    theme: {
      primaryColor: '#0066cc',
      accentColor: '#00aa44'
    }
  },
  {
    id: 'analytics',
    label: 'Analytics & Reporting',
    icon: 'analytics',
    route: '/analytics',
    permissions: ['analytics.read'],
    menuItems: [
      { id: 'dashboards', label: 'Dashboards', href: '/analytics/dashboards', icon: 'dashboard' },
      { id: 'reports', label: 'Reports', href: '/analytics/reports', icon: 'description' },
      { id: 'data-sources', label: 'Data Sources', href: '/analytics/sources', icon: 'storage' }
    ]
  }
];
```

## Accessibility Guidelines

### Keyboard Navigation

- **Tab Order**: Header → Module Switcher → Module Menu → Main Content → Footer
- **Arrow Keys**: Navigate within module menu hierarchy
- **Enter/Space**: Activate menu items and module switcher
- **Escape**: Close mobile menu or collapse expanded menu items

### ARIA Implementation

```tsx
<nav 
  className="appshell-navigation"
  role="navigation"
  aria-label="Main application navigation"
  aria-expanded={sidebarOpen}
>
  <div 
    className="module-switcher"
    role="combobox"
    aria-label="Select application module"
    aria-expanded={switcherOpen}
  >
    {/* Module switcher content */}
  </div>
  
  <ul 
    className="module-menu"
    role="tree"
    aria-label="Module navigation menu"
  >
    <li role="treeitem" aria-expanded={item.expanded}>
      <a href={item.href} aria-current={item.active ? 'page' : undefined}>
        {item.label}
      </a>
    </li>
  </ul>
</nav>
```

### Screen Reader Support

- Use semantic HTML elements (`nav`, `main`, `header`, `footer`)
- Provide clear aria-labels for navigation regions
- Announce current module and page context
- Support screen reader navigation shortcuts

## Performance Considerations

### Code Splitting by Module

```tsx
import { lazy, Suspense } from 'react';

const CRMModule = lazy(() => import('./modules/CRM'));
const AnalyticsModule = lazy(() => import('./modules/Analytics'));

const ModuleRenderer: React.FC<{ moduleId: string }> = ({ moduleId }) => (
  <Suspense fallback={<div>Loading module...</div>}>
    {moduleId === 'crm' && <CRMModule />}
    {moduleId === 'analytics' && <AnalyticsModule />}
  </Suspense>
);
```

### State Management

- Use React Context or state management library for module state
- Implement route-based state persistence
- Cache navigation state to improve performance
- Lazy load module-specific navigation data

## Design Tokens

### Spacing and Sizing

```css
:root {
  --appshell-header-height: 64px;
  --appshell-sidebar-width: 280px;
  --appshell-sidebar-collapsed-width: 64px;
  --appshell-content-padding: var(--elvt-spacing-large);
  --appshell-navigation-item-height: 48px;
}
```

### Color Theming

```css
.appshell {
  --appshell-header-bg: var(--elvt-alias-layout-surface-elevated);
  --appshell-sidebar-bg: var(--elvt-alias-layout-surface-secondary);
  --appshell-content-bg: var(--elvt-alias-layout-surface-primary);
  --appshell-border-color: var(--elvt-alias-layout-border-default);
  --appshell-text-color: var(--elvt-alias-content-text-primary);
}
```

## Best Practices

### Navigation Design

1. **Consistent Structure**: Maintain the same navigation patterns across modules
2. **Clear Hierarchy**: Use visual hierarchy to distinguish between levels
3. **Active States**: Clearly indicate current location and module
4. **Responsive Design**: Provide mobile-friendly navigation patterns

### Module Architecture

1. **Isolation**: Keep modules independent with clear boundaries
2. **Shared State**: Use global state only for truly shared data
3. **Error Boundaries**: Implement error handling for individual modules
4. **Performance**: Lazy load modules and optimize bundle sizes

### User Experience

1. **Context Preservation**: Maintain user context when switching modules
2. **Loading States**: Provide feedback during module transitions
3. **Breadcrumbs**: Show navigation path within complex hierarchies
4. **Search**: Include global search functionality when appropriate

## Related Patterns

- **[Primary Navigation](./primary-navigation.md)** - Top-level navigation patterns
- **[Data Tables](./data-tables.md)** - Content patterns within modules
- **[Card Layouts](./card-layouts.md)** - Dashboard and overview layouts

---

:::tip Module Independence
Design modules as independent applications that can be developed and deployed separately while maintaining a cohesive user experience through the shared application shell.
:::

:::warning Performance Impact
Be mindful of bundle sizes when implementing multiple modules. Use code splitting and lazy loading to maintain good performance characteristics.
:::