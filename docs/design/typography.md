---
title: Typography
description: Systematic approach to text styling with hierarchical type scales and responsive typography
sidebar_position: 3
---

# Typography System

Typography is fundamental to creating clear, readable, and engaging interfaces. ELEVATE's typography system provides consistent text styling that enhances readability and supports effective communication.

## Typography Philosophy

### Design Principles
- **Readability First** - Optimized for screen reading and comprehension
- **Hierarchical Clarity** - Clear information hierarchy through type scales
- **Accessibility Focus** - Meets WCAG guidelines for text accessibility
- **Performance Optimized** - Efficient font loading and rendering

### Font Selection Criteria
- **Screen Optimization** - Excellent readability on digital displays
- **Character Coverage** - Support for multiple languages and special characters
- **Performance** - Fast loading times and efficient rendering
- **Brand Alignment** - Professional, trustworthy, and modern appearance

## Primary Typeface

### Inter Font Family
Inter is our primary typeface, specifically designed for user interfaces.

**Why Inter:**
- **Screen Optimized** - Designed specifically for digital interfaces
- **Excellent Legibility** - Clear at all sizes, especially small text
- **Extensive Weights** - Multiple weights for proper hierarchy
- **Character Support** - Comprehensive language and symbol coverage
- **Open Source** - Freely available and actively maintained

### Font Loading Strategy
```css
/* Optimized font loading */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Font stack with fallbacks */
--elvt-font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
--elvt-font-family-mono: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

## Type Scale System

### Responsive Type Scale
Our type scale adapts to different screen sizes for optimal readability.

```css
/* Desktop type scale (16px base) */
--elvt-font-size-xs: 0.75rem;    /* 12px - Fine print, captions */
--elvt-font-size-sm: 0.875rem;   /* 14px - Helper text, labels */
--elvt-font-size-base: 1rem;     /* 16px - Body text, default */
--elvt-font-size-lg: 1.125rem;   /* 18px - Large body, emphasis */
--elvt-font-size-xl: 1.25rem;    /* 20px - Small headings */
--elvt-font-size-2xl: 1.5rem;    /* 24px - Section headings */
--elvt-font-size-3xl: 1.875rem;  /* 30px - Page titles */
--elvt-font-size-4xl: 2.25rem;   /* 36px - Hero titles */
--elvt-font-size-5xl: 3rem;      /* 48px - Display titles */
--elvt-font-size-6xl: 3.75rem;   /* 60px - Large display */

