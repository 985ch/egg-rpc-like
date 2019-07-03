'use strict';

const objGen = require('obj-gen-9');

function createClient(config, app) {
  const { host, generator, api, keygen } = config;
  if (!host || !generator || !api) throw new Error('invalid rpcLike configuration');

  const obj = objGen({
    $generator: generator,
    $members: api,
    $keygen: keygen || (member => member.key || member),
  });
  obj.app = app;
  obj.$host = host;
  obj.$config = config;
  return obj;
}

module.exports = app => {
  if (app.config.rpcLike) {
    app.addSingleton('rpcLike', createClient);
  }
};
