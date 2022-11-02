const fs = require('fs');
const path = require('path');
const prodStylesFile = path.join(__dirname, 'project-dist', 'bundle.css');
const devStylesDir = path.join(__dirname, 'styles');

// Let's try to read dev styles directory
fs.promises
  .readdir(devStylesDir, { withFileTypes: true })
  .then((files) => {
    // Only for '*.css' files let's try to read file & return promise
    let styles = '';
    files
      .map((file, i) => {
        if (!file.isFile() || path.parse(file.name).ext !== '.css') return;

        // let's read files
        return fs.promises.readFile(path.join(devStylesDir, file.name), 'utf8');
      })
      .filter((item) => item instanceof Promise)
      .reduce(
        (previousPromise, currentPromise) =>
          previousPromise.then(() =>
            currentPromise.then((data) => (styles += data))
          ),
        Promise.resolve()
      )
      .then(() => {
        // we have to write bundle only after all readFile promises completed
        // Let's write bundle
        fs.promises
          .writeFile(prodStylesFile, styles)
          .catch((e) => console.error(e));
      });
  })
  .catch((e) => console.error(e));
