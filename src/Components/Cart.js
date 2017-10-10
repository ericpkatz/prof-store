import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';
const { createOrder } = actions;

const Cart = ({ cart, user, createOrder })=> {
  return (
    <div>
      <ul className='list-group'>
        {
          cart.lineItems.map( lineItem => {
            return (
              <li className='list-group-item' key={ lineItem.id }>
                Id: { lineItem.id }
                { ' ' }
                ProductId: 
                { lineItem.productId }
                { ' ' }
                Quantity: 
                { lineItem.quantity }
                { ' ' }
                <br style={ { clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        cart.lineItems.length ? (
          <button className='pull-right' onClick={ ()=> createOrder({ cart, user })}> Create Order</button>
        ): (null)
      }
      </div>
  );
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    createOrder: ({ user, cart })=> {
      dispatch(createOrder({ user, cart, history }));
    }
  };
};

const mapStateToProps = ({ products, user, cart })=> {
  return {
    products,
    user,
    cart
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Cart);
