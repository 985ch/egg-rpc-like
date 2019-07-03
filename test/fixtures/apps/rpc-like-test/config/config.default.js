'use strict';

const generators = require('../../../../../index');

exports.keys = '123456';

exports.rpcLike = {
  default: {
    generator: generators.simpleCurl,
  },
  clients: {
    test: {
      host: 'http://127.0.0.1:7001',
      api: [{
        key: 'test',
        url: 'test',
      }],
    },
    test2: {
      host: 'http://127.0.0.1:7001',
      api: [{
        key: 'test',
        url: 'test',
      }],
    },
  },
};
