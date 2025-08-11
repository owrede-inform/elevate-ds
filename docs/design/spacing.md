---
title: Spacing
description: Consistent spacing system for layouts, components, and content organization
sidebar_position: 4
---

# Spacing System

Consistent spacing creates visual rhythm, improves readability, and helps users understand relationships between interface elements. ELEVATE's spacing system provides a mathematical foundation for all layout decisions.

## Spacing Philosophy

### Design Principles
- **Mathematical Precision** - 8px base unit for consistent rhythm
- **Visual Hierarchy** - Spacing reinforces content relationships
- **Scalable System** - Works across all screen sizes and contexts
- **Cognitive Load** - Appropriate spacing reduces mental effort

### Spacing Functions
- **Grouping** - Related elements stay close together
- **Separation** - Unrelated elements have more space between them
- **Emphasis** - Important elements get more surrounding space
- **Rhythm** - Consistent spacing creates visual flow

## Base Unit System

### 8px Base Unit
Our spacing system is built on an 8-pixel base unit for mathematical consistency.

**Why 8px:**
- **Screen Compatibility** - Divides evenly across common screen densities
- **Design Tool Alignment** - Works well with popular design software
- **Component Scalability** - Easy to calculate proportional spacing
- **Accessibility** - Provides adequate touch target spacing

### Spacing Scale
```css
/* Spacing scale based on 8px unit */
--elvt-spacing-0: 0px;      /* No space */
--elvt-spacing-1: 4px;      /* 0.25rem - Minimal spacing */
--elvt-spacing-2: 8px;      /* 0.5rem - Base unit */
--elvt-spacing-3: 12px;     /* 0.75rem - Small spacing */
--elvt-spacing-4: 16px;     /* 1rem - Standard spacing */
--elvt-spacing-5: 20px;     /* 1.25rem - Medium spacing */
--elvt-spacing-6: 24px;     /* 1.5rem - Large spacing */
--elvt-spacing-8: 32px;     /* 2rem - Extra large */
--elvt-spacing-10: 40px;    /* 2.5rem - Section spacing */
--elvt-spacing-12: 48px;    /* 3rem - Component spacing */
--elvt-spacing-16: 64px;    /* 4rem - Layout spacing */
--elvt-spacing-20: 80px;    /* 5rem - Large sections */
--elvt-spacing-24: 96px;    /* 6rem - Page sections */
--elvt-spacing-32: 128px;   /* 8rem - Major sections */
```

### Semantic Spacing Tokens
Meaningful names for common spacing use cases.

```css
/* Component spacing */
--elvt-spacing-component-padding-sm: var(--elvt-spacing-3);   /* 12px */
--elvt-spacing-component-padding: var(--elvt-spacing-4);      /* 16px */
--elvt-spacing-component-padding-lg: var(--elvt-spacing-6);   /* 24px */

--elvt-spacing-component-gap-sm: var(--elvt-spacing-2);       /* 8px */
--elvt-spacing-component-gap: var(--elvt-spacing-4);          /* 16px */
--elvt-spacing-component-gap-lg: var(--elvt-spacing-6);       /* 24px */

/* Layout spacing */
--elvt-spacing-layout-section: var(--elvt-spacing-16);        /* 64px */
--elvt-spacing-layout-container: var(--elvt-spacing-6);       /* 24px */
--elvt-spacing-layout-gutter: var(--elvt-spacing-4);          /* 16px */

/* Content spacing */
--elvt-spacing-content-block: var(--elvt-spacing-6);          /* 24px */
--elvt-spacing-content-inline: var(--elvt-spacing-4);         /* 16px */
--elvt-spacing-content-tight: var(--elvt-spacing-2);          /* 8px */
```

## Component Spacing

### Internal Component Spacing
Consistent spacing within components creates predictable interfaces.

```css
/* Button padding */
.elvt-button {
  padding: var(--elvt-spacing-3) var(--elvt-spacing-4); /* 12px 16px */
}

.elvt-button-sm {
  padding: var(--elvt-spacing-2) var(--elvt-spacing-3); /* 8px 12px */
}

.elvt-button-lg {
  padding: var(--elvt-spacing-4) var(--elvt-spacing-6); /* 16px 24px */
}

/* Card padding */
.elvt-card {
  padding: var(--elvt-spacing-6); /* 24px all sides */
}

.elvt-card-compact {
  padding: var(--elvt-spacing-4); /* 16px all sides */
}

/* Input field spacing */
.elvt-input {
  padding: var(--elvt-spacing-3) var(--elvt-spacing-4); /* 12px 16px */
  margin-bottom: var(--elvt-spacing-4); /* 16px bottom margin */
}
```

### Component Relationships
Spacing between components communicates their relationships.

