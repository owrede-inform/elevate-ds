# ELEVATE Component Changelog Automation System

This document outlines the automated system for maintaining per-component changelog information using JSON files and React components for dynamic rendering.

## System Overview

The changelog system consists of three main components:

1. **JSON Schema & Data Files** - Structured changelog data per component
2. **Developer Automation Script** - PowerShell script to generate JSON from Git history
3. **React Component** - Dynamic rendering component for documentation pages

## 🔧 For ELEVATE Core UI Developers

### Quick Setup

1. **Run the generation script** (from elevate-ds repository):
```powershell
# One-time setup
.\scripts\generate-component-changelog-json.ps1 -ElevateCoreUIPath "C:\path\to\elevate-core-ui" -ElevateDocsPath "."

# Regular updates (on release)
.\scripts\generate-component-changelog-json.ps1 -ElevateCoreUIPath "C:\path\to\elevate-core-ui" -ElevateDocsPath "." -UpdateExisting
```

2. **The script generates JSON files** in the static directory:
```
static/component-changelogs/
├── elvt-button-changes.json
├── elvt-select-changes.json
├── elvt-input-changes.json
└── ...
```

### JSON Schema

Each component changelog follows this structure:

```typescript
interface ComponentChangelogData {
  component: string;              // "elvt-button"
  version: string;               // Current version from package.json
  lastUpdated: string;           // ISO timestamp
  changelog: VersionEntry[];     // Array of version histories
  deprecations: any[];           // Future deprecation notices
  upcomingChanges: any[];        // Planned changes
  metadata: {
    totalVersions: number;
    firstVersion: string;
    storyCount: number;
    testCount: number;
    fileCount: number;
    lastCommit: string;
  };
}

interface VersionEntry {
  version: string;               // "0.0.28-alpha"
  date: string;                 // "2025-08-11"
  type: "major" | "minor" | "patch";
  changes: ChangelogEntry[];
}

interface ChangelogEntry {
  type: "feature" | "bug-fix" | "breaking-change" | "improvement" | "deprecation";
  title: string;
  description: string;
  commit: string;               // Full commit hash
  issueNumber?: number;         // GitHub issue number
  impact: "visual" | "api" | "functionality" | "performance" | "design" | "developer-experience";
  breakingChange: boolean;
  migration?: {                 // For breaking changes
    description: string;
    before?: string;            // Code example
    after?: string;             // Code example
  };
  apiAdditions?: Array<{        // For new API features
    method?: string;
    property?: string;
    description: string;
  }>;
}
```

### Automation Integration

**Recommended CI/CD Integration:**

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  update-docs:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate Component Changelogs
        run: |
          .\scripts\generate-component-changelog-json.ps1 `
            -ElevateCoreUIPath "." `
            -ElevateDocsPath "${{ secrets.ELEVATE_DOCS_PATH }}" `
            -UpdateExisting
      
      - name: Commit Updated Changelogs
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/components/*/elvt-*-changes.json
          git commit -m "📄 Update component changelogs for ${{ github.ref_name }}" || exit 0
          git push
```

## 📖 For Documentation Site Users

### Using the ComponentChangelog Component

Import and use in any MDX file:

