import React from 'react';
import { connect } from 'react-redux';
import { mappers } from '../redux';
const { productsDispatchMapper, productsStateMapper } = mappers;

const Products = ({ products, user, cart, addToCart, isLoggedIn })=> {
  return (
    <ul className='list-group'>
      {
        products.map( product => {
          return (
            <li className='list-group-item' key={ product.id }>
              { product.name }
              <button className='pull-right btn btn-primary' onClick={ ()=> addToCart({ user, product, cart })}> Add to Cart</button>
              <br style={ { clear: 'both' }} />
            </li>
          )
        })
      }
    </ul>
  );
};


export default connect(productsStateMapper, productsDispatchMapper )(Products);
