# INFORM ELEVATE Design System Theme

A custom Docusaurus theme built for INFORM GmbH's ELEVATE Design System documentation.

## Overview

This theme extends the Docusaurus Classic theme with:

- **INFORM Branding**: Custom logo, colors, and typography
- **ELEVATE Integration**: Full design token integration and component library
- **Material Design Icons**: 7,200+ icons via Iconify
- **Dark Mode Support**: Comprehensive light/dark theme switching
- **Responsive Design**: Mobile-first approach with proper breakpoints

## Theme Features

### 🎨 Design System Integration
- ELEVATE Core UI components and tokens
- Custom color palette with INFORM brand colors
- Typography using Inter font family with ELEVATE type scales

### 🌙 Dark Mode
- Automatic theme switching based on user preference
- ELEVATE-specific dark mode color tokens
- Consistent styling across all components

### 📱 Responsive Design  
- Mobile-first navbar that collapses appropriately
- Responsive typography and spacing
- Optimized for all screen sizes

### 🔧 Custom Components
- Custom Logo component with INFORM branding
- Enhanced navigation with proper accessibility
- Icon support throughout documentation

## Theme Structure

```
src/theme/
├── index.js                 # Theme entry point
├── Root.tsx                 # Global theme wrapper
├── Logo/
│   └── index.tsx           # Custom INFORM logo component
└── MDXComponents.js        # MDX component extensions

src/css/
└── custom.css              # ELEVATE theme styles

theme.json                  # Theme manifest
```

## Customization

### Colors
The theme uses ELEVATE design tokens for consistent coloring:

- Primary: `--elvt-primitives-color-blue-500` (INFORM Blue)
- Success: `--elvt-primitives-color-green-500`
- Warning: `--elvt-primitives-color-yellow-500`
- Danger: `--elvt-primitives-color-red-500`

### Typography
- **Font Family**: Inter (via ELEVATE tokens)
- **Headings**: Bold (700 weight) for all levels
- **Body**: ELEVATE content font sizes and line heights

### Components
All swizzled components maintain INFORM branding while extending Docusaurus functionality.

## Usage

This theme is specifically designed for the ELEVATE Design System documentation and includes INFORM GmbH-specific branding and customizations.

## Copyright

© 2025 INFORM GmbH. All rights reserved.