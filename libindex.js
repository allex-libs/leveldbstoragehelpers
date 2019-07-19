function createHelpers (execlib, bufferlib) {
  'use strict';
  
  var ret = {};
  require('./encodingcreator')(execlib, bufferlib, ret);
  require('./mixincreator')(execlib.lib, ret);

  return ret;
}

module.exports = createHelpers;
