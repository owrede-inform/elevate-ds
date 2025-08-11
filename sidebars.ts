import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main sidebar with organized structure
  tutorialSidebar: [
    'get-started',
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/index',
        {
          type: 'category', 
          label: 'Form Components',
          collapsed: false,
          items: [
            'components/input/index',
            'components/select/index',
            'components/checkbox/index',
            'components/radio/index',
            'components/switch/index',
          ],
        },
        {
          type: 'category',
          label: 'Action Components', 
          collapsed: false,
          items: [
            'components/button/index',
          ],
        },
        {
          type: 'category',
          label: 'Layout Components',
          collapsed: false,
          items: [
            'components/card/index',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorial Basics',
      items: [
        'tutorial/tutorial-basics/intro',
        'tutorial/tutorial-basics/create-a-document',
        'tutorial/tutorial-basics/create-a-blog-post',
        'tutorial/tutorial-basics/create-a-page',
        'tutorial/tutorial-basics/markdown-features',
        'tutorial/tutorial-basics/deploy-your-site',
        'tutorial/tutorial-basics/congratulations',
      ],
    },
    {
      type: 'category',
      label: 'Tutorial Extras',
      items: [
        'tutorial-extras/manage-docs-versions',
        'tutorial-extras/translate-your-site',
      ],
    },
    {
      type: 'category',
      label: 'Tests',
      items: [
        'tests/component-samples',
        'tests/elevate-components-test',
        'tests/test-icons',
      ],
    },
  ],
};

export default sidebars;
