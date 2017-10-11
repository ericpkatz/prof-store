import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';
const { createOrder, deleteFromCart } = actions;

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
        cart.lineItems.length ? (
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

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    createOrder: ({ user, cart })=> {
      dispatch(createOrder({ user, cart, history }));
    },
    deleteFromCart: ({ cart, user, lineItem})=> {
      dispatch(deleteFromCart({ cart, user, lineItem }));
    }
  };
};

const mapStateToProps = ({ products, user, cart })=> {
  if(cart.lineItems){
    const productMap = products.reduce((memo, product)=> {
      memo[product.id] = product;
      return memo;
    }, {});
    const lineItems = cart.lineItems.reduce((memo, lineItem)=> {
      const product = productMap[lineItem.productId];
      if(!product){
        memo.push(lineItem);
      }
      else{
        memo.push(Object.assign({}, lineItem, { product }));
      }
      return memo;
    }, []);

    cart = Object.assign({}, cart, { lineItems });
  }
  return {
    products,
    user,
    cart
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Cart);
