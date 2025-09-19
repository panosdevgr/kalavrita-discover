const fs = require('fs');
const path = require('path');

// Create a simple PNG icon using base64 data URL
// This is a basic 32x32 PNG with our Kalavrita theme
const createSimplePNG = (size) => {
  // This is a very basic approach - in production you'd use a proper image library
  // For now, we'll create a simple colored square as a fallback
  const canvas = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2c5530" rx="${size/8}"/>
      <text x="${size/2}" y="${size/2 + size/8}" font-family="Arial, sans-serif" font-size="${size/2}" font-weight="bold" fill="#ffffff" text-anchor="middle">K</text>
    </svg>
  `;
  return canvas;
};

// Icon sizes needed
const iconSizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG fallback icons
iconSizes.forEach(size => {
  const svgContent = createSimplePNG(size);
  const filename = `icon-${size}x${size}-fallback.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svgContent);
  console.log(`Generated fallback ${filename}`);
});

console.log('\n✅ Fallback PNG-style icons generated!');
console.log('Note: These are SVG files that look like simple icons.');
console.log('For production PNG files, use tools like ImageMagick or online converters.');
