const fs = require('fs');
const { stdin, stdout, exit } = process;
const path = require('path');
const url = path.join(__dirname, 'text.txt');

// remove old version
fs.writeFile(url, '', (err) => {
  if (err) throw err;

  // we are ready, start write mode
  createWriteTerminal();
});

function createWriteTerminal() {
  stdout.write('Hello!\nTo exit type "exit" or press ctrl+c\nWrite a story: ');

  stdin.on('data', (data) => {
    const str = data.toString().trim();

    if (str === 'exit') {
      exit();
    } else if (str.length == 0) {
      //don't call fs.appendFile for input data
      return;
    }

    //after "enter" write fragment to file
    fs.appendFile(url, str + '\n', (err) => {
      if (err) throw err;
    });
  });

  process.on('exit', () => console.log('\nStory saved. Bye!!!'));

  // catch ctr+c
  process.on('SIGINT', () => process.exit());
}
