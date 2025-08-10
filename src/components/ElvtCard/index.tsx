import React from 'react';

// React wrapper for ELEVATE Card component
interface ElvtCardProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elvt-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & ElvtCardProps, HTMLElement>;
    }
  }
}

export default function ElvtCard({
  children,
  ...props
}: ElvtCardProps): JSX.Element {
  return (
    <elvt-card {...props}>
      {children}
    </elvt-card>
  );
}