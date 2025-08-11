import React, { useState } from 'react';
import styles from './styles.module.css';

// TypeScript interfaces for changelog data
export interface ChangelogEntry {
  type: 'feature' | 'bug-fix' | 'breaking-change' | 'improvement' | 'deprecation';
  title: string;
  description: string;
  commit: string;
  issueNumber?: number;
  impact: 'visual' | 'api' | 'functionality' | 'performance' | 'design' | 'developer-experience';
  breakingChange: boolean;
  migration?: {
    description: string;
    before?: string;
    after?: string;
  };
  apiAdditions?: Array<{
    method?: string;
    property?: string;
    description: string;
  }>;
}

export interface VersionEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: ChangelogEntry[];
}

export interface ComponentChangelogData {
  component: string;
  version: string;
  lastUpdated: string;
  changelog: VersionEntry[];
  deprecations: any[];
  upcomingChanges: any[];
  metadata: {
    totalVersions: number;
    firstVersion: string;
    storyCount: number;
    testCount: number;
    fileCount: number;
    lastCommit: string;
  };
}

interface ComponentChangelogProps {
  component: string;
  maxVersions?: number;
  showMetadata?: boolean;
  compactMode?: boolean;
}

const ComponentChangelog: React.FC<ComponentChangelogProps> = ({
  component,
  maxVersions = 3,
  showMetadata = true,
  compactMode = false
}) => {
  const [changelogData, setChangelogData] = useState<ComponentChangelogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    const loadChangelogData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to load the changelog JSON file from static directory
        const response = await fetch(`/component-changelogs/${component}-changes.json`);
        
        if (!response.ok) {
          throw new Error(`Changelog not found for ${component}`);
        }
        
        // Check if the response is actually JSON by looking at content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Changelog not found for ${component}`);
        }
        
        const data: ComponentChangelogData = await response.json();
        setChangelogData(data);
      } catch (err) {
        // Handle JSON parsing errors as "not found"
        if (err instanceof Error && err.message.includes('Unexpected token')) {
          setError(`Changelog not found for ${component}`);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load changelog');
        }
      } finally {
        setLoading(false);
      }
    };

    loadChangelogData();
  }, [component]);

  const toggleVersionExpansion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const getChangeTypeIcon = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature': return '✨';
      case 'bug-fix': return '🐛';
      case 'breaking-change': return '💥';
      case 'improvement': return '🔧';
      case 'deprecation': return '⚠️';
      default: return '📝';
    }
  };

  const getChangeTypeColor = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature': return 'success';
      case 'bug-fix': return 'warning';
      case 'breaking-change': return 'danger';
      case 'improvement': return 'primary';
      case 'deprecation': return 'warning';
      default: return 'neutral';
    }
  };

  const getImpactBadge = (impact: ChangelogEntry['impact']) => {
    const colors = {
      visual: 'info',
      api: 'primary',
      functionality: 'success',
      performance: 'warning',
      design: 'info',
      'developer-experience': 'neutral'
    };
    
    return (
      <span className={`${styles.impactBadge} ${styles[colors[impact]]}`}>
        {impact.replace('-', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading changelog for {component}...
      </div>
    );
  }

  if (error) {
    // Check if it's a 404 error (changelog file not found)
    const isNotFound = error.includes('Changelog not found') || error.includes('404');
    
    if (isNotFound) {
      return (
        <div className={styles.noChangelog}>
          <p>No changelog entries for this component.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.error}>
        <p>⚠️ Could not load changelog for {component}</p>
        <p className={styles.errorDetail}>{error}</p>
      </div>
    );
  }

  if (!changelogData) {
    return null;
  }

  const versionsToShow = changelogData.changelog.slice(0, maxVersions);

  return (
    <div className={`${styles.changelog} ${compactMode ? styles.compact : ''}`}>
      <div className={styles.header}>
        <h4>Changelog for {component}</h4>
        <div className={styles.versionBadge}>
          Current: v{changelogData.version}
        </div>
      </div>

      <div className={styles.versions}>
        {versionsToShow.map((versionEntry) => {
          const isExpanded = expandedVersions.has(versionEntry.version);
          const hasBreakingChanges = versionEntry.changes.some(change => change.breakingChange);
          
          return (
            <div key={versionEntry.version} className={styles.versionEntry}>
              <div 
                className={styles.versionHeader}
                onClick={() => toggleVersionExpansion(versionEntry.version)}
              >
                <div className={styles.versionLeft}>
                  <h4 className={styles.versionNumber}>v{versionEntry.version}</h4>
                  <span className={styles.versionDate}>{versionEntry.date}</span>
                  {hasBreakingChanges && (
                    <span className={styles.breakingBadge}>Breaking</span>
                  )}
                </div>
                <div className={styles.versionRight}>
                  <span className={styles.changeCount}>
                    {versionEntry.changes.length} changes
                  </span>
                  <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.changes}>
                  {versionEntry.changes.map((change, index) => (
                    <div key={index} className={`${styles.change} ${styles[getChangeTypeColor(change.type)]}`}>
                      <div className={styles.changeIcon}>
                        {getChangeTypeIcon(change.type)}
                      </div>
                      
                      <div className={styles.changeContent}>
                        <h5 className={styles.changeTitle}>{change.title}</h5>
                        <p className={styles.changeDescription}>{change.description}</p>
                        
                        <div className={styles.changeFooter}>
                          <span className={styles.commitLink}>
                            <a 
                              href={`https://github.com/inform-elevate/elevate-core-ui/commit/${change.commit}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {change.commit.substring(0, 7)}
                            </a>
                          </span>
                          
                          {change.issueNumber && (
                            <span className={styles.issueLink}>
                              <a 
                                href={`https://github.com/inform-elevate/elevate-core-ui/issues/${change.issueNumber}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                #{change.issueNumber}
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.changeBadge}>
                        {getImpactBadge(change.impact)}
                      </div>

                      {change.migration && (
                        <div className={styles.migration}>
                          <h6>Migration Guide:</h6>
                          <p>{change.migration.description}</p>
                          {change.migration.before && change.migration.after && (
                            <div className={styles.codeComparison}>
                              <div className={styles.codeBefore}>
                                <strong>Before:</strong>
                                <pre><code>{change.migration.before}</code></pre>
                              </div>
                              <div className={styles.codeAfter}>
                                <strong>After:</strong>
                                <pre><code>{change.migration.after}</code></pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {change.apiAdditions && change.apiAdditions.length > 0 && (
                        <div className={styles.apiAdditions}>
                          <h6>API Additions:</h6>
                          <ul>
                            {change.apiAdditions.map((addition, i) => (
                              <li key={i}>
                                <code>{addition.method || addition.property}</code>
                                {' - '}
                                {addition.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {changelogData.changelog.length > maxVersions && (
        <div className={styles.footer}>
          <p>
            Showing {maxVersions} of {changelogData.changelog.length} versions. 
            <a 
              href={`https://github.com/inform-elevate/elevate-core-ui/blob/main/CHANGELOG.md`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              View full changelog →
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ComponentChangelog;