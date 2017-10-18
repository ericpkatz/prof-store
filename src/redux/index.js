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

const orderHistoryReducer = (state = [], action)=> {
  if(action.type === 'SET_ORDER_HISTORY'){
    state = action.orderHistory || [];
  }
  return state;
}

const requestsReducer = (state = 0, action)=> {
  switch(action.type){
    case 'INCREMENT_REQUESTS':
      state = state + 1;
      break;
    case 'DECREMENT_REQUESTS':
      state = state - 1;
      break;
  }
  return state;
};

const reducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
  requests: requestsReducer,
  orderHistory: orderHistoryReducer
});

const middleware = [applyMiddleware(thunk)];
if(!window.localStorage.getItem('NO_REDUX_LOG'))
  middleware.unshift(applyMiddleware(createLogger()));
const store = createStore(reducer, ...middleware);


export default store;

import * as actions from './actions';
export { actions };

import mappers from './mappers';
export { mappers }; 
