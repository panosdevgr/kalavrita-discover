#!/bin/bash

# Kalavrita Guide PWA - Netlify Deployment Script
echo "🚀 Preparing Kalavrita Guide PWA for Netlify deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "manifest.json" ]; then
    echo "❌ Please run this script from the PWA root directory"
    exit 1
fi

# Create Netlify build directory
NETLIFY_DIR="netlify-build"
print_status "Creating Netlify build directory: $NETLIFY_DIR"
rm -rf $NETLIFY_DIR
mkdir -p $NETLIFY_DIR

# Copy all necessary files for Netlify
print_status "Copying files for Netlify deployment..."
cp -r styles $NETLIFY_DIR/
cp -r js $NETLIFY_DIR/
cp -r icons $NETLIFY_DIR/
cp -r images $NETLIFY_DIR/
cp index.html $NETLIFY_DIR/
cp manifest.json $NETLIFY_DIR/
cp netlify.toml $NETLIFY_DIR/

# Create Netlify-specific files
print_status "Creating Netlify configuration files..."

# Create _redirects file
cat > $NETLIFY_DIR/_redirects << 'EOF'
/*    /index.html   200
EOF

# Create _headers file
cat > $NETLIFY_DIR/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/manifest.json
  Content-Type: application/manifest+json

/js/service-worker.js
  Content-Type: application/javascript
  Cache-Control: no-cache

/*.css
  Cache-Control: public, max-age=31536000

/*.js
  Cache-Control: public, max-age=31536000

/*.png
  Cache-Control: public, max-age=31536000

/*.jpg
  Cache-Control: public, max-age=31536000

/*.svg
  Cache-Control: public, max-age=31536000
EOF

# Create README for Netlify deployment
cat > $NETLIFY_DIR/README.md << 'EOF'
# Kalavrita Guide PWA - Netlify Deployment

## Quick Deploy to Netlify

### Method 1: Drag & Drop
1. Go to https://app.netlify.com
2. Drag this entire folder to the Netlify dashboard
3. Wait for deployment (1-2 minutes)
4. Get your live URL!

### Method 2: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

## Features Included
- ✅ PWA manifest
- ✅ Service worker for offline functionality
- ✅ Responsive design
- ✅ HTTPS ready
- ✅ Optimized for mobile

## Contact
- Email: hello@forcehook.com
- Support: Available 24/7
EOF

# Final checks
print_status "Running final checks..."

# Check if all required files exist
REQUIRED_FILES=("index.html" "manifest.json" "js/app.js" "js/data.js" "js/service-worker.js" "styles/main.css" "_redirects" "_headers")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$NETLIFY_DIR/$file" ]; then
        print_status "✓ $file"
    else
        echo "❌ $file missing"
    fi
done

# Check build size
BUILD_SIZE=$(du -sh $NETLIFY_DIR | cut -f1)
print_status "Netlify build size: $BUILD_SIZE"

print_status "🎉 Netlify build completed successfully!"
print_status "📁 Ready for deployment: $NETLIFY_DIR"
print_warning "Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Drag the '$NETLIFY_DIR' folder to Netlify"
echo "3. Wait for deployment"
echo "4. Get your live URL!"
echo ""
echo "📖 See NETLIFY_DEPLOYMENT.md for detailed instructions"
