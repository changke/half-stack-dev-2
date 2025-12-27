import {esbuildPlugin} from '@web/dev-server-esbuild';
import {puppeteerLauncher} from '@web/test-runner-puppeteer';

export default {
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        headless: 'shell'
      }
    })
  ],
  files: 'src/main/webapp/test/**/*.test.ts',
  nodeResolve: true,
  plugins: [esbuildPlugin({ts: true})]
};