```mdx
---
title: Button Component
---

import ComponentChangelog from '@site/src/components/ComponentChangelog';

# Button

Component documentation content...

## Changelog

<ComponentChangelog 
  component="elvt-button"
  maxVersions={5}
  showMetadata={true}
  compactMode={false}
/>
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `string` | required | Component name (e.g., "elvt-button") |
| `maxVersions` | `number` | `3` | Max versions to show by default |
| `showMetadata` | `boolean` | `true` | Show component stats (stories, tests, files) |
| `compactMode` | `boolean` | `false` | Use compact layout for sidebars |

### Features

- **🔄 Automatic Loading**: Fetches JSON data automatically based on component name
- **📊 Rich Metadata**: Shows story count, test count, file count, version info
- **🎯 Smart Categorization**: Groups changes by type (features, bug fixes, breaking changes)
- **🔗 GitHub Integration**: Direct links to commits and issues
- **📱 Responsive Design**: Works on mobile and desktop
- **♿ Accessible**: Screen reader friendly with proper ARIA labels
- **🎨 Theme Integration**: Follows Docusaurus theming

### Display Features

- **Expandable Versions**: Click version headers to expand/collapse
- **Change Type Icons**: Visual indicators for different change types
- **Impact Badges**: Color-coded impact indicators
- **Breaking Change Warnings**: Clear visual indicators for breaking changes
- **Migration Guides**: Code examples for breaking changes
- **API Addition Highlighting**: Special sections for new API features
- **Commit & Issue Links**: Direct GitHub integration

## 🏗️ System Architecture

```
ELEVATE Core UI Repository
├── src/components/button/...
├── CHANGELOG.md (global)
├── scripts/generate-component-changelog-json.ps1 ✅
└── Git History

    ↓ (Automated Script)

ELEVATE Docs Repository  
├── docs/components/button/
│   └── index.mdx
├── static/component-changelogs/ ✅
│   └── elvt-button-changes.json
├── src/components/ComponentChangelog/ ✅
│   ├── index.tsx
│   └── styles.module.css
└── Documentation Site

    ↓ (React Component)

Live Documentation
├── Component Page
├── Interactive Changelog ✅
├── Version History
└── Migration Guides
```

## 🚀 Benefits

### For Developers
- **⚡ Automated**: No manual changelog maintenance
- **🔄 Git-Driven**: Uses existing commit messages and PR data
- **📊 Rich Context**: Includes metadata, file counts, test coverage
- **🔗 Integrated**: Links to commits, issues, and documentation

### For Documentation Users
- **📱 Interactive**: Expandable, searchable changelog interface
- **🎯 Focused**: Per-component instead of global changelog
- **📊 Visual**: Icons, badges, and categorization
- **♿ Accessible**: Screen reader friendly and keyboard navigable

### For Project Maintainers
- **🔧 Maintainable**: JSON files easier to update than embedded MDX
- **📈 Scalable**: Handles dozens of components efficiently
- **🎨 Customizable**: Easy to modify display and formatting
- **🔄 Future-Proof**: Can extend schema without breaking existing pages

## 🔄 Update Workflow

### Regular Release Process
1. **ELEVATE Team**: Run script after tagging new version
2. **Automated**: CI/CD updates JSON files automatically
3. **Documentation**: Changes appear immediately on next build
4. **Users**: See rich, interactive changelog with zero manual work

### Manual Updates (if needed)
1. Edit JSON files directly in `docs/components/{component}/elvt-{component}-changes.json`
2. Follow the schema structure
3. Component automatically picks up changes

## 🎯 Future Enhancements

### Planned Features
- **📊 Analytics**: Track which changelog sections are viewed most
- **🔍 Search**: Global search across all component changelogs
- **📱 Notifications**: Subscribe to component-specific updates
- **🏷️ Tags**: Filter changes by impact type or semantic versioning
- **📈 Trends**: Visualize component change frequency and patterns
- **🤖 AI Summary**: Automatically generate release notes from changes

### Integration Opportunities
- **📧 Email Notifications**: Alert subscribers to component updates
- **🔌 Webhook Integration**: Notify external systems of component changes
- **📱 Mobile App**: Dedicated mobile interface for changelog browsing
- **🔄 Version Comparison**: Side-by-side comparison of component versions

## 📞 Support & Maintenance

- **JSON Schema Updates**: Modify TypeScript interfaces in `ComponentChangelog/index.tsx`
- **Styling Changes**: Update `ComponentChangelog/styles.module.css`
- **Script Issues**: Check PowerShell execution policy and Git repository access
- **Display Problems**: Verify JSON file structure and component props

This system provides a robust, automated solution for maintaining component-specific changelogs while delivering an excellent user experience for developers and documentation readers.