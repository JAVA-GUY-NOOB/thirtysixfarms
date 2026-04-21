# FarmCity Deployment Checklist

## Pre-Deployment Preparation

### 1. Environment Setup
- [ ] Register domain name
- [ ] Set up Supabase account
- [ ] Create PostgreSQL database
- [ ] Register M-Pesa business account
- [ ] Create Stripe account
- [ ] Get Google Maps API key
- [ ] Set up hosting accounts (Vercel/Netlify + Railway/Heroku)

### 2. Backend Configuration
- [ ] Configure `application-prod.properties`
- [ ] Set JWT_SECRET_KEY (32+ characters)
- [ ] Add database credentials
- [ ] Configure M-Pesa credentials
- [ ] Add Stripe API keys
- [ ] Set Google Maps API key
- [ ] Configure CORS origins

### 3. Frontend Configuration
- [ ] Create `.env.production` file
- [ ] Set REACT_APP_API_BASE_URL
- [ ] Add REACT_APP_GOOGLE_MAPS_API_KEY
- [ ] Set REACT_APP_STRIPE_PUBLIC_KEY
- [ ] Update build settings

### 4. Database Setup
- [ ] Run schema creation
- [ ] Create initial admin user
- [ ] Seed products data
- [ ] Configure connection pooling

## Deployment Steps

### Backend Deployment
1. [ ] Build JAR file: `./mvnw clean package -P prod`
2. [ ] Set environment variables on hosting platform
3. [ ] Deploy application
4. [ ] Verify API endpoints
5. [ ] Check database connectivity
6. [ ] Test authentication

### Frontend Deployment
1. [ ] Install dependencies: `npm install`
2. [ ] Build production: `npm run build`
3. [ ] Set environment variables
4. [ ] Deploy to hosting platform
5. [ ] Verify all pages load
6. [ ] Check API connectivity

### Domain Configuration
1. [ ] Configure DNS records
2. [ ] Set up SSL certificate
3. [ ] Configure custom domain on hosting
4. [ ] Test HTTPS access

## Post-Deployment Testing

### Critical Paths
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Cart updates correctly
- [ ] Checkout process works
- [ ] M-Pesa payment works
- [ ] Order confirmation displays
- [ ] Order history shows orders

### Admin Functions
- [ ] Admin login works
- [ ] Dashboard displays stats
- [ ] Orders can be viewed
- [ ] Order status can be updated
- [ ] Users can be viewed
- [ ] Ads can be created
- [ ] Offers can be created

### Security
- [ ] HTTPS enforced
- [ ] API requires authentication
- [ ] Admin routes protected
- [ ] CORS configured
- [ ] No console errors

### Mobile Responsiveness
- [ ] Homepage responsive
- [ ] Product page responsive
- [ ] Cart page responsive
- [ ] Checkout responsive
- [ ] Admin dashboard usable

## Performance Checks

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Database queries optimized

## Monitoring Setup

- [ ] Application monitoring enabled
- [ ] Error tracking configured
- [ ] Analytics installed
- [ ] Uptime monitoring set up
- [ ] Log aggregation configured

## Backup Strategy

- [ ] Database backup scheduled
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Final Verification

- [ ] All features working in production
- [ ] Payments processing correctly
- [ ] Emails sending (if applicable)
- [ ] No critical errors in logs
- [ ] SSL certificate valid
- [ ] Domain redirecting correctly

## Sign-off

**Deployed By**: _______________________  
**Date**: _______________________  
**Version**: _______________________

**Approved By**: _______________________  
**Date**: _______________________

---

## Notes

### Known Issues
- Document any known issues or workarounds here

### Post-Launch Tasks
- [ ] Monitor first week closely
- [ ] Collect user feedback
- [ ] Plan first update
- [ ] Train support staff

### Contact Information
- **Technical Support**: [Email/Phone]
- **Hosting Provider**: [Contact Info]
- **Domain Registrar**: [Contact Info]
