import * as actions from '../actions';

const { 
  createProduct,
} = actions;

import { stateMapper as cartStateMapper, dispatchMapper as cartDispatchMapper } from './cartMapper';

import { stateMapper as productsStateMapper, dispatchMapper as productsDispatchMapper } from './productsMapper';

import { stateMapper as ordersStateMapper, dispatchMapper as ordersDispatchMapper } from './ordersMapper';

import { stateMapper as navStateMapper, dispatchMapper as navDispatchMapper } from './navMapper';

import { stateMapper as addressStateMapper, dispatchMapper as addressDispatchMapper } from './addressMapper';

const productFormDispatchMapper = (dispatch)=> {
  return {
    createProduct: (product)=> {
      return dispatch(createProduct(product));
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
