import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, Plugin} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ELEVATE Design System',
  tagline: 'A comprehensive design system built for modern web applications of INFORM GmbH',
  
  // Force deployment refresh - ensure ELEVATE CSS is included - 2025-01-27T18:40:00Z
  favicon: 'img/favicon.ico',
  
  // INFORM GmbH metadata - GitHub pages deployment config
  organizationName: 'owrede-inform', // GitHub org/user name for deployment
  projectName: 'elevate-ds', // GitHub repo name for deployment

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: process.env.DEPLOYMENT_ENV === 'github-pages'
    ? 'https://owrede-inform.github.io'
    : 'http://localhost:3000',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // For local development, always use '/' root path
  baseUrl: process.env.DEPLOYMENT_ENV === 'github-pages'
    ? '/elevate-ds/'
    : '/',

  // GitHub pages deployment config handled above in metadata section

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Local search plugin - temporarily disabled due to theme conflicts
    // Using custom search component via Navbar/Search swizzle instead
    // [
    //   require.resolve("@easyops-cn/docusaurus-search-local"),
    //   /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
    //   ({
    //     hashed: true,
    //     language: ["en"],
    //     highlightSearchTermsOnTargetPage: true,
    //     explicitSearchResultPath: false,
    //     indexDocs: true,
    //     indexBlog: false,
    //     indexPages: false,
    //     docsRouteBasePath: "docs",
    //     searchResultLimits: 8,
    //     searchResultContextMaxLength: 50,
    //     searchBarShortcutHint: false,
    //     searchBarPosition: "right"
    //   }),
    // ],
    // 'docusaurus-plugin-code-preview', // Temporarily disabled due to compatibility issue
    function(context: LoadContext, options: any): Plugin {
      return {
        name: 'code-examples-plugin',
        configureWebpack(config, isServer, utils) {
          if (!isServer) {
            config.devServer = {
              ...config.devServer,
                setupMiddlewares: (middlewares: any, devServer: any) => {
                  // Add middleware to serve code-examples folders as raw files
                  devServer.app.get(/^\/docs\/.*\/code-examples\/.*/, (req, res, next) => {
                    const path = require('path');
                    const fs = require('fs');

                    // Extract path from URL
                    const urlPath = req.url;
                    const match = urlPath.match(/^\/docs\/(.*?)\/code-examples\/(.*)$/);

                    if (match) {
                      const componentPath = match[1];
                      const fileName = match[2];
                      const filePath = path.join(context.siteDir, 'docs', componentPath, 'code-examples', fileName);

                      if (fs.existsSync(filePath)) {
                        const content = fs.readFileSync(filePath, 'utf8');
                        res.setHeader('Content-Type', 'text/html');
                        res.setHeader('Cache-Control', 'no-cache');
                        res.send(content);
                        return;
                      }
                    }
                    next();
                  });
                  return middlewares;
                }
              };
          }
        }
      };
    }
  ],


  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          // Remove edit URL for now - can be added later when repo is set up
          // editUrl: 'https://github.com/inform-elevate/elevate-ds/tree/main/',
          remarkPlugins: [],
          rehypePlugins: [],
          // Enable multiple sidebars functionality
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          // Configure sidebar behavior for multiple sidebars
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          // Custom sidebar generator for intelligent sorting
          sidebarItemsGenerator: require('./sidebarGenerator').customSidebarItemsGenerator,
          // Exclude code-examples from being processed as docs
          exclude: ['**/code-examples/**'],
        },
        blog: false, // Blog disabled - moved to sample-data
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],


  // Custom metadata for INFORM ELEVATE theme
  customFields: {
    themeName: 'docusaurus-theme-inform-elevate',
    themeVersion: '1.0.0',
    organization: 'INFORM GmbH',
    designSystem: 'ELEVATE',
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/elevate-social-card.jpg',
    
    // Color mode configuration
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    
    // Table of contents configuration - Disabled to use custom TocLinks component
    tableOfContents: {
      minHeadingLevel: 6,
      maxHeadingLevel: 6,
    },
    
    // Theme metadata
    metadata: [
      {name: 'theme-name', content: 'docusaurus-theme-inform-elevate'},
      {name: 'theme-version', content: '1.0.0'},
      {name: 'organization', content: 'INFORM GmbH'},
      {name: 'design-system', content: 'ELEVATE'},
      {name: 'keywords', content: 'INFORM, ELEVATE, Design System, Components, Documentation'},
      {name: 'author', content: 'INFORM GmbH'},
    ],
    navbar: {
      title: 'ELEVATE Design System',
      logo: {
        alt: 'INFORM Logo',
        src: 'img/inform-brand.svg',
        srcDark: 'img/inform-brand-dark.svg',
        width: 120,
        height: 24,
      },
      items: [
        // Main navigation
        {
          type: 'doc',
          docId: 'home/index',
          position: 'left',
          label: 'Home',
        },
        {
          type: 'doc',
          docId: 'design/index',
          position: 'left',
          label: 'Design',
        },
        {
          type: 'doc',
          docId: 'guidelines/index',
          position: 'left', 
          label: 'Guidelines',
        },
        {
          type: 'doc',
          docId: 'components/index',
          position: 'left',
          label: 'Components', 
        },
        // Search on the right
        {
          type: 'search',
          position: 'right',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'light',
      logo: {
        alt: 'INFORM Logo',
        src: 'img/inform-brand-footer.svg',
        srcDark: 'img/inform-brand-footer-dark.svg',
        width: 120,
        height: 18,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/home/overview',
            },
            {
              label: 'Components',
              to: 'docs/components',
            },
            {
              label: 'Design Tokens',
              to: 'docs/design-tokens',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Design Guidelines',
              to: 'docs/guidelines',
            },
            {
              label: 'Storybook',
              href: 'https://elevate-core-ui.inform-cloud.io',
            },
            {
              label: 'NPM Package',
              href: 'https://www.npmjs.com/package/@inform-elevate/elevate-core-ui',
            },
          ],
        },
        {
          title: 'Updates',
          items: [
            {
              label: 'Release Notes',
              to: 'blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} INFORM GmbH. ELEVATE Design System.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
