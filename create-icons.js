// Simple icon generator for Kalavrita Guide PWA
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
function createSVGIcon(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#2c5530"/>
  <path d="M0 ${size * 0.78}L${size * 0.25} ${size * 0.55}L${size * 0.5} ${size * 0.625}L${size * 0.75} ${size * 0.39}L${size} ${size * 0.47}L${size} ${size}L0 ${size}Z" fill="#1a3d1f"/>
  <path d="M${size * 0.1} ${size * 0.68}L${size * 0.9} ${size * 0.68}" stroke="#ffd700" stroke-width="${size * 0.015}" stroke-linecap="round"/>
  <path d="M${size * 0.1} ${size * 0.72}L${size * 0.9} ${size * 0.72}" stroke="#ffd700" stroke-width="${size * 0.015}" stroke-linecap="round"/>
  <rect x="${size * 0.4}" y="${size * 0.625}" width="${size * 0.15}" height="${size * 0.08}" rx="${size * 0.02}" fill="#ffffff"/>
  <rect x="${size * 0.42}" y="${size * 0.645}" width="${size * 0.11}" height="${size * 0.04}" rx="${size * 0.01}" fill="#2c5530"/>
  <circle cx="${size * 0.44}" cy="${size * 0.72}" r="${size * 0.015}" fill="#333"/>
  <circle cx="${size * 0.56}" cy="${size * 0.72}" r="${size * 0.015}" fill="#333"/>
  <circle cx="${size * 0.78}" cy="${size * 0.23}" r="${size * 0.06}" fill="#ffd700"/>
</svg>`;
}

// Create a simple PNG placeholder (base64 encoded 1x1 pixel)
function createPNGPlaceholder() {
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
}

// Generate all required icon sizes
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating icon files...');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG and PNG files for each size
sizes.forEach(size => {
    // Create SVG file
    const svgContent = createSVGIcon(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    
    // Create PNG placeholder (in real implementation, you'd convert SVG to PNG)
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(pngPath, createPNGPlaceholder());
    
    console.log(`Created icon-${size}x${size}.png and .svg`);
});

// Create additional icon variants
const additionalIcons = [
    { name: 'restaurant-96x96', size: 96 },
    { name: 'attraction-96x96', size: 96 },
    { name: 'contact-96x96', size: 96 }
];

additionalIcons.forEach(icon => {
    const svgContent = createSVGIcon(icon.size);
    const svgPath = path.join(iconsDir, `${icon.name}.svg`);
    const pngPath = path.join(iconsDir, `${icon.name}.png`);
    
    fs.writeFileSync(svgPath, svgContent);
    fs.writeFileSync(pngPath, createPNGPlaceholder());
    
    console.log(`Created ${icon.name}.png and .svg`);
});

console.log('Icon generation complete!');
console.log('Note: PNG files are placeholders. In production, convert SVG files to proper PNG format.');
