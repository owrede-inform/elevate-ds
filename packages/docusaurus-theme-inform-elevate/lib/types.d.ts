export interface Options {
    enableElevateDesignSystem?: boolean;
    enableMDIIcons?: boolean;
    elevateThemeVariant?: 'default' | 'compact' | 'minimal';
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
