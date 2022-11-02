const path = require('path');
const fs = require('fs');
const root = __dirname;
const fromDirFullPath = path.join(root, 'files');
const toDirFullPath = path.join(root, 'files-copy');

function copyDir(src, dest) {
  // PROMISES___HELL

  // // if copy already exist? => remove it and create new empty dir to copy
  // fs.promises
  //   .readdir(to)
  //   .then(() => {
  //     console.log('old copy exist');
  //     fs.promises
  //       .rm(to, { recursive: true })
  //       .then(() => {
  //         console.log('old copy removed');
  //         fs.promises
  //           .mkdir(to)
  //           .then(() => {
  //             console.log('create new dir for copy');
  //             fs.promises
  //               .readdir(from)
  //               .then((files) => {
  //                 files.forEach((file) => {
  //                   const fromFileFullPath = path.join(from, file);
  //                   const toFileFullPath = path.join(to, file);
  //                   fs.promises
  //                     .stat(fromFileFullPath)
  //                     .then((stats) => {
  //                       if (stats.isFile()) {
  //                         // console.log(`${file} - file`);
  //                         fs.promises
  //                           .readFile(fromFileFullPath)
  //                           .then((data) => {
  //                             console.log(toFileFullPath);
  //                             fs.promises
  //                               .writeFile(toFileFullPath, data)
  //                               .then((isWrite) => {
  //                                 if (isWrite == undefined)
  //                                   console.log(`${file} copied`);
  //                               })
  //                               .catch((e) => console.error(e));
  //                           })
  //                           .catch((e) => console.error(e));
  //                       } else if (stats.isDirectory()) {
  //                         // console.log(`${file} - directory`);
  //                         copyDir(fromFileFullPath, toFileFullPath);
  //                       }
  //                     })
  //                     .catch((e) => console.error(e));
  //                 });
  //               })
  //               .catch((e) => console.error(e));
  //           })
  //           .catch((e) => console.error(e));
  //       })
  //       .catch((e) => console.error(e));
  //   })
  //   .catch(() => {
  //     console.log("old copy doesn't exist");
  //     fs.promises
  //       .mkdir(to)
  //       .then(() => {
  //         console.log('create dir for copy');
  //         fs.promises
  //           .readdir(from)
  //           .then((files) => {
  //             files.forEach((file) => {
  //               const fromFileFullPath = path.join(from, file);
  //               const toFileFullPath = path.join(to, file);
  //               fs.promises
  //                 .stat(fromFileFullPath)
  //                 .then((stats) => {
  //                   if (stats.isFile()) {
  //                     // console.log(`${file} - file`);
  //                     fs.promises
  //                       .readFile(fromFileFullPath)
  //                       .then((data) => {
  //                         console.log(toFileFullPath);
  //                         fs.promises
  //                           .writeFile(toFileFullPath, data)
  //                           .then((isWrite) => {
  //                             if (isWrite == undefined)
  //                               console.log(`${file} copied`);
  //                           })
  //                           .catch((e) => console.error(e));
  //                       })
  //                       .catch((e) => console.error(e));
  //                   } else if (stats.isDirectory()) {
  //                     // console.log(`${file} - directory`);
  //                     copyDir(fromFileFullPath, toFileFullPath);
  //                   }
  //                 })
  //                 .catch((e) => console.error(e));
  //             });
  //           })
  //           .catch((e) => console.error(e));
  //       })
  //       .catch((e) => console.error(e));
  //   });
  // prepare to copy: remove old copy-dir, then call copyFiles function;

  // It's promises hell too
  fs.promises
    .readdir(dest)
    .then(() => {
      //dest exists. let's remove it with all children files;
      fs.promises
        .rm(dest, { recursive: true })
        .then(() => {
          // let's create new dest directory and copy files
          copyDirChildren(src, dest);
        })
        .catch((e) => console.error(e));
    })
    .catch(() => {
      // dest doesn't exist.
      // let's create dest directory and copy files
      copyDirChildren(src, dest);
    });
}
function copyDirChildren(src, dest) {
  // create dest dir for copy
  fs.promises
    .mkdir(dest)
    .then(() => {
      // get all names for all files and dirs from src
      fs.promises
        .readdir(src, { withFileTypes: true })
        .then((files) => {
          files.forEach((file) => {
            const fromFileFullPath = path.join(src, file.name);
            const toFileFullPath = path.join(dest, file.name);

            if (file.isFile()) {
              fs.promises
                .readFile(fromFileFullPath)
                .then((data) => {
                  // write to copy-file in dest
                  fs.promises
                    .writeFile(toFileFullPath, data)
                    .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e));
            } else if (file.isDirectory()) {
              // if it's directory => recursive call this func with new src & dest
              copyDirChildren(fromFileFullPath, toFileFullPath);
            }
          });
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.err(e));
}

copyDir(fromDirFullPath, toDirFullPath);
