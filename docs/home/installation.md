---
title: Installation
description: Complete installation guide for integrating ELEVATE Design System into your project
sidebar_position: 3
---

# Installation

Get up and running with the ELEVATE Design System in your project. This guide covers installation for different frameworks and deployment scenarios.

## Package Installation

### npm

```bash
npm install @inform-elevate/elevate-core-ui
```

### yarn

```bash
yarn add @inform-elevate/elevate-core-ui
```

### pnpm

```bash
pnpm add @inform-elevate/elevate-core-ui
```

## Framework Setup

### React Applications

#### Create React App

```tsx
// src/App.tsx
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import { ElvtButton, ElvtInput, ElvtCard } from '@inform-elevate/elevate-core-ui/dist/react';

function App() {
  return (
    <div className="App">
      <ElvtCard>
        <h1>Welcome to ELEVATE</h1>
        <ElvtInput label="Your name" placeholder="Enter your name" />
        <ElvtButton tone="primary">Get Started</ElvtButton>
      </ElvtCard>
    </div>
  );
}

export default App;
```

#### Next.js Applications

```tsx
// pages/_app.tsx
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// pages/index.tsx
import { ElvtButton, ElvtCard } from '@inform-elevate/elevate-core-ui/dist/react';

export default function Home() {
  return (
    <ElvtCard>
      <h1>Next.js with ELEVATE</h1>
      <ElvtButton tone="primary">Click me</ElvtButton>
    </ElvtCard>
  );
}
```

#### Vite Applications

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// src/App.tsx
import { ElvtButton, ElvtCard } from '@inform-elevate/elevate-core-ui/dist/react';

function App() {
  return (
    <ElvtCard>
      <h1>Vite + React + ELEVATE</h1>
      <ElvtButton tone="primary">Get Started</ElvtButton>
    </ElvtCard>
  );
}

export default App;
```

### Vue Applications

#### Vue 3

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <elvt-card>
      <h1>Vue 3 with ELEVATE</h1>
      <elvt-input label="Your name" placeholder="Enter your name"></elvt-input>
      <elvt-button tone="primary">Get Started</elvt-button>
    </elvt-card>
  </div>
</template>

<script>
import '@inform-elevate/elevate-core-ui';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';

export default {
  name: 'App'
};
</script>
```

#### Nuxt.js

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '@inform-elevate/elevate-core-ui/dist/elevate.css',
    '@inform-elevate/elevate-core-ui/dist/themes/light.css'
  ],
  plugins: [
    '~/plugins/elevate.client.js'
  ]
});

// plugins/elevate.client.js
import '@inform-elevate/elevate-core-ui';
```

### Angular Applications

```typescript
// angular.json
{
  "styles": [
    "node_modules/@inform-elevate/elevate-core-ui/dist/elevate.css",
    "node_modules/@inform-elevate/elevate-core-ui/dist/themes/light.css",
    "src/styles.css"
  ]
}

// src/main.ts
import '@inform-elevate/elevate-core-ui';

// src/app/app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ... rest of configuration
})
export class AppModule { }
```

### Vanilla HTML/JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ELEVATE Example</title>
  
  <!-- ELEVATE Styles -->
  <link rel="stylesheet" href="https://unpkg.com/@inform-elevate/elevate-core-ui/dist/elevate.css">
  <link rel="stylesheet" href="https://unpkg.com/@inform-elevate/elevate-core-ui/dist/themes/light.css">
</head>
<body>
  <elvt-card>
    <h1>Vanilla HTML + ELEVATE</h1>
    <elvt-input label="Your name" placeholder="Enter your name"></elvt-input>
    <elvt-button tone="primary">Get Started</elvt-button>
  </elvt-card>

  <!-- ELEVATE Web Components -->
  <script type="module" src="https://unpkg.com/@inform-elevate/elevate-core-ui/dist/elevate.js"></script>
</body>
</html>
```

