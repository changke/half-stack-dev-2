import {readFileSync} from 'node:fs';
import * as path from 'node:path';

const formatDate = dateStr => {
  const dt = new Date(dateStr);
  return dt.toUTCString();
};

const loadFeedContent = (p) => {
  const filePath = path.join('public', p, 'index.txt');
  const content = readFileSync(filePath, {encoding: 'utf-8'});
  return content;
};

const postList = [
  {
    title: 'Chrome Mobile Font Size Issue',
    pubDate: {
      dateTime: formatDate('2023-10-21'),
      label: 'Oct 21 2023'
    },
    url: '/posts/chrome-mobile-font-size/'
  },
  {
    title: 'Normal JavaScript Included As Module',
    pubDate: {
      dateTime: formatDate('2023-09-06'),
      label: 'Sep 06 2023'
    },
    url: '/posts/normal-js-included-as-module/'
  },
  {
    title: 'How to Lint Lit Styles',
    pubDate: {
      dateTime: formatDate('2023-06-05'),
      label: 'Jun 05 2023'
    },
    url: '/posts/howto-lint-lit-styles/'
  },
  {
    title: 'Introducing "Shoelace"',
    pubDate: {
      dateTime: formatDate('2021-10-29'),
      label: 'Oct 29 2021'
    },
    url: '/posts/introducing-shoelace/'
  },
  {
    title: 'Setting Up Lit',
    pubDate: {
      dateTime: formatDate('2021-08-28'),
      label: 'Aug 28 2021'
    },
    url: '/posts/setting-up-lit/'
  },
  {
    title: 'Hello World!',
    pubDate: {
      dateTime: formatDate('2021-07-22'),
      label: 'Jul 22 2021'
    },
    url: '/posts/hello-world/'
  }
];

postList.forEach(post => {
  post['content'] = loadFeedContent(post.url);
});

export default postList;
