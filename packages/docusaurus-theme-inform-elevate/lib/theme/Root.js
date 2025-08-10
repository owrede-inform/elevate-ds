"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Root;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const theme_common_1 = require("@docusaurus/theme-common");
require("@inform-elevate/elevate-core-ui/dist/elevate.css");
require("@inform-elevate/elevate-core-ui/dist/themes/light.css");
require("@inform-elevate/elevate-core-ui/dist/themes/dark.css");
function Root({ children }) {
    const { colorMode } = (0, theme_common_1.useColorMode)();
    (0, react_1.useEffect)(() => {
        const body = document.body;
        if (colorMode === 'dark') {
            body.classList.add('elvt-theme-dark');
            body.classList.remove('elvt-theme-light');
        }
        else {
            body.classList.add('elvt-theme-light');
            body.classList.remove('elvt-theme-dark');
        }
    }, [colorMode]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
