'use strict';

const generate = require('../../lib/generator');

module.exports = {
  get rpcl() {
    return generate(this.app.config.rpcLike, {
      app: this.app,
      ctx: this,
      service: this.service,
    });
  },
};
