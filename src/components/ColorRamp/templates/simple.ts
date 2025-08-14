export const container = `
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr)); gap: 0.75rem; margin: 0.5rem 0;">
{{items}}
</div>
`;

export const item = `
<div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
  <div 
    class="color-swatch" 
    style="width: 4rem; height: 4rem; 
    background-color: var(--token-color); 
    border-radius: 8px; 
    border: 1px solid var(--ifm-color-emphasis-300);"
    title="{{name}}: {{hex}}"
  ></div>
  <div style="font-size: 0.75rem; font-weight: 600; color: var(--ifm-color-content);">
    {{shade}}
  </div>
</div>
`;