import {esbuildPlugin} from '@web/dev-server-esbuild';

export default {
  files: 'src/main/webapp/test/**/*.test.ts',
  nodeResolve: true,
  plugins: [esbuildPlugin({ts: true})]
};
