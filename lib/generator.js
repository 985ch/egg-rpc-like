'use strict';

const _ = require('lodash');
const objGen = require('obj-gen-9');

function createClient(config, extend) {
  if (!config.host) throw new Error('invalid rpcLike configuration');

  const obj = objGen(config, {}, extend);

  return obj;
}

module.exports = (config, extend) => {
  const rpcl = {};
  const defaultCfg = config.default || {};
  for (const key in config.clients) {
    const cfg = _.assign({}, defaultCfg, config.clients[key]);
    rpcl[key] = createClient(cfg, extend);
  }
  return rpcl;
};
