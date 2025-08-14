export const container = `
<div>
  <div style="display: flex; align-items: center; gap: 0.5rem; margin-right: 2rem;">
    <h4>{{title}}</h4>
  </div>
  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    {{items}}
  </div>
</div>
`;

export const item = `
<div style="display: flex; align-items: center; gap: 0.5rem; text-align: center;">
  <elvt-tooltip content="{{hex}} (Contrast: 1:{{contrast}})">
    <div 
      class="color-swatch" 
      style="width: 3.5rem; height: 3.5rem;
      flex-shrink: 0; 
      background-color: var(--token-color); 
      border-radius: 9999px; 
      border: 1px solid rgba(128, 128, 128, 0.5);
    "></div>
  </elvt-tooltip>
</div>
`;