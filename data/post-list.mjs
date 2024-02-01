import {readFileSync} from 'node:fs';
import * as path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

const genPubDateObj = dateStr => {
  const dt = new Date(dateStr);
  return {
    dateTime: dt.toUTCString(),
    label: dt.toDateString()
  };
};

const loadFeedContent = (pathPart) => {
  try {
    const filePath = path.join('public', pathPart, 'index.txt');
    const content = readFileSync(filePath, {encoding: 'utf-8'});
    const contentArray = content.split('\n');
    contentArray.splice(0, 1); // remove the headline (<h1>) since it's shown in reader as title already
    return contentArray.join('\n');
  } catch {
    return 'Full-text available on website.';
  }
};

const postList = require('./post-list.json');

postList.forEach(post => {
  post['pubDate'] = genPubDateObj(post.pubDate);
  post['content'] = () => loadFeedContent(post.url);
});

export default postList;
