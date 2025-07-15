# Testing Documentation

## Overview

This project uses a comprehensive testing strategy with multiple tools to ensure code quality, reliability, and maintainability.

## Testing Stack

### 1. **Jest** - Unit & Integration Testing
- **Purpose**: Unit tests for components, functions, and API endpoints
- **Configuration**: `jest.config.js`
- **Setup**: `client/src/test/setup.ts`
- **Coverage**: Minimum 80% threshold for branches, functions, lines, and statements

### 2. **Stryker** - Mutation Testing
- **Purpose**: Tests the quality of our tests by introducing mutations
- **Configuration**: `stryker.conf.js`
- **Thresholds**: High: 80%, Low: 60%, Break: 50%
- **Coverage**: Tests frontend, backend, and shared code

### 3. **Playwright** - End-to-End Testing
- **Purpose**: Full application testing across browsers
- **Configuration**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Features**: Screenshots, videos, trace on failures

### 4. **SonarQube** - Code Quality
- **Purpose**: Code quality analysis, security scanning, technical debt
- **Configuration**: `sonar-project.properties`
- **Integration**: GitHub Actions for continuous monitoring

## Test Scripts

```bash
# Unit Tests
npm test                    # Run all unit tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report

# Mutation Testing
npm run test:mutation       # Run mutation tests with Stryker

# End-to-End Tests
npm run test:e2e            # Run E2E tests
npm run test:e2e:ui         # Run E2E tests with UI
npm run test:e2e:debug      # Run E2E tests in debug mode

# All Tests
npm run test:all            # Run all test suites

# Code Quality
npm run sonar               # Run SonarQube analysis
```

## Test Structure

```
project/
├── client/src/
│   ├── components/
│   │   ├── ui/__tests__/           # UI component tests
│   │   └── sections/__tests__/     # Section component tests
│   └── test/
│       └── setup.ts                # Test configuration
├── server/
│   └── __tests__/                  # Server-side tests
├── e2e/                           # End-to-end tests
│   ├── home.spec.ts
│   ├── contact.spec.ts
│   └── navigation.spec.ts
├── jest.config.js                 # Jest configuration
├── playwright.config.ts           # Playwright configuration
├── stryker.conf.js               # Stryker configuration
└── sonar-project.properties      # SonarQube configuration
```

## Test Categories

### Unit Tests
- **Components**: Button, Form components, Layout components
- **Hooks**: Custom React hooks
- **Services**: API functions, utilities
- **Storage**: Database operations

### Integration Tests
- **API Endpoints**: Contact form, user management
- **Database**: Storage operations
- **Authentication**: User session management

### End-to-End Tests
- **Navigation**: Page routing, mobile menu
- **Forms**: Contact form submission
- **Responsive Design**: Mobile, tablet, desktop
- **Accessibility**: ARIA labels, keyboard navigation

### Mutation Tests
- **Logic Coverage**: Conditional statements, loops
- **Boundary Testing**: Edge cases, error conditions
- **Test Quality**: Effectiveness of existing tests

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
- Unit Tests with coverage
- Mutation testing
- E2E tests across browsers
- SonarQube analysis
- Build verification
- Deployment (on main branch)
```

### Quality Gates
- **Coverage**: Minimum 80% code coverage
- **Mutation Score**: Minimum 60% mutation score
- **SonarQube**: No critical security issues
- **E2E Tests**: All tests must pass across browsers

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert** pattern
2. **Descriptive test names**
3. **Test edge cases** and error conditions
4. **Mock external dependencies**
5. **Test user interactions** not implementation details

### Test Organization
1. **Co-locate tests** with source code
2. **Use setup files** for common configurations
3. **Group related tests** in describe blocks
4. **Maintain test independence**

### Performance
1. **Parallel test execution**
2. **Test timeouts** for async operations
3. **Clean up resources** after tests
4. **Use test databases** for isolation

## Continuous Monitoring

### Metrics Tracked
- **Code Coverage**: Line, branch, function coverage
- **Mutation Score**: Test effectiveness
- **Test Execution Time**: Performance monitoring
- **Flaky Tests**: Reliability tracking

### Reporting
- **Coverage Reports**: HTML and LCOV formats
- **Mutation Reports**: Stryker dashboard
- **E2E Reports**: Playwright HTML reports
- **SonarQube Dashboard**: Code quality metrics

## Local Development

### Running Tests
```bash
# Quick test run
npm test

# With coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Full test suite
npm run test:all
```

### Debugging Tests
```bash
# Debug unit tests
npm test -- --debug

# Debug E2E tests
npm run test:e2e:debug

# UI mode for E2E tests
npm run test:e2e:ui
```

## Troubleshooting

### Common Issues
1. **Test timeouts**: Increase timeout in configuration
2. **DOM cleanup**: Use proper cleanup in setup files
3. **Mock issues**: Verify mock implementations
4. **Browser tests**: Check browser compatibility

### Environment Setup
1. **Node.js version**: Ensure correct version
2. **Dependencies**: Run `npm ci` for clean install
3. **Database**: Use test database for isolation
4. **Browsers**: Install Playwright browsers

This comprehensive testing setup ensures high code quality, catches regressions early, and provides confidence in deployments.