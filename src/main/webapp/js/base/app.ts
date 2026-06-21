import {autoInit, loader, logger, pubSub} from '@changke/staticnext-lib';

interface ModuleInitData {
  moduleName: string;
}

class App {
  start(assetPath = {css: '', js: '', modules: ''}) {
    pubSub.subscribe('mod:init', data => {
      logger.log('app', `Module "${(data as ModuleInitData).moduleName}" initialized.`);
    });

    pubSub.subscribe('mod:dynInit', modRoot => {
      autoInit(modRoot as Element, undefined, loader, assetPath);
    });

    // Auto initialize modules on page
    autoInit(undefined, undefined, loader, assetPath);
  }
}

const app = new App();
export default app;
