import GeneralTemplate from '../templates/general.mjs';
import header from '../../modules/mod-header/header.tmpl.mjs';
import footer from '../../modules/mod-footer/footer.tmpl.mjs';
import archive from '../../modules/mod-archive/archive.tmpl.mjs';

class IndexPage extends GeneralTemplate {
  #blocks = {
    title: this.title,
    content: this.content
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
    super.renderBlock(blockName);
    return this.#blocks[blockName]?.call(this, data);
  }
}

export default IndexPage;
