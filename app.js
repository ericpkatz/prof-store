const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(session({
  secret: 'foo'
}));

module.exports = app;


app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use(require('body-parser').json());

[
  '/',
  '/products',
].map( url => app.get(url, (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html'))))

//TODO pull routes out

const models = require('./db').models; 

const { User, Product, Order, LineItem}  =  models;

app.get('/api/products', (req, res, next)=> {
  Product.findAll()
    .then( products => res.send(products))
    .catch(next);
});

app.post('/api/users', (req, res, next)=> {
  User.create(req.body)
    .then( user => {
      req.session.userId = user.id;
      res.send(user);
    })
    .catch(next);
});

app.get('/api/session', (req, res, next)=> {
  if(!req.session.userId){
    return res.sendStatus(401);
  }
  User.findOrThrow(req.session.userId)
    .then( user => res.send(user))
    .catch(()=> {
      delete req.session.userId;
      return res.sendStatus(401);
    });
});

app.post('/api/session', (req, res, next)=> {
  User.authenticate(req.body)
    .then( user => {
      req.session.userId = user.id;
      res.send(user)
    })
    .catch(next);
});

app.delete('/api/session', (req, res, next)=> {
  req.session.destroy();
  res.sendStatus(204);
});

app.get('/api/orders/:filter', (req, res, next)=> {
  const filter = JSON.parse(req.params.filter);
  if(filter.where && filter.where.status && filter.where.status === 'CART' && filter.where.userId){
    Order.getCartForUser(filter.where.userId)
      .then( cart => res.send(cart))
      .catch(next);
  }
});

app.delete('/api/orders/:orderId/lineItems/:id', (req, res, next)=> {
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

app.put('/api/orders/:id', (req, res, next)=> {
  Order.findById(req.params.id)
    .then( order => {
      Object.assign(order, req.body);
      return order.save();
    })
    .then( order => res.send(order))
    .catch(next);
});

app.post('/api/orders/:id/lineItems', (req, res, next)=> {
  const filter = {
    orderId: req.params.id,
    productId: req.body.productId
  };
  LineItem.findOne({
    where: filter 
  })
  .then( lineItem => {
    if(lineItem){
      lineItem.quantity++;
    }
    else {
      lineItem = LineItem.build(filter);
    }
    lineItem.price = req.body.price
    return lineItem.save();
  })
  .then( lineItem => res.send(lineItem))
  .catch(next);
});
