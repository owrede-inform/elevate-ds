---
title: Animation
description: Motion design principles and interaction animations for creating engaging, accessible interfaces
sidebar_position: 7
---

# Animation System

Thoughtful animation enhances user experience by providing feedback, guiding attention, and creating delightful interactions. ELEVATE's animation system balances performance, accessibility, and purposeful motion.

## Animation Philosophy

### Design Principles
- **Purposeful Motion** - Every animation serves a clear function
- **Performance First** - Smooth, efficient animations that don't block UI
- **Accessibility Aware** - Respect user preferences and limitations
- **Consistent Language** - Unified timing and easing throughout the system

### Animation Functions
- **Feedback** - Confirm user actions and system responses
- **Attention** - Guide focus to important elements or changes
- **Transitions** - Smooth state changes and navigation
- **Personality** - Add subtle delight without overwhelming

## Timing and Easing

### Duration Scale
Consistent timing creates predictable, comfortable interactions.

```css
/* Animation duration tokens */
--elvt-duration-instant: 0ms;        /* Immediate changes */
--elvt-duration-fast: 150ms;         /* Quick interactions */
--elvt-duration-base: 250ms;         /* Standard transitions */
--elvt-duration-slow: 350ms;         /* Complex animations */
--elvt-duration-slower: 500ms;       /* Major transitions */
--elvt-duration-slowest: 700ms;      /* Modal/overlay entrance */
```

### Duration Guidelines
- **Instant (0ms)** - Color changes, immediate feedback
- **Fast (150ms)** - Button hover states, small UI changes
- **Base (250ms)** - Standard transitions, card hover effects
- **Slow (350ms)** - Complex state changes, component animations
- **Slower (500ms)** - Page transitions, layout changes
- **Slowest (700ms)** - Modal appearances, major UI shifts

### Easing Curves
Natural motion curves that feel comfortable and predictable.

```css
/* Easing function tokens */
--elvt-ease-linear: linear;                      /* Consistent speed */
--elvt-ease-in: cubic-bezier(0.4, 0, 1, 1);    /* Slow start, fast end */
--elvt-ease-out: cubic-bezier(0, 0, 0.2, 1);   /* Fast start, slow end */
--elvt-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Standard ease */
--elvt-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Subtle bounce */
--elvt-ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);  /* Quick, sharp */
```

### Easing Applications
- **Ease-out** - Elements entering the screen (modals, dropdowns)
- **Ease-in** - Elements leaving the screen (closing dialogs)
- **Ease-in-out** - State changes, hover effects, standard transitions
- **Linear** - Loading indicators, continuous animations
- **Bounce** - Playful interactions, success confirmations
- **Sharp** - Quick feedback, button presses

## Animation Types

### Micro-Interactions
Small animations that provide immediate feedback.

```css
/* Button hover animation */
.elvt-button {
  transition: background-color var(--elvt-duration-fast) var(--elvt-ease-out),
              transform var(--elvt-duration-fast) var(--elvt-ease-out),
              box-shadow var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--elvt-shadow-md);
}

.elvt-button:active {
  transform: translateY(0);
  transition-duration: var(--elvt-duration-instant);
}

/* Input focus animation */
.elvt-input {
  border: 2px solid var(--elvt-color-border);
  transition: border-color var(--elvt-duration-base) var(--elvt-ease-out),
              box-shadow var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-input:focus {
  border-color: var(--elvt-color-primary);
  box-shadow: 0 0 0 3px var(--elvt-color-primary-alpha-20);
}

/* Checkbox animation */
.elvt-checkbox {
  transition: background-color var(--elvt-duration-base) var(--elvt-ease-out),
              border-color var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-checkbox:checked {
  background-color: var(--elvt-color-primary);
  border-color: var(--elvt-color-primary);
}

.elvt-checkbox:checked::after {
  animation: checkmark var(--elvt-duration-base) var(--elvt-ease-bounce);
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(45deg);
  }
  50% {
    transform: scale(1.1) rotate(45deg);
  }
  100% {
    transform: scale(1) rotate(45deg);
  }
}
```

