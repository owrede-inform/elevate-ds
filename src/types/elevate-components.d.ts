/**
 * TypeScript declarations for ELEVATE web components
 * Auto-generated type definitions for ELEVATE Design System components
 */

import * as React from 'react';

declare global {
  namespace JSX {
  interface IntrinsicElements {
    // ELEVATE Core Components
    'elvt-alert': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      size?: 'small' | 'medium' | 'large';
      open?: boolean;
      closable?: boolean;
      duration?: number;
    }, HTMLElement>;

    'elvt-application': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      theme?: 'light' | 'dark' | 'auto';
      root?: boolean;
    }, HTMLElement>;

    'elvt-avatar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      image?: string;
      label?: string;
      initials?: string;
      loading?: 'eager' | 'lazy';
      size?: 'small' | 'medium' | 'large' | 'x-large';
      shape?: 'circle' | 'rounded' | 'square';
    }, HTMLElement>;

    'elvt-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      size?: 'small' | 'medium' | 'large';
      pill?: boolean;
      pulse?: boolean;
    }, HTMLElement>;

    'elvt-banner': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      open?: boolean;
      closable?: boolean;
    }, HTMLElement>;

    'elvt-breadcrumb': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
    }, HTMLElement>;

    'elvt-breadcrumb-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      href?: string;
      target?: string;
      rel?: string;
    }, HTMLElement>;

    'elvt-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
      size?: 'small' | 'medium' | 'large';
      caret?: boolean;
      disabled?: boolean;
      loading?: boolean;
      outline?: boolean;
      pill?: boolean;
      circle?: boolean;
      type?: 'button' | 'submit' | 'reset';
      name?: string;
      value?: string;
      form?: string;
      formaction?: string;
      formenctype?: string;
      formmethod?: string;
      formnovalidate?: boolean;
      formtarget?: string;
      href?: string;
      target?: string;
      download?: string;
      rel?: string;
    }, HTMLElement>;

    'elvt-button-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
    }, HTMLElement>;

    'elvt-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'elvt-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      value?: string;
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      checked?: boolean;
      indeterminate?: boolean;
      required?: boolean;
      form?: string;
    }, HTMLElement>;

    'elvt-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      size?: 'small' | 'medium' | 'large';
      pill?: boolean;
      removable?: boolean;
    }, HTMLElement>;

    'elvt-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      label?: string;
      'no-header'?: boolean;
    }, HTMLElement>;

    'elvt-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      vertical?: boolean;
    }, HTMLElement>;

    'elvt-drawer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      label?: string;
      placement?: 'top' | 'end' | 'bottom' | 'start';
      contained?: boolean;
      'no-header'?: boolean;
    }, HTMLElement>;

    'elvt-dropdown': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      placement?: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
      disabled?: boolean;
      'stay-open-on-select'?: boolean;
      distance?: number;
      skidding?: number;
      hoist?: boolean;
    }, HTMLElement>;

    'elvt-expansion-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      summary?: string;
      disabled?: boolean;
    }, HTMLElement>;

    'elvt-expansion-panel-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'allow-multiple'?: boolean;
    }, HTMLElement>;

    'elvt-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
      'help-text'?: string;
      'error-text'?: string;
      size?: 'small' | 'medium' | 'large';
      required?: boolean;
      'label-placement'?: 'start' | 'top';
    }, HTMLElement>;

    'elvt-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      src?: string;
      label?: string;
      library?: string;
    }, HTMLElement>;

    'elvt-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      library?: string;
      src?: string;
      href?: string;
      target?: string;
      download?: string;
      label?: string;
      disabled?: boolean;
      size?: 'small' | 'medium' | 'large';
    }, HTMLElement>;

    'elvt-indicator': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      pulse?: boolean;
    }, HTMLElement>;

    'elvt-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      type?: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url';
      name?: string;
      value?: string;
      'default-value'?: string;
      size?: 'small' | 'medium' | 'large';
      filled?: boolean;
      pill?: boolean;
      label?: string;
      'help-text'?: string;
      'error-text'?: string;
      clearable?: boolean;
      disabled?: boolean;
      placeholder?: string;
      readonly?: boolean;
      'password-toggle'?: boolean;
      'password-visible'?: boolean;
      'no-spin-buttons'?: boolean;
      form?: string;
      required?: boolean;
      pattern?: string;
      minlength?: number;
      maxlength?: number;
      min?: number | string;
      max?: number | string;
      step?: number | 'any';
      autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
      autocorrect?: 'off' | 'on';
      autocomplete?: string;
      autofocus?: boolean;
      enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
      spellcheck?: boolean;
      inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    }, HTMLElement>;

    'elvt-lightbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
    }, HTMLElement>;

    'elvt-link': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      href?: string;
      target?: string;
      download?: string;
      rel?: string;
    }, HTMLElement>;

    'elvt-loading': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      size?: 'small' | 'medium' | 'large';
      track?: string;
      indicator?: string;
      'stroke-width'?: number;
    }, HTMLElement>;

    'elvt-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'elvt-menu-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      type?: 'normal' | 'checkbox';
      checked?: boolean;
      value?: string;
      disabled?: boolean;
      loading?: boolean;
    }, HTMLElement>;

    'elvt-modal': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      label?: string;
      'no-header'?: boolean;
    }, HTMLElement>;

    'elvt-mutation-observer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      attr?: string;
      'attr-old-value'?: boolean;
      'char-data'?: boolean;
      'char-data-old-value'?: boolean;
      'child-list'?: boolean;
      disabled?: boolean;
    }, HTMLElement>;

    'elvt-notification': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      closable?: boolean;
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      duration?: number;
    }, HTMLElement>;

    'elvt-pagination': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      page?: number;
      pages?: number;
      'per-page'?: number;
      total?: number;
      'show-first-last'?: boolean;
    }, HTMLElement>;

    'elvt-paginator': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'first-page'?: number;
      'last-page'?: number;
      page?: number;
      'total-pages'?: number;
    }, HTMLElement>;

    'elvt-popup': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      anchor?: string;
      placement?: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
      disabled?: boolean;
      distance?: number;
      skidding?: number;
      arrow?: boolean;
      'arrow-placement'?: 'start' | 'end' | 'center' | 'anchor';
      'arrow-padding'?: number;
      flip?: boolean;
      'flip-fallback-placements'?: string;
      'flip-fallback-strategy'?: 'best-fit' | 'initial';
      'flip-padding'?: number;
      shift?: boolean;
      'shift-padding'?: number;
      'auto-size'?: 'horizontal' | 'vertical' | 'both';
      'auto-size-padding'?: number;
      'hover-bridge'?: boolean;
    }, HTMLElement>;

    'elvt-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      value?: number;
      min?: number;
      max?: number;
      label?: string;
      'show-label'?: boolean;
    }, HTMLElement>;

    'elvt-radio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      value?: string;
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      checked?: boolean;
      required?: boolean;
      form?: string;
    }, HTMLElement>;

    'elvt-radio-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
      'help-text'?: string;
      'error-text'?: string;
      name?: string;
      value?: string;
      'default-value'?: string;
      size?: 'small' | 'medium' | 'large';
      form?: string;
      required?: boolean;
    }, HTMLElement>;

    'elvt-resize-observer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
    }, HTMLElement>;

    'elvt-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      value?: string | string[];
      'default-value'?: string | string[];
      size?: 'small' | 'medium' | 'large';
      placeholder?: string;
      multiple?: boolean;
      'max-options-visible'?: number;
      disabled?: boolean;
      clearable?: boolean;
      open?: boolean;
      hoist?: boolean;
      filled?: boolean;
      pill?: boolean;
      label?: string;
      'help-text'?: string;
      'error-text'?: string;
      form?: string;
      required?: boolean;
      'get-tag'?: (option: any, index: number) => string;
    }, HTMLElement>;

    'elvt-skeleton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      effect?: 'pulse' | 'sheen' | 'none';
    }, HTMLElement>;

    'elvt-stack': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      direction?: 'horizontal' | 'vertical';
      spacing?: 'none' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | '2x-large' | '3x-large' | '4x-large';
      alignment?: 'start' | 'center' | 'end' | 'stretch';
      distribution?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
      wrap?: boolean;
    }, HTMLElement>;

    'elvt-stepper': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      min?: number;
      max?: number;
      step?: number;
      value?: number;
      disabled?: boolean;
      size?: 'small' | 'medium' | 'large';
    }, HTMLElement>;

    'elvt-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      value?: string;
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      checked?: boolean;
      required?: boolean;
      form?: string;
    }, HTMLElement>;

    'elvt-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      slot?: string;
      panel?: string;
      active?: boolean;
      closable?: boolean;
      disabled?: boolean;
    }, HTMLElement>;

    'elvt-tab-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      placement?: 'top' | 'bottom' | 'start' | 'end';
      activation?: 'auto' | 'manual';
      'no-scroll-controls'?: boolean;
      'scroll-distance'?: number;
    }, HTMLElement>;

    'elvt-tab-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      active?: boolean;
    }, HTMLElement>;

    'elvt-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'no-header'?: boolean;
    }, HTMLElement>;

    'elvt-table-cell': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'elvt-table-column': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      sortable?: boolean;
      'sort-direction'?: 'asc' | 'desc';
    }, HTMLElement>;

    'elvt-table-row': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      selected?: boolean;
    }, HTMLElement>;

    'elvt-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      placement?: 'top' | 'bottom' | 'start' | 'end';
      activation?: 'auto' | 'manual';
      'no-scroll-controls'?: boolean;
      'scroll-distance'?: number;
    }, HTMLElement>;

    'elvt-tag': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
      size?: 'small' | 'medium' | 'large';
      pill?: boolean;
      removable?: boolean;
    }, HTMLElement>;

    'elvt-textarea': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      name?: string;
      value?: string;
      'default-value'?: string;
      size?: 'small' | 'medium' | 'large';
      filled?: boolean;
      label?: string;
      'help-text'?: string;
      'error-text'?: string;
      placeholder?: string;
      rows?: number;
      resize?: 'none' | 'vertical' | 'auto';
      disabled?: boolean;
      readonly?: boolean;
      form?: string;
      required?: boolean;
      minlength?: number;
      maxlength?: number;
      autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
      autocorrect?: 'off' | 'on';
      autocomplete?: string;
      autofocus?: boolean;
      enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
      spellcheck?: boolean;
      inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    }, HTMLElement>;

    'elvt-toast': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      closable?: boolean;
      variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      duration?: number;
    }, HTMLElement>;

    'elvt-toolbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
    }, HTMLElement>;

    'elvt-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      content?: string;
      placement?: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
      disabled?: boolean;
      distance?: number;
      open?: boolean;
      skidding?: number;
      trigger?: 'hover focus' | 'click' | 'manual';
      hoist?: boolean;
    }, HTMLElement>;

    'elvt-visually-hidden': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}