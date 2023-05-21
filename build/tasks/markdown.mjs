import {globby} from 'globby';
import {readFile} from 'node:fs/promises';
import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import {markedXhtml} from 'marked-xhtml';
import hljs from 'highlight.js';
import njk from 'nunjucks';

import * as vars from '../vars.mjs';
import {createAndWriteToFile, getTargetPathString} from '../utils.mjs';

marked.use({
  headerIds: false,
  mangle: false
},
markedXhtml(),
markedHighlight({
  langPrefix: 'hljs language-',
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}));

const {Environment, FileSystemLoader} = njk;

const njkWrapper = {
  top: '{% extends "templates/markdown.njk" %}{% block title %}{{ pageTitle }}{% endblock %}{% block content %}',
  bottom: '{% endblock %}'
};

const getPageTitle = content => {
  let t = 'Untitled';
  if (content.length > 1) {
    const firstLine = content.split('\n')[0];
    if (firstLine) {
      t = firstLine.replace('# ', ''); // first line MUST be a level 1 heading!
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
      const pageTitle = getPageTitle(mdContent);
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
