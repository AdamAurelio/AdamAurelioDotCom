# Cloudflare Setup Guide

Complete guide for configuring Cloudflare DNS, CDN, and security features.

## Prerequisites

- [ ] Domain name registered
- [ ] Cloudflare account (free plan works)
- [ ] AWS Lightsail static IP address

## Step 1: Add Your Site to Cloudflare

### 1.1 Sign Up or Log In

1. Go to https://cloudflare.com
2. Sign up for a free account or log in

### 1.2 Add Your Site

1. Click **"Add a Site"**
2. Enter your domain: `adamaurelio.com`
3. Select **Free Plan**
4. Click **"Continue"**

### 1.3 Review DNS Records

Cloudflare will scan your existing DNS records. Review them and click **"Continue"**.

### 1.4 Change Nameservers

Cloudflare will provide you with two nameservers:

- `example.ns.cloudflare.com`
- `example.ns.cloudflare.com`

Go to your domain registrar and update the nameservers to these values.

**Wait 5-10 minutes** for DNS propagation.

## Step 2: Configure DNS Records

### 2.1 Add A Records

Go to **DNS** → **Records** and add the following:

| Type | Name | Content           | Proxy Status | TTL  |
| ---- | ---- | ----------------- | ------------ | ---- |
| A    | @    | YOUR_LIGHTSAIL_IP | Proxied (🟠) | Auto |
| A    | www  | YOUR_LIGHTSAIL_IP | Proxied (🟠) | Auto |
| A    | api  | YOUR_LIGHTSAIL_IP | Proxied (🟠) | Auto |

**Replace `YOUR_LIGHTSAIL_IP`** with your actual static IP from AWS Lightsail.

### 2.2 Add CNAME Records (Optional Subdomains)

If you want additional subdomains:

| Type  | Name      | Content         | Proxy Status | TTL  |
| ----- | --------- | --------------- | ------------ | ---- |
| CNAME | blog      | adamaurelio.com | Proxied (🟠) | Auto |
| CNAME | portfolio | adamaurelio.com | Proxied (🟠) | Auto |

### 2.3 Verify DNS

```powershell
# Check DNS resolution
nslookup adamaurelio.com
nslookup www.adamaurelio.com
nslookup api.adamaurelio.com
```

## Step 3: SSL/TLS Configuration

### 3.1 Set SSL/TLS Mode

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **"Full (strict)"**

This ensures end-to-end encryption between Cloudflare and your origin server.

### 3.2 Enable Always Use HTTPS

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **"Always Use HTTPS"**
3. This automatically redirects HTTP to HTTPS

### 3.3 Enable HSTS

1. Still in **Edge Certificates**
2. Enable **"HTTP Strict Transport Security (HSTS)"**
3. Configure:
   - Max Age: **6 months (15768000)**
   - Apply to subdomains: **Yes**
   - Preload: **Yes**
   - No-Sniff Header: **Yes**

### 3.4 Set Minimum TLS Version

1. In **Edge Certificates**
2. Set **Minimum TLS Version** to **TLS 1.2**

### 3.5 Enable Automatic HTTPS Rewrites

1. In **Edge Certificates**
2. Enable **"Automatic HTTPS Rewrites"**

## Step 4: Speed Optimization

### 4.1 Enable Auto Minify

1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** for:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

### 4.2 Enable Brotli Compression

1. In **Speed** → **Optimization**
2. Enable **Brotli** compression

### 4.3 Configure Caching

1. Go to **Caching** → **Configuration**
2. Set **Caching Level** to **Standard**
3. Set **Browser Cache TTL** to **4 hours**

### 4.4 Create Page Rules

Go to **Rules** → **Page Rules** and create these rules:

#### Rule 1: API Caching

- URL: `api.adamaurelio.com/*`
- Settings:
  - Cache Level: **Bypass**
  - Disable Security
  - Disable Performance

#### Rule 2: Static Assets Caching

- URL: `adamaurelio.com/*.{jpg,jpeg,png,gif,ico,css,js,svg,woff,woff2}`
- Settings:
  - Cache Level: **Cache Everything**
  - Edge Cache TTL: **1 month**

#### Rule 3: Blog Caching

- URL: `blog.adamaurelio.com/*`
- Settings:
  - Cache Level: **Standard**
  - Edge Cache TTL: **2 hours**

## Step 5: Security Configuration

### 5.1 Configure Firewall Rules

1. Go to **Security** → **WAF**
2. Set Security Level to **Medium**
3. Enable **Browser Integrity Check**

### 5.2 Create Firewall Rules (Optional)

Go to **Security** → **WAF** → **Custom rules**:

#### Block Bad Bots

```
(cf.client.bot) and (not cf.verified_bot_category in {"Search Engine Crawler"})
```

Action: **Block**

#### Rate Limiting

```
(http.request.uri.path contains "/api/")
```

Action: **Challenge**
Rate: **100 requests per 60 seconds**

