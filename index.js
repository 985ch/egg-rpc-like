'use strict';

const _ = require('lodash');

function simpleCurl(member) {
  const api = member.url || member.key || member;
  return async function(params) {
    const opt = _.clone(member.options || this.$config.options || { method: 'GET', dataType: 'json' });
    if (params)opt.data = params;
    const url = this.$host + '/' + api;
    const { status, data } = await this.app.curl(url, opt);
    if (status !== 200) {
      throw new Error(`failed to request [${opt.method}]${url} status:${status}`);
    }
    return data;
  };
}

module.exports = {
  simpleCurl,
};
