const conn = require('./conn');

const User = require('./User');

const sync = ()=> {
  return conn.sync({ force: true });
};

const names = ['moe', 'larry', 'curly'];

const seed = ()=> {
  const users = names.map( name => {
    return {
      name, 
      email: `${name}@${name}.com`,
      password: `${name}123`
    }
  });
  return Promise.all(users.map( user => User.create(user)))
    .then( users => {
      return users.reduce( (memo, user) => {
        memo[user.name] = user;
        return memo;
      }, {});
    });

};

module.exports = {
  sync,
  seed,
  models: {
    User
  }
};
