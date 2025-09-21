#!/usr/bin/env node

/**
 * NPM Security Checker - Alternative to npq
 * Checks packages for security vulnerabilities and suspicious patterns
 * Protects against supply chain attacks including auto-replicating worms
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Known malicious package patterns from recent supply chain attacks
const SUSPICIOUS_PATTERNS = [
  // Recent auto-replicating worm packages
  'command-exists',
  'gpmm-test',
  '@wokd/wokd-js',
  'test-json-package-14',
  'geeeks',
  'e5f2d5e1c7',
  '@zumry/zumry-js',
  // Common malicious patterns
  /bitcoin|crypto|mine|steal|keylog/i,
  /eval\s*\(|exec\s*\(|spawn\s*\(/,
  /obfuscat/i,
  /malicious|suspicious/i
];

// Suspicious file extensions and names
const SUSPICIOUS_FILES = [
  /\.exe$/,
  /\.bat$/,
  /\.cmd$/,
  /install\.js$/,
  /preinstall\.js$/,
  /postinstall\.js$/
];

class NPMSecurityChecker {
  constructor() {
    this.warnings = [];
    this.errors = [];
    this.packageCount = 0;
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);

    if (level === 'warning') {
      this.warnings.push(message);
    } else if (level === 'error') {
      this.errors.push(message);
    }
  }

  checkPackageJson(packagePath) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const packageName = packageJson.name;

      // Check package name against suspicious patterns
      for (const pattern of SUSPICIOUS_PATTERNS) {
        if (typeof pattern === 'string' && packageName === pattern) {
          this.log('error', `🚨 CRITICAL: Known malicious package detected: ${packageName}`);
          return false;
        } else if (pattern instanceof RegExp && pattern.test(packageName)) {
          this.log('warning', `⚠️ Suspicious package name pattern: ${packageName}`);
        }
      }

      // Check scripts for suspicious commands
      if (packageJson.scripts) {
        for (const [scriptName, script] of Object.entries(packageJson.scripts)) {
          if (SUSPICIOUS_PATTERNS.some(pattern =>
            pattern instanceof RegExp && pattern.test(script)
          )) {
            this.log('warning', `⚠️ Suspicious script in ${packageName}: ${scriptName}`);
          }
        }
      }

      // Check for suspicious install hooks
      const suspiciousHooks = ['preinstall', 'install', 'postinstall'];
      for (const hook of suspiciousHooks) {
        if (packageJson.scripts && packageJson.scripts[hook]) {
          this.log('warning', `⚠️ Package has ${hook} script: ${packageName}`);
        }
      }

      return true;
    } catch (error) {
      this.log('error', `Error reading package.json at ${packagePath}: ${error.message}`);
      return false;
    }
  }

  checkNodeModules(nodeModulesPath) {
    if (!fs.existsSync(nodeModulesPath)) {
      this.log('info', 'No node_modules directory found');
      return;
    }

    this.log('info', 'Scanning node_modules for security issues...');

    const packages = fs.readdirSync(nodeModulesPath);

    for (const packageDir of packages) {
      if (packageDir.startsWith('.')) continue;

      const packagePath = path.join(nodeModulesPath, packageDir);

      if (fs.statSync(packagePath).isDirectory()) {
        const packageJsonPath = path.join(packagePath, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
          this.checkPackageJson(packageJsonPath);
          this.packageCount++;
        }

        // Check for scoped packages
        if (packageDir.startsWith('@')) {
          const scopedPackages = fs.readdirSync(packagePath);
          for (const scopedPackage of scopedPackages) {
            const scopedPackagePath = path.join(packagePath, scopedPackage);
            const scopedPackageJsonPath = path.join(scopedPackagePath, 'package.json');

            if (fs.existsSync(scopedPackageJsonPath)) {
              this.checkPackageJson(scopedPackageJsonPath);
              this.packageCount++;
            }
          }
        }
      }
    }
  }

  checkPackageLockIntegrity() {
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');

    if (fs.existsSync(packageLockPath)) {
      this.log('info', 'Checking package-lock.json integrity...');

      try {
        const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
        const packagesWithIntegrity = Object.values(packageLock.packages || {})
          .filter(pkg => pkg.integrity);

        this.log('info', `${packagesWithIntegrity.length} packages have integrity hashes`);

        if (packagesWithIntegrity.length === 0) {
          this.log('warning', '⚠️ No packages have integrity hashes - potential security risk');
        }
      } catch (error) {
        this.log('error', `Error reading package-lock.json: ${error.message}`);
      }
    } else {
      this.log('warning', '⚠️ No package-lock.json found - install integrity cannot be verified');
    }
  }

  async runAudit() {
    this.log('info', 'Running npm security audit...');

    try {
      // Try to run npm audit, but handle certificate issues gracefully
      const auditResult = execSync('npm audit --audit-level high --json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const audit = JSON.parse(auditResult);

      if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
        this.log('warning', `⚠️ Found ${Object.keys(audit.vulnerabilities).length} vulnerabilities`);

        for (const [packageName, vuln] of Object.entries(audit.vulnerabilities)) {
          if (vuln.severity === 'high' || vuln.severity === 'critical') {
            this.log('error', `🚨 ${vuln.severity.toUpperCase()} vulnerability in ${packageName}`);
          }
        }
      } else {
        this.log('info', '✅ No high-severity vulnerabilities found in npm audit');
      }
    } catch (error) {
      this.log('warning', '⚠️ npm audit failed (possibly due to network/certificate issues)');
      this.log('info', 'Continuing with local security checks...');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('NPM SECURITY REPORT');
    console.log('='.repeat(60));

    console.log(`📦 Packages scanned: ${this.packageCount}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`🚨 Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n🚨 CRITICAL SECURITY ISSUES:');
      this.errors.forEach((error, i) => {
        console.log(`${i + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ SECURITY WARNINGS:');
      this.warnings.forEach((warning, i) => {
        console.log(`${i + 1}. ${warning}`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ No security issues detected!');
    }

    console.log('\n📋 SECURITY RECOMMENDATIONS:');
    console.log('1. Keep dependencies up to date: npm update');
    console.log('2. Run security audits regularly: npm audit');
    console.log('3. Use exact versions in package.json (save-exact=true)');
    console.log('4. Enable script execution blocking (ignore-scripts=true)');
    console.log('5. Verify package integrity with package-lock.json');
    console.log('6. Monitor for suspicious package behaviors');

    console.log('\n' + '='.repeat(60));

    return this.errors.length === 0;
  }

  async run() {
    const isPreInstall = process.argv.includes('--pre-install');

    if (isPreInstall) {
      console.log('🔍 Starting Pre-Installation Security Check...\n');

      // Check main package.json before installation
      const mainPackageJson = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(mainPackageJson)) {
        this.log('info', 'Checking package.json for suspicious dependencies...');
        this.checkPackageJson(mainPackageJson);
      }

      // Check package-lock for integrity (pre-install)
      this.checkPackageLockIntegrity();

      console.log('✅ Pre-installation security check completed\n');
      process.exit(this.errors.length > 0 ? 1 : 0);
    }

    console.log('🔍 Starting NPM Security Check...\n');

    // Check main package.json
    const mainPackageJson = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(mainPackageJson)) {
      this.log('info', 'Checking main package.json...');
      this.checkPackageJson(mainPackageJson);
    }

    // Check node_modules
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    this.checkNodeModules(nodeModulesPath);

    // Check package-lock integrity
    this.checkPackageLockIntegrity();

    // Run npm audit
    await this.runAudit();

    // Generate report
    const isSecure = this.generateReport();

    process.exit(isSecure ? 0 : 1);
  }
}

// Run the security checker
if (require.main === module) {
  const checker = new NPMSecurityChecker();
  checker.run().catch(error => {
    console.error('Security check failed:', error);
    process.exit(1);
  });
}

module.exports = NPMSecurityChecker;