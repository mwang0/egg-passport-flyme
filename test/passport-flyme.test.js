'use strict';

const mock = require('egg-mock');

describe('test/passport-flyme.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/passport-flyme-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, passportFlyme')
      .expect(200);
  });
});
