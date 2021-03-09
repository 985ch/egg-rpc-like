'use strict';

const generate = require('../../lib/generator');

module.exports = {
  get rpcl() {
    return generate(this.config.rpcLike, { app: this });
  },
};
