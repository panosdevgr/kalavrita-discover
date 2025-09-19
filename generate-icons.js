const fs = require('fs');
const path = require('path');

// SVG content for the icon
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="#2c5530"/>
  
  <!-- Mountain Silhouette -->
  <path d="M100 350 L200 200 L300 350 L100 350 Z" fill="#4a7c59"/>
  <path d="M200 350 L250 250 L350 350 L200 350 Z" fill="#5a8c69"/>
  
  <!-- Snow Cap -->
  <path d="M150 280 L200 200 L220 220 L180 280 Z" fill="#ffffff"/>
  <path d="M220 260 L270 200 L290 220 L250 260 Z" fill="#ffffff"/>
  
  <!-- Train -->
  <rect x="150" y="380" width="120" height="40" rx="6" fill="#d4af37"/>
  <rect x="160" y="390" width="100" height="30" rx="3" fill="#f4d03f"/>
  
  <!-- Train Windows -->
  <rect x="170" y="395" width="15" height="15" rx="2" fill="#87ceeb"/>
  <rect x="195" y="395" width="15" height="15" rx="2" fill="#87ceeb"/>
  <rect x="220" y="395" width="15" height="15" rx="2" fill="#87ceeb"/>
  <rect x="245" y="395" width="15" height="15" rx="2" fill="#87ceeb"/>
  
  <!-- Train Wheels -->
  <circle cx="170" cy="430" r="8" fill="#2c2c2c"/>
  <circle cx="250" cy="430" r="8" fill="#2c2c2c"/>
  
  <!-- Railway Track -->
  <line x1="100" y1="450" x2="400" y2="450" stroke="#8b4513" stroke-width="6"/>
  
  <!-- Ski Symbol -->
  <path d="M320 200 L340 180 L350 200 L330 220 Z" fill="#ffffff" stroke="#ddd" stroke-width="1"/>
  <path d="M330 210 L340 200 L345 210 L335 220 Z" fill="#ff6b6b"/>
  
  <!-- "K" Letter -->
  <text x="256" y="480" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#ffffff" text-anchor="middle">K</text>
</svg>`;

// Icon sizes needed for PWA
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files for each size
iconSizes.forEach(({ size, name }) => {
  const svgWithSize = svgContent.replace('width="512" height="512"', `width="${size}" height="${size}"`);
  const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgWithSize);
  console.log(`Generated ${svgPath}`);
});

// Create a favicon.ico equivalent (SVG)
const faviconSvg = svgContent.replace('width="512" height="512"', 'width="32" height="32"');
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSvg);
console.log('Generated favicon.svg');

// Create apple-touch-icon
const appleTouchIcon = svgContent.replace('width="512" height="512"', 'width="180" height="180"');
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('Generated apple-touch-icon.svg');

console.log('\n✅ All icon files generated successfully!');
console.log('\nNote: For production, you should convert these SVG files to PNG format');
console.log('using tools like ImageMagick, Inkscape, or online converters.');
