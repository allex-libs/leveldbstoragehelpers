function createMixin (lib, mylib) {
  'use strict';

  var Encoding = mylib.Encoding;

  function LevelDBStorageMixin (prophash) {
    if (!prophash.dbname) {
      throw new lib.Error('NO_DBNAME', 'LevelDB propertyhash needs the dbname property');
    }
    this.propertyhash = prophash;
    this.encoding = null;
  }
  LevelDBStorageMixin.prototype.destroy = function () {
    if (this.encoding) {
      this.encoding.destroy();
    }
    this.encoding = null;
    this.propertyhash = null;
  };
  LevelDBStorageMixin.prototype.createEncodingAndReturnPropertyHash = function (keyencoding) {
    this.encoding = new Encoding(this.__record);
    var ph = this.propertyhash || {};
    ph.dbname = this.propertyhash.dbname;
    ph.starteddefer = this.readyDefer;
    ph.dbcreationoptions = {
      keyEncoding: keyencoding,
      valueEncoding: this.encoding.getCodec()
    };
    return ph;
  };
  LevelDBStorageMixin.prototype._destroyDataWithElements = function () {
    this.data.destroy();
  };
  function keyvaluer (cb, keyvalitem) {
    cb(keyvalitem.value, keyvalitem.key);
  }
  LevelDBStorageMixin.prototype._traverseData = function (cb) {
    var ret = this.data.traverse(keyvaluer.bind(null, cb));
    cb = null;
    return ret;
  };
  LevelDBStorageMixin.prototype._traverseDataRange = function (cb, start, endexclusive) {
    var ret = this.data.traverse(keyvaluer.bind(null, cb), {gte:start, lt:endexclusive});
    cb = null;
    return ret;
  };
  LevelDBStorageMixin.prototype.removeDataAtIndex = function (index) {
    return this.data.del(index);
  };
  LevelDBStorageMixin.prototype.finalizeUpdateOnItem = function(item, defer) {
    var ret = this.data.put(item.index, item.new).then(
      this.baseFinalizeUpdateOnItem.bind(this, item, defer)
    );
    item = null;
    defer = null;
    return ret;
  };

  LevelDBStorageMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, LevelDBStorageMixin
      ,'createEncodingAndReturnPropertyHash'
      ,'_destroyDataWithElements'
      ,'_traverseData'
      ,'_traverseDataRange'
      ,'removeDataAtIndex'
      ,'finalizeUpdateOnItem'
    );
  };

  mylib.Mixin = LevelDBStorageMixin;
}

module.exports = createMixin;
