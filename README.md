# Kalavrita Guide PWA

A comprehensive Progressive Web Application (PWA) serving as a guide for restaurants, attractions, and activities in Kalavrita, Greece. This mobile-first application provides offline functionality, push notifications, and seamless user experience across all devices.

## 🌟 Features

### Core Functionality
- **Restaurant Guide**: Comprehensive listings of local restaurants with ratings, prices, and features
- **Attractions Directory**: Information about historical sites, natural attractions, and landmarks
- **Activities Planner**: Booking and information for various activities and experiences
- **Offline Support**: Full offline functionality with cached content
- **Mobile-First Design**: Optimized for mobile devices with responsive design

### PWA Features
- **Installable**: Add to home screen on mobile devices
- **Offline Access**: Works without internet connection
- **Push Notifications**: Stay updated with latest information
- **Fast Loading**: Optimized performance with service worker caching
- **App-like Experience**: Native app feel in the browser

### Communication
- **Contact System**: Direct email communication with support team
- **Booking Inquiries**: Integrated booking system for activities
- **Offline Email Queue**: Emails queued when offline, sent when online

## 🚀 Quick Start

### Prerequisites
- Node.js 12+ (for development server)
- Modern web browser with PWA support
- HTTPS (required for PWA features in production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalavrita-guide/pwa.git
   cd pwa
   ```

2. **Install dependencies** (optional, for development server)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   node server.js
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Alternative Setup (Static Server)

If you don't have Node.js, you can use any static file server:

```bash
# Python 3
python3 -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# PHP
php -S localhost:3000
```

## 📱 Mobile Testing

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click the device toggle button
3. Select a mobile device (iPhone, Android, etc.)
4. Refresh the page

### Real Mobile Device
1. Ensure your mobile device is on the same network
2. Find your computer's IP address
3. Open `http://YOUR_IP:3000` on your mobile device

## 🏗️ Project Structure

```
kalavrita-guide-pwa/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── package.json            # Project configuration
├── server.js              # Development server
├── create-icons.js        # Icon generation script
├── styles/
│   ├── main.css           # Main styles
│   ├── components.css     # Component styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js            # Main application logic
│   ├── data.js           # Kalavrita data
│   ├── email-service.js  # Email functionality
│   └── service-worker.js # Service worker
├── icons/                # App icons (various sizes)
├── images/               # Images and assets
└── screenshots/          # PWA screenshots
```

## 🎨 Customization

### Adding New Restaurants
Edit `js/data.js` and add to the `restaurants` array:

```javascript
{
    id: 7,
    name: "New Restaurant",
    type: "Traditional",
    description: "Description here...",
    rating: 4.5,
    priceRange: "€€",
    features: ["Feature1", "Feature2"],
    hours: "12:00 - 22:00",
    phone: "+30 26920 22000",
    address: "Address here",
    coordinates: { lat: 38.0322, lng: 22.1123 },
    image: "🍽️",
    highlights: ["Highlight1", "Highlight2"]
}
```

### Adding New Attractions
Similar to restaurants, add to the `attractions` array in `js/data.js`.

### Styling
- Main styles: `styles/main.css`
- Component styles: `styles/components.css`
- Responsive design: `styles/responsive.css`

## 🔧 Configuration

### Email Service
Configure email settings in `js/email-service.js`:

```javascript
// Update these endpoints for your email service
this.apiEndpoint = '/api/contact';
```

### PWA Settings
Update `manifest.json` for app metadata:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "theme_color": "#2c5530",
  "background_color": "#ffffff"
}
```

## 📦 Production Deployment

### Requirements
- HTTPS certificate (required for PWA features)
- Web server (Apache, Nginx, etc.)
- Domain name

### Deployment Steps

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Upload files to server**
   - Upload all files to your web server
   - Ensure HTTPS is configured
   - Set proper MIME types for `.json` files

3. **Configure server**
   - Set up proper caching headers
   - Enable compression
   - Configure security headers

### Server Configuration

#### Apache (.htaccess)
```apache
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
</IfModule>
```

#### Nginx
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # Enable compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve PWA files
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🧪 Testing

### PWA Testing
1. **Lighthouse**: Use Chrome DevTools Lighthouse to test PWA compliance
2. **Service Worker**: Check Application tab in DevTools
3. **Offline Testing**: Disconnect internet and test functionality
4. **Installation**: Test "Add to Home Screen" on mobile devices

### Browser Support
- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## 📊 Performance

### Optimization Features
- Service Worker caching
- Lazy loading of images
- Minified CSS and JavaScript
- Optimized images
- Efficient data structures

### Performance Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🔒 Security

### Security Features
- HTTPS enforcement
- Content Security Policy
- XSS protection
- Secure headers

### Security Headers
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Email: hello@forcehook.com
- Issues: [GitHub Issues](https://github.com/kalavrita-guide/pwa/issues)
- Documentation: [Wiki](https://github.com/kalavrita-guide/pwa/wiki)

## 🙏 Acknowledgments

- Kalavrita Tourism Board for local information
- Greek National Tourism Organization
- PWA community for best practices
- Open source contributors

---

**Made with ❤️ for Kalavrita, Greece**
