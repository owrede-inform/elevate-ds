"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Root;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("@inform-elevate/elevate-core-ui/dist/elevate.css");
require("@inform-elevate/elevate-core-ui/dist/themes/light.css");
require("@inform-elevate/elevate-core-ui/dist/themes/dark.css");
function Root({ children }) {
    (0, react_1.useEffect)(() => {
        document.body.classList.add('elvt-theme-light');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    const body = document.body;
                    if (theme === 'dark') {
                        body.classList.add('elvt-theme-dark');
                        body.classList.remove('elvt-theme-light');
                    }
                    else {
                        body.classList.add('elvt-theme-light');
                        body.classList.remove('elvt-theme-dark');
                    }
                }
            });
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        return () => observer.disconnect();
    }, []);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
