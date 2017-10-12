import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

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


export default store;

import actions from './actions';
export { actions };

import mappers from './mappers';
export { mappers }; 
