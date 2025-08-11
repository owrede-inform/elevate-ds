# ELEVATE Changelog Generation Scripts

🚀 **Automated changelog generation for ELEVATE Design System components**

## Quick Start

```bash
# Interactive mode - easiest way to get started
npm run changelog

# Generate changelog for specific component
npm run changelog:component elvt-button

# Generate changelogs for all components
npm run changelog:all
```

## Scripts Overview

### 📋 `changelog-cli.js` - Interactive CLI
**Recommended for most users**

- User-friendly interactive interface
- Guides you through options step-by-step
- Perfect for occasional use

```bash
npm run changelog
```

### ⚙️ `generate-changelog.js` - Advanced Generator
**For automation and advanced use cases**

Full-featured changelog generator with CLI arguments:

```bash
# Basic usage
node scripts/generate-changelog.js --component elvt-button

# Advanced options
node scripts/generate-changelog.js --component elvt-input --version 0.0.29-alpha --update

# Generate for all components
node scripts/generate-changelog.js --all

# Since specific version
node scripts/generate-changelog.js --component elvt-button --since v0.0.27-alpha
```

**Available Options:**
- `--component, -c <name>` - Target specific component
- `--all` - Generate for all discovered components
- `--version <version>` - Override version number
- `--update` - Update existing changelog
- `--since <version>` - Include commits since version
- `--help, -h` - Show help information

### 🎨 `changelog-templates.js` - Template System
Pre-defined templates for consistent changelog entries:

```javascript
const { generateFromTemplate, createEmptyChangelog } = require('./changelog-templates');

// Create empty changelog
const changelog = createEmptyChangelog('elvt-button', '0.0.28-alpha');

// Generate from template
const featureChangelog = generateFromTemplate('elvt-input', 'feature', {
  version: '0.0.29-alpha'
});
```

## Features

### 🔍 **Auto-Discovery**
- Scans for components in multiple sources
- Finds existing changelog files
- Discovers component info files
- Identifies ELEVATE component patterns

### 📝 **Smart Commit Parsing**
- Analyzes git commit history
- Extracts change types automatically
- Identifies breaking changes
- Links issues and commits
- Determines impact categories

### 📊 **Rich Changelog Data**
Generated changelogs include:
- **Version History** - Complete version timeline
- **Change Details** - Type, impact, description
- **Breaking Changes** - Migration guides and examples
- **API Changes** - New methods, properties, events
- **Metadata** - Statistics and repository info

### 🎯 **Multiple Output Modes**
- **Single Component** - Focus on one component
- **All Components** - Batch generation
- **Update Mode** - Add to existing changelogs
- **Template Mode** - Use predefined templates

## Changelog Structure

Each component changelog follows this structure:

```json
{
  "component": "elvt-button",
  "version": "0.0.28-alpha",
  "lastUpdated": "2025-08-11T20:00:00Z",
  "changelog": [
    {
      "version": "0.0.28-alpha",
      "date": "2025-08-11",
      "type": "patch",
      "changes": [
        {
          "type": "bug-fix",
          "title": "Fix Button Group Styling",
          "description": "Resolved visual issues with button groups",
          "commit": "abc123def456",
          "issueNumber": 235,
          "impact": "visual",
          "breakingChange": false
        }
      ]
    }
  ],
  "deprecations": [],
  "upcomingChanges": [],
  "metadata": {
    "totalVersions": 1,
    "firstVersion": "0.0.28-alpha",
    "storyCount": 11,
    "testCount": 3,
    "fileCount": 4,
    "lastCommit": "abc123def456"
  }
}
```

## Change Types

- **`feature`** - New functionality or capabilities
- **`bug-fix`** - Bug fixes and corrections
- **`breaking-change`** - Breaking API changes
- **`improvement`** - Performance, UX, or code improvements
- **`deprecation`** - Deprecated features or APIs

## Impact Categories

- **`visual`** - Visual appearance changes
- **`api`** - API or interface changes
- **`functionality`** - Behavior or feature changes
- **`performance`** - Performance improvements
- **`design`** - Design system changes
- **`developer-experience`** - DX improvements

## Examples

### Generate for Single Component
```bash
# Interactive mode
npm run changelog
# Choose option 1, then select elvt-button

# Direct mode
npm run changelog:component elvt-button
```

### Update Existing Changelog
```bash
# Interactive mode
npm run changelog
# Choose option 3, then select component

# Direct mode
node scripts/generate-changelog.js --component elvt-button --version 0.0.29-alpha --update
```

### Batch Generation
```bash
# Generate for all components
npm run changelog:all

# Or interactive
npm run changelog
# Choose option 2
```

### Custom Version Range
```bash
# Only commits since v0.0.27-alpha
node scripts/generate-changelog.js --component elvt-button --since v0.0.27-alpha
```

## Output Location

All generated changelog files are saved to:
```
static/component-changelogs/{component-name}-changes.json
```

These files are automatically served by the Docusaurus site and consumed by the `ComponentChangelog` React component.

## Integration with Documentation

The generated JSON files are consumed by:
- `src/components/ComponentChangelog/index.tsx` - React component
- Component documentation pages - Automatic changelog sections
- Release notes - Aggregated change summaries

## Troubleshooting

### Common Issues

**"No commits found"**
- Component name might not match commit patterns
- Try `--since` option to include more history
- Check git history with `git log --grep="component-name"`

**"Component not discovered"**
- Add component to `KNOWN_COMPONENTS` in `generate-changelog.js`
- Use exact component name (e.g., `elvt-button`, not `button`)
- Check component exists in codebase

**"Permission denied"**
- Ensure `static/component-changelogs/` directory exists
- Check file permissions for writing
- Run with appropriate user permissions

### Debug Mode
Add `DEBUG=1` environment variable for verbose output:
```bash
DEBUG=1 npm run changelog:component elvt-button
```

## Contributing

To add new features or templates:

1. **New Templates** - Add to `changelog-templates.js`
2. **New Components** - Add to `KNOWN_COMPONENTS` array
3. **Change Types** - Update `CONFIG.changeTypes` mapping
4. **Impact Categories** - Update `CONFIG.impactTypes` mapping

---

**💡 Pro Tips:**
- Use interactive mode for exploration and one-off tasks
- Use direct CLI mode for automation and scripts  
- Update existing changelogs regularly with new versions
- Review generated changelogs before committing
- Customize templates for your specific needs