// INFORM ELEVATE Theme
// Custom theme extending Docusaurus Classic for INFORM GmbH

module.exports = function(context, options) {
  return {
    name: 'docusaurus-theme-inform-elevate',
    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },
    getDefaultCodeTranslationMessages() {
      return require('@docusaurus/theme-classic/lib/getDefaultCodeTranslationMessages');
    },
  };
};