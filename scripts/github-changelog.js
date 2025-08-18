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
   * Get commits for a specific component from GitHub API with pagination
   */
  async getComponentCommits(componentName) {
    try {
      console.log(`🌐 Fetching commits from GitHub API for ${componentName}...`);
      
      const componentPath = await this.getComponentPath(componentName);
      const allCommits = [];
      let page = 1;
      const perPage = 100; // Maximum allowed by GitHub API
      const maxPages = 50; // Safety limit: max 5000 commits per component
      
      while (page <= maxPages) {
        const endpoint = `/repos/${this.owner}/${this.repo}/commits?path=${componentPath}&per_page=${perPage}&page=${page}`;
        
        console.log(`📡 Fetching page ${page}: ${endpoint}`);
        
        const commits = await this.makeGitHubRequest(endpoint);
        
        if (!Array.isArray(commits)) {
          throw new Error('Invalid response from GitHub API');
        }

        console.log(`📄 Page ${page}: Found ${commits.length} commits`);
        
        // If we get fewer commits than the page size, we've reached the end
        if (commits.length === 0) {
          console.log(`📋 Reached end of commits at page ${page}`);
          break;
        }
        
        allCommits.push(...commits);
        
        // If we got fewer than the full page size, this is the last page
        if (commits.length < perPage) {
          console.log(`📋 Last page detected (${commits.length} < ${perPage})`);
          break;
        }
        
        page++;
      }

      console.log(`✅ Total commits fetched: ${allCommits.length} across ${page - 1} pages`);

      return allCommits.map(commit => ({
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
    
    // EXCLUSION RULES - Skip only truly irrelevant commits
    const exclusionPatterns = [
      // Only exclude very specific infrastructure that has no component impact
      { pattern: /^chore\(prettier\)|^chore\(eslint\)|^fix\(lint\)/, reason: 'Code formatting only' },
      { pattern: /^chore\(deps\).*dev\s+dependencies/, reason: 'Dev dependencies only' },
      { pattern: /\.github\/workflows|github.*action.*config/, reason: 'CI/CD config only' },
      { pattern: /package\.json.*scripts|yarn\.lock|npm.*lockfile/, reason: 'Package scripts only' },
      
      // Only exclude documentation that doesn't affect component behavior
      { pattern: /readme.*typo|changelog.*format|docs.*typo/, reason: 'Documentation typos' },
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
    
    // Add component-specific patterns - only include if component name is mentioned
    if (componentName === 'elvt-button') {
      inclusionPatterns.push({ pattern: /button.*(group|pill|shape|variant|size|icon|loading|disabled)/i, reason: 'Button-specific feature' });
      inclusionPatterns.push({ pattern: /(group|pill|shape|variant|size|icon|loading|disabled).*button/i, reason: 'Button-specific feature' });
    }
    if (componentName === 'elvt-badge') {
      inclusionPatterns.push({ pattern: /badge.*(pulse|animation|tone|shape)/i, reason: 'Badge-specific feature' });
      inclusionPatterns.push({ pattern: /(pulse|animation|tone|shape).*badge/i, reason: 'Badge-specific feature' });
    }
    if (componentName === 'elvt-input') {
      inclusionPatterns.push({ pattern: /input.*(validation|field|type|placeholder|disabled|readonly)/i, reason: 'Input-specific feature' });
      inclusionPatterns.push({ pattern: /(validation|field|type|placeholder|disabled|readonly).*input/i, reason: 'Input-specific feature' });
    }
    if (componentName === 'elvt-card') {
      inclusionPatterns.push({ pattern: /card.*(border|layer|padding|hover|elevation)/i, reason: 'Card-specific feature' });
      inclusionPatterns.push({ pattern: /(border|layer|padding|hover|elevation).*card/i, reason: 'Card-specific feature' });
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
    
    // STRICTER INCLUSION RULES - Only include changes that definitely affect this specific component
    const strictInclusionPatterns = [
      // Only include changes that explicitly mention this component in context
      { pattern: new RegExp(`(${componentShortName}|${componentName})\\s+(design|style|update|change|fix|improve|enhance|refactor)`, 'i'), reason: 'Component-specific change' },
      { pattern: new RegExp(`(update|change|fix|improve|enhance|refactor)\\s+(${componentShortName}|${componentName})`, 'i'), reason: 'Component-specific change' },
      { pattern: new RegExp(`(style|design|adjust|restyle)\\s+(elevate\\s+)?${componentShortName}`, 'i'), reason: 'Component styling' },
      
      // Breaking changes that affect ALL components (rare but important)
      { pattern: /breaking.*all\s+components|all\s+components.*breaking|global.*breaking.*change/i, reason: 'Global breaking change' },
      
      // Critical system-wide changes that affect component behavior (very selective)
      { pattern: /web\s+component\s+decorator|component\s+base|lit\s+element.*change/i, reason: 'Component framework change' },
      { pattern: /design\s+tokens.*update.*all|all.*components.*design.*token/i, reason: 'Global design token change' },
      
      // Component-specific patterns that must include the component name
      { pattern: new RegExp(`${componentShortName}\\s+(group|wrapper|container|variant|size|shape|state)`, 'i'), reason: 'Component feature' },
    ];
    
    // Check stricter inclusion patterns - only truly relevant changes
    for (const { pattern, reason } of strictInclusionPatterns) {
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
      console.log('📡 Fetching ALL version information from GitHub API...');
      const gitHubVersions = await this.getVersionsFromGitHub();
      
      if (gitHubVersions && gitHubVersions.length > 0) {
        console.log(`✅ Found ${gitHubVersions.length} versions from GitHub API`);
        console.log(`🏷️ Version range: ${gitHubVersions[gitHubVersions.length - 1]?.version} to ${gitHubVersions[0]?.version}`);
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
      console.log(`🏷️ Version range: ${processedVersions[processedVersions.length - 1]?.version} to ${processedVersions[0]?.version}`);
      return processedVersions;
      
    } catch (error) {
      console.warn(`⚠️ Could not load versions.json: ${error.message}`);
      
      // Enhanced fallback: Create a single current version without time limits
      console.log('📋 Creating dynamic fallback version based on current date...');
      const now = new Date();
      const currentVersion = '0.0.28-alpha'; // This will be the "catch-all" version
      
      return [
        { 
          version: currentVersion, 
          date: now.toISOString().split('T')[0], 
          cutoff: new Date('2020-01-01') // Very old cutoff date to catch ALL commits
        }
      ];
    }
  }

  /**
   * Get version information from GitHub API (releases/tags)
   */
  async getVersionsFromGitHub() {
    try {
      console.log('🏷️ Fetching tags from GitHub API...');
      const tagsEndpoint = `/repos/${this.owner}/${this.repo}/tags`;
      
      // Get ALL tags with pagination
      let allTags = [];
      let page = 1;
      const perPage = 100;
      const maxPages = 10; // Up to 1000 tags
      
      while (page <= maxPages) {
        const endpoint = `${tagsEndpoint}?per_page=${perPage}&page=${page}`;
        console.log(`📡 Fetching tags page ${page}...`);
        
        const tags = await this.makeGitHubRequest(endpoint);
        
        if (!Array.isArray(tags) || tags.length === 0) {
          console.log(`📋 No more tags found at page ${page}`);
          break;
        }
        
        console.log(`🏷️ Page ${page}: Found ${tags.length} tags`);
        allTags.push(...tags);
        
        // If we got fewer than the full page size, this is the last page
        if (tags.length < perPage) {
          console.log(`📋 Last page detected (${tags.length} < ${perPage})`);
          break;
        }
        
        page++;
      }
      
      console.log(`✅ Total tags fetched: ${allTags.length}`);
      
      if (allTags.length === 0) {
        console.log('📋 No tags found, trying releases...');
        const releasesEndpoint = `/repos/${this.owner}/${this.repo}/releases`;
        const releases = await this.makeGitHubRequest(releasesEndpoint);
        
        if (!Array.isArray(releases) || releases.length === 0) {
          return null;
        }
        
        // Convert releases to version format
        return this.convertReleasesToVersions(releases);
      }
      
      // Convert tags to version format with commit date lookup
      return await this.convertTagsToVersionsWithCommitDates(allTags);
      
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
   * Convert GitHub tags to version timeline format with actual commit dates
   */
  async convertTagsToVersionsWithCommitDates(tags) {
    console.log('📅 Converting tags to versions with actual commit dates...');
    
    // Filter for version-like tags (semantic versioning pattern)
    const versionTags = tags.filter(tag => {
      const name = tag.name;
      // Match patterns like: 0.0.28-alpha, 1.0.0, v1.0.0, etc.
      return /^v?\d+\.\d+\.\d+/.test(name);
    });
    
    console.log(`🏷️ Found ${versionTags.length} version tags out of ${tags.length} total tags`);
    
    if (versionTags.length === 0) {
      console.warn('⚠️ No version tags found, using fallback method');
      return this.convertTagsToVersions(tags);
    }
    
    // Get commit dates for each tag
    const versionsWithDates = [];
    
    for (let i = 0; i < Math.min(versionTags.length, 50); i++) { // Limit to 50 most recent versions to avoid rate limiting
      const tag = versionTags[i];
      
      try {
        console.log(`📅 Getting commit date for tag: ${tag.name}`);
        
        // Get the commit for this tag
        const commitEndpoint = `/repos/${this.owner}/${this.repo}/commits/${tag.commit.sha}`;
        const commit = await this.makeGitHubRequest(commitEndpoint);
        
        if (commit && commit.commit && commit.commit.author && commit.commit.author.date) {
          const commitDate = new Date(commit.commit.author.date);
          
          versionsWithDates.push({
            version: tag.name,
            date: commitDate.toISOString().split('T')[0],
            commitDate: commitDate,
            sha: tag.commit.sha
          });
          
          console.log(`✅ ${tag.name}: ${commitDate.toISOString().split('T')[0]}`);
        } else {
          console.warn(`⚠️ Could not get commit date for tag: ${tag.name}`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`⚠️ Error getting commit date for tag ${tag.name}: ${error.message}`);
      }
    }
    
    // Sort by commit date (newest first)
    versionsWithDates.sort((a, b) => b.commitDate.getTime() - a.commitDate.getTime());
    
    // Calculate cutoff dates based on actual commit dates
    const versionsWithCutoffs = versionsWithDates.map((version, index) => {
      const nextVersion = versionsWithDates[index + 1];
      
      let cutoffDate;
      if (nextVersion) {
        // Use midpoint between this version and the next one
        const thisTime = version.commitDate.getTime();
        const nextTime = nextVersion.commitDate.getTime();
        cutoffDate = new Date((thisTime + nextTime) / 2);
      } else {
        // For the oldest version, go back 30 days from its commit date
        cutoffDate = new Date(version.commitDate);
        cutoffDate.setDate(cutoffDate.getDate() - 30);
      }
      
      return {
        version: version.version,
        date: version.date,
        cutoff: cutoffDate
      };
    });
    
    console.log(`✅ Successfully converted ${versionsWithCutoffs.length} tags to versions with commit dates`);
    
    return versionsWithCutoffs;
  }

  /**
   * Convert GitHub tags to version timeline format (fallback method)
   */
  convertTagsToVersions(tags) {
    // For tags, we don't have publish dates, so we'll estimate based on commit dates
    const versionTags = tags
      .filter(tag => tag.name.match(/^v?\d+\.\d+\.\d+/))
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
      
      // Extract component names, paths, and metadata
      const components = [];
      for (const file of componentFiles) {
        try {
          const componentInfo = await this.extractComponentInfo(file);
          components.push(componentInfo);
        } catch (error) {
          console.warn(`⚠️ Failed to extract info for ${file.name}: ${error.message}`);
          // Fallback to basic info without metadata
          const fileName = file.name.replace('.component.ts', '');
          const componentName = `elvt-${fileName}`;
          const dirPath = file.fullPath.replace(`/${file.name}`, '');
          components.push({
            name: componentName,
            path: dirPath,
            fileName: file.name,
            fullPath: file.fullPath,
            status: 'Unknown',
            since: 'Unknown',
            description: ''
          });
        }
      }
      
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
  async extractComponentInfo(file) {
    // Extract component name from filename (e.g., "button.component.ts" -> "elvt-button")
    const fileName = file.name.replace('.component.ts', '');
    const componentName = `elvt-${fileName}`;
    
    // Get the directory path for this component
    const dirPath = file.fullPath.replace(`/${file.name}`, '');
    
    // Read actual Status and Since information from local component files
    const metadata = await this.extractComponentMetadataFromLocal(componentName, file.fullPath);
    
    return {
      name: componentName,
      path: dirPath,
      fileName: file.name,
      fullPath: file.fullPath,
      status: metadata.status,
      since: metadata.since,
      description: metadata.description
    };
  }

  /**
   * Extract component metadata from local node_modules files
   * Reads actual @since and @status information from component source files
   */
  async extractComponentMetadataFromLocal(componentName, githubPath) {
    try {
      console.log(`🔍 Reading metadata from local files for ${componentName}...`);
      
      // Convert component name to file path in local node_modules
      // elvt-button -> node_modules/@inform-elevate/elevate-core-ui/dist/components/buttons/button/button.component.d.ts
      const componentBaseName = componentName.replace('elvt-', '');
      
      // Try different possible paths for the component
      const possiblePaths = [
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/${componentBaseName}s/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/buttons/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/tables/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/menus/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/radios/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/breadcrumbs/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/tabs/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/expansion-panels/${componentBaseName}/${componentBaseName}.component.d.ts`,
        `node_modules/@inform-elevate/elevate-core-ui/dist/components/fields/${componentBaseName}/${componentBaseName}.component.d.ts`
      ];
      
      for (const filePath of possiblePaths) {
        try {
          console.log(`📄 Trying: ${filePath}`);
          const content = await fs.readFile(filePath, 'utf8');
          console.log(`✅ Found content for ${componentName}`);
          return this.parseComponentMetadata(content);
        } catch (error) {
          // File doesn't exist at this path, try next one
          continue;
        }
      }
      
      console.warn(`⚠️ No local component file found for ${componentName}`);
      return { status: 'Unknown', since: 'Unknown', description: `${componentName} component` };
      
    } catch (error) {
      console.warn(`⚠️ Failed to read local metadata for ${componentName}: ${error.message}`);
      return { status: 'Unknown', since: 'Unknown', description: `${componentName} component` };
    }
  }


  /**
   * Extract component metadata from TypeScript source file
   * Looks for Status:, Since:, and description in the first comment block
   */
  async extractComponentMetadata(filePath) {
    try {
      console.log(`🔍 Attempting to extract metadata from: ${filePath}`);
      
      // Check if filePath is already a complete file path (has .component.ts extension)
      if (filePath.endsWith('.component.ts') || filePath.endsWith('.component.tsx')) {
        console.log(`📄 Using direct file path: ${filePath}`);
        try {
          const endpoint = `/repos/${this.owner}/${this.repo}/contents/${filePath}`;
          const fileData = await this.makeGitHubRequest(endpoint);
          
          if (fileData.content) {
            console.log(`✅ Found file content for: ${filePath}`);
            // Decode base64 content
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            console.log(`📋 Content preview: ${content.substring(0, 300)}...`);
            
            return this.parseComponentMetadata(content);
          }
        } catch (fileError) {
          console.log(`❌ File not accessible: ${filePath} (${fileError.message})`);
        }
      } else {
        // Treat as directory path - try to find the main component file
        const possibleFiles = [
          `${filePath}/index.ts`,
          `${filePath}/${filePath.split('/').pop()}.ts`,
          `${filePath}/${filePath.split('/').pop()}.component.ts`,
          `${filePath}.ts`,
          `${filePath}.component.ts`
        ];
        
        for (const fileToTry of possibleFiles) {
          try {
            console.log(`📄 Trying file: ${fileToTry}`);
            const endpoint = `/repos/${this.owner}/${this.repo}/contents/${fileToTry}`;
            const fileData = await this.makeGitHubRequest(endpoint);
            
            if (fileData.content) {
              console.log(`✅ Found file content for: ${fileToTry}`);
              // Decode base64 content
              const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
              console.log(`📋 Content preview: ${content.substring(0, 300)}...`);
              
              return this.parseComponentMetadata(content);
            }
          } catch (fileError) {
            console.log(`❌ File not found: ${fileToTry} (${fileError.message})`);
            continue;
          }
        }
      }
      
      console.warn(`⚠️ No component source file found for ${filePath}`);
      return { status: 'Unknown', since: 'Unknown', description: '' };
      
    } catch (error) {
      console.warn(`⚠️ Failed to fetch metadata for ${filePath}: ${error.message}`);
      return { status: 'Unknown', since: 'Unknown', description: '' };
    }
  }

  /**
   * Parse component metadata from source content
   * Looks for JSDoc @since and @status annotations in ALL comment blocks
   */
  parseComponentMetadata(content) {
    const metadata = {
      status: 'Unknown',
      since: 'Unknown', 
      description: ''
    };

    // Find ALL comment blocks (/** ... */ or /* ... */)
    const commentBlockPattern = /\/\*\*?([\s\S]*?)\*\//g;
    const commentMatches = Array.from(content.matchAll(commentBlockPattern));
    
    if (commentMatches.length === 0) {
      console.warn('⚠️ No comment blocks found in component file');
      return metadata;
    }
    
    console.log(`🔍 Found ${commentMatches.length} comment blocks, searching for @since and @status...`);
    
    // Search through ALL comment blocks for @since and @status
    for (let i = 0; i < commentMatches.length; i++) {
      const commentContent = commentMatches[i][1];
      console.log(`📝 Checking comment block ${i + 1}...`);
      
      // Extract @status JSDoc annotation
      const statusPattern = /\*?\s*@status\s+([^\n\r\*]+)/i;
      const statusMatch = commentContent.match(statusPattern);
      if (statusMatch && metadata.status === 'Unknown') {
        metadata.status = statusMatch[1].trim();
        console.log(`✅ Found @status "${metadata.status}" in comment block ${i + 1}`);
      }
      
      // Extract @since JSDoc annotation  
      const sincePattern = /\*?\s*@since\s+([^\n\r\*]+)/i;
      const sinceMatch = commentContent.match(sincePattern);
      if (sinceMatch && metadata.since === 'Unknown') {
        metadata.since = sinceMatch[1].trim();
        console.log(`✅ Found @since "${metadata.since}" in comment block ${i + 1}`);
      }
      
      // Extract description (first meaningful line from the first comment block with @since/@status)
      if ((statusMatch || sinceMatch) && !metadata.description) {
        const lines = commentContent.split(/\n|\r\n?/);
        for (const line of lines) {
          const cleanLine = line.replace(/^\s*\*\s*/, '').trim();
          if (cleanLine && 
              !cleanLine.startsWith('@') &&
              !cleanLine.startsWith('*') &&
              cleanLine.length > 5) { // Ensure it's substantial
            metadata.description = cleanLine;
            console.log(`📝 Found description: "${metadata.description.substring(0, 50)}..."`);
            break;
          }
        }
      }
      
      // Stop searching if we found both @since and @status
      if (metadata.status !== 'Unknown' && metadata.since !== 'Unknown') {
        console.log(`✅ Found both @status and @since, stopping search at comment block ${i + 1}`);
        break;
      }
    }
    
    console.log(`📋 Final metadata: Status="${metadata.status}", Since="${metadata.since}", Description="${metadata.description.substring(0, 50)}..."`);    
    return metadata;
  }

  /**
   * Fallback component list when API discovery fails
   */
  getFallbackComponents() {
    const fallbackList = [
      { name: 'elvt-button', path: 'src/components/buttons/button', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-input', path: 'src/components/input', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-card', path: 'src/components/card', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-modal', path: 'src/components/modals/modal', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-select', path: 'src/components/select', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-checkbox', path: 'src/components/checkbox', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-radio', path: 'src/components/radios/radio', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-switch', path: 'src/components/switch', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-textarea', path: 'src/components/textarea', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-badge', path: 'src/components/badge', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-avatar', path: 'src/components/avatar', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-divider', path: 'src/components/divider', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-progress', path: 'src/components/progress', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-skeleton', path: 'src/components/skeleton', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-tooltip', path: 'src/components/tooltip', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-dropdown', path: 'src/components/dropdown', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-menu', path: 'src/components/menus/menu', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-tabs', path: 'src/components/tabs', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-table', path: 'src/components/tables/table', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-breadcrumb', path: 'src/components/breadcrumbs/breadcrumb', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-link', path: 'src/components/link', status: 'Unknown', since: 'Unknown', description: '' },
      { name: 'elvt-icon', path: 'src/components/icon', status: 'Unknown', since: 'Unknown', description: '' }
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

  /**
   * Generate component metadata table data for ComponentTable component
   */
  async generateComponentTableData() {
    console.log('\n📊 Generating component metadata table data...');
    
    try {
      const components = await this.getAllComponents();
      const tableData = [];
      
      console.log(`\n🚀 Processing ${components.length} components for metadata...`);
      
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const componentName = typeof component === 'string' ? component : component.name;
        
        try {
          console.log(`[${i + 1}/${components.length}] Processing ${componentName}...`);
          
          // Get the last change version from changelog
          let lastChangeVersion = '0.0.28-alpha';
          let lastChangeDate = new Date().toISOString();
          
          try {
            const changelogData = await this.generateChangelog(componentName);
            if (changelogData.changelog && changelogData.changelog.length > 0) {
              const latestChange = changelogData.changelog[0];
              lastChangeVersion = latestChange.version || '0.0.28-alpha';
              lastChangeDate = latestChange.date || lastChangeDate;
            }
          } catch (changelogError) {
            console.warn(`⚠️ Could not get changelog for ${componentName}: ${changelogError.message}`);
          }
          
          // Extract component info (includes metadata)
          const componentInfo = typeof component === 'object' ? component : {
            name: componentName,
            path: '',
            status: 'Unknown',
            since: 'Unknown',
            description: ''
          };
          
          tableData.push({
            name: componentInfo.name,
            displayName: componentInfo.name.replace('elvt-', ''),
            status: componentInfo.status || 'Unknown',
            since: componentInfo.since || 'Unknown',
            lastChangeVersion: lastChangeVersion,
            lastChangeDate: lastChangeDate,
            description: componentInfo.description || '',
            path: componentInfo.path || ''
          });
          
          // Small delay to avoid hitting rate limits
          if (i < components.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
        } catch (error) {
          console.error(`❌ Failed to process ${componentName}: ${error.message}`);
          // Add fallback entry
          tableData.push({
            name: componentName,
            displayName: componentName.replace('elvt-', ''),
            status: 'Unknown',
            since: 'Unknown', 
            lastChangeVersion: '0.0.28-alpha',
            lastChangeDate: new Date().toISOString(),
            description: '',
            path: ''
          });
        }
      }
      
      // Sort by component name
      tableData.sort((a, b) => a.name.localeCompare(b.name));
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'static', 'component-metadata', 'component-table-data.json');
      
      // Ensure directory exists
      const outputDir = path.dirname(outputPath);
      try {
        await fs.mkdir(outputDir, { recursive: true });
      } catch (mkdirError) {
        // Directory might already exist, that's okay
      }
      
      await fs.writeFile(outputPath, JSON.stringify({
        generatedAt: new Date().toISOString(),
        source: 'GitHub API',
        components: tableData
      }, null, 2));
      
      console.log(`\n✅ Component table data saved to: ${outputPath}`);
      console.log(`📊 Processed ${tableData.length} components`);
      
      return tableData;
      
    } catch (error) {
      console.error(`❌ Failed to generate component table data: ${error.message}`);
      throw error;
    }
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
  node scripts/github-changelog.js --table-data [--token <token>]

Options:
  --component, -c <name|all>  Component name (e.g., elvt-button) or "all" for all components
  --table-data               Generate component table data with Status and Since info
  --token <token>            GitHub personal access token (optional)
  --help, -h                Show this help

Examples:
  node scripts/github-changelog.js --component elvt-button
  node scripts/github-changelog.js --component all
  node scripts/github-changelog.js --table-data
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
  const tableData = args.includes('--table-data');
  const token = getArgValue(args, '--token') || process.env.GITHUB_TOKEN;

  if (!component && !tableData) {
    console.error('❌ Please specify either --component <name|all> or --table-data');
    console.error('   Example: --component elvt-button');
    console.error('   Example: --component all');
    console.error('   Example: --table-data');
    process.exit(1);
  }

  // Validate component input (only if component mode)
  if (component && component.toLowerCase() !== 'all') {
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
    
    if (tableData) {
      // Generate component table data
      console.log('📊 Generating component table data with Status and Since information...');
      const tableDataResult = await generator.generateComponentTableData();
      
      console.log('\n🎉 Component table data generation completed!');
      console.log(`📊 Generated metadata for ${tableDataResult.length} components`);
      console.log('💾 Data saved to: static/component-metadata/component-table-data.json');
      
    } else if (component.toLowerCase() === 'all') {
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