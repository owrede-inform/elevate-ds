import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import { Icon } from '@iconify/react';
import TocLinks from '@site/src/components/TocLinks';
import DocHeader from '@site/src/components/DocHeader';

// Create a wrapper component to ensure proper rendering
const IIcon = (props) => {
  return React.createElement(Icon, props);
};

export default {
  ...MDXComponents,
  IIcon,
  TocLinks,
  DocHeader,
};