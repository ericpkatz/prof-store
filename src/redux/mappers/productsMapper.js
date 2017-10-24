import * as actions from '../actions';

const { 
  deleteProduct,
  undeleteProduct,
  addToCart,
  } = actions;

export const dispatchMapper = (dispatch)=> {
  return {
    deleteProduct: (product)=> {
      return dispatch(deleteProduct(product));
    },
    undeleteProduct: (product)=> {
      return dispatch(undeleteProduct(product));
    },
    addToCart: ({ user, cart, product })=> {
      dispatch(addToCart({ user, cart, product}));
    }
  };
};

export const stateMapper = ({ products, user, cart })=> {
  products = products.map( product => {
    const lineItem = cart.lineItems.find( lineItem=> lineItem.productId === product.id );
    return Object.assign({}, product, { lineItem });
  });
  if(!user.isAdmin){
    products = products.filter( product => !product.isDeleted );
  }

  return {
    products,
    user,
    cart,
    isLoggedIn: !!user.id
  };
};
