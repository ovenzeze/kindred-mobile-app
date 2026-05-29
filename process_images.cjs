const Jimp = require('jimp');

async function main() {
  const srcPath = 'ChatGPT Image May 18 2026.png';
  const image = await Jimp.read(srcPath);

  // app-touch-icon.png (180x180)
  const appleTouch = image.clone().resize(180, 180);
  await appleTouch.writeAsync('public/apple-touch-icon.png');

  // pwa-192x192.png (192x192)
  const pwa192 = image.clone().resize(192, 192);
  await pwa192.writeAsync('public/pwa-192x192.png');

  // pwa-512x512.png (512x512)
  const pwa512 = image.clone().resize(512, 512);
  await pwa512.writeAsync('public/pwa-512x512.png');

  // Find the background color at (0, 0)
  const bgPixel = image.getPixelColor(0, 0);
  
  // Create a transparent version
  const transparentImg = image.clone();
  
  transparentImg.scan(0, 0, transparentImg.bitmap.width, transparentImg.bitmap.height, function (x, y, idx) {
    const color = this.getPixelColor(x, y);
    // Simple tolerance for background color removal
    const r1 = Jimp.intToRGBA(color).r;
    const g1 = Jimp.intToRGBA(color).g;
    const b1 = Jimp.intToRGBA(color).b;
    const r2 = Jimp.intToRGBA(bgPixel).r;
    const g2 = Jimp.intToRGBA(bgPixel).g;
    const b2 = Jimp.intToRGBA(bgPixel).b;
    
    // If it's close to the background color, make it transparent
    const dist = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    if (dist < 30) {
       this.bitmap.data[idx + 3] = 0; // alpha
    }
  });
  
  await transparentImg.writeAsync('public/icon-transparent.png');
  console.log('Images generated successfully.');
}

main().catch(console.error);
