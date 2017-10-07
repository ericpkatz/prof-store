const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

module.exports = Product;
