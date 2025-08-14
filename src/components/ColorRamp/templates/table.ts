export const container = `
<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr style="background: #f8f9fa;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Color</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Name</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Variable</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Value</th>
    </tr>
  </thead>
  <tbody>
    {{items}}
  </tbody>
</table>
`;

export const item = `
<tr>
  <td style="padding: 0.75rem; border: 1px solid #ddd;">
    <div class="color-swatch" style="width: 30px; height: 30px; border-radius: 4px; background-color: var(--token-color); border: 1px solid rgba(0,0,0,0.2);"></div>
  </td>
  <td style="padding: 0.75rem; border: 1px solid #ddd;">{{name}}</td>
  <td style="padding: 0.75rem; border: 1px solid #ddd;"><code style="font-size: 0.85em;">{{variable}}</code></td>
  <td style="padding: 0.75rem; border: 1px solid #ddd;"><code style="font-size: 0.85em;">{{value}}</code></td>
</tr>
`;