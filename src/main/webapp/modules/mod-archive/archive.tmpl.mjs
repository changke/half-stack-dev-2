const archive = data => `
  <section data-mod-name="archive" data-mod-bypass>
    <ul class="archive__postlist">
      ${data.postList.map(post => archiveItem(post)).join('')}
    </ul>
  </section>
`;

const archiveItem = post => String.raw`
  <li class="archive__post">
    <a href="${post.url}" class="archive__link">${post.title}</a>
    <time datetime="${post.pubDate.dateTime}" class="archive__time">${post.pubDate.label}</time>
  </li>
`;

export default archive;
