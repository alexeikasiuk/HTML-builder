const path = require('path');
const fs = require('fs');

// show files only from secret-folder
const root = path.join(__dirname, 'secret-folder');

function getFileInfo(file, stats) {
  file = file.split('.');
  //for example, if file name is "abc.def.js"
  const name = file.slice(0, file.length - 1).join('.');
  const ext = file[file.length - 1];

  return `${name} - ${ext} - ${stats.size}b`;
}

// by Promise
fs.promises
  .readdir(root)
  .then((files) => {
    files.forEach((file) => {
      const url = path.join(root, file);

      fs.promises
        .stat(url)
        .then((stats) => {
          if (stats.isFile()) {
            console.log(getFileInfo(file, stats));
          }
        })
        .catch((e) => console.error(e));
    });
  })
  .catch((e) => console.error(e));

// by Callback
// fs.readdir(root, (err, files) => {
//   if (err) return console.error(err);

//   files.forEach((file) => {
//     const url = path.join(root, file);

//     fs.stat(url, (err, stats) => {
//       if (err) return console.error(err);

//       if (stats.isFile()) {
//         const fileInfo = getFileInfo(file, stats);

//         console.log(fileInfo);
//       }
//     });
//   });
// });

// ----------------------------------------------------
//show all files (include in children folders) by Promise
// function showFiles(dir) {
//   fs.promises
//     .readdir(dir)
//     .then((files) => {
//       files.forEach((file) => {
//       const url = path.join(dir, file);
//
//         fs.promises
//           .stat(url)
//           .then((stats) => {
//             if (stats.isFile()) {
//               console.log(getFileInfo(file, stats));
//             } else if (stats.isDirectory()) {
//               const newDir = path.join(dir, file);
//
//               showFiles(newDir);
//             }
//           })
//           .catch((e) => console.error(e));
//       });
//     })
//     .catch((e) => console.error(e));
// }

//show all files (include in children folders) by Callback
// function showFiles(dir) {
//   fs.readdir(dir, (err, files) => {
//     if (err) return console.error(err);

//     files.forEach((file) => {
//       const url = path.join(dir, file);

//       fs.stat(url, (err, stats) => {
//         if (err) return console.error(err);

//         if (stats.isFile()) {
//           const fileInfo = getFileInfo(file, stats);

//           console.log(fileInfo);
//         } else if (stats.isDirectory()) {
//           const newDir = path.join(dir, file);

//           showFiles(newDir);
//         }
//       });
//     });
//   });
// }

// showFiles(__dirname);
