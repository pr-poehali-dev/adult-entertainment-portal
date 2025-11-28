// Node.js script to create splash screen placeholders
// Run with: node public/create-splash-pngs.js

const fs = require('fs');
const path = require('path');

const devices = [
  { width: 1290, height: 2796, name: 'splash-iphone-14-pro-max.png' },
  { width: 1179, height: 2556, name: 'splash-iphone-14-pro.png' },
  { width: 1284, height: 2778, name: 'splash-iphone-13-pro-max.png' },
  { width: 1170, height: 2532, name: 'splash-iphone-13-pro.png' },
  { width: 1242, height: 2688, name: 'splash-iphone-11-pro-max.png' },
  { width: 1125, height: 2436, name: 'splash-iphone-x.png' },
  { width: 828, height: 1792, name: 'splash-iphone-xr.png' },
  { width: 1242, height: 2208, name: 'splash-iphone-8-plus.png' },
  { width: 750, height: 1334, name: 'splash-iphone-8.png' },
  { width: 640, height: 1136, name: 'splash-iphone-se.png' },
  { width: 2048, height: 2732, name: 'splash-ipad-pro-12.9.png' },
  { width: 1668, height: 2388, name: 'splash-ipad-pro-11.png' },
  { width: 1640, height: 2360, name: 'splash-ipad-air.png' },
  { width: 1620, height: 2160, name: 'splash-ipad-10.2.png' },
  { width: 1536, height: 2048, name: 'splash-ipad-mini.png' }
];

console.log('Splash screen files needed:');
devices.forEach(device => {
  console.log(`- ${device.name} (${device.width}x${device.height})`);
});

console.log('\nTo generate these files:');
console.log('1. Open public/generate-splash.html in your browser');
console.log('2. Click "Download All Splash Screens" button');
console.log('3. Move downloaded files to public/ directory');
