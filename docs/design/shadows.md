---
title: Shadows
description: Elevation and depth system for creating visual hierarchy and interface layering
sidebar_position: 5
---

# Shadow System

Shadows create depth, hierarchy, and visual focus in interfaces. ELEVATE's shadow system provides consistent elevation levels that help users understand interface layering and element importance.

## Shadow Philosophy

### Design Principles
- **Realistic Lighting** - Shadows mimic natural light behavior
- **Layered Hierarchy** - Different shadow levels indicate interface layers
- **Subtle Enhancement** - Shadows enhance without overwhelming
- **Performance Conscious** - Optimized shadow implementations

### Shadow Functions
- **Elevation** - Indicate which elements are above others
- **Focus** - Draw attention to important elements
- **Interaction** - Provide feedback for user actions
- **Organization** - Help separate content areas and components

## Elevation System

### Shadow Levels
Five elevation levels provide a complete hierarchy for interface layering.

```css
/* Shadow elevation scale */
--elvt-shadow-none: none;                                    /* Level 0 - Flat elements */
--elvt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);           /* Level 1 - Subtle depth */
--elvt-shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1),          /* Level 2 - Cards, buttons */
                    0 1px 2px -1px rgb(0 0 0 / 0.1);
--elvt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),         /* Level 3 - Dropdowns, panels */
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
--elvt-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),       /* Level 4 - Modals, sheets */
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
--elvt-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),       /* Level 5 - Maximum elevation */
                  0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Inner shadows for recessed elements */
--elvt-shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);  /* Pressed buttons, inputs */
```

### Dark Theme Shadows
Adjusted shadows for dark theme interfaces with higher opacity.

```css
/* Dark theme shadow adjustments */
[data-theme='dark'] {
  --elvt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --elvt-shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.4),
                      0 1px 2px -1px rgb(0 0 0 / 0.4);
  --elvt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5),
                    0 2px 4px -2px rgb(0 0 0 / 0.5);
  --elvt-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.6),
                    0 4px 6px -4px rgb(0 0 0 / 0.6);
  --elvt-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.7),
                    0 8px 10px -6px rgb(0 0 0 / 0.7);
  --elvt-shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.4);
}
```

## Semantic Shadow Tokens

### Component-Specific Shadows
Meaningful shadow names for common component use cases.

```css
/* Button shadows */
--elvt-shadow-button: var(--elvt-shadow-sm);              /* Default button depth */
--elvt-shadow-button-hover: var(--elvt-shadow-base);      /* Hover state elevation */
--elvt-shadow-button-active: var(--elvt-shadow-inner);    /* Pressed state */

/* Card shadows */
--elvt-shadow-card: var(--elvt-shadow-base);              /* Standard cards */
--elvt-shadow-card-hover: var(--elvt-shadow-md);          /* Interactive cards */
--elvt-shadow-card-elevated: var(--elvt-shadow-lg);       /* Important cards */

/* Overlay shadows */
--elvt-shadow-dropdown: var(--elvt-shadow-md);            /* Dropdown menus */
--elvt-shadow-modal: var(--elvt-shadow-xl);               /* Modal dialogs */
--elvt-shadow-tooltip: var(--elvt-shadow-base);           /* Tooltip popups */

/* Focus shadows */
--elvt-shadow-focus: 0 0 0 3px var(--elvt-color-primary-alpha-20);  /* Focus rings */
```

## Component Shadow Usage

### Button Shadows
Buttons use subtle shadows to indicate interactivity and provide feedback.

```css
/* Primary button shadows */
.elvt-button-primary {
  box-shadow: var(--elvt-shadow-button);
  transition: box-shadow 0.2s ease;
}

.elvt-button-primary:hover {
  box-shadow: var(--elvt-shadow-button-hover);
}

.elvt-button-primary:active {
  box-shadow: var(--elvt-shadow-button-active);
}

/* Secondary button - minimal shadow */
.elvt-button-secondary {
  box-shadow: var(--elvt-shadow-sm);
}

/* Ghost button - no shadow */
.elvt-button-ghost {
  box-shadow: var(--elvt-shadow-none);
}
```

### Card Shadows
Cards use shadows to appear elevated above the page background.

```css
/* Standard card shadow */
.elvt-card {
  box-shadow: var(--elvt-shadow-card);
  border-radius: 8px;
  background: var(--elvt-color-background);
}

/* Interactive card with hover effect */
.elvt-card-interactive {
  box-shadow: var(--elvt-shadow-card);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.elvt-card-interactive:hover {
  box-shadow: var(--elvt-shadow-card-hover);
  transform: translateY(-2px);
}

/* Elevated card for important content */
.elvt-card-elevated {
  box-shadow: var(--elvt-shadow-card-elevated);
}
```

### Overlay Shadows
Overlays need strong shadows to appear above other content.

```css
/* Modal dialog shadows */
.elvt-modal {
  box-shadow: var(--elvt-shadow-modal);
  background: var(--elvt-color-background);
  border-radius: 12px;
}

/* Dropdown menu shadows */
.elvt-dropdown {
  box-shadow: var(--elvt-shadow-dropdown);
  background: var(--elvt-color-background);
  border-radius: 8px;
  border: 1px solid var(--elvt-color-border-light);
}

/* Tooltip shadows */
.elvt-tooltip {
  box-shadow: var(--elvt-shadow-tooltip);
  background: var(--elvt-color-background-inverse);
  color: var(--elvt-color-text-inverse);
  border-radius: 6px;
}
```

## Shadow Interactions

### Hover Effects
Shadows can increase on hover to indicate interactivity.

