export interface Options {
  /**
   * Enable ELEVATE design system integration
   * @default true
   */
  enableElevateDesignSystem?: boolean;
  
  /**
   * Enable Material Design Icons via Iconify
   * @default true
   */
  enableMDIIcons?: boolean;
  
  /**
   * Custom ELEVATE theme variant
   * @default "default"
   */
  elevateThemeVariant?: 'default' | 'compact' | 'minimal';
  
  /**
   * INFORM branding options
   */
  informBranding?: {
    showLogo?: boolean;
    organizationName?: string;
    copyrightText?: string;
  };
}

export interface ThemeConfig {
  informElevate: {
    designSystem: Options;
  };
}