import {globby} from 'globby';
import {readFile} from 'node:fs/promises';
import {marked} from 'marked';
import njk from 'nunjucks';

import * as vars from '../vars.mjs';
import {createAndWriteToFile, getTargetPathString} from '../utils.mjs';

marked.setOptions({
  headerIds: false,
  xhtml: true
});

const {Environment, FileSystemLoader} = njk;

const njkWrapper = {
  top: '{% extends "templates/markdown.njk" %}{% block title %}{{ pageTitle }}{% endblock %}{% block content %}',
  bottom: '{% endblock %}'
};

const getPageTitle = htmlContent => {
  let t = 'Untitled';
  if (htmlContent.length > 1) {
    const firstLine = htmlContent.split('\n')[0];
    if (firstLine) {
      t = firstLine.replace('<h1>', '').replace('</h1>', '');
    }
  }
  return t;
};

const markdown = () => {
  console.log('=> markdown');
  return globby(`${vars.sourcePath.markdown}/**/*.md`).then(docs => {
    const njkEnv = new Environment(new FileSystemLoader([
      vars.sourcePath.prototype,
      vars.sourcePath.modules
    ], {}));
    njkEnv.addGlobal('assetsUrlPath', vars.assetsUrlPath);
    docs.forEach(async (doc) => {
      const mdContent = await readFile(doc, {encoding: 'utf8'});
      const html = marked.parse(mdContent);
      const pageTitle = getPageTitle(html);
      const njkContent = njkWrapper.top + html + njkWrapper.bottom;
      const res = njkEnv.renderString(njkContent, {
        'pageTitle': pageTitle
      });
      const target = getTargetPathString(
        doc,
        vars.sourcePath.markdown,
        vars.targetPath.markdown,
        'md',
        'html'
      );
      await createAndWriteToFile(target, res);
    });
  });
};

export {markdown};
export default markdown;
