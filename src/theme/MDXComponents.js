import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import { Icon } from '@iconify/react';
import TocLinks from '@site/src/components/TocLinks';
import DocHeader from '@site/src/components/DocHeader';
import ComponentShowcase from '@site/src/components/ComponentShowcase';
import ComponentChangelog from '@site/src/components/ComponentChangelog';
import DesignTokenTable from '@site/src/components/DesignTokenTable';
import ColorRamp from '@site/src/components/ColorRamp';

// Create a wrapper component to ensure proper rendering
const IIcon = (props) => {
  return React.createElement(Icon, props);
};

export default {
  ...MDXComponents,
  // Iconify React component wrapper
  IIcon,
  // Common documentation components - globally available in all MDX files
  TocLinks,
  DocHeader,
  ComponentShowcase,
  ComponentChangelog,
  DesignTokenTable,
  ColorRamp,
};