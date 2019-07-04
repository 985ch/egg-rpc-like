'use strict';

const mock = require('egg-mock');

describe('test/rpc-like.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/rpc-like-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    app.mockHttpclient('http://testserver/test', 'GET', {
      data: 'test success',
    });
    app.mockHttpclient('http://testserver/rpc/xxx', 'GET', {
      data: { data: 5 },
    });
    return app.httpRequest()
      .get('/')
      .expect('hi, rpcLike')
      .expect(200);
  });
});
