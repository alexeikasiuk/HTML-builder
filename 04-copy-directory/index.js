const path = require('path');
const fs = require('fs');
const root = __dirname;
const fromDir = path.join(root, 'files');
const toDir = path.join(root, 'files-copy');

function deepDirCopy(src, dest) {
  // prepare to copy: remove old copy-dir, then call copyFiles function;
  fs.rm(dest, { recursive: true }, () => {
    // let's copy files
    copyDirChildren(src, dest);
  });
}
function copyDirChildren(src, dest) {
  // create dest dir for copy
  fs.mkdir(dest, (err) => {
    if (err) return console.error(err);

    readFromDir(src, dest);
  });
}

function readFromDir(src, dest) {
  // get all names for all files and dirs from src
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
      const fromFile = path.join(src, file.name);
      const toFile = path.join(dest, file.name);

      if (file.isFile()) {
        copyFile(fromFile, toFile);
      } else if (file.isDirectory()) {
        // if it's directory => recursive call this func with new src & dest
        copyDirChildren(fromFile, toFile);
      }
    });
  });
}

function copyFile(from, to) {
  fs.readFile(from, (err, data) => {
    if (err) return console.error(err);

    // write to copy-file in dest
    fs.writeFile(to, data, (err) => {
      if (err) console.error(err);
    });
  });
}

deepDirCopy(fromDir, toDir);
