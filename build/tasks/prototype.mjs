import njk from 'nunjucks';
import {globby} from 'globby';
import {readFile} from 'node:fs/promises';

import * as vars from '../vars.mjs';
import {getTargetPathString, createAndWriteToFile} from '../utils.mjs';

const {Environment, FileSystemLoader} = njk;

const prototype = () => {
  console.log('=> prototype');
  return globby(`${vars.sourcePath.prototype}/pages/**/*.njk`).then(pages => {
    const njkEnv = new Environment(new FileSystemLoader([
      vars.sourcePath.prototype,
      vars.sourcePath.modules
    ], {}));
    njkEnv.addGlobal('assetsUrlPath', vars.assetsUrlPath);
    pages.forEach(async (page) => {
      const pageContent = await readFile(page, {encoding: 'utf8'});
      const res = njkEnv.renderString(pageContent);
      const targetFile = getTargetPathString(
        page,
        `${vars.sourcePath.prototype}/pages`,
        vars.targetPath.prototype,
        'njk',
        'html'
      );
      await createAndWriteToFile(targetFile, res);
    });
  });
};

export {prototype};
export default prototype;
