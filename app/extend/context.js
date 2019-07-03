'use strict';

module.exports = {
  rpcl(name) {
    return this.app.rpcLike.get(name);
  },
};
