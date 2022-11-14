const fs = require('fs');
const path = require('path');
const rl = require('readline');

const filePath = path.join(__dirname, 'text.txt');

// I decided that script doesn't clear old data in file
const writeStream = fs.createWriteStream(filePath, { flags: 'a' }, 'utf8');

const readLine = rl.createInterface({
  input: process.stdin,
  stdout: process.stdout,
});

readLine.on('line', (data) => {
  // type 'exit' to cancel write mode
  if (data.trim() === 'exit') process.exit();

  writeStream.write(data + '\n');
});

process.on('exit', () => console.log('\nStory saved. Bye!!!'));

// catch ctr+c
process.on('SIGINT', () => process.exit());

// start write mode
process.stdout.write(
  `Hello!
To exit type "exit" or press ctrl+c
Write a story:
`
);
