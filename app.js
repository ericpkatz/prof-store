const express = require('express');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');

const app = express();
let config = process.env;
try {
  config = require('./env');
}
catch(ex){
 
}

app.use(session({
  secret: config.SESSION_SECRET
}));

module.exports = app;


app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, '/public'));

app.use(require('body-parser').json());

[
  '/',
  '/products',
  '/cart',
  '/cart/address',
  '/orders',
  '/analytics'
].forEach( url => app.get(url, (req, res, next)=> {
  res.render('index.html', { GOOGLE_PLACES_API_KEY: config.GOOGLE_PLACES_API_KEY });
}));

app.use('/api', require('./api'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ message: err.message });
});

