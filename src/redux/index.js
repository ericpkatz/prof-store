import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';

const userReducer = (state = { }, action)=> {
  if(action.type === 'SET_USER'){
    state = action.user || {};
  }
  return state;
}

const cartReducer = (state = { lineItems: [] }, action)=> {
  if(action.type === 'SET_CART'){
    state = action.cart;
  }
  return state;
}

const productsReducer = (state = [], action)=> {
  if(action.type === 'SET_PRODUCTS'){
    state = action.products || {};
  }
  return state;
}

const reducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  cart: cartReducer
});

const middleware = [applyMiddleware(createLogger()), applyMiddleware(thunk)];
const store = createStore(reducer, ...middleware);

store.dispatch(()=> {});

const fetchProducts = ()=> {
  return (dispatch)=> {
    return axios.get('/api/products')
      .then(response => dispatch(productsLoaded(response.data)));
  };
};

const productsLoaded = (products)=> {
  return {
    type: 'SET_PRODUCTS',
    products
  };
};

const fetchUser = ()=> {
  return (dispatch)=> {
    return axios.get('/api/session')
      .then(response => {
        dispatch(userLoaded(response.data))
        dispatch(loadCart(response.data.id));
      })
      .catch( ex => console.log('user not logged in'))
  };
};

const loadCart = (userId)=> {
  return (dispatch)=> {
    let filter = JSON.stringify({ where: { userId, status: 'CART'}});
    filter =  encodeURI(filter);
    console.log(filter);
    return axios.get(`/api/orders/${filter}`)
      .then(response => dispatch(cartLoaded(response.data)))
      .catch( ex => console.log('user not logged in'))
  };
};

const addToCart = ({ user, product, cart })=> {
  return (dispatch)=> {
    return axios.post(`/api/orders/${cart.id}/lineItems/`, { productId: product.id })
      .then(response => dispatch(loadCart(user.id)))
      .catch( ex => console.log('user not logged in'))
  };
};

const deleteFromCart = ({ user, lineItem, cart })=> {
  
  return (dispatch)=> {
    return axios.delete(`/api/orders/${cart.id}/lineItems/${lineItem.id}`)
      .then(response => dispatch(loadCart(user.id)))
      .catch( ex => console.log('user not logged in'))
  };
};

const createOrder = ({ user, cart, history })=> {
  return (dispatch)=> {
    return axios.put(`/api/orders/${cart.id}/`, { status: 'ORDER' })
      .then(response => {
        dispatch(fetchUser());
        history.push('/orders');
      })
      .catch( ex => console.log(ex))
  };
};

const logout = (history)=> {
  return (dispatch)=> {
    return axios.delete('/api/session')
      .then(response => {
        dispatch(loggedOut());
        dispatch(cartLoaded({lineItems: []}));
        history.push('/');
      });
  };
};

const attemptLogin = (credentials, history)=> {
  return (dispatch)=> {
    return axios.post('/api/session', credentials)
      .then(response => {
        dispatch(userLoaded(response.data));
        dispatch(loadCart(response.data.id));
        history.push('/products');
      })
      .catch( ex => console.log('user not logged in'))
  };
};

const userLoaded = (user)=> {
  console.log(user);
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

const actions = {
  addToCart,
  deleteFromCart,
  fetchProducts,
  fetchUser,
  attemptLogin,
  logout,
  createOrder
};

export default store;
export { actions }
