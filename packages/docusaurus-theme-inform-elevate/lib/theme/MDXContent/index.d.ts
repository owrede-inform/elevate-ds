import React, { type ReactNode } from 'react';
export interface Props {
    children: React.ReactNode;
}
export default function MDXContent({ children }: Props): ReactNode;
