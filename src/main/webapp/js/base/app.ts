import {autoInit, Loader, Logger, PubSub} from '@changke/staticnext-lib';

interface ModuleInitData {
  moduleName: string;
}

class App {
  start(assetPath = {css: '', js: '', modules: ''}) {
    PubSub.subscribe('mod:init', data => {
      Logger.log('app', `Module "${(data as ModuleInitData).moduleName}" initialized.`);
    });

    PubSub.subscribe('mod:dynInit', modRoot => {
      autoInit(modRoot as Element, undefined, Loader, assetPath);
    });

    // Auto initialize modules on page
    autoInit(undefined, undefined, Loader, assetPath);
  }
}

const app = new App();
export default app;
