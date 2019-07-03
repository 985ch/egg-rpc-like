'use strict';

/**
 * egg-rpc-like default config
 * @member Config#rpcLike
 */
exports.rpcLike = {
  default: {
    generator: data => data,
  },
  // Single Cache
  // client: {
  //   host: 'http://your.site.com',
  //   generator: (ctx, member) => {},
  //   api:[['method','url', {method:'GET'}]]
  // },

  // Multi Redis
  // clients: {
  //   instance1: {
  //     host: 'http://your.site.com',
  //     generator: (ctx, member) => {},
  //     api:[]
  //   },
  //   instance2: {
  //     host: 'http://your.site.com',
  //     generator: (ctx, member) => {},
  //     api:[]
  //   },
  // },
};
