import React from 'react';
import { connect } from 'react-redux';
import { actions, mappers } from '../redux';
const { ordersStateMapper, ordersDispatchMapper } = mappers;
const { addToCart } = actions;

const Orders = ({ orders, addToCart, cart, user })=> {
  return (
    <ul className='list-group'>
      {
        orders.map( order => {
          return (
            <li className='list-group-item' key={ order.id }>
              Order ID: { order.id }
              <br />
              Total: { `$${order.total.toFixed(2)}`}
              <br />
              Address: { order.address.formatted_address }
              <br style={ { clear: 'both' }} />
              <ul>
                {
                  order.lineItems.map( lineItem => {
                    if(!lineItem.product){
                      return null;
                    }
                    return (
                      <li key={ lineItem.id }>
                        Id: { lineItem.id }
                        <br />
                        Product: { lineItem.product.name }
                        <br />
                        <button className='btn btn-primary' onClick={ ()=> addToCart({ user, product: lineItem.product, cart })}>Buy Again</button>
                        <br />
                        Quanity: { lineItem.quantity }
                        <br />
                        Subtotal: { `$${lineItem.subTotal.toFixed(2)}` }
                      </li>
                    );
                  })
                }
              </ul>
            </li>
          )
        })
      }
    </ul>
  );
};


export default connect(ordersStateMapper, ordersDispatchMapper)(Orders);
