const conn = require('./conn');

const User = require('./User');
const Order = require('./Order');
const LineItem = require('./LineItem');
const Product = require('./Product');

Order.belongsTo(User);
User.hasMany(Order);
Order.hasMany(LineItem);
LineItem.belongsTo(Product);

const sync = ()=> {
  return conn.sync({ force: true });
};

const userNames = ['moe', 'larry', 'curly', 'admin'];
const productNames = ['foo', 'bar', 'bazz'];

const seed = ()=> {
  const users = userNames.map( name => {
    return {
      name, 
      email: `${name}@${name}.com`,
      password: `${name}123`,
      isAdmin: name === 'admin' ? true : false
    }
  });

  const products = productNames.map( (name, idx) => {
    return {
      name,
      price: idx + 1
    }
  });

  const createUserPromises = users.map( user => User.create(user)); 
  const userPromises = 
    Promise.all(createUserPromises)
    .then( (users) => {
      return users.reduce( (memo, user) => {
        memo[user.name] = user;
        return memo;
      }, {}); 
    });

  const createProductPromises = products.map( product => Product.create(product)); 
  const productPromises = 
    Promise.all(createProductPromises)
    .then( (products) => {
      return products.reduce( (memo, product) => {
        memo[product.name] = product;
        return memo;
      }, {}); 
    });
  return Promise.all([userPromises, productPromises])
            .then(([users, products])=> {
              return {
                users,
                products
              }
            });

};

module.exports = {
  sync,
  seed,
  models: {
    Product,
    User,
    Order,
    LineItem
  }
};
