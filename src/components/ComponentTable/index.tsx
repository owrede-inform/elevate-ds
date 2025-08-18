import React, { useState, useMemo } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface ComponentMetadata {
  name: string;
  displayName: string;
  status: string;
  since: string;
  lastChangeVersion: string;
  lastChangeDate: string;
  description: string;
  path: string;
}

interface ComponentTableData {
  generatedAt: string;
  source: string;
  components: ComponentMetadata[];
}

interface ComponentTableProps {
  /** Show only components with specific status */
  statusFilter?: string;
}

// Create React wrappers for ELEVATE table components
const ElvtTable = (props: any) => React.createElement('elvt-table', props, props.children);
const ElvtTableRow = (props: any) => React.createElement('elvt-table-row', props, props.children);
const ElvtTableColumn = (props: any) => React.createElement('elvt-table-column', props, props.children);
const ElvtTableCell = (props: any) => React.createElement('elvt-table-cell', props, props.children);
const ElvtBadge = (props: any) => React.createElement('elvt-badge', props, props.children);

const ComponentTable: React.FC<ComponentTableProps> = ({
  statusFilter
}) => {
  const [sortColumn, setSortColumn] = useState<keyof ComponentMetadata>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Load component data
  const componentData = useMemo(() => {
    try {
      const data = require('@site/static/component-metadata/component-table-data.json') as ComponentTableData;
      return data;
    } catch (error) {
      console.error('Failed to load component table data:', error);
      return { generatedAt: '', source: '', components: [] };
    }
  }, []);

  // Filter components
  const filteredComponents = useMemo(() => {
    let filtered = componentData.components;
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(comp => comp.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      
      // Handle date sorting specially
      if (sortColumn === 'lastChangeDate') {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
        const comparison = dateA - dateB;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [componentData.components, statusFilter, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column: keyof ComponentMetadata) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (column: keyof ComponentMetadata) => {
    if (sortColumn !== column) return ' ↕️';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Get status badge tone
  const getStatusTone = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'success';
      case 'stable':
        return 'success';
      case 'preliminary':
        return 'primary';
      case 'unstable':
        return 'warning';
      case 'experimental':
        return 'danger';
      case 'deprecated':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  if (componentData.components.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No component data available. Please run the changelog script to generate component metadata:</p>
        <code>node scripts/github-changelog.js --table-data</code>
      </div>
    );
  }

  return (
    <div className={styles.componentTable}>
      <ElvtTable style={{
        '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
        '--sl-color-neutral-300': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
        '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
      }}>
        <ElvtTableRow>
          <ElvtTableColumn style={{ 
            '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
            '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
          }}>
            <button 
              onClick={() => handleSort('name')}
              className={styles.sortButton}
            >
              Component{renderSortIndicator('name')}
            </button>
          </ElvtTableColumn>
          <ElvtTableColumn style={{ 
            '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
            '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
          }}>
            <button 
              onClick={() => handleSort('status')}
              className={styles.sortButton}
            >
              Status{renderSortIndicator('status')}
            </button>
          </ElvtTableColumn>
          <ElvtTableColumn style={{ 
            '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
            '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
          }}>
            <button 
              onClick={() => handleSort('since')}
              className={styles.sortButton}
            >
              Since{renderSortIndicator('since')}
            </button>
          </ElvtTableColumn>
          <ElvtTableColumn style={{ 
            '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
            '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
          }}>
            <button 
              onClick={() => handleSort('lastChangeVersion')}
              className={styles.sortButton}
            >
              Last Version{renderSortIndicator('lastChangeVersion')}
            </button>
          </ElvtTableColumn>
          <ElvtTableColumn style={{ 
            '--elvt-component-table-column-border-color-default': 'var(--elvt-primitives-color-gray-300, #a3aab4)',
            '--border-color': 'var(--elvt-primitives-color-gray-300, #a3aab4)'
          }}>
            <button 
              onClick={() => handleSort('lastChangeDate')}
              className={styles.sortButton}
            >
              Last Changed{renderSortIndicator('lastChangeDate')}
            </button>
          </ElvtTableColumn>
        </ElvtTableRow>
        
        {filteredComponents.map((component) => (
          <ElvtTableRow key={component.name} style={{ background: 'transparent' }}>
            <ElvtTableCell style={{ background: 'transparent' }}>
              <Link 
                to={`/docs/components/${component.displayName}`}
                className={styles.componentLink}
              >
                <code>{component.name}</code>
              </Link>
            </ElvtTableCell>
            <ElvtTableCell style={{ background: 'transparent' }}>
              <ElvtBadge tone={getStatusTone(component.status)}>
                {component.status}
              </ElvtBadge>
            </ElvtTableCell>
            <ElvtTableCell style={{ background: 'transparent' }}>
              <code>{component.since}</code>
            </ElvtTableCell>
            <ElvtTableCell style={{ background: 'transparent' }}>
              <code>{component.lastChangeVersion}</code>
            </ElvtTableCell>
            <ElvtTableCell style={{ background: 'transparent' }}>
              {component.lastChangeDate ? 
                new Date(component.lastChangeDate).toLocaleDateString() : 
                '-'
              }
            </ElvtTableCell>
          </ElvtTableRow>
        ))}
      </ElvtTable>
      
      <div className={styles.tableFooter}>
        <p>
          Showing {filteredComponents.length} of {componentData.components.length} components
          {componentData.generatedAt && (
            <> • Generated {new Date(componentData.generatedAt).toLocaleString()}</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ComponentTable;