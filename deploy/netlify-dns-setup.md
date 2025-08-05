# Netlify DNS Configuration for bahekatechfirm.com

## Current Setup
- **Netlify Team**: siphiwekhumalo
- **Domain**: bahekatechfirm.com
- **DNS Management**: AWS Route 53 (registered with Amazon Registrar)

## DNS Records Configuration

### For AWS Route 53
Since your domain is registered with Amazon and uses AWS nameservers, configure these records in your AWS Route 53 console:

#### Primary Domain Record
```
Type: CNAME
Name: bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300
```

#### WWW Subdomain Record  
```
Type: CNAME
Name: www.bahekatechfirm.com
Value: bahekawebsite.netlify.app
TTL: 300
```

#### Alternative: A Records (if CNAME doesn't work for apex domain)
```
Type: A
Name: bahekatechfirm.com
Value: 75.2.60.5
TTL: 300

Type: A
Name: www.bahekatechfirm.com  
Value: 75.2.60.5
TTL: 300
```

## Step-by-Step DNS Setup

### Step 1: Access AWS Route 53
1. Go to AWS Console → Route 53
2. Click "Hosted zones"
3. Find and click on "bahekatechfirm.com"

### Step 2: Create CNAME Records
1. Click "Create record"
2. **For apex domain (bahekatechfirm.com)**:
   - Record name: (leave empty)
   - Record type: CNAME
   - Value: bahekawebsite.netlify.app
   - TTL: 300
   - Click "Create records"

3. **For www subdomain**:
   - Record name: www
   - Record type: CNAME
   - Value: bahekawebsite.netlify.app
   - TTL: 300
   - Click "Create records"

### Step 3: Verify DNS Propagation
Wait 5-15 minutes, then test:
```bash
nslookup bahekatechfirm.com
nslookup www.bahekatechfirm.com
```

## Netlify Domain Configuration

### Step 1: Add Domain in Netlify
1. Go to your Netlify site dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter: `bahekatechfirm.com`
5. Click "Verify"

### Step 2: Configure WWW Redirect
1. In Domain settings, under "Domain management"
2. Set primary domain to either:
   - `bahekatechfirm.com` (recommended)
   - `www.bahekatechfirm.com`
3. Enable "Force HTTPS"

### Step 3: SSL Certificate
- Netlify will automatically provision SSL certificate
- Wait for "Certificate provisioned" status
- This may take 5-10 minutes after DNS propagation

## Testing Your Setup

### DNS Resolution Test
```bash
# Test apex domain
dig bahekatechfirm.com

# Test www subdomain  
dig www.bahekatechfirm.com

# Test from different locations
curl -I https://bahekatechfirm.com
curl -I https://www.bahekatechfirm.com
```

### Website Functionality Test
1. **Main site**: https://bahekatechfirm.com
2. **Contact form**: https://bahekatechfirm.com/api/contact
3. **Health check**: https://bahekatechfirm.com/api/health

### Contact Form Test
```bash
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "service": "Web Development", 
    "message": "DNS configuration test"
  }'
```

## Troubleshooting

### Common Issues

**DNS Not Resolving**
- Check DNS propagation (can take up to 48 hours)
- Verify CNAME records point to correct Netlify URL
- Try using A records if CNAME fails for apex domain

**SSL Certificate Issues**
- Ensure DNS is properly configured first
- Wait for DNS propagation before requesting SSL
- Check domain verification in Netlify dashboard

**Site Not Loading**
- Verify build completed successfully
- Check publish directory is set to `dist/public`
- Ensure functions are deployed correctly

### DNS Propagation Tools
- https://www.whatsmydns.net/
- https://dnschecker.org/
- https://www.dnswatch.info/

## Expected Timeline
- **DNS propagation**: 5-60 minutes
- **SSL certificate**: 5-10 minutes after DNS resolves
- **Full functionality**: 15-30 minutes total

## Final Checklist
- [ ] DNS records created in AWS Route 53
- [ ] Domain added in Netlify dashboard
- [ ] DNS propagation complete
- [ ] SSL certificate provisioned
- [ ] Website loads at both bahekatechfirm.com and www.bahekatechfirm.com
- [ ] Contact form functional
- [ ] All pages accessible

Your Baheka Tech website will be live with custom domain and SSL!