const expect = require('chai').expect;
const supertest = require('supertest');
const app = supertest.agent(require('../../app'));
const db = require('../../db');

describe('session routes', ()=> {
  let seeded, moe, bar;
  beforeEach(()=> {
    return db.sync()
      .then(()=> db.seed())
      .then( _seeded => {
        seeded = _seeded; 
        moe = seeded.users.moe;
        bar = seeded.products.bar;
      });
      
  });
  describe('data', ()=> {
    it('moe is there', ()=> {
      return expect(moe.email).to.equal('moe@moe.com');
    });
    it('bar is there', ()=> {
      return expect(bar.name).to.equal('bar');
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

  describe('ordering', ()=> {
    it('a user can create an order', ()=> {
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
          const filter = {
            where: {
              userId: result.body.id,
              status: 'CART'
            }
          };
          return app.get(`/api/orders/${JSON.stringify(filter)}`);
        })
        .then( result => {
          expect(result.status).to.equal(200);
          expect(result.body.userId).to.equal(moe.id);
          expect(result.body.lineItems.length).to.equal(0);
          return app.post(`/api/orders/${result.body.id}/lineItems`)
            .send({
              productId: bar.id,
              price: bar.price
            })
        })
        .then( result => {
          expect(result.status).to.equal(200);
          const filter = {
            where: {
              userId: moe.id,
              status: 'CART'
            }
          };
          return app.get(`/api/orders/${JSON.stringify(filter)}`);
        })
        .then( result => {
          expect(result.body.lineItems.length).to.equal(1);
          expect(result.body.lineItems[0].productId).to.equal(bar.id);
          return app.post(`/api/orders/${result.body.id}/lineItems`)
            .send({
              productId: bar.id,
              price: bar.price
            })
        })
        .then( result => {
          const filter = {
            where: {
              userId: moe.id,
              status: 'CART'
            }
          };
          return app.get(`/api/orders/${JSON.stringify(filter)}`);
        })
        .then( result => {
          expect(result.body.lineItems.length).to.equal(1);
          expect(result.body.lineItems[0].quantity).to.equal(2);
        })
        .then( result => {
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


