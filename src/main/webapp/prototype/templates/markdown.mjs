import head from '../partials/html-head.mjs';
import header from '../../modules/mod-header/header.tmpl.mjs';
import footer from '../../modules/mod-footer/footer.tmpl.mjs';

class MarkdownTemplate {
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
        <title>${this.renderBlock('title', data)} / Half-Stack Developer</title>
      </head>
      <body>
        <main id="main">
          ${header(data, 'Article')}
          <article>
            ${this.renderBlock('content', data)}
          </article>
          ${footer('Article')}
        </main>
        <script type="module" src="${data.assetsUrlPath}/js/main.js" crossorigin></script>
        <script src="https://mwst.sinzy.info/code/3" async></script>
      </body>
      </html>
    `;
  }
}

export default MarkdownTemplate;
