'use strict';

const _ = require('lodash');
const objGen = require('obj-gen-9');

function createClient(config, app) {
  if (!config.host) throw new Error('invalid rpcLike configuration');

  const obj = objGen(config);
  obj.app = app;

  return obj;
}

module.exports = app => {
  const config = app.config.rpcLike;
  if (config) {
    if (!config.clients) throw new Error('clients not found in rpcLike');

    const rpcl = {};
    const defaultCfg = config.default || {};
    for (const key in config.clients) {
      const cfg = _.assign({}, defaultCfg, config.clients[key]);
      rpcl[key] = createClient(cfg, app);
    }

    app.rpcl = rpcl;
  }
};
