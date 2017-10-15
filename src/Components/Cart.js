import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';
import { mappers } from '../redux';
const { createOrder, deleteFromCart } = actions;
const { cartStateMapper, cartDispatchMapper } = mappers;

const Cart = ({ cart, user, createOrder, deleteFromCart })=> {
  return (
    <div>
      <ul className='list-group'>
        {
          cart.lineItems.map( lineItem => {
            return (
              <li className='list-group-item' key={ lineItem.id }>
                LineItemId: { lineItem.id }
                <br />
                ProductId:
                { lineItem.productId }
                <br />
                {
                  lineItem.product && (<strong>Name: { lineItem.product.name }</strong>)
                }
                <br />
                Quantity: 
                { lineItem.quantity }
                { ' ' }
                <button className='btn btn-danger pull-right' onClick={ ()=> deleteFromCart({ cart, user, lineItem }) }>Delete From Cart</button>
                <br style={ { clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        (cart.lineItems.length && !!user.id) ? (
          <div>
            <br />
          <button className='pull-right btn btn-primary' onClick={ ()=> createOrder({ cart, user })}> Create Order</button>
            <br style={ { clear: 'both' }} />
            </div>
        ): (null)
      }
      </div>
  );
};

export default connect(cartStateMapper, cartDispatchMapper )(Cart);
