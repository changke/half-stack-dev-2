class RSSTemplate {
  blockNames = ['content'];

  renderBlock(blockName) {
    if (!this.blockNames.includes(blockName)) {
      console.warn(`Block "${blockName}" is not defined in template.`);
    }
  }

  render(data) {
    return String.raw`<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>Half-Stack Developer</title>
          <link>https://half-stack.dev/</link>
          <description>The latest posts about web front-end development</description>
          <language>en</language>
          <pubDate>Sat, 21 Oct 2023 00:00:00 GMT</pubDate><!-- manual updating? -->
          ${this.renderBlock('content', data)}
        </channel>
      </rss>
    `;
  }
}

export default RSSTemplate;
