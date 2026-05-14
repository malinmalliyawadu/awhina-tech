const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('/Users/malin/Projects/awhina-tech/public/logo.svg');

async function render(out, height) {
  await sharp(svg, { density: 600 })
    .resize({ height, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(out);
  const stat = fs.statSync(out);
  console.log(`${out}  height=${height}px  ${(stat.size / 1024).toFixed(1)}kb`);
}

(async () => {
  await render('/Users/malin/Projects/awhina-tech/public/logo.png', 360);       // 2x of 180
  await render('/Users/malin/Projects/awhina-tech/public/logo@2x.png', 720);    // higher-res for print
})();
