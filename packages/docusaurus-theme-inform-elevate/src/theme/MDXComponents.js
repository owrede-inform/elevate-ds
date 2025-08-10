import React from 'react';
// Import from Docusaurus theme-classic
const MDXComponents = {};
import { Icon } from '@iconify/react';

// Create a wrapper component to ensure proper rendering
const IIcon = (props) => {
  return React.createElement(Icon, props);
};

export default {
  ...MDXComponents,
  IIcon,
};