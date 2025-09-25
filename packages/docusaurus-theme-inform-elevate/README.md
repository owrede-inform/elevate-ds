# @inform/docusaurus-theme-elevate

A custom Docusaurus theme that integrates the INFORM ELEVATE Design System with comprehensive branding and component support.

## Features

- 🎨 **ELEVATE Design System Integration** - Full design token support and component library
- 🌙 **Dark Mode Support** - Comprehensive light/dark theme switching
- 🔤 **Material Design Icons** - 7,200+ icons via Iconify integration
- 📱 **Responsive Design** - Mobile-first approach with proper breakpoints
- 🏢 **INFORM Branding** - Professional INFORM GmbH branding throughout
- ♿ **Accessibility** - WCAG compliant with proper semantic markup
- ⚡ **Performance** - Optimized for fast loading and smooth interactions

## Installation

```bash
pnpm add @inform/docusaurus-theme-elevate
```

## Usage

Add the theme to your `docusaurus.config.js`:

```javascript
export default {
  themes: ['@inform/docusaurus-theme-elevate'],
  
  themeConfig: {
    // Standard Docusaurus theme config
    navbar: {
      title: 'Your Project',
      logo: {
        alt: 'INFORM Logo',
        src: 'img/inform-brand.svg',
        srcDark: 'img/inform-brand-dark.svg',
      },
    },
    // ... other config
  },
};
```

## Theme Options

Configure the theme with optional settings:

```javascript
export default {
  themes: [
    [
      '@inform/docusaurus-theme-elevate',
      {
        enableElevateDesignSystem: true,
        enableMDIIcons: true,
        elevateThemeVariant: 'default', // 'default' | 'compact' | 'minimal'
        informBranding: {
          showLogo: true,
          organizationName: 'INFORM GmbH',
          copyrightText: 'Custom copyright text',
        },
      },
    ],
  ],
};
```

## Icon Usage

The theme includes Material Design Icons via Iconify. Use icons in your MDX files:

```jsx
<IIcon icon="mdi:check-circle" height="24" style={{color: 'green'}} />
<IIcon icon="mdi:github" height="20" />
<IIcon icon="mdi:react" height="20" style={{color: '#61dafb'}} />
```

Browse available icons at [Iconify Icon Explorer](https://icon-sets.iconify.design/mdi/).

## ELEVATE Components

The theme automatically imports ELEVATE Core UI styles and design tokens. All ELEVATE design tokens are available as CSS custom properties:

```css
.my-component {
  color: var(--elvt-primitives-color-blue-500);
  background: var(--elvt-primitives-color-gray-50);
  padding: var(--sl-spacing-medium);
  border-radius: var(--sl-border-radius-medium);
}
```

## Dark Mode

The theme automatically handles dark mode switching with proper ELEVATE color tokens:

- Light mode uses standard ELEVATE colors
- Dark mode uses darker backgrounds with lighter text colors
- All components automatically adapt to the current theme

## Customization

### Custom CSS

Add custom styling by importing additional CSS after the theme:

```javascript
// docusaurus.config.js
export default {
  themes: ['@inform/docusaurus-theme-elevate'],
  stylesheets: [
    '/css/custom.css', // Your custom styles
  ],
};
```

### Component Swizzling

You can swizzle any theme component for further customization:

```bash
pnpm swizzle @inform/docusaurus-theme-elevate ComponentName
```

## Requirements

- Node.js >= 18.0
- Docusaurus >= 3.8.0
- React >= 18.0

## License

MIT License - Copyright © 2025 INFORM GmbH

## Support

For issues and questions:

- 📋 [GitHub Issues](https://github.com/inform-elevate/docusaurus-theme-elevate/issues)
- 📧 [Contact INFORM](https://inform.com/contact)
- 📚 [ELEVATE Documentation](https://elevate-ds.inform.com)

---

Built with ❤️ by INFORM GmbH