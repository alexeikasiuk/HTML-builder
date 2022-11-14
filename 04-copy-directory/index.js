const path = require('path');
const { readdir, mkdir, copyFile, rm } = require('fs/promises');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

const copyFiles = async (src, dest) => {
  const files = await readdir(src, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await doStuff(filePath, destPath);
    } else {
      await copyFile(filePath, destPath);
    }
  }
};

const clearFolder = async (dir) => {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    await rm(filePath, { recursive: true });
  }
};

const doStuff = async (src, dest) => {
  try {
    await clearFolder(dest);
  } catch {
    await mkdir(dest, { recursive: true });
  } finally {
    await copyFiles(src, dest);
  }
};

doStuff(src, dest);
