# Netlify Deployment Guide for bahekatechfirm.com

## Quick Setup Guide

### Step 1: Connect to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign up/login
2. **Connect your repository**:
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your Baheka Tech repository

### Step 2: Configure Build Settings

**Build Settings in Netlify:**
- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist/public`

### Step 3: Environment Variables

Add these environment variables in Netlify:
- Go to **Site settings > Environment variables**
- Add these variables:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com
NODE_ENV=production
```

### Step 4: Custom Domain Setup

1. **In Netlify Dashboard**:
   - Go to **Domain settings**
   - Click **Add custom domain**
   - Enter: `bahekatechfirm.com`

2. **DNS Configuration**:
   Since your domain uses AWS nameservers, add these records in AWS Route 53:
   ```
   Type: CNAME
   Name: bahekatechfirm.com
   Value: your-site-name.netlify.app
   
   Type: CNAME
   Name: www.bahekatechfirm.com
   Value: your-site-name.netlify.app
   ```

3. **SSL Certificate**:
   - Netlify will automatically provision SSL
   - Wait for "SSL certificate provisioned" status

## Features Included

### ✅ Automatic Features
- **Fast CDN**: Global content delivery
- **SSL Certificate**: Automatic HTTPS
- **Continuous Deployment**: Auto-deploy on git push
- **Form Handling**: Contact form via Netlify Functions
- **Security Headers**: Built-in security configuration

### ✅ Netlify Functions
- **Contact Form**: `/api/contact` endpoint
- **Health Check**: `/api/health` endpoint
- **Email Integration**: SendGrid email notifications

### ✅ Performance Optimizations
- **Static Assets**: Cached for 1 year
- **Compression**: Automatic gzip/brotli
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Optimized JavaScript bundles

## File Structure Created

```
netlify/
├── functions/
│   ├── contact.js      # Contact form handler
│   ├── health.js       # Health check endpoint
│   └── package.json    # Functions dependencies
├── netlify.toml        # Netlify configuration
└── deploy/
    └── netlify-setup.md # This guide
```

## Testing Your Deployment

### 1. Local Testing
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Test locally
netlify dev
```

### 2. Production Testing
After deployment, test these URLs:
- `https://bahekatechfirm.com` - Main website
- `https://bahekatechfirm.com/api/contact` - Contact form endpoint
- `https://bahekatechfirm.com/api/health` - Health check

### 3. Contact Form Testing
```bash
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "service": "Web Development",
    "message": "Test message from deployment"
  }'
```

## Advanced Configuration

### Custom Headers
Already configured in `netlify.toml`:
- Security headers (XSS protection, HSTS, etc.)
- Cache control for static assets
- CORS headers for API endpoints

### Redirects
- API routes redirect to Netlify Functions
- SPA redirect for client-side routing
- 404 pages redirect to React router

### Build Optimizations
- Node.js 20 runtime
- Automatic dependency caching
- Parallel function builds

## Monitoring & Analytics

### Built-in Analytics
- **Netlify Analytics**: Traffic and performance metrics
- **Function Logs**: Monitor contact form submissions
- **Deploy Logs**: Track build and deployment status

### Optional Integrations
- **Google Analytics**: Add tracking code to `index.html`
- **Sentry**: Error monitoring for production
- **LogRocket**: User session recording

## Custom Domain Migration

### From AWS Route 53
1. Keep existing A records for email
2. Add CNAME for web traffic to Netlify
3. Update MX records if needed
4. Test thoroughly before removing old records

### DNS Records Summary
```
# For web traffic (to Netlify)
bahekatechfirm.com     CNAME  your-site.netlify.app
www.bahekatechfirm.com CNAME  your-site.netlify.app

# For email (if using email service)
bahekatechfirm.com     MX     10 mail.bahekatechfirm.com
```

## Troubleshooting

### Common Issues

**Build Failures**
- Check build logs in Netlify dashboard
- Verify Node.js version (should be 20)
- Ensure all dependencies are in package.json

**Function Errors**
- Check function logs in Netlify dashboard
- Verify environment variables are set
- Test functions locally with `netlify dev`

**Domain Issues**
- Verify DNS records are correct
- Check SSL certificate status
- Allow 24-48 hours for DNS propagation

### Support Resources
- **Netlify Docs**: https://docs.netlify.com/
- **Community Forum**: https://answers.netlify.com/
- **Status Page**: https://netlifystatus.com/

## Performance Expectations

### Metrics You Should See
- **Load Time**: <1 second globally
- **SSL Grade**: A+ rating
- **Uptime**: 99.9% availability
- **CDN**: Global edge locations

### Optimization Tips
- Use WebP images where possible
- Minimize JavaScript bundles
- Enable service worker for caching
- Monitor Core Web Vitals

## Cost Estimation

### Free Tier Includes
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 function invocations/month
- SSL certificate included
- Custom domain included

### Paid Features (if needed)
- **Pro**: $19/month for team features
- **Business**: $99/month for advanced analytics
- **Enterprise**: Custom pricing for large scale

Your Baheka Tech website will be lightning-fast with global CDN delivery!