const expect = require('chai').expect;
const supertest = require('supertest');
const app = supertest.agent(require('../../app'));
const db = require('../../db');

describe('session routes', ()=> {
  let seeded, moe, bar, foo;
  beforeEach(()=> {
    return db.sync()
      .then(()=> db.seed())
      .then( _seeded => {
        seeded = _seeded; 
        moe = seeded.users.moe;
        bar = seeded.products.bar;
        foo = seeded.products.foo;
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
    let cart;
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
          cart = result.body;
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
          const lineItem = result.body.lineItems[0];
          expect(result.body.lineItems.length).to.equal(1);
          expect(result.body.lineItems[0].quantity).to.equal(2);
          
          return app.delete(`/api/orders/${lineItem.orderId}/lineItems/${lineItem.id}`);
        })
        .then( result => {
          expect(result.status).to.equal(204);
          const filter = {
            where: {
              userId: moe.id,
              status: 'CART'
            }
          };
          return app.get(`/api/orders/${JSON.stringify(filter)}`);
        })
        .then((result)=> {
          expect(result.body.lineItems.length).to.equal(0);
          return app.post(`/api/orders/${cart.id}/lineItems`)
            .send({
              productId: foo.id,
              price: foo.price
            })
        })
        .then( result => {
          return app.put(`/api/orders/${cart.id}`)
            .send({
              status: 'ORDER'
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
          expect(result.body.id).not.to.equal(cart.id)
          return app.get('/api/session');
        })
        .then( result => {
          expect(result.body.orders.length).to.equal(1);
          expect(result.body.orders[0].lineItems.length).to.equal(1);
          expect(result.body.orders[0].lineItems[0].productId).to.equal(foo.id);
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


