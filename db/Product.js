const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    get: function(price){
      return parseFloat(this.getDataValue('price'));
    }
  }
});

module.exports = Product;
