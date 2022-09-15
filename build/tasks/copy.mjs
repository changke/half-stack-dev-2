import cpy from 'cpy';

import * as vars from '../vars.mjs';

const copyRoot = () => {
  return cpy([`${vars.sourceRoot}/*`, `!${vars.sourceRoot}/*.d.ts`], vars.targetRoot);
};

const copyBaseAssets = () => {
  return cpy(`${vars.sourcePath.assets}/**/*`, vars.targetPath.assets);
};

const copyModuleAssets = () => {
  return cpy(`${vars.sourcePath.modules}/**/assets/**/*`, vars.targetPath.moduleAssets);
};

const copy = () => {
  console.log('=> copy');
  return Promise.all([copyRoot(), copyBaseAssets(), copyModuleAssets()]);
};

export {copy};
export default copy;
