const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(session({
  secret: 'foo'
}));

module.exports = app;


app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use(require('body-parser').json());

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

const User = require('./db').models.User;

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
