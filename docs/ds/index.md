---
title: Documentation Components
unlisted: true
---

# Documentation Components

This section documents custom components, tools, and utilities built specifically for this ELEVATE Design System documentation site. These are **not** part of the ELEVATE Core UI library, but are custom React components created to enhance the documentation experience.

## Overview

The documentation site includes custom components that help visualize, demonstrate, and document the ELEVATE design system:

- **Interactive Components**: Tools for exploring design tokens and patterns
- **Documentation Utilities**: Helper components for consistent documentation
- **Visualization Tools**: Components for displaying design system elements

## Available Components

### Data Visualization
- **[ColorRamp](./components/colorramp/)** - Dynamic color token display with pattern matching

### Documentation Helpers
- **ComponentShowcase** - Interactive component previews with code examples
- **DesignTokenTable** - Visual tables for design token documentation

## Component Categories

### 🎨 **Design Token Tools**
Components for visualizing and documenting design tokens:
- ColorRamp for color token exploration
- Future: SpacingRamp, TypographyScale, etc.

### 📋 **Documentation Utilities**
Helper components for consistent documentation:
- ComponentShowcase for interactive examples
- DesignTokenTable for token documentation
- Future: APITable, PropsTable, etc.

### 🔧 **Development Tools**
Tools for component development and testing:
- Future: ComponentTester, DesignSystemValidator, etc.

## Usage Guidelines

### Import Pattern
```tsx
import ComponentName from '@site/src/components/ComponentName';
```

### Documentation Pattern
Each DS component should be documented with:
- Purpose and use cases
- Complete API reference
- Interactive examples
- Code snippets
- Best practices

### Development Guidelines
1. **Purpose**: Build components that enhance ELEVATE documentation
2. **Scope**: Focus on documentation site functionality only
3. **Naming**: Use clear, descriptive component names
4. **Documentation**: Provide comprehensive usage examples
5. **Integration**: Follow Docusaurus patterns and conventions

---

**Note**: These components are specific to this documentation site and are not included in the ELEVATE Core UI library. For ELEVATE Core UI components, see the [Components section](../components/).