const fs = require('fs');
const path = require('path');
const prodStylesFile = path.join(__dirname, 'project-dist', 'bundle.css');
const devStylesDir = path.join(__dirname, 'styles');

fs.readdir(devStylesDir, { withFileTypes: true }, (err, files) => {
  if (err) return console.error(err);

  let styles = '';

  // read files
  files
    .map((file, i) => {
      // try to read only files .css
      if (!file.isFile() || path.parse(file.name).ext !== '.css') return;

      // let's read files
      return fs.promises.readFile(path.join(devStylesDir, file.name), 'utf8');
    })
    .filter((item) => {
      // save only promises
      return item instanceof Promise;
    })
    .reduce((prev, cur) => {
      return prev.then(() => {
        // write data each promise step by step
        return cur.then((data) => (styles += data));
      });
    }, Promise.resolve())
    .then(() => {
      // we have to write bundle only after all readFile promises completed
      // Let's write bundle
      fs.writeFile(prodStylesFile, styles, (err, ok) => {
        if (err) console.error('bundle write error');
      });
    });
});
