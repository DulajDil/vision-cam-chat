# Production Deployment Guide

## Pre-Deployment Checklist

### Backend

- [ ] Environment variables configured
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] Production build created (`npm run build`)
- [ ] CORS origins configured for production domain
- [ ] Error logging configured
- [ ] Rate limiting implemented (if needed)
- [ ] Health check endpoint accessible

### Frontend

- [ ] TypeScript compilation successful
- [ ] Production build created
- [ ] API_BASE_URL updated to production backend URL
- [ ] Static files optimized
- [ ] HTTPS enabled
- [ ] Browser compatibility tested

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=3000

# AWS Bedrock (if using)
AWS_REGION=ap-southeast-2
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

### Frontend

Update `frontend/src/utils/constants.ts`:
```typescript
export const API_BASE_URL: string = 'https://your-backend-domain.com';
```

## Deployment Options

### Option 1: AWS Deployment

#### Backend (EC2)
1. Launch EC2 instance with Node.js
2. Clone repository
3. Install dependencies
4. Configure environment variables
5. Run with PM2: `pm2 start dist/server.js`

#### Frontend (S3 + CloudFront)
1. Build frontend: `npm run build`
2. Upload `index.html`, `styles.css`, and `dist/` to S3
3. Configure CloudFront distribution
4. Enable HTTPS with ACM certificate

### Option 2: Heroku Deployment

#### Backend
```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
```

#### Frontend
Deploy to Netlify or Vercel (drag-and-drop deployment)

### Option 3: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Monitoring

### Health Checks

Configure health check monitoring:
- Endpoint: `GET /health`
- Expected response: `{"ok":true}`
- Check interval: 30 seconds

### Logging

Implement structured logging:
- Request/response logging
- Error tracking
- Performance metrics

### Recommended Tools

- Datadog
- New Relic
- CloudWatch (for AWS)
- Sentry (error tracking)

## Security Recommendations

1. Enable HTTPS for all traffic
2. Implement rate limiting
3. Add request validation
4. Configure CORS for specific origins
5. Enable security headers (helmet.js)
6. Regular dependency updates
7. API key rotation policy

## Performance Optimization

1. Enable gzip compression
2. Implement caching headers
3. CDN for static assets
4. Database connection pooling (if applicable)
5. Monitor memory usage
6. Load balancing for scale

## Backup and Recovery

1. Regular database backups (if applicable)
2. Configuration backups
3. Disaster recovery plan
4. Rollback procedure documented

## Support and Maintenance

- Monitor error rates
- Review logs regularly
- Performance baseline established
- Incident response plan
- Update dependencies monthly

