# PageCardGrid Component

A dynamic, runtime React component for Docusaurus that automatically renders page cards from MDX frontmatter. Perfect for creating overview pages, pattern libraries, and categorized content collections.

## Features

- **🔄 Runtime Dynamic**: No build step required - automatically picks up new pages
- **📊 Smart Grouping**: Group pages by any frontmatter field (`group`, `category`, `type`, etc.)
- **🏷️ Tag Filtering**: Include/exclude pages based on frontmatter tags
- **🎯 Flexible Filtering**: Filter by any frontmatter field
- **📱 Responsive Grid**: CSS Grid with customizable columns
- **🎨 ELEVATE Integration**: Uses authentic ELEVATE components and design tokens
- **♿ Accessible**: Full keyboard navigation and screen reader support

## Basic Usage

```jsx
// Simple component listing
<PageCardGrid basePath="/components/" />

// Grouped by category with custom icons
<PageCardGrid 
  basePath="/components/" 
  groupBy="group" 
  showGroups={true}
  icons={{
    "custom-component": "M12 2l3.09 6.26L22 9.27..."
  }}
/>

// Filtered by tags
<PageCardGrid 
  basePath="/patterns/" 
  includeTags={["layout", "navigation"]}
  excludeTags={["deprecated"]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `basePath` | `string` | **Required** | Base path to scan for pages (e.g., `/components/`, `/patterns/`) |
| `groupBy` | `string` | `"group"` | Group pages by this frontmatter field |
| `filterBy` | `string` | `undefined` | Only show pages that have this frontmatter field |
| `includeTags` | `string[]` | `undefined` | Show only pages with these tags |
| `excludeTags` | `string[]` | `undefined` | Hide pages with these tags |
| `sortBy` | `string` | `"sidebar_position"` | Sort field (`"title"`, `"sidebar_position"`, or custom field) |
| `icons` | `Record<string, string>` | `{}` | Custom icons (SVG paths) for specific pages |
| `showGroups` | `boolean` | `true` | Show group headers |
| `columns` | `string` | `"repeat(auto-fit, minmax(300px, 1fr))"` | CSS Grid template columns |

## Frontmatter Structure

Add these fields to your MDX frontmatter to enable grouping and filtering:

```yaml
---
title: Button
description: Interactive button component
sidebar_position: 1
group: Form Elements           # For grouping
tags: [interactive, form]      # For tag filtering
category: UI Components        # Alternative grouping field
status: stable                 # For status filtering
---
```

## Examples

### Components Overview
```jsx
<PageCardGrid 
  basePath="/components/" 
  groupBy="group" 
  showGroups={true} 
/>
```

### Patterns by Category
```jsx
<PageCardGrid 
  basePath="/patterns/" 
  groupBy="category" 
  sortBy="title"
  columns="repeat(auto-fit, minmax(250px, 1fr))"
/>
```

### Form Components Only
```jsx
<PageCardGrid 
  basePath="/components/" 
  includeTags={["form"]}
  showGroups={false}
/>
```

### Stable Components (No Beta)
```jsx
<PageCardGrid 
  basePath="/components/" 
  excludeTags={["beta", "experimental"]}
  groupBy="group"
/>
```

### Custom Icon Example
```jsx
<PageCardGrid 
  basePath="/components/" 
  icons={{
    "my-component": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..."
  }}
/>
```

## Built-in Icons

The component includes 30+ built-in icons for common component types:

- **Form Elements**: button, input, checkbox, radio, select, switch, textarea
- **Layout Elements**: card, divider, drawer
- **Navigation**: breadcrumb, menu, tab
- **Feedback**: notification, toast, tooltip, progress
- **Data Display**: table, charts, badge, chip, avatar

Custom icons override built-in ones. Use the `slug` (URL segment) as the key.

## Recommended Frontmatter Groups

### For Components
- **Form Elements**: button, input, checkbox, radio, select, etc.
- **Layout Elements**: card, stack, divider, container, etc.
- **Navigation Elements**: breadcrumb, menu, tab, link, etc.
- **Feedback Elements**: notification, toast, tooltip, progress, etc.
- **Data Display Elements**: table, chart, badge, avatar, etc.

### For Patterns
- **Page Layouts**: dashboard, landing, settings, etc.
- **Navigation Patterns**: sidebar, header, breadcrumb, etc.
- **Form Patterns**: login, checkout, survey, etc.
- **Content Patterns**: article, gallery, timeline, etc.

## Performance

- **Runtime**: Processes pages at render time using Docusaurus global data
- **Caching**: Leverages React useMemo for optimal re-renders
- **Bundle Size**: ~3KB gzipped (excluding ELEVATE components)
- **Accessibility**: Full keyboard and screen reader support

## Migration from Static Lists

Replace static component lists with dynamic ones:

```jsx
// Before: Static cards
<elvt-card>
  <h3>Button</h3>
  <p>Button component</p>
</elvt-card>

// After: Dynamic cards
<PageCardGrid basePath="/components/" />
```

Benefits:
- Automatically includes new components
- Consistent styling and behavior
- Reduced maintenance overhead
- Better search and filtering capabilities