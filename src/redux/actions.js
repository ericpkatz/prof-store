import axios from 'axios';
import store from './index';

// Add a request interceptor 
axios.interceptors.request.use(function (config) {
    // Do something before request is sent 
    store.dispatch({
      type: 'INCREMENT_REQUESTS'
    });
    return config;
  }, function (error) {
    // Do something with request error 
    return Promise.reject(error);
  });
 
// Add a response interceptor 
axios.interceptors.response.use(function (response) {
    // Do something with response data 
    store.dispatch({
      type: 'DECREMENT_REQUESTS'
    });
    return response;
  }, function (error) {
    // Do something with response error 
    store.dispatch({
      type: 'DECREMENT_REQUESTS'
    });
    return Promise.reject(error);
  });

export const fetchProducts = ()=> {
  return (dispatch)=> {
    return axios.get('/api/products')
      .then(response => dispatch(productsLoaded(response.data)));
  };
};

export const createProduct = (product)=> {
  return (dispatch)=> {
    return axios.post('/api/products', product)
      .then(response => dispatch(fetchProducts()));
  };
};

export const productsLoaded = (products)=> {
  return {
    type: 'SET_PRODUCTS',
    products
  };
};

export const fetchUser = ()=> {
  return (dispatch)=> {
    return axios.get('/api/session')
      .then(response => {
        dispatch(userLoaded(response.data))
        dispatch(loadCart(response.data.id));
      })
      .catch( ex => {
        console.log('user not logged in')
        loadLocalCart(dispatch);
      })
  };
};

export const loadLocalCart = (dispatch)=> {
  let cart = { lineItems: [] };
  const storage = window.localStorage;
  try{
    const contents = storage.getItem('CART');
    if(!contents){
      storage.setItem('CART', JSON.stringify(cart));
      return loadLocalCart(dispatch);
    }
    cart = JSON.parse(contents);
  }
  catch(ex){
    storage.removeItem('CART');
    return loadLocalCart(dispatch);
  }
  dispatch(cartLoaded(cart));
};

export const loadCart = (userId)=> {
  return (dispatch)=> {
    return axios.get('/api/cart')
      .then(response => {
        dispatch(cartLoaded(response.data))
        return response.data;
      })
      .catch( ex => console.log('user not logged in'))
  };
};

export const addToCart = ({ user, product, cart, quantity = 1 })=> {
  return (dispatch)=> {
    if(!user.id){
      let lineItem = cart.lineItems.find( lineItem => lineItem.productId === product.id);
      let lineItems;
      if(!lineItem){
        lineItem = {
          productId: product.id,
          quantity: 1
        };
        lineItems = [...cart.lineItems, lineItem];
      }
      else {
        lineItems = cart.lineItems.filter(_lineItem=> {
          if(_lineItem !== lineItem)
            return _lineItem;
          return Object.assign({}, _lineItem, { quantity: lineItem.quantity++});
        });
      }
      cart = Object.assign({}, cart, { lineItems });
      const storage = window.localStorage;
      storage.setItem('CART', JSON.stringify( cart ));
      return dispatch(cartLoaded(cart));
    }
    return axios.post(`/api/orders/${cart.id}/lineItems/`, { productId: product.id , quantity })
      .then(response => dispatch(loadCart(user.id)))
      .catch( ex => console.log('user not logged in'))
  };
};

export const deleteFromCart = ({ user, lineItem, cart })=> {
  return (dispatch)=> {
    if(!user.id){
      const lineItems = cart.lineItems.filter( _lineItem=> {
        return lineItem.productId !== _lineItem.productId;
      });
      cart = Object.assign({}, cart, { lineItems });
      const storage = window.localStorage;
      storage.setItem('CART', JSON.stringify(cart));
      return dispatch(cartLoaded(cart));
    }
    return axios.delete(`/api/orders/${cart.id}/lineItems/${lineItem.id}`)
      .then(response => dispatch(loadCart(user.id)))
      .catch( ex => console.log('user not logged in'))
  };
};

export const createOrder = ({ user, cart, history })=> {
  return (dispatch)=> {
    return axios.put(`/api/orders/${cart.id}/`, { status: 'ORDER' })
      .then(response => {
        dispatch(fetchUser());
        history.push('/orders');
      })
      .catch( ex => console.log(ex))
  };
};

export const addAddress = ({ user, cart, address })=> {
  return (dispatch)=> {
    return axios.put(`/api/orders/${cart.id}/`, { address })
      .then(response => {
        dispatch(fetchUser());
      })
      .catch( ex => console.log(ex))
  };
};

export const logout = (history)=> {
  return (dispatch)=> {
    return axios.delete('/api/session')
      .then(response => {
        dispatch(loggedOut());
        dispatch(cartLoaded({lineItems: []}));
        history.push('/');
      });
  };
};

export const attemptLogin = (credentials, cart, history)=> {
  return (dispatch)=> {
    return axios.post('/api/session', credentials)
      .then(response => {
        dispatch(userLoaded(response.data));
        let localItems = [];
        if(cart.lineItems.length){
          const storage = window.localStorage;
          storage.removeItem('CART');
          localItems = [...cart.lineItems];
        }
        dispatch(loadCart(response.data.id))
          .then( cart => {
            localItems.forEach( lineItem => {
              dispatch(addToCart(
                { 
                  user: {id: cart.userId }, 
                  cart, 
                  quantity: lineItem.quantity,
                  product: { 
                    id: lineItem.productId, 
                  }
                }
              ));
            });
            console.log('LOCAL', localItems);

          });
        history.push('/products');
      })
      .catch( ex => {
        console.log('user not logged in')
      })
  };
};

const userLoaded = (user)=> {
  return {
    type: 'SET_USER',
    user
  };
};

const cartLoaded = (cart)=> {
  return {
    type: 'SET_CART',
    cart
  };
};

const loggedOut = ()=> {
  return {
    type: 'SET_USER',
    user: {}
  };
};
