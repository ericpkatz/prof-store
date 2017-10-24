import * as actions from '../actions';

const { 
  createOrder,
  addAddress
  } = actions;

export const stateMapper = ({ user, cart })=> {
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

export const dispatchMapper = (dispatch, { history })=> {
  return {
    addAddress: ({ user, cart, address })=> {
      dispatch(addAddress({ user, cart, address }));
    },
    createOrder: ({ user, cart })=> {
      dispatch(createOrder({ user, cart, history }));
    }
  };
};
