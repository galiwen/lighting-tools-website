# Deployment Guide - Luminaire GWP & Cost Assessment Tool

## Overview
This guide covers deployment options for the HTML implementation, from simple hosting to enterprise deployment with monitoring.

---

## Quick Start - Simple Deployment

### Option 1: GitHub Pages (Free, Recommended for Testing)
```bash
# In your repository settings:
1. Go to Settings > Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save and wait 2-5 minutes
5. Access at: https://[username].github.io/lighting-tools-website/
```

### Option 2: Netlify Drop (Free, Instant)
1. Visit https://app.netlify.com/drop
2. Drag and drop the project folder
3. Get instant URL
4. Optional: Connect GitHub for auto-deploy

### Option 3: Vercel (Free tier available)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, get instant URL
```

---

## Production Deployment

### Recommended: Vercel with Custom Domain

#### Step 1: Prepare for Production
```bash
# 1. Create production build (optional optimization)
cp index.html index.prod.html

# 2. Minify if desired (see performance-audit.md)
# Can use online tools or build process

# 3. Create vercel.json for configuration
```

#### Step 2: Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
      },
      "dest": "/index.html"
    }
  ]
}
```

#### Step 3: Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Set custom domain
vercel domains add luminaire-tool.yourdomain.com
```

### Alternative: AWS S3 + CloudFront

#### Step 1: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://luminaire-tool-website

# Enable static hosting
aws s3 website s3://luminaire-tool-website \
  --index-document index.html
```

#### Step 2: Upload Files
```bash
# Sync files
aws s3 sync . s3://luminaire-tool-website \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude "*.md"
```

#### Step 3: CloudFront Distribution
- Create distribution pointing to S3
- Enable compression
- Set cache behaviors
- Configure custom domain

---

## Professional Deployment Setup

### 1. Domain Configuration
```
Primary: luminaire-calculator.com (or your choice)
Alternatives: 
- www.luminaire-calculator.com
- tool.yourcompany.com
```

### 2. SSL/HTTPS
- **Vercel/Netlify**: Automatic SSL included
- **Custom**: Use Let's Encrypt or paid certificate
- **Requirement**: Always force HTTPS

### 3. Headers & Security
```nginx
# Security headers (nginx example)
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 4. Performance Optimization
```nginx
# Enable gzip compression
gzip on;
gzip_types text/html text/css application/javascript;
gzip_min_length 1000;

# Browser caching
location ~* \.(html)$ {
  expires 1h;
  add_header Cache-Control "public";
}

location ~* \.(css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## Monitoring & Analytics

### 1. Google Analytics 4
```html
<!-- Add to <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Performance Monitoring
```javascript
// Basic performance tracking
window.addEventListener('load', function() {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  
  // Send to analytics
  gtag('event', 'page_load_time', {
    value: pageLoadTime,
    metric_name: 'load_time_ms'
  });
});
```

### 3. Error Tracking (Sentry)
```html
<script
  src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"
  crossorigin="anonymous"
></script>
<script>
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: "production"
  });
</script>
```

### 4. Uptime Monitoring
- **Service**: UptimeRobot, Pingdom, or StatusCake
- **Check**: Every 5 minutes
- **Alert**: Email/SMS on downtime

---

## Deployment Checklist

### Pre-Deployment
- [ ] Test all features locally
- [ ] Run performance audit
- [ ] Validate calculations
- [ ] Check mobile responsiveness
- [ ] Review browser console for errors
- [ ] Update version number in code

### Deployment
- [ ] Choose deployment platform
- [ ] Configure custom domain
- [ ] Enable HTTPS/SSL
- [ ] Set security headers
- [ ] Configure caching
- [ ] Test deployed version

### Post-Deployment
- [ ] Verify all features work
- [ ] Check SSL certificate
- [ ] Test on multiple devices
- [ ] Set up monitoring
- [ ] Configure analytics
- [ ] Document deployment details

---

## Environment-Specific Configurations

### Development
```javascript
const config = {
  environment: 'development',
  apiUrl: 'http://localhost:3000/api',
  debug: true,
  analytics: false
};
```

### Staging
```javascript
const config = {
  environment: 'staging',
  apiUrl: 'https://staging-api.luminaire-tool.com',
  debug: false,
  analytics: true
};
```

### Production
```javascript
const config = {
  environment: 'production',
  apiUrl: 'https://api.luminaire-tool.com',
  debug: false,
  analytics: true
};
```

---

## Backup & Recovery

### Backup Strategy
1. **Code**: Git repository (GitHub/GitLab/Bitbucket)
2. **Data**: User exports (JSON) if implementing storage
3. **Configuration**: Document all deployment settings

### Recovery Procedure
1. Clone repository
2. Apply production configurations
3. Deploy to platform
4. Update DNS if needed
5. Verify functionality

---

## Maintenance Procedures

### Regular Tasks
- **Weekly**: Check monitoring alerts
- **Monthly**: Review analytics data
- **Quarterly**: Update dependencies (Chart.js)
- **Annually**: SSL certificate renewal (if manual)

### Update Process
1. Test changes locally
2. Deploy to staging (if available)
3. Test on staging
4. Deploy to production during low-traffic period
5. Monitor for issues

---

## Troubleshooting

### Common Issues

#### Site Not Loading
- Check DNS propagation
- Verify SSL certificate
- Check deployment logs
- Test with different browser

#### Slow Performance
- Check CDN configuration
- Verify compression enabled
- Review hosting metrics
- Test from different locations

#### Feature Not Working
- Check browser console
- Verify JavaScript enabled
- Test in incognito mode
- Check for ad blockers

---

## Cost Estimates

### Free Options
- GitHub Pages: Free for public repos
- Netlify: 100GB bandwidth/month free
- Vercel: 100GB bandwidth/month free

### Paid Options
- Netlify Pro: $19/month per member
- Vercel Pro: $20/month per member
- AWS: ~$5-50/month depending on traffic
- Custom VPS: $5-20/month

### Enterprise
- Dedicated hosting: $100-500/month
- CDN services: $50-200/month
- Premium monitoring: $50-100/month

---

## Support Contacts

### Deployment Platforms
- Vercel: support@vercel.com
- Netlify: support@netlify.com
- AWS: AWS Support Console

### Domain/DNS
- Your domain registrar support
- Cloudflare: support.cloudflare.com

### Monitoring
- Google Analytics: analytics.google.com/analytics/academy/
- Sentry: sentry.io/support/

---

## Conclusion

The HTML implementation can be deployed anywhere that serves static files. The single-file architecture makes deployment extremely simple while maintaining professional features and performance. Choose the deployment option that best matches your needs and budget.