"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MDXContent;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@mdx-js/react");
const MDXComponents_1 = __importDefault(require("../MDXComponents"));
function MDXContent({ children }) {
    return (0, jsx_runtime_1.jsx)(react_1.MDXProvider, { components: MDXComponents_1.default, children: children });
}
