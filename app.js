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
  '/cart',
  '/cart/address',
  '/orders'
].map( url => app.get(url, (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html'))));

app.use('/api', require('./api'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ message: err.message });
});

