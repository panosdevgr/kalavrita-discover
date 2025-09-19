# 🚀 Deploy Kalavrita Guide PWA to Netlify

## Method 1: Drag & Drop (Easiest)

### Step 1: Prepare Files
1. **Build the project** (already done):
   ```bash
   ./deploy.sh
   ```

2. **Navigate to dist folder**:
   ```bash
   cd dist
   ```

3. **Select all files** in the `dist` folder (Ctrl+A / Cmd+A)

### Step 2: Deploy to Netlify
1. **Go to Netlify**: https://app.netlify.com
2. **Sign up/Login** with GitHub, GitLab, or email
3. **Drag & Drop**: Drag all files from the `dist` folder to the Netlify dashboard
4. **Wait for deployment** (usually 1-2 minutes)
5. **Get your URL**: Netlify will provide a random URL like `https://amazing-name-123456.netlify.app`

### Step 3: Configure Custom Domain (Optional)
1. **Go to Site Settings** → **Domain Management**
2. **Add Custom Domain**: Enter your domain name
3. **Configure DNS**: Follow Netlify's DNS instructions

---

## Method 2: Git Integration (Recommended for Updates)

### Step 1: Create GitHub Repository
1. **Initialize Git**:
   ```bash
   cd /Users/panosangelopoulos/Devel/Kalavrita-Booking/CascadeProjects/pwa
   git init
   git add .
   git commit -m "Initial commit - Kalavrita Guide PWA"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `kalavrita-guide-pwa`
   - Make it public
   - Don't initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kalavrita-guide-pwa.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Netlify
1. **Go to Netlify**: https://app.netlify.com
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize
4. **Select your repository**: `kalavrita-guide-pwa`
5. **Configure build settings**:
   - **Build command**: `./deploy.sh`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

### Step 3: Deploy
1. **Click "Deploy site"**
2. **Wait for deployment** (2-3 minutes)
3. **Get your URL**: Netlify will provide a URL

---

## Method 3: Netlify CLI (Advanced)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Deploy
```bash
cd dist
netlify deploy --prod --dir .
```

---

## 🔧 Post-Deployment Configuration

### 1. Enable HTTPS (Required for PWA)
- Netlify automatically provides HTTPS
- Your PWA will work with all features

### 2. Configure Redirects
Create `_redirects` file in your `dist` folder:
```
/*    /index.html   200
```

### 3. Set Headers for PWA
Create `_headers` file in your `dist` folder:
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/manifest.json
  Content-Type: application/manifest+json

/service-worker.js
  Content-Type: application/javascript
  Cache-Control: no-cache
```

### 4. Environment Variables (if needed)
- Go to **Site Settings** → **Environment Variables**
- Add any required environment variables

---

## 📱 Testing Your PWA

### 1. Test PWA Features
- **Install**: Look for "Add to Home Screen" option
- **Offline**: Disconnect internet and test functionality
- **Service Worker**: Check in DevTools → Application → Service Workers

### 2. Test on Mobile
- **Open on mobile device**
- **Add to home screen**
- **Test offline functionality**

### 3. Performance Testing
- **Lighthouse**: Use Chrome DevTools Lighthouse
- **Mobile Performance**: Test on actual mobile devices

---

## 🔄 Updating Your PWA

### Method 1: Git Integration
1. **Make changes** to your code
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Update PWA"
   git push
   ```
3. **Netlify auto-deploys** (if connected to Git)

### Method 2: Manual Update
1. **Rebuild**:
   ```bash
   ./deploy.sh
   ```
2. **Drag & Drop** new files to Netlify

---

## 🚨 Important Notes

### PWA Requirements
- ✅ **HTTPS**: Netlify provides this automatically
- ✅ **Manifest**: Included in build
- ✅ **Service Worker**: Included in build
- ✅ **Responsive**: Mobile-first design

### Performance
- **CDN**: Netlify provides global CDN
- **Caching**: Automatic caching for static assets
- **Compression**: Automatic gzip compression

### Monitoring
- **Analytics**: Enable Netlify Analytics
- **Forms**: Use Netlify Forms for contact forms
- **Functions**: Use Netlify Functions for serverless functions

---

## 🎯 Quick Start Commands

```bash
# 1. Build for production
./deploy.sh

# 2. Deploy to Netlify (Method 1)
# - Go to https://app.netlify.com
# - Drag & drop dist folder contents

# 3. Deploy to Netlify (Method 3)
cd dist
netlify deploy --prod --dir .

# 4. Update deployment
git add . && git commit -m "Update" && git push
```

---

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **PWA Guide**: https://web.dev/progressive-web-apps
- **Contact**: hello@forcehook.com

---

**🎉 Your Kalavrita Guide PWA will be live on Netlify!**
