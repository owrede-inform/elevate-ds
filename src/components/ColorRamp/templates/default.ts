export const container = `
<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
{{items}}
</div>
`;

export const item = `
  <div style="display: flex; align-items: center; gap: 1rem;">
  <elvt-tooltip content="{{hex}} (Contrast: 1:{{contrast}})">
    <div 
      class="color-swatch" 
      style="width: 6rem; height: 6rem;
      flex-shrink: 0; 
      background-color: var(--token-color); 
      border-radius: 9999px; 
      border: 1px solid rgba(128, 128, 128, 0.5);
    "></div>
  </elvt-tooltip>
  </div>
`;