#!/usr/bin/env node

/**
 * Theme Package Sync Script
 * 
 * This script automatically syncs changes from the main Docusaurus site
 * to the exportable theme package, ensuring the theme remains portable
 * and independent from any core Docusaurus modifications.
 * 
 * Usage: node sync-theme-package.js [--watch] [--build]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');

// Configuration
const CONFIG = {
  sourceDir: './src',
  themePackageDir: './packages/docusaurus-theme-inform-elevate',
  excludePatterns: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/node_modules/**',
    '**/.git/**',
    '**/build/**',
    '**/.docusaurus/**'
  ],
  // Only sync theme-related files
  includedFiles: {
    'src/theme/': 'src/theme/',
    'src/css/custom.css': 'src/css/inform-elevate.css',
    'static/img/inform-brand.svg': 'static/img/inform-brand.svg',
    'static/img/inform-brand-dark.svg': 'static/img/inform-brand-dark.svg'
  },
  // Theme-essential dependencies (will be included as required)
  themeEssentialDeps: [
    '@inform-elevate/elevate-core-ui',
    '@iconify/react',
    'clsx'
  ],
  // Site-specific dependencies (will NOT be included in theme)
  siteOnlyDeps: [
    'docusaurus-plugin-code-preview',
    'chokidar'
  ],
  // Optional theme enhancements (will be peer dependencies)
  optionalThemeDeps: [
    // Add any optional plugins that enhance the theme
  ]
};

class ThemeSyncer {
  constructor() {
    this.themePackagePath = path.resolve(CONFIG.themePackageDir);
    this.isWatching = false;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  /**
   * Validate that no Docusaurus core files have been modified
   */
  validateCoreIntegrity() {
    this.log('🔍 Validating Docusaurus core integrity...');
    
    const corePackages = [
      '@docusaurus/core',
      '@docusaurus/preset-classic',
      '@docusaurus/theme-classic'
    ];
    
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    // Check if we're using standard versions
    for (const pkg of corePackages) {
      if (packageJson.dependencies[pkg]) {
        const version = packageJson.dependencies[pkg];
        if (version.includes('file:') || version.includes('link:')) {
          this.log(`❌ WARNING: ${pkg} appears to be locally linked/modified`, 'warning');
        } else {
          this.log(`✅ ${pkg}: ${version}`, 'success');
        }
      }
    }
    
    // Check for any modified files in node_modules (shouldn't happen in clean setup)
    const nodeModulesDocusaurus = './node_modules/@docusaurus';
    if (fs.existsSync(nodeModulesDocusaurus)) {
      try {
        // This would only work in a git repo, checking for any modified core files
        const gitStatus = execSync('git status --porcelain node_modules/@docusaurus', { 
          encoding: 'utf8', 
          stdio: 'pipe' 
        }).trim();
        
        if (gitStatus) {
          this.log('❌ WARNING: Detected modified Docusaurus core files in node_modules', 'warning');
          console.log(gitStatus);
        } else {
          this.log('✅ No modifications detected in Docusaurus core files', 'success');
        }
      } catch (error) {
        // Git command failed, probably not in repo or no changes
        this.log('✅ Core integrity check passed', 'success');
      }
    }
  }

  /**
   * Copy theme files to package directory
   */
  copyThemeFiles() {
    this.log('📁 Syncing theme files...');
    
    // Ensure theme package directories exist
    const themeSrcDir = path.join(this.themePackagePath, 'src');
    if (!fs.existsSync(themeSrcDir)) {
      fs.mkdirSync(themeSrcDir, { recursive: true });
    }
    
    // Copy each included file/directory
    for (const [source, destination] of Object.entries(CONFIG.includedFiles)) {
      const sourcePath = path.resolve(source);
      const destPath = path.join(this.themePackagePath, destination);
      
      if (fs.existsSync(sourcePath)) {
        this.copyRecursive(sourcePath, destPath);
        this.log(`✅ Synced: ${source} → ${destination}`, 'success');
      } else {
        this.log(`⚠️  Source not found: ${source}`, 'warning');
      }
    }
    
    // Post-process files for theme package compatibility
    this.transformThemeFiles();
  }

  /**
   * Transform files for theme package compatibility
   */
  transformThemeFiles() {
    this.log('🔄 Transforming files for theme package...');
    
    // Transform MDXComponents.js
    const mdxComponentsPath = path.join(this.themePackagePath, 'src/theme/MDXComponents.js');
    if (fs.existsSync(mdxComponentsPath)) {
      let content = fs.readFileSync(mdxComponentsPath, 'utf8');
      content = content.replace(
        'import MDXComponents from \'@theme-original/MDXComponents\';',
        '// Import from Docusaurus theme-classic\nconst MDXComponents = {};'
      );
      fs.writeFileSync(mdxComponentsPath, content);
      this.log('✅ Transformed MDXComponents.js for theme package', 'success');
    }
    
    // Transform MDXContent/index.tsx  
    const mdxContentPath = path.join(this.themePackagePath, 'src/theme/MDXContent/index.tsx');
    if (fs.existsSync(mdxContentPath)) {
      let content = fs.readFileSync(mdxContentPath, 'utf8');
      content = content.replace(
        'import MDXComponents from \'@theme/MDXComponents\';',
        'import MDXComponents from \'../MDXComponents\';'
      );
      content = content.replace(
        'import type {Props} from \'@theme/MDXContent\';',
        '\nexport interface Props {\n  children: React.ReactNode;\n}'
      );
      fs.writeFileSync(mdxContentPath, content);
      this.log('✅ Transformed MDXContent/index.tsx for theme package', 'success');
    }
  }
  
  /**
   * Recursively copy files/directories
   */
  copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src);
      files.forEach(file => {
        this.copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      // Ensure destination directory exists
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(src, dest);
    }
  }

  /**
   * Update package.json version and dependencies
   */
  updatePackageVersion() {
    this.log('📦 Updating theme package metadata...');
    
    const mainPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const themePackageJsonPath = path.join(this.themePackagePath, 'package.json');
    const themePackageJson = JSON.parse(fs.readFileSync(themePackageJsonPath, 'utf8'));
    
    // Update version (increment patch version)
    const currentVersion = themePackageJson.version;
    const versionParts = currentVersion.split('.');
    const newPatchVersion = parseInt(versionParts[2]) + 1;
    const newVersion = `${versionParts[0]}.${versionParts[1]}.${newPatchVersion}`;
    
    themePackageJson.version = newVersion;
    
    // Intelligently manage dependencies
    this.manageDependencies(mainPackageJson, themePackageJson);
    
    // Update last modified date
    themePackageJson.lastSync = new Date().toISOString();
    
    fs.writeFileSync(themePackageJsonPath, JSON.stringify(themePackageJson, null, 2));
    this.log(`✅ Updated theme package to version ${newVersion}`, 'success');
  }

  /**
   * Intelligently manage theme package dependencies
   */
  manageDependencies(mainPkg, themePkg) {
    this.log('🔗 Managing theme dependencies...');
    
    // Initialize dependency sections if they don't exist
    if (!themePkg.dependencies) themePkg.dependencies = {};
    if (!themePkg.peerDependencies) themePkg.peerDependencies = {};
    if (!themePkg.peerDependenciesMeta) themePkg.peerDependenciesMeta = {};
    
    // 1. Theme-essential dependencies (required)
    for (const dep of CONFIG.themeEssentialDeps) {
      if (mainPkg.dependencies[dep]) {
        themePkg.dependencies[dep] = mainPkg.dependencies[dep];
        this.log(`✅ Added essential dependency: ${dep}`, 'success');
      }
    }
    
    // 2. Core Docusaurus as peer dependency
    const docusaurusVersion = mainPkg.dependencies['@docusaurus/core'];
    if (docusaurusVersion) {
      themePkg.peerDependencies['@docusaurus/core'] = docusaurusVersion;
      themePkg.peerDependencies['@docusaurus/theme-classic'] = mainPkg.dependencies['@docusaurus/preset-classic'] || docusaurusVersion;
      themePkg.peerDependencies['react'] = mainPkg.dependencies['react'];
      themePkg.peerDependencies['react-dom'] = mainPkg.dependencies['react-dom'];
    }
    
    // 3. Optional theme enhancements as optional peer dependencies
    for (const dep of CONFIG.optionalThemeDeps) {
      if (mainPkg.dependencies[dep]) {
        themePkg.peerDependencies[dep] = mainPkg.dependencies[dep];
        themePkg.peerDependenciesMeta[dep] = { optional: true };
        this.log(`✅ Added optional peer dependency: ${dep}`, 'success');
      }
    }
    
    // 4. Remove site-only dependencies from theme package
    for (const dep of CONFIG.siteOnlyDeps) {
      if (themePkg.dependencies[dep]) {
        delete themePkg.dependencies[dep];
        this.log(`🗑️ Removed site-only dependency: ${dep}`, 'warning');
      }
      if (themePkg.peerDependencies[dep]) {
        delete themePkg.peerDependencies[dep];
        delete themePkg.peerDependenciesMeta[dep];
        this.log(`🗑️ Removed site-only peer dependency: ${dep}`, 'warning');
      }
    }
    
    this.log('✅ Dependency management completed', 'success');
  }

  /**
   * Build the theme package
   */
  buildThemePackage() {
    this.log('🔨 Building theme package...');
    
    try {
      // Change to theme package directory and build
      process.chdir(this.themePackagePath);
      execSync('npm run build', { stdio: 'pipe' });
      process.chdir('../../'); // Back to root
      
      this.log('✅ Theme package built successfully', 'success');
    } catch (error) {
      this.log(`❌ Build failed: ${error.message}`, 'error');
      process.chdir('../../'); // Ensure we're back to root
      throw error;
    }
  }

  /**
   * Validate theme package integrity
   */
  validateThemePackage() {
    this.log('🔍 Validating theme package...');
    
    const requiredFiles = [
      'package.json',
      'lib/index.js',
      'lib/index.d.ts',
      'src/theme/Logo/index.tsx',
      'src/theme/Root.tsx',
      'src/theme/MDXComponents.js',
      'src/css/inform-elevate.css'
    ];
    
    const issues = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.themePackagePath, file);
      if (!fs.existsSync(filePath)) {
        issues.push(`Missing required file: ${file}`);
      }
    }
    
    if (issues.length > 0) {
      this.log('❌ Theme package validation failed:', 'error');
      issues.forEach(issue => this.log(`  - ${issue}`, 'error'));
      throw new Error('Theme package validation failed');
    }
    
    this.log('✅ Theme package validation passed', 'success');
  }

  /**
   * Full sync process
   */
  async sync(options = {}) {
    try {
      this.log('🚀 Starting theme package sync...', 'info');
      
      // Step 1: Validate core integrity
      this.validateCoreIntegrity();
      
      // Step 2: Copy theme files
      this.copyThemeFiles();
      
      // Step 3: Update package metadata
      this.updatePackageVersion();
      
      // Step 4: Build package (if requested)
      if (options.build) {
        this.buildThemePackage();
      }
      
      // Step 5: Validate result
      this.validateThemePackage();
      
      this.log('🎉 Theme package sync completed successfully!', 'success');
      
    } catch (error) {
      this.log(`❌ Sync failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  /**
   * Watch for changes and auto-sync
   */
  watch() {
    if (this.isWatching) return;
    
    this.log('👀 Starting watch mode...', 'info');
    this.isWatching = true;
    
    const watchPaths = Object.keys(CONFIG.includedFiles);
    
    const watcher = chokidar.watch(watchPaths, {
      ignored: CONFIG.excludePatterns,
      persistent: true,
      ignoreInitial: true
    });
    
    let syncTimeout;
    
    watcher.on('change', (filePath) => {
      this.log(`📝 Detected change: ${filePath}`, 'info');
      
      // Debounce syncs (wait 1 second after last change)
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        this.sync({ build: false });
      }, 1000);
    });
    
    watcher.on('error', error => {
      this.log(`❌ Watcher error: ${error}`, 'error');
    });
    
    this.log('✅ Watch mode active. Monitoring theme files for changes...', 'success');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    watch: args.includes('--watch'),
    build: args.includes('--build') || args.includes('-b')
  };
  
  const syncer = new ThemeSyncer();
  
  // Initial sync
  await syncer.sync(options);
  
  // Start watching if requested
  if (options.watch) {
    syncer.watch();
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping theme sync...');
      process.exit(0);
    });
    
    // Keep alive
    setInterval(() => {}, 1000);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { ThemeSyncer };