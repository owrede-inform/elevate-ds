import React from 'react';

// React wrapper for ELEVATE Input component
interface ElvtInputProps extends React.InputHTMLAttributes<HTMLElement> {
  type?: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url';
  size?: 'small' | 'medium' | 'large';
  filled?: boolean;
  pill?: boolean;
  label?: string;
  helpText?: string;
  clearable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elvt-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & ElvtInputProps, HTMLElement>;
    }
  }
}

export default function ElvtInput({
  label,
  helpText,
  ...props
}: ElvtInputProps): JSX.Element {
  return (
    <elvt-input
      label={label}
      help-text={helpText}
      {...props}
    />
  );
}