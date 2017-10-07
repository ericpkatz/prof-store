const expect = require('chai').expect;
const supertest = require('supertest');
const app = supertest.agent(require('../../app'));
const db = require('../../db');

describe('session routes', ()=> {
  let seeded, moe;
  beforeEach(()=> {
    return db.sync()
      .then(()=> db.seed())
      .then( _seeded => {
        seeded = _seeded; 
        moe = seeded.moe;
      });
      
  });
  describe('data', ()=> {
    it('moe is there', ()=> {
      return expect(seeded.moe.email).to.equal('moe@moe.com');
    });
  });
  describe('user is not logged in', ()=> {
    it('returns a 401', ()=> {
      return app.get('/api/session')
        .expect(401);
    });
  });

  describe('the login process', ()=> {
    it('allows user to login and logout', ()=> {
      const { email, password } = moe;
      const credentials = {
        email,
        password
      };
      return app.post('/api/session')
        .send(credentials) 
        .expect(200)
        .then( result => {
          expect(result.body.createdAt).to.be.ok;
          return app.get('/api/session');
        })
        .then( result => {
          expect(result.status).to.equal(200);
          return app.delete('/api/session');
        })
        .then( result => {
          return app.get('/api/session');
        })
        .then( result => {
          expect(result.status).to.equal(401);
        })
    });
  });
});


