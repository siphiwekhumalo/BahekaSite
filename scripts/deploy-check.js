#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks all requirements before deployment
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkItem(description, check) {
  const result = check();
  const status = result ? '✅' : '❌';
  const color = result ? 'green' : 'red';
  log(`${status} ${description}`, color);
  return result;
}

async function runDeploymentCheck() {
  log('🚀 Pre-deployment verification checklist', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  const checks = [];

  // 1. Check required files exist
  log('\n📁 File Structure Check', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  checks.push(checkItem('package.json exists', () => existsSync('package.json')));
  checks.push(checkItem('netlify.toml exists', () => existsSync('netlify.toml')));
  checks.push(checkItem('jest.config.js exists', () => existsSync('jest.config.js')));
  checks.push(checkItem('playwright.config.ts exists', () => existsSync('playwright.config.ts')));
  checks.push(checkItem('Client source files exist', () => existsSync('client/src')));
  checks.push(checkItem('Server source files exist', () => existsSync('server')));
  checks.push(checkItem('Shared schemas exist', () => existsSync('shared/schema.ts')));

  // 2. Check configuration files
  log('\n⚙️ Configuration Check', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  checks.push(checkItem('TypeScript config exists', () => existsSync('tsconfig.json')));
  checks.push(checkItem('Tailwind config exists', () => existsSync('tailwind.config.ts')));
  checks.push(checkItem('Vite config exists', () => existsSync('vite.config.ts')));
  checks.push(checkItem('Drizzle config exists', () => existsSync('drizzle.config.ts')));

  // 3. Check Netlify configuration
  log('\n🌐 Netlify Configuration', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  try {
    const netlifyConfig = readFileSync('netlify.toml', 'utf8');
    checks.push(checkItem('Build command configured', () => netlifyConfig.includes('command = "npm run build"')));
    checks.push(checkItem('Publish directory configured', () => netlifyConfig.includes('publish = "dist/public"')));
    checks.push(checkItem('Functions directory configured', () => netlifyConfig.includes('functions = "netlify/functions"')));
  } catch (error) {
    checks.push(checkItem('Netlify config readable', () => false));
  }

  // 4. Check test files
  log('\n🧪 Test Infrastructure', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  checks.push(checkItem('Unit tests exist', () => existsSync('client/src/components/ui/__tests__')));
  checks.push(checkItem('E2E tests exist', () => existsSync('e2e')));
  checks.push(checkItem('Server tests exist', () => existsSync('server/__tests__')));
  checks.push(checkItem('Shared tests exist', () => existsSync('shared/__tests__')));

  // 5. Check environment setup
  log('\n🔐 Environment Configuration', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  checks.push(checkItem('Environment example exists', () => existsSync('.env.example')));
  checks.push(checkItem('SendGrid config available', () => {
    const hasKey = process.env.SENDGRID_API_KEY;
    return hasKey && hasKey.startsWith('SG.');
  }));

  // 6. Check build process
  log('\n🏗️ Build Process', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    checks.push(checkItem('Build script exists', () => packageJson.scripts && packageJson.scripts.build));
    checks.push(checkItem('Dev script exists', () => packageJson.scripts && packageJson.scripts.dev));
    checks.push(checkItem('Start script exists', () => packageJson.scripts && packageJson.scripts.start));
  } catch (error) {
    checks.push(checkItem('Package.json readable', () => false));
  }

  // 7. Check documentation
  log('\n📚 Documentation', 'blue');
  log('───────────────────────────────────────────', 'blue');
  
  checks.push(checkItem('README exists', () => existsSync('README.md')));
  checks.push(checkItem('Replit docs exist', () => existsSync('replit.md')));
  checks.push(checkItem('Testing guide exists', () => existsSync('docs/TESTING.md')));
  checks.push(checkItem('Deployment guide exists', () => existsSync('TESTING-DEPLOYMENT-GUIDE.md')));

  // Summary
  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  const percentage = Math.round((passed / total) * 100);

  log('\n📊 Deployment Readiness Summary', 'bright');
  log('═══════════════════════════════════════════', 'bright');
  log(`Total Checks: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${total - passed}`, 'red');
  log(`Success Rate: ${percentage}%`, percentage >= 90 ? 'green' : percentage >= 75 ? 'yellow' : 'red');

  if (percentage >= 90) {
    log('\n🎉 Deployment Ready!', 'green');
    log('All critical checks passed. Safe to deploy.', 'green');
  } else if (percentage >= 75) {
    log('\n⚠️ Deployment Caution', 'yellow');
    log('Most checks passed but some issues found.', 'yellow');
  } else {
    log('\n❌ Deployment Blocked', 'red');
    log('Critical issues found. Please fix before deployment.', 'red');
  }

  return percentage >= 90;
}

// Run the deployment check
runDeploymentCheck()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n💥 Deployment check failed: ${error.message}`, 'red');
    process.exit(1);
  });