```css
/* Related components - closer spacing */
.elvt-form-group {
  margin-bottom: var(--elvt-spacing-4); /* 16px */
}

.elvt-form-group label + input {
  margin-top: var(--elvt-spacing-2); /* 8px */
}

/* Component sections - medium spacing */
.elvt-section {
  margin-bottom: var(--elvt-spacing-8); /* 32px */
}

/* Major sections - larger spacing */
.elvt-page-section {
  margin-bottom: var(--elvt-spacing-16); /* 64px */
}
```

## Layout Spacing

### Grid Spacing
Consistent spacing in grid layouts maintains visual rhythm.

```css
/* Grid container spacing */
.elvt-grid {
  display: grid;
  gap: var(--elvt-spacing-6); /* 24px between grid items */
}

.elvt-grid-tight {
  gap: var(--elvt-spacing-4); /* 16px for compact layouts */
}

.elvt-grid-loose {
  gap: var(--elvt-spacing-8); /* 32px for spacious layouts */
}

/* Container padding */
.elvt-container {
  padding: 0 var(--elvt-spacing-6); /* 24px horizontal padding */
}

@media (max-width: 768px) {
  .elvt-container {
    padding: 0 var(--elvt-spacing-4); /* 16px on mobile */
  }
}
```

### Page Layout Spacing
Macro-level spacing for page structure and content areas.

```css
/* Page margins */
.elvt-page {
  margin: var(--elvt-spacing-8) auto; /* 32px top/bottom, centered */
  max-width: 1200px;
}

/* Section spacing */
.elvt-hero {
  padding: var(--elvt-spacing-20) 0; /* 80px top/bottom */
}

.elvt-content-section {
  padding: var(--elvt-spacing-16) 0; /* 64px top/bottom */
}

.elvt-footer {
  margin-top: var(--elvt-spacing-24); /* 96px separation */
  padding: var(--elvt-spacing-16) 0; /* 64px top/bottom */
}
```

## Content Spacing

### Typography Spacing
Spacing around text elements creates readable, scannable content.

```css
/* Heading spacing */
h1, h2, h3, h4, h5, h6 {
  margin-top: var(--elvt-spacing-8); /* 32px above headings */
  margin-bottom: var(--elvt-spacing-4); /* 16px below headings */
}

/* First heading has no top margin */
h1:first-child,
h2:first-child,
h3:first-child {
  margin-top: 0;
}

/* Paragraph spacing */
p {
  margin-bottom: var(--elvt-spacing-4); /* 16px between paragraphs */
}

/* List spacing */
ul, ol {
  margin-bottom: var(--elvt-spacing-4); /* 16px below lists */
  padding-left: var(--elvt-spacing-6); /* 24px indentation */
}

li {
  margin-bottom: var(--elvt-spacing-1); /* 4px between list items */
}

/* Block element spacing */
blockquote,
pre,
figure {
  margin: var(--elvt-spacing-6) 0; /* 24px above and below */
}
```

### Content Grouping
Use spacing to create logical content groups and improve scannability.

```css
/* Content blocks */
.elvt-content-block {
  margin-bottom: var(--elvt-spacing-8); /* 32px between blocks */
}

.elvt-content-block:last-child {
  margin-bottom: 0; /* No margin on last block */
}

/* Inline content spacing */
.elvt-inline-group > * + * {
  margin-left: var(--elvt-spacing-2); /* 8px between inline elements */
}

/* Stack spacing (vertical) */
.elvt-stack > * + * {
  margin-top: var(--elvt-spacing-4); /* 16px between stacked elements */
}
```

## Responsive Spacing

### Breakpoint-Based Spacing
Spacing adapts to screen size for optimal use of available space.

```css
/* Base spacing (mobile) */
.elvt-responsive-spacing {
  padding: var(--elvt-spacing-4); /* 16px */
  margin-bottom: var(--elvt-spacing-6); /* 24px */
}

/* Tablet spacing */
@media (min-width: 768px) {
  .elvt-responsive-spacing {
    padding: var(--elvt-spacing-6); /* 24px */
    margin-bottom: var(--elvt-spacing-8); /* 32px */
  }
}

/* Desktop spacing */
@media (min-width: 1024px) {
  .elvt-responsive-spacing {
    padding: var(--elvt-spacing-8); /* 32px */
    margin-bottom: var(--elvt-spacing-12); /* 48px */
  }
}
```

### Container Spacing
Different spacing strategies for different container contexts.

```css
/* Full-width containers */
.elvt-container-full {
  padding: 0 var(--elvt-spacing-4); /* 16px mobile */
}

@media (min-width: 768px) {
  .elvt-container-full {
    padding: 0 var(--elvt-spacing-6); /* 24px tablet */
  }
}

@media (min-width: 1024px) {
  .elvt-container-full {
    padding: 0 var(--elvt-spacing-8); /* 32px desktop */
  }
}

/* Content containers */
.elvt-container-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--elvt-spacing-4); /* Consistent padding */
}
```