## Build Configuration

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@elevate': path.resolve(__dirname, 'node_modules/@inform-elevate/elevate-core-ui')
    }
  }
};
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@elevate': '/node_modules/@inform-elevate/elevate-core-ui'
    }
  }
});
```

### Rollup Configuration

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
  plugins: [
    resolve(),
    css({ output: 'bundle.css' })
  ]
};
```

## Theme Configuration

### Light Theme Only

```css
/* Import base styles and light theme */
@import '@inform-elevate/elevate-core-ui/dist/elevate.css';
@import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
```

### Dark Theme Support

```css
/* Import base styles and both themes */
@import '@inform-elevate/elevate-core-ui/dist/elevate.css';
@import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
@import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';
```

### Custom Theme

```css
/* Import base styles */
@import '@inform-elevate/elevate-core-ui/dist/elevate.css';

/* Define custom theme */
:root {
  --elvt-color-primary-500: #6f42c1;
  --elvt-color-primary-600: #5a2d91;
  --elvt-font-family-primary: 'Your Custom Font', system-ui, sans-serif;
}
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "types": ["@inform-elevate/elevate-core-ui"]
  },
  "include": [
    "node_modules/@inform-elevate/elevate-core-ui/dist/types"
  ]
}
```

### Type Definitions

```typescript
// types/elevate.d.ts
declare module '@inform-elevate/elevate-core-ui/dist/react' {
  export const ElvtButton: React.ComponentType<any>;
  export const ElvtInput: React.ComponentType<any>;
  export const ElvtCard: React.ComponentType<any>;
  // Add more component types as needed
}
```

## Bundle Optimization

### Tree Shaking

```javascript
// Import only what you need
import { ElvtButton } from '@inform-elevate/elevate-core-ui/dist/react/button';
import { ElvtInput } from '@inform-elevate/elevate-core-ui/dist/react/input';

// Instead of importing everything
// import * from '@inform-elevate/elevate-core-ui/dist/react';
```

### Code Splitting

```typescript
// Lazy load components
const ElvtButton = React.lazy(() => 
  import('@inform-elevate/elevate-core-ui/dist/react/button')
);

const ElvtInput = React.lazy(() => 
  import('@inform-elevate/elevate-core-ui/dist/react/input')
);
```

## Troubleshooting

### Common Issues

#### CSS Not Loading
```css
/* Make sure CSS is imported before component usage */
@import '@inform-elevate/elevate-core-ui/dist/elevate.css';
```

#### TypeScript Errors
```json
// Add to tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

#### Build Errors
```javascript
// Exclude from SSR (Next.js, Nuxt)
if (typeof window !== 'undefined') {
  require('@inform-elevate/elevate-core-ui');
}
```

### Performance Tips

1. **Use Tree Shaking** - Import only needed components
2. **Lazy Loading** - Load components on demand
3. **CSS Optimization** - Use CSS purging for production
4. **Bundle Analysis** - Monitor bundle size impact

## Verification

### Test Installation

Create a simple test component to verify everything is working:

```tsx
// TestComponent.tsx
import { ElvtButton, ElvtCard } from '@inform-elevate/elevate-core-ui/dist/react';

export function TestComponent() {
  return (
    <ElvtCard>
      <h2>ELEVATE Test</h2>
      <ElvtButton tone="primary" onClick={() => alert('ELEVATE is working!')}>
        Test Button
      </ElvtButton>
    </ElvtCard>
  );
}
```

### Accessibility Check

```typescript
// Test accessibility features
import { ElvtButton } from '@inform-elevate/elevate-core-ui/dist/react';

export function AccessibilityTest() {
  return (
    <ElvtButton 
      tone="primary" 
      aria-label="Primary action button"
      onClick={() => console.log('Accessible button clicked')}
    >
      Accessible Button
    </ElvtButton>
  );
}
```

---

:::tip Quick Start Template
Use our [starter templates](https://github.com/inform-elevate/starters) for common frameworks to get up and running in minutes.
:::

:::info Need Help?
If you encounter issues during installation, check our [troubleshooting guide](/docs/home/support) or reach out on Slack #elevate-design-system.
:::