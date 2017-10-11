const app = require('express').Router();
module.exports = app;

const models = require('./db').models; 

const { User, Product, Order, LineItem}  =  models;

app.get('/products', (req, res, next)=> {
  Product.findAll()
    .then( products => res.send(products))
    .catch(next);
});

app.post('/users', (req, res, next)=> {
  User.create(req.body)
    .then( user => {
      req.session.userId = user.id;
      res.send(user);
    })
    .catch(next);
});

app.get('/session', (req, res, next)=> {
  User.findBySession(req.session)
    .then( user => res.send(user))
    .catch(next);
});

app.post('/session', (req, res, next)=> {
  User.authenticate(req.body)
    .then( user => {
      req.session.userId = user.id;
      res.send(user)
    })
    .catch(next);
});

app.delete('/session', (req, res, next)=> {
  req.session.destroy();
  res.sendStatus(204);
});

app.get('/orders/:filter', (req, res, next)=> {
  Order.getByFilter(req.params.filter)
    .then( result => res.send(result))
    .catch(next);
});

app.delete('/orders/:orderId/lineItems/:id', (req, res, next)=> {
  LineItem.destroy({
    where: {
      orderId: req.params.orderId,
      id: req.params.id
    }
  })
  .then(()=> {
    res.sendStatus(204);
  })
  .catch(next);
});

app.put('/orders/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then( order => res.send(order))
    .catch(next);
});

app.post('/orders/:id/lineItems', (req, res, next)=> {
  Order.createLineItem({ orderId: req.params.id, productId: req.body.productId })
  .then( lineItem => res.send(lineItem))
  .catch(next);
});