## Accessibility Considerations

### Touch Target Spacing
Adequate spacing around interactive elements improves usability.

```css
/* Minimum touch target spacing */
.elvt-touch-target {
  min-height: 44px; /* iOS minimum */
  min-width: 44px;
  padding: var(--elvt-spacing-2); /* 8px minimum padding */
  margin: var(--elvt-spacing-1); /* 4px minimum margin */
}

/* Button group spacing */
.elvt-button-group .elvt-button + .elvt-button {
  margin-left: var(--elvt-spacing-2); /* 8px between buttons */
}

/* Vertical button spacing */
.elvt-button-stack .elvt-button + .elvt-button {
  margin-top: var(--elvt-spacing-2); /* 8px between stacked buttons */
}
```

### Focus and Visual Clarity
Spacing supports clear focus indicators and visual hierarchy.

```css
/* Focus spacing */
.elvt-focusable:focus {
  outline: 2px solid var(--elvt-color-primary);
  outline-offset: var(--elvt-spacing-1); /* 4px offset */
}

/* Visual separation */
.elvt-section + .elvt-section {
  border-top: 1px solid var(--elvt-color-border);
  padding-top: var(--elvt-spacing-8); /* 32px above border */
}
```

## Implementation Guidelines

### Using Spacing Tokens
Always use spacing tokens instead of hard-coded values.

```css
/* ✅ Good - Spacing tokens */
.component {
  padding: var(--elvt-spacing-4);
  margin-bottom: var(--elvt-spacing-6);
  gap: var(--elvt-spacing-2);
}

/* ❌ Avoid - Hard-coded spacing */
.component {
  padding: 16px;
  margin-bottom: 24px;
  gap: 8px;
}
```

### Spacing Token Selection
Choose appropriate spacing tokens based on context and relationships.

```css
/* Small spacing for closely related elements */
.elvt-form-field label + input {
  margin-top: var(--elvt-spacing-1); /* 4px */
}

/* Medium spacing for related components */
.elvt-form-section {
  margin-bottom: var(--elvt-spacing-6); /* 24px */
}

/* Large spacing for distinct sections */
.elvt-page-section {
  margin-bottom: var(--elvt-spacing-16); /* 64px */
}
```

### Custom Spacing Extensions
When creating custom spacing, follow the 8px base unit system.

```css
/* Custom spacing following 8px system */
:root {
  --elvt-spacing-custom-sm: 6px;   /* 0.75 × 8px */
  --elvt-spacing-custom-md: 14px;  /* 1.75 × 8px */
  --elvt-spacing-custom-lg: 56px;  /* 7 × 8px */
}
```

## Spacing Examples

### Component Composition
```html
<div class="elvt-card" style="padding: var(--elvt-spacing-6);">
  <h3 style="margin-bottom: var(--elvt-spacing-4);">Card Title</h3>
  <p style="margin-bottom: var(--elvt-spacing-4);">Card content text.</p>
  <div class="elvt-button-group" style="gap: var(--elvt-spacing-2);">
    <button class="elvt-button">Primary</button>
    <button class="elvt-button">Secondary</button>
  </div>
</div>
```

### Layout Structure
```html
<main class="elvt-page">
  <section class="elvt-hero" style="padding: var(--elvt-spacing-20) 0;">
    <h1>Page Title</h1>
  </section>
  
  <section class="elvt-content" style="padding: var(--elvt-spacing-16) 0;">
    <div class="elvt-container" style="padding: 0 var(--elvt-spacing-6);">
      <div class="elvt-grid" style="gap: var(--elvt-spacing-8);">
        <!-- Grid content -->
      </div>
    </div>
  </section>
</main>
```

### Content Spacing
```html
<article class="elvt-article">
  <h2 style="margin-bottom: var(--elvt-spacing-4);">Section Title</h2>
  <p style="margin-bottom: var(--elvt-spacing-4);">First paragraph.</p>
  <p style="margin-bottom: var(--elvt-spacing-6);">Second paragraph with more space below.</p>
  
  <h3 style="margin-top: var(--elvt-spacing-8); margin-bottom: var(--elvt-spacing-4);">Subsection</h3>
  <ul style="margin-bottom: var(--elvt-spacing-4); padding-left: var(--elvt-spacing-6);">
    <li style="margin-bottom: var(--elvt-spacing-1);">List item</li>
    <li>Another item</li>
  </ul>
</article>
```

---

:::info Spacing Consistency
Consistent spacing is one of the most important factors in creating professional, polished interfaces. Use spacing tokens religiously to maintain visual rhythm.
:::

:::tip Spacing Hierarchy
Use smaller spacing for closely related elements and larger spacing for distinct sections. This creates natural visual groupings that help users understand your interface.
:::