# Netlify Domain Setup Instructions

## Current Status
- **Project**: bahekawebsite
- **Target Domain**: bahekatechfirm.com
- **Current Page**: Domain Management → Production Domains

## Step-by-Step Domain Setup

### 1. Add Custom Domain
In the current page (Domain Management):
1. Click "Add custom domain"
2. Enter: `bahekatechfirm.com`
3. Click "Verify"

### 2. Configure DNS Records
After adding the domain, Netlify will show DNS instructions. Since you're using AWS Route 53:

**Go to AWS Route 53 Console:**
1. Navigate to Route 53 → Hosted zones
2. Click on "bahekatechfirm.com"
3. Create these records:

**Record 1 (Apex Domain):**
```
Type: CNAME
Name: bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300
```

**Record 2 (WWW Subdomain):**
```
Type: CNAME
Name: www.bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300
```

### 3. SSL Certificate
- Netlify will automatically provision SSL after DNS resolves
- This typically takes 5-10 minutes
- You'll see "Certificate provisioned" status when ready

### 4. Domain Configuration
In Netlify Domain settings:
- Set primary domain to `bahekatechfirm.com`
- Enable "Force HTTPS"
- Enable "Pretty URLs"

## Build Configuration Check

Ensure these settings are correct:
- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`

## Environment Variables

Add these in Site settings → Environment variables:
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=info@bahekatech.com
NODE_ENV=production
```

## Testing After Setup

### DNS Resolution Test
```bash
nslookup bahekatechfirm.com
nslookup www.bahekatechfirm.com
```

### Website Access Test
- https://bahekatechfirm.com
- https://www.bahekatechfirm.com

### API Endpoints Test
- https://bahekatechfirm.com/api/health
- https://bahekatechfirm.com/api/contact

## Expected Timeline
- DNS propagation: 5-60 minutes
- SSL certificate: 5-10 minutes after DNS resolves
- Full functionality: 15-30 minutes total

## Troubleshooting

### If Domain Verification Fails
- Ensure DNS records are correctly configured
- Wait for DNS propagation (check with online tools)
- Try refreshing the domain verification

### If SSL Certificate Doesn't Provision
- Ensure DNS is resolving correctly
- Check that domain verification is complete
- Wait additional 10-15 minutes

### If Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies are installed
- Ensure build command produces `dist/public` directory

Your Baheka Tech website will be live with custom domain and SSL certificates!