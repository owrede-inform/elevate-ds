# ELEVATE Design System - Path Configuration Rules

## ⚠️ CRITICAL: Follow These Rules ALWAYS

### Environment Configuration (NEVER CHANGE)
```typescript
// docusaurus.config.ts
url: process.env.NODE_ENV === 'production' 
  ? 'https://owrede-inform.github.io'    // GitHub Pages
  : 'http://localhost:3000',             // Development

baseUrl: process.env.NODE_ENV === 'production' 
  ? '/elevate-ds/'                       // GitHub Pages subfolder
  : '/',                                 // Development root
```

### Path Rules by Context

#### 1. React Components (.tsx files)
```typescript
// ✅ CORRECT - Use useBaseUrl for internal links
import useBaseUrl from '@docusaurus/useBaseUrl';

const myLink = useBaseUrl('/docs/components/button');
const myImage = useBaseUrl('/img/hero.jpg');
```

#### 2. Markdown/MDX Content (.md/.mdx files)  
```markdown
<!-- ✅ CORRECT - Use relative paths for navigation -->
[Button Component](./button)
[Home](../../)

<!-- ✅ CORRECT - Use relative paths for images -->
![Hero Image](../../static/img/hero.jpg)

<!-- ❌ NEVER USE - Absolute paths break on GitHub Pages -->
[Button](/docs/components/button)
![Hero](/img/hero.jpg)
```

#### 3. Component Examples (Demo URLs)
```jsx
// ✅ CORRECT - These are example URLs, not real navigation
<elvt-breadcrumb-item href="/dashboard">Dashboard</elvt-breadcrumb-item>
<elvt-button href="/login">Login</elvt-button>

// These are just component demos showing how the component works
// They don't need baseUrl because they're not real site links
```

#### 4. Static Assets in /static/ folder
```typescript
// ✅ CORRECT - Always use useBaseUrl for static assets
const imagePath = useBaseUrl('/img/hero-backgrounds/bg1.jpg');
const jsonPath = useBaseUrl('/component-changelogs/elvt-button-changes.json');
```

### What Works Where

| Environment | Base URL | Example Full Path |
|-------------|----------|------------------|
| **Development** | `/` | `http://localhost:3000/docs/components/button` |
| **GitHub Pages** | `/elevate-ds/` | `https://owrede-inform.github.io/elevate-ds/docs/components/button` |

### Current Status ✅

- ✅ **docusaurus.config.ts**: Environment-based configuration  
- ✅ **Homepage links**: Using useBaseUrl() correctly
- ✅ **Hero images**: Using useBaseUrl() correctly  
- ✅ **Sidebar navigation**: Docusaurus handles automatically
- ✅ **ComponentChangelog**: Fetches from static assets correctly

### Rules Summary

1. **NEVER change docusaurus.config.ts baseUrl logic**
2. **React components**: Always use `useBaseUrl('/path')`  
3. **Markdown content**: Always use relative paths `./path` or `../path`
4. **Component examples**: Can use absolute paths (they're just demos)
5. **When in doubt**: Use relative paths in markdown, useBaseUrl in React

This ensures the site works correctly in both development and production without constant fixes.