### State Transitions
Smooth transitions between different component states.

```css
/* Card state animation */
.elvt-card {
  transition: transform var(--elvt-duration-base) var(--elvt-ease-out),
              box-shadow var(--elvt-duration-base) var(--elvt-ease-out),
              background-color var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--elvt-shadow-lg);
}

.elvt-card.is-loading {
  background-color: var(--elvt-color-gray-50);
  animation: pulse var(--elvt-duration-slower) var(--elvt-ease-in-out) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Toggle switch animation */
.elvt-toggle {
  position: relative;
  background: var(--elvt-color-gray-300);
  transition: background-color var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-toggle::after {
  content: '';
  position: absolute;
  background: white;
  transition: transform var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-toggle:checked {
  background-color: var(--elvt-color-primary);
}

.elvt-toggle:checked::after {
  transform: translateX(20px);
}
```

### Loading Animations
Animations that indicate progress and maintain user engagement.

```css
/* Spinner animation */
.elvt-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--elvt-color-gray-200);
  border-top-color: var(--elvt-color-primary);
  border-radius: 50%;
  animation: spin var(--elvt-duration-slowest) linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Skeleton loading animation */
.elvt-skeleton {
  background: linear-gradient(
    90deg,
    var(--elvt-color-gray-200) 25%,
    var(--elvt-color-gray-100) 50%,
    var(--elvt-color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer var(--elvt-duration-slower) ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Progress bar animation */
.elvt-progress-bar {
  background: var(--elvt-color-gray-200);
  overflow: hidden;
}

.elvt-progress-fill {
  background: var(--elvt-color-primary);
  height: 100%;
  transition: width var(--elvt-duration-base) var(--elvt-ease-out);
}

/* Indeterminate progress */
.elvt-progress-indeterminate .elvt-progress-fill {
  width: 30%;
  animation: indeterminate var(--elvt-duration-slower) ease-in-out infinite;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(300%);
  }
  100% {
    transform: translateX(300%);
  }
}
```

### Layout Animations
Animations for layout changes and content transitions.

```css
/* Slide in animation */
.elvt-slide-in {
  animation: slideIn var(--elvt-duration-slow) var(--elvt-ease-out);
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fade in animation */
.elvt-fade-in {
  animation: fadeIn var(--elvt-duration-base) var(--elvt-ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in animation */
.elvt-scale-in {
  animation: scaleIn var(--elvt-duration-base) var(--elvt-ease-bounce);
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Accordion expand animation */
.elvt-accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--elvt-duration-slow) var(--elvt-ease-in-out),
              padding var(--elvt-duration-slow) var(--elvt-ease-in-out);
}

.elvt-accordion.is-open .elvt-accordion-content {
  max-height: 1000px; /* Large enough for content */
  padding: var(--elvt-spacing-4) 0;
}
```

## Performance Optimization

### GPU-Accelerated Properties
Use properties that trigger GPU acceleration for smooth animations.

```css
/* Optimized for 60fps performance */
.elvt-performant-animation {
  /* Use transform instead of changing position */
  transform: translateX(0);
  transition: transform var(--elvt-duration-base) var(--elvt-ease-out);
  
  /* Force GPU layer */
  will-change: transform;
}

.elvt-performant-animation:hover {
  transform: translateX(10px);
}

/* Use opacity instead of visibility */
.elvt-fade-toggle {
  opacity: 1;
  transition: opacity var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-fade-toggle.is-hidden {
  opacity: 0;
  pointer-events: none;
}
```

### Animation Best Practices
```css
/* Clean up will-change after animation */
.elvt-animated-element {
  will-change: transform, opacity;
  transition: transform var(--elvt-duration-base) var(--elvt-ease-out),
              opacity var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-animated-element:not(:hover):not(:focus):not(.is-animating) {
  will-change: auto;
}

/* Use contain for better performance */
.elvt-animation-container {
  contain: layout style paint;
}

/* Optimize for specific animations */
@keyframes optimizedSlide {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
```

