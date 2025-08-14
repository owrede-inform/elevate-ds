export const container = `
<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0;">
{{items}}
</div>
`;

export const item = `
<div style="display: inline-flex; align-items: center; gap: 0.5rem; 
  padding: 0.375rem 0.75rem; 
  border-radius: 6px; 
  border: 1px solid var(--ifm-color-emphasis-300); 
  background: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-content);">
  <div 
    class="color-swatch" 
    style="width: 1.25rem; height: 1.25rem; 
    background-color: var(--token-color); 
    border-radius: 50%; 
    border: 1px solid var(--ifm-color-emphasis-300);">
  </div>
  <span style="font-size: 0.875rem; font-weight: 500;">{{colorName}}-{{shade}}</span>
</div>
`;