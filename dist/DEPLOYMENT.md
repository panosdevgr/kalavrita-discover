# Kalavrita Guide PWA - Deployment Instructions

## Quick Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

## Quick Deploy to Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod --dir .`
3. Follow the prompts

## Manual Deployment

### Apache Server
1. Upload all files to your web server
2. Ensure `.htaccess` is uploaded
3. Configure SSL certificate
4. Test the application

### Nginx Server
1. Copy files to `/var/www/kalavrita-guide`
2. Copy `nginx.conf` to your nginx sites directory
3. Update server_name in nginx.conf
4. Configure SSL certificate
5. Restart nginx

### Node.js Server
1. Run `npm install` in the build directory
2. Run `npm start`
3. Configure reverse proxy if needed

## Important Notes
- HTTPS is REQUIRED for PWA features
- Service Worker only works on HTTPS or localhost
- Test all features after deployment
- Monitor performance and user feedback
