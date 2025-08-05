# Netlify Domain Setup - Quick Checklist

## Current Location
You're at: https://app.netlify.com/projects/bahekawebsite/domain-management#production-domains

## Immediate Actions

### 1. Add Custom Domain (In Current Page)
Click "Add custom domain" and enter:
```
bahekatechfirm.com
```

### 2. Configure DNS in AWS Route 53
After adding domain, create these records:

**Apex Domain:**
```
Type: CNAME
Name: bahekatechfirm.com
Value: bahekawebsite.netlify.app
```

**WWW Subdomain:**
```
Type: CNAME
Name: www.bahekatechfirm.com
Value: bahekawebsite.netlify.app
```

### 3. Environment Variables
Go to Site settings → Environment variables and add:
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com
NODE_ENV=production
```

### 4. Build Settings Verification
Ensure these are set correctly:
- Build command: `npm run build`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`

## Expected Result
After DNS propagation (5-60 minutes):
- Site live at: https://bahekatechfirm.com
- SSL certificate automatically provisioned
- Contact form functional at: /api/contact

## Testing Commands
```bash
# Check DNS resolution
nslookup bahekatechfirm.com

# Test site
curl -I https://bahekatechfirm.com

# Test contact form
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"Web Development","message":"Test"}'
```

Your Baheka Tech website will be live with custom domain and global CDN performance!