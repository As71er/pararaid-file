import fs from "fs/promises";

function displayGenericError(err) {
  if (err.code === "ENOENT") {
    console.error("Couldn't find the specified path.");
  } else {
    console.error("An error has occurred while creating the file:", err);
  }
}

async function readFileContent(handlerOne) {
  const fileCharSize = (await handlerOne.stat()).size;

  const fileBuffer = Buffer.alloc(fileCharSize);
  const offset = 0; // 86
  const fileLength = fileBuffer.byteLength;
  const position = 0; // 86

  await handlerOne.read(fileBuffer, offset, fileLength, position);

  return fileBuffer;
}

async function createFile(path) {
  try {
    const existingFileHandler = await fs.open(path, "r");
    await existingFileHandler?.close();
  } catch (err) {
    if (err.code === "ENOENT") {
      const newFileHandler = await fs.open(path, "w");
      await newFileHandler?.close();
    } else {
      throw err;
    }
  }
}

async function readFile(path) {
  const existingFileHandler = await fs.open(path, "r");
  const fileBuffer = await readFileContent(existingFileHandler);
  await existingFileHandler?.close();

  return fileBuffer.toString("utf-8");
}

async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

async function addToFile(path, newContent) {
  const existingFileHandler = await fs.open(path, "a");
  await existingFileHandler.write(newContent);
  await existingFileHandler?.close();
}

async function deleteFile(path) {
  await fs.unlink(path);
}

export {
  displayGenericError,
  readFileContent,
  createFile,
  readFile,
  renameFile,
  addToFile,
  deleteFile,
};
