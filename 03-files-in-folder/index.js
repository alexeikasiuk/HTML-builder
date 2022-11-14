const path = require('path');
const { readdir, stat } = require('fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');
const BYTES_IN_KB = 1024;

const getFilesInfo = async (dirPath) => {
  const files = await readdir(dirPath, { withFileTypes: true });

  const tableData = await Promise.all(
    files.map(async (file) => {
      if (file.isDirectory()) return null;

      const filePath = path.join(dirPath, file.name);
      const fileExtension = path.extname(file.name);

      const fileStats = await stat(filePath);

      const name = path.basename(filePath, fileExtension);
      const extension = fileExtension.slice(1);
      const sizeKb = `${Math.round(fileStats.size / BYTES_IN_KB)} kb`;

      return {
        name,
        extension,
        size: sizeKb,
      };
    })
  );

  const existingValues = tableData.filter(Boolean);

  console.table(existingValues);
};

getFilesInfo(dirPath);
