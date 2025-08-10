# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**elevate-ds** is a design system documentation site built with Docusaurus. This project serves as a comprehensive documentation platform for design system components, patterns, and guidelines.

## Technology Stack

- **Framework**: Docusaurus 3.8.1 (React-based static site generator)
- **Language**: TypeScript
- **Package Manager**: npm
- **Node Version**: >=18.0

## Development Commands

```bash
# Start development server (with hot reloading)
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve

# Type checking
npm run typecheck

# Clear Docusaurus cache
npm run clear

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
elevate-ds/
├── docs/                    # Documentation content (Markdown/MDX)
│   ├── intro.md
│   ├── tutorial-basics/
│   └── tutorial-extras/
├── blog/                    # Blog posts
├── src/
│   ├── components/          # React components
│   │   └── HomepageFeatures/
│   ├── css/                 # Global styles
│   └── pages/               # Custom pages
├── static/                  # Static assets (images, files)
├── docusaurus.config.ts     # Main configuration
├── sidebars.ts             # Sidebar navigation config
├── package.json
└── tsconfig.json
```

## Key Configuration Files

- **`docusaurus.config.ts`**: Main Docusaurus configuration (site metadata, plugins, themes)
- **`sidebars.ts`**: Controls sidebar navigation structure
- **`src/pages/`**: Custom React pages (homepage, etc.)
- **`docs/`**: Main documentation content in Markdown/MDX format

## Content Management

- **Documentation**: Add `.md` or `.mdx` files to the `docs/` directory
- **Blog Posts**: Add files to `blog/` directory with date prefix (YYYY-MM-DD-title.md)
- **Navigation**: Update `sidebars.ts` to control document organization
- **Homepage**: Customize `src/pages/index.tsx` and `src/components/HomepageFeatures/`

## Development Workflow

1. **Content Creation**: Add/edit Markdown files in `docs/` or `blog/`
2. **Component Development**: Create React components in `src/components/`
3. **Styling**: Use CSS modules or edit `src/css/custom.css`
4. **Configuration**: Modify `docusaurus.config.ts` for site-wide changes
5. **Testing**: Use `npm run typecheck` for TypeScript validation
6. **Preview**: Use `npm start` for live development server

## Design System Integration

The site is fully integrated with the ELEVATE Core UI library:

### ELEVATE Core UI Integration
- **Library**: `@inform-elevate/elevate-core-ui` (v0.0.27-alpha)
- **Components**: 45+ React components available via custom wrappers
- **Styling**: ELEVATE design tokens and themes applied throughout
- **Typography**: Inter font family with ELEVATE type scales
- **Colors**: ELEVATE brand colors and semantic color palette

### Custom Components for Documentation

**ComponentShowcase** (`src/components/ComponentShowcase/`)
- Interactive component previews with live code examples
- Uses `docusaurus-plugin-code-preview` for syntax highlighting
- ELEVATE-themed styling with light/dark mode support

**DesignTokenTable** (`src/components/DesignTokenTable/`)
- Visual tables for design token documentation
- Supports color, spacing, typography, and custom token types
- Automatic preview generation with ELEVATE styling

**ELEVATE Component Wrappers**
- `ElvtButton`, `ElvtInput`, `ElvtCard` - React wrappers for ELEVATE components
- TypeScript interfaces for proper prop typing
- Ready for use in documentation pages

### Theme Customization
- **Custom CSS**: Fully themed with ELEVATE design tokens
- **Root Theme**: `src/theme/Root.tsx` initializes ELEVATE custom elements
- **Navigation**: Updated with design system specific navigation structure
- **Typography**: ELEVATE type scale and Inter font integration

### Available Plugins
- **Code Preview**: `docusaurus-plugin-code-preview` for interactive examples
- **Custom Elements**: ELEVATE web components auto-registered

## Usage Examples

### Component Documentation Pattern
```tsx
import ComponentShowcase from '@site/src/components/ComponentShowcase';
import ElvtButton from '@site/src/components/ElvtButton';

<ComponentShowcase
  title="Primary Button"
  description="Use for main actions and primary CTAs"
  code={`<ElvtButton variant="primary" size="medium">
  Click me
</ElvtButton>`}
>
  <ElvtButton variant="primary" size="medium">
    Click me
  </ElvtButton>
</ComponentShowcase>
```

### Design Token Documentation Pattern
```tsx
import DesignTokenTable from '@site/src/components/DesignTokenTable';

<DesignTokenTable
  title="Primary Colors"
  type="color"
  tokens={[
    {
      name: 'Primary 500',
      value: '#0072ff',
      cssVariable: '--elvt-primitives-color-blue-500',
      description: 'Main brand color for primary actions'
    }
  ]}
/>
```
- Always make sure that you to everything the docusaurus-way. Consult the manual first before changing things!
- Never force CSS changes with !important unless the documentation requires that. Remove recently added !important statements. Never work around with shortcuts. Try harder to research in the Docusaurus documenation or community how to achieve a goal (maybe even creating a custom component).