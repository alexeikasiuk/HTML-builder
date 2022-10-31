const fs = require('fs');
const path = require('path');
const url = path.resolve(__dirname, 'text.txt');

console.log("Let's try to read text file!\n");

const readStream = fs.createReadStream(url);

readStream.on('data', (chunk) => console.log(chunk.toString()));
readStream.on('error', () => console.log("Error!!! File doesn't exist!!!"));
readStream.on('end', () => console.log('\nFinished reading!'));
