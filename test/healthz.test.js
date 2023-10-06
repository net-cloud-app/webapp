const request = require('supertest');
const app = require('../app'); 

describe('Healthz Endpoint', () => {
  it('should return status 200 and "OK" message', (done) => {
    request(app)
      .get('/healthz')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
