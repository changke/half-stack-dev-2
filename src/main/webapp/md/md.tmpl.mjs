import MarkdownTemplate from '../prototype/templates/markdown.mjs';

class MarkdownPage extends MarkdownTemplate {
  #blocks = {
    title: this.title.bind(this),
    content: this.content.bind(this)
  };

  renderBlock(blockName, data) {
    super.renderBlock(blockName);
    return this.#blocks[blockName](data);
  }

  title(data) {
    return `${data.title}`;
  }

  content(data) {
    return `${data.content}`;
  }
}

export default MarkdownPage;
