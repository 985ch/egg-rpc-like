'use strict';

const _ = require('lodash');

function simpleCurl(getData) {
  return function(member, { host, options, onFail }) {
    const api = member.api || member.key || member;

    return async function(params) {
      const opt = _.clone(member.options || options || { method: 'GET', dataType: 'json' });
      if (params)opt.data = params;
      const url = host + '/' + api;
      const { status, data } = await this.app.curl(url, opt);
      if (status !== 200) {
        if (onFail) {
          onFail(status, data);
        } else {
          throw new Error(`failed to request [${opt.method}]${url} status:${status}`);
        }
      }

      return getData(data);
    };
  };
}

function functionCurl(member, { paramName, host, options, onFail, onError }) {
  const api = member.api || member.key || member;
  const pname = paramName || 'arg';
  return async function() {
    const opt = _.clone(member.options || options || { method: 'GET', dataType: 'json' });

    const params = { t: Date.now() };
    const args = new Array(arguments.length);
    for (const key in arguments) {
      args[key] = arguments[key];
    }
    params[pname] = JSON.stringify(args);
    opt.data = params;

    const url = host + '/' + api;
    const { status, data } = await this.app.curl(url, opt);
    if (status !== 200) {
      if (onFail) return onFail(status, data);
      throw new Error(`failed to request [${opt.method}]${url} status:${status}`);
    } else if (data.err) {
      if (onError) return onError(data);
      throw new Error(`remote function error ${url},code:${data.err},msg:${data.msg}`);
    }

    return data.data;
  };
}

module.exports = {
  simpleCurl,
  functionCurl,
};
