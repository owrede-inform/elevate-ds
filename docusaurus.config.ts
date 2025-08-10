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
  url: 'https://owrede-inform.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/elevate-ds/',

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
          // Remove edit URL for now - can be added later when repo is set up
          // editUrl: 'https://github.com/inform-elevate/elevate-ds/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Remove edit URL for now - can be added later when repo is set up
          // editUrl: 'https://github.com/inform-elevate/elevate-ds/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
          type: 'doc',
          docId: 'get-started',
          position: 'left',
          label: 'Get Started',
        },
        {
          label: 'Components',
          position: 'left',
          items: [
            {
              label: 'Button',
              to: '/docs/components/button',
            },
            {
              label: 'Input',
              to: '/docs/components/input',
            },
            {
              label: 'Card',
              to: '/docs/components/card',
            },
          ],
        },
        {
          label: 'Design Tokens',
          to: '/docs/design-tokens',
          position: 'left',
        },
        {to: '/blog', label: 'Updates', position: 'left'},
        {
          href: 'https://github.com/owrede-inform/elevate-ds',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/get-started',
            },
            {
              label: 'Components',
              to: '/docs/components',
            },
            {
              label: 'Design Tokens',
              to: '/docs/design-tokens',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Docusaurus Tutorial',
              to: '/docs/intro',
            },
            {
              label: 'Storybook',
              href: 'https://elevate-core-ui.inform-cloud.io',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/owrede-inform/elevate-ds',
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
              to: '/blog',
            },
            {
              label: 'Changelog',
              href: 'https://github.com/owrede-inform/elevate-ds/releases',
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
