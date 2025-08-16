---
title: Themes
description: Learn how to implement and customize themes in ELEVATE Design System
sidebar_position: 4
---

# Themes

ELEVATE Design System includes comprehensive theming support, allowing you to create consistent visual experiences across light and dark modes, as well as custom brand themes.

## Built-in Themes

### Light Theme (Default)

The light theme provides optimal readability in bright environments with light backgrounds and dark text.

```css
/* Import light theme */
@import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
```

**Characteristics:**
- Light backgrounds (#ffffff, #f8fafc)
- Dark text for optimal contrast
- Subtle shadows for depth
- Blue primary color (#0072ff)

### Dark Theme

The dark theme reduces eye strain in low-light environments with dark backgrounds and light text.

```css
/* Import dark theme */
@import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';
```

**Characteristics:**
- Dark backgrounds (#1a1a1a, #2d2d2d)
- Light text for readability
- Enhanced shadows for depth
- Brighter accent colors

## Theme Implementation

### Automatic Theme Switching

Implement automatic theme switching based on user's system preference:

```css
/* Import both themes */
@import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
@import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';

/* Dark theme applies automatically when system is in dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}
```

### Manual Theme Toggle

Allow users to manually switch between themes:

```typescript
// React theme toggle component
import React, { useState, useEffect } from 'react';
import { ElvtButton } from '@inform-elevate/elevate-core-ui/dist/react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ElvtButton 
      tone="secondary" 
      onClick={() => setIsDark(!isDark)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀️' : '🌙'} {isDark ? 'Light' : 'Dark'}
    </ElvtButton>
  );
}
```

### CSS Implementation

```css
/* Theme-aware CSS using data attributes */
:root[data-theme="light"] {
  --theme-background: #ffffff;
  --theme-text: #1a1a1a;
  --theme-border: #e2e8f0;
}

:root[data-theme="dark"] {
  --theme-background: #1a1a1a;
  --theme-text: #ffffff;
  --theme-border: #374151;
}

.my-component {
  background-color: var(--theme-background);
  color: var(--theme-text);
  border-color: var(--theme-border);
}
```

## Custom Themes

### Brand Theme Creation

Create a custom theme that reflects your brand identity:

```css
/* custom-brand-theme.css */
:root {
  /* Primary brand colors */
  --elvt-color-primary-50: #eff6ff;
  --elvt-color-primary-100: #dbeafe;
  --elvt-color-primary-200: #bfdbfe;
  --elvt-color-primary-300: #93c5fd;
  --elvt-color-primary-400: #60a5fa;
  --elvt-color-primary-500: #6f42c1;  /* Your brand primary */
  --elvt-color-primary-600: #5a2d91;
  --elvt-color-primary-700: #4c1d95;
  --elvt-color-primary-800: #3730a3;
  --elvt-color-primary-900: #312e81;

  /* Custom typography */
  --elvt-font-family-primary: 'Your Brand Font', 'Inter', system-ui, sans-serif;
  --elvt-font-family-heading: 'Your Brand Display', 'Inter', system-ui, sans-serif;

  /* Custom spacing (if needed) */
  --elvt-spacing-brand: 1.25rem; /* 20px - brand-specific spacing */

  /* Custom shadows */
  --elvt-shadow-brand: 0 4px 20px rgba(111, 66, 193, 0.15);
}
```

### Multi-Brand Support

Support multiple brand themes in the same application:

```css
/* brand-a-theme.css */
.theme-brand-a {
  --elvt-color-primary-500: #ff6b35;
  --elvt-color-primary-600: #e55a2b;
  --elvt-font-family-primary: 'Brand A Font', system-ui, sans-serif;
}

/* brand-b-theme.css */
.theme-brand-b {
  --elvt-color-primary-500: #00d9ff;
  --elvt-color-primary-600: #00bfe6;
  --elvt-font-family-primary: 'Brand B Font', system-ui, sans-serif;
}
```

```tsx
// Apply brand theme dynamically
function BrandThemeProvider({ brandId, children }) {
  return (
    <div className={`theme-${brandId}`}>
      {children}
    </div>
  );
}

// Usage
<BrandThemeProvider brandId="brand-a">
  <MyApp />
</BrandThemeProvider>
```

## Advanced Theming

### CSS Custom Properties Strategy

ELEVATE uses CSS custom properties (variables) for maximum flexibility:

```css
/* Design token structure */
:root {
  /* Primitive tokens - base values */
  --elvt-primitives-color-blue-500: #0072ff;
  --elvt-primitives-color-gray-50: #f9fafb;

  /* Semantic tokens - contextual meaning */
  --elvt-color-primary: var(--elvt-primitives-color-blue-500);
  --elvt-color-background: var(--elvt-primitives-color-gray-50);

  /* Component tokens - specific to components */
  --elvt-button-primary-background: var(--elvt-color-primary);
  --elvt-button-primary-text: #ffffff;
}
```

### Theme Composition

Combine multiple theme layers for complex scenarios:

```css
/* Base layer - foundational tokens */
@import '@inform-elevate/elevate-core-ui/dist/elevate.css';

/* Theme layer - light/dark variations */
@import '@inform-elevate/elevate-core-ui/dist/themes/light.css';

/* Brand layer - brand-specific overrides */
@import './brand-theme.css';

/* Application layer - app-specific customizations */
@import './app-theme.css';
```

### Dynamic Theme Loading

Load themes dynamically based on user preferences:

```typescript
// Dynamic theme loader
class ThemeManager {
  private currentTheme: string = 'light';

  async loadTheme(themeName: string) {
    // Remove current theme
    const existingLink = document.querySelector(`link[data-theme]`);
    if (existingLink) {
      existingLink.remove();
    }

    // Load new theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${themeName}.css`;
    link.setAttribute('data-theme', themeName);
    
    document.head.appendChild(link);
    this.currentTheme = themeName;

    // Notify components of theme change
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: themeName } 
    }));
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}

