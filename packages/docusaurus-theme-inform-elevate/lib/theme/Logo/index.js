"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logo;
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("@docusaurus/Link"));
const useBaseUrl_1 = __importDefault(require("@docusaurus/useBaseUrl"));
const useDocusaurusContext_1 = __importDefault(require("@docusaurus/useDocusaurusContext"));
const theme_common_1 = require("@docusaurus/theme-common");
function Logo() {
    const { siteConfig: { title }, } = (0, useDocusaurusContext_1.default)();
    const { navbar: { logo, title: navbarTitle }, } = (0, theme_common_1.useThemeConfig)();
    const logoLink = (0, useBaseUrl_1.default)(logo?.href || '/');
    const logoAlt = logo?.alt || title;
    const logoSrc = (0, useBaseUrl_1.default)(logo?.src || '');
    return ((0, jsx_runtime_1.jsxs)(Link_1.default, { to: logoLink, className: "navbar__brand", "aria-label": logoAlt, children: [logo && ((0, jsx_runtime_1.jsx)("img", { src: logoSrc, alt: logoAlt, className: "navbar__logo", style: {
                    width: logo.width,
                    height: logo.height,
                } })), navbarTitle && ((0, jsx_runtime_1.jsxs)("div", { className: "navbar__title", children: [(0, jsx_runtime_1.jsx)("strong", { children: "ELEVATE" }), " Design System"] }))] }));
}
