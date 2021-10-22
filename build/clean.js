const path = require('path');
const del = require('del');

const { distDir } = require('./utils/utils');

del.sync([
  path.resolve(distDir, '*'),
]);
