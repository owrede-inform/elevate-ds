import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import { Icon } from '@iconify/react';

// Create a wrapper component to ensure proper rendering
const IIcon = (props) => {
  return React.createElement(Icon, props);
};

export default {
  ...MDXComponents,
  IIcon,
};