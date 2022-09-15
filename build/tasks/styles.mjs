import {build} from 'esbuild';
import {globby} from 'globby';

import * as vars from '../vars.mjs';
import isEnvProd from '../is-prod.mjs';

const styles = () => {
  console.log('=> styles');
  return globby([
    `${vars.sourcePath.css}/brands/*.css`,
    `${vars.sourcePath.css}/index.css`,
    `${vars.sourcePath.modules}/**/*.css`,
    `!${vars.sourcePath.modules}/**/_*.css`
  ]).then(entries => {
    return build({
      entryPoints: entries,
      bundle: true,
      outdir: `${vars.targetPath.assets}`,
      sourcemap: !isEnvProd(),
      minify: isEnvProd()
    });
  });
};

export {styles};
export default styles;
