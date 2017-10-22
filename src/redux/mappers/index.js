import * as actions from '../actions';
const { 
  createProduct,
  addToCart,
  deleteFromCart,
  createOrder,
  attemptLogin,
  logout,
  addAddress
  } = actions;

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

const navStateMapper = ({ user, products, cart, orderHistory }, { location })=> {
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

const navDispatchMapper = (dispatch, { history })=> {
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

const productsDispatchMapper = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> {
      dispatch(addToCart({ user, cart, product}));
    }
  };
};

const productsStateMapper = ({ products, user, cart })=> {
  products = products.map( product => {
    const lineItem = cart.lineItems.find( lineItem=> lineItem.productId === product.id );
    return Object.assign({}, product, { lineItem });
  });

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

const addressStateMapper = ({ user, cart })=> {
  let address;

  if(cart.address && cart.address.address_components){
    address = cart.address;
  }
  let addresses = [];
  if(user.orders){
    addresses = user.orders.reduce((memo, order)=> {
      const address = memo.find( address => address.formatted_address === order.address.formatted_address);
      if(!address){
        memo.push(order.address);
      }
      return memo;
    }, []);
  }
  return {
    cart,
    user,
    address,
    addresses
  };
};

const addressDispatchMapper = (dispatch, { history })=> {
  return {
    addAddress: ({ user, cart, address })=> {
      dispatch(addAddress({ user, cart, address }));
    },
    createOrder: ({ user, cart })=> {
      dispatch(createOrder({ user, cart, history }));
    }
  };
};

const analyticsStateMapper = ({ orderHistory })=> {
  return {
    orderHistory,
  };
};

const ordersMapStateMapper = ({ orderHistory })=> {
  const addresses = orderHistory.map( order => {
    return order.address;
  });
  return {
    addresses
  };
};

export default {
  addressStateMapper,
  addressDispatchMapper,
  cartStateMapper,
  cartDispatchMapper,
  ordersDispatchMapper,
  ordersStateMapper,
  navStateMapper,
  navDispatchMapper,
  productsDispatchMapper,
  productsStateMapper,
  productFormDispatchMapper,
  analyticsStateMapper,
  ordersMapStateMapper
};
