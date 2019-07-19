function createLib (execlib) {
  'use strict';
  return execlib.loadDependencies('client', ['allex:buffer:lib'], require('./libindex').bind(null, execlib));
}

module.exports = createLib;
