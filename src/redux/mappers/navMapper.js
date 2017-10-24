import * as actions from '../actions';

const { 
  addToCart,
  attemptLogin,
  logout,
  } = actions;

export const stateMapper = ({ user, products, cart, orderHistory }, { location })=> {
  const isLoggedIn = !!user.id;
  const isAdmin = user.isAdmin;

  const productMap = products.reduce((memo, product)=> {
    memo[product.id] = product;
    return memo;
  }, {});

  const cartCount = cart.lineItems.reduce((memo, lineItem)=> {
    memo += lineItem.quantity;
    return memo;
  }, 0);

  const cartTotal = cart.lineItems.reduce((memo, lineItem)=> {
    const product = productMap[lineItem.productId];
    if(!product){
      return memo;
    }
    memo += product.price * lineItem.quantity; 
    return memo;
  }, 0);

  const salesMap = orderHistory.reduce((memo, order)=> {
    if(!order.lineItems){
      return memo;
    }
    order.lineItems.forEach( lineItem => {
      if(memo[lineItem.productId] === undefined){
        memo[lineItem.productId] = 0;
      }
      memo[lineItem.productId]+= lineItem.quantity;
    });
    return memo;
  }, {});

  const topSellerId = Object.keys(salesMap).reduce((memo, key)=> {
    if(salesMap[key] > memo){
      memo = key;
    }
    return memo;
  }, 0);

  const topSeller = productMap[topSellerId];

  const links = [
    {
      text: 'Home',
      path: '/'
    },
    {
      text: `Products (${products.length})`,
      path: '/products'
    },
    {
      text: `Cart (${cartCount} items -  $${ cartTotal.toFixed(2) })`,
      path: '/cart'
    }
  ];
  if(isLoggedIn){
    links.push({
      text: `Orders (${user.orders.length})`,
      path: '/orders'
    });
  }
  if(isAdmin){
    links.push({
      text: `Analytics (${ orderHistory.length})`,
      path: '/analytics'
    });
  }
  links.forEach((link)=> {
    if(link.path === location.pathname || (link.path !== '\/' && location.pathname.indexOf(link.path) === 0 )){
      link.active = true;
    }
  });
  return {
    user,
    isLoggedIn,
    links,
    cart,
    topSeller
  };
};

export const dispatchMapper = (dispatch, { history })=> {
  return {
    logout: ()=> {
      dispatch(logout(history));
    },
    attemptLogin: ( credentials, cart )=> {
      dispatch(attemptLogin(credentials, cart, history));
    },
    addToCart: ({ user, cart, product })=> {
      dispatch(addToCart({ user, cart, product}));
    }
  };
}
