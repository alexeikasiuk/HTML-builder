const fs = require('fs');
const path = require('path');
const componentsPath = path.join(__dirname, 'components');
const htmlTemplate = path.join(__dirname, 'template.html');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');

function buildProject(dest) {
  // check old version
  fs.readdir(dest, (err) => {
    if (err) {
      // old version doesn't exist
      // create directory for build & load project inside
      createFiles(dest);
    } else {
      // remove old version if it exists
      fs.rm(dest, { recursive: true }, (err) => {
        if (err) return console.error(`Remove directory error`);

        // create directory for build & load project inside
        createFiles(dest);
      });
    }
  });
}

function createFiles(dest) {
  fs.mkdir(dest, (err) => {
    if (err) return console.error(err);

    //prepare and load html file
    createHtmlFile(htmlTemplate, dest);

    // prepare and load styles
    createStylesFile(styles, dest);

    // copy assets
    copyAssetsFiles(assets, path.join(dest, 'assets'));
  });
}

// html
function createHtmlFile(filePath, dest) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.error(err);

    // inject components into a html-file & load it in build directory
    loadParsedHtmlFile(data, dest);
  });
}

function loadParsedHtmlFile(html, dest) {
  //get all components
  fs.readdir(componentsPath, (err, componentsNames) => {
    if (err) return console.error(err);

    const components = {};
    componentsNames
      .map((component) => {
        return {
          name: `{{${path.parse(component).name}}}`,
          promise: fs.promises.readFile(
            path.join(componentsPath, component),
            'utf8'
          ),
        };
      })
      .reduce(
        (prev, cur, i) =>
          prev.then(() =>
            cur.promise.then((data) => (components[cur.name] = data))
          ),
        Promise.resolve()
      ) //now all components ig ready
      .then(() => {
        // inject components in html
        for (const component in components) {
          html = html.replace(component, components[component]);
        }
        // write parse html code
        fs.writeFile(path.join(dest, 'index.html'), html, (err, ok) => {
          if (err) console.error(err);
        });
      });
  });
}

// css
function createStylesFile(src, dest) {
  //get all style-file names
  fs.readdir(src, (err, fileNames) => {
    if (err) return console.error(err);

    // temp - load css according html(header, then article, then footer styles)
    // only for this project
    // TODO: create correct css rules or universal load order
    fileNames.sort((a, b) => {
      const nameA = a.split('.')[0],
        nameB = b.split('.')[0];

      if (nameA == 'header' || nameB == 'footer') return -1;
      if (nameA != 'header' || nameB != 'footer') return 1;
      return 0;
    });

    let cssCode = '';
    //read all css files and put data in cssCode
    fileNames
      .map((fileName) => fs.promises.readFile(path.join(src, fileName)))
      .reduce((prev, cur) => {
        return prev.then(() => {
          return cur.then((data) => {
            cssCode += data;
          });
        });
      }, Promise.resolve())
      .then(() => {
        // now all styles is prepared to write
        fs.writeFile(path.join(dest, 'style.css'), cssCode, (err) => {
          if (err) console.error(err);
        });
      });
  });
}

//assets directory
function copyAssetsFiles(src, dest) {
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
                    .catch((e) => console.error(`Write file error`));
                })
                .catch((e) => console.log(`Read file error`));
            } else if (file.isDirectory()) {
              // It's directory => recursive call this func with new src & dest
              copyAssetsFiles(fromFileFullPath, toFileFullPath);
            }
          });
        })
        .catch((e) => console.log(`Read directory error`));
    })
    .catch((e) => console.log(`Create directory error`));
}

buildProject(path.join(__dirname, 'project-dist'));
