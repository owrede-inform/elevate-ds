# CustomHero Component

A flexible, responsive Hero component with dynamic PNG background selection for the ELEVATE Design System.

## Features

- 🖼️ **Dynamic Background Selection**: Randomly picks PNG images from a specified folder
- 📱 **Responsive Design**: Optimized for all screen sizes and devices
- 🎨 **ELEVATE Integration**: Uses ELEVATE design tokens and components
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🌙 **Theme Support**: Light/dark theme compatibility
- ⚡ **Performance**: Optimized image loading with preloading
- 🎛️ **Customizable**: Flexible overlay options and styling

## Usage

### Basic Usage

```tsx
import CustomHero from '@site/src/components/CustomHero';

<CustomHero
  title="ELEVATE Design System"
  subtitle="A comprehensive design system for modern web applications"
/>
```

### Advanced Usage

```tsx
import CustomHero from '@site/src/components/CustomHero';

const heroActions = [
  { label: 'Get Started', href: '/docs/get-started', tone: 'primary', size: 'large' },
  { label: 'Components', href: '/docs/components', tone: 'neutral', size: 'large' },
  { label: 'Guidelines', href: '/docs/guidelines', tone: 'subtle', size: 'medium' }
];

const backgroundImages = [
  'hero-design-system.png',
  'hero-components.png',
  'hero-abstract.png'
];

<CustomHero
  title="Your Amazing Product"
  subtitle="Building the future of digital experiences"
  actions={heroActions}
  backgroundImages={backgroundImages}
  backgroundImageFolder="/img/custom-hero-backgrounds"
  overlay="gradient"
  className="custom-hero-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Main hero title |
| `subtitle` | `string` | Optional | Hero subtitle text |
| `backgroundImageFolder` | `string` | `'/img/hero-backgrounds'` | Folder path containing background images |
| `backgroundImages` | `string[]` | `['hero-bg-1.png', ...]` | Array of image filenames |
| `actions` | `HeroAction[]` | Default actions | Array of action buttons |
| `overlay` | `'light' \| 'dark' \| 'gradient'` | `'gradient'` | Overlay style for text readability |
| `className` | `string` | Optional | Additional CSS classes |

### HeroAction Interface

```tsx
interface HeroAction {
  label: string;           // Button text
  href: string;           // Link destination
  tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'emphasized' | 'subtle';
  size?: 'small' | 'medium' | 'large';
}
```

## Background Image Setup

### 1. Create Image Folder
```bash
mkdir -p static/img/hero-backgrounds
```

### 2. Add Your PNG Images
- **Format**: PNG (preferred) or JPG
- **Dimensions**: Minimum 1920x1080px (Full HD)
- **File Size**: Optimize for web (under 500KB)
- **Naming**: Use descriptive names

### 3. Update Component Props
```tsx
const backgroundImages = [
  'your-hero-bg-1.png',
  'your-hero-bg-2.png',
  'your-hero-bg-3.png'
];

<CustomHero
  backgroundImages={backgroundImages}
  backgroundImageFolder="/img/hero-backgrounds"
  // ... other props
/>
```

## Overlay Options

### `overlay="light"`
- Light overlay with blur effect
- Best for dark background images
- High contrast for dark text

### `overlay="dark"`  
- Dark overlay with blur effect
- Best for bright background images
- High contrast for light text

### `overlay="gradient"`
- ELEVATE brand gradient overlay
- Consistent with design system
- Good for any background image

## Responsive Behavior

- **Desktop**: Full height hero with large typography
- **Tablet**: Medium height with responsive text scaling
- **Mobile**: Compact height with stacked buttons
- **Actions**: Buttons stack vertically on small screens

## Accessibility

- ✅ Proper heading hierarchy (`h1` for title)
- ✅ High contrast text with shadows and overlays
- ✅ Keyboard navigation for action buttons
- ✅ Screen reader friendly structure
- ✅ Reduced motion support
- ✅ High contrast mode compatibility

## Customization

### Custom CSS
```css
.custom-hero-class {
  min-height: 80vh;
}

.custom-hero-class .heroTitle {
  font-size: 5rem;
}
```

### Theme Integration
The component automatically adapts to Docusaurus light/dark themes using ELEVATE design tokens.

## Examples

### Marketing Homepage
```tsx
<CustomHero
  title="Transform Your Digital Experience"
  subtitle="Build faster, design better, scale efficiently with our comprehensive design system"
  overlay="gradient"
  backgroundImages={['marketing-hero-1.png', 'marketing-hero-2.png']}
/>
```

### Documentation Site
```tsx
<CustomHero
  title="Developer Documentation"
  subtitle="Everything you need to build amazing applications"
  overlay="dark"
  actions={[
    { label: 'Quick Start', href: '/quick-start', tone: 'primary' },
    { label: 'API Reference', href: '/api', tone: 'neutral' }
  ]}
/>
```

### Product Launch
```tsx
<CustomHero
  title="Introducing Design System v2.0"
  subtitle="More components, better performance, enhanced accessibility"
  overlay="light"
  actions={[
    { label: 'Explore Features', href: '/v2/features', tone: 'success' },
    { label: 'Migration Guide', href: '/v2/migration', tone: 'warning' },
    { label: 'Download', href: '/v2/download', tone: 'primary' }
  ]}
/>
```