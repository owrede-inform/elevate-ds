import type {LoadContext, Plugin} from '@docusaurus/types';
import type {ThemeConfig, Options} from './types';

export default function themeInformElevate(
  context: LoadContext,
  options: Options,
): Plugin<undefined> {
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