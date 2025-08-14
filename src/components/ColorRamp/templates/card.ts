export const container = `
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 1rem 0;">
  {{items}}
</div>
`;

export const item = `
<div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <div class="color-swatch" style="height: 80px; background-color: var(--token-color);"></div>
  <div style="padding: 1rem;">
    <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600; color: #2d3748;">{{name}}</h4>
    <code style="display: block; margin-bottom: 0.5rem; font-size: 0.75em; color: #4a5568; background: #f7fafc; padding: 0.25rem 0.5rem; border-radius: 4px;">{{variable}}</code>
    <code style="display: block; font-size: 0.75em; color: #718096;">{{value}}</code>
    <div style="margin-top: 0.5rem; font-size: 0.75em; color: #a0aec0;">
      Brightness: {{brightness}}/255 • Shade: {{shade}}
    </div>
  </div>
</div>
`;