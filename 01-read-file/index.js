const fs = require('fs');
const path = require('path');
const url = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(url, 'utf8');

readStream.on('data', (text) => console.log(text));
