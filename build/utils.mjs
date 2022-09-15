import {access, mkdir, writeFile} from 'node:fs/promises';
import * as path from 'node:path';

const getTargetPathString = (sourcePath, sourceRoot, targetRoot, srcExt, tgtExt) => {
  const baseName = path.basename(sourcePath, `.${srcExt}`);
  const dirName = path.dirname(sourcePath).replace(sourceRoot, '');
  return path.join(targetRoot, dirName, `${baseName}.${tgtExt}`);
};

const createAndWriteToFile = async (filePath, fileContent) => {
  const tp = path.dirname(filePath);
  try {
    await access(tp);
  } catch {
    await mkdir(tp, {recursive: true});
  }
  await writeFile(filePath, fileContent, {flag: 'w+'});
};

export {
  getTargetPathString,
  createAndWriteToFile
};
