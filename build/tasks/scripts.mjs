import {build} from 'esbuild';

import * as vars from '../vars.mjs';
import isEnvProd from '../is-prod.mjs';

const esm = () => {
  console.log('=> scripts');
  return build({
    entryPoints: vars.scriptEntries,
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: `${vars.targetPath.assets}`,
    minify: isEnvProd(), // only minify in prod build
    sourcemap: !isEnvProd() // only create sourcemaps in dev build
  });
};

export {esm};
export default esm;
