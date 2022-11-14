const fs = require('fs');
const { readdir, rm } = require('fs/promises');
const { pipeline } = require('stream/promises');
const path = require('path');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const src = path.join(__dirname, 'styles');

const mergeFiles = async (filePathArray) => {
  for (const filePath of filePathArray) {
    const readStream = fs.createReadStream(filePath, 'utf8');
    const writeStream = fs.createWriteStream(bundle, { flags: 'a' }, 'utf8');

    await pipeline(readStream, writeStream);
  }
};
const createBundle = async () => {
  const files = await readdir(src, { withFileTypes: true });

  const filePaths = files
    .filter((file) => !file.isDirectory() && path.extname(file.name) === '.css')
    .map((fileName) => path.join(src, fileName.name));

  try {
    // temp: delete old version bundle
    await rm(bundle);
  } catch (e) {
    // file doesn't exist
  } finally {
    mergeFiles(filePaths);
  }
};

createBundle();
