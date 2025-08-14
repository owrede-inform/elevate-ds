export const container = `
{{items}}
`;

export const item = `
<tr style="border-bottom: 1px solid var(--ifm-color-emphasis-300);">
  <td style="padding: 0.75rem;">
    <div 
      class="color-swatch" 
      style="width: 2rem; height: 2rem; 
      background-color: var(--token-color); 
      border-radius: 4px; 
      border: 1px solid var(--ifm-color-emphasis-300);">
    </div>
  </td>
  <td style="padding: 0.75rem; color: var(--ifm-color-content);">{{name}}</td>
  <td style="padding: 0.75rem;">
    <code style="background: var(--ifm-color-emphasis-200); padding: 0.125rem 0.25rem; border-radius: 3px; font-size: 0.875rem;">
      {{variable}}
    </code>
  </td>
  <td style="padding: 0.75rem;">
    <code style="background: var(--ifm-color-emphasis-200); padding: 0.125rem 0.25rem; border-radius: 3px; font-size: 0.875rem;">
      {{hex}}
    </code>
  </td>
  <td style="padding: 0.75rem; color: var(--ifm-color-content-secondary);">{{contrast}}:1</td>
</tr>
`;