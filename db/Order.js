const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Order = conn.define('order', {
  status: {
    type: Sequelize.STRING ,
    defaultValue: 'CART'
  },
});

Order.getCartForUser = function(id){
  return this.findOne({
    where: {
      userId: id,
      status: 'CART'
    }
  })
  .then( cart => {
    if(cart){
      return cart;
    }
    return Order.create({
      userId: id
    });
  })
  .then( cart => {
    return Order.findById(cart.id, {
      include: [
        conn.models.lineItem
      ]
    });
  });
}

module.exports = Order;
