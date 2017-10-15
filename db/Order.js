const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Order = conn.define('order', {
  status: {
    type: Sequelize.STRING ,
    defaultValue: 'CART'
  },
  address: {
    type: Sequelize.JSON,
    defaultValue: {}
  }
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

Order.createLineItem = function(session, productId, quantity){
  return Order.getCartForUser(session)
    .then( cart => {
      let lineItem = cart.lineItems.find( lineItem => lineItem.productId === productId);
      if(lineItem){
        lineItem.quantity += (quantity || 1);
      }
      else {
        lineItem = conn.models.lineItem.build({ orderId: cart.id, productId: productId, quantity: quantity || 1});
      }
      return lineItem.save();
    });
};

Order.getCartForUser = function(session){
  if(!session.userId){
    const error = new Error('USER NOT IN SESSION');
    error.status = 401;
    throw error;
  }
  return this.findOne({
    where: {
      userId: session.userId,
      status: 'CART'
    }
  })
  .then( cart => {
    if(cart){
      return cart;
    }
    return Order.create({
      userId: session.userId 
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
