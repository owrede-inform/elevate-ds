"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = themeInformElevate;
function themeInformElevate(context, options) {
    return {
        name: '@inform/docusaurus-theme-elevate',
        getThemePath() {
            return '../lib/theme';
        },
        getTypeScriptThemePath() {
            return '../src/theme';
        },
        getDefaultCodeTranslationMessages() {
            return require('@docusaurus/theme-classic/lib/getDefaultCodeTranslationMessages');
        },
        configureWebpack(config, isServer) {
            return {
                resolve: {
                    alias: {
                        '@theme-original': require.resolve('@docusaurus/theme-classic/lib/theme'),
                    },
                },
            };
        },
    };
}
