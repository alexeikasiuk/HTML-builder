const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const url = path.join(__dirname, 'text.txt');

stdout.write('Hello!\nWrite a story:');

stdin.on('data', (chunk) => {
  const str = chunk.toString().trim();

  if (str === 'exit') {
    process.exit();
  } else if (str.length == 0) return;

  fs.appendFile(url, str + '\n', () => {});
  stdout.write('To exit type "exit" or press ctrl+c\nContinue: ');
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('\nStory saved. Bye!!!'));
