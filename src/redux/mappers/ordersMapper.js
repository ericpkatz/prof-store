import * as actions from '../actions';

const { 
  addToCart
  } = actions;

export const dispatchMapper = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> dispatch(addToCart({ user, cart, product }))
  };
};

export const stateMapper = ({ user, products, cart })=> {
  if(user.orders){
    const productMap = products.reduce((memo, product)=> {
      memo[product.id] = product;
      return memo;
    }, {});
    const orders = user.orders.reduce((memo, order)=> {
      const lineItems = order.lineItems.reduce((memo, lineItem)=> {
        const product = productMap[lineItem.productId];
        if(!product){
          memo.push(lineItem);
        }
        else{
          memo.push(Object.assign({}, lineItem, { product, subTotal: product.price * lineItem.quantity }));
        }
        return memo;
      }, []);
      const total = lineItems.reduce( (_total, lineItem) => {
        _total += lineItem.subTotal;
        return _total;
      }, 0);
      memo.push(Object.assign({}, order, { lineItems, total }));
      return memo;
    }, []);
    user = Object.assign({}, user, { orders });
  }
  return {
    orders: user.id ? user.orders : [],
    user,
    cart
  };
};
