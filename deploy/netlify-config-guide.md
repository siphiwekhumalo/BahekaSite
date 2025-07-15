# Netlify Configuration for bahekawebsite

## Current Project Setup
- **Netlify Project**: bahekawebsite
- **URL**: https://app.netlify.com/projects/bahekawebsite/configuration/deploys
- **Target Domain**: bahekatechfirm.com

## Build Configuration

### Site Settings → Build & Deploy
```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist/public
```

### Deploy Contexts
```
Production branch: main
Branch deploys: All
Deploy previews: Any pull request
```

## Environment Variables

### Required Variables
Go to **Site settings → Environment variables** and add:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com
NODE_ENV=production
```

## Custom Domain Setup

### Step 1: Add Custom Domain
1. Go to **Domain settings → Add custom domain**
2. Enter: `bahekatechfirm.com`
3. Netlify will show DNS instructions

### Step 2: Configure DNS in AWS Route 53
Since your domain uses AWS nameservers, add these records:

```
Type: CNAME
Name: bahekatechfirm.com
Value: bahekawebsite.netlify.app

Type: CNAME  
Name: www.bahekatechfirm.com
Value: bahekawebsite.netlify.app
```

### Step 3: SSL Certificate
- Netlify will automatically provision SSL
- Wait for "Certificate provisioned" status
- Enable "Force HTTPS"

## Function Configuration

### Functions Directory
- **Directory**: `netlify/functions`
- **Runtime**: Node.js 18.x
- **Bundler**: esbuild

### Available Endpoints
- `/api/contact` - Contact form handler
- `/api/health` - Health check endpoint

## Deployment Triggers

### Auto Deploy
- **Git push** to main branch
- **Pull request** previews
- **Manual deploy** from dashboard

### Build Settings
- **Node.js version**: 20.x
- **Build timeout**: 15 minutes
- **Concurrent builds**: 3

## Performance Optimizations

### Asset Optimization
- **Image optimization**: Enabled
- **Bundle optimization**: Enabled
- **Minification**: Enabled

### Caching
- **Static assets**: 1 year cache
- **Build cache**: Enabled
- **Plugin cache**: Enabled

## Security Headers

Already configured via `netlify.toml`:
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Monitoring

### Analytics
- **Netlify Analytics**: Available in dashboard
- **Real User Monitoring**: Enabled
- **Performance metrics**: Core Web Vitals

### Notifications
- **Deploy notifications**: Email/Slack
- **Form submissions**: Email alerts
- **Uptime monitoring**: Available

## Troubleshooting

### Common Build Issues
1. **Build failed**: Check build logs for errors
2. **Functions not working**: Verify function syntax
3. **Environment variables**: Ensure all required vars are set

### DNS Issues
1. **Domain not resolving**: Check DNS propagation
2. **SSL certificate pending**: Wait for domain verification
3. **Mixed content**: Ensure all assets use HTTPS

## Testing Your Deployment

### Manual Testing
1. Visit: `https://bahekatechfirm.com`
2. Test contact form submission
3. Verify all pages load correctly
4. Check mobile responsiveness

### Automated Testing
```bash
# Test contact form
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "service": "Web Development",
    "message": "Test submission"
  }'

# Test health endpoint
curl https://bahekatechfirm.com/api/health
```

## Next Steps

1. **Configure build settings** as shown above
2. **Add environment variables** for email functionality
3. **Set up custom domain** with DNS records
4. **Test deployment** thoroughly
5. **Monitor performance** in dashboard

Your Baheka Tech website will be live with global CDN performance!