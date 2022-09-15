import {getUrlPath} from '@changke/staticnext-lib';
import app from './base/app';

// Set static assets URL (for dynamic loading)
const jsFileName = 'main.js';
const jsFilePath = getUrlPath(jsFileName);

const assetPath = {
  css: `${jsFilePath}/../css`,
  js: jsFilePath,
  modules: `${jsFilePath}/../modules`
};

// Bootstrap app when document is ready
const docReady = document.readyState;
if (docReady === 'interactive' || docReady === 'complete') {
  app.start(assetPath);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    app.start(assetPath);
  });
}
