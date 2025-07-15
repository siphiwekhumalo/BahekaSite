# Testing & Deployment Guide

## Overview
This guide covers the comprehensive testing infrastructure and deployment process for the Baheka Tech website project.

## Testing Infrastructure

### 1. Testing Stack
- **Jest**: Unit and integration testing
- **Stryker**: Mutation testing for test quality
- **Playwright**: End-to-end testing across browsers
- **SonarQube**: Code quality analysis
- **GitHub Actions**: CI/CD pipeline automation

### 2. Test Coverage
- **Unit Tests**: Components, services, storage operations
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Full user workflows across devices
- **Mutation Tests**: Test effectiveness validation

### 3. Quality Gates
- 80% minimum code coverage
- 60% minimum mutation score
- All E2E tests passing
- No critical security issues

## Running Tests

### Local Development
```bash
# Install dependencies
npm install

# Run unit tests
npx jest

# Run with coverage
npx jest --coverage

# Run E2E tests (requires running server)
npx playwright test

# Run mutation tests
npx stryker run
```

### CI/CD Pipeline
The GitHub Actions workflow automatically runs:
1. Unit tests with coverage
2. Mutation testing
3. E2E tests across browsers
4. SonarQube analysis
5. Build verification
6. Deployment (on main branch)

## Deployment Process

### 1. Netlify Deployment
The application is configured for Netlify deployment with:
- Build command: `npm run build`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`
- Domain: bahekatechfirm.com

### 2. Environment Variables
Required for production:
- `SENDGRID_API_KEY`: Email service (format: SG.xxxxx)
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production"

### 3. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Code coverage above 80%
- [ ] No security vulnerabilities
- [ ] Environment variables configured
- [ ] Domain DNS properly configured
- [ ] SSL certificate active

### 4. Post-deployment Verification
- [ ] Contact form functionality
- [ ] Email notifications working
- [ ] Mobile responsiveness
- [ ] Page load performance
- [ ] SEO meta tags

## Production Monitoring

### Health Checks
- Contact form submission tracking
- Email delivery monitoring
- Database connection status
- Performance metrics

### Error Handling
- Graceful email fallback
- Database connection resilience
- User-friendly error messages
- Logging and monitoring

## Security Features

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Email Security
- SendGrid API key validation
- Spam prevention
- Rate limiting
- Content filtering

## Performance Optimization

### Frontend
- Code splitting
- Image optimization
- CSS minification
- JavaScript bundling

### Backend
- Database query optimization
- Caching strategies
- Connection pooling
- Response compression

## Troubleshooting

### Common Issues
1. **Test failures**: Check environment setup
2. **Email not sending**: Verify SendGrid API key
3. **Database connection**: Check connection string
4. **Build errors**: Verify dependencies

### Support
- Review error logs
- Check environment variables
- Verify API keys
- Test locally first

This comprehensive testing and deployment setup ensures reliable, secure, and high-quality production deployment for the Baheka Tech website.