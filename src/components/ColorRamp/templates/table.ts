export const container = `
<table style="
  width: 100%; 
  border-collapse: collapse; 
  font-family: var(--ifm-font-family-base);
  font-size: var(--ifm-font-size-sm);
  margin: 1rem 0;
  border: none;
">
  <thead>
    <tr style="
      background: var(--ifm-table-head-background);
      border-bottom: 2px solid var(--ifm-table-border-color);
      border-top: none;
    ">
      <th style="
        padding: 0.75rem 1rem; 
        text-align: left; 
        font-weight: var(--ifm-font-weight-semibold);
        color: var(--ifm-table-head-color);
        border: none;
      ">Color</th>
      <th style="
        padding: 0.75rem 1rem; 
        text-align: left; 
        font-weight: var(--ifm-font-weight-semibold);
        color: var(--ifm-table-head-color);
        border: none;
      ">Name</th>
      <th style="
        padding: 0.75rem 1rem; 
        text-align: left; 
        font-weight: var(--ifm-font-weight-semibold);
        color: var(--ifm-table-head-color);
        border: none;
      ">Hex</th>
      <th style="
        padding: 0.75rem 1rem; 
        text-align: left; 
        font-weight: var(--ifm-font-weight-semibold);
        color: var(--ifm-table-head-color);
        border: none;
      ">Variable</th>
      <th style="
        padding: 0.75rem 1rem; 
        text-align: left; 
        font-weight: var(--ifm-font-weight-semibold);
        color: var(--ifm-table-head-color);
        border: none;
      ">Value</th>
    </tr>
  </thead>
  <tbody>
    {{items}}
  </tbody>
</table>
`;

export const item = `
<tr style="border-bottom: 1px solid var(--ifm-table-border-color);">
  <td style="
    padding: 0.75rem 1rem; 
    border: none;
    vertical-align: middle;
  ">
    <div class="color-swatch" style="
      width: 32px; 
      height: 32px; 
      border-radius: 6px; 
      background-color: var(--token-color); 
      border: 1px solid var(--ifm-table-border-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    "></div>
  </td>
  <td style="
    padding: 0.75rem 1rem; 
    border: none;
    color: var(--ifm-table-cell-color);
    vertical-align: middle;
  ">{{name}}</td>
  <td style="
    padding: 0.75rem 1rem; 
    border: none;
    vertical-align: middle;
  ">
    <code style="
      font-size: 0.875rem;
      background: var(--ifm-code-background);
      color: var(--ifm-code-color);
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      border: 1px solid var(--ifm-color-emphasis-300);
    ">{{hex}}</code>
  </td>
  <td style="
    padding: 0.75rem 1rem; 
    border: none;
    vertical-align: middle;
  ">
    <code style="
      font-size: 0.875rem;
      background: var(--ifm-code-background);
      color: var(--ifm-code-color);
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      border: 1px solid var(--ifm-color-emphasis-300);
    ">{{variable}}</code>
  </td>
  <td style="
    padding: 0.75rem 1rem; 
    border: none;
    vertical-align: middle;
  ">
    <code style="
      font-size: 0.875rem;
      background: var(--ifm-code-background);
      color: var(--ifm-code-color);
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      border: 1px solid var(--ifm-color-emphasis-300);
    ">{{value}}</code>
  </td>
</tr>
`;