## Accessibility Considerations

### Reduced Motion Support
Respect user preferences for reduced motion.

```css
/* Default animations */
.elvt-animated {
  transition: transform var(--elvt-duration-base) var(--elvt-ease-out),
              opacity var(--elvt-duration-base) var(--elvt-ease-out);
}

/* Reduce animations for users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .elvt-animated {
    transition-duration: var(--elvt-duration-instant);
  }
  
  /* Remove complex animations entirely */
  .elvt-complex-animation {
    animation: none;
  }
  
  /* Simplify hover effects */
  .elvt-button:hover {
    transform: none;
  }
}

/* Provide alternative feedback for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .elvt-button:hover {
    background-color: var(--elvt-color-primary-dark);
  }
  
  .elvt-button:active {
    background-color: var(--elvt-color-primary-darker);
  }
}
```

### Animation Controls
Provide controls for users who want to disable animations.

```css
/* Animation control preference */
.no-animations * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
```

### Focus and Screen Reader Considerations
```css
/* Don't animate focus indicators */
.elvt-focusable:focus {
  outline: 2px solid var(--elvt-color-primary);
  outline-offset: 2px;
  /* No transition on focus outline */
}

/* Announce state changes to screen readers */
.elvt-loading[aria-busy="true"]::after {
  content: "Loading...";
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

## Implementation Guidelines

### Using Animation Tokens
Always use animation tokens for consistent timing and easing.

```css
/* ✅ Good - Animation tokens */
.component {
  transition: background-color var(--elvt-duration-base) var(--elvt-ease-out);
}

/* ❌ Avoid - Hard-coded values */
.component {
  transition: background-color 250ms ease-out;
}
```

### Animation Layering
Layer multiple animations carefully to avoid conflicts.

```css
/* Proper animation layering */
.elvt-complex-interaction {
  transition: 
    transform var(--elvt-duration-base) var(--elvt-ease-out),
    background-color var(--elvt-duration-fast) var(--elvt-ease-out),
    box-shadow var(--elvt-duration-base) var(--elvt-ease-out);
}

.elvt-complex-interaction:hover {
  transform: translateY(-2px);
  background-color: var(--elvt-color-primary-light);
  box-shadow: var(--elvt-shadow-md);
}
```

### Custom Animation Extensions
When creating custom animations, follow established patterns.

```css
/* Custom animation following system patterns */
@keyframes customBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.elvt-custom-animation {
  animation: customBounce var(--elvt-duration-slow) var(--elvt-ease-bounce);
}
```

## Animation Examples

### Interactive Button
```html
<button class="elvt-button elvt-button-primary" style="
  transition: all var(--elvt-duration-base) var(--elvt-ease-out);
">
  <style>
    .elvt-button:hover {
      transform: translateY(-2px);
      box-shadow: var(--elvt-shadow-md);
    }
    .elvt-button:active {
      transform: translateY(0);
      transition-duration: var(--elvt-duration-instant);
    }
  </style>
  Hover me
</button>
```

### Loading State
```html
<div class="elvt-card elvt-skeleton" style="
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer var(--elvt-duration-slower) ease-in-out infinite;
">
  <style>
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  </style>
  Loading content...
</div>
```

### Modal Entrance
```html
<div class="elvt-modal" style="
  animation: modalEnter var(--elvt-duration-slow) var(--elvt-ease-out);
">
  <style>
    @keyframes modalEnter {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  </style>
  Modal content
</div>
```

---

:::info Motion Sensitivity
Always implement prefers-reduced-motion support. Some users may experience vestibular disorders or other conditions that make motion uncomfortable or harmful.
:::

:::tip Performance First
Animate transform and opacity properties for the best performance. Avoid animating properties that trigger layout recalculation like width, height, or padding.
:::