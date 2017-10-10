import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';
const { addToCart } = actions;

const Products = ({ products, user, cart, addToCart, isLoggedIn })=> {
  return (
    <ul className='list-group'>
      {
        products.map( product => {
          return (
            <li className='list-group-item' key={ product.id }>
              { product.name }
              {
                isLoggedIn && (
                  <button className='pull-right btn btn-primary' onClick={ ()=> addToCart({ user, product, cart })}> Add to Cart</button>
                )
              }
              <br style={ { clear: 'both' }} />
            </li>
          )
        })
      }
    </ul>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> {
      dispatch(addToCart({ user, cart, product}));
    }
  };
};

const mapStateToProps = ({ products, user, cart })=> {
  return {
    products,
    user,
    cart,
    isLoggedIn: !!user.id
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Products);
