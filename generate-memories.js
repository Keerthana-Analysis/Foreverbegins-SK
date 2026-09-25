const fs = require('fs');
const path = require('path');

const memoriesFolder = path.join(__dirname, 'Memories');
const outputFile = path.join(__dirname, 'memories-list.js');

const allowedExtensions = /\.(jpe?g|png|webp|gif)$/i;

const photos = fs.readdirSync(memoriesFolder, { withFileTypes: true })
  .filter(file => file.isFile() && allowedExtensions.test(file.name))
  .map(file => file.name)
  .sort((a, b) =>
    a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  );

const output = `window.memoryPhotos = ${JSON.stringify(photos, null, 2)};\n`;

fs.writeFileSync(outputFile, output, 'utf8');

console.log(`Gallery updated successfully!`);
console.log(`${photos.length} photos found in Memories folder.`);