import RSSTemplate from '../../templates/rss.mjs';

class RSSPage extends RSSTemplate {
  #blocks = {
    content: this.content.bind(this)
  };

  content(data) {
    return data.postList.map(post => this.item(post)).join('');
  }

  item(post) {
    return `
      <item>
        <title>${post.title}</title>
        <link>https://half-stack.dev${post.url}</link>
        <description><![CDATA[${post.content()}]]></description>
        <pubDate>${post.pubDate.dateTime}</pubDate>
      </item>
    `;
  }

  renderBlock(blockName, data) {
    super.renderBlock(blockName, data);
    return this.#blocks[blockName](data);
  }
}

export default RSSPage;
