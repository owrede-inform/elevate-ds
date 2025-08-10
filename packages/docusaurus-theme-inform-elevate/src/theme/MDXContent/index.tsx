import React, {type ReactNode} from 'react';
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '../MDXComponents';

export interface Props {
  children: React.ReactNode;
}

export default function MDXContent({children}: Props): ReactNode {
  return <MDXProvider components={MDXComponents}>{children}</MDXProvider>;
}
