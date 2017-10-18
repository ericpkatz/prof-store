import React from 'react';
import { connect } from 'react-redux';
import { mappers } from '../redux';
import ProductForm from './ProductForm';
const { productsDispatchMapper, productsStateMapper } = mappers;

const Products = ({ products, user, cart, addToCart, isLoggedIn })=> {
  return (
    <div>
      <ul className='list-group'>
        {
          products.map( product => {
            return (
              <li className='list-group-item' key={ product.id }>
                { product.name }
                 { ` $${product.price.toFixed(2) }` }
                { 
                  product.lineItem && (
                    <div style={ { marginTop: '5px' } }>
                      <span className='label label-default'>
                        This item is in your cart { product.lineItem.quantity } times.
                      </span>
                    </div>
                  )
                }
                <button className='pull-right btn btn-primary' onClick={ ()=> addToCart({ user, product, cart })}> Add to Cart</button>
                <br style={{ clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        user.isAdmin && <ProductForm />
      }
    </div>
  );
};


export default connect(productsStateMapper, productsDispatchMapper )(Products);
