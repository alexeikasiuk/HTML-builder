const fs = require('fs');
const { pipeline } = require('stream/promises');
const path = require('path');
const {
  rm,
  mkdir,
  readFile,
  readdir,
  writeFile,
  copyFile,
} = require('fs/promises');

const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const dest = path.join(__dirname, 'project-dist');
const htmlBundle = path.join(dest, 'index.html');
const cssBundle = path.join(dest, 'style.css');
const assetsBundle = path.join(dest, 'assets');
let html = '';

// html
const createHtmlBundle = async (src, dest) => {
  // save the template as a string for injection components
  html = await readFile(src, 'utf8');

  //load components
  const files = await readdir(components);

  // inject components into a html-file & load it in build directory
  await Promise.all(
    files.map(async (file) => {
      const componentPath = path.join(components, file);
      const ext = path.extname(file);
      const name = `{{${path.basename(file, ext)}}}`;

      const component = await readFile(componentPath);

      html = html.replace(name, component);
    })
  );

  // write html bundle
  writeFile(htmlBundle, html);
};

// css
const createStylesBundle = async (src, dest) => {
  const files = await readdir(src, { withFileTypes: true });

  // get all style filePaths for merge
  const filePaths = files
    .filter((file) => !file.isDirectory() && path.extname(file.name) === '.css')
    .map((fileName) => path.join(src, fileName.name));

  // write styles bundle
  for (const filePath of filePaths) {
    const readStream = fs.createReadStream(filePath, 'utf8');
    const writeStream = fs.createWriteStream(cssBundle, { flags: 'a' }, 'utf8');

    await pipeline(readStream, writeStream);
  }
};

// assets
const copyFiles = async (src, dest) => {
  const files = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });

  for (const file of files) {
    const from = path.join(src, file.name);
    const to = path.join(dest, file.name);

    if (file.isDirectory()) {
      copyFiles(from, to);
    } else {
      copyFile(from, to);
    }
  }
};

const buildProject = async (dest) => {
  // remove old version if it exists
  try {
    await rm(dest, { recursive: true });
  } catch (e) {
  } finally {
    await mkdir(dest);
  }

  //prepare and load html file
  createHtmlBundle(template, dest);

  // prepare and load styles
  createStylesBundle(styles, dest);

  // copy assets
  copyFiles(assets, assetsBundle);
};

buildProject(dest);
