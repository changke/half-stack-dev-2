import moduleEntries from './module-entires.mjs';

const sourceRoot = './src/main/webapp';
const targetRoot = './public';

const sourcePath = {
  assets: `${sourceRoot}/assets`,
  css: `${sourceRoot}/css`,
  js: `${sourceRoot}/js`,
  modules: `${sourceRoot}/modules`,
  prototype: `${sourceRoot}/prototype`,
  test: `${sourceRoot}/test`,
  markdown: `${sourceRoot}/md`
};

const targetAssetsRoot = `${targetRoot}/assets/_sn_`;
const targetPath = {
  assets: targetAssetsRoot,
  css: `${targetAssetsRoot}/css`,
  js: `${targetAssetsRoot}/js`,
  moduleAssets: `${targetAssetsRoot}/modules`,
  prototype: `${targetRoot}`,
  markdown: `${targetRoot}/posts`
};

const tenants = ['one'];

// For code splitting, as input config for rollup
const moduleEntryFiles = moduleEntries.map(f => {
  return `${sourcePath.modules}/${f}`;
});

// also add entry file
const scriptEntries = [`${sourcePath.js}/main.ts`].concat(moduleEntryFiles);

// To get relative path of assets
const assetsUrlPath = '/assets/_sn_';

// Markdown enabled?
const markdownEnabled = true;

export {
  sourceRoot,
  targetRoot,
  sourcePath,
  targetPath,
  tenants,
  scriptEntries,
  assetsUrlPath,
  markdownEnabled
};
