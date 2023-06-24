import postList from './build/post-list.mjs';

export default {
  moduleEntries: [
    'mod-example/example.ts',
    'mod-logo/logo.ts',
    'mod-nav/nav.ts'
  ],
  targetRoot: './public',
  targetPath: {
    prototype: '',
    markdown: '/posts'
  },
  njkGlobals: {
    postList: postList
  }
};
