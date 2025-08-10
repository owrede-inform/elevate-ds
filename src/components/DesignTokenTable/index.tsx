import React from 'react';
import styles from './styles.module.css';

interface TokenData {
  name: string;
  value: string;
  description?: string;
  cssVariable?: string;
}

interface DesignTokenTableProps {
  title: string;
  tokens: TokenData[];
  type?: 'color' | 'spacing' | 'typography' | 'default';
}

export default function DesignTokenTable({
  title,
  tokens,
  type = 'default'
}: DesignTokenTableProps): JSX.Element {
  const renderPreview = (token: TokenData) => {
    switch (type) {
      case 'color':
        return (
          <div 
            className={styles.colorPreview} 
            style={{ backgroundColor: token.value }}
            title={token.value}
          />
        );
      case 'spacing':
        return (
          <div 
            className={styles.spacingPreview}
            style={{ width: token.value, height: '16px' }}
            title={token.value}
          />
        );
      case 'typography':
        return (
          <div 
            className={styles.typographyPreview}
            style={{ fontSize: token.value }}
            title={token.value}
          >
            Aa
          </div>
        );
      default:
        return <span className={styles.defaultPreview}>{token.value}</span>;
    }
  };

  return (
    <div className={styles.tokenTable}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Token Name</th>
              <th>Value</th>
              <th>CSS Variable</th>
              {tokens.some(token => token.description) && <th>Description</th>}
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td className={styles.previewCell}>
                  {renderPreview(token)}
                </td>
                <td className={styles.nameCell}>
                  <code>{token.name}</code>
                </td>
                <td className={styles.valueCell}>
                  <code>{token.value}</code>
                </td>
                <td className={styles.cssVarCell}>
                  {token.cssVariable && <code>{token.cssVariable}</code>}
                </td>
                {tokens.some(t => t.description) && (
                  <td className={styles.descriptionCell}>
                    {token.description}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}