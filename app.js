'use strict';

const _ = require('lodash');
const gen = require('obj-gen-9');

function genCurl(generator) {
  return member => {
    const api = member.url || member.key || member;
    const options = member.options || { method: 'GET', dataType: 'json' };
    return async function(params) {
      const opt = _.clone(options);
      if (params)opt.data = params;
      const url = this.host + '/' + api;
      const { status, data } = await this.app.curl(url, opt);
      if (status !== 200) {
        throw new Error(`failed to request [${opt.method}]${url} status:${status}`);
      }
      return generator(data);
    };
  };
}

function createClient(config, app) {
  const { host, generator, api, keygen } = config;
  if (!host || !generator || !api) throw new Error('invalid rpcLike configuration');
  const obj = gen({
    $generator: genCurl(generator),
    $members: api,
    $keygen: keygen || (member => member.key || member),
  });
  obj.app = app;
  obj.host = host;
  return obj;
}

module.exports = app => {
  if (app.config.rpcLike)app.addSingleton('rpcLike', createClient);
};