```css
/* Subtle hover elevation */
.elvt-hover-lift {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.elvt-hover-lift:hover {
  box-shadow: var(--elvt-shadow-md);
  transform: translateY(-1px);
}

/* Strong hover elevation for cards */
.elvt-card-hover {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.elvt-card-hover:hover {
  box-shadow: var(--elvt-shadow-lg);
  transform: translateY(-4px);
}
```

### Focus States
Focus shadows provide clear accessibility indicators.

```css
/* Focus shadow for interactive elements */
.elvt-focusable:focus {
  outline: none;
  box-shadow: var(--elvt-shadow-focus), var(--elvt-shadow-base);
}

/* Focus shadow for form inputs */
.elvt-input:focus {
  box-shadow: var(--elvt-shadow-focus);
  border-color: var(--elvt-color-primary);
}

/* Focus shadow combined with existing shadow */
.elvt-button:focus {
  box-shadow: var(--elvt-shadow-focus), var(--elvt-shadow-button-hover);
}
```

### Active States
Active shadows indicate pressed or selected states.

```css
/* Pressed button effect */
.elvt-button:active {
  box-shadow: var(--elvt-shadow-inner);
  transform: translateY(1px);
}

/* Active card or panel */
.elvt-card.is-active {
  box-shadow: var(--elvt-shadow-md), var(--elvt-shadow-focus);
}

/* Selected state with inner shadow */
.elvt-item.is-selected {
  box-shadow: var(--elvt-shadow-inner);
  background: var(--elvt-color-primary-50);
}
```

## Performance Optimization

### Efficient Shadow Implementation
Optimize shadows for smooth animations and good performance.

```css
/* Use transform for better performance */
.elvt-elevated-hover {
  will-change: transform, box-shadow;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.elvt-elevated-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--elvt-shadow-lg);
}

/* Avoid expensive properties during animations */
@media (prefers-reduced-motion: reduce) {
  .elvt-elevated-hover {
    will-change: auto;
    transition: box-shadow 0.3s ease;
  }
  
  .elvt-elevated-hover:hover {
    transform: none;
  }
}
```

### GPU Acceleration
Use transform3d to ensure GPU acceleration for shadow animations.

```css
/* Force GPU layer for smooth shadow transitions */
.elvt-shadow-animate {
  transform: translate3d(0, 0, 0);
  transition: box-shadow 0.3s ease;
}
```

## Accessibility Considerations

### Motion Sensitivity
Respect user preferences for reduced motion.

```css
/* Reduce shadow animations for motion-sensitive users */
@media (prefers-reduced-motion: reduce) {
  .elvt-shadow-hover {
    transition: box-shadow 0.1s ease;
  }
  
  .elvt-shadow-hover:hover {
    transform: none; /* Remove transform animations */
  }
}
```

### High Contrast Support
Ensure shadows work in high contrast mode.

```css
/* High contrast shadow adjustments */
@media (prefers-contrast: high) {
  .elvt-card {
    box-shadow: var(--elvt-shadow-base);
    border: 1px solid var(--elvt-color-border);
  }
}
```

## Implementation Guidelines

### Using Shadow Tokens
Always use semantic shadow tokens for consistent elevation.

```css
/* ✅ Good - Semantic shadow tokens */
.component {
  box-shadow: var(--elvt-shadow-card);
}

.component:hover {
  box-shadow: var(--elvt-shadow-card-hover);
}

/* ❌ Avoid - Hard-coded shadow values */
.component {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Shadow Layering
Layer shadows appropriately to create clear hierarchy.

```css
/* Base layer - minimal shadow */
.elvt-layer-base {
  box-shadow: var(--elvt-shadow-sm);
}

/* Elevated layer - medium shadow */
.elvt-layer-elevated {
  box-shadow: var(--elvt-shadow-md);
}

/* Floating layer - strong shadow */
.elvt-layer-floating {
  box-shadow: var(--elvt-shadow-lg);
}

/* Modal layer - maximum shadow */
.elvt-layer-modal {
  box-shadow: var(--elvt-shadow-xl);
}
```

### Custom Shadow Extensions
When creating custom shadows, maintain the established elevation hierarchy.

```css
/* Custom shadow following elevation system */
:root {
  --elvt-shadow-custom-subtle: 0 1px 1px 0 rgb(0 0 0 / 0.03);
  --elvt-shadow-custom-strong: 0 25px 30px -8px rgb(0 0 0 / 0.15);
}
```

## Shadow Examples

### Component Shadows
```html
<div class="elvt-card" style="box-shadow: var(--elvt-shadow-card);">
  <h3>Card Title</h3>
  <p>Card content with standard elevation.</p>
</div>

<button class="elvt-button" style="box-shadow: var(--elvt-shadow-button);">
  Button with subtle depth
</button>
```

### Interactive Shadows
```html
<div class="elvt-hover-card" style="
  box-shadow: var(--elvt-shadow-base);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
">
  <style>
    .elvt-hover-card:hover {
      box-shadow: var(--elvt-shadow-md);
      transform: translateY(-2px);
    }
  </style>
  Hover me to see elevation change
</div>
```

### Overlay Shadows
```html
<div class="elvt-modal" style="
  box-shadow: var(--elvt-shadow-modal);
  background: white;
  padding: 2rem;
  border-radius: 12px;
">
  <h2>Modal Dialog</h2>
  <p>Modal content with maximum elevation.</p>
</div>
```

---

:::info Shadow Performance
Use shadows judiciously and optimize animations with transform properties. Too many animated shadows can impact performance, especially on lower-end devices.
:::

:::tip Elevation Hierarchy
Use shadows to create clear visual hierarchy. Elements that are more important or interactive should have more prominent shadows to appear "closer" to the user.
:::