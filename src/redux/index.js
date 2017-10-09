import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const userReducer = (state = { }, action)=> {
  if(action.type === 'SET_USER'){
    state = action.user || {};
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
  products: productsReducer
});

const middleware = applyMiddleware(thunk);
const store = createStore(reducer, middleware);

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
      .then(response => dispatch(userLoaded(response.data)))
      .catch( ex => console.log('user not logged in'))
  };
};

const userLoaded = (user)=> {
  return {
    type: 'SET_USER',
    user
  };
};

const actions = {
  fetchProducts,
  fetchUser
};

export default store;
export { actions }
