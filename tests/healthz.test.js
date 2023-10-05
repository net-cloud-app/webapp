const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;

describe('/healtz Endpoint', () => {
  it('should return a 200 status code and a success message', (done) => {
    chai.request(app)
      .get('/healtz')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').to.equal('Healthy');
        done();
      });
  });
});


