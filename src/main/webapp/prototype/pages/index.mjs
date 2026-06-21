import GeneralTemplate from '../templates/general.mjs';
import header from '../../modules/mod-header/header.tmpl.mjs';
import footer from '../../modules/mod-footer/footer.tmpl.mjs';
import archive from '../../modules/mod-archive/archive.tmpl.mjs';

class IndexPage extends GeneralTemplate {
  #blocks = {
    title: this.title.bind(this),
    content: this.content.bind(this)
  };

  title() {
    return 'Half-Stack Developer';
  }

  content(data) {
    return String.raw`
      ${header(data, 'Home')}
      ${archive(data)}
      ${footer('Home')}
    `;
  }

  renderBlock(blockName, data) {
    super.renderBlock(blockName, data);
    return this.#blocks[blockName](data);
  }
}

export default IndexPage;
