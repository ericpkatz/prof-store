import * as actions from '../actions';

const { deleteFromCart } = actions;

export const stateMapper = ({ products, user, cart })=> {
  if(cart.lineItems){
    const productMap = products.reduce((memo, product)=> {
      memo[product.id] = product;
      return memo;
    }, {});
    const lineItems = cart.lineItems.reduce((memo, lineItem)=> {
      const product = productMap[lineItem.productId];
      if(!product){
        memo.push(lineItem);
      }
      else{
        memo.push(Object.assign({}, lineItem, { product }));
      }
      return memo;
    }, []);

    cart = Object.assign({}, cart, { lineItems });
  }
  return {
    products,
    user,
    cart
  };
};

export const dispatchMapper = (dispatch, { history })=> {
  return {
    createOrder: ({ user, cart })=> {
      history.push('/cart/address');
    },
    deleteFromCart: ({ cart, user, lineItem})=> {
      dispatch(deleteFromCart({ cart, user, lineItem }));
    }
  };
};
