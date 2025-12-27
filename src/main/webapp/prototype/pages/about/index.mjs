import GeneralTemplate from '../../templates/general.mjs';
import header from '../../../modules/mod-header/header.tmpl.mjs';
import footer from '../../../modules/mod-footer/footer.tmpl.mjs';

class AboutPage extends GeneralTemplate {
  #blocks = {
    title: this.title,
    content: this.content
  };

  title() {
    return 'About / Half-Stack Developer';
  }

  content(data) {
    return String.raw`
      ${header(data, 'About')}
      <article>
        <h1>About</h1>
        <p>A "full-stack" developer does both front-end and back-end, I do front-end, thus "half".</p>
        <p>#html #css #javascript #webcomponents #frontend #til #kiss</p>
      </article>
      ${footer('About')}
    `;
  }

  renderBlock(blockName, data) {
    super.renderBlock(blockName);
    return this.#blocks[blockName]?.call(this, data);
  }
}

export default AboutPage;
