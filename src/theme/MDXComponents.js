import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import { Icon } from '@iconify/react';
import TocLinks from '@site/src/components/TocLinks';
import DocHeader from '@site/src/components/DocHeader';
import ComponentShowcase from '@site/src/components/ComponentShowcase';
import ComponentChangelog from '@site/src/components/ComponentChangelog';
import DesignTokenTable from '@site/src/components/DesignTokenTable';
import ColorRamp from '@site/src/components/ColorRamp';
import PageCardGrid from '@site/src/components/PageCardGrid';
import ComponentTable from '@site/src/components/ComponentTable';

// Create a wrapper component to ensure proper rendering
const IIcon = (props) => {
  return React.createElement(Icon, props);
};

// ELEVATE Web Component wrappers for MDX - removed elvt-icon mapping to avoid API conflicts

const ElvtButton = (props) => {
  return React.createElement('elvt-button', props, props.children);
};

export default {
  ...MDXComponents,
  // Iconify React component wrapper
  IIcon,
  // ELEVATE Web Components - globally available in all MDX files
  'elvt-button': ElvtButton,
  // Common documentation components - globally available in all MDX files
  TocLinks,
  DocHeader,
  ComponentShowcase,
  ComponentChangelog,
  DesignTokenTable,
  ColorRamp,
  PageCardGrid,
  ComponentTable,
};