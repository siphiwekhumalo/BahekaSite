# Exact Netlify Configuration for bahekawebsite

## Build Settings (Copy-Paste Ready)

### Build & Deploy Settings
```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist/public
Functions directory: netlify/functions
```

### Environment Variables
Add these in Site settings → Environment variables:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com
NODE_ENV=production
```

## Custom Domain Configuration

### Step 1: Add Domain
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Enter: `bahekatechfirm.com`
4. Click **Verify**

### Step 2: DNS Records for AWS Route 53
Add these exact records in your AWS Route 53 console:

```
Record 1:
Type: CNAME
Name: bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300

Record 2:
Type: CNAME
Name: www.bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300
```

## Deploy Configuration

### Deploy Contexts
```
Production branch: main
Branch deploys: All
Deploy previews: Any pull request against your production branch
```

### Build Settings
```
Node.js version: 20.x
Package manager: npm
Build timeout: 15 minutes
```

## Testing Your Setup

### 1. Test Build Command Locally
```bash
npm run build
# Should create dist/public/ directory
```

### 2. Test Functions Locally
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test locally
netlify dev
```

### 3. Test Contact Form
```bash
curl -X POST https://bahekawebsite.netlify.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com", 
    "service": "Web Development",
    "message": "Test deployment"
  }'
```

## Expected File Structure After Build

```
dist/
└── public/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── [other static files]

netlify/
└── functions/
    ├── contact.js
    ├── health.js
    └── package.json
```

## Deployment Checklist

### Before First Deploy
- [ ] Repository connected to Netlify
- [ ] Build command configured: `npm run build`
- [ ] Publish directory set: `dist/public`
- [ ] Environment variables added
- [ ] `netlify.toml` file present in repo root

### After First Deploy
- [ ] Site accessible at bahekawebsite.netlify.app
- [ ] Functions working at `/api/contact` and `/api/health`
- [ ] Custom domain configured
- [ ] DNS records added
- [ ] SSL certificate provisioned
- [ ] Contact form tested and working

## Common Issues & Solutions

### Build Fails
- Check build logs in Netlify dashboard
- Verify `npm run build` works locally
- Ensure all dependencies are in package.json

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify functions are in `netlify/functions/` directory
- Test locally with `netlify dev`

### Domain Not Resolving
- Verify DNS records are correct
- Check DNS propagation with online tools
- Allow 24-48 hours for full propagation

## Performance Optimizations

Your `netlify.toml` is configured with:
- Asset bundling and minification
- Long-term caching for static assets
- Security headers
- SPA routing support

## Next Steps

1. **Deploy**: Push your code to trigger first build
2. **Verify**: Check build succeeds and site loads
3. **Test Functions**: Verify contact form works
4. **Add Domain**: Configure bahekatechfirm.com
5. **Test Production**: Full end-to-end testing

Your Baheka Tech website will be live with global CDN performance!