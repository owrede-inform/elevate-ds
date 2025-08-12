import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ELEVATE Design System',
  tagline: 'A comprehensive design system built for modern web applications by INFORM GmbH',
  favicon: 'img/favicon.ico',
  
  // INFORM GmbH metadata
  organizationName: 'INFORM GmbH',
  projectName: 'ELEVATE Design System',

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

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'owrede-inform', // Usually your GitHub org/user name.
  projectName: 'elevate-ds', // Usually your repo name.

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
    // 'docusaurus-plugin-code-preview', // Temporarily disabled due to compatibility issue
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
    
    // Table of contents configuration
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 2,
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
        {
          to: 'docs/home',
          position: 'left',
          label: 'Home',
        },
        {
          to: 'docs/guidelines',
          position: 'left',
          label: 'Guidelines',
        },
        {
          to: 'docs/components',
          position: 'left',
          label: 'Components',
        },
        {
          to: 'docs/patterns',
          position: 'left',
          label: 'Patterns',
        },
        {
          to: 'docs/design',
          position: 'left',
          label: 'Design',
        },
        {
          to: 'docs/ds',
          position: 'left',
          label: 'DS Components',
        },
        {to: 'blog', label: 'Updates', position: 'left'},
        {
          href: 'https://github.com/inform-elevate/',
          label: 'GitHub',
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
              label: 'GitHub',
              href: 'https://github.com/inform-elevate/',
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
            {
              label: 'Changelog',
              href: 'https://github.com/inform-elevate/',
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
