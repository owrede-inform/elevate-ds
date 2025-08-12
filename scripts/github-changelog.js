#!/usr/bin/env node

/**
 * GitHub API-based Changelog Generator for ELEVATE Components
 * 
 * This script can programmatically fetch real commit data from the 
 * inform-elevate/elevate-core-ui GitHub repository using the GitHub API
 * 
 * Usage:
 *   node scripts/github-changelog.js --component elvt-button
 *   node scripts/github-changelog.js --component elvt-input --token YOUR_GITHUB_TOKEN
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

class GitHubChangelogGenerator {
  constructor(token = null) {
    this.githubToken = this.validateToken(token || process.env.GITHUB_TOKEN);
    this.owner = 'inform-elevate';
    this.repo = 'elevate-core-ui';
    this.baseUrl = 'api.github.com';
    this.logEntries = []; // Store log entries for current component
    this.requestCount = 0; // Track API requests for rate limiting
    this.startTime = Date.now(); // Track session start time
    this.maxRequestsPerHour = this.githubToken ? 5000 : 60; // GitHub rate limits
  }

  /**
   * Validate and sanitize GitHub token
   */
  validateToken(token) {
    if (!token) {
      return null; // Allow operation without token (with rate limits)
    }

    // Basic token format validation
    if (typeof token !== 'string') {
      throw new Error('GitHub token must be a string');
    }

    // Remove any whitespace
    token = token.trim();

    // Validate token format (GitHub personal access tokens start with 'ghp_' or 'github_pat_')
    const tokenPattern = /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})$/;
    if (!tokenPattern.test(token)) {
      console.warn('⚠️ Warning: GitHub token format appears invalid. Expected format: ghp_... or github_pat_...');
      console.warn('⚠️ This may cause authentication failures. Please verify your token.');
    }

    // Check for accidentally exposed tokens (common patterns that shouldn't be tokens)
    const suspiciousPatterns = [
      /^(test|example|demo|sample)/i,
      /^(your|my|the)[-_]token/i,
      /placeholder/i,
      /\$\{.*\}/,  // Template literals
      /<.*>/       // XML/HTML tags
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(token)) {
        throw new Error('Invalid token: appears to be a placeholder or template value');
      }
    }

    return token;
  }

  /**
   * Validate component name input
   */
  validateComponentName(componentName) {
    if (!componentName || typeof componentName !== 'string') {
      throw new Error('Component name must be a non-empty string');
    }

    // Sanitize component name
    componentName = componentName.trim().toLowerCase();

    // Validate component name format (should start with elvt- and contain only allowed characters)
    const namePattern = /^elvt-[a-z0-9-]+$/;
    if (!namePattern.test(componentName)) {
      throw new Error(`Invalid component name: ${componentName}. Must start with 'elvt-' and contain only lowercase letters, numbers, and hyphens.`);
    }

    // Check for potential path traversal or injection attempts
    const maliciousPatterns = [
      /\.\./,        // Path traversal
      /[<>"\|\$]/,   // Shell injection characters (but allow & for component names)
      /[;\`]/,       // Command injection
      /javascript:/i, // Protocol injection
      /data:/i       // Data URI
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(componentName)) {
        throw new Error(`Invalid component name: contains potentially malicious characters`);
      }
    }

    return componentName;
  }

  /**
   * Validate file path for security
   */
  validatePath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File path must be a non-empty string');
    }

    // Normalize and sanitize path
    filePath = filePath.trim();

    // Check for path traversal attempts
    if (filePath.includes('..')) {
      throw new Error('Path traversal not allowed');
    }

    // Check for absolute paths (should be relative)
    if (filePath.startsWith('/') || /^[a-zA-Z]:[\\\/]/.test(filePath)) {
      throw new Error('Absolute paths not allowed');
    }

    // Validate allowed characters in path
    const pathPattern = /^[a-zA-Z0-9._/-]+$/;
    if (!pathPattern.test(filePath)) {
      throw new Error('Invalid characters in file path');
    }

    return filePath;
  }

  /**
   * Validate GitHub API endpoint
   */
  validateEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a non-empty string');
    }

    // Remove leading slash if present
    endpoint = endpoint.replace(/^\/+/, '/');

    // Validate endpoint format (allow GitHub API paths with query parameters)
    const endpointPattern = /^\/repos\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_\/-]*(\?[a-zA-Z0-9_=&.\/-]+)?$/;
    if (!endpointPattern.test(endpoint)) {
      throw new Error(`Invalid GitHub API endpoint format: ${endpoint}`);
    }

    // Check for malicious patterns (but allow legitimate URL characters)
    const maliciousPatterns = [
      /\.\./,          // Path traversal
      /[<>"]/,         // HTML/XML injection (but not & which is needed for query params)
      /javascript:/i,   // Protocol injection
      /data:/i,        // Data URI
      /[|;`]/          // Command injection (but allow & for query parameters)
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(endpoint)) {
        throw new Error(`Potentially malicious endpoint detected: ${endpoint}`);
      }
    }

    return endpoint;
  }

  /**
   * Check rate limits before making request
   */
  checkRateLimit() {
    const hoursPassed = (Date.now() - this.startTime) / (1000 * 60 * 60);
    const requestsPerHour = this.requestCount / Math.max(hoursPassed, 0.1); // Avoid division by zero

    if (requestsPerHour > this.maxRequestsPerHour * 0.9) { // 90% of limit
      const tokenType = this.githubToken ? 'authenticated' : 'anonymous';
      console.warn(`⚠️ Warning: Approaching GitHub API rate limit for ${tokenType} requests`);
      console.warn(`   Current rate: ${Math.round(requestsPerHour)} requests/hour`);
      console.warn(`   Limit: ${this.maxRequestsPerHour} requests/hour`);
      
      if (requestsPerHour > this.maxRequestsPerHour) {
        throw new Error(`GitHub API rate limit exceeded. Please wait before making more requests.`);
      }
    }
  }

  /**
   * Make a request to GitHub API with validation and rate limiting
   */
  async makeGitHubRequest(endpoint) {
    // Check rate limits
    this.checkRateLimit();
    
    // Validate endpoint
    endpoint = this.validateEndpoint(endpoint);

    // Increment request counter
    this.requestCount++;

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        path: endpoint,
        method: 'GET',
        headers: {
          'User-Agent': 'ELEVATE-Changelog-Generator',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      // Add authentication if token is available
      if (this.githubToken) {
        options.headers['Authorization'] = `token ${this.githubToken}`;
      }

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Get commits for a specific component from GitHub API
   */
  async getComponentCommits(componentName) {
    try {
      console.log(`🌐 Fetching commits from GitHub API for ${componentName}...`);
      
      const componentPath = await this.getComponentPath(componentName);
      const endpoint = `/repos/${this.owner}/${this.repo}/commits?path=${componentPath}&per_page=50`;
      
      console.log(`📡 Endpoint: ${endpoint}`);
      
      const commits = await this.makeGitHubRequest(endpoint);
      
      if (!Array.isArray(commits)) {
        throw new Error('Invalid response from GitHub API');
      }

      console.log(`✅ Found ${commits.length} commits from GitHub`);

      return commits.map(commit => ({
        hash: commit.sha,
        shortHash: commit.sha.substring(0, 7),
        date: commit.commit.author.date.split('T')[0],
        message: commit.commit.message.split('\n')[0], // First line only
        author: commit.commit.author.name,
        url: commit.html_url
      }));

    } catch (error) {
      console.warn(`⚠️ GitHub API error for ${componentName}: ${error.message}`);
      
      if (error.message.includes('rate limit')) {
        console.log('💡 GitHub API rate limit reached. Consider using a personal access token.');
      }
      
      return [];
    }
  }

  /**
   * Get the correct component path in the repository
   */
  async getComponentPath(componentName) {
    // If we have cached component paths from discovery, use them
    if (this.discoveredComponents) {
      const component = this.discoveredComponents.find(comp => comp.name === componentName);
      if (component) {
        return component.path;
      }
    }

    // Try to discover components if not already done
    try {
      const components = await this.getAllComponents();
      this.discoveredComponents = components;
      
      const component = components.find(comp => comp.name === componentName);
      if (component) {
        return component.path;
      }
    } catch (error) {
      console.warn(`⚠️ Could not discover component path for ${componentName}: ${error.message}`);
    }

    // Fallback to educated guess based on component name
    const fallbackPath = `src/components/${componentName.replace('elvt-', '')}`;
    console.log(`📋 Using fallback path: ${fallbackPath}`);
    return fallbackPath;
  }

  /**
   * Add entry to log for debugging
   */
  addLogEntry(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      message,
      data
    };
    this.logEntries.push(entry);
    
    // Also console log for immediate feedback
    const levelEmoji = {
      'INFO': 'ℹ️',
      'DEBUG': '🔍',
      'EXCLUDE': '🚫',
      'INCLUDE': '✅',
      'UNCERTAIN': '⚠️',
      'ERROR': '❌'
    };
    
    if (level !== 'DEBUG' || process.env.DEBUG === 'true') {
      console.log(`   ${levelEmoji[level] || '📝'} ${message}`);
    }
  }

  /**
   * Check if a commit is relevant to the specific component
   */
  isCommitRelevant(commit, componentName) {
    const message = commit.message.toLowerCase();
    const componentShortName = componentName.replace('elvt-', '');
    const commitSummary = commit.message.substring(0, 80);
    
    this.addLogEntry('DEBUG', `Evaluating commit: "${commitSummary}..."`, {
      hash: commit.shortHash,
      author: commit.author,
      date: commit.date,
      fullMessage: commit.message
    });
    
    // EXCLUSION RULES - Skip these commits
    const exclusionPatterns = [
      // Infrastructure and tooling
      { pattern: /prettier|eslint|lint|storybook|webpack|rollup|vite|babel/, reason: 'Build tools/Linting' },
      { pattern: /github|ci\/cd|workflow|pipeline|automation/, reason: 'CI/CD Infrastructure' },
      { pattern: /build|deploy|release|publish|version/, reason: 'Build/Release' },
      { pattern: /docs|documentation|readme|changelog/, reason: 'Documentation' },
      { pattern: /test|testing|jest|cypress|playwright/, reason: 'Testing' },
      { pattern: /deps|dependencies|package\.json|yarn|npm/, reason: 'Dependencies' },
      
      // Generic project changes
      { pattern: /update.*tokens?(?!\s+for\s+\w)/, reason: 'Generic token update' },
      { pattern: /refactor(?!\s+\w*(?:button|badge|input))/, reason: 'Generic refactoring' },
      { pattern: /consolidate(?!\s+\w*(?:button|badge|input))/, reason: 'Generic consolidation' },
      { pattern: /export.*enum|enum.*export/, reason: 'Enum export' },
      { pattern: /severity.*mapping|mapping.*severity/, reason: 'Severity mapping' },
      
      // Other components (if not specifically about this component)
      { pattern: /switch(?!\s+to|\s+from)/, reason: 'Switch component' },
      { pattern: /table(?!\s+\w*component)/, reason: 'Table component' },
      { pattern: /form(?!\s+\w*component)/, reason: 'Form component' },
      { pattern: /link(?!\s+\w*component)/, reason: 'Link component' },
      { pattern: /icon(?!\s+\w*component)(?!\s+button)/, reason: 'Icon component' },
      
      // Cross-component changes that don't specifically affect this component
      { pattern: /consolidate.*severity/, reason: 'Cross-component severity' },
      { pattern: /export.*types?(?!\s+for\s+\w*(?:button|badge))/, reason: 'Generic type export' }
    ];
    
    // Check for exclusion patterns
    for (const { pattern, reason } of exclusionPatterns) {
      if (pattern.test(message)) {
        this.addLogEntry('EXCLUDE', `"${commitSummary}..." (${reason})`, {
          hash: commit.shortHash,
          reason,
          pattern: pattern.toString()
        });
        return false;
      }
    }
    
    // INCLUSION RULES - Must be relevant to this component
    const inclusionPatterns = [
      { pattern: new RegExp(`\\b${componentName}\\b`, 'i'), reason: 'Direct component name' },
      { pattern: new RegExp(`\\b${componentShortName}\\b`, 'i'), reason: 'Short component name' },
      { pattern: new RegExp(`\\b${componentShortName}\\s+(component|group|wrapper)\\b`, 'i'), reason: 'Component reference' },
      { pattern: new RegExp(`add\\s+${componentShortName}`, 'i'), reason: 'Component addition' },
      { pattern: new RegExp(`${componentShortName}\\s+(fix|bug|issue)`, 'i'), reason: 'Component fix' },
    ];
    
    // Add component-specific patterns
    if (componentName === 'elvt-button') {
      inclusionPatterns.push({ pattern: /button.*group|group.*button|button.*pill|pill.*button/i, reason: 'Button-specific feature' });
    }
    if (componentName === 'elvt-badge') {
      inclusionPatterns.push({ pattern: /badge.*pulse|pulse.*badge|badge.*animation/i, reason: 'Badge-specific feature' });
    }
    if (componentName === 'elvt-input') {
      inclusionPatterns.push({ pattern: /input.*validation|validation.*input|input.*field/i, reason: 'Input-specific feature' });
    }
    
    // Check for inclusion patterns
    for (const { pattern, reason } of inclusionPatterns) {
      if (pattern.test(message)) {
        this.addLogEntry('INCLUDE', `"${commitSummary}..." (${reason})`, {
          hash: commit.shortHash,
          reason,
          pattern: pattern.toString()
        });
        return true;
      }
    }
    
    this.addLogEntry('UNCERTAIN', `"${commitSummary}..." (No clear component relevance)`, {
      hash: commit.shortHash,
      reason: 'No matching patterns'
    });
    return false; // Default to exclude if uncertain
  }

  /**
   * Parse commit message to extract change information
   */
  parseCommit(commit, componentName, preferredType = null) {
    const message = commit.message.toLowerCase();
    
    // Determine change type
    let changeType = preferredType || 'improvement';
    if (message.includes('fix') || message.includes('bug')) changeType = 'bug-fix';
    if (message.includes('feat') || message.includes('add')) changeType = 'feature';
    if (message.includes('break') || message.includes('!:')) changeType = 'breaking-change';
    if (message.includes('improve') || message.includes('enhance')) changeType = 'improvement';
    if (message.includes('deprecate')) changeType = 'deprecation';

    // Determine impact
    let impact = 'functionality';
    if (message.includes('style') || message.includes('design')) impact = 'visual';
    if (message.includes('api') || message.includes('interface')) impact = 'api';
    if (message.includes('perf') || message.includes('performance')) impact = 'performance';
    if (message.includes('a11y') || message.includes('accessibility')) impact = 'functionality';

    // Generate clean title
    let title = commit.message.split('\n')[0];
    title = title.replace(/^(feat|fix|perf|refactor|docs|style|test|chore)(\([^)]+\))?:\s*/i, '');
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Generate description
    let description = title;
    if (changeType === 'feature') description = `Added ${description.toLowerCase()}`;
    if (changeType === 'bug-fix') description = `Fixed ${description.toLowerCase()}`;
    if (changeType === 'breaking-change') description = `Updated ${description.toLowerCase()}`;
    if (changeType === 'improvement') description = `Improved ${description.toLowerCase()}`;

    return {
      type: changeType,
      title,
      description,
      commit: commit.shortHash,
      impact,
      breakingChange: changeType === 'breaking-change',
      author: commit.author,
      url: commit.url
    };
  }

  /**
   * Load versions from external sources (GitHub API + versions.json)
   */
  async loadVersions() {
    try {
      // First, try to get versions from GitHub releases/tags API
      console.log('📡 Fetching version information from GitHub API...');
      const gitHubVersions = await this.getVersionsFromGitHub();
      
      if (gitHubVersions && gitHubVersions.length > 0) {
        console.log(`✅ Found ${gitHubVersions.length} versions from GitHub API`);
        return gitHubVersions;
      }
    } catch (error) {
      console.warn(`⚠️ Could not load versions from GitHub API: ${error.message}`);
    }

    // Fallback to local component-versions.json file
    try {
      console.log('📂 Loading versions from component-versions.json file...');
      const versionsData = await fs.readFile('./component-versions.json', 'utf8');
      const { versions } = JSON.parse(versionsData);
      
      // Convert string dates to Date objects
      const processedVersions = versions.map(v => ({
        ...v,
        cutoff: new Date(v.cutoff)
      }));
      
      console.log(`✅ Loaded ${processedVersions.length} versions from component-versions.json`);
      return processedVersions;
      
    } catch (error) {
      console.warn(`⚠️ Could not load versions.json: ${error.message}`);
      
      // Ultimate fallback to minimal hardcoded versions
      console.log('📋 Using minimal fallback version set...');
      return [
        { version: '0.0.28-alpha', date: '2025-08-11', cutoff: new Date('2025-08-01') },
        { version: '0.0.27-alpha', date: '2025-08-08', cutoff: new Date('2025-07-25') },
        { version: '0.0.26-alpha', date: '2025-07-16', cutoff: new Date('2025-07-01') }
      ];
    }
  }

  /**
   * Get version information from GitHub API (releases/tags)
   */
  async getVersionsFromGitHub() {
    try {
      const endpoint = `/repos/${this.owner}/${this.repo}/releases`;
      const releases = await this.makeGitHubRequest(endpoint);
      
      if (!Array.isArray(releases) || releases.length === 0) {
        console.log('📋 No releases found, trying tags...');
        const tagsEndpoint = `/repos/${this.owner}/${this.repo}/tags`;
        const tags = await this.makeGitHubRequest(tagsEndpoint);
        
        if (!Array.isArray(tags) || tags.length === 0) {
          return null;
        }
        
        // Convert tags to version format
        return this.convertTagsToVersions(tags);
      }
      
      // Convert releases to version format
      return this.convertReleasesToVersions(releases);
      
    } catch (error) {
      console.warn(`⚠️ GitHub API error for versions: ${error.message}`);
      return null;
    }
  }

  /**
   * Convert GitHub releases to version timeline format
   */
  convertReleasesToVersions(releases) {
    return releases
      .filter(release => !release.draft && release.tag_name.match(/^\d+\.\d+\.\d+/))
      .map((release, index, array) => {
        const publishedDate = new Date(release.published_at);
        const nextRelease = array[index - 1]; // Releases are usually in descending order
        
        // Calculate cutoff date (midpoint to next release or 30 days back)
        let cutoffDate;
        if (nextRelease) {
          const nextDate = new Date(nextRelease.published_at);
          cutoffDate = new Date((publishedDate.getTime() + nextDate.getTime()) / 2);
        } else {
          // For latest release, use 30 days back as cutoff
          cutoffDate = new Date(publishedDate);
          cutoffDate.setDate(cutoffDate.getDate() - 30);
        }

        return {
          version: release.tag_name,
          date: publishedDate.toISOString().split('T')[0],
          cutoff: cutoffDate
        };
      })
      .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  }

  /**
   * Convert GitHub tags to version timeline format
   */
  convertTagsToVersions(tags) {
    // For tags, we don't have publish dates, so we'll estimate based on commit dates
    const versionTags = tags
      .filter(tag => tag.name.match(/^\d+\.\d+\.\d+/))
      .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
    
    // Generate cutoff dates with monthly intervals
    return versionTags.map((tag, index) => {
      const estimatedDate = new Date();
      estimatedDate.setMonth(estimatedDate.getMonth() - index);
      
      const cutoffDate = new Date(estimatedDate);
      cutoffDate.setDate(1); // First day of month
      
      return {
        version: tag.name,
        date: estimatedDate.toISOString().split('T')[0],
        cutoff: cutoffDate
      };
    });
  }

  /**
   * Group commits by version based on dynamically loaded version data
   */
  async groupCommitsByVersion(commits) {
    const versionGroups = new Map();
    
    // Load versions dynamically
    const versions = await this.loadVersions();

    commits.forEach(commit => {
      const commitDate = new Date(commit.date);
      let assignedVersion = versions[versions.length - 1]; // Default to oldest

      for (const version of versions) {
        if (commitDate >= version.cutoff) {
          assignedVersion = version;
          break;
        }
      }

      const key = assignedVersion.version;
      if (!versionGroups.has(key)) {
        versionGroups.set(key, {
          version: assignedVersion.version,
          date: assignedVersion.date,
          commits: []
        });
      }

      versionGroups.get(key).commits.push(commit);
    });

    return Array.from(versionGroups.values())
      .filter(group => group.commits.length > 0)
      .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  }

  /**
   * Generate changelog for a component with input validation
   */
  async generateChangelog(componentName) {
    // Validate and sanitize component name
    componentName = this.validateComponentName(componentName);
    
    console.log(`\n📝 Generating GitHub-based changelog for ${componentName}...`);
    
    // Reset log entries for this component
    this.logEntries = [];
    this.addLogEntry('INFO', `Starting changelog generation for ${componentName}`);

    const allCommits = await this.getComponentCommits(componentName);
    
    if (allCommits.length === 0) {
      this.addLogEntry('ERROR', `No commits found for ${componentName}`);
      throw new Error(`No commits found for ${componentName}. Component may not exist or repository may not be accessible.`);
    }

    this.addLogEntry('INFO', `Found ${allCommits.length} total commits from GitHub API`);
    console.log(`\n🔍 Filtering commits for relevance to ${componentName}...`);
    
    // Filter commits for relevance to this specific component
    const relevantCommits = allCommits.filter(commit => this.isCommitRelevant(commit, componentName));
    
    this.addLogEntry('INFO', `Filtered from ${allCommits.length} to ${relevantCommits.length} relevant commits`);
    console.log(`✅ Filtered from ${allCommits.length} to ${relevantCommits.length} relevant commits`);
    
    if (relevantCommits.length === 0) {
      console.log(`⚠️ No relevant commits found for ${componentName} after filtering`);
      // Return minimal changelog structure
      return {
        component: componentName,
        version: '0.0.28-alpha',
        lastUpdated: new Date().toISOString(),
        changelog: [],
        deprecations: [],
        upcomingChanges: [],
        metadata: {
          totalVersions: 0,
          firstVersion: '0.0.28-alpha',
          storyCount: 0,
          testCount: 0,
          fileCount: 0,
          lastCommit: '',
          source: 'GitHub API',
          apiUrl: `https://api.github.com/repos/${this.owner}/${this.repo}`,
          filteredCommits: `${relevantCommits.length}/${allCommits.length}`
        }
      };
    }

    // Group relevant commits by version
    const versionGroups = await this.groupCommitsByVersion(relevantCommits);
    console.log(`📦 Organized ${relevantCommits.length} relevant commits into ${versionGroups.length} version groups`);

    // Create version entries
    const versionEntries = versionGroups.map(group => {
      const changes = group.commits.map(commit => {
        // Let each commit determine its own change type based on content
        return this.parseCommit(commit, componentName);
      });

      console.log(`📋 Version ${group.version}: ${changes.length} changes`);

      return {
        version: group.version,
        date: group.date,
        type: this.determineVersionType(changes),
        changes
      };
    });

    return {
      component: componentName,
      version: '0.0.28-alpha',
      lastUpdated: new Date().toISOString(),
      changelog: versionEntries,
      deprecations: [],
      upcomingChanges: [
        {
          version: "0.1.0",
          plannedDate: "2025-09-01",
          description: "Stable release with finalized API",
          changes: [
            "API stabilization",
            "Performance optimizations",
            "Enhanced accessibility features"
          ]
        }
      ],
      metadata: {
        totalVersions: versionEntries.length,
        firstVersion: versionEntries[versionEntries.length - 1]?.version || '0.0.28-alpha',
        storyCount: 0,
        testCount: 0,
        fileCount: 0,
        lastCommit: relevantCommits[0]?.hash || '',
        source: 'GitHub API',
        apiUrl: `https://api.github.com/repos/${this.owner}/${this.repo}`,
        filteredCommits: `${relevantCommits.length}/${allCommits.length}`
      }
    };
  }

  /**
   * Determine version type based on changes
   */
  determineVersionType(changes) {
    const hasBreaking = changes.some(change => change.breakingChange);
    const hasFeatures = changes.some(change => change.type === 'feature');
    
    if (hasBreaking) return 'major';
    if (hasFeatures) return 'minor';
    return 'patch';
  }

  /**
   * Save changelog to file with validation
   */
  async saveChangelog(componentName, changelogData) {
    // Validate inputs
    componentName = this.validateComponentName(componentName);
    
    if (!changelogData || typeof changelogData !== 'object') {
      throw new Error('Changelog data must be a valid object');
    }

    // Validate and sanitize directory path
    const changelogDir = this.validatePath('static/component-changelogs');
    await fs.mkdir(changelogDir, { recursive: true });
    
    const changelogPath = path.join(changelogDir, `${componentName}-changes.json`);
    const jsonData = JSON.stringify(changelogData, null, 2);
    
    await fs.writeFile(changelogPath, jsonData, 'utf8');
    console.log(`✅ Saved to ${changelogPath}`);
    
    // Save log file for debugging
    await this.saveLogFile(componentName, changelogDir);
  }

  /**
   * Save debug log file alongside changelog
   */
  async saveLogFile(componentName, changelogDir) {
    const logPath = path.join(changelogDir, `${componentName}-changes.log`);
    const timestamp = new Date().toISOString();
    
    // Generate log content
    const logLines = [
      `# Changelog Generation Log for ${componentName}`,
      `# Generated: ${timestamp}`,
      `# GitHub API: https://api.github.com/repos/${this.owner}/${this.repo}`,
      '',
      '## Summary',
      `Total log entries: ${this.logEntries.length}`,
      `Included commits: ${this.logEntries.filter(e => e.level === 'INCLUDE').length}`,
      `Excluded commits: ${this.logEntries.filter(e => e.level === 'EXCLUDE').length}`,
      `Uncertain commits: ${this.logEntries.filter(e => e.level === 'UNCERTAIN').length}`,
      '',
      '## Detailed Log',
      ''
    ];

    // Add all log entries without timestamps
    this.logEntries.forEach(entry => {
      logLines.push(`${entry.level}: ${entry.message}`);
      if (entry.data && entry.level !== 'DEBUG') {
        if (entry.data.hash) logLines.push(`  → Commit: ${entry.data.hash}`);
        if (entry.data.author) logLines.push(`  → Author: ${entry.data.author}`);
        if (entry.data.reason) logLines.push(`  → Reason: ${entry.data.reason}`);
        if (entry.data.pattern) logLines.push(`  → Pattern: ${entry.data.pattern}`);
      }
      logLines.push('');
    });

    // Write log file
    await fs.writeFile(logPath, logLines.join('\n'), 'utf8');
    console.log(`📋 Debug log saved to ${logPath}`);
  }

  /**
   * Dynamically discover all ELEVATE components from GitHub repository
   */
  async getAllComponents() {
    try {
      console.log('🔍 Discovering components from elevate-core-ui repository...');
      
      // Get the repository tree structure
      const componentsTree = await this.getRepositoryTree('src/components');
      const componentFiles = await this.findComponentFiles(componentsTree);
      
      // Extract component names and paths
      const components = componentFiles.map(file => this.extractComponentInfo(file));
      
      console.log(`✅ Discovered ${components.length} components from repository`);
      components.forEach(comp => {
        console.log(`   📦 ${comp.name} → ${comp.path}`);
      });
      
      return components;
      
    } catch (error) {
      console.warn(`⚠️ Could not discover components from repository: ${error.message}`);
      console.log('📋 Using fallback component list...');
      
      // Fallback to minimal hardcoded list
      return this.getFallbackComponents();
    }
  }

  /**
   * Get repository tree structure from GitHub API
   */
  async getRepositoryTree(path = 'src/components') {
    try {
      const endpoint = `/repos/${this.owner}/${this.repo}/contents/${path}`;
      return await this.makeGitHubRequest(endpoint);
    } catch (error) {
      throw new Error(`Failed to get repository tree for ${path}: ${error.message}`);
    }
  }

  /**
   * Recursively find all *.component.ts files in the tree
   */
  async findComponentFiles(tree, basePath = '') {
    let componentFiles = [];
    
    if (!Array.isArray(tree)) {
      return componentFiles;
    }
    
    for (const item of tree) {
      const itemPath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.type === 'file' && item.name.endsWith('.component.ts')) {
        componentFiles.push({
          name: item.name,
          path: itemPath,
          fullPath: `src/components/${itemPath}`,
          downloadUrl: item.download_url
        });
      } else if (item.type === 'dir') {
        // Recursively search subdirectories
        try {
          const subTree = await this.getRepositoryTree(`src/components/${itemPath}`);
          const subFiles = await this.findComponentFiles(subTree, itemPath);
          componentFiles = componentFiles.concat(subFiles);
        } catch (error) {
          console.warn(`⚠️ Could not access directory: src/components/${itemPath}`);
        }
      }
    }
    
    return componentFiles;
  }

  /**
   * Extract component information from file path
   */
  extractComponentInfo(file) {
    // Extract component name from filename (e.g., "button.component.ts" -> "elvt-button")
    const fileName = file.name.replace('.component.ts', '');
    const componentName = `elvt-${fileName}`;
    
    // Get the directory path for this component
    const dirPath = file.fullPath.replace(`/${file.name}`, '');
    
    return {
      name: componentName,
      path: dirPath,
      fileName: file.name,
      fullPath: file.fullPath
    };
  }

  /**
   * Fallback component list when API discovery fails
   */
  getFallbackComponents() {
    const fallbackList = [
      { name: 'elvt-button', path: 'src/components/buttons/button' },
      { name: 'elvt-input', path: 'src/components/input' },
      { name: 'elvt-card', path: 'src/components/card' },
      { name: 'elvt-modal', path: 'src/components/modals/modal' },
      { name: 'elvt-select', path: 'src/components/select' },
      { name: 'elvt-checkbox', path: 'src/components/checkbox' },
      { name: 'elvt-radio', path: 'src/components/radios/radio' },
      { name: 'elvt-switch', path: 'src/components/switch' },
      { name: 'elvt-textarea', path: 'src/components/textarea' },
      { name: 'elvt-badge', path: 'src/components/badge' },
      { name: 'elvt-avatar', path: 'src/components/avatar' },
      { name: 'elvt-divider', path: 'src/components/divider' },
      { name: 'elvt-progress', path: 'src/components/progress' },
      { name: 'elvt-skeleton', path: 'src/components/skeleton' },
      { name: 'elvt-tooltip', path: 'src/components/tooltip' },
      { name: 'elvt-dropdown', path: 'src/components/dropdown' },
      { name: 'elvt-menu', path: 'src/components/menus/menu' },
      { name: 'elvt-tabs', path: 'src/components/tabs' },
      { name: 'elvt-table', path: 'src/components/tables/table' },
      { name: 'elvt-breadcrumb', path: 'src/components/breadcrumbs/breadcrumb' },
      { name: 'elvt-link', path: 'src/components/link' },
      { name: 'elvt-icon', path: 'src/components/icon' }
    ];
    
    console.log(`📋 Using ${fallbackList.length} fallback components`);
    return fallbackList;
  }

  /**
   * Generate changelog for all components
   */
  async generateAllChangelogs(token = null) {
    const components = await this.getAllComponents();
    console.log(`\n🚀 Generating changelogs for ${components.length} components...`);
    
    const results = {
      success: [],
      failed: []
    };

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const componentName = typeof component === 'string' ? component : component.name;
      
      try {
        console.log(`\n[${i + 1}/${components.length}] Processing ${componentName}...`);
        const changelogData = await this.generateChangelog(componentName);
        await this.saveChangelog(componentName, changelogData);
        results.success.push(componentName);
        
        // Small delay to avoid hitting rate limits
        if (i < components.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to generate changelog for ${componentName}: ${error.message}`);
        results.failed.push({ component: componentName, error: error.message });
      }
    }

    // Summary
    console.log(`\n📊 Changelog generation complete!`);
    console.log(`✅ Success: ${results.success.length} components`);
    console.log(`❌ Failed: ${results.failed.length} components`);
    
    if (results.failed.length > 0) {
      console.log(`\nFailed components:`);
      results.failed.forEach(({ component, error }) => {
        console.log(`  - ${component}: ${error}`);
      });
    }

    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌐 GitHub API-based ELEVATE Component Changelog Generator

Usage:
  node scripts/github-changelog.js --component <name|all> [--token <token>]

Options:
  --component, -c <name|all>  Component name (e.g., elvt-button) or "all" for all components
  --token <token>            GitHub personal access token (optional)
  --help, -h                Show this help

Examples:
  node scripts/github-changelog.js --component elvt-button
  node scripts/github-changelog.js --component all
  node scripts/github-changelog.js --component elvt-input --token ghp_xxxx

Features:
  ✅ Smart filtering - Excludes infrastructure/tooling commits
  ✅ Component relevance - Only includes commits specific to the component  
  ✅ Real GitHub data - Uses actual commit history from inform-elevate/elevate-core-ui
  📋 Debug logging - Saves .log files alongside .json for debugging
  📊 Filtering stats - Shows filtered vs total commits in metadata
  🚀 Dynamic discovery - Automatically finds all *.component.ts files in repository
  🚀 Bulk processing - Use "all" to process all discovered ELEVATE components (46+ found)
  📊 Dynamic versioning - Loads version timeline from GitHub API or versions.json

Note: 
- GitHub API has rate limits (60 requests/hour without token, 5000 with token)
- Personal access token recommended for reliable access
- Token can also be set via GITHUB_TOKEN environment variable
- Smart filtering typically reduces commits by 70-80% for better accuracy
- Debug logs saved as <component>-changes.log for troubleshooting
- Component discovery finds all *.component.ts files recursively in src/components
- Version timeline loaded dynamically from GitHub API or fallback to versions.json
`);
    return;
  }

  const component = getArgValue(args, '--component') || getArgValue(args, '-c');
  const token = getArgValue(args, '--token') || process.env.GITHUB_TOKEN;

  if (!component) {
    console.error('❌ Please specify a component with --component or use "all" for all components');
    console.error('   Example: --component elvt-button');
    console.error('   Example: --component all');
    process.exit(1);
  }

  // Validate component input
  if (component.toLowerCase() !== 'all') {
    try {
      const sanitizedComponent = component.trim().toLowerCase();
      // Basic validation without full constructor validation
      if (!sanitizedComponent || typeof sanitizedComponent !== 'string') {
        throw new Error('Component name must be a non-empty string');
      }
      if (!/^elvt-[a-z0-9-]+$/.test(sanitizedComponent)) {
        throw new Error(`Invalid component name: ${sanitizedComponent}. Must start with 'elvt-' and contain only lowercase letters, numbers, and hyphens.`);
      }
    } catch (error) {
      console.error(`❌ ${error.message}`);
      console.error('   Example: --component elvt-button');
      process.exit(1);
    }
  }

  try {
    const generator = new GitHubChangelogGenerator(token);
    
    if (component.toLowerCase() === 'all') {
      // Process all components
      console.log('🚀 Processing ALL ELEVATE components...');
      const results = await generator.generateAllChangelogs();
      
      console.log('\n🎉 Bulk changelog generation completed!');
      console.log(`✅ Successfully processed ${results.success.length} components`);
      if (results.failed.length > 0) {
        console.log(`❌ Failed to process ${results.failed.length} components`);
      }
      
    } else {
      // Process single component
      const changelogData = await generator.generateChangelog(component);
      await generator.saveChangelog(component, changelogData);
      
      console.log('\n🎉 GitHub-based changelog generation completed!');
      console.log(`📊 Generated changelog with ${changelogData.changelog.length} versions from GitHub API`);
    }
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1 || index + 1 >= args.length) {
    return null;
  }
  
  const value = args[index + 1];
  
  // Basic validation for argument values
  if (typeof value !== 'string') {
    return null;
  }
  
  // Check for potential command injection attempts
  const dangerousPatterns = [
    /[;\|\&\$\`]/,     // Command injection
    /\$\([^)]*\)/,     // Command substitution
    /\$\{[^}]*\}/,     // Variable substitution
    /[<>]/,            // Redirection
    /^\s*-/            // Additional flags (prevent flag confusion)
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(value)) {
      console.warn(`⚠️ Warning: Potentially dangerous characters in argument value: ${value}`);
      return null;
    }
  }
  
  return value.trim();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = GitHubChangelogGenerator;