import React from 'react';

// React wrapper for ELEVATE Button component
interface ElvtButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  pill?: boolean;
  circle?: boolean;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  href?: string;
  target?: string;
  download?: string;
  children?: React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elvt-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & ElvtButtonProps, HTMLElement>;
    }
  }
}

export default function ElvtButton({
  children,
  variant = 'default',
  size = 'medium',
  ...props
}: ElvtButtonProps): JSX.Element {
  return (
    <elvt-button
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </elvt-button>
  );
}