/* Mobile type scale (slightly smaller) */
@media (max-width: 768px) {
  --elvt-font-size-3xl: 1.75rem;  /* 28px */
  --elvt-font-size-4xl: 2rem;     /* 32px */
  --elvt-font-size-5xl: 2.5rem;   /* 40px */
  --elvt-font-size-6xl: 3rem;     /* 48px */
}
```

### Font Weights
```css
/* Font weight scale */
--elvt-font-weight-normal: 400;    /* Regular text, body copy */
--elvt-font-weight-medium: 500;    /* Emphasis, important text */
--elvt-font-weight-semibold: 600;  /* Subheadings, UI labels */
--elvt-font-weight-bold: 700;      /* Headings, titles */
```

## Typography Hierarchy

### Heading Styles
Semantic heading styles that establish clear information hierarchy.

```css
/* Heading 1 - Page titles */
.elvt-heading-1 {
  font-size: var(--elvt-font-size-4xl);
  font-weight: var(--elvt-font-weight-bold);
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

/* Heading 2 - Section titles */
.elvt-heading-2 {
  font-size: var(--elvt-font-size-3xl);
  font-weight: var(--elvt-font-weight-bold);
  line-height: 1.3;
  letter-spacing: -0.025em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

/* Heading 3 - Subsection titles */
.elvt-heading-3 {
  font-size: var(--elvt-font-size-2xl);
  font-weight: var(--elvt-font-weight-semibold);
  line-height: 1.4;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

/* Heading 4 - Component titles */
.elvt-heading-4 {
  font-size: var(--elvt-font-size-xl);
  font-weight: var(--elvt-font-weight-semibold);
  line-height: 1.4;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}

/* Heading 5 - Small headings */
.elvt-heading-5 {
  font-size: var(--elvt-font-size-lg);
  font-weight: var(--elvt-font-weight-medium);
  line-height: 1.5;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Heading 6 - Micro headings */
.elvt-heading-6 {
  font-size: var(--elvt-font-size-base);
  font-weight: var(--elvt-font-weight-medium);
  line-height: 1.5;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}
```

### Body Text Styles
Different body text variations for various content needs.

```css
/* Body Large - Important content, introductions */
.elvt-body-large {
  font-size: var(--elvt-font-size-lg);
  font-weight: var(--elvt-font-weight-normal);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Body - Standard text, paragraphs */
.elvt-body {
  font-size: var(--elvt-font-size-base);
  font-weight: var(--elvt-font-weight-normal);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Body Small - Helper text, captions */
.elvt-body-small {
  font-size: var(--elvt-font-size-sm);
  font-weight: var(--elvt-font-weight-normal);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

/* Body Emphasis - Important body text */
.elvt-body-emphasis {
  font-size: var(--elvt-font-size-base);
  font-weight: var(--elvt-font-weight-medium);
  line-height: 1.6;
}
```

### UI Text Styles
Specific text styles for interface elements.

```css
/* Button text */
.elvt-button-text {
  font-size: var(--elvt-font-size-base);
  font-weight: var(--elvt-font-weight-medium);
  line-height: 1.5;
  letter-spacing: 0.025em;
}

/* Label text */
.elvt-label {
  font-size: var(--elvt-font-size-sm);
  font-weight: var(--elvt-font-weight-medium);
  line-height: 1.4;
  letter-spacing: 0.025em;
}

/* Caption text */
.elvt-caption {
  font-size: var(--elvt-font-size-xs);
  font-weight: var(--elvt-font-weight-normal);
  line-height: 1.4;
  color: var(--elvt-alias-content-text-secondary);
}

/* Code text */
.elvt-code {
  font-family: var(--elvt-font-family-mono);
  font-size: var(--elvt-font-size-sm);
  font-weight: var(--elvt-font-weight-normal);
  line-height: 1.5;
  background: var(--elvt-alias-layout-surface-code);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
```

## Line Height and Spacing

### Line Height Guidelines
Optimized line heights for different text sizes and use cases.

```css
/* Line height scale */
--elvt-line-height-tight: 1.2;    /* Large headings */
--elvt-line-height-snug: 1.3;     /* Medium headings */
--elvt-line-height-normal: 1.4;   /* Small headings, UI text */
--elvt-line-height-relaxed: 1.5;  /* Small text, captions */
--elvt-line-height-loose: 1.6;    /* Body text, paragraphs */
```

### Vertical Rhythm
Consistent vertical spacing creates visual rhythm and improves readability.

```css
/* Vertical spacing scale */
.elvt-text-spacing {
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2em;
    margin-bottom: 0.5em;
  }
  
  /* First heading has no top margin */
  h1:first-child,
  h2:first-child,
  h3:first-child {
    margin-top: 0;
  }
  
  /* Paragraphs */
  p {
    margin-bottom: 1em;
  }
  
  /* Lists */
  ul, ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }
  
  li {
    margin-bottom: 0.25em;
  }
}
```

## Responsive Typography

### Fluid Typography
Typography that scales smoothly between breakpoints.

```css
/* Fluid font size using clamp() */
.elvt-fluid-heading {
  font-size: clamp(
    var(--elvt-font-size-2xl),  /* Minimum size */
    4vw,                        /* Preferred size */
    var(--elvt-font-size-4xl)   /* Maximum size */
  );
}

/* Responsive line length */
.elvt-text-container {
  max-width: 65ch; /* Optimal reading line length */
  margin: 0 auto;
}
```

### Breakpoint-Specific Adjustments
```css
/* Mobile typography adjustments */
@media (max-width: 768px) {
  .elvt-heading-1 {
    font-size: var(--elvt-font-size-3xl);
    line-height: 1.3;
  }
  
  .elvt-body {
    font-size: var(--elvt-font-size-base);
  }
}

/* Large screen typography enhancements */
@media (min-width: 1200px) {
  .elvt-heading-1 {
    font-size: var(--elvt-font-size-5xl);
  }
  
  .elvt-body-large {
    font-size: var(--elvt-font-size-xl);
  }
}
```

## Accessibility Considerations

### Text Contrast
Ensure sufficient contrast between text and background colors.

```css
/* High contrast text combinations */
.elvt-text-primary {
  color: var(--elvt-alias-content-text-primary); /* 21:1 contrast */
}

.elvt-text-secondary {
  color: var(--elvt-alias-content-text-secondary); /* 7.5:1 contrast */
}

.elvt-text-tertiary {
  color: var(--elvt-alias-content-text-tertiary); /* 4.6:1 contrast */
}
```

### Font Size Requirements
- **Minimum Size** - 16px for body text (browser default)
- **Large Text** - 18px+ or 14px+ bold for better readability
- **UI Elements** - Minimum 14px for interface text
- **Fine Print** - 12px minimum with high contrast

### Reading Considerations
- **Line Length** - 45-75 characters per line for optimal reading
- **Line Height** - 1.5x font size minimum for body text
- **Letter Spacing** - Slight positive spacing for small text
- **Word Spacing** - Default browser spacing works well

## Implementation Guidelines

### Using Typography Tokens
Always use typography tokens for consistent text styling.

```css
/* ✅ Good - Typography tokens */
.component-title {
  font-size: var(--elvt-font-size-xl);
  font-weight: var(--elvt-font-weight-semibold);
  line-height: var(--elvt-line-height-normal);
}

/* ❌ Avoid - Hard-coded values */
.component-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}
```

### Text Color Integration
Combine typography tokens with semantic color tokens.

```css
.text-styling {
  font-size: var(--elvt-font-size-base);
  color: var(--elvt-alias-content-text-primary);
  font-family: var(--elvt-font-family-base);
}
```

### Custom Typography Extensions
When creating custom text styles, follow the established patterns.

```css
/* Custom display text style */
.elvt-display-text {
  font-size: var(--elvt-font-size-6xl);
  font-weight: var(--elvt-font-weight-bold);
  line-height: var(--elvt-line-height-tight);
  letter-spacing: -0.05em;
}
```

## Typography Examples

### Content Hierarchy
```html
<article class="elvt-article">
  <h1 class="elvt-heading-1">Article Title</h1>
  <p class="elvt-body-large">Introduction paragraph with larger text.</p>
  
  <h2 class="elvt-heading-2">Section Heading</h2>
  <p class="elvt-body">Regular body paragraph text.</p>
  
  <h3 class="elvt-heading-3">Subsection</h3>
  <p class="elvt-body-small">Smaller supporting text.</p>
</article>
```

### Interface Text
```html
<div class="elvt-ui-component">
  <label class="elvt-label">Form Label</label>
  <button class="elvt-button">
    <span class="elvt-button-text">Button Text</span>
  </button>
  <p class="elvt-caption">Helper text or caption</p>
</div>
```

### Code and Technical Text
```html
<div class="elvt-code-example">
  <p class="elvt-body">Install the package:</p>
  <code class="elvt-code">npm install @inform-elevate/elevate-core-ui</code>
  <p class="elvt-caption">Run this command in your project directory</p>
</div>
```

---

:::info Typography Performance
Use font-display: swap for better loading performance and consider preloading critical fonts to improve perceived performance.
:::

:::tip Readable Line Lengths
Keep text lines between 45-75 characters for optimal readability. Use max-width with ch units to control line length effectively.
:::