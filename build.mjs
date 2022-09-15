import {argv} from 'process';

import clean from './build/tasks/clean.mjs';
import copy from './build/tasks/copy.mjs';
import markdown from './build/tasks/markdown.mjs';
import prototype from './build/tasks/prototype.mjs';
import scripts from './build/tasks/scripts.mjs';
import setEnvDev from './build/tasks/set-env-dev.mjs';
import setEnvProd from './build/tasks/set-env-prod.mjs';
import styles from './build/tasks/styles.mjs';

const taskName = argv[2]?.toLowerCase() || 'dev';

const taskEnded = taskName => {
  console.timeEnd(taskName);
};

const paraDev = () => {
  return Promise.all([
    markdown(),
    prototype(),
    styles(),
    scripts()
  ]);
};

const paraProd = () => {
  return Promise.all([
    markdown(),
    styles(),
    scripts()
  ]);
};

const dev = () => {
  return setEnvDev().then(clean).then(copy).then(paraDev);
};

const prod = () => {
  return setEnvProd().then(clean).then(copy).then(paraProd);
};

const taskMap = {
  'clean': clean,
  'copy': copy,
  'markdown': markdown,
  'prototype': prototype,
  'scripts': scripts,
  'setenvdev': setEnvDev,
  'setenvprod': setEnvProd,
  'styles': styles,
  'dev': dev,
  'prod': prod
};

const task = taskMap[taskName];

console.log('+++ SN Build +++');
console.time(taskName);
console.log(`Task "${taskName}" started...`);
task().then(() => {
  taskEnded(taskName);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
