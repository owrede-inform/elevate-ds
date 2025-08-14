export const container = `
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr)); gap: 1rem; margin: 0.5rem 0;">
{{items}}
</div>
`;

export const item = `
<div style="text-align: center;">
  <div 
    class="color-swatch" 
    style="width: 4rem; height: 4rem; 
    background-color: var(--token-color); 
    border-radius: 8px; 
    margin: 0 auto 0.5rem; 
    border: 1px solid var(--ifm-color-emphasis-300);"
    title="{{name}}: {{hex}}">
  </div>
  <div style="font-size: 0.875rem; font-weight: 500; color: var(--ifm-color-content);">
    {{shade}}
  </div>
</div>
`;