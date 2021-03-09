'use strict';

module.exports = app => {
  const config = app.config.rpcLike;
  if (config && !config.clients) throw new Error('clients not found in rpcLike');
};
