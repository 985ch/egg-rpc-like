'use strict';

const generators = require('../../../../../index');

exports.keys = '123456';

exports.rpcLike = {
  default: {
    $generator: generators.simpleCurl(data => data),
  },
  clients: {
    test: {
      host: 'http://testserver',
      options: { dataType: 'text' },
      $members: [ 'test' ],
    },
    test2: {
      host: 'http://testserver',
      $generator: generators.functionCurl,
      $members: [{
        $key: 'test',
        api: 'rpc/xxx',
      }],
    },
  },
};