### 5.3 Enable DDoS Protection

1. Go to **Security** → **DDoS**
2. Cloudflare automatically protects against DDoS attacks
3. Review settings and keep **HTTP DDoS attack protection** enabled

### 5.4 Configure Bot Fight Mode

1. Go to **Security** → **Bots**
2. Enable **Bot Fight Mode** (Free plan)
3. This helps protect against malicious bots

## Step 6: Performance Monitoring

### 6.1 Enable Analytics

1. Go to **Analytics** → **Traffic**
2. Monitor:
   - Requests
   - Bandwidth
   - Unique visitors
   - Threats blocked

### 6.2 Set Up Alerts (Optional)

1. Go to **Notifications**
2. Create alerts for:
   - DDoS attacks
   - SSL/TLS certificate expiration
   - High error rates

## Step 7: Additional Optimization

### 7.1 Enable Argo Smart Routing (Paid)

If you want even faster performance:

1. Go to **Speed** → **Optimization**
2. Enable **Argo Smart Routing** ($5/month + $0.10/GB)

### 7.2 Configure Workers (Optional)

For advanced customization:

1. Go to **Workers & Pages**
2. Create custom Workers for:
   - A/B testing
   - URL redirects
   - Custom headers

### 7.3 Enable Email Routing (Free)

To receive emails at your domain:

1. Go to **Email** → **Email Routing**
2. Enable and configure email forwarding

## Step 8: Best Practices

### Development Mode

When testing:

1. Go to **Caching** → **Configuration**
2. Enable **Development Mode** (disables caching for 3 hours)
3. Test your changes
4. Disable when done

### Purge Cache

When you update your site:

1. Go to **Caching** → **Configuration**
2. Click **"Purge Everything"**
3. Or purge specific URLs/files

### Disable Proxy (Orange Cloud) When Setting Up SSL

When first setting up Let's Encrypt certificates:

1. Temporarily disable proxy (click orange cloud to make it gray)
2. Run Certbot on your server
3. Re-enable proxy after certificates are issued

## Step 9: Verify Configuration

### 9.1 Test SSL Configuration

1. Go to https://www.ssllabs.com/ssltest/
2. Enter your domain
3. Verify you get an **A or A+** rating

### 9.2 Test Speed

1. Go to https://pagespeed.web.dev/
2. Test your domain
3. Optimize based on recommendations

### 9.3 Test Security Headers

1. Go to https://securityheaders.com/
2. Enter your domain
3. Verify security headers are correctly set

## Common Issues and Solutions

### Issue: Mixed Content Warnings

**Solution**: Enable **Automatic HTTPS Rewrites** in SSL/TLS settings.

### Issue: Redirect Loop

**Solution**:

1. Check SSL/TLS mode is set to **"Full (strict)"**
2. Verify Nginx is configured correctly
3. Check no conflicting redirects in Nginx

### Issue: API Not Working

**Solution**:

1. Disable Cloudflare proxy for API subdomain temporarily
2. Or create Page Rule to bypass security for API
3. Check CORS settings in Django

### Issue: Slow Website After Cloudflare

**Solution**:

1. Enable **Auto Minify**
2. Enable **Brotli**
3. Configure proper **Page Rules** for caching
4. Purge cache and test again

## Cloudflare API Integration (Advanced)

### Generate API Token

1. Go to **My Profile** → **API Tokens**
2. Click **"Create Token"**
3. Use template: **"Edit zone DNS"**
4. Select your zone
5. Save token securely

### Use API Token in CI/CD

Add to GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID` (found in domain Overview)

## Cost Summary

### Free Plan Includes:

- ✅ Unlimited DDoS protection
- ✅ Global CDN
- ✅ SSL/TLS certificates
- ✅ DNS management
- ✅ Basic security (WAF, bot protection)
- ✅ Page Rules (3 rules)
- ✅ Email routing

### Paid Features:

- Argo Smart Routing: $5/month + usage
- Load Balancing: $5/month
- Advanced DDoS: Starting at $20/month
- More Page Rules: $5/month for 20 rules

## Maintenance

### Regular Tasks

**Weekly**:

- [ ] Review analytics
- [ ] Check for security threats
- [ ] Monitor bandwidth usage

**Monthly**:

- [ ] Review and optimize Page Rules
- [ ] Check SSL certificate expiry
- [ ] Review firewall rules effectiveness

**As Needed**:

- [ ] Purge cache after deployments
- [ ] Update DNS records for new subdomains
- [ ] Adjust security settings based on threats

## Next Steps

1. ✅ Complete DNS configuration
2. ✅ Enable SSL/TLS
3. ✅ Configure caching
4. ✅ Set up security rules
5. ✅ Monitor performance
6. ✅ Optimize based on analytics

Your Cloudflare configuration is complete! 🛡️

## Useful Links

- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Cloudflare Status](https://www.cloudflarestatus.com/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Docs](https://developers.cloudflare.com/)
