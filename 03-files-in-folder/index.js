const path = require('path');
const fs = require('fs');
const root = path.join(__dirname, 'secret-folder');

function showFileInfo(stats, file) {
  // print info only for files 1st level w/o files in subdirectory
  if (stats.isFile()) {
    file = file.split('.');

    //for example, if file name is "abc.def.js"
    const name = file.slice(0, file.length - 1).join('.');
    const ext = file[file.length - 1];

    console.log(`${name} - ${ext} - ${stats.size}b`);
  }
}

function getFilesInfo(files) {
  files.forEach((file) => {
    const url = path.join(root, file);

    //get info about file size
    fs.stat(url, (err, stats) => {
      if (err) throw err;

      // parse & print to console
      showFileInfo(stats, file);
    });
  });
}

fs.readdir(root, (err, files) => {
  if (err) throw err;
  getFilesInfo(files);
});
