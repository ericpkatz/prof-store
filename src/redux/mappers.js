import * as actions from './actions';
const { createProduct, addToCart, deleteFromCart, createOrder, attemptLogin, logout } = actions;

const cartStateMapper = ({ products, user, cart })=> {
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

const cartDispatchMapper = (dispatch, { history })=> {
  return {
    createOrder: ({ user, cart })=> {
      history.push('/cart/address');
      //dispatch(createOrder({ user, cart, history }));
    },
    deleteFromCart: ({ cart, user, lineItem})=> {
      dispatch(deleteFromCart({ cart, user, lineItem }));
    }
  };
};

const ordersDispatchMapper = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> dispatch(addToCart({ user, cart, product }))
  };
};

const ordersStateMapper = ({ user, products, cart })=> {
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
          memo.push(Object.assign({}, lineItem, { product }));
        }
        return memo;
      }, []);
      memo.push(Object.assign({}, order, { lineItems }));
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

const navStateMapper = ({ user, products, cart })=> {
  return {
    user,
    isLoggedIn: !!user.id,
    productCount: products.length,
    cart: cart,
    cartCount: cart.lineItems.reduce((memo, lineItem)=> {
      memo += lineItem.quantity;
      return memo;
    }, 0),
    orderCount: user.id ? user.orders.length : 0
  };
};

const navDispatchMapper = (dispatch, { history })=> {
  return {
    logout: ()=> {
      dispatch(logout(history));
    },
    attemptLogin: ( credentials, cart )=> {
      dispatch(attemptLogin(credentials, cart, history));
    }
  };
}

const productsDispatchMapper = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> {
      dispatch(addToCart({ user, cart, product}));
    }
  };
};

const productsStateMapper = ({ products, user, cart })=> {
  return {
    products,
    user,
    cart,
    isLoggedIn: !!user.id
  };
};

const productFormDispatchMapper = (dispatch)=> {
  return {
    createProduct: (product)=> {
      return dispatch(createProduct(product));
    }
  };
};

export default {
  cartStateMapper,
  cartDispatchMapper,
  ordersDispatchMapper,
  ordersStateMapper,
  navStateMapper,
  navDispatchMapper,
  productsDispatchMapper,
  productsStateMapper,
  productFormDispatchMapper
};
