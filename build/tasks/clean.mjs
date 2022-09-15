import {deleteAsync} from 'del';

import * as vars from '../vars.mjs';

/**
 * Clean the target directory
 * @returns {Promise<string[]>}
 */
const clean = () => {
  console.log('=> clean');
  return deleteAsync([`${vars.targetRoot}/*`]);
};

export {clean};
export default clean;