// Usage
const themeManager = new ThemeManager();
await themeManager.loadTheme('dark');
```

## Theme Testing

### Visual Regression Testing

Test themes across components to ensure consistency:

```javascript
// Jest + Puppeteer theme testing
describe('Theme Testing', () => {
  test('Light theme renders correctly', async () => {
    await page.addStyleTag({ path: 'themes/light.css' });
    await page.screenshot({ path: 'screenshots/light-theme.png' });
  });

  test('Dark theme renders correctly', async () => {
    await page.addStyleTag({ path: 'themes/dark.css' });
    await page.screenshot({ path: 'screenshots/dark-theme.png' });
  });
});
```

### Accessibility Testing

Ensure themes meet accessibility standards:

```javascript
// Contrast ratio testing
const contrastRatio = calculateContrastRatio(
  getComputedStyle(element).color,
  getComputedStyle(element).backgroundColor
);

expect(contrastRatio).toBeGreaterThan(4.5); // WCAG AA standard
```

## Best Practices

### Theme Design Guidelines

#### Color Strategy
- **Start with primitives** - Define base color values first
- **Create semantic mappings** - Map colors to contextual meanings
- **Test accessibility** - Ensure sufficient contrast ratios
- **Plan for dark mode** - Consider color inversions and adjustments

#### Typography Consistency
- **Limit font families** - Use 1-2 font families maximum
- **Maintain hierarchy** - Keep type scales consistent across themes
- **Consider performance** - Use system fonts as fallbacks

#### Component Adaptations
- **Focus states** - Ensure focus indicators work in all themes
- **Interactive states** - Test hover, active, and disabled states
- **Layering** - Ensure proper visual hierarchy with backgrounds

### Performance Considerations

#### CSS Loading Strategy
```css
/* Critical CSS - inline minimal theme tokens */
:root {
  --elvt-color-primary: #0072ff;
  --elvt-color-background: #ffffff;
  --elvt-color-text: #1a1a1a;
}

/* Non-critical - load asynchronously */
<link rel="stylesheet" href="themes/complete-theme.css" media="print" onload="this.media='all'">
```

#### Bundle Optimization
- **Conditional loading** - Only load themes that will be used
- **CSS purging** - Remove unused theme styles in production
- **Compression** - Use gzip/brotli for theme stylesheets

## Theme Documentation

### Design Tokens Reference

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|--------|
| `--elvt-color-primary-500` | `#0072ff` | `#60a5fa` | Primary actions, links |
| `--elvt-color-background` | `#ffffff` | `#1a1a1a` | Page backgrounds |
| `--elvt-color-surface` | `#f8fafc` | `#2d2d2d` | Card, panel backgrounds |
| `--elvt-color-text` | `#1a1a1a` | `#ffffff` | Primary text content |

### Component Theme Variations

Each component automatically adapts to the active theme through design token inheritance:

- **Buttons** - Background, text, and border colors adapt
- **Inputs** - Border, background, and placeholder colors adjust  
- **Cards** - Surface colors and shadows change appropriately
- **Navigation** - Active states and backgrounds adapt

## Resources

- **[Theme Builder Tool](https://themes.elevate-design.com)** - Interactive theme customization
- **[Figma Theme Plugin](https://figma.com/elevate-themes)** - Design-to-code theme sync
- **[Theme Examples](https://github.com/inform-elevate/theme-examples)** - Sample implementations

---

:::tip Performance Tip
Use CSS custom properties at the root level and let components inherit values for optimal performance and maintainability.
:::

:::warning Accessibility
Always test theme combinations for sufficient color contrast. Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify compliance.
:::