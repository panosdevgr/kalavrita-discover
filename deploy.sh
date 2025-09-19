#!/bin/bash

# Kalavrita Guide PWA Deployment Script
echo "🚀 Starting Kalavrita Guide PWA deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "manifest.json" ]; then
    print_error "Please run this script from the PWA root directory"
    exit 1
fi

# Create production build directory
BUILD_DIR="dist"
print_status "Creating production build directory: $BUILD_DIR"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy all necessary files
print_status "Copying files to build directory..."
cp -r styles $BUILD_DIR/
cp -r js $BUILD_DIR/
cp -r icons $BUILD_DIR/
cp -r images $BUILD_DIR/
cp index.html $BUILD_DIR/
cp manifest.json $BUILD_DIR/
cp package.json $BUILD_DIR/

# Create production server file
print_status "Creating production server configuration..."
cat > $BUILD_DIR/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Kalavrita Guide PWA running on port ${PORT}`);
});
EOF

# Create production package.json
print_status "Creating production package.json..."
cat > $BUILD_DIR/package.json << 'EOF'
{
  "name": "kalavrita-guide-pwa",
  "version": "1.0.0",
  "description": "Progressive Web App guide for Kalavrita, Greece",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=12.0.0"
  }
}
EOF

# Create .htaccess for Apache servers
print_status "Creating Apache configuration..."
cat > $BUILD_DIR/.htaccess << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/json "access plus 1 day"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# PWA specific
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
EOF

# Create nginx configuration
print_status "Creating Nginx configuration..."
cat > $BUILD_DIR/nginx.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/kalavrita-guide;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Enable compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache manifest and service worker
    location ~* \.(json)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
EOF

# Create deployment instructions
print_status "Creating deployment instructions..."
cat > $BUILD_DIR/DEPLOYMENT.md << 'EOF'
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
EOF

# Create Docker configuration
print_status "Creating Docker configuration..."
cat > $BUILD_DIR/Dockerfile << 'EOF'
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
EOF

cat > $BUILD_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  kalavrita-guide:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
EOF

# Create .gitignore
print_status "Creating .gitignore..."
cat > $BUILD_DIR/.gitignore << 'EOF'
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store
Thumbs.db
EOF

# Final checks
print_status "Running final checks..."

# Check if all required files exist
REQUIRED_FILES=("index.html" "manifest.json" "js/app.js" "js/data.js" "js/service-worker.js" "styles/main.css")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$BUILD_DIR/$file" ]; then
        print_status "✓ $file"
    else
        print_error "✗ $file missing"
    fi
done

# Check build size
BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
print_status "Build size: $BUILD_SIZE"

# Create deployment summary
print_status "Creating deployment summary..."
cat > $BUILD_DIR/DEPLOYMENT_SUMMARY.md << EOF
# Deployment Summary

**Build Date:** $(date)
**Build Size:** $BUILD_SIZE
**Files:** $(find $BUILD_DIR -type f | wc -l)

## Included Files
- PWA manifest and service worker
- Responsive CSS and JavaScript
- App icons (multiple sizes)
- Production server configuration
- Apache and Nginx configurations
- Docker configuration
- Deployment instructions

## Next Steps
1. Choose your deployment method
2. Configure HTTPS (required for PWA)
3. Test all functionality
4. Monitor performance

## Support
- Email: hello@forcehook.com
- Issues: GitHub Issues
EOF

print_status "🎉 Build completed successfully!"
print_status "📁 Build directory: $BUILD_DIR"
print_warning "Remember to configure HTTPS for PWA features to work!"
print_warning "Test the application thoroughly before going live!"

echo ""
echo "📋 Quick deployment options:"
echo "1. Upload $BUILD_DIR contents to your web server"
echo "2. Run 'cd $BUILD_DIR && npm install && npm start' for Node.js"
echo "3. Use Docker: 'cd $BUILD_DIR && docker-compose up'"
echo ""
echo "📖 See $BUILD_DIR/DEPLOYMENT.md for detailed instructions"
