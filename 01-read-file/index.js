const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');
const data = [];

readStream.on('data', (chunk) => {
  data.push(chunk);
});

readStream.on('end', () => console.log(data.join('')));

readStream.on('error', (err) => console.error(err.message));
