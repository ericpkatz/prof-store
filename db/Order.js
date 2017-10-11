const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Order = conn.define('order', {
  status: {
    type: Sequelize.STRING ,
    defaultValue: 'CART'
  },
});

Order.updateFromRequestBody = function(id, body){
  return this.findById(id)
    .then( order => {
      Object.assign(order, body);
      return order.save();
    });
};

Order.getByFilter = function(_filter){
  const filter = JSON.parse(_filter);
  if(filter.where && filter.where.status && filter.where.status === 'CART' && filter.where.userId){
    return Order.getCartForUser(filter.where.userId);
  }
};

Order.createLineItem = function(filter){
  return conn.models.lineItem.findOne({
    where: filter 
  })
  .then( lineItem => {
    if(lineItem){
      lineItem.quantity++;
    }
    else {
      lineItem = conn.models.lineItem.build(filter);
    }
    return lineItem.save();
  });
};

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
