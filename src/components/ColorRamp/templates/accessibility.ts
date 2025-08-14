export const container = `
<div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 0.5rem 0;">
{{items}}
</div>
`;

export const item = `
<div style="display: flex; align-items: center; gap: 1rem; 
  padding: 1rem; 
  border: 1px solid var(--ifm-color-emphasis-300); 
  border-radius: 8px; 
  background: var(--ifm-color-emphasis-0);">
  <div 
    class="color-swatch" 
    style="width: 3rem; height: 3rem; 
    background-color: var(--token-color); 
    border-radius: 6px; 
    border: 1px solid var(--ifm-color-emphasis-300);">
  </div>
  <div style="flex: 1;">
    <h4 style="margin: 0 0 0.25rem 0; color: var(--ifm-color-content); font-size: 1rem;">{{name}}</h4>
    <div style="margin: 0.25rem 0; font-family: var(--ifm-font-family-monospace); font-size: 0.875rem; color: var(--ifm-color-content-secondary);">
      {{hex}} • {{value}}
    </div>
    <div style="margin: 0; font-size: 0.875rem; color: var(--ifm-color-content-secondary);">
      <strong>WCAG Contrast:</strong> {{contrast}}:1 to white
    </div>
  </div>
</div>
`;