#!/usr/bin/env node

/**
 * Comprehensive test runner for the Baheka Tech website
 * Runs all test suites and generates reports
 */

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function runTests() {
  const startTime = Date.now();
  const results = {
    unit: null,
    e2e: null,
    mutation: null,
    coverage: null,
    timestamp: new Date().toISOString(),
  };

  log('🚀 Starting comprehensive test suite...', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  // Ensure reports directory exists
  if (!existsSync('reports')) {
    mkdirSync('reports', { recursive: true });
  }

  try {
    // 1. Unit Tests with Coverage
    log('\n📋 Running unit tests with coverage...', 'blue');
    log('───────────────────────────────────────────', 'blue');
    await runCommand('npx', ['jest', '--coverage', '--passWithNoTests']);
    results.unit = 'PASSED';
    results.coverage = 'GENERATED';
    log('✅ Unit tests completed successfully', 'green');

  } catch (error) {
    log('❌ Unit tests failed', 'red');
    results.unit = 'FAILED';
  }

  try {
    // 2. End-to-End Tests
    log('\n🎭 Running E2E tests...', 'magenta');
    log('───────────────────────────────────────────', 'magenta');
    await runCommand('npx', ['playwright', 'test', '--reporter=html']);
    results.e2e = 'PASSED';
    log('✅ E2E tests completed successfully', 'green');

  } catch (error) {
    log('❌ E2E tests failed', 'red');
    results.e2e = 'FAILED';
  }

  try {
    // 3. Mutation Tests
    log('\n🧬 Running mutation tests...', 'yellow');
    log('───────────────────────────────────────────', 'yellow');
    await runCommand('npx', ['stryker', 'run']);
    results.mutation = 'PASSED';
    log('✅ Mutation tests completed successfully', 'green');

  } catch (error) {
    log('❌ Mutation tests failed', 'red');
    results.mutation = 'FAILED';
  }

  // Generate test report
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  const report = {
    ...results,
    duration: `${duration}s`,
    summary: {
      total: Object.values(results).filter(r => r === 'PASSED' || r === 'FAILED').length,
      passed: Object.values(results).filter(r => r === 'PASSED').length,
      failed: Object.values(results).filter(r => r === 'FAILED').length,
    }
  };

  writeFileSync('reports/test-report.json', JSON.stringify(report, null, 2));

  // Display summary
  log('\n📊 Test Summary', 'bright');
  log('═══════════════════════════════════════════', 'bright');
  log(`Total Duration: ${duration}s`, 'cyan');
  log(`Unit Tests: ${results.unit || 'SKIPPED'}`, results.unit === 'PASSED' ? 'green' : 'red');
  log(`E2E Tests: ${results.e2e || 'SKIPPED'}`, results.e2e === 'PASSED' ? 'green' : 'red');
  log(`Mutation Tests: ${results.mutation || 'SKIPPED'}`, results.mutation === 'PASSED' ? 'green' : 'red');
  log(`Coverage Report: ${results.coverage || 'NOT GENERATED'}`, results.coverage === 'GENERATED' ? 'green' : 'yellow');

  const allPassed = report.summary.failed === 0 && report.summary.passed > 0;
  log(`\n${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`, allPassed ? 'green' : 'red');

  if (allPassed) {
    log('🎉 Ready for deployment!', 'green');
  } else {
    log('🔧 Please fix failing tests before deployment', 'yellow');
  }

  return allPassed;
}

// Run the tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n💥 Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });